import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CheckCircle2, Circle, X, CalendarDays, Bell, ListTodo, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import TaskCommanderLogo from './TaskCommanderLogo';
import PencilStrikeText from './PencilStrikeText';
import defaultTracker from '../data/defaultTracker.json';
import { getCoursesForOffsetDays, DAY_LABELS } from '../utils/academicUtils';

function getTodayKey() {
  return new Date().toDateString();
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function DesktopDailyWidget() {
  const [tasks, setTasks] = useState(() => loadJson('wt_tasks', []));
  const [reminders, setReminders] = useState(() => loadJson('wt_reminders', []));
  const [completions, setCompletions] = useState(() => loadJson('wt_reminder_completions', {}));
  const [courses, setCourses] = useState(defaultTracker?.courses || []);
  const [quickTitle, setQuickTitle] = useState('');
  const [completingIds, setCompletingIds] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('wt_theme') === 'dark'; } catch { return false; }
  });
  const timersRef = useRef([]);

  const todayKey = getTodayKey();

  // Sync theme attribute on <html> so CSS variables & custom dark/light scrollbars apply cleanly
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    window.electronAPI?.getTrackerData?.().then((d) => {
      if (d?.courses) setCourses(d.courses);
    });
    const unsub = window.electronAPI?.onTrackerUpdated?.((d) => {
      if (d?.courses) setCourses(d.courses);
    });
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'wt_tasks') setTasks(loadJson('wt_tasks', []));
      if (e.key === 'wt_reminders') setReminders(loadJson('wt_reminders', []));
      if (e.key === 'wt_reminder_completions') setCompletions(loadJson('wt_reminder_completions', {}));
      if (e.key === 'wt_theme') setIsDark(e.newValue === 'dark');
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const tomorrowInfo = useMemo(() => getCoursesForOffsetDays(courses, 1), [courses]);

  const dailyTasks = useMemo(
    () => tasks.filter((t) => t.category === 'Daily' || !t.category),
    [tasks]
  );
  const activeDailyTasks = useMemo(() => dailyTasks.filter((t) => !t.completed), [dailyTasks]);
  const completedDailyTasks = useMemo(() => dailyTasks.filter((t) => t.completed), [dailyTasks]);
  const completedDailyCount = completedDailyTasks.length;
  const completionRate = dailyTasks.length > 0 ? Math.round((completedDailyCount / dailyTasks.length) * 100) : 0;

  const commitToggleTask = useCallback((taskId) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      try { localStorage.setItem('wt_tasks', JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const handleClickTask = useCallback((task) => {
    if (task.completed) {
      commitToggleTask(task.id);
      return;
    }
    if (completingIds.includes(task.id)) return;
    setCompletingIds((prev) => [...prev, task.id]);
    const timer = window.setTimeout(() => {
      commitToggleTask(task.id);
      setCompletingIds((prev) => prev.filter((id) => id !== task.id));
    }, 760);
    timersRef.current.push(timer);
  }, [completingIds, commitToggleTask]);

  const handleToggleReminder = useCallback((reminder) => {
    setCompletions((prev) => {
      const key = `${todayKey}:${reminder}`;
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      try { localStorage.setItem('wt_reminder_completions', JSON.stringify(next)); } catch {}
      return next;
    });
  }, [todayKey]);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    const newTask = {
      id: `task-quick-${Date.now()}`,
      title: quickTitle.trim(),
      category: 'Daily',
      difficulty: 'Easy',
      completed: false,
      desc: '桌面每日小工具快速新增',
    };
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      try { localStorage.setItem('wt_tasks', JSON.stringify(updated)); } catch {}
      return updated;
    });
    setQuickTitle('');
  };

  const handleClose = () => {
    if (window.electronAPI?.closeDailyWindow) window.electronAPI.closeDailyWindow();
    else if (window.electronAPI?.closeCurrentWindow) window.electronAPI.closeCurrentWindow();
    else window.close();
  };

  // Solid opaque surfaces eliminate semi-transparent white corner halos on Windows frameless windows
  const palette = isDark
    ? {
        surface: '#141720',
        surfaceSub: '#1b1f2c',
        surfaceHover: '#222838',
        border: '#272d3f',
        borderSubtle: '#1f2433',
        text: '#eef2f8',
        muted: '#94a3b8',
        dim: '#64748b',
        accent: '#818cf8',
        accentSolid: '#6366f1',
        emerald: '#34d399',
        emeraldBg: '#122923',
        emeraldBorder: '#1f4a3c',
      }
    : {
        surface: '#ffffff',
        surfaceSub: '#f6f8fc',
        surfaceHover: '#eef2f9',
        border: '#e2e8f0',
        borderSubtle: '#edf1f7',
        text: '#0f172a',
        muted: '#475569',
        dim: '#94a3b8',
        accent: '#4f46e5',
        accentSolid: '#4f46e5',
        emerald: '#059669',
        emeraldBg: '#ecfdf5',
        emeraldBorder: '#a7f3d0',
      };

  const now = new Date();
  const dateStr = `${now.getMonth() + 1}月${now.getDate()}日 ${DAY_LABELS[now.getDay()]}`;

  return (
    <div className="desktop-widget-root">
      <div
        className="desktop-widget-shell"
        style={{
          background: palette.surface,
          borderRadius: '16px',
          border: `1px solid ${palette.border}`,
          color: palette.text,
        }}
      >
        {/* Draggable Header */}
        <div
          className="desktop-widget-header"
          style={{ borderBottom: `1px solid ${palette.borderSubtle}` }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <ListTodo size={16} style={{ color: palette.accent, flexShrink: 0 }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              每日任務
            </span>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 500,
                color: palette.muted,
                background: palette.surfaceSub,
                border: `1px solid ${palette.borderSubtle}`,
                padding: '2px 8px',
                borderRadius: '999px',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              {dateStr}
            </span>
          </div>

          <button
            type="button"
            className="desktop-widget-close-btn"
            onClick={handleClose}
            style={{
              background: palette.surfaceSub,
              color: palette.muted,
              border: `1px solid ${palette.borderSubtle}`,
            }}
            title="關閉小工具"
          >
            <X size={13} />
          </button>
        </div>

        {/* Progress Strip */}
        <div style={{ padding: '9px 14px 10px', borderBottom: `1px solid ${palette.borderSubtle}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.77rem', fontWeight: 500, color: palette.muted, marginBottom: '6px', letterSpacing: '0.015em' }}>
            <span>今日目標進度</span>
            <span style={{ color: completionRate === 100 ? palette.emerald : palette.accent, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {completedDailyCount} / {dailyTasks.length}（{completionRate}%）
            </span>
          </div>
          <div style={{ width: '100%', height: '5px', background: palette.surfaceSub, borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${completionRate}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: '999px', transition: 'width 0.35s ease' }} />
          </div>
        </div>

        {/* Quick Add */}
        <form onSubmit={handleQuickAdd} style={{ padding: '10px 14px', display: 'flex', gap: '8px', borderBottom: `1px solid ${palette.borderSubtle}`, flexShrink: 0 }}>
          <input
            type="text"
            placeholder="新增今日目標，按 Enter 送出..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            style={{
              flex: 1,
              background: palette.surfaceSub,
              border: `1px solid ${palette.border}`,
              borderRadius: '9px',
              padding: '7px 11px',
              fontSize: '0.83rem',
              letterSpacing: '0.015em',
              color: palette.text,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button
            type="submit"
            disabled={!quickTitle.trim()}
            style={{
              background: quickTitle.trim() ? palette.accentSolid : palette.surfaceSub,
              color: quickTitle.trim() ? '#ffffff' : palette.dim,
              border: `1px solid ${quickTitle.trim() ? palette.accentSolid : palette.border}`,
              borderRadius: '9px',
              padding: '0 11px',
              cursor: quickTitle.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.16s ease',
            }}
            title="新增"
          >
            <Plus size={15} />
          </button>
        </form>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Daily Goals */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.02em', marginBottom: '8px', color: palette.accent }}>
              <span>每日核心目標</span>
              <span style={{ color: palette.muted, fontWeight: 500 }}>{activeDailyTasks.length} 項待完成</span>
            </div>

            {activeDailyTasks.length === 0 ? (
              <div style={{ fontSize: '0.81rem', color: palette.emerald, background: palette.emeraldBg, border: `1px solid ${palette.emeraldBorder}`, borderRadius: '10px', textAlign: 'center', padding: '10px 12px', fontWeight: 500, letterSpacing: '0.02em' }}>
                {dailyTasks.length === 0 ? '尚無每日目標，從上方新增一項吧' : '今日所有目標皆已完成！'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {activeDailyTasks.map((t) => {
                  const isCompleting = completingIds.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleClickTask(t)}
                      className={`desktop-widget-item ${isCompleting ? 'is-completing-drop' : ''}`}
                      style={{
                        background: isCompleting ? palette.emeraldBg : palette.surfaceSub,
                        border: `1px solid ${isCompleting ? palette.emeraldBorder : palette.border}`,
                      }}
                    >
                      {isCompleting ? (
                        <CheckCircle2 size={16} className="is-completing-check" style={{ color: palette.emerald, flexShrink: 0 }} />
                      ) : (
                        <Circle size={16} style={{ color: palette.accent, flexShrink: 0 }} />
                      )}
                      <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.5, letterSpacing: '0.02em', wordBreak: 'break-word' }}>
                        <PencilStrikeText active={isCompleting} strokeColor={palette.muted}>
                          {t.title}
                        </PencilStrikeText>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Collapsible Completed Daily Goals */}
            {completedDailyTasks.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowCompleted((v) => !v)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    padding: '4px 2px',
                    fontSize: '0.76rem',
                    fontWeight: 500,
                    color: palette.muted,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <span>已完成（{completedDailyTasks.length}）</span>
                  {showCompleted ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {showCompleted && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
                    {completedDailyTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleClickTask(t)}
                        className="desktop-widget-item"
                        style={{
                          background: palette.emeraldBg,
                          border: `1px solid ${palette.emeraldBorder}`,
                          opacity: 0.78,
                        }}
                      >
                        <CheckCircle2 size={15} style={{ color: palette.emerald, flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: '0.83rem', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0.02em' }}>
                          <PencilStrikeText active instant strokeColor={palette.muted}>
                            {t.title}
                          </PencilStrikeText>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Life Reminders */}
          {reminders.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.02em', marginBottom: '8px', color: palette.accent }}>
                <Bell size={13} /> <span>生活叮嚀</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {reminders.map((r, i) => {
                  const done = !!completions[`${todayKey}:${r}`];
                  return (
                    <div
                      key={i}
                      onClick={() => handleToggleReminder(r)}
                      className="desktop-widget-item"
                      style={{
                        background: done ? palette.emeraldBg : palette.surfaceSub,
                        border: `1px solid ${done ? palette.emeraldBorder : palette.borderSubtle}`,
                        opacity: done ? 0.72 : 1,
                      }}
                    >
                      {done ? (
                        <CheckCircle2 size={15} style={{ color: palette.emerald, flexShrink: 0 }} />
                      ) : (
                        <Circle size={15} style={{ color: palette.accent, flexShrink: 0 }} />
                      )}
                      <span style={{ fontSize: '0.84rem', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0.02em' }}>
                        <PencilStrikeText active={done} strokeColor={palette.muted}>
                          {r}
                        </PencilStrikeText>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tomorrow Classes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.02em', marginBottom: '8px', color: palette.muted }}>
              <CalendarDays size={13} /> <span>明日課堂（{tomorrowInfo.dateLabel} {tomorrowInfo.dayLabel}）</span>
            </div>
            {tomorrowInfo.courses.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: palette.dim, padding: '2px 2px' }}>明天沒有排課</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {tomorrowInfo.courses.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      fontSize: '0.83rem',
                      padding: '8px 11px',
                      borderRadius: '10px',
                      background: palette.surfaceSub,
                      border: `1px solid ${palette.borderSubtle}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px',
                      lineHeight: 1.45,
                      letterSpacing: '0.015em',
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{c.name}</span>
                    <span style={{ fontSize: '0.75rem', color: palette.muted, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{c.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '7px 14px', fontSize: '0.72rem', color: palette.dim, borderTop: `1px solid ${palette.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexShrink: 0, letterSpacing: '0.02em' }}>
          <TaskCommanderLogo size={13} />
          <span>Task Commander</span>
        </div>
      </div>
    </div>
  );
}
