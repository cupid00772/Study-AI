const { app, BrowserWindow, ipcMain, shell, Notification, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// 徹底關閉原生選單列，防止 Windows 在無邊框模式下產生空白白色功能表橫條
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
// 3. 視窗形狀裁剪與狀態記憶 (Window Shape & State Persistence)
// ==========================================
function getRoundedRectRegions(width, height, radius) {
  const rects = [];
  const r = Math.min(radius, Math.floor(width / 2), Math.floor(height / 2));
  if (r <= 0) {
    return [{ x: 0, y: 0, width, height }];
  }
  // 頂部圓角階梯切片
  for (let y = 0; y < r; y++) {
    const dy = r - y - 1;
    const dx = Math.round(r - Math.sqrt(Math.max(0, r * r - dy * dy)));
    rects.push({ x: dx, y: y, width: width - 2 * dx, height: 1 });
  }
  // 中央主矩形區域
  rects.push({ x: 0, y: r, width: width, height: height - 2 * r });
  // 底部圓角階梯切片
  for (let i = 0; i < r; i++) {
    const y = height - r + i;
    const dy = i;
    const dx = Math.round(r - Math.sqrt(Math.max(0, r * r - dy * dy)));
    rects.push({ x: dx, y: y, width: width - 2 * dx, height: 1 });
  }
  return rects;
}

let isCompactModeActive = false;

function applyWindowShape(radius) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  try {
    const bounds = mainWindow.getBounds();
    const effectiveRadius = radius !== undefined ? radius : (isCompactModeActive ? 20 : 26);
    const regions = getRoundedRectRegions(bounds.width, bounds.height, effectiveRadius);
    if (typeof mainWindow.setShape === 'function') {
      mainWindow.setShape(regions);
    }
  } catch (err) {
    console.error('Error applying window shape:', err);
  }
}

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
        if (data.isCompact) isCompactModeActive = true;
        return data;
      }
    }
  } catch (err) {
    console.error('Error loading window state:', err);
  }
  return {
    width: 1240,
    height: 820,
    x: undefined,
    y: undefined,
    isPinned: false,
    isCompact: false,
    fullWidth: 1240,
    fullHeight: 820,
    compactWidth: 580,
    compactHeight: 680
  };
}

function saveWindowState(bounds, isPinned, isCompact) {
  try {
    const file = getWindowStatePath();
    const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : {};
    const compactFlag = isCompact !== undefined ? isCompact : (existing.isCompact || isCompactModeActive);
    const data = {
      ...existing,
      ...bounds,
      isPinned: isPinned !== undefined ? isPinned : existing.isPinned,
      isCompact: compactFlag
    };
    if (compactFlag) {
      data.compactWidth = bounds.width;
      data.compactHeight = bounds.height;
    } else {
      data.fullWidth = bounds.width;
      data.fullHeight = bounds.height;
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving window state:', err);
  }
}

function createWindow() {
  const savedState = loadWindowState();
  const initialWidth = isCompactModeActive ? (savedState.compactWidth || 580) : (savedState.fullWidth || savedState.width || 1240);
  const initialHeight = isCompactModeActive ? (savedState.compactHeight || 680) : (savedState.fullHeight || savedState.height || 820);

  mainWindow = new BrowserWindow({
    width: initialWidth,
    height: initialHeight,
    x: savedState.x,
    y: savedState.y,
    minWidth: 420,
    minHeight: 400,
    frame: false,              // 無邊框便條紙視窗
    transparent: true,         // 背景透明/磨砂透光
    backgroundColor: '#00000000',
    hasShadow: false,          // 關閉原生 DWM 陰影，防止 Windows 在失焦時繪製頂部白色 fallback 標題列
    thickFrame: false,         // 徹底關閉 Windows 厚邊框與標準標題列大小計算，防止 Windows 11 DWM 繪製非客戶端白色橫條
    roundedCorners: false,     // 關閉 Windows 11 系統非客戶端圓角覆蓋，由 CSS 與 setShape 接管
    backgroundMaterial: 'none',// 關閉 Windows 11 預設材質，防止失焦時背景變白
    autoHideMenuBar: true,     // 徹底隱藏選單列，避免保留空白頂部空間
    title: '',                 // 空標題防止 Windows DWM 繪製視窗名稱白色橫條
    show: false,               // 防止初次渲染時白色閃爍
    alwaysOnTop: !!savedState.isPinned,
    icon: path.join(__dirname, '..', 'public', 'favicon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  // 攔截網頁標題更新，防止 Windows 在失焦或重繪時於視窗左上角生成白色標題橫條
  mainWindow.webContents.on('page-title-updated', (e) => {
    e.preventDefault();
  });

  // 防止 Windows DWM 在失焦時繪製原生白色標題列或背景反白
  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setBackgroundColor('#00000000');
    }
  });

  mainWindow.on('focus', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setBackgroundColor('#00000000');
    }
  });

  mainWindow.once('ready-to-show', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      applyWindowShape(isCompactModeActive ? 20 : 26);
      mainWindow.show();
    }
  });

  mainWindow.on('resize', () => {
    applyWindowShape(isCompactModeActive ? 20 : 26);
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
    if (typeof relativePath === 'string' && (relativePath.startsWith('http://') || relativePath.startsWith('https://'))) {
      await shell.openExternal(relativePath);
      return { success: true };
    }
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

ipcMain.handle('select-file', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: '選擇要導入的學習資料檔案',
      defaultPath: workspaceRoot,
      properties: ['openFile'],
      filters: [
        { name: '學習文件', extensions: ['md', 'html', 'pdf', 'docx', 'txt', 'py', 'json'] },
        { name: '所有檔案', extensions: ['*'] }
      ]
    });
    if (!result.canceled && result.filePaths.length > 0) {
      const fullPath = result.filePaths[0];
      let relPath = path.relative(workspaceRoot, fullPath).replace(/\\/g, '/');
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
    const candidates = [];
    const scanDirs = [
      { dir: 'Study_Materials', cat: 'Study_Materials' },
      { dir: 'Test_Bank', cat: 'Test_Bank' },
      { dir: 'Reference', cat: 'Misc_Custom' }
    ];

    function walkDir(subDir, cat) {
      const fullDir = path.join(workspaceRoot, subDir);
      if (!fs.existsSync(fullDir)) return;
      const entries = fs.readdirSync(fullDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name.startsWith('_') || entry.name === 'node_modules') continue;
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
            candidates.push({
              path: rel,
              filename: entry.name,
              ext,
              category: cat,
              course
            });
          }
        }
      }
    }

    for (const s of scanDirs) {
      walkDir(s.dir, s.cat);
    }

    return { success: true, files: candidates };
  } catch (err) {
    return { success: false, error: err.message };
  }
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
    saveWindowState(mainWindow.getBounds(), isPinned, isCompactModeActive);
    return isPinned;
  }
  return false;
});

ipcMain.handle('window-get-pinned', () => {
  return mainWindow ? mainWindow.isAlwaysOnTop() : false;
});

ipcMain.handle('window-set-compact-mode', (_event, isCompact) => {
  if (!mainWindow || mainWindow.isDestroyed()) return false;
  isCompactModeActive = !!isCompact;
  const savedState = loadWindowState();
  if (isCompactModeActive) {
    const currentBounds = mainWindow.getBounds();
    if (currentBounds.width > 700) {
      savedState.fullWidth = currentBounds.width;
      savedState.fullHeight = currentBounds.height;
    }
    const w = savedState.compactWidth || 580;
    const h = savedState.compactHeight || 680;
    mainWindow.setSize(w, h);
    applyWindowShape(20);
  } else {
    const w = savedState.fullWidth || 1240;
    const h = savedState.fullHeight || 820;
    mainWindow.setSize(w, h);
    applyWindowShape(26);
  }
  saveWindowState(mainWindow.getBounds(), mainWindow.isAlwaysOnTop(), isCompactModeActive);
  return true;
});

ipcMain.handle('window-update-shape', (_event, radius) => {
  applyWindowShape(radius);
  return true;
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
