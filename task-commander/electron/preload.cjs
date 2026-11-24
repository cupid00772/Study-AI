const { contextBridge, ipcRenderer } = require('electron');

function subscribe(channel, callback) {
  const handler = (_event, payload) => callback(payload);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,

  // Tracker & Workspace Files
  getTrackerData: () => ipcRenderer.invoke('read-tracker'),
  saveTrackerData: (data) => ipcRenderer.invoke('save-tracker', data),
  readFileContent: (relativePath) => ipcRenderer.invoke('read-file', relativePath),
  writeFileContent: (payload) => ipcRenderer.invoke('write-file-content', payload),
  trashFile: (relativePath) => ipcRenderer.invoke('trash-file', relativePath),
  ensureVaultSubjectDir: (payload) => ipcRenderer.invoke('ensure-vault-subject-dir', payload),
  openExternalPath: (relativePath) => ipcRenderer.invoke('open-path', relativePath),
  showItemInFolder: (relativePath) => ipcRenderer.invoke('show-in-folder', relativePath),
  selectFile: () => ipcRenderer.invoke('select-file'),
  scanWorkspaceDeliverables: () => ipcRenderer.invoke('scan-workspace-deliverables'),
  getWorkspaceInfo: () => ipcRenderer.invoke('get-workspace-info'),
  selectWorkspaceDir: () => ipcRenderer.invoke('select-workspace-dir'),

  // Notifications & Alerts
  sendNotification: (payload) => ipcRenderer.invoke('send-notification', payload),
  triggerAlertCheck: (options) => ipcRenderer.invoke('trigger-alert-check', options),
  getAlertPayload: () => ipcRenderer.invoke('get-alert-payload'),
  snoozeAlert: (minutes) => ipcRenderer.invoke('snooze-alert', minutes),
  dismissAlertToday: () => ipcRenderer.invoke('dismiss-alert-today'),
  alertAction: (action) => ipcRenderer.invoke('alert-action', action),
  updateStudyState: (state) => ipcRenderer.invoke('update-study-state', state),
  pulseAlertWindowShake: () => ipcRenderer.invoke('alert-shake-pulse'),
  stopAlertWindowShake: () => ipcRenderer.invoke('alert-shake-stop'),
  importAlertSound: () => ipcRenderer.invoke('import-alert-sound'),
  listCustomAlertSounds: () => ipcRenderer.invoke('list-custom-alert-sounds'),
  deleteCustomAlertSound: (fileName) => ipcRenderer.invoke('delete-custom-alert-sound', fileName),
  readAlertSoundData: (fileName) => ipcRenderer.invoke('read-alert-sound-data', fileName),

  // App Config & Auto Launch
  getAppConfig: () => ipcRenderer.invoke('get-app-config'),
  saveAppConfig: (config) => ipcRenderer.invoke('save-app-config', config),
  getAutoLaunch: () => ipcRenderer.invoke('get-auto-launch'),
  setAutoLaunch: (enabled) => ipcRenderer.invoke('set-auto-launch', enabled),

  // Window Controls
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  toggleMaximizeWindow: () => ipcRenderer.invoke('window-toggle-maximize'),
  isWindowMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  quitApp: () => ipcRenderer.invoke('app-quit'),
  togglePinWindow: () => ipcRenderer.invoke('window-toggle-pin'),
  isWindowPinned: () => ipcRenderer.invoke('window-get-pinned'),
  updateWindowShape: (radius) => ipcRenderer.invoke('window-update-shape', radius),

  // Independent Desktop Windows (Sticky Notes & Daily Widget)
  createStickyWindow: (noteId) => ipcRenderer.invoke('create-sticky-window', noteId),
  closeStickyWindow: (noteId) => ipcRenderer.invoke('close-sticky-window', noteId),
  deleteStickyPosition: (noteId) => ipcRenderer.invoke('delete-sticky-position', noteId),
  createDailyWindow: () => ipcRenderer.invoke('create-daily-window'),
  closeDailyWindow: () => ipcRenderer.invoke('close-daily-window'),
  closeCurrentWindow: () => ipcRenderer.invoke('close-current-window'),
  getActiveStickyIds: () => ipcRenderer.invoke('get-active-sticky-ids'),

  // EEClass Sync & Cloud Assets Sync
  syncEEClass: () => ipcRenderer.invoke('sync-eeclass'),
  getCloudConfig: () => ipcRenderer.invoke('get-cloud-config'),
  syncCloudAssets: (options) => ipcRenderer.invoke('sync-cloud-assets', options),

  // Local Antigravity CLI (agy) AI Engine
  checkAgyCli: () => ipcRenderer.invoke('ai-check-agy'),
  startAgyGenerate: (payload) => ipcRenderer.invoke('ai-generate-agy', payload),
  cancelAgyGenerate: (requestId) => ipcRenderer.invoke('ai-cancel-agy', requestId),

  // Event Subscriptions
  onAgyStreamEvent: (cb) => subscribe('agy-stream-event', cb),
  onTrackerUpdated: (cb) => subscribe('tracker-updated', cb),
  onActiveStickiesUpdated: (cb) => subscribe('active-stickies-updated', cb),
  onAlertPayloadUpdated: (cb) => subscribe('alert-payload-updated', cb),
  onAlertUserInteracted: (cb) => subscribe('alert-user-interacted', cb),
  onNavigateTab: (cb) => subscribe('navigate-tab', cb),
  onStartFocusTimer: (cb) => subscribe('start-focus-timer', cb),
  onSyncStatusChanged: (cb) => subscribe('sync-status-changed', cb),
  onCloudAssetSyncStatus: (cb) => subscribe('cloud-asset-sync-status', cb),
  onCloudAssetAutoSynced: (cb) => subscribe('cloud-asset-auto-synced', cb),
  onWindowMaximizedChanged: (cb) => subscribe('window-maximized-changed', cb),
  onAutoDeliverablesAdded: (cb) => subscribe('auto-deliverables-added', cb),
});
