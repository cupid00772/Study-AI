const { app, BrowserWindow, ipcMain, shell, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

// ==========================================
// 1. 單一執行個體鎖 (Single Instance Lock)
// ==========================================
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  return;
}

const isDev = !app.isPackaged;
let mainWindow = null;
let trackerWatcher = null;
let watcherDebounceTimer = null;
let boundsDebounceTimer = null;

// ==========================================
// 2. 動態自動偵測 Study-space 工作區根目錄路徑
// ==========================================
function findWorkspaceRoot() {
  const candidates = [
    process.env.PORTABLE_EXECUTABLE_DIR ? path.resolve(process.env.PORTABLE_EXECUTABLE_DIR, '..', '..') : null,
    process.env.PORTABLE_EXECUTABLE_DIR ? path.resolve(process.env.PORTABLE_EXECUTABLE_DIR, '..') : null,
    process.env.PORTABLE_EXECUTABLE_DIR,
    process.cwd(),
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd(), '..', '..'),
    path.resolve(__dirname, '..', '..'),
    path.resolve(__dirname, '..'),
    path.resolve(app.getAppPath(), '..', '..'),
    path.resolve(app.getAppPath(), '..'),
    'C:\\Users\\Cupid\\Downloads\\Study-space'
  ].filter(Boolean);

  for (const cand of candidates) {
    if (fs.existsSync(path.join(cand, 'academic_tracker.json'))) {
      return cand;
    }
  }

  return 'C:\\Users\\Cupid\\Downloads\\Study-space';
}

const workspaceRoot = findWorkspaceRoot();
const trackerPath = path.join(workspaceRoot, 'academic_tracker.json');

// ==========================================
// 3. 視窗位置與大小狀態記憶 (Window State Persistence)
// ==========================================
function getWindowStatePath() {
  try {
    return path.join(app.getPath('userData'), 'window-state.json');
  } catch {
    return path.join(workspaceRoot, 'window-state.json');
  }
}

function loadWindowState() {
  try {
    const file = getWindowStatePath();
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      if (typeof data.width === 'number' && typeof data.height === 'number') {
        return data;
      }
    }
  } catch (err) {
    console.error('Error loading window state:', err);
  }
  return { width: 1240, height: 800, x: undefined, y: undefined, isPinned: false };
}

function saveWindowState(bounds, isPinned) {
  try {
    const file = getWindowStatePath();
    const data = { ...bounds, isPinned };
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving window state:', err);
  }
}

function createWindow() {
  const savedState = loadWindowState();

  mainWindow = new BrowserWindow({
    width: savedState.width || 1240,
    height: savedState.height || 800,
    x: savedState.x,
    y: savedState.y,
    minWidth: 480,
    minHeight: 450,
    frame: false,              // 無邊框便條紙視窗
    transparent: true,         // 背景透明/磨砂透光
    backgroundColor: '#00000000',
    hasShadow: true,
    alwaysOnTop: !!savedState.isPinned,
    title: 'Task Commander - Desktop Sticky Mission Control',
    icon: path.join(__dirname, '..', 'public', 'favicon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // 自動記憶視窗位置與大小
  const debouncedSaveBounds = () => {
    clearTimeout(boundsDebounceTimer);
    boundsDebounceTimer = setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        saveWindowState(mainWindow.getBounds(), mainWindow.isAlwaysOnTop());
      }
    }, 350);
  };

  mainWindow.on('moved', debouncedSaveBounds);
  mainWindow.on('resized', debouncedSaveBounds);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setupTrackerWatcher();
}

// ==========================================
// 4. 檔案監聽 (File Watcher for academic_tracker.json)
// ==========================================
function setupTrackerWatcher() {
  if (trackerWatcher) {
    try { trackerWatcher.close(); } catch {}
  }

  if (!fs.existsSync(trackerPath)) return;

  try {
    trackerWatcher = fs.watch(trackerPath, (eventType) => {
      if (eventType === 'change' || eventType === 'rename') {
        clearTimeout(watcherDebounceTimer);
        watcherDebounceTimer = setTimeout(() => {
          if (mainWindow && !mainWindow.isDestroyed()) {
            try {
              const content = fs.readFileSync(trackerPath, 'utf-8');
              const data = JSON.parse(content);
              mainWindow.webContents.send('tracker-updated', data);
            } catch (err) {
              console.error('Failed to notify tracker update:', err);
            }
          }
        }, 300);
      }
    });
  } catch (err) {
    console.error('Error setting up tracker file watcher:', err);
  }
}

// ==========================================
// 5. IPC 通訊處理常式 (IPC Handlers)
// ==========================================
ipcMain.handle('read-tracker', async () => {
  try {
    if (fs.existsSync(trackerPath)) {
      const raw = fs.readFileSync(trackerPath, 'utf-8');
      return JSON.parse(raw);
    }
    const publicPath = path.join(__dirname, '..', 'public', 'academic_tracker.json');
    if (fs.existsSync(publicPath)) {
      return JSON.parse(fs.readFileSync(publicPath, 'utf-8'));
    }
    const distPath = path.join(__dirname, '..', 'dist', 'academic_tracker.json');
    if (fs.existsSync(distPath)) {
      return JSON.parse(fs.readFileSync(distPath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading academic_tracker.json:', err);
  }
  return null;
});

ipcMain.handle('save-tracker', async (_event, data) => {
  try {
    fs.writeFileSync(trackerPath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
  } catch (err) {
    console.error('Error saving academic_tracker.json:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('read-file', async (_event, relativePath) => {
  try {
    let fullPath = path.resolve(workspaceRoot, relativePath);
    if (!fs.existsSync(fullPath)) {
      const directPath = path.resolve('C:\\Users\\Cupid\\Downloads\\Study-space', relativePath);
      if (fs.existsSync(directPath)) {
        fullPath = directPath;
      } else {
        return { success: false, error: 'File not found' };
      }
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    const ext = path.extname(fullPath).toLowerCase();
    return { success: true, content, ext, fullPath };
  } catch (err) {
    console.error(`Error reading file ${relativePath}:`, err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('open-path', async (_event, relativePath) => {
  try {
    let fullPath = path.resolve(workspaceRoot, relativePath);
    if (!fs.existsSync(fullPath)) {
      fullPath = path.resolve('C:\\Users\\Cupid\\Downloads\\Study-space', relativePath);
    }
    const result = await shell.openPath(fullPath);
    return { success: !result, error: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('show-in-folder', async (_event, relativePath) => {
  try {
    let fullPath = path.resolve(workspaceRoot, relativePath);
    if (!fs.existsSync(fullPath)) {
      fullPath = path.resolve('C:\\Users\\Cupid\\Downloads\\Study-space', relativePath);
    }
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
      icon: path.join(__dirname, '..', 'public', 'favicon.svg')
    }).show();
    return true;
  }
  return false;
});

// 視窗控制 IPC
ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
  return true;
});

ipcMain.handle('window-close', () => {
  if (mainWindow) mainWindow.close();
  return true;
});

ipcMain.handle('window-toggle-pin', () => {
  if (mainWindow) {
    const isPinned = !mainWindow.isAlwaysOnTop();
    mainWindow.setAlwaysOnTop(isPinned);
    saveWindowState(mainWindow.getBounds(), isPinned);
    return isPinned;
  }
  return false;
});

ipcMain.handle('window-get-pinned', () => {
  return mainWindow ? mainWindow.isAlwaysOnTop() : false;
});

// 當第二個實例試圖啟動時，聚焦到現有的主要視窗
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
});

// ==========================================
// 6. 應用程式生命週期管理
// ==========================================
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (trackerWatcher) {
    try { trackerWatcher.close(); } catch {}
  }
  app.quit();
});
