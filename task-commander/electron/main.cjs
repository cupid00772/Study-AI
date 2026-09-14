const { app, BrowserWindow } = require('electron');
const path = require('path');

// ==========================================
// 1. 單一執行個體鎖 (Single Instance Lock)
// ==========================================
// 確保應用程式只能同時存在一個實例
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // 如果已經有一個實例在執行，則立刻強制結束這個新開啟的實例
  app.quit();
  return;
}

const isDev = !app.isPackaged;
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Task Commander',
    icon: path.join(__dirname, '..', 'public', 'favicon.svg'),
    backgroundColor: '#121418',
    autoHideMenuBar: true, // 隱藏頂部選單列
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false, // 確保背景運作順暢
    },
  });

  if (isDev) {
    // In dev mode, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // 當視窗被關閉時清理資源
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 當第二個實例試圖啟動時，聚焦到現有的主要視窗
app.on('second-instance', (event, commandLine, workingDirectory) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
});

// ==========================================
// 2. 應用程式生命週期管理
// ==========================================
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 當所有視窗都關閉時
app.on('window-all-closed', () => {
  // 無論什麼作業系統，只要所有視窗關閉，就徹底關閉所有背景進程與應用程式本身
  app.quit();
});

// 在退出前執行的清理動作 (可選)
app.on('before-quit', () => {
  // 在這裡可以加入額外的資源清理動作，確保沒有殭屍進程殘留
});
