import { useState, useEffect, useRef } from 'react';
import SlidingContainer from './SlidingContainer';
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
  getDeviceId,
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

export default function SettingsModal({
  onClose,
  initialTab = null,
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
  const [activeTab, setActiveTab] = useState(() => initialTab || (isElectron ? 'alerts' : 'cloud'));

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

  // AI Engine Config State (stored locally only)
  const [aiDraft, setAiDraft] = useState(() => loadAiConfig());
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenAiKey, setShowOpenAiKey] = useState(false);
  const [agyModels, setAgyModels] = useState([]);
  const [agyStatus, setAgyStatus] = useState({ checked: false, available: false, error: '' });
  const [aiSavedMsg, setAiSavedMsg] = useState('');

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
      if (previewHandleRef.current) {
        previewHandleRef.current.stop();
        previewHandleRef.current = null;
      }
    };
  }, []);

  const updateAlertField = (field, value) => {
    setDraft((prev) => ({ ...prev, alerts: { ...prev.alerts, [field]: value } }));
  };

  const updateSoundConfigField = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        soundConfig: {
          ...normalizeSoundConfig(prev.alerts.soundConfig),
          [field]: value,
        },
      },
    }));
  };

  const stopPreviewSound = () => {
    if (previewHandleRef.current) {
      previewHandleRef.current.stop();
      previewHandleRef.current = null;
    }
    setPreviewingKey(null);
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

  const handleImportCustomSound = async (assignTarget = null) => {
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
      if (assignTarget === 'critical') {
        updateSoundConfigField('criticalSound', spec);
      } else {
        updateSoundConfigField('normalSound', spec);
      }
      setSoundActionMsg(`已匯入「${res.sound.label}」並複製至 App 安全資料夾`);
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
      if (sc.normalSound?.type === 'custom' && sc.normalSound.fileName === sound.fileName) {
        updateSoundConfigField('normalSound', { type: 'preset', id: 'classic-chime', label: '清脆警報（經典預設）' });
      }
      if (sc.criticalSound?.type === 'custom' && sc.criticalSound.fileName === sound.fileName) {
        updateSoundConfigField('criticalSound', { type: 'preset', id: 'urgent-radar', label: '雷達急促警示' });
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

  const handleSaveAiOnly = () => {
    saveAiConfig(aiDraft);
    setAiSavedMsg('已儲存本裝置 AI 引擎設定');
    window.setTimeout(() => setAiSavedMsg(''), 2500);
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
    <div className="modal-overlay">
      <div
        className="modal-content"
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
        </SlidingContainer>

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

          {activeTab === 'ai' && (
            <>
              <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="setting-row-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span>AI 成果庫預設生成引擎</span>
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
                      onClick={() => setAiDraft((p) => ({ ...p, engine: 'agy' }))}
                      style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '0.45rem 0.35rem' }}
                    >
                      ⚡ 本機 agy CLI
                    </button>
                  )}
                  <button
                    type="button"
                    className={`nav-pill-btn ${aiDraft.engine === 'gemini' ? 'active' : ''}`}
                    onClick={() => setAiDraft((p) => ({ ...p, engine: 'gemini' }))}
                    style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '0.45rem 0.35rem' }}
                  >
                    🌐 Gemini API
                  </button>
                  <button
                    type="button"
                    className={`nav-pill-btn ${aiDraft.engine === 'openai' ? 'active' : ''}`}
                    onClick={() => setAiDraft((p) => ({ ...p, engine: 'openai' }))}
                    style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '0.45rem 0.35rem' }}
                  >
                    🔌 OpenAI / Ollama
                  </button>
                </SlidingContainer>

                {isElectron && aiDraft.engine === 'agy' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        使用本機已登入之官方 Antigravity CLI，直接呼叫 Neon / Carbon / Claude 5.5 額度（免另付 API 費）。
                      </span>
                      <span className={`badge-chip ${agyStatus.available ? 'badge-green' : 'badge-amber'}`}>
                        {agyStatus.available ? `已偵測 ${agyModels.length} 模型` : '偵測中／未就緒'}
                      </span>
                    </div>

                    <div>
                      <label className="setting-label">預設模型（含 Neon / Carbon）</label>
                      <select
                        className="form-control"
                        value={aiDraft.agyModel}
                        onChange={(e) => setAiDraft((p) => ({ ...p, agyModel: e.target.value }))}
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
                      適用於網頁版、手機 PWA 與桌面版。API Key 僅保存於此裝置本機瀏覽器，絕不會上傳至公開雲端。
                    </div>
                    <div>
                      <label className="setting-label">Google Gemini API Key</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type={showGeminiKey ? 'text' : 'password'}
                          className="form-control"
                          placeholder="AIzaSy..."
                          value={aiDraft.geminiApiKey}
                          onChange={(e) => setAiDraft((p) => ({ ...p, geminiApiKey: e.target.value }))}
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
                            onClick={() => setAiDraft((p) => ({ ...p, geminiModel: m.id }))}
                          >
                            {m.id}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={aiDraft.geminiModel}
                        onChange={(e) => setAiDraft((p) => ({ ...p, geminiModel: e.target.value }))}
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
                          onClick={() => setAiDraft((p) => ({ ...p, openaiBaseUrl: preset.baseUrl, openaiModel: preset.model }))}
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
                        onChange={(e) => setAiDraft((p) => ({ ...p, openaiBaseUrl: e.target.value }))}
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
                          onChange={(e) => setAiDraft((p) => ({ ...p, openaiApiKey: e.target.value }))}
                          placeholder="sk-..."
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-icon-sm"
                          onClick={() => setShowOpenAiKey((v) => !v)}
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
                        onChange={(e) => setAiDraft((p) => ({ ...p, openaiModel: e.target.value }))}
                        placeholder="gpt-4.1 / qwen2.5:14b"
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    {aiSavedMsg || (
                      <span style={{ color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <KeyRound size={12} /> 憑證僅儲存在本裝置本機
                      </span>
                    )}
                  </span>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveAiOnly}>
                    <Check size={14} /> 儲存 AI 引擎設定
                  </button>
                </div>
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
                  <div className="setting-row-title">警告時持續播放音效（直到點擊視窗）</div>
                  <div className="setting-row-desc">彈出警告視窗後將依節奏循環響鈴，點擊警告視窗任意處即刻停止</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={draft.alerts.playAlertSound}
                  onChange={(e) => updateAlertField('playAlertSound', e.target.checked)}
                />
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-row-title">警告視窗同步脈衝微幅震動</div>
                  <div className="setting-row-desc">與音效節奏同步微晃視窗與發光邊框，點擊視窗任意處立即靜止歸位</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={draft.alerts.soundConfig?.shakeEnabled !== false}
                  onChange={(e) => updateSoundConfigField('shakeEnabled', e.target.checked)}
                />
              </div>

              {/* 自訂警報音效面板 */}
              <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div className="setting-row-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Music size={15} style={{ color: 'var(--accent-primary)' }} />
                    <span>自訂警告音效與響鈴節奏</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleImportCustomSound('normal')}
                  >
                    <Upload size={13} /> 匯入本機音效 (MP3/WAV/OGG)
                  </button>
                </div>

                {/* 音量與循環間隔 */}
                <div className="setting-grid-2">
                  <div>
                    <label className="setting-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>提醒音量</span>
                      <strong>{Math.round((draft.alerts.soundConfig?.volume ?? 0.75) * 100)}%</strong>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={Math.round((draft.alerts.soundConfig?.volume ?? 0.75) * 100)}
                      onChange={(e) => updateSoundConfigField('volume', Number(e.target.value) / 100)}
                      style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                    />
                  </div>
                  <div>
                    <label className="setting-label">震動與響鈴循環節奏</label>
                    <select
                      className="form-control"
                      value={draft.alerts.soundConfig?.repeatIntervalMs || 2500}
                      onChange={(e) => updateSoundConfigField('repeatIntervalMs', Number(e.target.value))}
                    >
                      <option value={1800}>急促（每 1.8 秒脈衝）</option>
                      <option value={2500}>標準鬧鐘（每 2.5 秒脈衝）</option>
                      <option value={3500}>舒緩（每 3.5 秒脈衝）</option>
                      <option value={5000}>低頻（每 5 秒脈衝）</option>
                    </select>
                  </div>
                </div>

                {/* 區分緊急/一般音效開關 */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(draft.alerts.soundConfig?.separateCriticalSound)}
                    onChange={(e) => updateSoundConfigField('separateCriticalSound', e.target.checked)}
                    style={{ accentColor: 'var(--accent-primary)', width: 15, height: 15 }}
                  />
                  <span>分別設定「緊急警告（考前／逾期）」與「一般提醒」的專屬音效</span>
                </label>

                {/* 主音效選擇器 */}
                <div>
                  <label className="setting-label">
                    {draft.alerts.soundConfig?.separateCriticalSound ? '一般提醒音效' : '警告預設音效（所有提醒共用）'}
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                      className="form-control"
                      style={{ flex: 1 }}
                      value={soundSpecToValue(draft.alerts.soundConfig?.normalSound)}
                      onChange={(e) => updateSoundConfigField('normalSound', soundValueToSpec(e.target.value))}
                    >
                      <optgroup label="內建合成鈴聲">
                        {BUILTIN_ALERT_SOUNDS.map((p) => (
                          <option key={p.id} value={`preset:${p.id}`}>{p.label}</option>
                        ))}
                      </optgroup>
                      {customSounds.length > 0 && (
                        <optgroup label="已匯入的自訂音訊檔">
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
                  </div>
                </div>

                {/* 緊急專屬音效選擇器 */}
                {draft.alerts.soundConfig?.separateCriticalSound && (
                  <div>
                    <label className="setting-label" style={{ color: 'var(--accent-danger)' }}>
                      緊急警告專屬音效（考前 7 天／逾期／明天截止）
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select
                        className="form-control"
                        style={{ flex: 1 }}
                        value={soundSpecToValue(draft.alerts.soundConfig?.criticalSound)}
                        onChange={(e) => updateSoundConfigField('criticalSound', soundValueToSpec(e.target.value))}
                      >
                        <optgroup label="內建合成鈴聲">
                          {BUILTIN_ALERT_SOUNDS.map((p) => (
                            <option key={p.id} value={`preset:${p.id}`}>{p.label}</option>
                          ))}
                        </optgroup>
                        {customSounds.length > 0 && (
                          <optgroup label="已匯入的自訂音訊檔">
                            {customSounds.map((s) => (
                              <option key={s.fileName} value={`custom:${s.fileName}`}>🎵 {s.label}</option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                      <button
                        type="button"
                        className={`btn btn-sm ${previewingKey === 'critical' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleTogglePreviewSound('critical', draft.alerts.soundConfig?.criticalSound, true)}
                      >
                        {previewingKey === 'critical' ? <><Square size={12} /> 停止</> : <><Volume2 size={13} /> 試聽</>}
                      </button>
                    </div>
                  </div>
                )}

                {/* 已匯入本機音效庫清單 */}
                {customSounds.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      已匯入的自訂音效庫（已備份至本機 App 資料夾，原檔移動不影響播放）：
                    </div>
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
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={async () => {
                    stopPreviewSound();
                    await onSaveAppConfig?.(draft);
                    onTriggerAlertTest?.();
                  }}
                >
                  <BellRing size={14} /> 套用並立即測試彈出警告視窗
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
                  <div className="setting-row-title">AI 成果庫自動監聽與雲端增量同步</div>
                  <div className="setting-row-desc">自動偵測 Study_Materials/、Test_Bank/ 與 Review_Dashboard/ 新增與修改檔案，背景收錄並增量上傳至雲端</div>
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
