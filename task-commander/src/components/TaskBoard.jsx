import { useState, useMemo, useRef, useEffect } from 'react';
import PencilStrikeText from './PencilStrikeText';
import { useModalA11y } from '../hooks/useModalA11y';
import {
  Crosshair,
  Check,
  Trash2,
  Edit3,
  BookOpen,
  CalendarDays,
  Plus,
  Pin,
  CheckCircle2,
  Circle,
  Search,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Clock,
  X,
  Repeat,
  ListChecks,
  CheckSquare,
  Square,
  ExternalLink,
} from 'lucide-react';
import { getLocalDateKey, openExternalUrl } from '../utils/academicUtils';
import {
  isTaskScheduledForDate,
  formatRepeatDaysLabel,
  getChecklistStats,
  getTaskScheduleSortWeight,
} from '../utils/taskScheduleUtils';

function renderDescWithLinks(text) {
  if (!text) return null;
  const parts = String(text).split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, idx) => {
    if (/^https?:\/\//i.test(part)) {
      return (
        <a
          key={idx}
          href={part}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openExternalUrl(part);
          }}
          style={{
            color: 'var(--accent-primary)',
            textDecoration: 'underline',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            wordBreak: 'break-all',
          }}
        >
          <span>{part}</span>
          <ExternalLink size={12} style={{ flexShrink: 0 }} />
        </a>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function TaskCard({
  task,
  onComplete,
  onUncomplete,
  onEdit,
  onDelete,
  onCategoryChange,
  onToggleChecklistItem,
  onResetChecklist,
  reducedMotion = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(false);
  const completeTimerRef = useRef(null);
  const todayKey = getLocalDateKey();
  const isOverdue = task.dueDate && task.dueDate < todayKey && !task.completed;

  const { dialogRef: detailModalRef } = useModalA11y({
    isOpen,
    onClose: () => setIsOpen(false),
  });

  const stats = getChecklistStats(task);
  const repeatLabel = formatRepeatDaysLabel(task.repeatDays);
  const isTodayScheduled = isTaskScheduledForDate(task);

  useEffect(() => {
    return () => {
      if (completeTimerRef.current) window.clearTimeout(completeTimerRef.current);
    };
  }, []);

  const triggerCompleteAnimation = () => {
    if (isCompleting || task.completed) return;
    if (reducedMotion) {
      onComplete?.(task.id);
      return;
    }
    setIsCompleting(true);
    completeTimerRef.current = window.setTimeout(() => {
      setIsCompleting(false);
      onComplete?.(task.id);
    }, 760);
  };

  const getPriorityBadge = (diff) => {
    if (diff === 'Easy') return <span className="diff-badge-easy">一般</span>;
    if (diff === 'Hard') return <span className="diff-badge-hard">高優先</span>;
    return <span className="diff-badge-medium">中優先</span>;
  };

  return (
    <>
      <div
        className={`mission-card ${task.completed ? 'is-completed' : ''} ${isCompleting ? 'is-completing-drop' : ''}`}
        role="button"
        tabIndex={0}
        aria-label={`檢視任務「${task.title}」詳情`}
        draggable={!task.completed && !isCompleting}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', task.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
        onClick={() => { if (!isCompleting) setIsOpen(true); }}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if ((e.key === 'Enter' || e.key === ' ') && !isCompleting) {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <button
            type="button"
            className={`mission-check-btn ${isCompleting ? 'is-completing-check' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (task.completed) onUncomplete?.(task.id);
              else triggerCompleteAnimation();
            }}
            title={task.completed ? '標記為未完成' : '標記完成'}
            aria-label={task.completed ? `將「${task.title}」標記為未完成` : `將「${task.title}」標記完成`}
          >
            {task.completed || isCompleting ? (
              <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
            ) : (
              <Circle size={18} />
            )}
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mission-title-text" style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.48, letterSpacing: '0.015em', marginBottom: '3px' }}>
              <PencilStrikeText
                active={Boolean(isCompleting || task.completed)}
                instant={Boolean(reducedMotion || (task.completed && !isCompleting))}
                strokeColor="var(--text-muted)"
              >
                {task.title}
              </PencilStrikeText>
            </div>
            {task.desc && (
              <div style={{ fontSize: '0.79rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-word' }}>
                {task.desc}
              </div>
            )}
          </div>

          <div className="mission-card-actions" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="icon-ghost-btn" onClick={() => onEdit?.(task)} title="編輯任務" aria-label={`編輯任務「${task.title}」`}>
              <Edit3 size={13} />
            </button>
            <button
              type="button"
              className="icon-ghost-btn danger"
              onClick={() => onDelete?.(task.id)}
              title="刪除任務（可於 5 秒內復原）"
              aria-label={`刪除任務「${task.title}」`}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {getPriorityBadge(task.difficulty)}
          {repeatLabel && (
            <span className={`repeat-badge ${isTodayScheduled ? 'is-today' : ''}`}>
              <Repeat size={11} /> {repeatLabel}
            </span>
          )}
          {task.reminderTime && (
            <span className="due-badge">
              <Clock size={11} /> {task.reminderTime}
            </span>
          )}
          {stats.hasChecklist && (
            <button
              type="button"
              className={`checklist-progress-chip ${stats.allDone ? 'is-done' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsChecklistExpanded((p) => !p);
              }}
              title={isChecklistExpanded ? '收合子清單' : '展開逐組勾選清單'}
            >
              <ListChecks size={11} />
              <span>{stats.done}/{stats.total}</span>
              {isChecklistExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          )}
          {task.relatedCourse && (
            <span className="course-badge">
              <BookOpen size={11} /> {task.relatedCourse}
            </span>
          )}
          {task.dueDate && (
            <span className={`due-badge ${isOverdue ? 'overdue' : ''}`}>
              <CalendarDays size={11} /> {isOverdue ? `已逾期 ${task.dueDate}` : `期限 ${task.dueDate}`}
            </span>
          )}
        </div>

        {stats.hasChecklist && (
          <div className="checklist-mini-bar">
            <div
              className={`checklist-mini-bar-fill ${stats.allDone ? 'is-done' : ''}`}
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        )}

        {stats.hasChecklist && isChecklistExpanded && (
          <div className="task-checklist-list is-compact" onClick={(e) => e.stopPropagation()}>
            {stats.list.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`task-checklist-row ${item.done ? 'is-done' : ''}`}
                onClick={() => onToggleChecklistItem?.(task.id, item.id)}
              >
                <span className="task-checklist-check">
                  {item.done ? <CheckSquare size={15} /> : <Square size={15} />}
                </span>
                <span className="task-checklist-text">{item.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            ref={detailModalRef}
            role="dialog"
            aria-modal="true"
            aria-label={task.title}
            tabIndex={-1}
            className="modal-content"
            style={{ maxWidth: 520, maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem', flexShrink: 0 }}>
              <div style={{ minWidth: 0, paddingRight: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <span className="badge-chip badge-purple">
                    {task.category === 'Daily' ? '每日習慣目標' : task.category === 'Main' ? '學期主線任務' : '專題／衝刺挑戰'}
                  </span>
                  {repeatLabel && (
                    <span className={`repeat-badge ${isTodayScheduled ? 'is-today' : ''}`}>
                      <Repeat size={11} /> {repeatLabel}
                    </span>
                  )}
                  {task.reminderTime && (
                    <span className="due-badge">
                      <Clock size={11} /> {task.reminderTime}
                    </span>
                  )}
                </div>
                <h2 className="modal-title" style={{ margin: 0 }}>{task.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                <button type="button" className="icon-ghost-btn" onClick={() => { setIsOpen(false); onEdit?.(task); }} title="編輯" aria-label="編輯任務">
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  className="icon-ghost-btn danger"
                  onClick={() => {
                    onDelete?.(task.id);
                    setIsOpen(false);
                  }}
                  title="刪除（可復原）"
                  aria-label="刪除任務"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-icon-sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="關閉"
                  title="關閉"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {onCategoryChange && !task.completed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '0.85rem', flexShrink: 0 }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>移動至分類：</span>
                {[
                  { key: 'Daily', label: '每日目標' },
                  { key: 'Main', label: '學期主線' },
                  { key: 'Challenge', label: '衝刺挑戰' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    className={`btn btn-xs ${task.category === cat.key ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onCategoryChange(task.id, cat.key)}
                    aria-pressed={task.category === cat.key}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingRight: '2px' }}>
              {task.desc && (
                <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {renderDescWithLinks(task.desc)}
                </div>
              )}

              {stats.hasChecklist && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <ListChecks size={15} style={{ color: 'var(--accent-primary)' }} />
                      <span>子任務清單（{stats.done} / {stats.total}）</span>
                    </span>
                    {stats.done > 0 && (
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => onResetChecklist?.(task.id)}
                      >
                        <RotateCcw size={12} /> 全部重設
                      </button>
                    )}
                  </div>

                  <div className="slim-progress-track" style={{ marginBottom: '10px' }}>
                    <div className="slim-progress-fill" style={{ width: `${stats.percent}%` }} />
                  </div>

                  <div className="task-checklist-list" style={{ maxHeight: '46vh', overflowY: 'auto' }}>
                    {stats.list.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`task-checklist-row ${item.done ? 'is-done' : ''}`}
                        onClick={() => onToggleChecklistItem?.(task.id, item.id)}
                      >
                        <span className="task-checklist-check">
                          {item.done ? <CheckSquare size={17} /> : <Square size={17} />}
                        </span>
                        <span className="task-checklist-text">{item.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>關閉</button>
              {task.completed ? (
                <button type="button" className="btn btn-secondary" onClick={() => { onUncomplete?.(task.id); setIsOpen(false); }}>
                  <RotateCcw size={14} /> 改回未完成
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => { setIsOpen(false); triggerCompleteAnimation(); }}>
                  <Check size={15} /> 標記完成
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function TaskBoard({
  tasks = [],
  courses = [],
  onComplete,
  onUncomplete,
  onEdit,
  onDelete,
  onCategoryChange,
  onAddNew,
  onToggleChecklistItem,
  onResetChecklist,
  isMobile = false,
  reducedMotion = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);
  const [isOtherScheduleExpanded, setIsOtherScheduleExpanded] = useState(false);

  const activeTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  const todayRelevantTasks = useMemo(
    () => tasks.filter((t) => t.category !== 'Daily' || isTaskScheduledForDate(t)),
    [tasks]
  );
  const todayCompletedCount = useMemo(
    () => todayRelevantTasks.filter((t) => t.completed).length,
    [todayRelevantTasks]
  );
  const progressPercent = todayRelevantTasks.length > 0
    ? Math.round((todayCompletedCount / todayRelevantTasks.length) * 100)
    : 0;

  const filteredActiveTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activeTasks.filter((t) => {
      const matchSearch = !q || t.title.toLowerCase().includes(q) || (t.desc && t.desc.toLowerCase().includes(q));
      const matchCourse = selectedCourseFilter === 'ALL' || t.relatedCourse === selectedCourseFilter;
      return matchSearch && matchCourse;
    });
  }, [activeTasks, searchQuery, selectedCourseFilter]);

  const dailyTasks = useMemo(() => filteredActiveTasks.filter((t) => t.category === 'Daily'), [filteredActiveTasks]);
  const todayDailyTasks = useMemo(
    () => dailyTasks.filter((t) => isTaskScheduledForDate(t)),
    [dailyTasks]
  );
  const otherDayDailyTasks = useMemo(
    () => dailyTasks
      .filter((t) => !isTaskScheduledForDate(t))
      .sort((a, b) => getTaskScheduleSortWeight(a) - getTaskScheduleSortWeight(b)),
    [dailyTasks]
  );
  const mainTasks = useMemo(() => filteredActiveTasks.filter((t) => t.category === 'Main'), [filteredActiveTasks]);
  const challengeTasks = useMemo(() => filteredActiveTasks.filter((t) => t.category === 'Challenge'), [filteredActiveTasks]);

  const availableCourses = useMemo(() => {
    const list = new Set();
    tasks.forEach((t) => { if (t.relatedCourse) list.add(t.relatedCourse); });
    courses.forEach((c) => { if (c.name) list.add(c.name); });
    return ['ALL', ...Array.from(list)];
  }, [tasks, courses]);

  const handleDrop = (e, category) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) onCategoryChange?.(taskId, category);
  };

  const showOtherSchedule = isOtherScheduleExpanded || (Boolean(searchQuery.trim()) && otherDayDailyTasks.length > 0);

  return (
    <div className="missions-container">
      {/* Toolbar & Progress */}
      <div className="bento-card" style={{ padding: '0.95rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge-chip badge-blue">完成進度 {todayCompletedCount} / {todayRelevantTasks.length}（{progressPercent}%）</span>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="搜尋任務..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '30px', fontSize: '0.82rem', height: '34px', width: '190px', borderRadius: 'var(--radius-pill)' }}
              />
            </div>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="form-control"
              style={{ fontSize: '0.82rem', height: '34px', borderRadius: 'var(--radius-pill)', width: 'auto', padding: '0 12px' }}
            >
              {availableCourses.map((c) => (
                <option key={c} value={c}>{c === 'ALL' ? '全部科目' : c}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {window.electronAPI?.createDailyWindow && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => window.electronAPI.createDailyWindow()}
                title="開啟獨立桌面每日任務小工具"
              >
                <Pin size={13} /> 桌面小工具
              </button>
            )}
            <button type="button" className="btn btn-primary btn-sm" onClick={onAddNew}>
              <Plus size={15} /> 新增任務
            </button>
          </div>
        </div>

        <div className="slim-progress-track">
          <div className="slim-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* 3 Columns */}
      <div className="missions-grid">
        {[
          { key: 'Daily', title: '每日核心目標', sub: '依每日／星期排程自動重設', icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', badge: 'badge-amber', list: todayDailyTasks },
          { key: 'Main', title: '學期主線任務', sub: '課程專題與期中期末複習', icon: BookOpen, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', badge: 'badge-blue', list: mainTasks },
          { key: 'Challenge', title: '轉學考／衝刺挑戰', sub: '考古題演練與高難度練習', icon: Crosshair, color: '#e11d48', bg: 'rgba(225,29,72,0.12)', badge: 'badge-pink', list: challengeTasks },
        ].map((col) => {
          const Icon = col.icon;
          return (
            <div
              key={col.key}
              className={`mission-column ${dragOverColumn === col.key ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); if (dragOverColumn !== col.key) setDragOverColumn(col.key); }}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={(e) => handleDrop(e, col.key)}
            >
              <div className="mission-column-header">
                <div className="mission-column-title-box">
                  <div className="mission-icon-circle" style={{ background: col.bg, color: col.color }}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{col.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{col.sub}</div>
                  </div>
                </div>
                <span className={`badge-chip ${col.badge}`}>{col.list.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {col.list.length === 0 ? (
                  <div className="empty-mini" style={{ padding: '2rem 1rem' }}>
                    {isMobile ? '目前無待辦項目' : '目前無待辦項目，可拖曳卡片至此'}
                  </div>
                ) : (
                  col.list.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onComplete={onComplete}
                      onUncomplete={onUncomplete}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onCategoryChange={onCategoryChange}
                      onToggleChecklistItem={onToggleChecklistItem}
                      onResetChecklist={onResetChecklist}
                      reducedMotion={reducedMotion}
                    />
                  ))
                )}

                {col.key === 'Daily' && otherDayDailyTasks.length > 0 && (
                  <div className="other-schedule-section">
                    <button
                      type="button"
                      className="other-schedule-toggle"
                      aria-expanded={showOtherSchedule}
                      onClick={() => setIsOtherScheduleExpanded((p) => !p)}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Repeat size={13} />
                        <span>其他星期排程（{otherDayDailyTasks.length}）</span>
                      </span>
                      {showOtherSchedule ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {showOtherSchedule && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                        {otherDayDailyTasks.map((t) => (
                          <TaskCard
                            key={t.id}
                            task={t}
                            onComplete={onComplete}
                            onUncomplete={onUncomplete}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onCategoryChange={onCategoryChange}
                            onToggleChecklistItem={onToggleChecklistItem}
                            onResetChecklist={onResetChecklist}
                            reducedMotion={reducedMotion}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsible Completed History */}
      {completedTasks.length > 0 && (
        <div className="bento-card" style={{ padding: '0.9rem 1.2rem' }}>
          <button
            type="button"
            className="collapsible-header-btn"
            aria-expanded={isCompletedExpanded}
            onClick={() => setIsCompletedExpanded((p) => !p)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>已完成任務（{completedTasks.length}）</span>
            </div>
            {isCompletedExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {isCompletedExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
              {completedTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onComplete={onComplete}
                  onUncomplete={onUncomplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCategoryChange={onCategoryChange}
                  onToggleChecklistItem={onToggleChecklistItem}
                  onResetChecklist={onResetChecklist}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
