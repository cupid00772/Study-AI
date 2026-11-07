const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  getTrackerData: () => ipcRenderer.invoke('read-tracker'),
  saveTrackerData: (data) => ipcRenderer.invoke('save-tracker', data),
  readFileContent: (relativePath) => ipcRenderer.invoke('read-file', relativePath),
  openExternalPath: (relativePath) => ipcRenderer.invoke('open-path', relativePath),
  showItemInFolder: (relativePath) => ipcRenderer.invoke('show-in-folder', relativePath),
  sendNotification: (payload) => ipcRenderer.invoke('send-notification', payload),
  onTrackerUpdated: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('tracker-updated', handler);
    return () => ipcRenderer.removeListener('tracker-updated', handler);
  },
  // 視窗控制與便條紙拖曳/記憶功能
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  togglePinWindow: () => ipcRenderer.invoke('window-toggle-pin'),
  isWindowPinned: () => ipcRenderer.invoke('window-get-pinned')
});
