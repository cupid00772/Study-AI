import { useState, useEffect, useRef, useCallback } from 'react';
import SlidingContainer from './SlidingContainer';
import { useModalA11y } from '../hooks/useModalA11y';
import {
  Settings,
  BellRing,
  Heart,
  Plus,
  Trash2,
  X,
  FolderOpen,
  Check,
  Cloud,
  RefreshCw,
  Lock,
  Unlock,
  UploadCloud,
  Volume2,
  Square,
  Music,
  Upload,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  getResolvedCloudConfig,
  saveCloudConfigOverride,
} from '../services/supabaseClient';
import { getAssetManifest } from '../services/cloudAssetService';
import {
  BUILTIN_ALERT_SOUNDS,
  normalizeSoundConfig,
  playAlertSoundOnce,
  clearCachedAlertSound,
} from '../utils/alertSoundEngine';
import {
  loadAiConfig,
  saveAiConfig,
  GEMINI_API_MODEL_PRESETS,
  OPENAI_ENDPOINT_PRESETS,
} from '../services/aiService';

const SYNC_INTERVAL_PRESETS = [1, 2, 4, 6, 12, 24];

function resolveInitialTab(tab, isElectron) {
  if (tab === 'alerts' || tab === 'automation' || tab === 'desktop') {
    return isElectron ? 'desktop' : 'cloud';
  }
  if (tab === 'tools') return 'cloud';
  if (tab === 'cloud' || tab === 'ai' || tab === 'reminders' || tab === 'appearance') return tab;
  return isElectron ? 'desktop' : 'cloud';
}

export default function SettingsModal({
  onClose,
  initialTab = null,
  appConfig,
  onSaveAppConfig,
  reminders,
  setReminders,
  onTriggerAlertTest,
  cloudStatus,
  cloudAuth,
  onForceCloudSync,
  onOpenCloudUnlock,
  onLockCloudWrite,
  onCloudConfigSaved,
  reducedMotionPref = 'auto',
  onChangeReducedMotionPref,
}) {
  const isElectron = Boolean(window.electronAPI?.isElectron);
  const [activeTab, setActiveTab] = useState(() => resolveInitialTab(initialTab, isElectron));

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
      playAlertSound: appConfig?.alerts?.playAlertSound ?? true,
      focusAlarmEnabled: appConfig?.alerts?.focusAlarmEnabled ?? true,
      showWindowsToast: appConfig?.alerts?.showWindowsToast ?? true,
      snoozeMinutes: appConfig?.alerts?.snoozeMinutes ?? 30,
      dailyStudyGoalMinutes: appConfig?.alerts?.dailyStudyGoalMinutes ?? 60,
      soundConfig: normalizeSoundConfig(appConfig?.alerts?.soundConfig),
    },
  }));

  const [newTimeSlot, setNewTimeSlot] = useState('21:30');
  const [newReminder, setNewReminder] = useState('');
  const [workspaceInfo, setWorkspaceInfo] = useState(null);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Custom Alert Sounds State
  const [customSounds, setCustomSounds] = useState([]);
  const [previewingKey, setPreviewingKey] = useState(null);
  const [soundActionMsg, setSoundActionMsg] = useState('');
  const previewHandleRef = useRef(null);

  // AI Engine Config State (auto-saved locally in browser storage)
  const [aiDraft, setAiDraft] = useState(() => loadAiConfig());
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenAiKey, setShowOpenAiKey] = useState(false);
  const [agyModels, setAgyModels] = useState([]);
  const [agyStatus, setAgyStatus] = useState({ checked: false, available: false, error: '' });
  const [checkingAgy, setCheckingAgy] = useState(false);
  const [aiSavedMsg, setAiSavedMsg] = useState('');
  const aiSavedTimerRef = useRef(null);

  // Cloud config form
  const resolvedCloud = getResolvedCloudConfig();
  const [showAdvancedCloud, setShowAdvancedCloud] = useState(!resolvedCloud.configured);
  const [cloudUrlInput, setCloudUrlInput] = useState(resolvedCloud.url || '');
  const [cloudAnonInput, setCloudAnonInput] = useState(resolvedCloud.anonKey || '');
  const [cloudEmailInput, setCloudEmailInput] = useState(resolvedCloud.ownerEmail || '');
  const [assetSyncBusy, setAssetSyncBusy] = useState(false);
  const [assetSyncMsg, setAssetSyncMsg] = useState('');

  const assetCount = Object.keys(getAssetManifest()?.files || {}).length;

  const stopPreviewSound = useCallback(() => {
    if (previewHandleRef.current) {
      previewHandleRef.current.stop();
      previewHandleRef.current = null;
    }
    setPreviewingKey(null);
  }, []);

  const handleClose = useCallback(() => {
    stopPreviewSound();
    onClose();
  }, [stopPreviewSound, onClose]);

  const checkAgy = useCallback(async () => {
    if (!isElectron || !window.electronAPI?.checkAgyCli) return;
    setCheckingAgy(true);
    try {
      const res = await window.electronAPI.checkAgyCli();
      setAgyStatus({ checked: true, available: Boolean(res?.available), error: res?.error || '' });
      if (Array.isArray(res?.models)) setAgyModels(res.models);
    } finally {
      setCheckingAgy(false);
    }
  }, [isElectron]);

  const { dialogRef } = useModalA11y({ isOpen: true, onClose: handleClose });

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
    window.electronAPI?.listCustomAlertSounds?.().then((list) => {
      if (Array.isArray(list)) setCustomSounds(list);
    });
    window.electronAPI?.checkAgyCli?.().then((res) => {
      setAgyStatus({ checked: true, available: Boolean(res?.available), error: res?.error || '' });
      if (Array.isArray(res?.models)) setAgyModels(res.models);
    });
  }, [isElectron]);

  useEffect(() => {
    return () => {
      stopPreviewSound();
      if (aiSavedTimerRef.current) window.clearTimeout(aiSavedTimerRef.current);
    };
  }, [stopPreviewSound]);

  const updateAlertField = (field, value) => {
    setDraft((prev) => ({ ...prev, alerts: { ...prev.alerts, [field]: value } }));
  };

  const updateSoundConfigPatch = (patch) => {
    setDraft((prev) => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        soundConfig: {
          ...normalizeSoundConfig(prev.alerts.soundConfig),
          ...patch,
        },
      },
    }));
  };

  const updateAiDraft = (patch) => {
    setAiDraft((prev) => {
      const next = { ...prev, ...patch };
      saveAiConfig(next);
      return next;
    });
    setAiSavedMsg('已自動儲存');
    if (aiSavedTimerRef.current) window.clearTimeout(aiSavedTimerRef.current);
    aiSavedTimerRef.current = window.setTimeout(() => setAiSavedMsg(''), 1800);
  };

  const handleTogglePreviewSound = (key, soundSpec, isCritical = false) => {
    if (previewingKey === key) {
      stopPreviewSound();
      return;
    }
    stopPreviewSound();
    setPreviewingKey(key);
    const handle = playAlertSoundOnce({
      soundSpec,
      isCritical,
      volume: draft.alerts.soundConfig?.volume ?? 0.75,
    });
    previewHandleRef.current = handle;
    handle.finished.then(() => {
      if (previewHandleRef.current === handle) {
        previewHandleRef.current = null;
        setPreviewingKey(null);
      }
    });
  };

  const handleImportCustomSound = async () => {
    if (!window.electronAPI?.importAlertSound) return;
    setSoundActionMsg('');
    const res = await window.electronAPI.importAlertSound();
    if (res?.canceled) return;
    if (!res?.success) {
      setSoundActionMsg(`匯入失敗：${res?.error || '未知錯誤'}`);
      return;
    }
    if (Array.isArray(res.list)) setCustomSounds(res.list);
    if (res.sound) {
      const spec = { type: 'custom', id: res.sound.id, fileName: res.sound.fileName, label: res.sound.label };
      updateSoundConfigPatch({ normalSound: spec, separateCriticalSound: false });
      setSoundActionMsg(`已匯入「${res.sound.label}」並設為提醒音效`);
    }
  };

  const handleDeleteCustomSound = async (sound) => {
    if (!window.electronAPI?.deleteCustomAlertSound) return;
    stopPreviewSound();
    clearCachedAlertSound(sound.fileName);
    const res = await window.electronAPI.deleteCustomAlertSound(sound.fileName);
    if (res?.success && Array.isArray(res.list)) {
      setCustomSounds(res.list);
      const sc = normalizeSoundConfig(draft.alerts.soundConfig);
      const patch = {};
      if (sc.normalSound?.type === 'custom' && sc.normalSound.fileName === sound.fileName) {
        patch.normalSound = { type: 'preset', id: 'classic-chime', label: '清脆警報（經典預設）' };
      }
      if (sc.criticalSound?.type === 'custom' && sc.criticalSound.fileName === sound.fileName) {
        patch.criticalSound = { type: 'preset', id: 'urgent-radar', label: '雷達急促警示' };
      }
      if (sc.focusSound?.type === 'custom' && sc.focusSound.fileName === sound.fileName) {
        patch.focusSound = { type: 'preset', id: 'digital-alarm', label: '經典電子鬧鐘' };
      }
      if (Object.keys(patch).length > 0) {
        updateSoundConfigPatch(patch);
      }
    }
  };

  const soundValueToSpec = (val) => {
    if (val.startsWith('preset:')) {
      const id = val.slice('preset:'.length);
      const preset = BUILTIN_ALERT_SOUNDS.find((p) => p.id === id) || BUILTIN_ALERT_SOUNDS[0];
      return { type: 'preset', id: preset.id, label: preset.label };
    }
    if (val.startsWith('custom:')) {
      const fileName = val.slice('custom:'.length);
      const found = customSounds.find((s) => s.fileName === fileName);
      if (found) {
        return { type: 'custom', id: found.id, fileName: found.fileName, label: found.label };
      }
    }
    return { type: 'preset', id: 'classic-chime', label: '清脆警報（經典預設）' };
  };

  const soundSpecToValue = (spec) => {
    if (spec?.type === 'custom' && spec.fileName) return `custom:${spec.fileName}`;
    return `preset:${spec?.id || 'classic-chime'}`;
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
    stopPreviewSound();
    saveAiConfig(aiDraft);
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

  const syncIntervalHours = Number(draft.autoSyncIntervalHours) || 4;
  const hasCustomSyncInterval = !SYNC_INTERVAL_PRESETS.includes(syncIntervalHours);

  return (
    <div className="modal-overlay">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        tabIndex={-1}
        className="modal-content"
        style={{ maxWidth: '640px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', padding: '1.35rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 id="settings-modal-title" className="modal-title" style={{ margin: 0, fontSize: '1.12rem' }}>系統設定</h2>
          </div>
          <button type="button" className="btn btn-secondary btn-icon-sm" onClick={handleClose} aria-label="關閉設定">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <SlidingContainer
          className="settings-tabs"
          activeKey={activeTab}
          deps={[isElectron]}
          indicatorClassName="sliding-pill-indicator settings-tab-slider"
        >
          <button type="button" className={`settings-tab-btn ${activeTab === 'cloud' ? 'active' : ''}`} onClick={() => setActiveTab('cloud')}>
            <Cloud size={14} /> 雲端同步
          </button>
          <button type="button" className={`settings-tab-btn ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
            <Sparkles size={14} /> AI 引擎
          </button>
          {isElectron && (
            <button type="button" className={`settings-tab-btn ${activeTab === 'desktop' ? 'active' : ''}`} onClick={() => setActiveTab('desktop')}>
              <BellRing size={14} /> 桌面與提醒
            </button>
          )}
          <button type="button" className={`settings-tab-btn ${activeTab === 'reminders' ? 'active' : ''}`} onClick={() => setActiveTab('reminders')}>
            <Heart size={14} /> 生活叮嚀
          </button>
          <button type="button" className={`settings-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')}>
            <Settings size={14} /> 介面偏好
          </button>
        </SlidingContainer>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeTab === 'cloud' && (
            <>
              <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div className="setting-row-title" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Cloud size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span>Supabase 跨設備同步</span>
                  </div>
                  <span className={`badge-chip ${badgeInfo.cls}`}>{badgeInfo.text}</span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  上次同步：
                  {cloudStatus?.lastSyncedAt
                    ? new Date(cloudStatus.lastSyncedAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    : '尚未同步'}
                  {' · '}雲端檔案：<strong>{assetCount} 份</strong>
                  {(cloudStatus?.pendingCount || 0) > 0 && (
                    <> · 待補推：<strong>{cloudStatus.pendingCount} 筆</strong></>
                  )}
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
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => { handleClose(); onOpenCloudUnlock?.(); }}>
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
                <button
                  type="button"
                  className="collapsible-header-btn"
                  aria-expanded={showAdvancedCloud}
                  onClick={() => setShowAdvancedCloud((p) => !p)}
                >
                  <span className="setting-label" style={{ margin: 0 }}>
                    進階：手動設定此裝置的 Supabase 連線資訊
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    {showAdvancedCloud ? '收合' : '展開'}
                  </span>
                </button>

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

          {activeTab === 'ai' && (
            <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <div className="setting-row-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span>預設生成引擎</span>
                </div>
                <span style={{ fontSize: '0.73rem', color: aiSavedMsg ? 'var(--accent-emerald)' : 'var(--text-dim)', fontWeight: aiSavedMsg ? 600 : 400, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {aiSavedMsg ? (
                    <><Check size={12} /> {aiSavedMsg}</>
                  ) : (
                    <><KeyRound size={12} /> 憑證自動儲存於本機瀏覽器，不會上傳雲端</>
                  )}
                </span>
              </div>

              <SlidingContainer
                className="nav-pills"
                activeKey={aiDraft.engine}
                deps={[isElectron]}
                indicatorClassName="sliding-pill-indicator pill-slider"
                style={{ display: 'grid', gridTemplateColumns: isElectron ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: '4px', padding: '3px' }}
              >
                {isElectron && (
                  <button
                    type="button"
                    className={`nav-pill-btn ${aiDraft.engine === 'agy' ? 'active' : ''}`}
                    onClick={() => updateAiDraft({ engine: 'agy' })}
                    style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '0.45rem 0.35rem' }}
                  >
                    ⚡ 本機 agy CLI
                  </button>
                )}
                <button
                  type="button"
                  className={`nav-pill-btn ${aiDraft.engine === 'gemini' ? 'active' : ''}`}
                  onClick={() => updateAiDraft({ engine: 'gemini' })}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '0.45rem 0.35rem' }}
                >
                  🌐 Gemini API
                </button>
                <button
                  type="button"
                  className={`nav-pill-btn ${aiDraft.engine === 'openai' ? 'active' : ''}`}
                  onClick={() => updateAiDraft({ engine: 'openai' })}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '0.45rem 0.35rem' }}
                >
                  🔌 OpenAI / Ollama
                </button>
              </SlidingContainer>

              {isElectron && aiDraft.engine === 'agy' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '0.77rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      本機官方 Antigravity CLI（免 API Key，共用已登入額度）
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span className={`badge-chip ${agyStatus.available ? 'badge-green' : 'badge-amber'}`}>
                        {agyStatus.available ? `已偵測 ${agyModels.length} 模型` : (agyStatus.checked ? '未就緒' : '偵測中')}
                      </span>
                      <button
                        type="button"
                        className="btn btn-secondary btn-icon-sm"
                        style={{ width: 26, height: 26 }}
                        onClick={checkAgy}
                        disabled={checkingAgy}
                        title="重新偵測本機 agy 模型"
                        aria-label="重新偵測本機 agy 模型"
                      >
                        <RefreshCw size={12} className={checkingAgy ? 'spin' : ''} />
                      </button>
                    </div>
                  </div>
                  {agyStatus.checked && !agyStatus.available && agyStatus.error && (
                    <div style={{ fontSize: '0.74rem', color: 'var(--accent-danger)' }}>
                      {agyStatus.error}
                    </div>
                  )}

                  <div>
                    <label className="setting-label">預設模型</label>
                    <select
                      className="form-control"
                      value={aiDraft.agyModel}
                      onChange={(e) => updateAiDraft({ agyModel: e.target.value })}
                    >
                      {agyModels.length > 0 ? (
                        agyModels.map((m) => (
                          <option key={m.id} value={m.id}>{m.label} ({m.id})</option>
                        ))
                      ) : (
                        <>
                          <option value="gemini-4-neon-high">Gemini 4 Neon (High)</option>
                          <option value="gemini-4-neon-xhigh">Gemini 4 Neon (XHigh)</option>
                          <option value="gemini-4-carbon-high">Gemini 4 Carbon (High)</option>
                          <option value="gemini-3.8-flash-high">Gemini 3.8 Flash (High)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              )}

              {aiDraft.engine === 'gemini' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)' }}>
                    支援桌面、網頁與手機 PWA，直接以串流模式呼叫 Google Gemini 官方 API。
                  </div>
                  <div>
                    <label className="setting-label">Google Gemini API Key</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type={showGeminiKey ? 'text' : 'password'}
                        className="form-control"
                        placeholder="AIzaSy..."
                        value={aiDraft.geminiApiKey}
                        onChange={(e) => updateAiDraft({ geminiApiKey: e.target.value })}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-icon-sm"
                        onClick={() => setShowGeminiKey((v) => !v)}
                        title={showGeminiKey ? '隱藏 Key' : '顯示 Key'}
                      >
                        {showGeminiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="setting-label">Gemini 模型名稱</label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      {GEMINI_API_MODEL_PRESETS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className={`btn btn-xs ${aiDraft.geminiModel === m.id ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => updateAiDraft({ geminiModel: m.id })}
                        >
                          {m.id}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={aiDraft.geminiModel}
                      onChange={(e) => updateAiDraft({ geminiModel: e.target.value })}
                      placeholder="gemini-2.5-pro"
                    />
                  </div>
                </div>
              )}

              {aiDraft.engine === 'openai' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {OPENAI_ENDPOINT_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => updateAiDraft({ openaiBaseUrl: preset.baseUrl, openaiModel: preset.model })}
                      >
                        套用 {preset.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="setting-label">API Base URL（OpenAI 相容端點）</label>
                    <input
                      type="url"
                      className="form-control"
                      value={aiDraft.openaiBaseUrl}
                      onChange={(e) => updateAiDraft({ openaiBaseUrl: e.target.value })}
                      placeholder="https://api.openai.com/v1 或 http://localhost:11434/v1"
                    />
                  </div>
                  <div>
                    <label className="setting-label">API Key（本機 Ollama 可留空）</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type={showOpenAiKey ? 'text' : 'password'}
                        className="form-control"
                        value={aiDraft.openaiApiKey}
                        onChange={(e) => updateAiDraft({ openaiApiKey: e.target.value })}
                        placeholder="sk-..."
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-icon-sm"
                        onClick={() => setShowOpenAiKey((v) => !v)}
                        title={showOpenAiKey ? '隱藏 Key' : '顯示 Key'}
                      >
                        {showOpenAiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="setting-label">模型 ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={aiDraft.openaiModel}
                      onChange={(e) => updateAiDraft({ openaiModel: e.target.value })}
                      placeholder="gpt-4.1 / qwen2.5:14b"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {isElectron && activeTab === 'desktop' && (
            <>
              {/* Section 1: 學習提醒與目標 */}
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', paddingLeft: '2px' }}>
                學習提醒與目標
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-row-title">啟用作業與考前提醒</div>
                  <div className="setting-row-desc">定時檢查即將截止作業、考前倒數與每日讀書目標</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={async () => {
                      stopPreviewSound();
                      await onSaveAppConfig?.(draft);
                      onTriggerAlertTest?.();
                    }}
                  >
                    <BellRing size={13} /> 測試彈窗
                  </button>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={draft.alerts.enabled}
                    onChange={(e) => updateAlertField('enabled', e.target.checked)}
                  />
                </div>
              </div>

              {draft.alerts.enabled && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
                    <div className="setting-box">
                      <label className="setting-label">作業提前 (天)</label>
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
                      <label className="setting-label">考前倒數 (天)</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        className="form-control"
                        value={draft.alerts.examLeadDays}
                        onChange={(e) => updateAlertField('examLeadDays', Number(e.target.value) || 7)}
                      />
                    </div>
                    <div className="setting-box">
                      <label className="setting-label">每日目標 (分)</label>
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
                  </div>

                  <div className="setting-box">
                    <label className="setting-label">每日提醒時段</label>
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

                  <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          className="toggle-switch"
                          checked={draft.alerts.playAlertSound}
                          onChange={(e) => updateAlertField('playAlertSound', e.target.checked)}
                        />
                        <span className="setting-row-title">播放提醒音效</span>
                      </label>

                      {draft.alerts.playAlertSound && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            音量 {Math.round((draft.alerts.soundConfig?.volume ?? 0.75) * 100)}%
                          </span>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={Math.round((draft.alerts.soundConfig?.volume ?? 0.75) * 100)}
                            onChange={(e) => updateSoundConfigPatch({ volume: Number(e.target.value) / 100 })}
                            style={{ width: '110px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                          />
                        </div>
                      )}
                    </div>

                    {draft.alerts.playAlertSound && (
                      <>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <select
                            className="form-control"
                            style={{ flex: 1, minWidth: '180px' }}
                            value={soundSpecToValue(draft.alerts.soundConfig?.normalSound)}
                            onChange={(e) =>
                              updateSoundConfigPatch({
                                normalSound: soundValueToSpec(e.target.value),
                                separateCriticalSound: false,
                              })
                            }
                          >
                            <optgroup label="內建鈴聲">
                              {BUILTIN_ALERT_SOUNDS.map((p) => (
                                <option key={p.id} value={`preset:${p.id}`}>{p.label}</option>
                              ))}
                            </optgroup>
                            {customSounds.length > 0 && (
                              <optgroup label="自訂音訊檔">
                                {customSounds.map((s) => (
                                  <option key={s.fileName} value={`custom:${s.fileName}`}>🎵 {s.label}</option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                          <button
                            type="button"
                            className={`btn btn-sm ${previewingKey === 'normal' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => handleTogglePreviewSound('normal', draft.alerts.soundConfig?.normalSound, false)}
                          >
                            {previewingKey === 'normal' ? <><Square size={12} /> 停止</> : <><Volume2 size={13} /> 試聽</>}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={handleImportCustomSound}
                          >
                            <Upload size={13} /> 匯入音效
                          </button>
                        </div>

                        {customSounds.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {customSounds.map((s) => {
                              const spec = { type: 'custom', id: s.id, fileName: s.fileName, label: s.label };
                              const isPlaying = previewingKey === `lib:${s.fileName}`;
                              return (
                                <div key={s.fileName} className="setting-list-item" style={{ background: 'var(--bg-panel)', padding: '6px 10px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                                    <Music size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {s.label}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', flexShrink: 0 }}>
                                      {(s.size / 1024).toFixed(0)} KB
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                    <button
                                      type="button"
                                      className="icon-ghost-btn"
                                      onClick={() => handleTogglePreviewSound(`lib:${s.fileName}`, spec, false)}
                                      title={isPlaying ? '停止試聽' : '試聽'}
                                    >
                                      {isPlaying ? <Square size={12} /> : <Volume2 size={13} />}
                                    </button>
                                    <button
                                      type="button"
                                      className="icon-ghost-btn danger"
                                      onClick={() => handleDeleteCustomSound(s)}
                                      title="刪除此自訂音效"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {soundActionMsg && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                            {soundActionMsg}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}

              {/* Section 2: 系統常駐與自動同步 */}
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', paddingLeft: '2px', marginTop: '4px' }}>
                系統常駐與自動同步
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-row-title">關閉視窗時縮至系統匣常駐</div>
                  <div className="setting-row-desc">保持背景提醒、考前倒數與自動同步運作</div>
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
                  <div className="setting-row-title">Windows 開機自動啟動</div>
                  <div className="setting-row-desc">登入時靜默啟動於系統匣並恢復桌面便條</div>
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
                  <div className="setting-row-desc">啟動時若資料過舊自動同步，並依間隔定時更新</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {draft.autoSyncEnabled && (
                    <select
                      className="form-control"
                      style={{ width: 'auto', height: '30px', padding: '0 8px', fontSize: '0.78rem' }}
                      value={syncIntervalHours}
                      onChange={(e) => setDraft((p) => ({ ...p, autoSyncIntervalHours: Number(e.target.value) || 4 }))}
                      aria-label="eeclass 自動同步間隔"
                    >
                      {hasCustomSyncInterval && (
                        <option value={syncIntervalHours}>每 {syncIntervalHours} 小時</option>
                      )}
                      {SYNC_INTERVAL_PRESETS.map((h) => (
                        <option key={h} value={h}>每 {h} 小時</option>
                      ))}
                    </select>
                  )}
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={draft.autoSyncEnabled}
                    onChange={(e) => setDraft((p) => ({ ...p, autoSyncEnabled: e.target.checked }))}
                  />
                </div>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-row-title">自動監聽教材變更並增量上雲</div>
                  <div className="setting-row-desc">偵測 Study_Materials/、Test_Bank/ 與 Review_Dashboard/ 異動並自動同步</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={draft.autoWatchDeliverables}
                  onChange={(e) => setDraft((p) => ({ ...p, autoWatchDeliverables: e.target.checked }))}
                />
              </div>

              {workspaceInfo && (
                <div className="setting-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="setting-label" style={{ marginBottom: '2px' }}>Study-space 工作區路徑</div>
                    <code className="workspace-path-code" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {workspaceInfo.workspaceRoot}
                    </code>
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }} onClick={handlePickWorkspace}>
                    <FolderOpen size={14} /> 變更
                  </button>
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

          {activeTab === 'appearance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div className="setting-row-title">減少動態效果（Reduce Motion）</div>
                  <div className="setting-row-desc" style={{ marginTop: '3px', lineHeight: 1.5 }}>
                    控制介面過場動畫、滑動指示條與任務勾選的 760ms 鉛筆劃線動效。
                    選擇「自動」時，網頁／iOS PWA 會跟隨系統無障礙設定，Windows 桌面版預設保留完整動效以避開系統外觀誤判。
                  </div>
                </div>

                <SlidingContainer
                  className="nav-pills form-grid-3"
                  activeKey={reducedMotionPref}
                  indicatorClassName="sliding-pill-indicator pill-slider"
                  style={{ padding: '4px' }}
                >
                  {[
                    { key: 'auto', label: '自動（預設）' },
                    { key: 'off', label: '保留完整動效' },
                    { key: 'on', label: '開啟減少動效' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={`nav-pill-btn ${reducedMotionPref === opt.key ? 'active' : ''}`}
                      onClick={() => onChangeReducedMotionPref?.(opt.key)}
                      style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.45rem 0.4rem' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </SlidingContainer>

                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  此設定僅儲存在目前裝置的本機瀏覽器中，切換後立即生效。
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem', paddingTop: '0.9rem', borderTop: '1px solid var(--border-color)' }}>
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
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
