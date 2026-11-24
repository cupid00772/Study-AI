import { useState, useEffect } from 'react';
import {
  Settings,
  BellRing,
  Cpu,
  Heart,
  Wrench,
  Plus,
  Trash2,
  X,
  FolderOpen,
  GraduationCap,
  Check,
  Cloud,
  RefreshCw,
  Lock,
  Unlock,
  UploadCloud,
} from 'lucide-react';
import {
  getResolvedCloudConfig,
  saveCloudConfigOverride,
  getDeviceId,
} from '../services/supabaseClient';
import { getAssetManifest } from '../services/cloudAssetService';

export default function SettingsModal({
  onClose,
  appConfig,
  onSaveAppConfig,
  reminders,
  setReminders,
  onTriggerAlertTest,
  onOpenGraduationCredits,
  cloudStatus,
  cloudAuth,
  onForceCloudSync,
  onOpenCloudUnlock,
  onLockCloudWrite,
  onCloudConfigSaved,
}) {
  const isElectron = Boolean(window.electronAPI?.isElectron);
  const [activeTab, setActiveTab] = useState(isElectron ? 'alerts' : 'cloud');

  const [draft, setDraft] = useState(() => ({
    minimizeToTray: appConfig?.minimizeToTray ?? true,
    autoLaunch: appConfig?.autoLaunch ?? true,
    autoSyncEnabled: appConfig?.autoSyncEnabled ?? true,
    autoSyncIntervalHours: appConfig?.autoSyncIntervalHours ?? 4,
    autoWatchDeliverables: appConfig?.autoWatchDeliverables ?? true,
    alerts: {
      enabled: appConfig?.alerts?.enabled ?? true,
      assignmentLeadDays: appConfig?.alerts?.assignmentLeadDays ?? 3,
      includeOverdue: appConfig?.alerts?.includeOverdue ?? true,
      examLeadDays: appConfig?.alerts?.examLeadDays ?? 7,
      studyRemindersEnabled: appConfig?.alerts?.studyRemindersEnabled ?? true,
      dailyTriggerTimes: [...(appConfig?.alerts?.dailyTriggerTimes || ['09:00', '20:00'])],
      triggerOnStartup: appConfig?.alerts?.triggerOnStartup ?? true,
      showPopupWindow: appConfig?.alerts?.showPopupWindow ?? true,
      showWindowsToast: appConfig?.alerts?.showWindowsToast ?? true,
      snoozeMinutes: appConfig?.alerts?.snoozeMinutes ?? 30,
      dailyStudyGoalMinutes: appConfig?.alerts?.dailyStudyGoalMinutes ?? 60,
    },
  }));

  const [newTimeSlot, setNewTimeSlot] = useState('21:30');
  const [newReminder, setNewReminder] = useState('');
  const [workspaceInfo, setWorkspaceInfo] = useState(null);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Cloud config form
  const resolvedCloud = getResolvedCloudConfig();
  const [showAdvancedCloud, setShowAdvancedCloud] = useState(!resolvedCloud.configured);
  const [cloudUrlInput, setCloudUrlInput] = useState(resolvedCloud.url || '');
  const [cloudAnonInput, setCloudAnonInput] = useState(resolvedCloud.anonKey || '');
  const [cloudEmailInput, setCloudEmailInput] = useState(resolvedCloud.ownerEmail || '');
  const [assetSyncBusy, setAssetSyncBusy] = useState(false);
  const [assetSyncMsg, setAssetSyncMsg] = useState('');

  const assetCount = Object.keys(getAssetManifest()?.files || {}).length;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (!isElectron) return;
    window.electronAPI?.getWorkspaceInfo?.().then((info) => {
      if (info) setWorkspaceInfo(info);
    });
    window.electronAPI?.getAutoLaunch?.().then((enabled) => {
      if (typeof enabled === 'boolean') {
        setDraft((prev) => ({ ...prev, autoLaunch: enabled }));
      }
    });
  }, [isElectron]);

  const updateAlertField = (field, value) => {
    setDraft((prev) => ({ ...prev, alerts: { ...prev.alerts, [field]: value } }));
  };

  const handleAddTimeSlot = () => {
    if (!/^\d{2}:\d{2}$/.test(newTimeSlot)) return;
    if (draft.alerts.dailyTriggerTimes.includes(newTimeSlot)) return;
    const sorted = [...draft.alerts.dailyTriggerTimes, newTimeSlot].sort();
    updateAlertField('dailyTriggerTimes', sorted);
  };

  const handleRemoveTimeSlot = (slot) => {
    updateAlertField(
      'dailyTriggerTimes',
      draft.alerts.dailyTriggerTimes.filter((t) => t !== slot)
    );
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newReminder.trim()) return;
    setReminders((prev) => [...prev, newReminder.trim()]);
    setNewReminder('');
  };

  const handleDeleteReminder = (index) => {
    setReminders((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePickWorkspace = async () => {
    const res = await window.electronAPI?.selectWorkspaceDir?.();
    if (res?.success) {
      const info = await window.electronAPI?.getWorkspaceInfo?.();
      if (info) setWorkspaceInfo(info);
    }
  };

  const handleSaveCloudOverride = (e) => {
    e.preventDefault();
    saveCloudConfigOverride({
      url: cloudUrlInput,
      anonKey: cloudAnonInput,
      ownerEmail: cloudEmailInput,
    });
    onCloudConfigSaved?.();
    setAssetSyncMsg('已儲存本機 Supabase 連線設定，正在重新連線...');
  };

  const handleElectronAssetSync = async () => {
    if (!window.electronAPI?.syncCloudAssets) return;
    setAssetSyncBusy(true);
    setAssetSyncMsg('正在掃描並增量上傳教材與題庫（自動排除 Reference 大檔）...');
    try {
      const res = await window.electronAPI.syncCloudAssets({ withTracker: true });
      if (res?.success) {
        const lines = String(res.output || '').trim().split(/\r?\n/);
        setAssetSyncMsg(lines[lines.length - 1] || '雲端教材增量同步完成！');
        onForceCloudSync?.();
      } else {
        setAssetSyncMsg(`同步提示：${res?.error || '請先建立 task-commander/.env.local'}`);
      }
    } finally {
      setAssetSyncBusy(false);
    }
  };

  const handleSave = async () => {
    await onSaveAppConfig?.(draft);
    if (isElectron && window.electronAPI?.setAutoLaunch) {
      await window.electronAPI.setAutoLaunch(draft.autoLaunch);
    }
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 450);
  };

  const statusBadgeMap = {
    synced: { cls: 'badge-green', text: '雲端已即時同步' },
    syncing: { cls: 'badge-blue', text: '同步中...' },
    readonly: { cls: 'badge-amber', text: '公開唯讀模式（未解鎖寫入）' },
    offline: { cls: 'badge-amber', text: '離線快取模式' },
    unconfigured: { cls: 'badge-purple', text: '尚未設定 Supabase 連線' },
    error: { cls: 'badge-pink', text: '同步異常' },
    idle: { cls: 'badge-blue', text: '準備中' },
  };
  const badgeInfo = statusBadgeMap[cloudStatus?.status || 'idle'] || statusBadgeMap.idle;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '660px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', padding: '1.35rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 className="modal-title" style={{ margin: 0, fontSize: '1.12rem' }}>系統設定與雲端同步</h2>
          </div>
          <button type="button" className="btn btn-secondary btn-icon-sm" onClick={onClose} aria-label="關閉設定">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="settings-tabs">
          <button type="button" className={`settings-tab-btn ${activeTab === 'cloud' ? 'active' : ''}`} onClick={() => setActiveTab('cloud')}>
            <Cloud size={14} /> 雲端同步
          </button>
          {isElectron && (
            <>
              <button type="button" className={`settings-tab-btn ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
                <BellRing size={14} /> 警告與讀書提醒
              </button>
              <button type="button" className={`settings-tab-btn ${activeTab === 'automation' ? 'active' : ''}`} onClick={() => setActiveTab('automation')}>
                <Cpu size={14} /> 自動化與常駐
              </button>
            </>
          )}
          <button type="button" className={`settings-tab-btn ${activeTab === 'reminders' ? 'active' : ''}`} onClick={() => setActiveTab('reminders')}>
            <Heart size={14} /> 生活叮嚀
          </button>
          <button type="button" className={`settings-tab-btn ${activeTab === 'tools' ? 'active' : ''}`} onClick={() => setActiveTab('tools')}>
            <Wrench size={14} /> 其他功能
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeTab === 'cloud' && (
            <>
              <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div className="setting-row-title" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Cloud size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span>Supabase 跨設備同步狀態</span>
                  </div>
                  <span className={`badge-chip ${badgeInfo.cls}`}>{badgeInfo.text}</span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '6px' }}>
                  <div>裝置代碼：<code>{getDeviceId()}</code></div>
                  <div>雲端可讀檔案：<strong>{assetCount} 份</strong></div>
                  <div>待補推變更：<strong>{cloudStatus?.pendingCount || 0} 筆</strong></div>
                  <div>
                    上次同步：
                    {cloudStatus?.lastSyncedAt
                      ? new Date(cloudStatus.lastSyncedAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                      : '尚未同步'}
                  </div>
                </div>

                {cloudStatus?.error && (
                  <div style={{ fontSize: '0.76rem', color: 'var(--accent-danger)' }}>
                    錯誤訊息：{cloudStatus.error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => onForceCloudSync?.()}>
                    <RefreshCw size={14} /> 立即雙向同步
                  </button>

                  {cloudAuth?.configured && (
                    cloudAuth?.canWrite ? (
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onLockCloudWrite?.()}>
                        <Lock size={14} /> 鎖定回唯讀 ({cloudAuth.email || '已登入'})
                      </button>
                    ) : (
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => { onClose(); onOpenCloudUnlock?.(); }}>
                        <Unlock size={14} /> 解鎖此裝置寫入權限
                      </button>
                    )
                  )}

                  {isElectron && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled={assetSyncBusy}
                      onClick={handleElectronAssetSync}
                    >
                      <UploadCloud size={14} /> {assetSyncBusy ? '上傳中...' : '同步本機教材至雲端'}
                    </button>
                  )}
                </div>

                {assetSyncMsg && (
                  <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)', background: 'var(--bg-panel)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    {assetSyncMsg}
                  </div>
                )}
              </div>

              <div className="setting-box">
                <div
                  onClick={() => setShowAdvancedCloud((p) => !p)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
                >
                  <span className="setting-label" style={{ margin: 0 }}>
                    進階：手動設定此裝置的 Supabase 連線資訊（覆寫環境變數）
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    {showAdvancedCloud ? '收合' : '展開'}
                  </span>
                </div>

                {showAdvancedCloud && (
                  <form onSubmit={handleSaveCloudOverride} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://xxxxx.supabase.co"
                      value={cloudUrlInput}
                      onChange={(e) => setCloudUrlInput(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Supabase Anon Public Key (eyJ...)"
                      value={cloudAnonInput}
                      onChange={(e) => setCloudAnonInput(e.target.value)}
                    />
                    <input
                      type="email"
                      className="form-control"
                      placeholder="本人編輯帳號 Email（選填，用於預填解鎖視窗）"
                      value={cloudEmailInput}
                      onChange={(e) => setCloudEmailInput(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button type="submit" className="btn btn-secondary btn-sm">
                        套用連線設定
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}

          {isElectron && activeTab === 'alerts' && (
            <>
              <div className="setting-toggle-row">
                <div>
                  <div className="setting-row-title">啟用智慧學習與截止警告</div>
                  <div className="setting-row-desc">定時檢查即將截止作業、考前倒數與每日讀書目標</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={draft.alerts.enabled}
                  onChange={(e) => updateAlertField('enabled', e.target.checked)}
                />
              </div>

              <div className="setting-grid-2">
                <div className="setting-box">
                  <label className="setting-label">作業提前警告天數</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    className="form-control"
                    value={draft.alerts.assignmentLeadDays}
                    onChange={(e) => updateAlertField('assignmentLeadDays', Number(e.target.value) || 3)}
                  />
                </div>
                <div className="setting-box">
                  <label className="setting-label">考前每日倒數天數（預設 7 天）</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    className="form-control"
                    value={draft.alerts.examLeadDays}
                    onChange={(e) => updateAlertField('examLeadDays', Number(e.target.value) || 7)}
                  />
                </div>
              </div>

              <div className="setting-grid-2">
                <div className="setting-box">
                  <label className="setting-label">每日讀書專注目標（分鐘）</label>
                  <input
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    className="form-control"
                    value={draft.alerts.dailyStudyGoalMinutes}
                    onChange={(e) => updateAlertField('dailyStudyGoalMinutes', Number(e.target.value) || 60)}
                  />
                </div>
                <div className="setting-box">
                  <label className="setting-label">延後提醒間隔（Snooze 分鐘）</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    step="5"
                    className="form-control"
                    value={draft.alerts.snoozeMinutes}
                    onChange={(e) => updateAlertField('snoozeMinutes', Number(e.target.value) || 30)}
                  />
                </div>
              </div>

              <div className="setting-box">
                <label className="setting-label">每日固定跳警告時段</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {draft.alerts.dailyTriggerTimes.map((slot) => (
                    <span key={slot} className="badge-chip badge-blue" style={{ padding: '4px 10px', gap: '6px' }}>
                      <span>{slot}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeSlot(slot)}
                        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="time"
                    className="form-control"
                    style={{ width: '150px' }}
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddTimeSlot}>
                    <Plus size={14} /> 新增時段
                  </button>
                </div>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-row-title">開機／首次啟動時立即檢查一次</div>
                  <div className="setting-row-desc">每天第一次啟動時自動顯示當日作業與考前 7 天警告</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={draft.alerts.triggerOnStartup}
                  onChange={(e) => updateAlertField('triggerOnStartup', e.target.checked)}
                />
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-row-title">彈出置頂獨立警告視窗</div>
                  <div className="setting-row-desc">除系統通知外，直接於右下角浮現醒目互動警告卡</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={draft.alerts.showPopupWindow}
                  onChange={(e) => updateAlertField('showPopupWindow', e.target.checked)}
                />
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-row-title">同時發送 Windows 系統通知 (Toast)</div>
                  <div className="setting-row-desc">保留於 Windows 通知中心，避免漏看</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={draft.alerts.showWindowsToast}
                  onChange={(e) => updateAlertField('showWindowsToast', e.target.checked)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={onTriggerAlertTest}>
                  <BellRing size={14} /> 立即測試彈出警告視窗
                </button>
              </div>
            </>
          )}

          {isElectron && activeTab === 'automation' && (
            <>
              <div className="setting-toggle-row">
                <div>
                  <div className="setting-row-title">關閉視窗時縮至系統匣常駐</div>
                  <div className="setting-row-desc">確保背景定時提醒、考前倒數與 eeclass 同步持續運作</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={draft.minimizeToTray}
                  onChange={(e) => setDraft((p) => ({ ...p, minimizeToTray: e.target.checked }))}
                />
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-row-title">Windows 開機自動啟動（背景靜默）</div>
                  <div className="setting-row-desc">登入 Windows 時自動啟動於系統匣並恢復桌面便條</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={draft.autoLaunch}
                  onChange={(e) => setDraft((p) => ({ ...p, autoLaunch: e.target.checked }))}
                />
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-row-title">背景自動同步中央大學 eeclass</div>
                  <div className="setting-row-desc">啟動時若資料過舊自動同步，並依設定間隔定時更新</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={draft.autoSyncEnabled}
                  onChange={(e) => setDraft((p) => ({ ...p, autoSyncEnabled: e.target.checked }))}
                />
              </div>

              {draft.autoSyncEnabled && (
                <div className="setting-box">
                  <label className="setting-label">eeclass 自動同步間隔（小時）</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    className="form-control"
                    style={{ width: '140px' }}
                    value={draft.autoSyncIntervalHours}
                    onChange={(e) => setDraft((p) => ({ ...p, autoSyncIntervalHours: Number(e.target.value) || 4 }))}
                  />
                </div>
              )}

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-row-title">AI 成果庫自動監聽收錄</div>
                  <div className="setting-row-desc">自動偵測 Study_Materials/ 與 Test_Bank/ 新增檔案並收錄同步</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={draft.autoWatchDeliverables}
                  onChange={(e) => setDraft((p) => ({ ...p, autoWatchDeliverables: e.target.checked }))}
                />
              </div>

              {workspaceInfo && (
                <div className="setting-box">
                  <label className="setting-label">Study-space 工作區路徑</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <code className="workspace-path-code">{workspaceInfo.workspaceRoot}</code>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handlePickWorkspace}>
                      <FolderOpen size={14} /> 變更資料夾
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'reminders' && (
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                每日會在首頁與行動端顯示這些生活叮嚀（自動跨裝置同步）。
              </div>
              <form onSubmit={handleAddReminder} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <input
                  type="text"
                  className="form-control"
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                  placeholder="輸入新生活叮嚀（例如：吃感冒藥、記得帶水壺）"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  <Plus size={15} /> 新增
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {reminders.length === 0 && (
                  <div className="empty-mini">目前尚未設定每日生活叮嚀</div>
                )}
                {reminders.map((reminder, idx) => (
                  <div key={idx} className="setting-list-item">
                    <span>{reminder}</span>
                    <button
                      type="button"
                      className="icon-ghost-btn danger"
                      onClick={() => handleDeleteReminder(idx)}
                      aria-label={`刪除提醒：${reminder}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="setting-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div className="setting-row-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={16} style={{ color: 'var(--accent-primary)' }} />
                    128 畢業學分檢核表（選課用）
                  </div>
                  <div className="setting-row-desc">
                    檢視並勾選資管系 4 年必修、通識與必選修學分進度表，跨裝置自動同步。
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ flexShrink: 0 }}
                  onClick={() => {
                    onClose();
                    onOpenGraduationCredits?.();
                  }}
                >
                  開啟檢核表
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem', paddingTop: '0.9rem', borderTop: '1px solid var(--border-color)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            關閉
          </button>
          {isElectron && (
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              {savedFeedback ? <><Check size={15} /> 已儲存</> : '儲存設定'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
