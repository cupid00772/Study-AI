import {
  getSupabaseClient,
  getResolvedCloudConfig,
  getCloudAuthState,
  getDeviceId,
} from './supabaseClient';
import { normalizeAssetPath, setAssetManifest } from './cloudAssetService';

export const SYNC_KEYS = {
  COURSES: 'tracker_courses',
  ASSIGNMENTS: 'tracker_assignments',
  EXAMS: 'tracker_exams',
  DELIVERABLES: 'tracker_deliverables',
  EECLASS: 'tracker_eeclass',
  TASKS: 'user_tasks',
  REMINDERS: 'user_reminders',
  STUDY_LOG: 'user_study_log',
  STICKY_NOTES: 'user_sticky_notes',
  GRADUATION_CREDITS: 'user_graduation_credits',
  ASSET_MANIFEST: 'asset_manifest',
};

const DOCS_CACHE_KEY = 'tc_cloud_docs_cache_v1';
const PENDING_WRITES_KEY = 'tc_cloud_pending_writes_v1';

const debounceTimers = new Map();
const statusListeners = new Set();
let realtimeChannel = null;

let syncStatus = {
  status: 'idle', // 'unconfigured' | 'idle' | 'syncing' | 'synced' | 'readonly' | 'offline' | 'error'
  lastSyncedAt: null,
  pendingCount: 0,
  error: null,
  canWrite: false,
  configured: false,
};

function emitStatus(patch) {
  syncStatus = { ...syncStatus, ...patch };
  statusListeners.forEach((cb) => {
    try { cb(syncStatus); } catch {}
  });
}

export function getSyncStatus() {
  return syncStatus;
}

export function subscribeSyncStatus(cb) {
  statusListeners.add(cb);
  cb(syncStatus);
  return () => statusListeners.delete(cb);
}

function readLocalCache() {
  try {
    const raw = localStorage.getItem(DOCS_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocalCache(key, payload) {
  try {
    const all = readLocalCache();
    all[key] = { payload, cachedAt: new Date().toISOString() };
    localStorage.setItem(DOCS_CACHE_KEY, JSON.stringify(all));
  } catch {}
}

export function getCachedCloudDocs() {
  const raw = readLocalCache();
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    if (v && v.payload !== undefined) out[k] = v.payload;
  }
  return out;
}

function readPendingWrites() {
  try {
    const raw = localStorage.getItem(PENDING_WRITES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePendingWrites(map) {
  try {
    localStorage.setItem(PENDING_WRITES_KEY, JSON.stringify(map));
  } catch {}
  emitStatus({ pendingCount: Object.keys(map).length });
}

function queuePendingWrite(key, payload) {
  const pending = readPendingWrites();
  pending[key] = { payload, queuedAt: new Date().toISOString() };
  savePendingWrites(pending);
}

function clearPendingWrite(key) {
  const pending = readPendingWrites();
  if (pending[key]) {
    delete pending[key];
    savePendingWrites(pending);
  }
}

// ============================================================================
// Domain Split & Smart Merge Helpers
// ============================================================================

export function splitTrackerToBuckets(tracker = {}) {
  const now = new Date().toISOString();
  return {
    [SYNC_KEYS.COURSES]: {
      academic_year: tracker.academic_year || '115',
      courses: Array.isArray(tracker.courses) ? tracker.courses : [],
      calendar_events: Array.isArray(tracker.calendar_events) ? tracker.calendar_events : [],
      updatedAt: tracker.last_updated || now,
    },
    [SYNC_KEYS.ASSIGNMENTS]: {
      assignments: Array.isArray(tracker.assignments) ? tracker.assignments : [],
      ignored_assignment_ids: Array.isArray(tracker.ignored_assignment_ids) ? tracker.ignored_assignment_ids : [],
      ignored_assignment_keys: Array.isArray(tracker.ignored_assignment_keys) ? tracker.ignored_assignment_keys : [],
      updatedAt: now,
    },
    [SYNC_KEYS.EXAMS]: {
      exams: Array.isArray(tracker.exams) ? tracker.exams : [],
      deletedIds: Array.isArray(tracker._deleted_exam_ids) ? tracker._deleted_exam_ids : [],
      updatedAt: now,
    },
    [SYNC_KEYS.DELIVERABLES]: {
      deliverables: Array.isArray(tracker.deliverables) ? tracker.deliverables : [],
      deletedIds: Array.isArray(tracker._deleted_deliverable_ids) ? tracker._deleted_deliverable_ids : [],
      updatedAt: now,
    },
    [SYNC_KEYS.EECLASS]: {
      last_updated: tracker.last_updated || now,
      announcements: Array.isArray(tracker.announcements) ? tracker.announcements : [],
      eeclass_dashboard: tracker.eeclass_dashboard || { recent_events: [], latest_announcements: [] },
    },
  };
}

function parseTimeMs(val) {
  if (!val) return 0;
  const ms = Date.parse(val);
  return Number.isFinite(ms) ? ms : 0;
}

export function mergeAssignmentsBucket(localBucket = {}, remoteBucket = {}) {
  const ignoredIds = new Set([
    ...(localBucket.ignored_assignment_ids || []),
    ...(remoteBucket.ignored_assignment_ids || []),
  ]);
  const ignoredKeys = new Set([
    ...(localBucket.ignored_assignment_keys || []),
    ...(remoteBucket.ignored_assignment_keys || []),
  ]);

  const byId = new Map();
  const ingest = (list, preferRemote) => {
    for (const item of list || []) {
      if (!item?.id) continue;
      const key = `${item.course}_${item.title}`;
      if (ignoredIds.has(item.id) || ignoredKeys.has(key)) continue;

      const existing = byId.get(item.id);
      if (!existing) {
        byId.set(item.id, item);
      } else {
        const tNew = parseTimeMs(item.updatedAt);
        const tOld = parseTimeMs(existing.updatedAt);
        if (tNew > tOld) {
          byId.set(item.id, item);
        } else if (tNew === tOld) {
          // If one side marked completed while timestamps are absent, respect remote when preferRemote
          if (preferRemote && item.status !== existing.status) {
            byId.set(item.id, item);
          } else {
            byId.set(item.id, { ...existing, ...item });
          }
        }
      }
    }
  };

  ingest(localBucket.assignments, false);
  ingest(remoteBucket.assignments, true);

  return {
    assignments: Array.from(byId.values()),
    ignored_assignment_ids: Array.from(ignoredIds),
    ignored_assignment_keys: Array.from(ignoredKeys),
    updatedAt: new Date().toISOString(),
  };
}

export function mergeDeliverablesBucket(localBucket = {}, remoteBucket = {}) {
  const deletedIds = new Set([
    ...(localBucket.deletedIds || []),
    ...(remoteBucket.deletedIds || []),
  ]);

  const byPath = new Map();
  const ingest = (list) => {
    for (const item of list || []) {
      if (!item) continue;
      if (item.id && deletedIds.has(item.id)) continue;
      const normPath = normalizeAssetPath(item.path || item.id);
      if (!normPath) continue;
      const existing = byPath.get(normPath);
      if (!existing) {
        byPath.set(normPath, { ...item, path: item.path ? normalizeAssetPath(item.path) : item.path });
      } else {
        const tNew = parseTimeMs(item.updatedAt);
        const tOld = parseTimeMs(existing.updatedAt);
        if (tNew >= tOld) {
          byPath.set(normPath, { ...existing, ...item, path: normalizeAssetPath(item.path || existing.path) });
        }
      }
    }
  };

  ingest(localBucket.deliverables);
  ingest(remoteBucket.deliverables);

  return {
    deliverables: Array.from(byPath.values()),
    deletedIds: Array.from(deletedIds).slice(-200),
    updatedAt: new Date().toISOString(),
  };
}

export function mergeKeyedItems(localItems = [], localDeleted = [], remoteItems = [], remoteDeleted = []) {
  const deleted = new Set([...(localDeleted || []), ...(remoteDeleted || [])]);
  const map = new Map();

  for (const item of localItems || []) {
    if (!item?.id || deleted.has(item.id)) continue;
    map.set(item.id, item);
  }
  for (const item of remoteItems || []) {
    if (!item?.id || deleted.has(item.id)) continue;
    const prev = map.get(item.id);
    if (!prev) {
      map.set(item.id, item);
    } else {
      const tRemote = parseTimeMs(item.updatedAt);
      const tLocal = parseTimeMs(prev.updatedAt);
      if (tRemote >= tLocal) {
        map.set(item.id, item);
      }
    }
  }

  return {
    items: Array.from(map.values()),
    deletedIds: Array.from(deleted).slice(-200),
  };
}

export function mergeStudyLogs(localLog = {}, remoteLog = {}) {
  const merged = {};
  const keys = new Set([...Object.keys(localLog || {}), ...Object.keys(remoteLog || {})]);
  for (const k of keys) {
    const lv = Number(localLog?.[k]) || 0;
    const rv = Number(remoteLog?.[k]) || 0;
    merged[k] = Math.max(lv, rv);
  }
  return merged;
}

export function mergeRemindersPayload(localPayload = {}, remotePayload = {}) {
  const tLocal = parseTimeMs(localPayload.updatedAt);
  const tRemote = parseTimeMs(remotePayload.updatedAt);

  const reminders = tRemote >= tLocal && Array.isArray(remotePayload.reminders) && remotePayload.reminders.length > 0
    ? remotePayload.reminders
    : (Array.isArray(localPayload.reminders) ? localPayload.reminders : (remotePayload.reminders || []));

  const completions = {
    ...(localPayload.completions || {}),
    ...(remotePayload.completions || {}),
  };

  return {
    reminders,
    completions,
    updatedAt: new Date(Math.max(tLocal, tRemote, Date.now())).toISOString(),
  };
}

export function assembleTrackerFromBuckets(baseTracker = {}, remoteDocs = {}, isElectronLocalFirst = false) {
  const localBuckets = splitTrackerToBuckets(baseTracker);
  const next = { ...baseTracker };

  // 1. Courses & calendar
  const rCourses = remoteDocs[SYNC_KEYS.COURSES];
  if (rCourses && Array.isArray(rCourses.courses) && rCourses.courses.length > 0) {
    if (!isElectronLocalFirst || parseTimeMs(rCourses.updatedAt) >= parseTimeMs(localBuckets[SYNC_KEYS.COURSES].updatedAt)) {
      next.academic_year = rCourses.academic_year || next.academic_year;
      next.courses = rCourses.courses;
      if (Array.isArray(rCourses.calendar_events) && rCourses.calendar_events.length > 0) {
        next.calendar_events = rCourses.calendar_events;
      }
    }
  }

  // 2. Assignments
  const rAssign = remoteDocs[SYNC_KEYS.ASSIGNMENTS];
  if (rAssign) {
    const mergedAssign = isElectronLocalFirst
      ? mergeAssignmentsBucket(localBuckets[SYNC_KEYS.ASSIGNMENTS], rAssign)
      : {
          assignments: Array.isArray(rAssign.assignments) ? rAssign.assignments : (next.assignments || []),
          ignored_assignment_ids: rAssign.ignored_assignment_ids || [],
          ignored_assignment_keys: rAssign.ignored_assignment_keys || [],
        };
    next.assignments = mergedAssign.assignments;
    next.ignored_assignment_ids = mergedAssign.ignored_assignment_ids;
    next.ignored_assignment_keys = mergedAssign.ignored_assignment_keys;
  }

  // 3. Exams
  const rExams = remoteDocs[SYNC_KEYS.EXAMS];
  if (rExams) {
    if (isElectronLocalFirst) {
      const merged = mergeKeyedItems(
        localBuckets[SYNC_KEYS.EXAMS].exams,
        localBuckets[SYNC_KEYS.EXAMS].deletedIds,
        rExams.exams || [],
        rExams.deletedIds || []
      );
      next.exams = merged.items;
      next._deleted_exam_ids = merged.deletedIds;
    } else if (Array.isArray(rExams.exams)) {
      next.exams = rExams.exams;
      next._deleted_exam_ids = rExams.deletedIds || [];
    }
  }

  // 4. Deliverables
  const rDel = remoteDocs[SYNC_KEYS.DELIVERABLES];
  if (rDel) {
    const mergedDel = isElectronLocalFirst
      ? mergeDeliverablesBucket(localBuckets[SYNC_KEYS.DELIVERABLES], rDel)
      : {
          deliverables: Array.isArray(rDel.deliverables) ? rDel.deliverables : (next.deliverables || []),
          deletedIds: rDel.deletedIds || [],
        };
    next.deliverables = mergedDel.deliverables;
    next._deleted_deliverable_ids = mergedDel.deletedIds;
  }

  // 5. EEClass dashboard & announcements
  const rEeclass = remoteDocs[SYNC_KEYS.EECLASS];
  if (rEeclass) {
    const tRemote = parseTimeMs(rEeclass.last_updated);
    const tLocal = parseTimeMs(baseTracker.last_updated);
    if (!isElectronLocalFirst || tRemote >= tLocal) {
      if (rEeclass.last_updated) next.last_updated = rEeclass.last_updated;
      if (Array.isArray(rEeclass.announcements)) next.announcements = rEeclass.announcements;
      if (rEeclass.eeclass_dashboard) next.eeclass_dashboard = rEeclass.eeclass_dashboard;
    }
  }

  return next;
}

// ============================================================================
// Remote Pull / Push / Realtime
// ============================================================================

export async function pullAllCloudDocs() {
  const cfg = getResolvedCloudConfig();
  if (!cfg.configured) {
    emitStatus({ status: 'unconfigured', configured: false, canWrite: false, error: null });
    return { success: false, unconfigured: true, docs: getCachedCloudDocs() };
  }

  const client = getSupabaseClient();
  const auth = await getCloudAuthState();
  emitStatus({ status: 'syncing', configured: true, canWrite: auth.canWrite, error: null });

  try {
    const { data, error } = await client
      .from('tc_sync_docs')
      .select('key, payload, version, updated_at, updated_by');

    if (error) {
      emitStatus({
        status: navigator.onLine ? 'error' : 'offline',
        error: error.message,
      });
      return { success: false, error: error.message, docs: getCachedCloudDocs() };
    }

    const docs = {};
    for (const row of data || []) {
      docs[row.key] = row.payload;
      writeLocalCache(row.key, row.payload);
      if (row.key === SYNC_KEYS.ASSET_MANIFEST) {
        setAssetManifest(row.payload);
      }
    }

    emitStatus({
      status: auth.canWrite ? 'synced' : 'readonly',
      lastSyncedAt: new Date().toISOString(),
      canWrite: auth.canWrite,
      configured: true,
      error: null,
    });

    return { success: true, docs, canWrite: auth.canWrite };
  } catch (err) {
    emitStatus({
      status: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'error',
      error: err?.message || '雲端拉取失敗',
    });
    return { success: false, error: err?.message, docs: getCachedCloudDocs() };
  }
}

async function performUpsert(key, payload) {
  const client = getSupabaseClient();
  if (!client) return { success: false, unconfigured: true };

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    queuePendingWrite(key, payload);
    emitStatus({ status: 'offline' });
    return { success: false, offline: true };
  }

  const auth = await getCloudAuthState();
  if (!auth.canWrite) {
    // Attempt write anyway only if user explicitly disabled RLS (Option 2); otherwise mark readonly cleanly
    const { error } = await client
      .from('tc_sync_docs')
      .upsert(
        {
          key,
          payload,
          updated_by: getDeviceId(),
        },
        { onConflict: 'key' }
      );
    if (error) {
      const isRls = /row-level security|permission|42501|unauthorized/i.test(error.message || '');
      if (isRls) {
        queuePendingWrite(key, payload);
        emitStatus({ status: 'readonly', canWrite: false, error: null });
        return { success: false, authRequired: true };
      }
      queuePendingWrite(key, payload);
      emitStatus({ status: 'error', error: error.message });
      return { success: false, error: error.message };
    }
    clearPendingWrite(key);
    emitStatus({ status: 'synced', lastSyncedAt: new Date().toISOString(), error: null });
    return { success: true };
  }

  emitStatus({ status: 'syncing', canWrite: true });
  const { error } = await client
    .from('tc_sync_docs')
    .upsert(
      {
        key,
        payload,
        updated_by: getDeviceId(),
      },
      { onConflict: 'key' }
    );

  if (error) {
    queuePendingWrite(key, payload);
    emitStatus({ status: 'error', error: error.message });
    return { success: false, error: error.message };
  }

  clearPendingWrite(key);
  emitStatus({ status: 'synced', lastSyncedAt: new Date().toISOString(), error: null, canWrite: true });
  return { success: true };
}

export function pushCloudDoc(key, payload, { immediate = false, delayMs = 550 } = {}) {
  writeLocalCache(key, payload);
  const cfg = getResolvedCloudConfig();
  if (!cfg.configured) return Promise.resolve({ success: false, unconfigured: true });

  if (debounceTimers.has(key)) {
    clearTimeout(debounceTimers.get(key));
    debounceTimers.delete(key);
  }

  if (immediate) {
    return performUpsert(key, payload);
  }

  return new Promise((resolve) => {
    const timer = setTimeout(async () => {
      debounceTimers.delete(key);
      const res = await performUpsert(key, payload);
      resolve(res);
    }, delayMs);
    debounceTimers.set(key, timer);
  });
}

export async function pushTrackerBuckets(tracker, { immediate = false } = {}) {
  const buckets = splitTrackerToBuckets(tracker);
  const results = await Promise.all(
    Object.entries(buckets).map(([k, v]) => pushCloudDoc(k, v, { immediate }))
  );
  const authRequired = results.some((r) => r?.authRequired);
  return { success: results.every((r) => r?.success), authRequired, results };
}

export async function flushPendingWrites() {
  const pending = readPendingWrites();
  const entries = Object.entries(pending);
  if (entries.length === 0) return { flushed: 0 };

  let flushed = 0;
  for (const [key, item] of entries) {
    const res = await performUpsert(key, item.payload);
    if (res.success) flushed++;
  }
  return { flushed, remaining: Object.keys(readPendingWrites()).length };
}

export function subscribeCloudRealtime(onDocChanged) {
  const client = getSupabaseClient();
  if (!client) return () => {};

  if (realtimeChannel) {
    try { client.removeChannel(realtimeChannel); } catch {}
    realtimeChannel = null;
  }

  const myDeviceId = getDeviceId();

  realtimeChannel = client
    .channel('tc-sync-docs-live')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tc_sync_docs' },
      (change) => {
        const row = change.new;
        if (!row?.key || !row?.payload) return;
        if (row.updated_by === myDeviceId) return; // Ignore echo from this device

        writeLocalCache(row.key, row.payload);
        if (row.key === SYNC_KEYS.ASSET_MANIFEST) {
          setAssetManifest(row.payload);
        }
        emitStatus({ lastSyncedAt: new Date().toISOString() });
        try {
          onDocChanged?.(row.key, row.payload, row);
        } catch (err) {
          console.error('Realtime handler error:', err);
        }
      }
    )
    .subscribe();

  const onOnline = () => {
    flushPendingWrites();
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('online', onOnline);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', onOnline);
    }
    if (realtimeChannel) {
      try { client.removeChannel(realtimeChannel); } catch {}
      realtimeChannel = null;
    }
  };
}

