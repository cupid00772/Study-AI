import { useState, useMemo, useRef, useEffect } from 'react';
import SlidingContainer from './SlidingContainer';
import PencilStrikeText from './PencilStrikeText';
import {
  AlertTriangle,
  Flame,
  Clock,
  CheckCircle2,
  Circle,
  ExternalLink,
  RefreshCw,
  Calendar,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  BellRing,
  Pin,
  Radio,
  ArrowRight,
  Sparkles,
  CheckSquare,
  Briefcase,
  MapPin,
} from 'lucide-react';
import {
  getCoursesForOffsetDays,
  computeAcademicAlerts,
  openExternalUrl,
  diffDaysFromToday,
} from '../utils/academicUtils';
import {
  isTaskScheduledForDate,
  getChecklistStats,
} from '../utils/taskScheduleUtils';

function formatTimer(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function DashboardHome({
  trackerData,
  alertConfig,
  tasks = [],
  reminders = [],
  reminderCompletions = {},
  todayKey,
  onToggleReminder,
  onCompleteTask,
  onCompleteAssignment,
  onNavigateTab,
  onTriggerSync,
  isSyncing,
  onTriggerAlertTest,
  // Study Focus Timer props
  focusState,
  onStartFocus,
  onPauseFocus,
  onResetFocus,
  onChangePreset,
  studyMinutesToday,
  dailyStudyGoalMinutes,
}) {
  const [scheduleDayOffset, setScheduleDayOffset] = useState(0); // 0=今日, 1=明日
  const [completingTaskIds, setCompletingTaskIds] = useState([]);
  const [completingHwIds, setCompletingHwIds] = useState([]);
  const animTimersRef = useRef([]);

  useEffect(() => {
    const timers = animTimersRef.current;
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const handleAnimatedCompleteTask = (taskId) => {
    if (completingTaskIds.includes(taskId)) return;
    setCompletingTaskIds((prev) => [...prev, taskId]);
    const timer = window.setTimeout(() => {
      onCompleteTask?.(taskId);
      setCompletingTaskIds((prev) => prev.filter((id) => id !== taskId));
    }, 760);
    animTimersRef.current.push(timer);
  };

  const handleAnimatedCompleteAssignment = (hwId) => {
    if (completingHwIds.includes(hwId)) return;
    setCompletingHwIds((prev) => [...prev, hwId]);
    const timer = window.setTimeout(() => {
      onCompleteAssignment?.(hwId);
      setCompletingHwIds((prev) => prev.filter((id) => id !== hwId));
    }, 760);
    animTimersRef.current.push(timer);
  };

  const alerts = useMemo(
    () => computeAcademicAlerts(trackerData, alertConfig),
    [trackerData, alertConfig]
  );

  const scheduleDayInfo = useMemo(
    () => getCoursesForOffsetDays(trackerData?.courses || [], scheduleDayOffset),
    [trackerData?.courses, scheduleDayOffset]
  );

  const tomorrowFallbackInfo = useMemo(
    () => (scheduleDayOffset === 0 && scheduleDayInfo.courses.length === 0
      ? getCoursesForOffsetDays(trackerData?.courses || [], 1)
      : null),
    [trackerData?.courses, scheduleDayOffset, scheduleDayInfo.courses.length]
  );

  const dailyTasks = useMemo(
    () => tasks.filter((t) => t.category === 'Daily' && isTaskScheduledForDate(t)),
    [tasks]
  );
  const completedDailyCount = dailyTasks.filter((t) => t.completed).length;

  // 下一個官方考試週（即使超過 7 天也顯示在次要資訊中）
  const nextOfficialExam = useMemo(() => {
    const events = (trackerData?.calendar_events || [])
      .filter((e) => e.category === 'Official_Exam')
      .map((e) => ({ ...e, daysLeft: diffDaysFromToday(e.startDate) }))
      .filter((e) => e.daysLeft !== null && e.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
    return events[0] || null;
  }, [trackerData?.calendar_events]);

  const dashboard = trackerData?.eeclass_dashboard || { recent_events: [], latest_announcements: [] };
  const recentEvents = dashboard.recent_events || [];
  const latestAnnouncements = dashboard.latest_announcements || [];

  const studyGoal = Math.max(15, Number(dailyStudyGoalMinutes || 60));
  const studyPercent = Math.min(100, Math.round((studyMinutesToday / studyGoal) * 100));

  const hasCriticalAlert = alerts.upcomingExams.length > 0 || alerts.overdueAssignments.length > 0 || alerts.urgentAssignments.length > 0;

  const formattedUpdatedTime = trackerData?.last_updated
    ? new Date(trackerData.last_updated).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '尚未同步';

  const topAssignments = alerts.activeAssignments.slice(0, 5);

  return (
    <div className="bento-dashboard">
      {/* ===== 1. 頂部狀態與緊急警告橫幅 ===== */}
      <section className={`hero-status-banner ${hasCriticalAlert ? 'is-urgent' : 'is-calm'}`}>
        <div className="hero-status-left">
          <div className={`hero-status-icon ${hasCriticalAlert ? 'urgent' : 'calm'}`}>
            {hasCriticalAlert ? <AlertTriangle size={22} /> : <Sparkles size={22} />}
          </div>
          <div>
            <div className="hero-status-title">
              {hasCriticalAlert ? (
                <>
                  {alerts.upcomingExams.length > 0 && (
                    <span className="hero-tag-danger">🔥 考前倒數 {alerts.upcomingExams[0].daysLeft} 天</span>
                  )}
                  {alerts.overdueAssignments.length > 0 && (
                    <span className="hero-tag-danger">🚨 {alerts.overdueAssignments.length} 項已逾期</span>
                  )}
                  {alerts.urgentAssignments.length > 0 && (
                    <span className="hero-tag-warn">⏰ {alerts.urgentAssignments.length} 項即將截止</span>
                  )}
                  {alerts.upcomingExams.length === 0 && alerts.overdueAssignments.length === 0 && alerts.urgentAssignments.length === 0 && (
                    <span>有待處理學業事項</span>
                  )}
                </>
              ) : (
                <span>目前無緊急逾期項目，適合專心推進讀書進度</span>
              )}
            </div>
            <div className="hero-status-sub">
              {nextOfficialExam ? (
                <>下一場全校考週：<strong>{nextOfficialExam.title}</strong>（{nextOfficialExam.startDate}，倒數 {nextOfficialExam.daysLeft} 天） · 考前 7 天起每日自動跳警告</>
              ) : (
                <>{window.electronAPI?.isElectron ? '系統匣背景守護中' : '雲端跨裝置即時同步'} · 今日已專注讀書 {studyMinutesToday} 分鐘</>
              )}
            </div>
          </div>
        </div>

        <div className="hero-status-actions">
          {window.electronAPI?.isElectron && (
            <button className="btn btn-secondary btn-sm" onClick={onTriggerAlertTest} title="立即預覽置頂警告視窗">
              <BellRing size={14} /> 預覽警告彈窗
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={onTriggerSync} disabled={isSyncing}>
            <RefreshCw size={14} className={isSyncing ? 'spin' : ''} />
            {isSyncing ? '同步中...' : (window.electronAPI?.isElectron ? '同步 eeclass' : '重新同步雲端')}
          </button>
        </div>
      </section>

      {/* ===== 2. 主 Bento 三欄核心卡片 ===== */}
      <div className="bento-grid-3">
        {/* Card A: 讀書專注計時器 (Pomodoro) */}
        <div className="bento-card focus-card">
          <div className="bento-card-header">
            <div className="bento-card-title">
              <Flame size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>讀書專注計時</span>
            </div>
            <span className={`badge-chip ${focusState.isRunning ? 'badge-green' : 'badge-blue'}`}>
              {focusState.isRunning ? '專注中（暫停打擾）' : `今日 ${studyMinutesToday}/${studyGoal} 分`}
            </span>
          </div>

          <div className="focus-timer-display">
            <div className="focus-digits">{formatTimer(focusState.secondsLeft)}</div>
            <SlidingContainer
              className="focus-presets"
              activeKey={focusState.presetMinutes}
              indicatorClassName="sliding-pill-indicator preset-slider"
            >
              {[25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  className={`preset-pill ${focusState.presetMinutes === mins ? 'active' : ''}`}
                  disabled={focusState.isRunning}
                  onClick={() => onChangePreset(mins)}
                >
                  {mins}分
                </button>
              ))}
            </SlidingContainer>
          </div>

          <div className="focus-controls">
            {focusState.isRunning ? (
              <button className="btn btn-secondary" onClick={onPauseFocus} style={{ flex: 1 }}>
                <Pause size={15} /> 暫停計時
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => onStartFocus()} style={{ flex: 1 }}>
                <Play size={15} /> 開始讀書專注
              </button>
            )}
            <button className="btn btn-secondary btn-icon-sm" onClick={onResetFocus} title="重設計時器">
              <RotateCcw size={15} />
            </button>
          </div>

          <div className="study-goal-bar-wrap">
            <div className="study-goal-meta">
              <span>今日讀書目標進度</span>
              <strong style={{ color: studyPercent >= 100 ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                {studyPercent}%
              </strong>
            </div>
            <div className="slim-progress-track">
              <div className="slim-progress-fill" style={{ width: `${studyPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Card B: 近期作業與考前倒數快覽 */}
        <div className="bento-card">
          <div className="bento-card-header">
            <div className="bento-card-title">
              <CheckSquare size={16} style={{ color: 'var(--accent-danger)' }} />
              <span>近期必繳作業</span>
            </div>
            <button className="link-btn" onClick={() => onNavigateTab('assignments')}>
              全部 ({alerts.activeAssignments.length}) <ArrowRight size={13} />
            </button>
          </div>

          <div className="bento-list">
            {topAssignments.length === 0 ? (
              <div className="empty-mini">目前沒有待繳交的課堂作業 🎉</div>
            ) : (
              topAssignments.map((hw) => {
                const isOverdue = hw.daysLeft !== null && hw.daysLeft < 0;
                const isSoon = hw.daysLeft !== null && hw.daysLeft >= 0 && hw.daysLeft <= 3;
                const isCompletingHw = completingHwIds.includes(hw.id);
                return (
                  <div key={hw.id} className={`compact-row-item ${isCompletingHw ? 'is-completing-drop' : ''}`}>
                    <button
                      type="button"
                      className={`row-check-btn ${isCompletingHw ? 'is-completing-check' : ''}`}
                      onClick={() => handleAnimatedCompleteAssignment(hw.id)}
                      title="標記完成"
                    >
                      {isCompletingHw ? (
                        <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
                      ) : (
                        <Circle size={16} />
                      )}
                    </button>
                    <div className="row-main">
                      <div className="row-title" title={hw.title}>
                        <PencilStrikeText active={isCompletingHw} strokeColor="var(--text-muted)">
                          {hw.title}
                        </PencilStrikeText>
                      </div>
                      <div className="row-sub">
                        <span>{hw.course}</span>
                        {hw.dueDate && (
                          <span className={`row-due ${isOverdue ? 'danger' : isSoon ? 'warn' : ''}`}>
                            {isOverdue ? `逾期 ${Math.abs(hw.daysLeft)} 天` : hw.daysLeft === 0 ? '今天截止' : `剩 ${hw.daysLeft} 天 (${hw.dueDate.slice(5)})`}
                          </span>
                        )}
                      </div>
                    </div>
                    {hw.link && (
                      <button
                        type="button"
                        className="icon-ghost-btn"
                        onClick={() => openExternalUrl(hw.link)}
                        title="開啟 eeclass 繳交頁"
                      >
                        <ExternalLink size={13} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Card C: 今日/明日課堂 + 今日待辦與叮嚀 */}
        <div className="bento-card">
          <div className="bento-card-header">
            <div className="bento-card-title">
              <Calendar size={16} style={{ color: 'var(--accent-blue)' }} />
              <span>課堂與每日叮嚀</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidingContainer
                className="mini-segment"
                activeKey={scheduleDayOffset}
                indicatorClassName="sliding-pill-indicator segment-slider"
              >
                <button
                  type="button"
                  className={scheduleDayOffset === 0 ? 'active' : ''}
                  onClick={() => setScheduleDayOffset(0)}
                >
                  今日
                </button>
                <button
                  type="button"
                  className={scheduleDayOffset === 1 ? 'active' : ''}
                  onClick={() => setScheduleDayOffset(1)}
                >
                  明日
                </button>
              </SlidingContainer>
              {window.electronAPI?.createDailyWindow && (
                <button
                  type="button"
                  className="icon-ghost-btn"
                  onClick={() => window.electronAPI.createDailyWindow()}
                  title="釘選獨立每日小工具至桌面"
                >
                  <Pin size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="schedule-mini-section">
            <div className="mini-section-label">
              {scheduleDayOffset === 0 ? '今日' : '明日'}課堂（{scheduleDayInfo.dateLabel} {scheduleDayInfo.dayLabel}）
            </div>
            {scheduleDayInfo.courses.length === 0 ? (
              <>
                <div className="empty-mini-inline">無排定課程，適合自主複習衝刺</div>
                {tomorrowFallbackInfo && tomorrowFallbackInfo.courses.length > 0 && (
                  <div style={{ marginTop: '6px' }}>
                    <div className="mini-section-label">
                      明日預告（{tomorrowFallbackInfo.dateLabel} {tomorrowFallbackInfo.dayLabel}）
                    </div>
                    <div className="course-chip-list">
                      {tomorrowFallbackInfo.courses.map((c) => (
                        <div key={c.id} className="course-schedule-row">
                          <span className="course-dot" style={{ background: c.color }} />
                          <div className="course-row-info">
                            <div className="course-row-name">{c.name}</div>
                            <div className="course-row-meta">
                              <Clock size={11} /> {c.time}
                              {c.location && <> · <MapPin size={11} /> {c.location}</>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="course-chip-list">
                {scheduleDayInfo.courses.map((c) => (
                  <div key={c.id} className="course-schedule-row">
                    <span className="course-dot" style={{ background: c.color }} />
                    <div className="course-row-info">
                      <div className="course-row-name">{c.name}</div>
                      <div className="course-row-meta">
                        <Clock size={11} /> {c.time}
                        {c.location && <> · <MapPin size={11} /> {c.location}</>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="schedule-mini-section" style={{ marginTop: '0.6rem' }}>
            <div className="mini-section-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>今日習慣與叮嚀</span>
              <span>{completedDailyCount}/{dailyTasks.length} 任務</span>
            </div>
            <div className="reminder-pills-wrap">
              {reminders.map((r, idx) => {
                const done = !!reminderCompletions[`${todayKey}:${r}`];
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`reminder-chip ${done ? 'done' : ''}`}
                    onClick={() => onToggleReminder?.(r)}
                  >
                    <CheckCircle2 size={13} />
                    <PencilStrikeText active={done} strokeColor="currentColor">
                      {r}
                    </PencilStrikeText>
                  </button>
                );
              })}
              {dailyTasks.filter((t) => !t.completed).slice(0, 4).map((t) => {
                const isCompleting = completingTaskIds.includes(t.id);
                const stats = getChecklistStats(t);
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`reminder-chip is-task ${isCompleting ? 'is-completing-drop' : ''}`}
                    onClick={() => {
                      if (stats.hasChecklist) {
                        onNavigateTab?.('missions');
                      } else {
                        handleAnimatedCompleteTask(t.id);
                      }
                    }}
                    title={stats.hasChecklist ? '前往每日任務逐組勾選清單' : '點擊完成此每日目標'}
                  >
                    {isCompleting ? (
                      <CheckCircle2 size={13} className="is-completing-check" style={{ color: 'var(--accent-emerald)' }} />
                    ) : (
                      <Circle size={13} />
                    )}
                    <PencilStrikeText active={isCompleting} strokeColor="var(--text-muted)">
                      {stats.hasChecklist ? `${t.title} (${stats.done}/${stats.total})` : t.title}
                    </PencilStrikeText>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ===== 3. 考前 7 天專區（僅在有 7 天內考試或考週時動態展開）===== */}
      {alerts.upcomingExams.length > 0 && (
        <section className="bento-card exam-countdown-strip">
          <div className="bento-card-header">
            <div className="bento-card-title" style={{ color: 'var(--accent-danger)' }}>
              <Flame size={16} />
              <span>考前 7 天每日倒數警示</span>
            </div>
            <button className="link-btn" onClick={() => onNavigateTab('exams')}>
              管理考試日程 <ArrowRight size={13} />
            </button>
          </div>
          <div className="exam-strip-grid">
            {alerts.upcomingExams.map((ex) => (
              <div key={ex.id} className="exam-strip-card">
                <div className="exam-strip-days">
                  {ex.daysLeft === 0 ? '今天' : `剩 ${ex.daysLeft} 天`}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{ex.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {ex.course} · {ex.date} {ex.scope ? `· ${ex.scope}` : ''}
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => onNavigateTab('vault')}>
                  <BookOpen size={13} /> 找教材
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== 4. 中央大學 eeclass 動態雙欄 ===== */}
      <section className="bento-card">
        <div className="bento-card-header">
          <div className="bento-card-title">
            <Radio size={16} style={{ color: 'var(--accent-blue)' }} />
            <span>中央大學 eeclass 最新動態</span>
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            上次同步：{formattedUpdatedTime}
          </span>
        </div>

        <div className="eeclass-two-col">
          <div>
            <div className="eeclass-col-title">最近事件</div>
            <div className="eeclass-feed-list">
              {recentEvents.length === 0 ? (
                <div className="empty-mini-inline">目前無近期事件</div>
              ) : (
                recentEvents.map((evt) => (
                  <button
                    key={evt.id}
                    type="button"
                    className="eeclass-feed-row"
                    onClick={() => openExternalUrl(evt.link)}
                    title={`${evt.course} - ${evt.title}`}
                  >
                    <span className="feed-date">{evt.date}</span>
                    {evt.type === 'quiz' ? (
                      <CheckSquare size={14} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
                    ) : (
                      <Briefcase size={14} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                    )}
                    <span className="feed-course">{evt.course}</span>
                    <span className="feed-title">{evt.title}</span>
                    <ExternalLink size={12} className="feed-ext-icon" />
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="eeclass-col-title">最新公告</div>
            <div className="eeclass-feed-list">
              {latestAnnouncements.length === 0 ? (
                <div className="empty-mini-inline">目前無最新公告</div>
              ) : (
                latestAnnouncements.map((ann) => (
                  <button
                    key={ann.id}
                    type="button"
                    className="eeclass-feed-row"
                    onClick={() => openExternalUrl(ann.link)}
                    title={`${ann.course} - ${ann.title}`}
                  >
                    <span className="feed-date">{ann.date}</span>
                    <span className="feed-course">{ann.course}</span>
                    <span className="feed-title">{ann.title}</span>
                    {ann.isHot && <span className="hot-pill">HOT</span>}
                    <ExternalLink size={12} className="feed-ext-icon" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
