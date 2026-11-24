import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  AlertTriangle,
  Flame,
  BookOpen,
  Clock,
  ExternalLink,
  X,
  Play,
  BellOff,
  BellRing,
  CheckSquare,
  ArrowRight,
  Volume2,
  VolumeX,
} from 'lucide-react';
import TaskCommanderLogo from './TaskCommanderLogo';
import {
  createAlertAlarmLoop,
  normalizeSoundConfig,
  resolveActiveSoundSpec,
} from '../utils/alertSoundEngine';

export default function DesktopAlertWindow() {
  const [payload, setPayload] = useState(null);
  const [acknowledgedKey, setAcknowledgedKey] = useState(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const alarmLoopRef = useRef(null);
  const pulseTimerRef = useRef(null);
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('wt_theme') === 'dark'; } catch { return false; }
  });

  const currentAlertKey = payload?.generatedAt || (payload ? 'initial' : null);
  const acknowledged = Boolean(currentAlertKey && acknowledgedKey === currentAlertKey);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const stopAlarmResources = useCallback(() => {
    if (alarmLoopRef.current) {
      alarmLoopRef.current.stop();
      alarmLoopRef.current = null;
    }
    if (pulseTimerRef.current) {
      window.clearTimeout(pulseTimerRef.current);
      pulseTimerRef.current = null;
    }
    window.electronAPI?.stopAlertWindowShake?.();
  }, []);

  const stopAlarm = useCallback(() => {
    stopAlarmResources();
    setIsPulsing(false);
  }, [stopAlarmResources]);

  const acknowledgeAlert = useCallback(() => {
    if (!currentAlertKey) return;
    setAcknowledgedKey((prev) => {
      if (prev === currentAlertKey) return prev;
      stopAlarm();
      return currentAlertKey;
    });
  }, [currentAlertKey, stopAlarm]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'wt_theme') setIsDark(e.newValue === 'dark');
    };
    window.addEventListener('storage', handleStorage);

    if (window.electronAPI?.getAlertPayload) {
      window.electronAPI.getAlertPayload().then((data) => {
        if (data) setPayload(data);
      });
    }

    let unsub = null;
    if (window.electronAPI?.onAlertPayloadUpdated) {
      unsub = window.electronAPI.onAlertPayloadUpdated((next) => setPayload(next));
    }
    let unsubInteract = null;
    if (window.electronAPI?.onAlertUserInteracted) {
      unsubInteract = window.electronAPI.onAlertUserInteracted(() => acknowledgeAlert());
    }

    const onKeyDown = () => acknowledgeAlert();
    const onBeforeUnload = () => stopAlarmResources();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('beforeunload', onBeforeUnload);
      if (typeof unsub === 'function') unsub();
      if (typeof unsubInteract === 'function') unsubInteract();
      stopAlarmResources();
    };
  }, [acknowledgeAlert, stopAlarmResources]);

  const exams = payload?.upcomingExams || [];
  const overdue = payload?.overdueAssignments || [];
  const urgent = payload?.urgentAssignments || [];
  const study = payload?.study || { studiedMinutes: 0, goalMinutes: 60, pendingDailyTasks: [], needsStudyNudge: true };
  const allAssignments = [...overdue, ...urgent];

  const isCritical = exams.length > 0 || overdue.length > 0 || urgent.some((u) => u.daysLeft <= 1);
  const soundConfig = useMemo(() => normalizeSoundConfig(payload?.soundConfig), [payload?.soundConfig]);
  const shouldPlaySound = payload?.playSound !== false;
  const shouldShake = soundConfig.shakeEnabled !== false;

  // Continuous synchronized sound + physical/visual shake loop until user clicks window
  useEffect(() => {
    if (!payload || acknowledged) return undefined;
    if (!shouldPlaySound && !shouldShake) return undefined;

    const soundSpec = resolveActiveSoundSpec(soundConfig, isCritical);

    const loop = createAlertAlarmLoop({
      soundSpec,
      isCritical,
      volume: soundConfig.volume,
      repeatIntervalMs: soundConfig.repeatIntervalMs,
      playSound: shouldPlaySound,
      onPulse: () => {
        if (!shouldShake) return;
        setIsPulsing(true);
        window.electronAPI?.pulseAlertWindowShake?.();
        if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = window.setTimeout(() => {
          setIsPulsing(false);
        }, 520);
      },
    });

    alarmLoopRef.current = loop;
    return () => {
      loop.stop();
      if (alarmLoopRef.current === loop) alarmLoopRef.current = null;
      if (pulseTimerRef.current) {
        window.clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = null;
      }
      window.electronAPI?.stopAlertWindowShake?.();
    };
  }, [payload, acknowledged, isCritical, shouldPlaySound, shouldShake, soundConfig]);

  const handleClose = () => {
    stopAlarm();
    window.electronAPI?.closeCurrentWindow?.();
  };

  const handleSnooze = () => {
    stopAlarm();
    window.electronAPI?.snoozeAlert?.(payload?.snoozeMinutes || 30);
  };

  const handleDismissToday = () => {
    stopAlarm();
    window.electronAPI?.dismissAlertToday?.();
  };

  const handleStartFocus = () => {
    stopAlarm();
    window.electronAPI?.alertAction?.({ type: 'start-focus', minutes: 25 });
  };

  const handleOpenTab = (tab) => {
    stopAlarm();
    window.electronAPI?.alertAction?.({ type: 'open-tab', tab });
  };

  const handleOpenUrl = (url) => {
    stopAlarm();
    window.electronAPI?.alertAction?.({ type: 'open-url', url });
  };

  const isRingingActive = Boolean(payload && !acknowledged && (shouldPlaySound || shouldShake));

  return (
    <div
      className="alert-popup-root"
      onPointerDownCapture={acknowledgeAlert}
      onMouseDownCapture={acknowledgeAlert}
    >
      <div
        className={`alert-popup-card ${isCritical ? 'critical' : 'warning'} ${isRingingActive ? 'is-ringing' : ''} ${isPulsing ? 'is-pulsing' : ''}`}
      >
        {/* Draggable Header */}
        <div className="alert-popup-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div className={`alert-pulse-badge ${isCritical ? 'critical' : 'warning'} ${isRingingActive ? 'is-ringing' : ''}`}>
              {isCritical ? <Flame size={18} /> : <AlertTriangle size={18} />}
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="alert-popup-title">
                {exams.length > 0
                  ? '考前倒數 & 任務緊急警告'
                  : allAssignments.length > 0
                    ? '快點繳作業與讀書提醒'
                    : '每日讀書督促提醒'}
              </div>
              <div className="alert-popup-sub">
                Task Commander · {payload?.todayKey || ''}
              </div>
            </div>
          </div>

          <button type="button" className="alert-close-btn" onClick={handleClose} title="暫時關閉">
            <X size={15} />
          </button>
        </div>

        {/* Live Sound / Shake Acknowledge Strip */}
        {(shouldPlaySound || shouldShake) && (
          <div className={`alert-ack-bar ${isRingingActive ? 'is-ringing' : 'is-acked'}`}>
            {isRingingActive ? (
              <>
                <Volume2 size={14} className="alert-bell-wiggle" />
                <span>持續震動響鈴中 · 點擊視窗任意處即可停止並安心檢視</span>
              </>
            ) : (
              <>
                <VolumeX size={14} />
                <span>已停止震動與提示音，可安心檢視事項</span>
              </>
            )}
          </div>
        )}

        {/* Scrollable Body */}
        <div className="alert-popup-body">
          {/* 1. Exam 7-Day Daily Warning */}
          {exams.length > 0 && (
            <div className="alert-section danger">
              <div className="alert-section-head">
                <Flame size={15} />
                <span>考前 7 天每日倒數（{exams.length} 項）</span>
                <button type="button" className="alert-mini-link" onClick={() => handleOpenTab('exams')}>
                  查看考程 <ArrowRight size={12} />
                </button>
              </div>
              <div className="alert-item-list">
                {exams.map((ex) => (
                  <div key={ex.id} className="alert-item-row">
                    <span className="alert-days-pill danger">
                      {ex.daysLeft === 0 ? '今天!' : ex.daysLeft === 1 ? '明天!' : `剩 ${ex.daysLeft} 天`}
                    </span>
                    <div className="alert-item-info">
                      <div className="alert-item-title">{ex.title}</div>
                      <div className="alert-item-meta">
                        {ex.course} · {ex.date}{ex.scope ? ` · ${ex.scope}` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Overdue & Urgent Assignments */}
          {allAssignments.length > 0 && (
            <div className="alert-section warn">
              <div className="alert-section-head">
                <CheckSquare size={15} />
                <span>快點繳作業（{allAssignments.length} 項急迫／逾期）</span>
                <button type="button" className="alert-mini-link" onClick={() => handleOpenTab('assignments')}>
                  作業看板 <ArrowRight size={12} />
                </button>
              </div>
              <div className="alert-item-list">
                {allAssignments.slice(0, 6).map((hw) => {
                  const isOver = hw.daysLeft < 0;
                  return (
                    <div key={hw.id} className="alert-item-row">
                      <span className={`alert-days-pill ${isOver || hw.daysLeft <= 1 ? 'danger' : 'warn'}`}>
                        {isOver ? `逾期 ${hw.overdueDays} 天` : hw.daysLeft === 0 ? '今天截止' : `剩 ${hw.daysLeft} 天`}
                      </span>
                      <div className="alert-item-info">
                        <div className="alert-item-title">{hw.title}</div>
                        <div className="alert-item-meta">
                          {hw.course} · 截止 {hw.dueDate}
                        </div>
                      </div>
                      {hw.link && (
                        <button
                          type="button"
                          className="alert-ext-btn"
                          onClick={() => handleOpenUrl(hw.link)}
                          title="直連 eeclass 繳交"
                        >
                          <ExternalLink size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Daily Study Nudge */}
          <div className="alert-section study">
            <div className="alert-section-head">
              <BookOpen size={15} />
              <span>今日讀書進度檢查</span>
            </div>
            <div className="alert-study-box">
              <div className="alert-study-stat">
                <span>今日已專注</span>
                <strong>{study.studiedMinutes} / {study.goalMinutes} 分鐘</strong>
              </div>
              <div className="slim-progress-track">
                <div
                  className="slim-progress-fill"
                  style={{ width: `${Math.min(100, Math.round((study.studiedMinutes / Math.max(1, study.goalMinutes)) * 100))}%` }}
                />
              </div>
              {study.pendingDailyTasks?.length > 0 && (
                <div className="alert-pending-tasks">
                  <div style={{ fontSize: '0.78rem', fontWeight: 500, lineHeight: 1.45, color: 'var(--text-muted)', marginBottom: 4 }}>
                    尚未勾選的今日任務：
                  </div>
                  {study.pendingDailyTasks.slice(0, 4).map((t, idx) => (
                    <div key={idx} className="alert-task-dot">• {t}</div>
                  ))}
                </div>
              )}
              {exams.length === 0 && allAssignments.length === 0 && study.studiedMinutes >= study.goalMinutes && (
                <div style={{ fontSize: '0.83rem', color: 'var(--accent-emerald)', fontWeight: 600, lineHeight: 1.45, marginTop: 6 }}>
                  今日讀書目標已達成，目前無急迫警告！
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="alert-popup-footer">
          <button type="button" className="btn btn-primary" onClick={handleStartFocus} style={{ width: '100%' }}>
            <Play size={15} /> 立刻開始專注讀書（25 分鐘，期間暫停提醒）
          </button>
          <div className="alert-footer-secondary">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleOpenTab(allAssignments.length > 0 ? 'assignments' : 'dashboard')}>
              前往處理
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleSnooze}>
              <Clock size={13} /> 延後 {payload?.snoozeMinutes || 30} 分鐘
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleDismissToday}>
              <BellOff size={13} /> 今日不再提醒
            </button>
          </div>
          <div className="alert-footer-brand">
            <TaskCommanderLogo size={13} />
            <span>
              <BellRing size={10} style={{ verticalAlign: '-1px', marginRight: 3 }} />
              可在系統設定自訂鈴聲、震動節奏與提醒時段
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
