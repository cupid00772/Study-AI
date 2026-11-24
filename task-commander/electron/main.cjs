const { app, BrowserWindow, ipcMain, shell, Notification, dialog, Menu, Tray, screen, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process');

// Windows 通知與工作列識別碼（確保 Toast 顯示正確名稱與圖示）
app.setAppUserModelId('com.cupid.task-commander');

// 允許背景自動彈出的警告視窗直接播放簡短警告音效（不受瀏覽器自動播放手勢限制）
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// 徹底關閉原生選單列，防止 Windows 在無邊框模式下產生空白白色橫條
Menu.setApplicationMenu(null);

// ==========================================
// 1. 單一執行個體鎖 (Single Instance Lock)
// ==========================================
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  return;
}

const isDev = !app.isPackaged;
const startHidden = process.argv.includes('--hidden') || process.argv.includes('--startup');

let mainWindow = null;
let alertWindow = null;
let dailyWindow = null;
let tray = null;
let isQuitting = false;
const stickyWindows = new Map(); // noteId -> BrowserWindow

let trackerWatcher = null;
let deliverablesWatchers = [];
let watcherDebounceTimer = null;
let deliverablesDebounceTimer = null;
let boundsDebounceTimer = null;
let alertSchedulerInterval = null;
let autoSyncInterval = null;
let isSyncRunning = false;
let isCloudAssetSyncing = false;
let cloudSyncQueuePromise = Promise.resolve();
const pendingModifiedAssetPaths = new Set();
let lastSelfTrackerWriteAt = 0;
let latestAlertPayload = null;
let lastStudyState = {
  studyMinutesToday: 0,
  dailyStudyGoalMinutes: 60,
  pendingDailyTasks: [],
  isFocusActive: false,
  updatedAt: null,
};

// ==========================================
// 2. 動態偵測 Study-space 工作區根目錄（零寫死絕對路徑）
// ==========================================
function getUserDataFile(filename) {
  try {
    return path.join(app.getPath('userData'), filename);
  } catch {
    return path.join(process.cwd(), filename);
  }
}

function readJsonSafe(filePath, fallback) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error(`Failed reading JSON ${filePath}:`, err.message);
  }
  return fallback;
}

function writeJsonSafe(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Failed writing JSON ${filePath}:`, err.message);
    return false;
  }
}

function findWorkspaceRoot() {
  const savedMeta = readJsonSafe(getUserDataFile('workspace.json'), {});
  const exeDir = path.dirname(app.getPath('exe'));
  const bundledMeta = readJsonSafe(path.join(exeDir, 'workspace.json'), {});

  const rootsToCheck = [
    savedMeta?.workspaceRoot,
    bundledMeta?.workspaceRoot,
    process.env.STUDY_SPACE_ROOT,
    process.env.PORTABLE_EXECUTABLE_DIR,
    process.cwd(),
    __dirname,
    app.getAppPath(),
    exeDir,
  ].filter(Boolean);

  const candidates = [];
  for (const base of rootsToCheck) {
    let cur = path.resolve(base);
    for (let depth = 0; depth <= 4; depth++) {
      if (!candidates.includes(cur)) candidates.push(cur);
      const parent = path.dirname(cur);
      if (parent === cur) break;
      cur = parent;
    }
  }

  // 動態 OS 常見目錄備援（不使用特定使用者名稱）
  try {
    const dl = path.join(app.getPath('downloads'), 'Study-space');
    const docs = path.join(app.getPath('documents'), 'Study-space');
    candidates.push(dl, docs);
  } catch {}

  for (const cand of candidates) {
    if (fs.existsSync(path.join(cand, 'academic_tracker.json'))) {
      return cand;
    }
  }

  return savedMeta?.workspaceRoot || bundledMeta?.workspaceRoot || process.cwd();
}

let workspaceRoot = findWorkspaceRoot();
let trackerPath = path.join(workspaceRoot, 'academic_tracker.json');

function setWorkspaceRoot(newRoot) {
  if (!newRoot || !fs.existsSync(newRoot)) return false;
  workspaceRoot = path.resolve(newRoot);
  trackerPath = path.join(workspaceRoot, 'academic_tracker.json');
  writeJsonSafe(getUserDataFile('workspace.json'), { workspaceRoot });
  setupTrackerWatcher();
  setupDeliverablesWatcher();
  const data = readTrackerFromDisk();
  if (data && mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('tracker-updated', data);
  }
  return true;
}

// ==========================================
// 3. 系統與警告設定持久化
// ==========================================
let alertWindowAnchor = null;
let alertShakeTimers = [];
let isAlertShakingPulse = false;
let alertWindowShownAt = 0;

const DEFAULT_ALERT_SOUND_CONFIG = {
  volume: 0.75,
  repeatIntervalMs: 2500,
  shakeEnabled: true,
  separateCriticalSound: false,
  normalSound: { type: 'preset', id: 'classic-chime', label: '清脆警報（經典預設）' },
  criticalSound: { type: 'preset', id: 'urgent-radar', label: '雷達急促警示' },
};

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
    showWindowsToast: true,
    snoozeMinutes: 30,
    dailyStudyGoalMinutes: 60,
    soundConfig: { ...DEFAULT_ALERT_SOUND_CONFIG },
  },
};

function mergeConfig(saved) {
  const base = saved && typeof saved === 'object' ? saved : {};
  const savedSound = base.alerts?.soundConfig && typeof base.alerts.soundConfig === 'object'
    ? base.alerts.soundConfig
    : {};
  return {
    ...DEFAULT_APP_CONFIG,
    ...base,
    alerts: {
      ...DEFAULT_APP_CONFIG.alerts,
      ...(base.alerts || {}),
      dailyTriggerTimes: Array.isArray(base.alerts?.dailyTriggerTimes) && base.alerts.dailyTriggerTimes.length > 0
        ? base.alerts.dailyTriggerTimes
        : DEFAULT_APP_CONFIG.alerts.dailyTriggerTimes,
      soundConfig: {
        ...DEFAULT_ALERT_SOUND_CONFIG,
        ...savedSound,
        normalSound: savedSound.normalSound?.type
          ? { ...savedSound.normalSound }
          : { ...DEFAULT_ALERT_SOUND_CONFIG.normalSound },
        criticalSound: savedSound.criticalSound?.type
          ? { ...savedSound.criticalSound }
          : { ...DEFAULT_ALERT_SOUND_CONFIG.criticalSound },
      },
    },
  };
}

let appConfig = mergeConfig(readJsonSafe(getUserDataFile('app-config.json'), {}));

function saveAppConfig(nextConfig) {
  appConfig = mergeConfig(nextConfig);
  writeJsonSafe(getUserDataFile('app-config.json'), appConfig);
  setupAutoSyncTimer();
  setupDeliverablesWatcher();
  refreshTrayMenu();
  return appConfig;
}

function loadAlertState() {
  return readJsonSafe(getUserDataFile('alert-state.json'), {
    triggeredSlots: {},
    mutedDate: null,
    snoozeUntil: 0,
    lastStartupCheckDate: null,
  });
}

function saveAlertState(state) {
  writeJsonSafe(getUserDataFile('alert-state.json'), state);
}

// ==========================================
// 4. 視窗形狀裁剪與狀態記憶
// ==========================================
function getRoundedRectRegions(width, height, radius) {
  const rects = [];
  const r = Math.min(radius, Math.floor(width / 2), Math.floor(height / 2));
  if (r <= 0) return [{ x: 0, y: 0, width, height }];
  for (let y = 0; y < r; y++) {
    const dy = r - y - 1;
    const dx = Math.round(r - Math.sqrt(Math.max(0, r * r - dy * dy)));
    rects.push({ x: dx, y, width: width - 2 * dx, height: 1 });
  }
  rects.push({ x: 0, y: r, width, height: height - 2 * r });
  for (let i = 0; i < r; i++) {
    const y = height - r + i;
    const dx = Math.round(r - Math.sqrt(Math.max(0, r * r - i * i)));
    rects.push({ x: dx, y, width: width - 2 * dx, height: 1 });
  }
  return rects;
}

function applyWindowShape(win, radius = 22) {
  if (!win || win.isDestroyed()) return;
  try {
    if (win.isMaximized()) {
      if (typeof win.setShape === 'function') win.setShape([]);
      return;
    }
    const bounds = win.getBounds();
    const regions = getRoundedRectRegions(bounds.width, bounds.height, radius);
    if (typeof win.setShape === 'function') {
      win.setShape(regions);
    }
  } catch (err) {
    console.error('Error applying window shape:', err);
  }
}

function attachExternalLinkHandler(win) {
  if (!win || win.isDestroyed()) return;
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
}

function loadWindowState() {
  const data = readJsonSafe(getUserDataFile('window-state.json'), {});
  return {
    width: typeof data.width === 'number' && data.width >= 900 ? data.width : 1280,
    height: typeof data.height === 'number' && data.height >= 640 ? data.height : 840,
    x: typeof data.x === 'number' && data.x > -2000 ? data.x : undefined,
    y: typeof data.y === 'number' && data.y > -2000 ? data.y : undefined,
    isPinned: !!data.isPinned,
  };
}

function saveWindowState(bounds, isPinned) {
  if (!bounds || bounds.x < -1000 || bounds.y < -1000 || bounds.width < 400 || bounds.height < 300) return;
  const existing = readJsonSafe(getUserDataFile('window-state.json'), {});
  writeJsonSafe(getUserDataFile('window-state.json'), {
    ...existing,
    x: Math.round(bounds.x),
    y: Math.round(bounds.y),
    width: Math.round(bounds.width),
    height: Math.round(bounds.height),
    isPinned: isPinned !== undefined ? !!isPinned : !!existing.isPinned,
  });
}

function getAppIconPath(preferPng = false) {
  const candidates = preferPng
    ? [
        path.join(__dirname, '..', 'public', 'icon.png'),
        path.join(__dirname, '..', 'dist', 'icon.png'),
        path.join(__dirname, '..', 'public', 'icon.ico'),
      ]
    : [
        path.join(__dirname, '..', 'public', 'icon.ico'),
        path.join(__dirname, '..', 'dist', 'icon.ico'),
        path.join(__dirname, '..', 'public', 'icon.png'),
      ];
  return candidates.find((p) => fs.existsSync(p)) || candidates[0];
}

// ==========================================
// 5. 主視窗建立與生命週期
// ==========================================
function showMainWindow(tabToNavigate = null) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow(false);
  }
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
  if (tabToNavigate) {
    mainWindow.webContents.send('navigate-tab', tabToNavigate);
  }
}

function createWindow(initiallyHidden = startHidden) {
  const savedState = loadWindowState();

  mainWindow = new BrowserWindow({
    width: savedState.width,
    height: savedState.height,
    x: savedState.x,
    y: savedState.y,
    minWidth: 960,
    minHeight: 640,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    thickFrame: false,
    roundedCorners: false,
    backgroundMaterial: 'none',
    autoHideMenuBar: true,
    title: 'Task Commander',
    show: false,
    alwaysOnTop: !!savedState.isPinned,
    icon: getAppIconPath(false),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  attachExternalLinkHandler(mainWindow);

  mainWindow.webContents.on('page-title-updated', (e) => e.preventDefault());

  const keepTransparent = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setBackgroundColor('#00000000');
    }
  };
  mainWindow.on('blur', keepTransparent);
  mainWindow.on('focus', keepTransparent);

  mainWindow.once('ready-to-show', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      applyWindowShape(mainWindow, 22);
      if (!initiallyHidden) {
        mainWindow.show();
      }
    }
  });

  mainWindow.on('resize', () => applyWindowShape(mainWindow, 22));
  mainWindow.on('maximize', () => {
    applyWindowShape(mainWindow, 0);
    mainWindow?.webContents.send('window-maximized-changed', true);
  });
  mainWindow.on('unmaximize', () => {
    applyWindowShape(mainWindow, 22);
    mainWindow?.webContents.send('window-maximized-changed', false);
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  const debouncedSaveBounds = () => {
    clearTimeout(boundsDebounceTimer);
    boundsDebounceTimer = setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isMaximized()) {
        saveWindowState(mainWindow.getBounds(), mainWindow.isAlwaysOnTop());
      }
    }, 350);
  };

  mainWindow.on('moved', debouncedSaveBounds);
  mainWindow.on('resized', debouncedSaveBounds);

  let notifiedTrayOnce = false;
  mainWindow.on('close', (e) => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isMaximized()) {
      saveWindowState(mainWindow.getBounds(), mainWindow.isAlwaysOnTop());
    }

    // 系統匣常駐模式：點擊關閉僅隱藏主視窗，背景持續運作警告與同步
    if (!isQuitting && appConfig.minimizeToTray && tray) {
      e.preventDefault();
      mainWindow.hide();
      if (!notifiedTrayOnce && Notification.isSupported()) {
        notifiedTrayOnce = true;
        new Notification({
          title: 'Task Commander 已縮小至系統匣',
          body: '作業截止、考前倒數與每日讀書提醒將於背景持續守護。右鍵系統匣圖示可完全退出。',
          icon: getAppIconPath(true),
        }).show();
      }
      return;
    }

    // 真正結束前保存所有獨立視窗座標
    for (const [noteId, win] of stickyWindows) {
      if (win && !win.isDestroyed()) updateStickyBounds(noteId, win.getBounds());
    }
    if (dailyWindow && !dailyWindow.isDestroyed()) {
      updateDailyBounds(dailyWindow.getBounds());
    }
  });

  mainWindow.on('closed', () => {
    for (const [, win] of stickyWindows) {
      if (!win.isDestroyed()) win.close();
    }
    stickyWindows.clear();
    if (dailyWindow && !dailyWindow.isDestroyed()) dailyWindow.close();
    dailyWindow = null;
    if (alertWindow && !alertWindow.isDestroyed()) alertWindow.close();
    alertWindow = null;
    mainWindow = null;
  });

  setupTrackerWatcher();
  setupDeliverablesWatcher();
}

// ==========================================
// 6. 系統匣 (System Tray) 與開機自啟
// ==========================================
function getAutoLaunchEnabled() {
  if (isDev) return !!appConfig.autoLaunch;
  try {
    const settings = app.getLoginItemSettings();
    return !!settings.openAtLogin;
  } catch {
    return !!appConfig.autoLaunch;
  }
}

function setAutoLaunchEnabled(enabled) {
  appConfig.autoLaunch = !!enabled;
  writeJsonSafe(getUserDataFile('app-config.json'), appConfig);
  if (!isDev) {
    try {
      app.setLoginItemSettings({
        openAtLogin: !!enabled,
        path: app.getPath('exe'),
        args: ['--hidden'],
      });
    } catch (err) {
      console.error('Failed to update login item settings:', err);
    }
  }
  refreshTrayMenu();
  return !!enabled;
}

function createTray() {
  if (tray) return;
  try {
    const iconPath = getAppIconPath(false);
    let icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) {
      icon = nativeImage.createFromPath(getAppIconPath(true));
    }
    tray = new Tray(icon);
    tray.setToolTip('Task Commander — 學業任務指揮中心');
    tray.on('click', () => {
      if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible()) {
        mainWindow.focus();
      } else {
        showMainWindow();
      }
    });
    tray.on('double-click', () => showMainWindow());
    refreshTrayMenu();
  } catch (err) {
    console.error('Failed creating system tray:', err);
  }
}

function refreshTrayMenu() {
  if (!tray) return;
  const menu = Menu.buildFromTemplate([
    { label: '開啟 Task Commander 主視窗', click: () => showMainWindow() },
    { label: '立即檢查並顯示今日警告', click: () => runAlertCheck({ manual: true }) },
    { label: isSyncRunning ? 'eeclass 同步中...' : '立即同步 eeclass 資料', enabled: !isSyncRunning, click: () => runEEClassSync('tray') },
    { label: '開啟桌面每日任務小工具', click: () => createDailyWindow() },
    { type: 'separator' },
    {
      label: '開機自動啟動（靜默常駐）',
      type: 'checkbox',
      checked: getAutoLaunchEnabled(),
      click: (item) => setAutoLaunchEnabled(item.checked),
    },
    {
      label: '關閉視窗時縮小至系統匣',
      type: 'checkbox',
      checked: !!appConfig.minimizeToTray,
      click: (item) => saveAppConfig({ ...appConfig, minimizeToTray: item.checked }),
    },
    { type: 'separator' },
    {
      label: '完全結束 Task Commander',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(menu);
}

// ==========================================
// 7. 雙軌強警告引擎（作業催繳 + 考前 7 天每日警告 + 每日讀書督促）
// ==========================================
const NOISE_KEYWORDS = [
  '出國補助', '補助申請', '國際菁英獎', '英語優等獎', '活動紀錄表',
  '英檢證明', '成績單繳交區', '英檢課堂加分', '多益', '問卷調查',
  '滿意度調查', '基本資料', '訪談紀錄', '不計分;不計次', '護照',
  '期中考-成績', '期末考-成績', '小考成績', '成績公告', '成績發布', '成績查詢',
];

function isNoiseItem(course, title) {
  const t = String(title || '');
  const c = String(course || '');
  if (NOISE_KEYWORDS.some((kw) => t.includes(kw))) return true;
  if ((c.includes('護照') || c.includes('導師班')) && !t.includes('作業') && !t.includes('習題') && !t.includes('心得')) {
    return true;
  }
  return false;
}

function getLocalDateKey(dateObj = new Date()) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseLocalDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const m = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0, 0);
}

function diffDaysFromToday(dateStr) {
  const target = parseLocalDate(dateStr);
  if (!target) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function computeAlertPayload(reason = 'scheduled') {
  const tracker = readTrackerFromDisk() || {};
  const cfg = appConfig.alerts || DEFAULT_APP_CONFIG.alerts;
  const ignoredIds = new Set(tracker.ignored_assignment_ids || []);

  // 1. 急迫與逾期作業
  const urgentAssignments = [];
  const overdueAssignments = [];
  for (const hw of tracker.assignments || []) {
    if (hw.status === 'completed' || ignoredIds.has(hw.id)) continue;
    if (isNoiseItem(hw.course, hw.title)) continue;
    const daysLeft = diffDaysFromToday(hw.dueDate);
    if (daysLeft === null) continue;
    if (daysLeft < 0) {
      if (cfg.includeOverdue) {
        overdueAssignments.push({ ...hw, daysLeft, overdueDays: Math.abs(daysLeft) });
      }
    } else if (daysLeft <= Number(cfg.assignmentLeadDays ?? 3)) {
      urgentAssignments.push({ ...hw, daysLeft });
    }
  }
  urgentAssignments.sort((a, b) => a.daysLeft - b.daysLeft);
  overdueAssignments.sort((a, b) => a.overdueDays - b.overdueDays);

  // 2. 考前 7 天內（含校曆官方考試週）
  const upcomingExams = [];
  const examLead = Number(cfg.examLeadDays ?? 7);
  for (const ex of tracker.exams || []) {
    if (ex.status === 'completed') continue;
    const daysLeft = diffDaysFromToday(ex.date);
    if (daysLeft !== null && daysLeft >= 0 && daysLeft <= examLead) {
      upcomingExams.push({
        id: ex.id,
        course: ex.course,
        title: ex.title,
        date: ex.date,
        time: ex.time || '',
        location: ex.location || '',
        scope: ex.scope || ex.description || '',
        daysLeft,
        isOfficialWeek: false,
      });
    }
  }
  for (const ev of tracker.calendar_events || []) {
    if (ev.category !== 'Official_Exam') continue;
    const daysLeft = diffDaysFromToday(ev.startDate);
    const endDaysLeft = ev.endDate ? diffDaysFromToday(ev.endDate) : daysLeft;
    if ((daysLeft !== null && daysLeft >= 0 && daysLeft <= examLead) || (daysLeft !== null && daysLeft < 0 && endDaysLeft >= 0)) {
      upcomingExams.push({
        id: ev.id,
        course: '中央大學校曆',
        title: ev.title,
        date: ev.endDate && ev.endDate !== ev.startDate ? `${ev.startDate} ~ ${ev.endDate}` : ev.startDate,
        time: '',
        location: '',
        scope: ev.description || '',
        daysLeft: Math.max(0, daysLeft),
        isOfficialWeek: true,
      });
    }
  }
  upcomingExams.sort((a, b) => a.daysLeft - b.daysLeft);

  // 3. 讀書督促狀態
  const goalMinutes = Number(cfg.dailyStudyGoalMinutes || lastStudyState.dailyStudyGoalMinutes || 60);
  const studiedMinutes = Number(lastStudyState.studyMinutesToday || 0);
  const pendingDailyTasks = Array.isArray(lastStudyState.pendingDailyTasks) ? lastStudyState.pendingDailyTasks : [];
  const needsStudyNudge = !!cfg.studyRemindersEnabled && (
    studiedMinutes < goalMinutes || pendingDailyTasks.length > 0 || upcomingExams.length > 0
  );

  const hasAlerts = upcomingExams.length > 0 || urgentAssignments.length > 0 || overdueAssignments.length > 0 || needsStudyNudge;

  return {
    generatedAt: new Date().toISOString(),
    todayKey: getLocalDateKey(),
    reason,
    hasAlerts,
    upcomingExams,
    urgentAssignments,
    overdueAssignments,
    study: {
      studiedMinutes,
      goalMinutes,
      pendingDailyTasks,
      needsStudyNudge,
      isFocusActive: !!lastStudyState.isFocusActive,
    },
    playSound: cfg.playAlertSound !== false,
    soundConfig: cfg.soundConfig || { ...DEFAULT_ALERT_SOUND_CONFIG },
    snoozeMinutes: Number(cfg.snoozeMinutes || 30),
  };
}

function stopAlertWindowShake() {
  for (const t of alertShakeTimers) clearTimeout(t);
  alertShakeTimers = [];
  if (alertWindow && !alertWindow.isDestroyed()) {
    try {
      alertWindow.flashFrame(false);
      if (isAlertShakingPulse && alertWindowAnchor) {
        alertWindow.setPosition(alertWindowAnchor.x, alertWindowAnchor.y);
      }
    } catch {}
  }
  isAlertShakingPulse = false;
}

function pulseAlertWindowShake() {
  if (!alertWindow || alertWindow.isDestroyed() || !alertWindow.isVisible()) return false;
  for (const t of alertShakeTimers) clearTimeout(t);
  alertShakeTimers = [];

  try {
    if (!isAlertShakingPulse || !alertWindowAnchor) {
      const [bx, by] = alertWindow.getPosition();
      alertWindowAnchor = { x: bx, y: by };
    }
    const { x: baseX, y: baseY } = alertWindowAnchor;
    isAlertShakingPulse = true;
    alertWindow.flashFrame(true);

    const offsets = [-9, 9, -7, 7, -5, 5, -3, 3, 0];
    offsets.forEach((dx, idx) => {
      const timer = setTimeout(() => {
        if (!alertWindow || alertWindow.isDestroyed()) return;
        try {
          alertWindow.setPosition(Math.round(baseX + dx), Math.round(baseY));
          if (idx === offsets.length - 1) {
            isAlertShakingPulse = false;
          }
        } catch {
          isAlertShakingPulse = false;
        }
      }, idx * 42);
      alertShakeTimers.push(timer);
    });
    return true;
  } catch {
    isAlertShakingPulse = false;
    return false;
  }
}

function getAlertSoundsDir() {
  const dir = path.join(app.getPath('userData'), 'alert-sounds');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function loadCustomAlertSoundsIndex() {
  const indexPath = path.join(getAlertSoundsDir(), 'index.json');
  const list = readJsonSafe(indexPath, []);
  if (!Array.isArray(list)) return [];
  const soundsDir = getAlertSoundsDir();
  return list.filter((item) => {
    if (!item?.fileName) return false;
    const safeName = path.basename(item.fileName);
    return fs.existsSync(path.join(soundsDir, safeName));
  });
}

function saveCustomAlertSoundsIndex(list) {
  const indexPath = path.join(getAlertSoundsDir(), 'index.json');
  writeJsonSafe(indexPath, list);
}

function createAlertWindow(payload) {
  latestAlertPayload = payload;
  const isManual = payload?.reason === 'manual';

  if (alertWindow && !alertWindow.isDestroyed()) {
    alertWindowShownAt = Date.now();
    alertWindow.webContents.send('alert-payload-updated', payload);
    if (alertWindow.isMinimized()) alertWindow.restore();
    if (isManual) {
      alertWindow.show();
      alertWindow.focus();
    } else {
      alertWindow.showInactive();
    }
    return alertWindow;
  }

  const display = screen.getPrimaryDisplay();
  const { width: sw, height: sh, x: sx, y: sy } = display.workArea;
  const winWidth = 490;
  const winHeight = Math.min(645, sh - 48);
  const posX = Math.round(sx + sw - winWidth - 24);
  const posY = Math.round(sy + sh - winHeight - 24);
  alertWindowAnchor = { x: posX, y: posY };

  alertWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: posX,
    y: posY,
    minWidth: 420,
    minHeight: 420,
    resizable: true,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    thickFrame: false,
    roundedCorners: false,
    backgroundMaterial: 'none',
    autoHideMenuBar: true,
    title: 'Task Commander 緊急提醒',
    alwaysOnTop: true,
    skipTaskbar: false,
    show: false,
    icon: getAppIconPath(false),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });

  alertWindow.setMenuBarVisibility(false);
  attachExternalLinkHandler(alertWindow);
  alertWindow.webContents.on('page-title-updated', (e) => e.preventDefault());

  const applyAlertShape = () => applyWindowShape(alertWindow, 20);
  alertWindow.once('ready-to-show', () => {
    if (alertWindow && !alertWindow.isDestroyed()) {
      applyAlertShape();
      alertWindowShownAt = Date.now();
      if (isManual) {
        alertWindow.show();
        alertWindow.focus();
      } else {
        alertWindow.showInactive();
      }
    }
  });
  alertWindow.on('resize', applyAlertShape);
  alertWindow.on('will-move', () => {
    if (!isAlertShakingPulse && alertWindow && !alertWindow.isDestroyed()) {
      stopAlertWindowShake();
      alertWindow.webContents.send('alert-user-interacted');
    }
  });
  alertWindow.on('focus', () => {
    // Ignore initial auto-focus right after popup; clicking anywhere (including drag header) after 450ms acknowledges alert
    if (Date.now() - alertWindowShownAt > 450 && alertWindow && !alertWindow.isDestroyed()) {
      stopAlertWindowShake();
      alertWindow.webContents.send('alert-user-interacted');
    }
  });
  alertWindow.on('moved', () => {
    if (!isAlertShakingPulse && alertWindow && !alertWindow.isDestroyed()) {
      const [nx, ny] = alertWindow.getPosition();
      alertWindowAnchor = { x: nx, y: ny };
    }
  });
  alertWindow.on('closed', () => {
    stopAlertWindowShake();
    alertWindow = null;
    alertWindowAnchor = null;
  });

  if (isDev) {
    alertWindow.loadURL('http://localhost:5173?mode=alert');
  } else {
    alertWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'), { search: '?mode=alert' });
  }

  return alertWindow;
}

function sendAlertToast(payload, suppressToastSound = false) {
  const cfg = appConfig.alerts || DEFAULT_APP_CONFIG.alerts;
  if (!Notification.isSupported() || !cfg.showWindowsToast) return;
  const headlines = [];
  if (payload.upcomingExams.length > 0) {
    const first = payload.upcomingExams[0];
    headlines.push(`🔥 考前倒數 ${first.daysLeft} 天：${first.title}`);
  }
  if (payload.urgentAssignments.length > 0) {
    headlines.push(`⚠️ ${payload.urgentAssignments.length} 項作業即將截止`);
  }
  if (payload.overdueAssignments.length > 0) {
    headlines.push(`🚨 ${payload.overdueAssignments.length} 項作業已逾期`);
  }
  if (headlines.length === 0 && payload.study.needsStudyNudge) {
    headlines.push(`📚 今日已讀 ${payload.study.studiedMinutes}/${payload.study.goalMinutes} 分鐘，該開始讀書囉！`);
  }
  if (headlines.length === 0) return;

  const notif = new Notification({
    title: 'Task Commander 學習與截止警告',
    body: headlines.join('\n'),
    icon: getAppIconPath(true),
    urgency: 'critical',
    silent: cfg.playAlertSound === false || suppressToastSound,
  });
  notif.on('click', () => {
    if (alertWindow && !alertWindow.isDestroyed()) {
      alertWindow.show();
      alertWindow.focus();
    } else {
      showMainWindow('dashboard');
    }
  });
  notif.show();
}

function runAlertCheck({ manual = false, reason = 'scheduled' } = {}) {
  const cfg = appConfig.alerts || DEFAULT_APP_CONFIG.alerts;
  if (!manual && !cfg.enabled) return { triggered: false, reason: 'disabled' };
  if (!manual && lastStudyState.isFocusActive) return { triggered: false, reason: 'focus_active' };

  const state = loadAlertState();
  const todayKey = getLocalDateKey();
  if (!manual && state.mutedDate === todayKey) {
    return { triggered: false, reason: 'muted_today' };
  }

  const payload = computeAlertPayload(manual ? 'manual' : reason);
  if (!manual && !payload.hasAlerts) {
    return { triggered: false, reason: 'no_alerts' };
  }

  const popupShown = Boolean(manual || cfg.showPopupWindow);
  if (popupShown) {
    createAlertWindow(payload);
  }
  if (cfg.showWindowsToast && payload.hasAlerts) {
    sendAlertToast(payload, popupShown);
  }
  return { triggered: true, payload };
}

function setupAlertScheduler() {
  if (alertSchedulerInterval) clearInterval(alertSchedulerInterval);

  // 每 30 秒檢查一次排定時段與延後 (Snooze) 到期
  alertSchedulerInterval = setInterval(() => {
    const cfg = appConfig.alerts || DEFAULT_APP_CONFIG.alerts;
    if (!cfg.enabled || lastStudyState.isFocusActive) return;

    const now = new Date();
    const todayKey = getLocalDateKey(now);
    const state = loadAlertState();

    // 1. 檢查是否到了 Snooze 延後時間
    if (state.snoozeUntil && Date.now() >= state.snoozeUntil) {
      state.snoozeUntil = 0;
      saveAlertState(state);
      runAlertCheck({ manual: false, reason: 'snooze' });
      return;
    }

    if (state.mutedDate === todayKey) return;

    // 2. 檢查每日固定觸發時段（如 09:00, 20:00）
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentHHMM = `${hh}:${mm}`;

    for (const slot of cfg.dailyTriggerTimes || []) {
      const slotKey = `${todayKey}:${slot}`;
      if (currentHHMM === slot && !state.triggeredSlots[slotKey]) {
        state.triggeredSlots[slotKey] = true;
        // 清理 7 天以前的舊記錄避免膨脹
        const keys = Object.keys(state.triggeredSlots);
        if (keys.length > 40) {
          for (const k of keys.slice(0, keys.length - 30)) delete state.triggeredSlots[k];
        }
        saveAlertState(state);
        runAlertCheck({ manual: false, reason: `daily_${slot}` });
        break;
      }
    }
  }, 30 * 1000);
}

// ==========================================
// 8. 檔案監聽與自動收錄成果庫
// ==========================================
function readTrackerFromDisk() {
  try {
    if (fs.existsSync(trackerPath)) {
      return JSON.parse(fs.readFileSync(trackerPath, 'utf-8'));
    }
    const bundledDefault = path.join(__dirname, '..', 'src', 'data', 'defaultTracker.json');
    if (fs.existsSync(bundledDefault)) {
      return JSON.parse(fs.readFileSync(bundledDefault, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading academic_tracker.json:', err);
  }
  return null;
}

function setupTrackerWatcher() {
  if (trackerWatcher) {
    try { trackerWatcher.close(); } catch {}
    trackerWatcher = null;
  }
  if (!fs.existsSync(trackerPath)) return;

  try {
    trackerWatcher = fs.watch(trackerPath, (eventType) => {
      if (eventType === 'change' || eventType === 'rename') {
        if (Date.now() - lastSelfTrackerWriteAt < 900) return;
        clearTimeout(watcherDebounceTimer);
        watcherDebounceTimer = setTimeout(() => {
          if (Date.now() - lastSelfTrackerWriteAt < 900) return;
          const data = readTrackerFromDisk();
          if (data && mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('tracker-updated', data);
          }
        }, 300);
      }
    });
  } catch (err) {
    console.error('Error setting up tracker file watcher:', err);
  }
}

function scanDeliverablesFiles() {
  const candidates = [];
  const scanDirs = [
    { dir: 'Study_Materials', cat: 'Study_Materials' },
    { dir: 'Test_Bank', cat: 'Test_Bank' },
    { dir: 'Reference', cat: 'Misc_Custom' },
  ];

  function walkDir(subDir, cat) {
    const fullDir = path.join(workspaceRoot, subDir);
    if (!fs.existsSync(fullDir)) return;
    const entries = fs.readdirSync(fullDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name.startsWith('_') || entry.name.startsWith('~$') || entry.name === 'node_modules') continue;
      const rel = path.join(subDir, entry.name).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        walkDir(rel, cat);
      } else {
        const ext = path.extname(entry.name).replace('.', '').toLowerCase();
        if (['md', 'html', 'pdf', 'docx'].includes(ext)) {
          const parts = rel.split('/');
          let course = '未分類科目';
          if (parts.length > 2) {
            course = parts[1];
            if (course === 'Exam_paper' || course === 'Solutions' || course === 'NCU_Classes') {
              course = parts[2] || '轉學考題庫';
            }
          }
          candidates.push({ path: rel, filename: entry.name, ext, category: cat, course });
        }
      }
    }
  }

  for (const s of scanDirs) walkDir(s.dir, s.cat);
  return candidates;
}

const CLOUD_WATCH_DIRS = ['Study_Materials', 'Test_Bank', 'Review_Dashboard'];
const CLOUD_SYNC_EXTENSIONS = new Set([
  'md', 'html', 'htm', 'pdf', 'png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'txt', 'json',
]);
const CLOUD_WATCH_IGNORED_SEGMENTS = new Set([
  'node_modules', '.git', '.venv', '.venv_312', '__pycache__', 'tessdata', 'dist', 'release',
]);

function isCloudEligibleRelativePath(relPath) {
  const norm = String(relPath || '').replace(/\\/g, '/').replace(/^\/+/, '');
  if (!norm) return false;
  const segments = norm.split('/');
  for (const seg of segments) {
    if (!seg || seg.startsWith('.') || seg.startsWith('~$') || CLOUD_WATCH_IGNORED_SEGMENTS.has(seg)) {
      return false;
    }
  }
  const ext = path.extname(norm).replace('.', '').toLowerCase();
  if (!CLOUD_SYNC_EXTENSIONS.has(ext)) return false;
  const fullPath = path.join(workspaceRoot, norm);
  try {
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
  } catch {
    return false;
  }
}

function parseUploadedCountFromOutput(output) {
  const match = String(output || '').match(/新上傳\s+(\d+)\s+檔/);
  return match ? Number(match[1]) || 0 : 0;
}

async function flushPendingModifiedAssets(extraPaths = []) {
  for (const p of extraPaths) {
    if (p) pendingModifiedAssetPaths.add(String(p).replace(/\\/g, '/'));
  }
  if (pendingModifiedAssetPaths.size === 0) return;

  const batch = Array.from(pendingModifiedAssetPaths);
  pendingModifiedAssetPaths.clear();

  const eligiblePaths = batch.filter((p) => isCloudEligibleRelativePath(p));
  if (eligiblePaths.length === 0) return;

  let totalUploaded = 0;
  const uploadedFiles = [];

  if (eligiblePaths.length > 3) {
    const res = await runCloudAssetSync({ withTracker: false });
    if (res?.success) {
      totalUploaded += parseUploadedCountFromOutput(res.output);
    }
  } else {
    for (const relPath of eligiblePaths) {
      const res = await runCloudAssetSync({ singleFile: relPath });
      if (res?.success) {
        const cnt = parseUploadedCountFromOutput(res.output);
        if (cnt > 0) {
          totalUploaded += cnt;
          uploadedFiles.push(relPath);
        }
      }
    }
  }

  if (totalUploaded > 0 && mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('cloud-asset-auto-synced', {
      count: totalUploaded,
      files: uploadedFiles,
      finishedAt: new Date().toISOString(),
    });
  }
}

function autoIngestNewDeliverables() {
  if (!appConfig.autoWatchDeliverables || !fs.existsSync(trackerPath)) return [];
  try {
    const tracker = readTrackerFromDisk();
    if (!tracker) return [];
    const existingList = Array.isArray(tracker.deliverables) ? tracker.deliverables : [];
    const existingPaths = new Set(existingList.map((d) => String(d.path || '').replace(/\\/g, '/')));
    const ignoredPaths = new Set(
      (Array.isArray(tracker._ignored_deliverable_paths) ? tracker._ignored_deliverable_paths : [])
        .map((p) => String(p || '').replace(/\\/g, '/').replace(/^\/+/, ''))
    );

    // 自動收錄只監控 Study_Materials 與 Test_Bank（避免把 Reference 裡大量原始作業/考古 PDF 全部塞進去）
    const scanned = scanDeliverablesFiles().filter(
      (f) => (f.category === 'Study_Materials' || f.category === 'Test_Bank')
        && !existingPaths.has(f.path)
        && !ignoredPaths.has(f.path)
    );

    if (scanned.length === 0) return [];

    const todayStr = getLocalDateKey();
    const added = scanned.map((f) => ({
      id: `del-auto-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: f.filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      course: f.course,
      category: f.category,
      type: f.category === 'Test_Bank' ? 'exam' : f.ext === 'html' ? 'recitation' : 'notes',
      path: f.path,
      format: f.ext,
      certified: true,
      updatedAt: todayStr,
      summary: `自動偵測並收錄自 ${f.path} 之學習資料。`,
      tags: ['AI認證', f.course, '自動收錄'],
    }));

    tracker.deliverables = [...added, ...existingList];
    lastSelfTrackerWriteAt = Date.now();
    fs.writeFileSync(trackerPath, JSON.stringify(tracker, null, 2), 'utf-8');

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('tracker-updated', tracker);
      mainWindow.webContents.send('auto-deliverables-added', { count: added.length, items: added });
    }
    return added.map((item) => item.path).filter(Boolean);
  } catch (err) {
    console.error('Auto ingest deliverables error:', err);
    return [];
  }
}

function setupDeliverablesWatcher() {
  for (const w of deliverablesWatchers) {
    try { w.close(); } catch {}
  }
  deliverablesWatchers = [];
  if (!appConfig.autoWatchDeliverables) return;

  for (const dirName of CLOUD_WATCH_DIRS) {
    const targetDir = path.join(workspaceRoot, dirName);
    if (!fs.existsSync(targetDir)) continue;
    try {
      const watcher = fs.watch(targetDir, { recursive: true }, (_eventType, filename) => {
        if (!filename) return;
        const normalizedSub = String(filename).replace(/\\/g, '/').replace(/^\/+/, '');
        const segments = normalizedSub.split('/');
        if (segments.some((seg) => !seg || seg.startsWith('.') || seg.startsWith('~$'))) return;

        const relPath = `${dirName}/${normalizedSub}`;
        pendingModifiedAssetPaths.add(relPath);

        clearTimeout(deliverablesDebounceTimer);
        deliverablesDebounceTimer = setTimeout(() => {
          const newlyIngestedPaths = autoIngestNewDeliverables();
          flushPendingModifiedAssets(newlyIngestedPaths).catch((err) => {
            console.error('Auto cloud asset sync error:', err);
          });
        }, 1500);
      });
      deliverablesWatchers.push(watcher);
    } catch (err) {
      console.error(`Watch ${dirName} failed:`, err.message);
    }
  }
}

// ==========================================
// 9. 自動與手動 EEClass 同步
// ==========================================
async function runEEClassSync(source = 'manual') {
  if (isSyncRunning) {
    return { success: false, error: '同步正在進行中' };
  }
  const pythonScript = path.join(workspaceRoot, '_Tools', 'eeclass_crawler.py');
  if (!fs.existsSync(pythonScript)) {
    return { success: false, error: '找不到 _Tools/eeclass_crawler.py 爬蟲腳本' };
  }

  isSyncRunning = true;
  refreshTrayMenu();
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('sync-status-changed', { syncing: true, source });
  }

  try {
    const execResult = await new Promise((resolve) => {
      exec(`python "${pythonScript}"`, { cwd: workspaceRoot, timeout: 45000 }, (error, stdout, stderr) => {
        if (error) {
          console.error('eeclass crawler execution error:', error, stderr);
          resolve({ success: false, error: error.message, output: stdout });
        } else {
          resolve({ success: true, output: stdout });
        }
      });
    });

    const freshData = readTrackerFromDisk();
    if (freshData && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('tracker-updated', freshData);
    }

    return {
      success: execResult.success,
      data: freshData,
      output: execResult.output,
      error: execResult.error,
    };
  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    isSyncRunning = false;
    refreshTrayMenu();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('sync-status-changed', { syncing: false, source, finishedAt: new Date().toISOString() });
    }
  }
}

function setupAutoSyncTimer() {
  if (autoSyncInterval) clearInterval(autoSyncInterval);
  if (!appConfig.autoSyncEnabled) return;
  const hours = Math.max(1, Number(appConfig.autoSyncIntervalHours || 4));
  autoSyncInterval = setInterval(() => {
    runEEClassSync('interval');
  }, hours * 60 * 60 * 1000);
}

function maybeRunStartupSync() {
  if (!appConfig.autoSyncEnabled) return;
  const tracker = readTrackerFromDisk();
  const lastUpdated = tracker?.last_updated ? Date.parse(tracker.last_updated) : 0;
  const hours = Math.max(1, Number(appConfig.autoSyncIntervalHours || 4));
  const staleMs = hours * 60 * 60 * 1000;
  if (!lastUpdated || Date.now() - lastUpdated > staleMs) {
    runEEClassSync('startup');
  }
}

// ==========================================
// 10. 獨立桌面便條紙與每日任務視窗
// ==========================================
function loadStickyState() {
  const data = readJsonSafe(getUserDataFile('sticky-positions.json'), {});
  if (data && (data.positions || data.activeNoteIds !== undefined)) {
    return {
      activeNoteIds: Array.isArray(data.activeNoteIds) ? data.activeNoteIds : [],
      isDailyActive: !!data.isDailyActive,
      positions: data.positions || {},
      dailyPosition: data.dailyPosition || { width: 340, height: 380 },
    };
  }
  return {
    activeNoteIds: [],
    isDailyActive: false,
    positions: {},
    dailyPosition: { width: 340, height: 380 },
  };
}

function saveStickyState(state) {
  writeJsonSafe(getUserDataFile('sticky-positions.json'), state);
}

function updateStickyBounds(noteId, bounds) {
  if (!noteId || !bounds || bounds.x < -1000 || bounds.y < -1000 || bounds.width <= 0 || bounds.height <= 0) return;
  const state = loadStickyState();
  state.positions[noteId] = {
    x: Math.round(bounds.x),
    y: Math.round(bounds.y),
    width: Math.round(bounds.width),
    height: Math.round(bounds.height),
  };
  saveStickyState(state);
}

function updateDailyBounds(bounds) {
  if (!bounds || bounds.x < -1000 || bounds.y < -1000 || bounds.width <= 0 || bounds.height <= 0) return;
  const state = loadStickyState();
  state.dailyPosition = {
    x: Math.round(bounds.x),
    y: Math.round(bounds.y),
    width: Math.round(bounds.width),
    height: Math.round(bounds.height),
  };
  saveStickyState(state);
}

function notifyActiveStickiesChanged() {
  const activeIds = Array.from(stickyWindows.keys());
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('active-stickies-updated', activeIds);
  }
}

function setNoteActiveOnDesktop(noteId, isActive) {
  const state = loadStickyState();
  state.activeNoteIds = isActive
    ? (state.activeNoteIds.includes(noteId) ? state.activeNoteIds : [...state.activeNoteIds, noteId])
    : state.activeNoteIds.filter((id) => id !== noteId);
  saveStickyState(state);
  notifyActiveStickiesChanged();
}

function setDailyActiveOnDesktop(isActive) {
  const state = loadStickyState();
  state.isDailyActive = isActive;
  saveStickyState(state);
}

function createStickyWindow(noteId) {
  if (!noteId) return null;
  if (stickyWindows.has(noteId)) {
    const existingWin = stickyWindows.get(noteId);
    if (existingWin && !existingWin.isDestroyed()) {
      if (existingWin.isMinimized()) existingWin.restore();
      existingWin.show();
      existingWin.focus();
      return existingWin;
    }
  }

  const state = loadStickyState();
  const saved = state.positions[noteId] || {};
  const width = Math.max(260, Math.round(saved.width || 320));
  const height = Math.max(220, Math.round(saved.height || 300));
  let posX = typeof saved.x === 'number' ? Math.round(saved.x) : 120 + ((stickyWindows.size * 40) % 400);
  let posY = typeof saved.y === 'number' ? Math.round(saved.y) : 120 + ((stickyWindows.size * 30) % 300);

  const win = new BrowserWindow({
    width,
    height,
    x: posX,
    y: posY,
    minWidth: 240,
    minHeight: 200,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    thickFrame: false,
    roundedCorners: false,
    backgroundMaterial: 'none',
    autoHideMenuBar: true,
    title: '',
    alwaysOnTop: true,
    skipTaskbar: false,
    show: false,
    icon: getAppIconPath(false),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });

  win.setMenuBarVisibility(false);
  attachExternalLinkHandler(win);
  win.webContents.on('page-title-updated', (e) => e.preventDefault());

  const applyShape = () => applyWindowShape(win, 16);
  win.once('ready-to-show', () => {
    if (!win.isDestroyed()) {
      win.setBounds({ x: posX, y: posY, width, height });
      applyShape();
      win.show();
    }
  });
  win.on('resize', applyShape);

  if (isDev) {
    win.loadURL(`http://localhost:5173?mode=sticky&noteId=${encodeURIComponent(noteId)}`);
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'), {
      search: `?mode=sticky&noteId=${encodeURIComponent(noteId)}`,
    });
  }

  setNoteActiveOnDesktop(noteId, true);

  let saveTimer = null;
  const saveCurrentBounds = () => {
    if (win && !win.isDestroyed()) updateStickyBounds(noteId, win.getBounds());
  };
  const debouncedSave = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveCurrentBounds, 250);
  };
  win.on('moved', debouncedSave);
  win.on('resized', debouncedSave);
  win.on('close', () => {
    clearTimeout(saveTimer);
    saveCurrentBounds();
  });
  win.on('closed', () => {
    stickyWindows.delete(noteId);
    notifyActiveStickiesChanged();
  });

  stickyWindows.set(noteId, win);
  notifyActiveStickiesChanged();
  return win;
}

function createDailyWindow() {
  if (dailyWindow && !dailyWindow.isDestroyed()) {
    if (dailyWindow.isMinimized()) dailyWindow.restore();
    dailyWindow.show();
    dailyWindow.focus();
    return dailyWindow;
  }

  const state = loadStickyState();
  const saved = state.dailyPosition || {};
  const width = Math.max(280, Math.round(saved.width || 340));
  const height = Math.max(280, Math.round(saved.height || 400));
  const posX = typeof saved.x === 'number' ? Math.round(saved.x) : undefined;
  const posY = typeof saved.y === 'number' ? Math.round(saved.y) : undefined;

  dailyWindow = new BrowserWindow({
    width,
    height,
    x: posX,
    y: posY,
    minWidth: 280,
    minHeight: 280,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    thickFrame: false,
    roundedCorners: false,
    backgroundMaterial: 'none',
    autoHideMenuBar: true,
    title: '',
    alwaysOnTop: true,
    skipTaskbar: false,
    show: false,
    icon: getAppIconPath(false),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });

  dailyWindow.setMenuBarVisibility(false);
  attachExternalLinkHandler(dailyWindow);
  dailyWindow.webContents.on('page-title-updated', (e) => e.preventDefault());

  const applyShape = () => applyWindowShape(dailyWindow, 16);
  dailyWindow.once('ready-to-show', () => {
    if (dailyWindow && !dailyWindow.isDestroyed()) {
      if (typeof posX === 'number' && typeof posY === 'number') {
        dailyWindow.setBounds({ x: posX, y: posY, width, height });
      }
      applyShape();
      dailyWindow.show();
    }
  });
  dailyWindow.on('resize', applyShape);

  if (isDev) {
    dailyWindow.loadURL('http://localhost:5173?mode=daily');
  } else {
    dailyWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'), { search: '?mode=daily' });
  }

  setDailyActiveOnDesktop(true);

  let saveTimer = null;
  const saveCurrentBounds = () => {
    if (dailyWindow && !dailyWindow.isDestroyed()) updateDailyBounds(dailyWindow.getBounds());
  };
  const debouncedSave = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveCurrentBounds, 250);
  };
  dailyWindow.on('moved', debouncedSave);
  dailyWindow.on('resized', debouncedSave);
  dailyWindow.on('close', () => {
    clearTimeout(saveTimer);
    saveCurrentBounds();
  });
  dailyWindow.on('closed', () => {
    dailyWindow = null;
  });

  return dailyWindow;
}

// ==========================================
// 11. IPC Handlers
// ==========================================
ipcMain.handle('read-tracker', async () => readTrackerFromDisk());

ipcMain.handle('save-tracker', async (_event, data) => {
  try {
    lastSelfTrackerWriteAt = Date.now();
    fs.writeFileSync(trackerPath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
  } catch (err) {
    console.error('Error saving academic_tracker.json:', err);
    return { success: false, error: err.message };
  }
});

// Cloud Runtime Config (僅回傳公開前端所需之 URL / Anon Key / Owner Email，絕不外洩 Service Role 或密碼)
function parseSimpleEnvFile(filePath) {
  const out = {};
  if (!filePath || !fs.existsSync(filePath)) return out;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const k = trimmed.slice(0, eq).trim();
      let v = trimmed.slice(eq + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      out[k] = v;
    }
  } catch {}
  return out;
}

function readCloudRuntimeConfig() {
  const candidates = [
    path.join(workspaceRoot, '.env'),
    path.join(workspaceRoot, '.env.local'),
    path.join(workspaceRoot, 'task-commander', '.env'),
    path.join(workspaceRoot, 'task-commander', '.env.local'),
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', '.env.local'),
  ];
  let merged = {};
  for (const p of candidates) {
    merged = { ...merged, ...parseSimpleEnvFile(p) };
  }
  const savedJson = readJsonSafe(getUserDataFile('cloud-config.json'), {});
  return {
    url: (savedJson.url || merged.VITE_SUPABASE_URL || merged.SUPABASE_URL || '').trim(),
    anonKey: (savedJson.anonKey || merged.VITE_SUPABASE_ANON_KEY || merged.SUPABASE_ANON_KEY || '').trim(),
    ownerEmail: (savedJson.ownerEmail || merged.VITE_OWNER_EMAIL || merged.SUPABASE_OWNER_EMAIL || '').trim(),
  };
}

async function executeCloudAssetSync({ singleFile = null, withTracker = false } = {}) {
  const tcDir = path.join(workspaceRoot, 'task-commander');
  const scriptPath = path.join(tcDir, 'scripts', 'sync-cloud-assets.cjs');
  const envLocalPath = path.join(tcDir, '.env.local');
  const rootEnvLocalPath = path.join(workspaceRoot, '.env.local');
  if (!fs.existsSync(scriptPath)) {
    return { success: false, error: '找不到 scripts/sync-cloud-assets.cjs' };
  }
  if (!fs.existsSync(envLocalPath) && !fs.existsSync(rootEnvLocalPath)) {
    return { success: false, skipped: true, error: '尚未建立 task-commander/.env.local' };
  }

  if (!singleFile) isCloudAssetSyncing = true;
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('cloud-asset-sync-status', { syncing: true, singleFile });
  }

  const args = [];
  if (singleFile) args.push(`--file "${String(singleFile).replace(/"/g, '')}"`);
  if (withTracker) args.push('--with-tracker');
  const cmd = `node "${scriptPath}" ${args.join(' ')}`.trim();

  try {
    const result = await new Promise((resolve) => {
      exec(cmd, { cwd: tcDir, timeout: 180000 }, (error, stdout, stderr) => {
        if (error) {
          resolve({ success: false, error: stderr || error.message, output: stdout });
        } else {
          resolve({ success: true, output: stdout });
        }
      });
    });
    return result;
  } finally {
    if (!singleFile) isCloudAssetSyncing = false;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('cloud-asset-sync-status', { syncing: false, singleFile, finishedAt: new Date().toISOString() });
    }
  }
}

function runCloudAssetSync(options = {}) {
  const isFullSync = !options?.singleFile;
  if (isCloudAssetSyncing && isFullSync) {
    return Promise.resolve({ success: false, error: '雲端檔案同步正在進行中' });
  }
  const task = cloudSyncQueuePromise
    .catch(() => {})
    .then(() => executeCloudAssetSync(options));
  cloudSyncQueuePromise = task.catch(() => {});
  return task;
}

ipcMain.handle('get-cloud-config', async () => readCloudRuntimeConfig());
ipcMain.handle('sync-cloud-assets', async (_event, options = {}) => runCloudAssetSync(options));

ipcMain.handle('get-workspace-info', async () => ({
  workspaceRoot,
  trackerPath,
  trackerExists: fs.existsSync(trackerPath),
  isPackaged: app.isPackaged,
  exePath: app.getPath('exe'),
}));

ipcMain.handle('select-workspace-dir', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: '選擇 Study-space 工作區根目錄（含 academic_tracker.json）',
      defaultPath: workspaceRoot,
      properties: ['openDirectory'],
    });
    if (!result.canceled && result.filePaths.length > 0) {
      const picked = result.filePaths[0];
      setWorkspaceRoot(picked);
      return { success: true, workspaceRoot, trackerExists: fs.existsSync(trackerPath) };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
  return { success: false, canceled: true };
});

function resolveSafeWorkspacePath(relativePath) {
  const norm = String(relativePath || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/\/{2,}/g, '/');
  if (!norm) return null;
  const fullPath = path.resolve(workspaceRoot, norm);
  const rel = path.relative(workspaceRoot, fullPath);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return { norm, fullPath };
}

ipcMain.handle('read-file', async (_event, relativePath) => {
  try {
    const resolved = resolveSafeWorkspacePath(relativePath);
    if (!resolved) {
      return { success: false, error: '無效的檔案路徑' };
    }
    const { fullPath } = resolved;
    if (!fs.existsSync(fullPath)) {
      return { success: false, error: `找不到檔案：${relativePath}` };
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    const ext = path.extname(fullPath).toLowerCase();
    return { success: true, content, ext, fullPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('write-file-content', async (_event, { relativePath, content }) => {
  try {
    const resolved = resolveSafeWorkspacePath(relativePath);
    if (!resolved) {
      return { success: false, error: '無效或不安全的寫入路徑（必須位於 Study-space 工作區內）' };
    }
    const { norm, fullPath } = resolved;
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const text = typeof content === 'string' ? content : String(content ?? '');
    fs.writeFileSync(fullPath, text, 'utf-8');
    return { success: true, relativePath: norm, fullPath, bytes: Buffer.byteLength(text, 'utf-8') };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('trash-file', async (_event, relativePath) => {
  try {
    const resolved = resolveSafeWorkspacePath(relativePath);
    if (!resolved) {
      return { success: false, error: '無效或不安全的檔案路徑' };
    }
    const { fullPath } = resolved;
    if (!fs.existsSync(fullPath)) {
      return { success: true, alreadyMissing: true };
    }
    await shell.trashItem(fullPath);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('ensure-vault-subject-dir', async (_event, { subjectName, categories }) => {
  try {
    const safeName = String(subjectName || '').trim().replace(/[\\/:*?"<>|]/g, '_');
    if (!safeName) return { success: false, error: '科目名稱不可為空' };
    const cats = Array.isArray(categories) && categories.length > 0 ? categories : ['Study_Materials', 'Test_Bank'];
    const createdDirs = [];
    for (const cat of cats) {
      if (cat !== 'Study_Materials' && cat !== 'Test_Bank') continue;
      const resolved = resolveSafeWorkspacePath(`${cat}/${safeName}`);
      if (!resolved) continue;
      if (!fs.existsSync(resolved.fullPath)) {
        fs.mkdirSync(resolved.fullPath, { recursive: true });
      }
      createdDirs.push(resolved.norm);
    }
    return { success: true, createdDirs };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('open-path', async (_event, targetPath) => {
  try {
    if (typeof targetPath === 'string' && /^https?:\/\//i.test(targetPath)) {
      await shell.openExternal(targetPath);
      return { success: true };
    }
    const fullPath = path.resolve(workspaceRoot, targetPath);
    const errMsg = await shell.openPath(fullPath);
    return { success: !errMsg, error: errMsg };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('show-in-folder', async (_event, relativePath) => {
  try {
    const fullPath = path.resolve(workspaceRoot, relativePath);
    shell.showItemInFolder(fullPath);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('send-notification', async (_event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({
      title: title || 'Task Commander',
      body: body || '',
      icon: getAppIconPath(true),
    }).show();
    return true;
  }
  return false;
});

ipcMain.handle('select-file', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: '選擇要導入的學習資料檔案',
      defaultPath: workspaceRoot,
      properties: ['openFile'],
      filters: [
        { name: '學習文件', extensions: ['md', 'html', 'pdf', 'docx', 'txt', 'py', 'json'] },
        { name: '所有檔案', extensions: ['*'] },
      ],
    });
    if (!result.canceled && result.filePaths.length > 0) {
      const fullPath = result.filePaths[0];
      const relPath = path.relative(workspaceRoot, fullPath).replace(/\\/g, '/');
      const ext = path.extname(fullPath).replace('.', '').toLowerCase();
      const filename = path.basename(fullPath);
      return { success: true, fullPath, relativePath: relPath, ext, filename };
    }
  } catch (err) {
    console.error('Error selecting file:', err);
  }
  return { success: false, canceled: true };
});

ipcMain.handle('scan-workspace-deliverables', async () => {
  try {
    return { success: true, files: scanDeliverablesFiles() };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// App Config & Auto Launch IPC
ipcMain.handle('get-app-config', () => appConfig);
ipcMain.handle('save-app-config', (_event, nextCfg) => saveAppConfig(nextCfg));
ipcMain.handle('get-auto-launch', () => getAutoLaunchEnabled());
ipcMain.handle('set-auto-launch', (_event, enabled) => setAutoLaunchEnabled(enabled));

// Alert Engine IPC
ipcMain.handle('trigger-alert-check', (_event, options = {}) => runAlertCheck({ manual: !!options.manual, reason: options.reason || 'manual' }));
ipcMain.handle('get-alert-payload', () => latestAlertPayload || computeAlertPayload('manual'));
ipcMain.handle('snooze-alert', (_event, minutes) => {
  const mins = Math.max(5, Number(minutes || appConfig.alerts?.snoozeMinutes || 30));
  const state = loadAlertState();
  state.snoozeUntil = Date.now() + mins * 60 * 1000;
  saveAlertState(state);
  if (alertWindow && !alertWindow.isDestroyed()) alertWindow.close();
  return { snoozeUntil: state.snoozeUntil, minutes: mins };
});
ipcMain.handle('dismiss-alert-today', () => {
  const state = loadAlertState();
  state.mutedDate = getLocalDateKey();
  state.snoozeUntil = 0;
  saveAlertState(state);
  if (alertWindow && !alertWindow.isDestroyed()) alertWindow.close();
  return { mutedDate: state.mutedDate };
});
ipcMain.handle('alert-action', (_event, action = {}) => {
  if (alertWindow && !alertWindow.isDestroyed()) alertWindow.close();
  if (action.type === 'open-tab') {
    showMainWindow(action.tab || 'dashboard');
  } else if (action.type === 'start-focus') {
    showMainWindow('dashboard');
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('start-focus-timer', { minutes: action.minutes || 25 });
      }
    }, 150);
  } else if (action.type === 'open-url' && action.url) {
    shell.openExternal(action.url);
  }
  return true;
});
ipcMain.handle('update-study-state', (_event, state = {}) => {
  lastStudyState = { ...lastStudyState, ...state, updatedAt: new Date().toISOString() };
  return true;
});
ipcMain.handle('alert-shake-pulse', () => pulseAlertWindowShake());
ipcMain.handle('alert-shake-stop', () => {
  stopAlertWindowShake();
  return true;
});
ipcMain.handle('list-custom-alert-sounds', () => loadCustomAlertSoundsIndex());
ipcMain.handle('import-alert-sound', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: '匯入自訂警告音效檔（MP3 / WAV / OGG / M4A）',
      properties: ['openFile'],
      filters: [
        { name: '音訊檔案', extensions: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'webm'] },
      ],
    });
    if (result.canceled || !result.filePaths?.length) {
      return { success: false, canceled: true };
    }
    const srcPath = result.filePaths[0];
    const stat = fs.statSync(srcPath);
    if (stat.size > 10 * 1024 * 1024) {
      return { success: false, error: '音訊檔案過大（上限 10 MB）' };
    }
    const ext = path.extname(srcPath).toLowerCase() || '.mp3';
    const rawBase = path.basename(srcPath, ext);
    const safeSlug = rawBase.replace(/[^a-zA-Z0-9\u4e00-\u9fff_-]/g, '_').slice(0, 48) || 'custom_sound';
    const fileName = `${Date.now()}_${safeSlug}${ext}`;
    const destPath = path.join(getAlertSoundsDir(), fileName);
    fs.copyFileSync(srcPath, destPath);

    const entry = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      fileName,
      label: rawBase,
      size: stat.size,
      importedAt: new Date().toISOString(),
    };
    const list = loadCustomAlertSoundsIndex();
    list.unshift(entry);
    saveCustomAlertSoundsIndex(list);
    return { success: true, sound: entry, list };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
ipcMain.handle('delete-custom-alert-sound', (_event, fileName) => {
  try {
    const safeName = path.basename(String(fileName || ''));
    if (!safeName) return { success: false, error: '無效檔名' };
    const targetPath = path.join(getAlertSoundsDir(), safeName);
    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
    const nextList = loadCustomAlertSoundsIndex().filter((item) => item.fileName !== safeName);
    saveCustomAlertSoundsIndex(nextList);
    return { success: true, list: nextList };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
ipcMain.handle('read-alert-sound-data', (_event, fileName) => {
  try {
    const safeName = path.basename(String(fileName || ''));
    if (!safeName) return { success: false, error: '無效檔名' };
    const targetPath = path.join(getAlertSoundsDir(), safeName);
    if (!fs.existsSync(targetPath)) return { success: false, error: '找不到自訂音效檔' };
    const ext = path.extname(safeName).toLowerCase();
    const mimeMap = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4',
      '.flac': 'audio/flac',
      '.webm': 'audio/webm',
    };
    const mime = mimeMap[ext] || 'audio/mpeg';
    const b64 = fs.readFileSync(targetPath).toString('base64');
    return { success: true, dataUrl: `data:${mime};base64,${b64}` };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Window Control IPC
ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
  return true;
});
ipcMain.handle('window-toggle-maximize', () => {
  if (!mainWindow || mainWindow.isDestroyed()) return false;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    return false;
  }
  mainWindow.maximize();
  return true;
});
ipcMain.handle('window-is-maximized', () => (mainWindow ? mainWindow.isMaximized() : false));
ipcMain.handle('window-close', () => {
  if (mainWindow) mainWindow.close();
  return true;
});
ipcMain.handle('app-quit', () => {
  isQuitting = true;
  app.quit();
  return true;
});
ipcMain.handle('window-toggle-pin', () => {
  if (!mainWindow || mainWindow.isDestroyed()) return false;
  const isPinned = !mainWindow.isAlwaysOnTop();
  mainWindow.setAlwaysOnTop(isPinned);
  if (!mainWindow.isMaximized()) saveWindowState(mainWindow.getBounds(), isPinned);
  return isPinned;
});
ipcMain.handle('window-get-pinned', () => (mainWindow ? mainWindow.isAlwaysOnTop() : false));
ipcMain.handle('window-update-shape', (_event, radius) => {
  applyWindowShape(mainWindow, radius);
  return true;
});

// Sticky & Daily Windows IPC
ipcMain.handle('create-sticky-window', (_event, noteId) => {
  createStickyWindow(noteId);
  return true;
});
ipcMain.handle('create-daily-window', () => {
  createDailyWindow();
  return true;
});
ipcMain.handle('close-sticky-window', (_event, noteId) => {
  setNoteActiveOnDesktop(noteId, false);
  const win = stickyWindows.get(noteId);
  if (win) {
    stickyWindows.delete(noteId);
    if (!win.isDestroyed()) win.close();
  }
  notifyActiveStickiesChanged();
  return true;
});
ipcMain.handle('delete-sticky-position', (_event, noteId) => {
  const state = loadStickyState();
  if (state.positions && state.positions[noteId]) delete state.positions[noteId];
  state.activeNoteIds = state.activeNoteIds.filter((id) => id !== noteId);
  saveStickyState(state);
  const win = stickyWindows.get(noteId);
  if (win) {
    stickyWindows.delete(noteId);
    if (!win.isDestroyed()) win.close();
  }
  notifyActiveStickiesChanged();
  return true;
});
ipcMain.handle('close-daily-window', () => {
  setDailyActiveOnDesktop(false);
  if (dailyWindow && !dailyWindow.isDestroyed()) dailyWindow.close();
  dailyWindow = null;
  return true;
});
ipcMain.handle('get-active-sticky-ids', () => Array.from(stickyWindows.keys()));
ipcMain.handle('close-current-window', (event) => {
  const senderWin = BrowserWindow.fromWebContents(event.sender);
  if (senderWin && senderWin !== mainWindow) {
    for (const [noteId, win] of stickyWindows) {
      if (win === senderWin) {
        setNoteActiveOnDesktop(noteId, false);
        stickyWindows.delete(noteId);
        break;
      }
    }
    if (dailyWindow === senderWin) {
      setDailyActiveOnDesktop(false);
      dailyWindow = null;
    }
    if (alertWindow === senderWin) {
      alertWindow = null;
    }
    notifyActiveStickiesChanged();
    senderWin.close();
    return true;
  }
  return false;
});

// EEClass Sync IPC
ipcMain.handle('sync-eeclass', async () => runEEClassSync('manual'));

// ==========================================
// 11.5 Local Antigravity CLI (agy) AI Engine IPC
// ==========================================
const activeAgyProcesses = new Map(); // requestId -> ChildProcess

function resolveAgyExecutable() {
  const candidates = [];
  if (process.env.LOCALAPPDATA) {
    candidates.push(path.join(process.env.LOCALAPPDATA, 'agy', 'bin', 'agy.exe'));
  }
  candidates.push('agy');
  for (const cand of candidates) {
    if (cand === 'agy' || fs.existsSync(cand)) return cand;
  }
  return 'agy';
}

ipcMain.handle('ai-check-agy', async () => {
  const agyBin = resolveAgyExecutable();
  return new Promise((resolve) => {
    const child = spawn(agyBin, ['models'], {
      cwd: workspaceRoot,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      try { child.kill(); } catch {}
      resolve({ available: false, models: [], error: '檢查 agy models 逾時' });
    }, 12000);

    child.stdout.on('data', (chunk) => { stdout += chunk.toString('utf-8'); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString('utf-8'); });
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ available: false, models: [], error: err.message });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      const models = [];
      for (const rawLine of stdout.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('Fetching')) continue;
        const parts = line.split('\t');
        if (parts.length >= 2) {
          models.push({ id: parts[0].trim(), label: parts[1].trim() });
        } else {
          const m = line.match(/^([a-z0-9._-]+)\s+(.+)$/i);
          if (m) models.push({ id: m[1].trim(), label: m[2].trim() });
        }
      }
      if (code === 0 && models.length > 0) {
        resolve({ available: true, bin: agyBin, models });
      } else {
        resolve({
          available: false,
          models,
          error: (stderr || stdout || `agy models 結束代碼 ${code}`).trim().slice(0, 240),
        });
      }
    });
  });
});

ipcMain.handle('ai-generate-agy', async (event, { requestId, model, prompt }) => {
  if (!requestId || !prompt) {
    return { success: false, error: '缺少生成請求參數' };
  }
  const agyBin = resolveAgyExecutable();
  const sender = event.sender;
  const sendEv = (payload) => {
    if (sender && !sender.isDestroyed()) {
      sender.send('agy-stream-event', { requestId, ...payload });
    }
  };

  try {
    const args = [
      '--model',
      String(model || 'gemini-4-neon-high'),
      '--disable-slash-commands',
      '--input-format',
      'stream-json',
      '--output-format',
      'stream-json',
    ];

    const child = spawn(agyBin, args, {
      cwd: workspaceRoot,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    activeAgyProcesses.set(requestId, child);
    let stdoutBuf = '';
    let stderrText = '';
    let finished = false;
    let accumulatedDelta = '';

    const handleJsonLine = (line) => {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('{')) return;
      try {
        const obj = JSON.parse(trimmed);
        if (obj.event === 'init') {
          sendEv({ type: 'status', message: `已連線 ${obj.init?.model || model}，正在思考與生成中...` });
        } else if (obj.event === 'step_update' && obj.step_update) {
          const su = obj.step_update;
          if (su.step_type === 'agent_response' && typeof su.text_delta === 'string' && su.text_delta) {
            accumulatedDelta += su.text_delta;
            sendEv({ type: 'delta', text: su.text_delta });
          } else if (su.step_type === 'tool' && su.tool_name) {
            sendEv({ type: 'status', message: `模型處理步驟：${su.tool_name}...` });
          }
        } else if (obj.event === 'result' && obj.result) {
          finished = true;
          if (obj.result.status === 'SUCCESS') {
            sendEv({
              type: 'done',
              response: obj.result.response || accumulatedDelta,
              usage: obj.result.usage || null,
            });
          } else {
            sendEv({
              type: 'error',
              error: obj.result.error || `生成狀態異常 (${obj.result.status})`,
            });
          }
        }
      } catch {
        // Ignore non-JSON diagnostic lines
      }
    };

    child.stdout.on('data', (chunk) => {
      stdoutBuf += chunk.toString('utf-8');
      const lines = stdoutBuf.split(/\r?\n/);
      stdoutBuf = lines.pop() || '';
      for (const line of lines) handleJsonLine(line);
    });

    child.stderr.on('data', (chunk) => {
      stderrText += chunk.toString('utf-8');
    });

    child.on('error', (err) => {
      activeAgyProcesses.delete(requestId);
      if (!finished) {
        finished = true;
        sendEv({ type: 'error', error: `啟動 agy CLI 失敗：${err.message}` });
      }
    });

    child.on('close', (code) => {
      activeAgyProcesses.delete(requestId);
      if (stdoutBuf.trim()) handleJsonLine(stdoutBuf);
      if (!finished) {
        finished = true;
        if (code === 0 && accumulatedDelta) {
          sendEv({ type: 'done', response: accumulatedDelta, usage: null });
        } else {
          sendEv({
            type: 'error',
            error: (stderrText || `agy 行程異常中止 (code ${code})`).trim().slice(0, 320),
          });
        }
      }
    });

    // Write NDJSON prompt event cleanly over UTF-8 stdin (no Windows CLI length limits)
    const msg = JSON.stringify({
      event: 'user',
      message: { content: String(prompt) },
    });
    child.stdin.write(`${msg}\n`, 'utf-8');
    child.stdin.end();

    return { success: true, requestId };
  } catch (err) {
    activeAgyProcesses.delete(requestId);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('ai-cancel-agy', (_event, requestId) => {
  const child = activeAgyProcesses.get(requestId);
  if (child) {
    activeAgyProcesses.delete(requestId);
    try { child.kill(); } catch {}
    return { success: true };
  }
  return { success: false };
});

// ==========================================
// 12. 應用程式啟動與生命週期
// ==========================================
app.on('second-instance', () => showMainWindow());

app.on('before-quit', () => {
  isQuitting = true;
  stopAlertWindowShake();
  for (const [, proc] of activeAgyProcesses) {
    try { proc.kill(); } catch {}
  }
  activeAgyProcesses.clear();
  if (alertSchedulerInterval) clearInterval(alertSchedulerInterval);
  if (autoSyncInterval) clearInterval(autoSyncInterval);
  if (trackerWatcher) {
    try { trackerWatcher.close(); } catch {}
  }
  for (const w of deliverablesWatchers) {
    try { w.close(); } catch {}
  }
});

app.whenReady().then(() => {
  createTray();
  createWindow(startHidden);
  setupAlertScheduler();
  setupAutoSyncTimer();

  // 啟動時還原先前開啟在桌面的便條紙與每日任務小工具
  try {
    const state = loadStickyState();
    for (const noteId of state.activeNoteIds || []) {
      createStickyWindow(noteId);
    }
    if (state.isDailyActive) {
      createDailyWindow();
    }
  } catch (err) {
    console.error('Error auto-restoring desktop widgets:', err);
  }

  // 啟動後 3 秒自動掃描 Study_Materials/ 與 Test_Bank/ 新檔案，並執行一次完整增量上雲（補傳離線期間的修改）
  setTimeout(() => {
    autoIngestNewDeliverables();
    if (appConfig.autoWatchDeliverables) {
      runCloudAssetSync({ withTracker: false })
        .then((res) => {
          const uploadedCount = res?.success ? parseUploadedCountFromOutput(res.output) : 0;
          if (uploadedCount > 0 && mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('cloud-asset-auto-synced', {
              count: uploadedCount,
              files: [],
              finishedAt: new Date().toISOString(),
            });
          }
        })
        .catch(() => {});
    }
  }, 3000);

  // 啟動後 5 秒執行一次今日開機警告檢查（每日首次開機檢查）
  setTimeout(() => {
    const cfg = appConfig.alerts || DEFAULT_APP_CONFIG.alerts;
    if (!cfg.enabled || !cfg.triggerOnStartup) return;
    const state = loadAlertState();
    const todayKey = getLocalDateKey();
    if (state.mutedDate === todayKey) return;
    if (state.lastStartupCheckDate !== todayKey) {
      state.lastStartupCheckDate = todayKey;
      saveAlertState(state);
      runAlertCheck({ manual: false, reason: 'startup' });
    }
  }, 5000);

  // 啟動後 8 秒視距離上次更新時間自動背景同步 eeclass
  setTimeout(() => maybeRunStartupSync(), 8000);

  app.on('activate', () => showMainWindow());
});

app.on('window-all-closed', () => {
  if (!appConfig.minimizeToTray || !tray || isQuitting) {
    app.quit();
  }
});
