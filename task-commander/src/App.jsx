import { useState, useEffect, useCallback, useMemo, useRef, Suspense, lazy } from 'react';
import DashboardHome from './components/DashboardHome';
import MobileBottomNav from './components/MobileBottomNav';
import TaskCommanderLogo from './components/TaskCommanderLogo';
import SlidingContainer from './components/SlidingContainer';
import ViewSkeleton from './components/ViewSkeleton';
import { useModalA11y } from './hooks/useModalA11y';
import defaultTracker from './data/defaultTracker.json';

// Lazy-load non-home routes & heavy modals to cut initial PWA bundle size
const TaskBoard = lazy(() => import('./components/TaskBoard'));
const CreateTaskModal = lazy(() => import('./components/CreateTaskModal'));
const CourseSchedule = lazy(() => import('./components/CourseSchedule'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const AssignmentsBoard = lazy(() => import('./components/AssignmentsBoard'));
const ExamsDashboard = lazy(() => import('./components/ExamsDashboard'));
const ExamArena = lazy(() => import('./components/ExamArena'));
const ArtifactVault = lazy(() => import('./components/ArtifactVault'));
const ArtifactViewerModal = lazy(() => import('./components/ArtifactViewerModal'));
const StickyNotesBoard = lazy(() => import('./components/StickyNotesBoard'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const GraduationCreditsModal = lazy(() => import('./components/GraduationCreditsModal'));
const CloudUnlockModal = lazy(() => import('./components/CloudUnlockModal'));
import {
  computeAcademicAlerts,
  getLocalDateKey,
} from './utils/academicUtils';
import {
  isTaskScheduledForDate,
  resetDailyTaskProgress,
  resetStaleDailyTasks,
} from './utils/taskScheduleUtils';
import {
  loadRuntimeCloudConfig,
  getCloudAuthState,
  subscribeCloudAuth,
  lockCloudWrite,
} from './services/supabaseClient';
import {
  SYNC_KEYS,
  pullAllCloudDocs,
  pushCloudDoc,
  pushTrackerBuckets,
  subscribeCloudRealtime,
  subscribeSyncStatus,
  getSyncStatus,
  getCachedCloudDocs,
  assembleTrackerFromBuckets,
  mergeStudyLogs,
  mergeRemindersPayload,
  mergeKeyedItems,
  flushPendingWrites,
} from './services/cloudSyncService';
import { subscribeAssetManifest } from './services/cloudAssetService';
import {
  getInitialFlashcardsStore,
  hydrateFlashcardsFromWorkspace,
  persistFlashcardsStore,
} from './services/flashcardStorageService';
import {
  computeFlashcardStats,
  mergeFlashcardsPayload,
} from './utils/flashcardUtils';
import {
  createAlertAlarmLoop,
  normalizeSoundConfig,
  resolveActiveSoundSpec,
} from './utils/alertSoundEngine';
import {
  Home,
  BookOpen,
  CheckSquare,
  Calendar,
  FolderGit2,
  ListTodo,
  StickyNote,
  Settings,
  Sun,
  Moon,
  Search,
  Pin,
  Minus,
  Square,
  Copy,
  X,
  BellRing,
  BellOff,
  Clock,
  Play,
  Volume2,
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen,
  Flame,
  Cloud,
  CloudOff,
  Lock,
  Unlock,
  Crosshair,
} from 'lucide-react';

const INITIAL_TASKS = [
  { id: '1', title: '每日英文單字或聽力複習', desc: '固定維持每日語感與閱讀速度', category: 'Daily', difficulty: 'Easy', completed: false },
  { id: '2', title: '整理本週課堂重點筆記', desc: '將作業系統與資料結構上課重點整理進 Study_Materials', category: 'Main', difficulty: 'Medium', completed: false, relatedCourse: '資料與檔案結構' },
  { id: '3', title: '練習台聯大微積分歷屆試題', desc: '完成一回計時演練並檢討錯題', category: 'Challenge', difficulty: 'Hard', completed: false, relatedCourse: '台聯大/台大轉學考' },
];

const DEFAULT_REMINDERS = [
  '吃感冒藥 (早/中/晚)',
  '記得帶水壺',
];

const DEFAULT_APP_CONFIG = {
  minimizeToTray: true,
  autoLaunch: true,
  autoSyncEnabled: true,
  autoSyncIntervalHours: 4,
  autoWatchDeliverables: true,
  alerts: {
    enabled: true,
    assignmentLeadDays: 3,
    includeOverdue: true,
    examLeadDays: 7,
    studyRemindersEnabled: true,
    dailyTriggerTimes: ['09:00', '20:00'],
    triggerOnStartup: true,
    showPopupWindow: true,
    playAlertSound: true,
    focusAlarmEnabled: true,
    showWindowsToast: true,
    snoozeMinutes: 30,
    dailyStudyGoalMinutes: 60,
    soundConfig: {
      volume: 0.75,
      repeatIntervalMs: 2500,
      shakeEnabled: true,
      separateCriticalSound: false,
      normalSound: { type: 'preset', id: 'classic-chime', label: '清脆警報（經典預設）' },
      criticalSound: { type: 'preset', id: 'urgent-radar', label: '雷達急促警示' },
      focusSound: { type: 'preset', id: 'digital-alarm', label: '經典電子鬧鐘' },
    },
  },
};

const TODAY_KEY = 'wt_last_refresh_date';

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function getInitialTasks() {
  const storedTasks = readStorage('wt_tasks', INITIAL_TASKS);
  const safeTasks = Array.isArray(storedTasks) ? storedTasks : INITIAL_TASKS;
  const today = new Date().toDateString();

  if (localStorage.getItem(TODAY_KEY) === today) {
    return resetStaleDailyTasks(safeTasks);
  }
  try { localStorage.setItem(TODAY_KEY, today); } catch {}
  return safeTasks.map(resetDailyTaskProgress);
}

function getInitialTracker(isElectron) {
  if (!isElectron) {
    const cached = getCachedCloudDocs();
    if (Object.keys(cached).length > 0) {
      return assembleTrackerFromBuckets(defaultTracker, cached, false);
    }
  }
  return defaultTracker;
}

const TAB_TITLES = {
  dashboard: '總覽首頁',
  assignments: '作業管理',
  exams: '考試日程',
  arena: '刷題戰情室',
  missions: '每日任務',
  notes: '桌面便條',
  vault: 'AI 成果庫',
  courses: '科目與課表',
};

const VALID_TABS = new Set(Object.keys(TAB_TITLES));

function readTabFromHash() {
  if (typeof window === 'undefined') return 'dashboard';
  const raw = window.location.hash.replace(/^#\/?/, '').split(/[/?]/)[0];
  return VALID_TABS.has(raw) ? raw : 'dashboard';
}

function readReducedMotionPref() {
  try {
    const saved = localStorage.getItem('wt_reduced_motion');
    if (saved === 'on' || saved === 'off' || saved === 'auto') return saved;
  } catch {}
  return 'auto';
}

function App() {
  const isElectron = Boolean(window.electronAPI?.isElectron);

  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280));
  const isMobile = !isElectron && viewportWidth < 768;
  const isTablet = !isElectron && viewportWidth >= 768 && viewportWidth < 1024;

  const [activeTab, setActiveTabState] = useState(readTabFromHash);
  const [hasMountedArena, setHasMountedArena] = useState(() => readTabFromHash() === 'arena');
  const [arenaSessionActive, setArenaSessionActive] = useState(false);
  const [arenaLaunchTarget, setArenaLaunchTarget] = useState(null);
  const [flashcardsStore, setFlashcardsStore] = useState(() => getInitialFlashcardsStore());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (!isElectron && typeof window !== 'undefined' && window.innerWidth < 1024) return true;
    return localStorage.getItem('wt_sidebar_collapsed') === 'true';
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('wt_theme') || 'light');
  const [reducedMotionPref, setReducedMotionPref] = useState(readReducedMotionPref);
  const [osReducedMotion, setOsReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const isReducedMotion = reducedMotionPref === 'on'
    || (reducedMotionPref === 'auto' && !isElectron && osReducedMotion);

  const setActiveTab = useCallback((nextTabOrUpdater) => {
    setActiveTabState((prev) => {
      const next = typeof nextTabOrUpdater === 'function' ? nextTabOrUpdater(prev) : nextTabOrUpdater;
      const safe = VALID_TABS.has(next) ? next : 'dashboard';
      if (safe === 'arena') setHasMountedArena(true);
      if (typeof window !== 'undefined') {
        const targetHash = `#/${safe}`;
        if (window.location.hash !== targetHash) {
          try {
            window.history.pushState(null, '', targetHash);
          } catch {
            window.location.hash = targetHash;
          }
        }
      }
      return safe;
    });
  }, []);
  const [trackerData, setTrackerData] = useState(() => getInitialTracker(isElectron));
  const [appConfig, setAppConfig] = useState(DEFAULT_APP_CONFIG);

  const [tasks, setTasks] = useState(getInitialTasks);
  const [deletedTaskIds, setDeletedTaskIds] = useState(() => readStorage('wt_tasks_deleted', []));
  const [reminders, setReminders] = useState(() => {
    const saved = readStorage('wt_reminders', DEFAULT_REMINDERS);
    return Array.isArray(saved) ? saved : DEFAULT_REMINDERS;
  });
  const [reminderCompletions, setReminderCompletions] = useState(() => {
    const saved = readStorage('wt_reminder_completions', {});
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  });

  // Study Focus Timer & Daily Log
  const todayIso = getLocalDateKey();
  const [studyLog, setStudyLog] = useState(() => readStorage('wt_study_log', {}));
  const studyMinutesToday = Number(studyLog[todayIso] || 0);
  const [focusState, setFocusState] = useState({
    presetMinutes: 25,
    lastFocusPresetMinutes: 25,
    secondsLeft: 25 * 60,
    isRunning: false,
    mode: 'focus', // 'focus' | 'break'
    sessionId: 0,
  });
  const [webFocusAlarmEnabled, setWebFocusAlarmEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('wt_focus_alarm_enabled');
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });
  const [focusAlarmModal, setFocusAlarmModal] = useState(null);
  const focusSecondsAccRef = useRef(0);
  const focusStateRef = useRef(focusState);
  const focusAlarmLoopRef = useRef(null);
  const appConfigRef = useRef(appConfig);
  const studyMinutesTodayRef = useRef(studyMinutesToday);

  // Cloud Sync & Auth States
  const [cloudStatus, setCloudStatus] = useState(getSyncStatus);
  const [cloudAuth, setCloudAuth] = useState({ configured: false, canWrite: false, email: '' });
  const [assetManifestVersion, setAssetManifestVersion] = useState(0);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

  // Modals & Overlays
  const [selectedFileForViewer, setSelectedFileForViewer] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState(null);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [globalToast, setGlobalToast] = useState(null);
  const toastTimerRef = useRef(null);
  const mainScrollRef = useRef(null);

  // Window & Sync States
  const [isPinned, setIsPinned] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeStickyCount, setActiveStickyCount] = useState(0);

  // Latest state refs for safe async cloud merging (zero stale closure, zero echo loop)
  const trackerRef = useRef(trackerData);
  const tasksRef = useRef(tasks);
  const deletedTaskIdsRef = useRef(deletedTaskIds);
  const remindersRef = useRef(reminders);
  const reminderCompletionsRef = useRef(reminderCompletions);
  const studyLogRef = useRef(studyLog);
  const flashcardsStoreRef = useRef(flashcardsStore);
  const hasPromptedUnlockRef = useRef(false);

  useEffect(() => { trackerRef.current = trackerData; }, [trackerData]);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);
  useEffect(() => { deletedTaskIdsRef.current = deletedTaskIds; }, [deletedTaskIds]);
  useEffect(() => { remindersRef.current = reminders; }, [reminders]);
  useEffect(() => { reminderCompletionsRef.current = reminderCompletions; }, [reminderCompletions]);
  useEffect(() => { studyLogRef.current = studyLog; }, [studyLog]);
  useEffect(() => { flashcardsStoreRef.current = flashcardsStore; }, [flashcardsStore]);
  useEffect(() => { focusStateRef.current = focusState; }, [focusState]);
  useEffect(() => { appConfigRef.current = appConfig; }, [appConfig]);
  useEffect(() => { studyMinutesTodayRef.current = studyMinutesToday; }, [studyMinutesToday]);

  const todayDateStr = new Date().toDateString();

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setGlobalToast(null);
  }, []);

  const showToast = useCallback((msg, options = {}) => {
    if (!msg) return;
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    const toastObj = typeof msg === 'string'
      ? {
          id: Date.now() + Math.random(),
          message: msg,
          tone: options.tone || 'default',
          actionLabel: options.actionLabel || '',
          onAction: options.onAction || null,
        }
      : {
          id: Date.now() + Math.random(),
          tone: 'default',
          ...msg,
        };
    const durationMs = options.durationMs ?? (toastObj.actionLabel ? 5200 : 3400);
    setGlobalToast(toastObj);
    toastTimerRef.current = window.setTimeout(() => {
      setGlobalToast((cur) => (cur?.id === toastObj.id ? null : cur));
      toastTimerRef.current = null;
    }, durationMs);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
  }, []);

  // Hash & browser Back/Forward deep-link sync
  useEffect(() => {
    const syncFromHash = () => {
      const next = readTabFromHash();
      setActiveTabState(next);
      if (next === 'arena') setHasMountedArena(true);
    };
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, []);

  // Reduced motion preference sync
  useEffect(() => {
    try { localStorage.setItem('wt_reduced_motion', reducedMotionPref); } catch {}
    const attrVal = reducedMotionPref === 'on' ? 'true' : reducedMotionPref === 'off' ? 'false' : 'auto';
    document.documentElement.setAttribute('data-reduced-motion', attrVal);
  }, [reducedMotionPref]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setOsReducedMotion(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const handleRequireUnlock = useCallback(() => {
    setIsUnlockModalOpen(true);
    if (!hasPromptedUnlockRef.current) {
      hasPromptedUnlockRef.current = true;
      showToast('目前為公開唯讀模式，輸入編輯密碼一次即可同步寫入雲端');
    }
  }, [showToast]);

  // Viewport & platform classes on <html>
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const rootEl = document.documentElement;
    rootEl.classList.toggle('is-electron', isElectron);
    rootEl.classList.toggle('is-web', !isElectron);
    rootEl.classList.toggle('is-mobile', isMobile);
    rootEl.classList.toggle('is-tablet', isTablet);
  }, [isElectron, isMobile, isTablet]);

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('wt_theme', theme); } catch {}
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem('wt_sidebar_collapsed', String(sidebarCollapsed)); } catch {}
  }, [sidebarCollapsed]);

  // Local persistence for tasks, reminders, study log
  useEffect(() => {
    try {
      localStorage.setItem('wt_tasks', JSON.stringify(tasks));
      localStorage.setItem('wt_tasks_deleted', JSON.stringify(deletedTaskIds));
      localStorage.setItem('wt_reminders', JSON.stringify(reminders));
      localStorage.setItem('wt_reminder_completions', JSON.stringify(reminderCompletions));
      localStorage.setItem('wt_study_log', JSON.stringify(studyLog));
    } catch {}
  }, [tasks, deletedTaskIds, reminders, reminderCompletions, studyLog]);

  // Helper: apply one remote cloud doc (used by Realtime subscription & startup pull)
  const applyRemoteDoc = useCallback((key, payload) => {
    if (!payload) return;

    if (
      key === SYNC_KEYS.COURSES
      || key === SYNC_KEYS.ASSIGNMENTS
      || key === SYNC_KEYS.EXAMS
      || key === SYNC_KEYS.DELIVERABLES
      || key === SYNC_KEYS.EECLASS
    ) {
      const merged = assembleTrackerFromBuckets(trackerRef.current, { [key]: payload }, isElectron);
      setTrackerData(merged);
      if (isElectron && window.electronAPI?.saveTrackerData) {
        window.electronAPI.saveTrackerData(merged);
      }
      return;
    }

    if (key === SYNC_KEYS.TASKS) {
      const merged = mergeKeyedItems(
        tasksRef.current,
        deletedTaskIdsRef.current,
        payload.items || [],
        payload.deletedIds || []
      );
      setTasks(resetStaleDailyTasks(merged.items));
      setDeletedTaskIds(merged.deletedIds);
      return;
    }

    if (key === SYNC_KEYS.REMINDERS) {
      const merged = mergeRemindersPayload(
        { reminders: remindersRef.current, completions: reminderCompletionsRef.current },
        payload
      );
      setReminders(merged.reminders);
      setReminderCompletions(merged.completions);
      return;
    }

    if (key === SYNC_KEYS.STUDY_LOG) {
      const merged = mergeStudyLogs(studyLogRef.current, payload.log || payload);
      setStudyLog(merged);
      return;
    }

    if (key === SYNC_KEYS.STICKY_NOTES) {
      const localNotes = readStorage('wt_sticky_notes', []);
      const localDeleted = readStorage('wt_sticky_notes_deleted', []);
      const merged = mergeKeyedItems(
        localNotes,
        localDeleted,
        payload.notes || [],
        payload.deletedIds || []
      );
      try {
        localStorage.setItem('wt_sticky_notes', JSON.stringify(merged.items));
        localStorage.setItem('wt_sticky_notes_deleted', JSON.stringify(merged.deletedIds));
      } catch {}
      window.dispatchEvent(new CustomEvent('tc-cloud-sticky-updated', {
        detail: { notes: merged.items, deletedIds: merged.deletedIds },
      }));
      return;
    }

    if (key === SYNC_KEYS.GRADUATION_CREDITS && Array.isArray(payload.items)) {
      try {
        localStorage.setItem('wt_courses_v2', JSON.stringify(payload.items));
      } catch {}
      window.dispatchEvent(new CustomEvent('tc-cloud-credits-updated', {
        detail: { items: payload.items },
      }));
      return;
    }

    if (key === SYNC_KEYS.FLASHCARDS) {
      const merged = mergeFlashcardsPayload(flashcardsStoreRef.current, payload);
      setFlashcardsStore(merged);
      try {
        localStorage.setItem('tc_flashcards_store_v1', JSON.stringify(merged));
      } catch {}
      if (isElectron && window.electronAPI?.writeFileContent) {
        window.electronAPI.writeFileContent({
          relativePath: 'Review_Dashboard/flashcards_store.json',
          content: JSON.stringify(merged, null, 2),
        }).catch(() => {});
      }
      return;
    }

    if (key === SYNC_KEYS.ASSET_MANIFEST) {
      setAssetManifestVersion((v) => v + 1);
    }
  }, [isElectron]);

  // Full bidirectional cloud sync (startup + manual refresh)
  const syncFromCloud = useCallback(async ({ manual = false, localTrackerOverride = null } = {}) => {
    await loadRuntimeCloudConfig();
    const auth = await getCloudAuthState();
    setCloudAuth(auth);

    if (!auth.configured) {
      if (manual) showToast('尚未設定 Supabase 連線資訊，請於「設定 → 雲端同步」中設定');
      return { success: false, unconfigured: true };
    }

    const res = await pullAllCloudDocs();
    if (!res.success) {
      if (manual) showToast(`雲端同步失敗：${res.error || '請檢查網路連線'}`);
      return res;
    }

    const docs = res.docs || {};
    const baseTracker = localTrackerOverride || trackerRef.current;

    // 1. Merge Tracker
    const hasRemoteTracker = Boolean(
      docs[SYNC_KEYS.COURSES] || docs[SYNC_KEYS.ASSIGNMENTS] || docs[SYNC_KEYS.EXAMS]
      || docs[SYNC_KEYS.DELIVERABLES] || docs[SYNC_KEYS.EECLASS]
    );
    let mergedTracker = baseTracker;
    if (hasRemoteTracker) {
      mergedTracker = assembleTrackerFromBuckets(baseTracker, docs, isElectron);
      setTrackerData(mergedTracker);
      if (isElectron && window.electronAPI?.saveTrackerData) {
        await window.electronAPI.saveTrackerData(mergedTracker);
      }
    }

    // 2. Merge User Buckets
    if (docs[SYNC_KEYS.TASKS]) applyRemoteDoc(SYNC_KEYS.TASKS, docs[SYNC_KEYS.TASKS]);
    if (docs[SYNC_KEYS.REMINDERS]) applyRemoteDoc(SYNC_KEYS.REMINDERS, docs[SYNC_KEYS.REMINDERS]);
    if (docs[SYNC_KEYS.STUDY_LOG]) applyRemoteDoc(SYNC_KEYS.STUDY_LOG, docs[SYNC_KEYS.STUDY_LOG]);
    if (docs[SYNC_KEYS.STICKY_NOTES]) applyRemoteDoc(SYNC_KEYS.STICKY_NOTES, docs[SYNC_KEYS.STICKY_NOTES]);
    if (docs[SYNC_KEYS.GRADUATION_CREDITS]) applyRemoteDoc(SYNC_KEYS.GRADUATION_CREDITS, docs[SYNC_KEYS.GRADUATION_CREDITS]);
    if (docs[SYNC_KEYS.FLASHCARDS]) applyRemoteDoc(SYNC_KEYS.FLASHCARDS, docs[SYNC_KEYS.FLASHCARDS]);
    if (docs[SYNC_KEYS.ASSET_MANIFEST]) setAssetManifestVersion((v) => v + 1);

    // 3. On Electron with write permission: push back merged local data (initial seed or newer AI/crawler updates)
    if (isElectron && auth.canWrite) {
      await pushTrackerBuckets(mergedTracker, { immediate: true });
      if (!docs[SYNC_KEYS.TASKS]) {
        await pushCloudDoc(SYNC_KEYS.TASKS, { items: tasksRef.current, deletedIds: deletedTaskIdsRef.current, updatedAt: new Date().toISOString() }, { immediate: true });
      }
      if (!docs[SYNC_KEYS.REMINDERS]) {
        await pushCloudDoc(SYNC_KEYS.REMINDERS, { reminders: remindersRef.current, completions: reminderCompletionsRef.current, updatedAt: new Date().toISOString() }, { immediate: true });
      }
      if (!docs[SYNC_KEYS.STUDY_LOG] && Object.keys(studyLogRef.current || {}).length > 0) {
        await pushCloudDoc(SYNC_KEYS.STUDY_LOG, { log: studyLogRef.current, updatedAt: new Date().toISOString() }, { immediate: true });
      }
      const localStickies = readStorage('wt_sticky_notes', null);
      if (!docs[SYNC_KEYS.STICKY_NOTES] && Array.isArray(localStickies)) {
        await pushCloudDoc(SYNC_KEYS.STICKY_NOTES, { notes: localStickies, deletedIds: readStorage('wt_sticky_notes_deleted', []), updatedAt: new Date().toISOString() }, { immediate: true });
      }
      const localCredits = readStorage('wt_courses_v2', null);
      if (!docs[SYNC_KEYS.GRADUATION_CREDITS] && Array.isArray(localCredits)) {
        await pushCloudDoc(SYNC_KEYS.GRADUATION_CREDITS, { items: localCredits, updatedAt: new Date().toISOString() }, { immediate: true });
      }
      if (!docs[SYNC_KEYS.FLASHCARDS] && (flashcardsStoreRef.current?.cards?.length || 0) > 0) {
        await pushCloudDoc(SYNC_KEYS.FLASHCARDS, flashcardsStoreRef.current, { immediate: true });
      }
    }

    if (auth.canWrite) {
      await flushPendingWrites();
    }

    if (manual) showToast('雲端資料已同步至最新狀態');
    return { success: true };
  }, [isElectron, applyRemoteDoc, showToast]);

  // Subscribe to cloud sync status, auth state, and asset manifest
  useEffect(() => {
    const unsubStatus = subscribeSyncStatus(setCloudStatus);
    const unsubAuth = subscribeCloudAuth((nextAuth) => {
      setCloudAuth(nextAuth);
      if (nextAuth.canWrite) {
        flushPendingWrites();
      }
    });
    const unsubManifest = subscribeAssetManifest(() => setAssetManifestVersion((v) => v + 1));
    return () => {
      unsubStatus();
      unsubAuth();
      unsubManifest();
    };
  }, []);

  // Cross-window storage sync (from DesktopDailyWidget & DesktopStickyNote) -> also push to cloud
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'wt_tasks' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setTasks(parsed);
          pushCloudDoc(SYNC_KEYS.TASKS, { items: parsed, deletedIds: deletedTaskIdsRef.current, updatedAt: new Date().toISOString() });
        } catch {}
      }
      if (e.key === 'wt_reminder_completions' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setReminderCompletions(parsed);
          pushCloudDoc(SYNC_KEYS.REMINDERS, { reminders: remindersRef.current, completions: parsed, updatedAt: new Date().toISOString() });
        } catch {}
      }
      if (e.key === 'wt_sticky_notes' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const normalized = Array.isArray(parsed)
            ? parsed.map((n) => ({
                ...n,
                updatedAt: n.updatedAt && /^\d{4}-\d{2}-\d{2}T/.test(n.updatedAt) ? n.updatedAt : new Date().toISOString(),
              }))
            : [];
          pushCloudDoc(SYNC_KEYS.STICKY_NOTES, {
            notes: normalized,
            deletedIds: readStorage('wt_sticky_notes_deleted', []),
            updatedAt: new Date().toISOString(),
          });
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const focusAlarmEnabled = isElectron
    ? appConfig?.alerts?.focusAlarmEnabled !== false
    : webFocusAlarmEnabled;
  const focusAlarmEnabledRef = useRef(focusAlarmEnabled);
  useEffect(() => { focusAlarmEnabledRef.current = focusAlarmEnabled; }, [focusAlarmEnabled]);

  const stopInAppFocusAlarm = useCallback(() => {
    if (focusAlarmLoopRef.current) {
      focusAlarmLoopRef.current.stop();
      focusAlarmLoopRef.current = null;
    }
    setFocusAlarmModal(null);
  }, []);

  const triggerFocusCompletionAlarm = useCallback(async ({
    kind = 'focus_complete',
    minutes = 25,
    nextPresetMinutes = 25,
    studiedMinutesOverride = null,
    forceSound = false,
  } = {}) => {
    const cfg = appConfigRef.current?.alerts || DEFAULT_APP_CONFIG.alerts;
    const alarmOn = forceSound ? true : focusAlarmEnabledRef.current;
    const goalMinutes = Number(cfg.dailyStudyGoalMinutes || 60);
    const studiedMinutes = studiedMinutesOverride ?? studyMinutesTodayRef.current;

    if (isElectron && window.electronAPI?.triggerFocusAlarm) {
      const showPopup = cfg.showPopupWindow !== false;
      const res = await window.electronAPI.triggerFocusAlarm({
        kind,
        minutes,
        nextPresetMinutes,
        studyMinutesToday: studiedMinutes,
        goalMinutes,
        playSound: alarmOn,
        showPopup,
      });
      if (res?.popupShown) {
        return;
      }
    } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(
          kind === 'break_complete' ? '休息時間結束！' : '專注讀書計時完成！',
          {
            body: kind === 'break_complete'
              ? `已完成 ${minutes} 分鐘休息，準備回到專注節奏！`
              : `已完成 ${minutes} 分鐘專注，適度休息 5 分鐘再繼續衝刺。`,
          }
        );
      } catch {}
    }

    setFocusAlarmModal({
      kind,
      minutes,
      nextPresetMinutes,
      studiedMinutes,
      goalMinutes,
      playInAppLoop: alarmOn,
      triggeredAt: Date.now(),
    });
  }, [isElectron]);

  // Continuous in-app focus alarm loop (Web/Mobile or when Electron popup is disabled)
  useEffect(() => {
    if (!focusAlarmModal?.playInAppLoop) {
      if (focusAlarmLoopRef.current) {
        focusAlarmLoopRef.current.stop();
        focusAlarmLoopRef.current = null;
      }
      return undefined;
    }
    const sc = normalizeSoundConfig(appConfigRef.current?.alerts?.soundConfig);
    const soundSpec = resolveActiveSoundSpec(sc, true, focusAlarmModal.kind);
    const loop = createAlertAlarmLoop({
      soundSpec,
      isCritical: true,
      volume: sc.volume,
      repeatIntervalMs: sc.repeatIntervalMs,
      playSound: true,
    });
    focusAlarmLoopRef.current = loop;
    return () => {
      loop.stop();
      if (focusAlarmLoopRef.current === loop) focusAlarmLoopRef.current = null;
    };
  }, [focusAlarmModal]);

  // Pomodoro Focus & Break Countdown Effect (wall-clock drift-free, side-effects outside state updater)
  useEffect(() => {
    if (!focusState.isRunning) return undefined;
    const startedAt = Date.now();
    const initialSecondsLeft = focusStateRef.current.secondsLeft;
    const endAt = startedAt + initialSecondsLeft * 1000;
    let lastCheckedAt = startedAt;

    const timer = window.setInterval(() => {
      const cur = focusStateRef.current;
      if (!cur.isRunning) return;

      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endAt - now) / 1000));
      const wholeSec = Math.floor(Math.max(0, now - lastCheckedAt) / 1000);
      if (wholeSec > 0) {
        lastCheckedAt += wholeSec * 1000;
      }

      let nextStudied = studyMinutesTodayRef.current;
      if (cur.mode !== 'break' && wholeSec > 0) {
        const creditedSec = Math.min(wholeSec, cur.secondsLeft);
        focusSecondsAccRef.current += creditedSec;
        const addedMins = Math.floor(focusSecondsAccRef.current / 60);
        if (addedMins > 0) {
          focusSecondsAccRef.current -= addedMins * 60;
          const key = getLocalDateKey();
          nextStudied = (Number(studyLogRef.current?.[key]) || 0) + addedMins;
          setStudyLog((prev) => {
            const next = { ...prev, [key]: (Number(prev[key]) || 0) + addedMins };
            pushCloudDoc(SYNC_KEYS.STUDY_LOG, { log: next, updatedAt: new Date().toISOString() });
            return next;
          });
        }
      }

      if (remaining <= 0) {
        focusSecondsAccRef.current = 0;
        const completedKind = cur.mode === 'break' ? 'break_complete' : 'focus_complete';
        const completedMinutes = cur.presetMinutes;
        const nextFocusMins = cur.lastFocusPresetMinutes || 25;

        setFocusState((prev) => ({
          presetMinutes: nextFocusMins,
          lastFocusPresetMinutes: nextFocusMins,
          secondsLeft: nextFocusMins * 60,
          isRunning: false,
          mode: 'focus',
          sessionId: prev.sessionId + 1,
        }));

        triggerFocusCompletionAlarm({
          kind: completedKind,
          minutes: completedMinutes,
          nextPresetMinutes: nextFocusMins,
          studiedMinutesOverride: nextStudied,
        });
        return;
      }

      if (remaining !== cur.secondsLeft) {
        setFocusState((prev) => ({
          ...prev,
          secondsLeft: remaining,
        }));
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, [focusState.isRunning, focusState.sessionId, triggerFocusCompletionAlarm]);

  const handleStartFocus = useCallback((customMinutes) => {
    stopInAppFocusAlarm();
    if (!isElectron && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    setFocusState((prev) => {
      if (typeof customMinutes === 'number' && customMinutes > 0) {
        focusSecondsAccRef.current = 0;
        return {
          presetMinutes: customMinutes,
          lastFocusPresetMinutes: customMinutes,
          secondsLeft: customMinutes * 60,
          isRunning: true,
          mode: 'focus',
          sessionId: prev.sessionId + 1,
        };
      }
      return { ...prev, isRunning: true, sessionId: prev.sessionId + 1 };
    });
  }, [isElectron, stopInAppFocusAlarm]);

  const handleStartBreak = useCallback((breakMinutes = 5) => {
    stopInAppFocusAlarm();
    focusSecondsAccRef.current = 0;
    const mins = Math.max(1, Number(breakMinutes) || 5);
    setFocusState((prev) => ({
      presetMinutes: mins,
      lastFocusPresetMinutes: prev.mode === 'focus' ? prev.presetMinutes : (prev.lastFocusPresetMinutes || 25),
      secondsLeft: mins * 60,
      isRunning: true,
      mode: 'break',
      sessionId: prev.sessionId + 1,
    }));
  }, [stopInAppFocusAlarm]);

  const handlePauseFocus = useCallback(() => {
    setFocusState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const handleResetFocus = useCallback(() => {
    stopInAppFocusAlarm();
    focusSecondsAccRef.current = 0;
    setFocusState((prev) => ({
      ...prev,
      isRunning: false,
      secondsLeft: prev.presetMinutes * 60,
      sessionId: prev.sessionId + 1,
    }));
  }, [stopInAppFocusAlarm]);

  const handleChangePreset = useCallback((mins, mode = 'focus') => {
    stopInAppFocusAlarm();
    focusSecondsAccRef.current = 0;
    setFocusState((prev) => ({
      presetMinutes: mins,
      lastFocusPresetMinutes: mode === 'focus' ? mins : (prev.lastFocusPresetMinutes || 25),
      secondsLeft: mins * 60,
      isRunning: false,
      mode,
      sessionId: prev.sessionId + 1,
    }));
  }, [stopInAppFocusAlarm]);

  const handleToggleFocusAlarm = useCallback(async () => {
    const nextVal = !focusAlarmEnabled;
    if (isElectron) {
      const nextCfg = {
        ...appConfigRef.current,
        alerts: {
          ...(appConfigRef.current?.alerts || DEFAULT_APP_CONFIG.alerts),
          focusAlarmEnabled: nextVal,
        },
      };
      setAppConfig(nextCfg);
      if (window.electronAPI?.saveAppConfig) {
        const saved = await window.electronAPI.saveAppConfig(nextCfg);
        if (saved) setAppConfig(saved);
      }
    } else {
      setWebFocusAlarmEnabled(nextVal);
      try { localStorage.setItem('wt_focus_alarm_enabled', String(nextVal)); } catch {}
    }
    showToast(nextVal ? '已開啟專注結束鬧鐘響鈴' : '已將專注結束鬧鐘設為靜音');
  }, [focusAlarmEnabled, isElectron, showToast]);

  const handleTestFocusAlarm = useCallback(() => {
    triggerFocusCompletionAlarm({
      kind: focusStateRef.current.mode === 'break' ? 'break_complete' : 'focus_complete',
      minutes: focusStateRef.current.presetMinutes || 25,
      nextPresetMinutes: focusStateRef.current.lastFocusPresetMinutes || 25,
      forceSound: true,
    });
  }, [triggerFocusCompletionAlarm]);

  // Sync live study & pending daily task status to Electron main alert engine
  useEffect(() => {
    if (!window.electronAPI?.updateStudyState) return;
    const pendingDaily = tasks
      .filter((t) => t.category === 'Daily' && isTaskScheduledForDate(t) && !t.completed)
      .map((t) => t.title);
    window.electronAPI.updateStudyState({
      studyMinutesToday,
      dailyStudyGoalMinutes: appConfig?.alerts?.dailyStudyGoalMinutes || 60,
      pendingDailyTasks: pendingDaily,
      isFocusActive: focusState.isRunning,
    });
  }, [studyMinutesToday, tasks, focusState.isRunning, appConfig?.alerts?.dailyStudyGoalMinutes]);

  // Load initial Electron states, subscribe to IPC & start Cloud Sync + Realtime
  useEffect(() => {
    let unsubRealtime = () => {};

    async function init() {
      let loadedLocalTracker = null;
      if (window.electronAPI?.getTrackerData) {
        const data = await window.electronAPI.getTrackerData();
        if (data) {
          loadedLocalTracker = data;
          setTrackerData(data);
        }
      }
      if (window.electronAPI?.getAppConfig) {
        const cfg = await window.electronAPI.getAppConfig();
        if (cfg) setAppConfig(cfg);
      }
      if (window.electronAPI?.isWindowPinned) {
        setIsPinned(!!(await window.electronAPI.isWindowPinned()));
      }
      if (window.electronAPI?.isWindowMaximized) {
        setIsMaximized(!!(await window.electronAPI.isWindowMaximized()));
      }
      if (window.electronAPI?.getActiveStickyIds) {
        const ids = await window.electronAPI.getActiveStickyIds();
        if (Array.isArray(ids)) setActiveStickyCount(ids.length);
      }

      // 載入本機閃卡庫與 Active_Recall_Flashcards.md（在雲端合併前先取得本機狀態）
      const hydrated = await hydrateFlashcardsFromWorkspace({
        isElectron,
        currentStore: flashcardsStoreRef.current,
      });
      if (hydrated?.store) {
        flashcardsStoreRef.current = hydrated.store;
        setFlashcardsStore(hydrated.store);
      }

      // 啟動雲端雙向同步與 Realtime 訂閱
      await syncFromCloud({ manual: false, localTrackerOverride: loadedLocalTracker });
      unsubRealtime = subscribeCloudRealtime((key, payload) => {
        applyRemoteDoc(key, payload);
      });
    }
    init();

    const unsubs = [];
    if (window.electronAPI?.onTrackerUpdated) {
      unsubs.push(window.electronAPI.onTrackerUpdated((updated) => {
        setTrackerData(updated);
        // 外部 AI 或爬蟲修改本地 academic_tracker.json -> 自動推上雲端
        pushTrackerBuckets(updated);
      }));
    }
    if (window.electronAPI?.onNavigateTab) {
      unsubs.push(window.electronAPI.onNavigateTab((tab) => { if (TAB_TITLES[tab]) setActiveTab(tab); }));
    }
    if (window.electronAPI?.onStartFocusTimer) {
      unsubs.push(window.electronAPI.onStartFocusTimer(({ minutes, mode }) => {
        setActiveTab('dashboard');
        if (mode === 'break') {
          handleStartBreak(minutes || 5);
          showToast(`已啟動 ${minutes || 5} 分鐘休息倒數（結束時會響起鬧鐘）`);
        } else {
          handleStartFocus(minutes || 25);
          showToast(`已啟動 ${minutes || 25} 分鐘讀書專注模式`);
        }
      }));
    }
    if (window.electronAPI?.onSyncStatusChanged) {
      unsubs.push(window.electronAPI.onSyncStatusChanged(({ syncing, source }) => {
        setIsSyncing(!!syncing);
        if (!syncing && source !== 'manual') {
          showToast('eeclass 背景自動同步完成');
        }
      }));
    }
    if (window.electronAPI?.onWindowMaximizedChanged) {
      unsubs.push(window.electronAPI.onWindowMaximizedChanged((max) => setIsMaximized(!!max)));
    }
    if (window.electronAPI?.onActiveStickiesUpdated) {
      unsubs.push(window.electronAPI.onActiveStickiesUpdated((ids) => {
        if (Array.isArray(ids)) setActiveStickyCount(ids.length);
      }));
    }
    if (window.electronAPI?.onAutoDeliverablesAdded) {
      unsubs.push(window.electronAPI.onAutoDeliverablesAdded(({ count }) => {
        if (count > 0) showToast(`AI 成果庫已自動收錄 ${count} 份新檔案並同步上雲`);
      }));
    }
    if (window.electronAPI?.onCloudAssetAutoSynced) {
      unsubs.push(window.electronAPI.onCloudAssetAutoSynced(({ count }) => {
        if (count > 0) showToast(`已自動增量同步 ${count} 份教材變更至雲端`);
      }));
    }
    return () => {
      unsubRealtime();
      unsubs.forEach((fn) => typeof fn === 'function' && fn());
    };
  }, [isElectron, handleStartFocus, handleStartBreak, showToast, syncFromCloud, applyRemoteDoc, setActiveTab]);

  // Re-check cloud Markdown flashcards when Asset Manifest updates on Web
  useEffect(() => {
    if (isElectron || assetManifestVersion <= 0) return undefined;
    let cancelled = false;
    hydrateFlashcardsFromWorkspace({
      isElectron: false,
      currentStore: flashcardsStoreRef.current,
    }).then((res) => {
      if (!cancelled && res?.addedFromMd > 0 && res.store) {
        setFlashcardsStore(res.store);
      }
    });
    return () => { cancelled = true; };
  }, [isElectron, assetManifestVersion]);

  const handleUpdateFlashcards = useCallback(async (nextStoreOrUpdater, options = {}) => {
    const prev = flashcardsStoreRef.current;
    const nextStore = typeof nextStoreOrUpdater === 'function'
      ? nextStoreOrUpdater(prev)
      : nextStoreOrUpdater;
    if (!nextStore) return null;

    flashcardsStoreRef.current = nextStore;
    setFlashcardsStore(nextStore);

    const res = await persistFlashcardsStore(nextStore, {
      isElectron,
      syncMarkdown: Boolean(options.syncMarkdown),
      immediateCloud: Boolean(options.immediateCloud),
    });
    if (res?.cloudRes?.authRequired && options.promptUnlock) {
      handleRequireUnlock();
    }
    return res;
  }, [isElectron, handleRequireUnlock]);

  const handleResyncFlashcardsFromMd = useCallback(async ({ exportBack = false } = {}) => {
    const res = await hydrateFlashcardsFromWorkspace({
      isElectron,
      currentStore: flashcardsStoreRef.current,
    });
    const next = res?.store || flashcardsStoreRef.current;
    flashcardsStoreRef.current = next;
    setFlashcardsStore(next);

    if (exportBack || res?.addedFromMd > 0) {
      const saved = await persistFlashcardsStore(next, {
        isElectron,
        syncMarkdown: exportBack,
        immediateCloud: true,
      });
      if (saved?.cloudRes?.authRequired) handleRequireUnlock();
    }
    return res;
  }, [isElectron, handleRequireUnlock]);

  const handleOpenFlashcards = useCallback((action = null) => {
    setActiveTab('arena');
    setArenaLaunchTarget({ subTab: 'flashcards', action, nonce: Date.now() });
  }, [setActiveTab]);

  // Daily task auto-reset at midnight
  useEffect(() => {
    const timer = window.setInterval(() => {
      const today = new Date().toDateString();
      if (localStorage.getItem(TODAY_KEY) === today) return;
      setTasks((prev) => prev.map(resetDailyTaskProgress));
      try { localStorage.setItem(TODAY_KEY, today); } catch {}
    }, 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const { dialogRef: focusAlarmDialogRef } = useModalA11y({
    isOpen: Boolean(focusAlarmModal),
    onClose: stopInAppFocusAlarm,
  });

  // Global keyboard shortcut (Ctrl+K / Cmd+K). Escape is handled strictly by LIFO useModalA11y stack.
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Tracker Persistence Helper (Local Disk + Targeted Cloud Bucket Push)
  const persistTracker = useCallback(async (updatedData, changedBucketKey = null) => {
    setTrackerData(updatedData);
    if (window.electronAPI?.saveTrackerData) {
      await window.electronAPI.saveTrackerData(updatedData);
    }
    let cloudRes;
    if (changedBucketKey === SYNC_KEYS.ASSIGNMENTS) {
      cloudRes = await pushCloudDoc(SYNC_KEYS.ASSIGNMENTS, {
        assignments: updatedData.assignments || [],
        ignored_assignment_ids: updatedData.ignored_assignment_ids || [],
        ignored_assignment_keys: updatedData.ignored_assignment_keys || [],
        updatedAt: new Date().toISOString(),
      });
    } else if (changedBucketKey === SYNC_KEYS.EXAMS) {
      cloudRes = await pushCloudDoc(SYNC_KEYS.EXAMS, {
        exams: updatedData.exams || [],
        deletedIds: updatedData._deleted_exam_ids || [],
        updatedAt: new Date().toISOString(),
      });
    } else if (changedBucketKey === SYNC_KEYS.DELIVERABLES) {
      cloudRes = await pushCloudDoc(SYNC_KEYS.DELIVERABLES, {
        deliverables: updatedData.deliverables || [],
        deletedIds: updatedData._deleted_deliverable_ids || [],
        ignoredPaths: updatedData._ignored_deliverable_paths || [],
        vaultSubjects: updatedData.vault_subjects || [],
        deletedSubjectIds: updatedData._deleted_vault_subject_ids || [],
        updatedAt: new Date().toISOString(),
      });
    } else {
      cloudRes = await pushTrackerBuckets(updatedData);
    }

    if (cloudRes?.authRequired) {
      handleRequireUnlock();
    }
  }, [handleRequireUnlock]);

  // Assignment Handlers
  const handleChangeAssignmentStatus = useCallback(async (assignmentId, nextStatus) => {
    if (!trackerData?.assignments) return;
    const nowIso = new Date().toISOString();
    const updatedAssignments = trackerData.assignments.map((a) =>
      a.id === assignmentId ? { ...a, status: nextStatus, updatedAt: nowIso } : a
    );
    await persistTracker({ ...trackerData, assignments: updatedAssignments }, SYNC_KEYS.ASSIGNMENTS);
  }, [trackerData, persistTracker]);

  const handleCompleteAssignment = useCallback(async (assignmentId) => {
    await handleChangeAssignmentStatus(assignmentId, 'completed');
    showToast('已標記作業完成');
  }, [handleChangeAssignmentStatus, showToast]);

  const handleAddAssignment = useCallback(async (newAssignment) => {
    const prev = trackerData?.assignments || [];
    const stamped = { ...newAssignment, updatedAt: new Date().toISOString() };
    await persistTracker({ ...trackerData, assignments: [stamped, ...prev] }, SYNC_KEYS.ASSIGNMENTS);
    showToast(`已新增作業「${newAssignment.title}」`);
  }, [trackerData, persistTracker, showToast]);

  const handleDeleteAssignment = useCallback(async (assignmentId) => {
    if (!trackerData?.assignments) return;
    const target = trackerData.assignments.find((a) => a.id === assignmentId);
    const updatedAssignments = trackerData.assignments.filter((a) => a.id !== assignmentId);
    const prevIgnoredIds = Array.isArray(trackerData.ignored_assignment_ids) ? trackerData.ignored_assignment_ids : [];
    const prevIgnoredKeys = Array.isArray(trackerData.ignored_assignment_keys) ? trackerData.ignored_assignment_keys : [];
    const nextIgnoredIds = prevIgnoredIds.includes(assignmentId) ? prevIgnoredIds : [...prevIgnoredIds, assignmentId];
    const targetKey = target ? `${target.course}_${target.title}` : null;
    const nextIgnoredKeys = targetKey && !prevIgnoredKeys.includes(targetKey)
      ? [...prevIgnoredKeys, targetKey]
      : prevIgnoredKeys;

    await persistTracker({
      ...trackerData,
      assignments: updatedAssignments,
      ignored_assignment_ids: nextIgnoredIds,
      ignored_assignment_keys: nextIgnoredKeys,
    }, SYNC_KEYS.ASSIGNMENTS);
    showToast('已移除作業並加入忽略清單（下次同步不再出現）');
  }, [trackerData, persistTracker, showToast]);

  // Exam Handlers
  const handleCompleteExam = useCallback(async (examId) => {
    if (!trackerData?.exams) return;
    const nowIso = new Date().toISOString();
    const updatedExams = trackerData.exams.map((e) => (e.id === examId ? { ...e, status: 'completed', updatedAt: nowIso } : e));
    await persistTracker({ ...trackerData, exams: updatedExams }, SYNC_KEYS.EXAMS);
  }, [trackerData, persistTracker]);

  const handleAddExam = useCallback(async (newExam) => {
    const prev = trackerData?.exams || [];
    const stamped = { ...newExam, updatedAt: new Date().toISOString() };
    await persistTracker({ ...trackerData, exams: [stamped, ...prev] }, SYNC_KEYS.EXAMS);
    showToast(`已新增考試「${newExam.title}」`);
  }, [trackerData, persistTracker, showToast]);

  const handleDeleteExam = useCallback(async (examId) => {
    const curTracker = trackerRef.current;
    if (!curTracker?.exams) return;
    const target = curTracker.exams.find((e) => e.id === examId);
    const updatedExams = curTracker.exams.filter((e) => e.id !== examId);
    const prevDel = Array.isArray(curTracker._deleted_exam_ids) ? curTracker._deleted_exam_ids : [];
    const nextDel = prevDel.includes(examId) ? prevDel : [...prevDel, examId].slice(-200);
    await persistTracker({ ...curTracker, exams: updatedExams, _deleted_exam_ids: nextDel }, SYNC_KEYS.EXAMS);
    if (target) {
      showToast(`已移除考試「${target.title}」`, {
        actionLabel: '復原',
        onAction: async () => {
          const latest = trackerRef.current;
          const exists = (latest?.exams || []).some((e) => e.id === target.id);
          const restoredExams = exists ? latest.exams : [target, ...(latest?.exams || [])];
          const restoredDel = (latest?._deleted_exam_ids || []).filter((id) => id !== target.id);
          await persistTracker({ ...latest, exams: restoredExams, _deleted_exam_ids: restoredDel }, SYNC_KEYS.EXAMS);
          showToast(`已復原考試「${target.title}」`, { tone: 'success' });
        },
      });
    }
  }, [persistTracker, showToast]);

  // Deliverables & Vault-Only Subjects Handlers
  const handleSaveDeliverables = useCallback(async (updatedDeliverables) => {
    await persistTracker({ ...trackerData, deliverables: updatedDeliverables }, SYNC_KEYS.DELIVERABLES);
  }, [trackerData, persistTracker]);

  const handleAddDeliverable = useCallback(async (newDeliverable) => {
    const prev = trackerData?.deliverables || [];
    const stamped = { ...newDeliverable, updatedAt: newDeliverable.updatedAt || new Date().toISOString().slice(0, 10) };
    const normNewPath = String(stamped.path || '').replace(/\\/g, '/').replace(/^\/+/, '');
    const nextIgnored = (trackerData?._ignored_deliverable_paths || []).filter(
      (p) => String(p || '').replace(/\\/g, '/').replace(/^\/+/, '') !== normNewPath
    );
    await persistTracker(
      {
        ...trackerData,
        deliverables: [stamped, ...prev],
        _ignored_deliverable_paths: nextIgnored,
      },
      SYNC_KEYS.DELIVERABLES
    );
  }, [trackerData, persistTracker]);

  const handleUpdateDeliverable = useCallback(async (updatedItem) => {
    const prev = trackerData?.deliverables || [];
    const next = prev.map((d) => (d.id === updatedItem.id ? { ...d, ...updatedItem } : d));
    await persistTracker({ ...trackerData, deliverables: next }, SYNC_KEYS.DELIVERABLES);
    showToast(`已更新「${updatedItem.title}」資訊`);
  }, [trackerData, persistTracker, showToast]);

  const handleDeleteDeliverable = useCallback(async (item, { deleteLocalFile = false } = {}) => {
    if (!item) return;
    const prev = trackerData?.deliverables || [];
    const nextDeliverables = prev.filter((d) => d.id !== item.id);
    const prevDelIds = Array.isArray(trackerData?._deleted_deliverable_ids) ? trackerData._deleted_deliverable_ids : [];
    const nextDelIds = item.id && !prevDelIds.includes(item.id)
      ? [...prevDelIds, item.id].slice(-200)
      : prevDelIds;
    const normPath = String(item.path || '').replace(/\\/g, '/').replace(/^\/+/, '');
    const prevIgnored = Array.isArray(trackerData?._ignored_deliverable_paths) ? trackerData._ignored_deliverable_paths : [];
    const nextIgnored = !deleteLocalFile && normPath && !prevIgnored.includes(normPath)
      ? [...prevIgnored, normPath].slice(-300)
      : prevIgnored;

    if (deleteLocalFile && window.electronAPI?.trashFile && normPath) {
      const trashRes = await window.electronAPI.trashFile(normPath);
      if (!trashRes?.success) {
        showToast(`回收桶移除失敗：${trashRes?.error || '未知錯誤'}`);
      }
    }

    await persistTracker(
      {
        ...trackerData,
        deliverables: nextDeliverables,
        _deleted_deliverable_ids: nextDelIds,
        _ignored_deliverable_paths: nextIgnored,
      },
      SYNC_KEYS.DELIVERABLES
    );
    showToast(deleteLocalFile ? `已將「${item.title}」移至系統回收桶並自成果庫移除` : `已自成果庫清單移除「${item.title}」`);
  }, [trackerData, persistTracker, showToast]);

  const handleSaveVaultSubject = useCallback(async (subjectData) => {
    const prevSubjects = Array.isArray(trackerData?.vault_subjects) ? trackerData.vault_subjects : [];
    const existsIdx = prevSubjects.findIndex((s) => s.id === subjectData.id || (subjectData.previousName && s.name === subjectData.previousName));
    const cleaned = {
      id: subjectData.id,
      name: subjectData.name,
      categories: subjectData.categories || ['Study_Materials', 'Test_Bank'],
      color: subjectData.color || '#4285F4',
      icon: subjectData.icon || 'book',
      updatedAt: subjectData.updatedAt || new Date().toISOString(),
    };
    const nextSubjects = existsIdx >= 0
      ? prevSubjects.map((s, i) => (i === existsIdx ? cleaned : s))
      : [cleaned, ...prevSubjects];

    // If renaming a subject, also update deliverables referencing old name
    let nextDeliverables = trackerData?.deliverables || [];
    if (subjectData.previousName && subjectData.previousName !== subjectData.name) {
      nextDeliverables = nextDeliverables.map((d) =>
        d.course === subjectData.previousName
          ? { ...d, course: subjectData.name, updatedAt: new Date().toISOString().slice(0, 10) }
          : d
      );
    }

    if (window.electronAPI?.ensureVaultSubjectDir) {
      await window.electronAPI.ensureVaultSubjectDir({
        subjectName: cleaned.name,
        categories: cleaned.categories,
      });
    }

    await persistTracker(
      {
        ...trackerData,
        vault_subjects: nextSubjects,
        deliverables: nextDeliverables,
      },
      SYNC_KEYS.DELIVERABLES
    );
    showToast(existsIdx >= 0 ? `已更新成果庫科目「${cleaned.name}」` : `已新增成果庫科目「${cleaned.name}」`);
  }, [trackerData, persistTracker, showToast]);

  const handleDeleteVaultSubject = useCallback(async (subject) => {
    if (!subject) return;
    const prevSubjects = Array.isArray(trackerData?.vault_subjects) ? trackerData.vault_subjects : [];
    const nextSubjects = prevSubjects.filter((s) => s.id !== subject.id && s.name !== subject.name);
    const prevDel = Array.isArray(trackerData?._deleted_vault_subject_ids) ? trackerData._deleted_vault_subject_ids : [];
    const nextDel = subject.id && !prevDel.includes(subject.id)
      ? [...prevDel, subject.id].slice(-200)
      : prevDel;

    await persistTracker(
      {
        ...trackerData,
        vault_subjects: nextSubjects,
        _deleted_vault_subject_ids: nextDel,
      },
      SYNC_KEYS.DELIVERABLES
    );
    showToast(`已移除自訂科目資料夾「${subject.name}」`);
  }, [trackerData, persistTracker, showToast]);

  const handleFileContentSaved = useCallback(async (savedFile) => {
    if (!savedFile?.path) return;
    const normPath = String(savedFile.path).replace(/\\/g, '/').replace(/^\/+/, '');
    const today = new Date().toISOString().slice(0, 10);
    const prev = trackerRef.current?.deliverables || [];
    const matched = prev.some((d) => String(d.path || '').replace(/\\/g, '/').replace(/^\/+/, '') === normPath);
    if (matched) {
      const next = prev.map((d) =>
        String(d.path || '').replace(/\\/g, '/').replace(/^\/+/, '') === normPath
          ? { ...d, updatedAt: today }
          : d
      );
      await persistTracker({ ...trackerRef.current, deliverables: next }, SYNC_KEYS.DELIVERABLES);
    }
    setAssetManifestVersion((v) => v + 1);
  }, [persistTracker]);

  // Task Handlers (with cloud push)
  const commitTasks = useCallback((nextTasks, nextDeleted = deletedTaskIdsRef.current) => {
    setTasks(nextTasks);
    setDeletedTaskIds(nextDeleted);
    pushCloudDoc(SYNC_KEYS.TASKS, {
      items: nextTasks,
      deletedIds: nextDeleted,
      updatedAt: new Date().toISOString(),
    }).then((res) => {
      if (res?.authRequired) handleRequireUnlock();
    });
  }, [handleRequireUnlock]);

  const handleCompleteTask = (taskId) => {
    const nowIso = new Date().toISOString();
    commitTasks(tasksRef.current.map((t) => {
      if (t.id !== taskId) return t;
      const nextChecklist = Array.isArray(t.checklist) && t.checklist.length > 0
        ? t.checklist.map((item) => ({ ...item, done: true }))
        : t.checklist;
      return {
        ...t,
        completed: true,
        ...(nextChecklist ? { checklist: nextChecklist } : {}),
        updatedAt: nowIso,
      };
    }));
  };
  const handleUncompleteTask = (taskId) => {
    const nowIso = new Date().toISOString();
    commitTasks(tasksRef.current.map((t) => {
      if (t.id !== taskId) return t;
      const nextChecklist = Array.isArray(t.checklist) && t.checklist.length > 0 && t.checklist.every((item) => item.done)
        ? t.checklist.map((item) => ({ ...item, done: false }))
        : t.checklist;
      return {
        ...t,
        completed: false,
        ...(nextChecklist ? { checklist: nextChecklist } : {}),
        updatedAt: nowIso,
      };
    }));
  };
  const handleToggleChecklistItem = (taskId, itemId) => {
    const nowIso = new Date().toISOString();
    commitTasks(tasksRef.current.map((t) => {
      if (t.id !== taskId || !Array.isArray(t.checklist)) return t;
      const nextChecklist = t.checklist.map((item) =>
        item.id === itemId ? { ...item, done: !item.done } : item
      );
      const allDone = nextChecklist.length > 0 && nextChecklist.every((item) => item.done);
      return {
        ...t,
        checklist: nextChecklist,
        completed: allDone,
        updatedAt: nowIso,
      };
    }));
  };
  const handleResetChecklist = (taskId) => {
    const nowIso = new Date().toISOString();
    commitTasks(tasksRef.current.map((t) => {
      if (t.id !== taskId || !Array.isArray(t.checklist)) return t;
      return {
        ...t,
        completed: false,
        checklist: t.checklist.map((item) => ({ ...item, done: false })),
        updatedAt: nowIso,
      };
    }));
  };
  const handleAddTask = (taskData) => {
    const nowIso = new Date().toISOString();
    if (taskData.id) {
      commitTasks(tasksRef.current.map((t) => (t.id === taskData.id ? { ...taskData, updatedAt: nowIso } : t)));
    } else {
      const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
      commitTasks([...tasksRef.current, { ...taskData, id, completed: false, updatedAt: nowIso }]);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };
  const handleDeleteTask = (taskId) => {
    const target = tasksRef.current.find((t) => t.id === taskId);
    const nextDeleted = deletedTaskIdsRef.current.includes(taskId)
      ? deletedTaskIdsRef.current
      : [...deletedTaskIdsRef.current, taskId].slice(-200);
    commitTasks(tasksRef.current.filter((t) => t.id !== taskId), nextDeleted);
    if (target) {
      showToast(`已刪除任務「${target.title}」`, {
        actionLabel: '復原',
        onAction: () => {
          const restoredTasks = tasksRef.current.some((t) => t.id === target.id)
            ? tasksRef.current
            : [{ ...target, updatedAt: new Date().toISOString() }, ...tasksRef.current];
          const restoredDel = deletedTaskIdsRef.current.filter((id) => id !== target.id);
          commitTasks(restoredTasks, restoredDel);
          showToast(`已復原任務「${target.title}」`, { tone: 'success' });
        },
      });
    }
  };
  const handleCategoryChange = (taskId, newCategory) => {
    const nowIso = new Date().toISOString();
    commitTasks(tasksRef.current.map((t) => (t.id === taskId ? { ...t, category: newCategory, updatedAt: nowIso } : t)));
  };

  // Reminders Handlers (with cloud push)
  const handleUpdateReminders = useCallback((updater) => {
    setReminders((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      pushCloudDoc(SYNC_KEYS.REMINDERS, {
        reminders: next,
        completions: reminderCompletionsRef.current,
        updatedAt: new Date().toISOString(),
      }).then((res) => {
        if (res?.authRequired) handleRequireUnlock();
      });
      return next;
    });
  }, [handleRequireUnlock]);

  const toggleReminder = (reminder) => {
    const key = `${todayDateStr}:${reminder}`;
    const next = { ...reminderCompletionsRef.current, [key]: !reminderCompletionsRef.current[key] };
    setReminderCompletions(next);
    pushCloudDoc(SYNC_KEYS.REMINDERS, {
      reminders: remindersRef.current,
      completions: next,
      updatedAt: new Date().toISOString(),
    }).then((res) => {
      if (res?.authRequired) handleRequireUnlock();
    });
  };

  // Sync & Alert Handlers
  const handleTriggerSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      if (window.electronAPI?.syncEEClass) {
        const res = await window.electronAPI.syncEEClass();
        if (res?.data) {
          setTrackerData(res.data);
          await pushTrackerBuckets(res.data, { immediate: true });
        }
        await syncFromCloud({ manual: false, localTrackerOverride: res?.data || trackerRef.current });
        showToast(res?.success ? 'eeclass 與雲端資料同步完成' : `同步提示：${res?.error || '請檢查網路或登入狀態'}`);
      } else {
        await syncFromCloud({ manual: true });
      }
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, showToast, syncFromCloud]);

  const handleTriggerAlertTest = useCallback(async () => {
    if (window.electronAPI?.triggerAlertCheck) {
      await window.electronAPI.triggerAlertCheck({ manual: true, reason: 'manual' });
    } else {
      showToast('置頂警告視窗為 Windows 桌面程式專屬功能');
    }
  }, [showToast]);

  const handleSaveAppConfig = useCallback(async (nextCfg) => {
    setAppConfig(nextCfg);
    if (window.electronAPI?.saveAppConfig) {
      const saved = await window.electronAPI.saveAppConfig(nextCfg);
      if (saved) setAppConfig(saved);
    }
    showToast('系統與提醒設定已儲存');
  }, [showToast]);

  const handleLockCloud = useCallback(async () => {
    await lockCloudWrite();
    const auth = await getCloudAuthState();
    setCloudAuth(auth);
    showToast('已鎖定寫入權限，切換回公開唯讀模式');
  }, [showToast]);

  // Window Controls
  const handleTogglePin = async () => {
    if (window.electronAPI?.togglePinWindow) {
      setIsPinned(!!(await window.electronAPI.togglePinWindow()));
    }
  };
  const handleToggleMaximize = async () => {
    if (window.electronAPI?.toggleMaximizeWindow) {
      setIsMaximized(!!(await window.electronAPI.toggleMaximizeWindow()));
    }
  };

  // Badges for Sidebar & Mobile Bottom Nav
  const alertSummary = useMemo(
    () => computeAcademicAlerts(trackerData, appConfig?.alerts),
    [trackerData, appConfig?.alerts]
  );
  const pendingDailyCount = useMemo(
    () => tasks.filter((t) => t.category === 'Daily' && isTaskScheduledForDate(t) && !t.completed).length,
    [tasks]
  );
  const courseOptions = useMemo(
    () => [...new Set((trackerData?.courses || []).map((c) => c.name).filter(Boolean))],
    [trackerData?.courses]
  );
  const flashcardStats = useMemo(
    () => computeFlashcardStats(flashcardsStore, todayIso),
    [flashcardsStore, todayIso]
  );

  const navItems = [
    { id: 'dashboard', label: '總覽首頁', icon: Home },
    {
      id: 'assignments',
      label: '作業管理',
      icon: CheckSquare,
      badge: alertSummary.activeAssignments.length || null,
      badgeUrgent: alertSummary.urgentAssignmentCount > 0,
    },
    {
      id: 'exams',
      label: '考試日程',
      icon: Calendar,
      badge: alertSummary.urgentExamCount || null,
      badgeUrgent: alertSummary.urgentExamCount > 0,
    },
    {
      id: 'arena',
      label: '刷題戰情室',
      icon: Crosshair,
      badge: flashcardStats.dueCount > 0 ? `${flashcardStats.dueCount}` : '116',
      badgeUrgent: flashcardStats.leechCount > 0,
    },
    {
      id: 'missions',
      label: '每日任務',
      icon: ListTodo,
      badge: pendingDailyCount || null,
      badgeUrgent: false,
    },
    {
      id: 'notes',
      label: isElectron ? '桌面便條' : '雲端便條',
      icon: StickyNote,
      badge: isElectron ? (activeStickyCount || null) : null,
      badgeUrgent: false,
    },
    {
      id: 'vault',
      label: 'AI 成果庫',
      icon: FolderGit2,
      badge: trackerData?.deliverables?.length || null,
      badgeUrgent: false,
    },
    { id: 'courses', label: '科目與課表', icon: BookOpen },
  ];

  const focusTimerLabel = `${String(Math.floor(focusState.secondsLeft / 60)).padStart(2, '0')}:${String(focusState.secondsLeft % 60).padStart(2, '0')}`;

  const renderCloudPill = (compact = false) => {
    if (!cloudAuth.configured) {
      return (
        <button
          type="button"
          className="cloud-status-pill is-unconfigured"
          onClick={() => setIsSettingsOpen(true)}
          title="點擊前往設定 Supabase 雲端同步"
          aria-label="尚未連線雲端，前往設定"
        >
          <CloudOff size={13} />
          {!compact && <span>未連雲端</span>}
        </button>
      );
    }
    const isSynced = cloudStatus.status === 'synced';
    const isSyncingNow = cloudStatus.status === 'syncing';
    const isOffline = cloudStatus.status === 'offline';

    const statusAria = isOffline
      ? '目前為離線快取模式'
      : isSyncingNow
        ? '雲端同步中'
        : cloudAuth.canWrite
          ? '雲端已同步，管理解鎖狀態'
          : '公開唯讀模式，點擊解鎖編輯';

    return (
      <button
        type="button"
        className={`cloud-status-pill ${cloudAuth.canWrite ? 'is-unlocked' : 'is-readonly'} ${isOffline ? 'is-offline' : ''}`}
        onClick={() => setIsUnlockModalOpen(true)}
        title={cloudAuth.canWrite ? '雲端雙向即時同步中（點擊管理解鎖狀態）' : '公開唯讀模式（點擊輸入密碼解鎖寫入）'}
        aria-label={statusAria}
      >
        {isOffline ? (
          <CloudOff size={13} />
        ) : cloudAuth.canWrite ? (
          isSynced || isSyncingNow ? <Cloud size={13} className={isSyncingNow ? 'spin' : ''} /> : <Unlock size={13} />
        ) : (
          <Lock size={13} />
        )}
        {!compact && (
          <span>
            {isOffline
              ? '離線快取'
              : isSyncingNow
                ? '雲端同步中'
                : cloudAuth.canWrite
                  ? '雲端已同步'
                  : '唯讀 · 解鎖'}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <a href="#main-content" className="skip-to-main">跳至主要內容</a>
      <div className={`app-shell ${isMaximized ? 'is-maximized' : ''} ${isMobile ? 'is-mobile-layout' : ''}`}>
        {/* ===== 左側現代側邊欄 (桌面 / Laptop / iPadOS) ===== */}
        {!isMobile && (
          <aside className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-brand">
              <div className="sidebar-logo-wrap">
                <TaskCommanderLogo size={30} />
              </div>
              {!sidebarCollapsed && (
                <div className="sidebar-brand-text">
                  <div className="sidebar-title">Task Commander</div>
                  <div className="sidebar-sub">NCU 115-1 學習中樞</div>
                </div>
              )}
              <button
                type="button"
                className="sidebar-collapse-btn"
                onClick={() => setSidebarCollapsed((p) => !p)}
                title={sidebarCollapsed ? '展開側邊欄' : '收合側邊欄'}
                aria-label={sidebarCollapsed ? '展開側邊欄' : '收合側邊欄'}
                aria-expanded={!sidebarCollapsed}
              >
                {sidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
              </button>
            </div>

            <SlidingContainer
              as="nav"
              className="sidebar-nav"
              activeKey={activeTab}
              indicatorClassName="sliding-pill-indicator sidebar-slider"
              deps={[sidebarCollapsed]}
              aria-label="主功能導覽"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    aria-label={sidebarCollapsed ? item.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={17} className="sidebar-nav-icon" />
                    {!sidebarCollapsed && <span className="sidebar-nav-label">{item.label}</span>}
                    {item.badge !== null && item.badge !== undefined && (
                      <span className={`sidebar-badge ${item.badgeUrgent ? 'urgent' : ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </SlidingContainer>

            {/* 側欄底部狀態與快捷工具 */}
            <div className="sidebar-footer">
              {focusState.isRunning && (
                <button
                  type="button"
                  className={`sidebar-focus-pill ${focusState.mode === 'break' ? 'is-break' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                  title={focusState.mode === 'break' ? '點擊回到休息倒數' : '點擊回到專注計時器'}
                >
                  {focusState.mode === 'break' ? <Clock size={14} /> : <Flame size={14} />}
                  {!sidebarCollapsed && (
                    <span>{focusState.mode === 'break' ? '休息中' : '專注中'} {focusTimerLabel}</span>
                  )}
                </button>
              )}

              {renderCloudPill(sidebarCollapsed)}

              <button
                type="button"
                className="sidebar-util-btn"
                onClick={handleTriggerSync}
                disabled={isSyncing}
                title={isElectron ? '同步 eeclass 與雲端資料' : '重新同步雲端最新資料'}
              >
                <RefreshCw size={15} className={isSyncing ? 'spin' : ''} />
                {!sidebarCollapsed && <span>{isSyncing ? '同步中...' : (isElectron ? '同步 eeclass' : '重新同步')}</span>}
              </button>

              <div className="sidebar-footer-row">
                <button
                  type="button"
                  className="sidebar-util-btn"
                  onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
                  title={`切換為${theme === 'light' ? '深色' : '淺色'}主題`}
                >
                  {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
                  {!sidebarCollapsed && <span>{theme === 'light' ? '深色' : '淺色'}</span>}
                </button>

                <button
                  type="button"
                  className="sidebar-util-btn"
                  onClick={() => setIsSettingsOpen(true)}
                  title="系統與雲端設定"
                >
                  <Settings size={15} />
                  {!sidebarCollapsed && <span>設定</span>}
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* ===== 右側主區域（桌機頂欄或手機極簡頂欄 + 滿版捲動主區）===== */}
        <div className="app-content-shell">
          {isMobile ? (
            <header className="app-mobile-header">
              <div className="mobile-header-left">
                <TaskCommanderLogo size={24} />
                <h1 className="mobile-header-title">{TAB_TITLES[activeTab] || 'Task Commander'}</h1>
              </div>
              <div className="mobile-header-actions">
                {renderCloudPill(true)}
                <button
                  type="button"
                  className="win-btn"
                  onClick={() => setIsCmdOpen(true)}
                  aria-label="搜尋"
                  title="搜尋作業與教材"
                >
                  <Search size={17} />
                </button>
              </div>
            </header>
          ) : (
            <header
              className="app-titlebar"
              onDoubleClick={isElectron ? handleToggleMaximize : undefined}
            >
              <div className="titlebar-left">
                <h1 className="titlebar-page-name">{TAB_TITLES[activeTab] || 'Task Commander'}</h1>
              </div>

              <button
                type="button"
                className="titlebar-search-trigger window-no-drag"
                onClick={() => setIsCmdOpen(true)}
                title="快速搜尋與指令面板 (Ctrl+K)"
              >
                <Search size={14} />
                <span>搜尋作業、教材或執行指令...</span>
                <kbd className="kbd-chip">Ctrl K</kbd>
              </button>

              <div className="titlebar-controls window-no-drag">
                {isElectron ? (
                  <>
                    <button
                      type="button"
                      className="win-btn"
                      onClick={handleTriggerAlertTest}
                      title="立即檢查／預覽警告彈窗"
                      aria-label="立即檢查並預覽警告彈窗"
                    >
                      <BellRing size={14} />
                    </button>
                    <button
                      type="button"
                      className={`win-btn ${isPinned ? 'active' : ''}`}
                      onClick={handleTogglePin}
                      title={isPinned ? '已置頂（點擊解除）' : '視窗置頂'}
                      aria-label={isPinned ? '解除視窗置頂' : '視窗置頂'}
                      aria-pressed={isPinned}
                    >
                      <Pin size={14} />
                    </button>
                    <div className="win-divider" />
                    <button
                      type="button"
                      className="win-btn"
                      onClick={() => window.electronAPI?.minimizeWindow?.()}
                      title="最小化"
                      aria-label="最小化視窗"
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      type="button"
                      className="win-btn"
                      onClick={handleToggleMaximize}
                      title={isMaximized ? '還原視窗大小' : '最大化'}
                      aria-label={isMaximized ? '還原視窗大小' : '最大化視窗'}
                    >
                      {isMaximized ? <Copy size={13} /> : <Square size={12} />}
                    </button>
                    <button
                      type="button"
                      className="win-btn close"
                      onClick={() => window.electronAPI?.closeWindow?.()}
                      title={appConfig?.minimizeToTray ? '縮小至系統匣背景執行' : '關閉視窗'}
                      aria-label={appConfig?.minimizeToTray ? '縮小至系統匣' : '關閉視窗'}
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  renderCloudPill(false)
                )}
              </div>
            </header>
          )}

          <main id="main-content" ref={mainScrollRef} tabIndex={-1} className="app-main-scrollable">
            {/* Keep ExamArena mounted while an exam/review session is active so switching tabs to check textbooks never destroys unsynced state */}
            {(activeTab === 'arena' || (hasMountedArena && arenaSessionActive)) && (
              <div
                className={activeTab === 'arena' ? 'tab-view-stage' : undefined}
                style={activeTab === 'arena' ? undefined : { display: 'none' }}
                aria-hidden={activeTab !== 'arena' ? 'true' : undefined}
              >
                <Suspense fallback={<ViewSkeleton />}>
                  <ExamArena
                    onPreviewFile={setSelectedFileForViewer}
                    showToast={showToast}
                    assetManifestVersion={assetManifestVersion}
                    courses={trackerData?.courses || []}
                    onOpenAiSettings={() => { setSettingsInitialTab('ai'); setIsSettingsOpen(true); }}
                    onRequireUnlock={handleRequireUnlock}
                    flashcardsStore={flashcardsStore}
                    onUpdateFlashcards={handleUpdateFlashcards}
                    onResyncFlashcardsFromMd={handleResyncFlashcardsFromMd}
                    launchTarget={arenaLaunchTarget}
                    onConsumeLaunchTarget={() => setArenaLaunchTarget(null)}
                    onSessionActiveChange={setArenaSessionActive}
                  />
                </Suspense>
              </div>
            )}

            {activeTab !== 'arena' && (
              <div key={activeTab} className="tab-view-stage">
                {activeTab === 'dashboard' && (
                  <DashboardHome
                    trackerData={trackerData}
                    alertConfig={appConfig?.alerts}
                    tasks={tasks}
                    reminders={reminders}
                    reminderCompletions={reminderCompletions}
                    todayKey={todayDateStr}
                    onToggleReminder={toggleReminder}
                    onCompleteTask={handleCompleteTask}
                    onCompleteAssignment={handleCompleteAssignment}
                    onNavigateTab={setActiveTab}
                    onTriggerSync={handleTriggerSync}
                    isSyncing={isSyncing}
                    onTriggerAlertTest={handleTriggerAlertTest}
                    focusState={focusState}
                    onStartFocus={handleStartFocus}
                    onStartBreak={handleStartBreak}
                    onPauseFocus={handlePauseFocus}
                    onResetFocus={handleResetFocus}
                    onChangePreset={handleChangePreset}
                    focusAlarmEnabled={focusAlarmEnabled}
                    onToggleFocusAlarm={handleToggleFocusAlarm}
                    onTestFocusAlarm={handleTestFocusAlarm}
                    studyMinutesToday={studyMinutesToday}
                    dailyStudyGoalMinutes={appConfig?.alerts?.dailyStudyGoalMinutes || 60}
                    flashcardStats={flashcardStats}
                    onOpenFlashcards={handleOpenFlashcards}
                    reducedMotion={isReducedMotion}
                  />
                )}

                <Suspense fallback={<ViewSkeleton />}>
                  {activeTab === 'assignments' && (
                    <AssignmentsBoard
                      assignments={trackerData?.assignments || []}
                      courses={trackerData?.courses || []}
                      onChangeStatus={handleChangeAssignmentStatus}
                      onDeleteAssignment={handleDeleteAssignment}
                      onAddAssignment={handleAddAssignment}
                      onPreviewFile={setSelectedFileForViewer}
                      isMobile={isMobile}
                    />
                  )}

                  {activeTab === 'exams' && (
                    <ExamsDashboard
                      exams={trackerData?.exams || []}
                      calendarEvents={trackerData?.calendar_events || []}
                      courses={trackerData?.courses || []}
                      onPreviewFile={setSelectedFileForViewer}
                      onCompleteExam={handleCompleteExam}
                      onDeleteExam={handleDeleteExam}
                      onAddExam={handleAddExam}
                      onNavigateVault={() => setActiveTab('vault')}
                    />
                  )}

                  {activeTab === 'missions' && (
                    <TaskBoard
                      tasks={tasks}
                      courses={trackerData?.courses || []}
                      onComplete={handleCompleteTask}
                      onUncomplete={handleUncompleteTask}
                      onEdit={(task) => { setEditingTask(task); setIsTaskModalOpen(true); }}
                      onDelete={handleDeleteTask}
                      onCategoryChange={handleCategoryChange}
                      onAddNew={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
                      onToggleChecklistItem={handleToggleChecklistItem}
                      onResetChecklist={handleResetChecklist}
                      isMobile={isMobile}
                      reducedMotion={isReducedMotion}
                    />
                  )}

                  {activeTab === 'notes' && (
                    <StickyNotesBoard
                      onRequireUnlock={handleRequireUnlock}
                      showToast={showToast}
                    />
                  )}

                  {activeTab === 'vault' && (
                    <ArtifactVault
                      deliverables={trackerData?.deliverables || []}
                      vaultSubjects={trackerData?.vault_subjects || []}
                      courses={trackerData?.courses || []}
                      onPreviewFile={setSelectedFileForViewer}
                      onSaveDeliverables={handleSaveDeliverables}
                      onAddDeliverable={handleAddDeliverable}
                      onUpdateDeliverable={handleUpdateDeliverable}
                      onDeleteDeliverable={handleDeleteDeliverable}
                      onSaveVaultSubject={handleSaveVaultSubject}
                      onDeleteVaultSubject={handleDeleteVaultSubject}
                      onRequireUnlock={handleRequireUnlock}
                      onOpenAiSettings={() => { setSettingsInitialTab('ai'); setIsSettingsOpen(true); }}
                      assetManifestVersion={assetManifestVersion}
                    />
                  )}

                  {activeTab === 'courses' && (
                    <CourseSchedule
                      currentCourses={trackerData?.courses || []}
                      onOpenGraduationCredits={() => setIsCreditsModalOpen(true)}
                    />
                  )}
                </Suspense>
              </div>
            )}
          </main>

          {/* iOS 底部固定精簡導覽列 */}
          {isMobile && (
            <MobileBottomNav
              activeTab={activeTab}
              onNavigateTab={setActiveTab}
              urgentAssignmentCount={alertSummary.urgentAssignmentCount}
              urgentExamCount={alertSummary.urgentExamCount}
              theme={theme}
              onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenCredits={() => setIsCreditsModalOpen(true)}
              onOpenUnlock={() => setIsUnlockModalOpen(true)}
              onForceSync={handleTriggerSync}
              isSyncing={isSyncing}
              cloudCanWrite={cloudAuth.canWrite}
              cloudConfigured={cloudAuth.configured}
            />
          )}
        </div>
      </div>

      {/* Global Toast with aria-live & optional Undo action */}
      {globalToast && (
        <div
          className={`explorer-toast ${globalToast.tone && globalToast.tone !== 'default' ? `is-${globalToast.tone}` : ''}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>{globalToast.message}</span>
          {globalToast.actionLabel && globalToast.onAction && (
            <button
              type="button"
              className="toast-undo-btn"
              onClick={() => {
                const fn = globalToast.onAction;
                dismissToast();
                fn();
              }}
            >
              {globalToast.actionLabel}
            </button>
          )}
        </div>
      )}

      {/* In-App Focus / Break Completion Alarm Overlay (Always above Viewer/Settings via is-alarm-layer) */}
      {focusAlarmModal && (
        <div className="arena-modal-backdrop is-alarm-layer" onClick={stopInAppFocusAlarm}>
          <div
            ref={focusAlarmDialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-label={focusAlarmModal.kind === 'break_complete' ? '休息倒數結束' : '讀書專注計時完成'}
            tabIndex={-1}
            className="focus-alarm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="focus-alarm-modal-head">
              <div className={`focus-alarm-bell ${focusAlarmModal.playInAppLoop ? 'is-ringing' : ''}`}>
                <BellRing size={22} />
              </div>
              <div>
                <h3>
                  {focusAlarmModal.kind === 'break_complete'
                    ? '休息倒數結束 · 回到專注！'
                    : '讀書專注計時完成！'}
                </h3>
                <p>
                  {focusAlarmModal.kind === 'break_complete'
                    ? `已完成 ${focusAlarmModal.minutes} 分鐘休息，準備展開下一輪衝刺`
                    : `已完成 ${focusAlarmModal.minutes} 分鐘專注 · 今日累計 ${focusAlarmModal.studiedMinutes} / ${focusAlarmModal.goalMinutes} 分鐘`}
                </p>
              </div>
              <button type="button" className="arena-icon-btn" onClick={stopInAppFocusAlarm} aria-label="關閉鬧鐘">
                <X size={16} />
              </button>
            </div>

            {focusAlarmModal.playInAppLoop && (
              <div className="focus-alarm-ring-strip">
                <Volume2 size={14} className="alert-bell-wiggle" />
                <span>鬧鐘持續響鈴中，點擊下方任一按鈕即可停止</span>
              </div>
            )}

            <div className="focus-alarm-modal-actions">
              {focusAlarmModal.kind === 'break_complete' ? (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleStartFocus(focusAlarmModal.nextPresetMinutes || 25)}
                    style={{ width: '100%' }}
                  >
                    <Play size={15} /> 開始下一輪專注（{focusAlarmModal.nextPresetMinutes || 25} 分鐘）
                  </button>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => handleStartBreak(5)}>
                      <Clock size={14} /> 再休 5 分鐘
                    </button>
                    <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={stopInAppFocusAlarm}>
                      <BellOff size={14} /> 關閉鬧鐘
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleStartBreak(5)}
                    style={{ width: '100%' }}
                  >
                    <Clock size={15} /> 開始 5 分鐘休息倒數（結束再響鬧鐘）
                  </button>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleStartFocus(focusAlarmModal.minutes || 25)}
                    >
                      <Play size={14} /> 再專注 {focusAlarmModal.minutes || 25} 分
                    </button>
                    <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={stopInAppFocusAlarm}>
                      <BellOff size={14} /> 關閉鬧鐘
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals rendered outside app-shell (lazy-loaded on demand) */}
      <Suspense fallback={null}>
        {isCmdOpen && (
          <CommandPalette
            onClose={() => setIsCmdOpen(false)}
            trackerData={trackerData}
            theme={theme}
            onNavigateTab={setActiveTab}
            onPreviewFile={setSelectedFileForViewer}
            onTriggerSync={handleTriggerSync}
            onTriggerAlertTest={handleTriggerAlertTest}
            onStartFocus={handleStartFocus}
            onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenNewTask={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
            flashcardStats={flashcardStats}
            onOpenFlashcards={handleOpenFlashcards}
          />
        )}

        {selectedFileForViewer && (
          <ArtifactViewerModal
            key={`${selectedFileForViewer.path || selectedFileForViewer.title}-${selectedFileForViewer.startInEditMode ? 'edit' : 'view'}`}
            file={selectedFileForViewer}
            assetManifestVersion={assetManifestVersion}
            onContentSaved={handleFileContentSaved}
            onRequireUnlock={handleRequireUnlock}
            onClose={() => setSelectedFileForViewer(null)}
          />
        )}

        {isTaskModalOpen && (
          <CreateTaskModal
            onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
            onAdd={handleAddTask}
            initialTask={editingTask}
            courseOptions={courseOptions}
          />
        )}

        {isSettingsOpen && (
          <SettingsModal
            onClose={() => { setIsSettingsOpen(false); setSettingsInitialTab(null); }}
            initialTab={settingsInitialTab}
            appConfig={appConfig}
            onSaveAppConfig={handleSaveAppConfig}
            reminders={reminders}
            setReminders={handleUpdateReminders}
            onTriggerAlertTest={handleTriggerAlertTest}
            onOpenGraduationCredits={() => setIsCreditsModalOpen(true)}
            cloudStatus={cloudStatus}
            cloudAuth={cloudAuth}
            onForceCloudSync={() => syncFromCloud({ manual: true })}
            onOpenCloudUnlock={() => setIsUnlockModalOpen(true)}
            onLockCloudWrite={handleLockCloud}
            onCloudConfigSaved={() => syncFromCloud({ manual: true })}
            reducedMotionPref={reducedMotionPref}
            onChangeReducedMotionPref={setReducedMotionPref}
          />
        )}

        {isCreditsModalOpen && (
          <GraduationCreditsModal
            onClose={() => setIsCreditsModalOpen(false)}
            onRequireUnlock={handleRequireUnlock}
          />
        )}

        {isUnlockModalOpen && (
          <CloudUnlockModal
            isOpen={isUnlockModalOpen}
            onClose={() => setIsUnlockModalOpen(false)}
            canWrite={cloudAuth.canWrite}
            currentEmail={cloudAuth.email}
            pendingCount={cloudStatus.pendingCount}
            onUnlocked={async () => {
              const auth = await getCloudAuthState();
              setCloudAuth(auth);
              await syncFromCloud({ manual: false });
              showToast('已解鎖雲端寫入並同步完成', { tone: 'success' });
            }}
            onLocked={async () => {
              const auth = await getCloudAuthState();
              setCloudAuth(auth);
              showToast('已切換回唯讀模式');
            }}
          />
        )}
      </Suspense>
    </>
  );
}

export default App;
