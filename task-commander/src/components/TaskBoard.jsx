import { useState, useMemo, useRef, useEffect } from 'react';
import PencilStrikeText from './PencilStrikeText';
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
} from 'lucide-react';
import { getLocalDateKey } from '../utils/academicUtils';

function TaskCard({ task, onComplete, onUncomplete, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const completeTimerRef = useRef(null);
  const todayKey = getLocalDateKey();
  const isOverdue = task.dueDate && task.dueDate < todayKey && !task.completed;

  useEffect(() => {
    return () => {
      if (completeTimerRef.current) window.clearTimeout(completeTimerRef.current);
    };
  }, []);

  const triggerCompleteAnimation = () => {
    if (isCompleting || task.completed) return;
    setIsCompleting(true);
    completeTimerRef.current = window.setTimeout(() => {
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
        draggable={!task.completed && !isCompleting}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', task.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
        onClick={() => { if (!isCompleting) setIsOpen(true); }}
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
                instant={Boolean(task.completed && !isCompleting)}
                strokeColor="var(--text-muted)"
              >
                {task.title}
              </PencilStrikeText>
            </div>
            {task.desc && (
              <div style={{ fontSize: '0.79rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {task.desc}
              </div>
            )}
          </div>

          <div className="mission-card-actions" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="icon-ghost-btn" onClick={() => onEdit?.(task)} title="編輯任務">
              <Edit3 size={13} />
            </button>
            <button
              type="button"
              className="icon-ghost-btn danger"
              onClick={() => {
                if (window.confirm(`確定要刪除「${task.title}」嗎？`)) onDelete?.(task.id);
              }}
              title="刪除任務"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {getPriorityBadge(task.difficulty)}
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
      </div>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span className="badge-chip badge-purple" style={{ marginBottom: '6px' }}>
                  {task.category === 'Daily' ? '每日習慣目標' : task.category === 'Main' ? '學期主線任務' : '專題／衝刺挑戰'}
                </span>
                <h2 className="modal-title" style={{ margin: 0 }}>{task.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button type="button" className="icon-ghost-btn" onClick={() => { setIsOpen(false); onEdit?.(task); }} title="編輯">
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  className="icon-ghost-btn danger"
                  onClick={() => {
                    if (window.confirm(`確定要刪除「${task.title}」嗎？`)) {
                      onDelete?.(task.id);
                      setIsOpen(false);
                    }
                  }}
                  title="刪除"
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

            {task.desc && (
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1rem', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.15rem' }}>
                {task.desc}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);

  const activeTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const filteredActiveTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activeTasks.filter((t) => {
      const matchSearch = !q || t.title.toLowerCase().includes(q) || (t.desc && t.desc.toLowerCase().includes(q));
      const matchCourse = selectedCourseFilter === 'ALL' || t.relatedCourse === selectedCourseFilter;
      return matchSearch && matchCourse;
    });
  }, [activeTasks, searchQuery, selectedCourseFilter]);

  const dailyTasks = useMemo(() => filteredActiveTasks.filter((t) => t.category === 'Daily'), [filteredActiveTasks]);
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

  return (
    <div className="missions-container">
      {/* Toolbar & Progress */}
      <div className="bento-card" style={{ padding: '0.95rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge-chip badge-blue">完成進度 {completedTasks.length} / {tasks.length}（{progressPercent}%）</span>
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
          { key: 'Daily', title: '每日核心目標', sub: '每日午夜自動重設', icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', badge: 'badge-amber', list: dailyTasks },
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
                  <div className="empty-mini" style={{ padding: '2rem 1rem' }}>目前無待辦項目，可拖曳卡片至此</div>
                ) : (
                  col.list.map((t) => (
                    <TaskCard key={t.id} task={t} onComplete={onComplete} onUncomplete={onUncomplete} onEdit={onEdit} onDelete={onDelete} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsible Completed History */}
      {completedTasks.length > 0 && (
        <div className="bento-card" style={{ padding: '0.9rem 1.2rem' }}>
          <div
            onClick={() => setIsCompletedExpanded((p) => !p)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>已完成任務（{completedTasks.length}）</span>
            </div>
            {isCompletedExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {isCompletedExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
              {completedTasks.map((t) => (
                <TaskCard key={t.id} task={t} onComplete={onComplete} onUncomplete={onUncomplete} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
