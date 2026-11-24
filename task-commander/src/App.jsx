import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import DashboardHome from './components/DashboardHome';
import TaskBoard from './components/TaskBoard';
import CreateTaskModal from './components/CreateTaskModal';
import CourseSchedule from './components/CourseSchedule';
import SettingsModal from './components/SettingsModal';
import AssignmentsBoard from './components/AssignmentsBoard';
import ExamsDashboard from './components/ExamsDashboard';
import ArtifactVault from './components/ArtifactVault';
import ArtifactViewerModal from './components/ArtifactViewerModal';
import StickyNotesBoard from './components/StickyNotesBoard';
import CommandPalette from './components/CommandPalette';
import GraduationCreditsModal from './components/GraduationCreditsModal';
import CloudUnlockModal from './components/CloudUnlockModal';
import MobileBottomNav from './components/MobileBottomNav';
import TaskCommanderLogo from './components/TaskCommanderLogo';
import defaultTracker from './data/defaultTracker.json';
import {
  computeAcademicAlerts,
  getLocalDateKey,
} from './utils/academicUtils';
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
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen,
  Flame,
  Cloud,
  CloudOff,
  Lock,
  Unlock,
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
    showWindowsToast: true,
    snoozeMinutes: 30,
    dailyStudyGoalMinutes: 60,
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
  const today = new Date().toDateString();

  if (localStorage.getItem(TODAY_KEY) === today) {
    return Array.isArray(storedTasks) ? storedTasks : INITIAL_TASKS;
  }
  try { localStorage.setItem(TODAY_KEY, today); } catch {}
  return (Array.isArray(storedTasks) ? storedTasks : INITIAL_TASKS).map((task) =>
    task.category === 'Daily' ? { ...task, completed: false } : task
  );
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
  missions: '每日任務',
  notes: '桌面便條',
  vault: 'AI 成果庫',
  courses: '科目與課表',
};

function App() {
  const isElectron = Boolean(window.electronAPI?.isElectron);

  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280));
  const isMobile = !isElectron && viewportWidth < 768;
  const isTablet = !isElectron && viewportWidth >= 768 && viewportWidth < 1024;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (!isElectron && typeof window !== 'undefined' && window.innerWidth < 1024) return true;
    return localStorage.getItem('wt_sidebar_collapsed') === 'true';
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('wt_theme') || 'light');
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
    secondsLeft: 25 * 60,
    isRunning: false,
  });
  const focusSecondsAccRef = useRef(0);

  // Cloud Sync & Auth States
  const [cloudStatus, setCloudStatus] = useState(getSyncStatus);
  const [cloudAuth, setCloudAuth] = useState({ configured: false, canWrite: false, email: '' });
  const [assetManifestVersion, setAssetManifestVersion] = useState(0);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

  // Modals & Overlays
  const [selectedFileForViewer, setSelectedFileForViewer] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [globalToast, setGlobalToast] = useState('');

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
  const hasPromptedUnlockRef = useRef(false);

  useEffect(() => { trackerRef.current = trackerData; }, [trackerData]);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);
  useEffect(() => { deletedTaskIdsRef.current = deletedTaskIds; }, [deletedTaskIds]);
  useEffect(() => { remindersRef.current = reminders; }, [reminders]);
  useEffect(() => { reminderCompletionsRef.current = reminderCompletions; }, [reminderCompletions]);
  useEffect(() => { studyLogRef.current = studyLog; }, [studyLog]);

  const todayDateStr = new Date().toDateString();

  const showToast = useCallback((msg) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast((cur) => (cur === msg ? '' : cur)), 3200);
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
      setTasks(merged.items);
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

  // Pomodoro Focus Countdown Effect
  useEffect(() => {
    if (!focusState.isRunning) return;
    const timer = window.setInterval(() => {
      focusSecondsAccRef.current += 1;
      if (focusSecondsAccRef.current >= 60) {
        focusSecondsAccRef.current -= 60;
        const key = getLocalDateKey();
        setStudyLog((prev) => {
          const next = { ...prev, [key]: (Number(prev[key]) || 0) + 1 };
          pushCloudDoc(SYNC_KEYS.STUDY_LOG, { log: next, updatedAt: new Date().toISOString() });
          return next;
        });
      }

      setFocusState((prev) => {
        if (prev.secondsLeft <= 1) {
          window.electronAPI?.sendNotification?.({
            title: '🎉 專注讀書時段完成！',
            body: `已完成 ${prev.presetMinutes} 分鐘專注，適度休息 5 分鐘再繼續衝刺。`,
          });
          return { ...prev, isRunning: false, secondsLeft: prev.presetMinutes * 60 };
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [focusState.isRunning]);

  const handleStartFocus = useCallback((customMinutes) => {
    setFocusState((prev) => {
      if (typeof customMinutes === 'number' && customMinutes > 0) {
        return { presetMinutes: customMinutes, secondsLeft: customMinutes * 60, isRunning: true };
      }
      return { ...prev, isRunning: true };
    });
  }, []);

  const handlePauseFocus = useCallback(() => {
    setFocusState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const handleResetFocus = useCallback(() => {
    focusSecondsAccRef.current = 0;
    setFocusState((prev) => ({ ...prev, isRunning: false, secondsLeft: prev.presetMinutes * 60 }));
  }, []);

  const handleChangePreset = useCallback((mins) => {
    focusSecondsAccRef.current = 0;
    setFocusState({ presetMinutes: mins, secondsLeft: mins * 60, isRunning: false });
  }, []);

  // Sync live study & pending daily task status to Electron main alert engine
  useEffect(() => {
    if (!window.electronAPI?.updateStudyState) return;
    const pendingDaily = tasks.filter((t) => t.category === 'Daily' && !t.completed).map((t) => t.title);
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
      unsubs.push(window.electronAPI.onStartFocusTimer(({ minutes }) => {
        setActiveTab('dashboard');
        handleStartFocus(minutes || 25);
        showToast(`已啟動 ${minutes || 25} 分鐘讀書專注模式`);
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
    return () => {
      unsubRealtime();
      unsubs.forEach((fn) => typeof fn === 'function' && fn());
    };
  }, [handleStartFocus, showToast, syncFromCloud, applyRemoteDoc]);

  // Daily task auto-reset at midnight
  useEffect(() => {
    const timer = window.setInterval(() => {
      const today = new Date().toDateString();
      if (localStorage.getItem(TODAY_KEY) === today) return;
      setTasks((prev) => prev.map((t) => (t.category === 'Daily' ? { ...t, completed: false } : t)));
      try { localStorage.setItem(TODAY_KEY, today); } catch {}
    }, 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Global keyboard shortcuts (Ctrl+K, Esc)
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isUnlockModalOpen) setIsUnlockModalOpen(false);
        else if (isCmdOpen) setIsCmdOpen(false);
        else if (selectedFileForViewer) setSelectedFileForViewer(null);
        else if (isCreditsModalOpen) setIsCreditsModalOpen(false);
        else if (isSettingsOpen) setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isUnlockModalOpen, isCmdOpen, selectedFileForViewer, isCreditsModalOpen, isSettingsOpen]);

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
    if (!trackerData?.exams) return;
    const updatedExams = trackerData.exams.filter((e) => e.id !== examId);
    const prevDel = Array.isArray(trackerData._deleted_exam_ids) ? trackerData._deleted_exam_ids : [];
    const nextDel = prevDel.includes(examId) ? prevDel : [...prevDel, examId].slice(-200);
    await persistTracker({ ...trackerData, exams: updatedExams, _deleted_exam_ids: nextDel }, SYNC_KEYS.EXAMS);
  }, [trackerData, persistTracker]);

  // Deliverables Handlers
  const handleSaveDeliverables = useCallback(async (updatedDeliverables) => {
    await persistTracker({ ...trackerData, deliverables: updatedDeliverables }, SYNC_KEYS.DELIVERABLES);
  }, [trackerData, persistTracker]);

  const handleAddDeliverable = useCallback(async (newDeliverable) => {
    const prev = trackerData?.deliverables || [];
    const stamped = { ...newDeliverable, updatedAt: newDeliverable.updatedAt || new Date().toISOString().slice(0, 10) };
    await persistTracker({ ...trackerData, deliverables: [stamped, ...prev] }, SYNC_KEYS.DELIVERABLES);
  }, [trackerData, persistTracker]);

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
    commitTasks(tasksRef.current.map((t) => (t.id === taskId ? { ...t, completed: true, updatedAt: nowIso } : t)));
  };
  const handleUncompleteTask = (taskId) => {
    const nowIso = new Date().toISOString();
    commitTasks(tasksRef.current.map((t) => (t.id === taskId ? { ...t, completed: false, updatedAt: nowIso } : t)));
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
    const nextDeleted = deletedTaskIdsRef.current.includes(taskId)
      ? deletedTaskIdsRef.current
      : [...deletedTaskIdsRef.current, taskId].slice(-200);
    commitTasks(tasksRef.current.filter((t) => t.id !== taskId), nextDeleted);
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
    () => tasks.filter((t) => t.category === 'Daily' && !t.completed).length,
    [tasks]
  );
  const courseOptions = useMemo(
    () => [...new Set((trackerData?.courses || []).map((c) => c.name).filter(Boolean))],
    [trackerData?.courses]
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
        >
          <CloudOff size={13} />
          {!compact && <span>未連雲端</span>}
        </button>
      );
    }
    const isSynced = cloudStatus.status === 'synced';
    const isSyncingNow = cloudStatus.status === 'syncing';
    const isOffline = cloudStatus.status === 'offline';

    return (
      <button
        type="button"
        className={`cloud-status-pill ${cloudAuth.canWrite ? 'is-unlocked' : 'is-readonly'} ${isOffline ? 'is-offline' : ''}`}
        onClick={() => setIsUnlockModalOpen(true)}
        title={cloudAuth.canWrite ? '雲端雙向即時同步中（點擊管理解鎖狀態）' : '公開唯讀模式（點擊輸入密碼解鎖寫入）'}
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
              >
                {sidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
              </button>
            </div>

            <nav className="sidebar-nav">
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
            </nav>

            {/* 側欄底部狀態與快捷工具 */}
            <div className="sidebar-footer">
              {focusState.isRunning && (
                <button
                  type="button"
                  className="sidebar-focus-pill"
                  onClick={() => setActiveTab('dashboard')}
                  title="點擊回到專注計時器"
                >
                  <Flame size={14} />
                  {!sidebarCollapsed && <span>專注中 {focusTimerLabel}</span>}
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
                    >
                      <BellRing size={14} />
                    </button>
                    <button
                      type="button"
                      className={`win-btn ${isPinned ? 'active' : ''}`}
                      onClick={handleTogglePin}
                      title={isPinned ? '已置頂（點擊解除）' : '視窗置頂'}
                    >
                      <Pin size={14} />
                    </button>
                    <div className="win-divider" />
                    <button
                      type="button"
                      className="win-btn"
                      onClick={() => window.electronAPI?.minimizeWindow?.()}
                      title="最小化"
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      type="button"
                      className="win-btn"
                      onClick={handleToggleMaximize}
                      title={isMaximized ? '還原視窗大小' : '最大化'}
                    >
                      {isMaximized ? <Copy size={13} /> : <Square size={12} />}
                    </button>
                    <button
                      type="button"
                      className="win-btn close"
                      onClick={() => window.electronAPI?.closeWindow?.()}
                      title={appConfig?.minimizeToTray ? '縮小至系統匣背景執行' : '關閉視窗'}
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

          <main className="app-main-scrollable">
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
                onPauseFocus={handlePauseFocus}
                onResetFocus={handleResetFocus}
                onChangePreset={handleChangePreset}
                studyMinutesToday={studyMinutesToday}
                dailyStudyGoalMinutes={appConfig?.alerts?.dailyStudyGoalMinutes || 60}
              />
            )}

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
              />
            )}

            {activeTab === 'notes' && <StickyNotesBoard onRequireUnlock={handleRequireUnlock} />}

            {activeTab === 'vault' && (
              <ArtifactVault
                deliverables={trackerData?.deliverables || []}
                courses={trackerData?.courses || []}
                onPreviewFile={setSelectedFileForViewer}
                onSaveDeliverables={handleSaveDeliverables}
                onAddDeliverable={handleAddDeliverable}
                onRequireUnlock={handleRequireUnlock}
                assetManifestVersion={assetManifestVersion}
              />
            )}

            {activeTab === 'courses' && (
              <CourseSchedule
                currentCourses={trackerData?.courses || []}
                onOpenGraduationCredits={() => setIsCreditsModalOpen(true)}
              />
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

      {/* Global Toast */}
      {globalToast && (
        <div className="explorer-toast">{globalToast}</div>
      )}

      {/* Modals rendered outside app-shell */}
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
        />
      )}

      {selectedFileForViewer && (
        <ArtifactViewerModal
          key={selectedFileForViewer.path || selectedFileForViewer.title}
          file={selectedFileForViewer}
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
          onClose={() => setIsSettingsOpen(false)}
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
            showToast('已解鎖雲端寫入並同步完成');
          }}
          onLocked={async () => {
            const auth = await getCloudAuthState();
            setCloudAuth(auth);
            showToast('已切換回唯讀模式');
          }}
        />
      )}
    </>
  );
}

export default App;
