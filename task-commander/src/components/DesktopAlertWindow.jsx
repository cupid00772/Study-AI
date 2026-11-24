import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Flame,
  BookOpen,
  Clock,
  ExternalLink,
  X,
  Play,
  BellOff,
  CheckSquare,
  ArrowRight,
} from 'lucide-react';
import TaskCommanderLogo from './TaskCommanderLogo';

export default function DesktopAlertWindow() {
  const [payload, setPayload] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('wt_theme') === 'dark'; } catch { return false; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

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

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const handleClose = () => {
    window.electronAPI?.closeCurrentWindow?.();
  };

  const handleSnooze = () => {
    window.electronAPI?.snoozeAlert?.(payload?.snoozeMinutes || 30);
  };

  const handleDismissToday = () => {
    window.electronAPI?.dismissAlertToday?.();
  };

  const handleStartFocus = () => {
    window.electronAPI?.alertAction?.({ type: 'start-focus', minutes: 25 });
  };

  const handleOpenTab = (tab) => {
    window.electronAPI?.alertAction?.({ type: 'open-tab', tab });
  };

  const handleOpenUrl = (url) => {
    window.electronAPI?.alertAction?.({ type: 'open-url', url });
  };

  const exams = payload?.upcomingExams || [];
  const overdue = payload?.overdueAssignments || [];
  const urgent = payload?.urgentAssignments || [];
  const study = payload?.study || { studiedMinutes: 0, goalMinutes: 60, pendingDailyTasks: [], needsStudyNudge: true };
  const allAssignments = [...overdue, ...urgent];

  const isCritical = exams.length > 0 || overdue.length > 0 || urgent.some((u) => u.daysLeft <= 1);

  return (
    <div className="alert-popup-root">
      <div className={`alert-popup-card ${isCritical ? 'critical' : 'warning'}`}>
        {/* Draggable Header */}
        <div className="alert-popup-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className={`alert-pulse-badge ${isCritical ? 'critical' : 'warning'}`}>
              {isCritical ? <Flame size={18} /> : <AlertTriangle size={18} />}
            </div>
            <div>
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
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    尚未勾選的今日任務：
                  </div>
                  {study.pendingDailyTasks.slice(0, 4).map((t, idx) => (
                    <div key={idx} className="alert-task-dot">• {t}</div>
                  ))}
                </div>
              )}
              {exams.length === 0 && allAssignments.length === 0 && study.studiedMinutes >= study.goalMinutes && (
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: 6 }}>
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
            <span>可在系統設定自訂提前天數與提醒時段</span>
          </div>
        </div>
      </div>
    </div>
  );
}
