import { getSupabaseClient, getResolvedCloudConfig } from './supabaseClient';

export const ASSET_BUCKET = 'study-assets';
const MANIFEST_CACHE_KEY = 'tc_asset_manifest_v1';

let manifestState = loadCachedManifest();
const manifestListeners = new Set();

function loadCachedManifest() {
  try {
    const raw = localStorage.getItem(MANIFEST_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.files === 'object') return parsed;
    }
  } catch {}
  return { files: {}, updatedAt: null };
}

function saveCachedManifest(next) {
  try {
    localStorage.setItem(MANIFEST_CACHE_KEY, JSON.stringify(next));
  } catch {}
}

export function normalizeAssetPath(relPath) {
  return String(relPath || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/\/{2,}/g, '/');
}

export function isReferencePath(relPath) {
  return normalizeAssetPath(relPath).startsWith('Reference/');
}

export function getAssetManifest() {
  return manifestState;
}

export function setAssetManifest(nextPayload) {
  if (!nextPayload || typeof nextPayload !== 'object') return manifestState;
  const normalizedFiles = {};
  const source = nextPayload.files && typeof nextPayload.files === 'object' ? nextPayload.files : {};
  for (const [k, v] of Object.entries(source)) {
    if (v && v.storageKey) {
      normalizedFiles[normalizeAssetPath(k)] = v;
    }
  }
  manifestState = {
    files: normalizedFiles,
    updatedAt: nextPayload.updatedAt || new Date().toISOString(),
  };
  saveCachedManifest(manifestState);
  manifestListeners.forEach((cb) => {
    try { cb(manifestState); } catch {}
  });
  return manifestState;
}

export function subscribeAssetManifest(cb) {
  manifestListeners.add(cb);
  return () => manifestListeners.delete(cb);
}

export function getAssetManifestEntry(relPath) {
  const norm = normalizeAssetPath(relPath);
  if (!norm) return null;
  return manifestState.files?.[norm] || null;
}

export function isAssetAvailableOnCloud(relPath) {
  const raw = String(relPath || '').trim();
  if (/^https?:\/\//i.test(raw)) return true;
  return Boolean(getAssetManifestEntry(raw));
}

export function getCloudAssetUrl(relPath) {
  const raw = String(relPath || '').trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;

  const entry = getAssetManifestEntry(raw);
  if (!entry?.storageKey) return null;

  const cfg = getResolvedCloudConfig();
  if (!cfg.configured) return null;

  const client = getSupabaseClient();
  if (!client) return null;

  const { data } = client.storage.from(ASSET_BUCKET).getPublicUrl(entry.storageKey);
  if (!data?.publicUrl) return null;

  const versionTag = entry.sha256 ? `?v=${entry.sha256.slice(0, 10)}` : '';
  return `${data.publicUrl}${versionTag}`;
}

export async function fetchCloudAssetText(relPath) {
  const url = getCloudAssetUrl(relPath);
  if (!url) {
    return { success: false, notUploaded: true, error: '此檔案尚未同步至雲端儲存庫' };
  }
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) {
      return { success: false, error: `雲端檔案讀取失敗 (HTTP ${res.status})` };
    }
    const content = await res.text();
    return { success: true, content, url };
  } catch (err) {
    return { success: false, error: err?.message || '讀取雲端檔案時發生網路錯誤' };
  }
}

async function sha256HexFromBuffer(buffer) {
  if (globalThis.crypto?.subtle) {
    const hashBuf = await globalThis.crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback deterministic FNV-like hex when crypto.subtle unavailable (non-secure HTTP LAN)
  const bytes = new Uint8Array(buffer);
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < bytes.length; i++) {
    h1 = Math.imul(h1 ^ bytes[i], 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ bytes[i], 0x85ebca6b) >>> 0;
  }
  return `${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}${bytes.length.toString(16).padStart(8, '0')}`;
}

export async function computeStorageKeyForPath(relPath) {
  const norm = normalizeAssetPath(relPath);
  const extMatch = norm.match(/\.([a-z0-9]+)$/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'bin';
  const encoded = new TextEncoder().encode(norm);
  const pathHash = await sha256HexFromBuffer(encoded);
  return `files/${pathHash.slice(0, 24)}.${ext}`;
}

function guessContentType(filename, fallbackType = '') {
  const ext = String(filename || '').split('.').pop()?.toLowerCase() || '';
  const map = {
    md: 'text/markdown; charset=utf-8',
    txt: 'text/plain; charset=utf-8',
    html: 'text/html; charset=utf-8',
    htm: 'text/html; charset=utf-8',
    json: 'application/json; charset=utf-8',
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    gif: 'image/gif',
  };
  return map[ext] || fallbackType || 'application/octet-stream';
}

export async function uploadBrowserFileToCloud(file, targetRelativePath, pushManifestFn) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: '尚未設定 Supabase 雲端連線' };
  }
  if (!file) {
    return { success: false, error: '未選擇檔案' };
  }
  if (file.size > 15 * 1024 * 1024) {
    return { success: false, error: '檔案超過 15 MB 雲端上限，大型參考檔請保留於本機' };
  }

  const normPath = normalizeAssetPath(targetRelativePath);
  if (!normPath) {
    return { success: false, error: '檔案相對路徑無效' };
  }

  try {
    const buf = await file.arrayBuffer();
    const contentSha = await sha256HexFromBuffer(buf);
    const storageKey = await computeStorageKeyForPath(normPath);
    const contentType = guessContentType(normPath, file.type);

    const { error: uploadErr } = await client.storage
      .from(ASSET_BUCKET)
      .upload(storageKey, buf, {
        contentType,
        upsert: true,
        cacheControl: '3600',
      });

    if (uploadErr) {
      const isAuthErr = /row-level security|unauthorized|permission|jwt|403/i.test(uploadErr.message || '');
      return {
        success: false,
        authRequired: isAuthErr,
        error: isAuthErr ? '需要解鎖雲端編輯權限才能上傳檔案' : uploadErr.message,
      };
    }

    const entry = {
      storageKey,
      contentType,
      size: file.size,
      sha256: contentSha,
      updatedAt: new Date().toISOString(),
    };

    const nextManifest = {
      files: {
        ...(manifestState.files || {}),
        [normPath]: entry,
      },
      updatedAt: new Date().toISOString(),
    };

    setAssetManifest(nextManifest);

    if (typeof pushManifestFn === 'function') {
      await pushManifestFn(nextManifest);
    }

    return {
      success: true,
      relativePath: normPath,
      entry,
      url: getCloudAssetUrl(normPath),
    };
  } catch (err) {
    return { success: false, error: err?.message || '上傳雲端失敗' };
  }
}

