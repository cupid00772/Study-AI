import { createClient } from '@supabase/supabase-js';

const DEVICE_ID_KEY = 'tc_device_id';
const OVERRIDE_URL_KEY = 'tc_cloud_override_url';
const OVERRIDE_ANON_KEY = 'tc_cloud_override_anon_key';
const OVERRIDE_OWNER_EMAIL_KEY = 'tc_cloud_owner_email';

let cachedClient = null;
let cachedConfigSig = '';
let runtimeElectronConfig = null;
let authListeners = new Set();
let authSubscription = null;

function safeGetStorage(key) {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function safeSetStorage(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {}
}

export function getDeviceId() {
  let id = safeGetStorage(DEVICE_ID_KEY);
  if (id) return id;

  const isElectron = Boolean(typeof window !== 'undefined' && window.electronAPI?.isElectron);
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let prefix = 'web';
  if (isElectron) prefix = 'win-electron';
  else if (/iPad|Macintosh/i.test(ua) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1) prefix = 'ipad';
  else if (/iPhone|iPod/i.test(ua)) prefix = 'ios';

  const rand = (globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`).slice(0, 12);
  id = `${prefix}-${rand}`;
  safeSetStorage(DEVICE_ID_KEY, id);
  return id;
}

export async function loadRuntimeCloudConfig() {
  if (typeof window !== 'undefined' && window.electronAPI?.getCloudConfig) {
    try {
      const cfg = await window.electronAPI.getCloudConfig();
      if (cfg && (cfg.url || cfg.anonKey || cfg.ownerEmail)) {
        runtimeElectronConfig = cfg;
      }
    } catch (err) {
      console.warn('Failed reading Electron runtime cloud config:', err);
    }
  }
  return getResolvedCloudConfig();
}

export function getResolvedCloudConfig() {
  const overrideUrl = safeGetStorage(OVERRIDE_URL_KEY).trim();
  const overrideAnonKey = safeGetStorage(OVERRIDE_ANON_KEY).trim();
  const overrideOwnerEmail = safeGetStorage(OVERRIDE_OWNER_EMAIL_KEY).trim();

  const envUrl = (import.meta.env?.VITE_SUPABASE_URL || '').trim();
  const envAnonKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY || '').trim();
  const envOwnerEmail = (import.meta.env?.VITE_OWNER_EMAIL || '').trim();

  const url = overrideUrl || runtimeElectronConfig?.url || envUrl || '';
  const anonKey = overrideAnonKey || runtimeElectronConfig?.anonKey || envAnonKey || '';
  const ownerEmail = overrideOwnerEmail || runtimeElectronConfig?.ownerEmail || envOwnerEmail || '';

  return {
    url,
    anonKey,
    ownerEmail,
    configured: Boolean(url && anonKey && /^https?:\/\//i.test(url)),
    hasLocalOverride: Boolean(overrideUrl || overrideAnonKey),
  };
}

export function saveCloudConfigOverride({ url = '', anonKey = '', ownerEmail = '' }) {
  safeSetStorage(OVERRIDE_URL_KEY, url.trim());
  safeSetStorage(OVERRIDE_ANON_KEY, anonKey.trim());
  safeSetStorage(OVERRIDE_OWNER_EMAIL_KEY, ownerEmail.trim());
  cachedClient = null;
  cachedConfigSig = '';
  if (authSubscription) {
    try { authSubscription.unsubscribe(); } catch {}
    authSubscription = null;
  }
  return getSupabaseClient();
}

export function getSupabaseClient() {
  const cfg = getResolvedCloudConfig();
  if (!cfg.configured) return null;

  const sig = `${cfg.url}|${cfg.anonKey}`;
  if (cachedClient && cachedConfigSig === sig) {
    return cachedClient;
  }

  if (authSubscription) {
    try { authSubscription.unsubscribe(); } catch {}
    authSubscription = null;
  }

  cachedClient = createClient(cfg.url, cfg.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: 'tc_supabase_auth_v1',
    },
    realtime: {
      params: {
        eventsPerSecond: 4,
      },
    },
  });
  cachedConfigSig = sig;

  const { data } = cachedClient.auth.onAuthStateChange((_event, session) => {
    const nextState = {
      configured: true,
      canWrite: Boolean(session?.user),
      user: session?.user || null,
      email: session?.user?.email || cfg.ownerEmail || '',
    };
    authListeners.forEach((cb) => {
      try { cb(nextState); } catch {}
    });
  });
  authSubscription = data?.subscription || null;

  return cachedClient;
}

export async function getCloudAuthState() {
  const cfg = getResolvedCloudConfig();
  if (!cfg.configured) {
    return {
      configured: false,
      canWrite: false,
      user: null,
      email: cfg.ownerEmail || '',
    };
  }
  const client = getSupabaseClient();
  if (!client) {
    return { configured: false, canWrite: false, user: null, email: cfg.ownerEmail || '' };
  }
  try {
    const { data } = await client.auth.getSession();
    const session = data?.session || null;
    return {
      configured: true,
      canWrite: Boolean(session?.user),
      user: session?.user || null,
      email: session?.user?.email || cfg.ownerEmail || '',
    };
  } catch {
    return { configured: true, canWrite: false, user: null, email: cfg.ownerEmail || '' };
  }
}

export async function unlockCloudWrite(email, password) {
  await loadRuntimeCloudConfig();
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: '尚未設定 Supabase 連線資訊' };
  }
  const trimmedEmail = String(email || '').trim();
  const trimmedPassword = String(password || '');
  if (!trimmedEmail || !trimmedPassword) {
    return { success: false, error: '請輸入編輯帳號 Email 與密碼' };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword,
    });
    if (error) {
      return { success: false, error: error.message || '驗證失敗，請確認帳號與密碼' };
    }
    safeSetStorage(OVERRIDE_OWNER_EMAIL_KEY, trimmedEmail);
    return { success: true, user: data?.user || null };
  } catch (err) {
    return { success: false, error: err?.message || '網路連線異常' };
  }
}

export async function lockCloudWrite() {
  const client = getSupabaseClient();
  if (!client) return { success: true };
  try {
    await client.auth.signOut();
    return { success: true };
  } catch (err) {
    return { success: false, error: err?.message || '登出失敗' };
  }
}

export function subscribeCloudAuth(callback) {
  authListeners.add(callback);
  getSupabaseClient(); // ensure auth listener attached
  return () => authListeners.delete(callback);
}

