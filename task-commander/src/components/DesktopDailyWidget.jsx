import { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckCircle2, Circle, X, CalendarDays, Bell, ListTodo, Plus } from 'lucide-react';
import TaskCommanderLogo from './TaskCommanderLogo';
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
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('wt_theme') === 'dark'; } catch { return false; }
  });

  const todayKey = getTodayKey();

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

  const dailyTasks = tasks.filter((t) => t.category === 'Daily' || !t.category);
  const completedDailyCount = dailyTasks.filter((t) => t.completed).length;
  const completionRate = dailyTasks.length > 0 ? Math.round((completedDailyCount / dailyTasks.length) * 100) : 0;

  const handleToggleTask = useCallback((taskId) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      try { localStorage.setItem('wt_tasks', JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

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

  const bgColor = isDark ? 'rgba(20, 22, 28, 0.96)' : 'rgba(255, 255, 255, 0.96)';
  const textColor = isDark ? '#e2e8f0' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.09)';
  const accentColor = '#4f46e5';
  const checkColor = '#10b981';

  const now = new Date();
  const dateStr = `${now.getMonth() + 1}月${now.getDate()}日 ${DAY_LABELS[now.getDay()]}`;

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: 'transparent', fontFamily: "'Segoe UI', 'Noto Sans TC', system-ui, sans-serif" }}>
      <div style={{ width: '100%', height: '100%', background: bgColor, borderRadius: '16px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', color: textColor }}>
        {/* Header */}
        <div style={{ WebkitAppRegion: 'drag', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 8px', borderBottom: `1px solid ${borderColor}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 800, userSelect: 'none' }}>
            <ListTodo size={16} style={{ color: accentColor }} />
            <span>每日任務小工具</span>
            <span style={{ fontSize: '0.72rem', color: mutedColor, fontWeight: 600 }}>{dateStr}</span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{ WebkitAppRegion: 'no-drag', background: 'rgba(128,128,128,0.12)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: textColor }}
            title="關閉小工具"
          >
            <X size={13} />
          </button>
        </div>

        {/* Progress */}
        <div style={{ padding: '6px 14px', borderBottom: `1px solid ${borderColor}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 600, color: mutedColor, marginBottom: '4px' }}>
            <span>今日完成度</span>
            <span style={{ color: completionRate === 100 ? checkColor : accentColor }}>{completedDailyCount} / {dailyTasks.length} ({completionRate}%)</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: borderColor, borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${completionRate}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5, #10b981)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Quick Add */}
        <form onSubmit={handleQuickAdd} style={{ padding: '8px 12px', display: 'flex', gap: '6px', borderBottom: `1px solid ${borderColor}` }}>
          <input
            type="text"
            placeholder="+ 快速新增今日待辦..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            style={{ flex: 1, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)', border: `1px solid ${borderColor}`, borderRadius: '8px', padding: '5px 10px', fontSize: '0.8rem', color: textColor, outline: 'none' }}
          />
          <button type="submit" disabled={!quickTitle.trim()} style={{ background: quickTitle.trim() ? accentColor : borderColor, color: '#fff', border: 'none', borderRadius: '8px', padding: '0 10px', cursor: quickTitle.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center' }}>
            <Plus size={15} />
          </button>
        </form>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 700, marginBottom: '6px', color: '#3b82f6' }}>
              <span>每日目標</span>
              <span>{dailyTasks.filter((t) => !t.completed).length} 待辦</span>
            </div>
            {dailyTasks.length === 0 ? (
              <div style={{ fontSize: '0.76rem', color: mutedColor, textAlign: 'center', padding: '8px 0' }}>尚無每日目標</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {dailyTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTask(t.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.81rem', cursor: 'pointer', padding: '6px 9px', borderRadius: '8px', background: t.completed ? 'rgba(16,185,129,0.08)' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)'), border: `1px solid ${t.completed ? 'rgba(16,185,129,0.22)' : borderColor}`, opacity: t.completed ? 0.65 : 1 }}
                  >
                    {t.completed ? <CheckCircle2 size={15} style={{ color: checkColor, flexShrink: 0 }} /> : <Circle size={15} style={{ color: '#3b82f6', flexShrink: 0 }} />}
                    <span style={{ textDecoration: t.completed ? 'line-through' : 'none', flex: 1, fontWeight: 600 }}>{t.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {reminders.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: 700, marginBottom: '6px', color: accentColor }}>
                <Bell size={12} /> <span>生活叮嚀</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {reminders.map((r, i) => {
                  const done = !!completions[`${todayKey}:${r}`];
                  return (
                    <div
                      key={i}
                      onClick={() => handleToggleReminder(r)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', padding: '5px 9px', borderRadius: '8px', background: done ? 'rgba(16,185,129,0.08)' : 'transparent', border: `1px solid ${borderColor}`, opacity: done ? 0.6 : 1 }}
                    >
                      {done ? <CheckCircle2 size={14} style={{ color: checkColor }} /> : <Circle size={14} style={{ color: accentColor }} />}
                      <span style={{ textDecoration: done ? 'line-through' : 'none' }}>{r}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: 700, marginBottom: '6px', color: mutedColor }}>
              <CalendarDays size={12} /> <span>明日課堂（{tomorrowInfo.dateLabel} {tomorrowInfo.dayLabel}）</span>
            </div>
            {tomorrowInfo.courses.length === 0 ? (
              <div style={{ fontSize: '0.76rem', color: mutedColor }}>明天沒有排課</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {tomorrowInfo.courses.map((c) => (
                  <div key={c.id} style={{ fontSize: '0.78rem', padding: '5px 9px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)', border: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    <span style={{ fontSize: '0.7rem', color: mutedColor }}>{c.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '6px 12px', fontSize: '0.68rem', color: mutedColor, borderTop: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <TaskCommanderLogo size={13} />
          <span>Task Commander</span>
        </div>
      </div>
    </div>
  );
}
