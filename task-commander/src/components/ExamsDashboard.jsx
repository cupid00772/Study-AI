import { useState, useMemo } from 'react';
import SlidingContainer from './SlidingContainer';
import {
  Calendar,
  BookOpen,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
  X,
  MapPin,
  FileText,
  Flame,
  FolderGit2,
} from 'lucide-react';
import { diffDaysFromToday } from '../utils/academicUtils';

export default function ExamsDashboard({
  exams = [],
  calendarEvents = [],
  courses = [],
  onPreviewFile,
  onCompleteExam,
  onDeleteExam,
  onAddExam,
  onNavigateVault,
}) {
  const [filterChip, setFilterChip] = useState('upcoming'); // 'upcoming' | 'all' | 'completed' | courseName
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.name || '作業系統');
  const [customCourse, setCustomCourse] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newScope, setNewScope] = useState('');

  const resolvedCalendarEvents = useMemo(() => (Array.isArray(calendarEvents) ? calendarEvents : []), [calendarEvents]);
  const resolvedExams = useMemo(() => (Array.isArray(exams) ? exams : []), [exams]);

  const upcomingOfficialExams = useMemo(() => {
    return resolvedCalendarEvents
      .filter((e) => e.category === 'Official_Exam')
      .map((e) => ({
        ...e,
        daysLeft: diffDaysFromToday(e.startDate),
        endDaysLeft: e.endDate ? diffDaysFromToday(e.endDate) : diffDaysFromToday(e.startDate),
      }))
      .filter((e) => e.endDaysLeft !== null && e.endDaysLeft >= 0)
      .sort((a, b) => (a.daysLeft ?? 999) - (b.daysLeft ?? 999));
  }, [resolvedCalendarEvents]);

  const nextOfficialExam = upcomingOfficialExams[0] || {
    title: '115-1 統一期末考試週',
    startDate: '2026-12-21',
    endDate: '2026-12-24',
    daysLeft: diffDaysFromToday('2026-12-21'),
    description: '國立中央大學 115 學年度第一學期全校統一期末考試週',
  };

  const courseNames = useMemo(
    () => [...new Set(resolvedExams.map((e) => e.course).filter(Boolean))],
    [resolvedExams]
  );

  const upcomingCount = useMemo(
    () => resolvedExams.filter((ex) => {
      const d = diffDaysFromToday(ex.date);
      return ex.status !== 'completed' && (d === null || d >= 0);
    }).length,
    [resolvedExams]
  );

  const completedCount = resolvedExams.length - upcomingCount;

  const sortedExams = useMemo(() => {
    const filtered = resolvedExams.filter((ex) => {
      const daysLeft = diffDaysFromToday(ex.date);
      const isDone = ex.status === 'completed' || (daysLeft !== null && daysLeft < 0);
      if (filterChip === 'upcoming') return !isDone;
      if (filterChip === 'completed') return isDone;
      if (filterChip === 'all') return true;
      return ex.course === filterChip;
    });

    return [...filtered].sort((a, b) => {
      const da = diffDaysFromToday(a.date);
      const db = diffDaysFromToday(b.date);
      const doneA = a.status === 'completed' || (da !== null && da < 0);
      const doneB = b.status === 'completed' || (db !== null && db < 0);
      if (doneA !== doneB) return doneA ? 1 : -1;
      return (da ?? 999) - (db ?? 999);
    });
  }, [resolvedExams, filterChip]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const courseName = selectedCourse === '__custom__' ? (customCourse.trim() || '自訂科目') : selectedCourse;

    onAddExam?.({
      id: `exam-custom-${Date.now()}`,
      course: courseName,
      title: newTitle.trim(),
      date: newDate || undefined,
      time: newTime.trim() || undefined,
      location: newLocation.trim() || undefined,
      scope: newScope.trim() || undefined,
      status: 'upcoming',
    });

    setNewTitle('');
    setNewDate('');
    setNewTime('');
    setNewLocation('');
    setNewScope('');
    setCustomCourse('');
    setIsAddModalOpen(false);
    setFilterChip('upcoming');
  };

  return (
    <div className="assignments-container">
      {/* 校曆官方考週 Banner */}
      <div className="bento-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid var(--accent-primary)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <Calendar size={19} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem' }}>{nextOfficialExam.title}</h3>
            {nextOfficialExam.daysLeft !== null && (
              <span className={`badge-chip ${nextOfficialExam.daysLeft <= 7 ? 'badge-pink' : 'badge-blue'}`}>
                <Flame size={12} /> {nextOfficialExam.daysLeft <= 0 ? '進行中' : `倒數 ${nextOfficialExam.daysLeft} 天`}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>
            {nextOfficialExam.startDate} ～ {nextOfficialExam.endDate}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
            凡列入本頁的真實考試與官方考週，進入<strong>考前 7 天</strong>時系統每日會自動彈出倒數與範圍警告。
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {onNavigateVault && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={onNavigateVault}>
              <FolderGit2 size={14} /> 轉學考題本／背誦表
            </button>
          )}
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={15} /> 新增考試日程
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <SlidingContainer
        className="nav-pills"
        activeKey={filterChip}
        deps={[courseNames.length, upcomingCount, completedCount]}
        indicatorClassName="sliding-pill-indicator pill-slider"
        style={{ padding: '3px', width: 'fit-content', flexWrap: 'wrap' }}
      >
        <button type="button" className={`nav-pill-btn ${filterChip === 'upcoming' ? 'active' : ''}`} onClick={() => setFilterChip('upcoming')} style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
          即將考試 ({upcomingCount})
        </button>
        <button type="button" className={`nav-pill-btn ${filterChip === 'all' ? 'active' : ''}`} onClick={() => setFilterChip('all')} style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
          全部 ({resolvedExams.length})
        </button>
        {courseNames.map((name) => (
          <button key={name} type="button" className={`nav-pill-btn ${filterChip === name ? 'active' : ''}`} onClick={() => setFilterChip(name)} style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
            {name}
          </button>
        ))}
        <button type="button" className={`nav-pill-btn ${filterChip === 'completed' ? 'active' : ''}`} onClick={() => setFilterChip('completed')} style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
          已結束 ({completedCount})
        </button>
      </SlidingContainer>

      {/* Exam List */}
      {sortedExams.length === 0 ? (
        <div className="bento-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Calendar size={32} style={{ color: 'var(--accent-primary)', margin: '0 auto 0.65rem', opacity: 0.7 }} />
          <div style={{ fontWeight: 700, marginBottom: '4px' }}>
            {filterChip === 'upcoming' ? '目前尚未排入個別科目的即將考試' : '無符合條件的考試紀錄'}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            老師公布期末考或小考日期後，點擊上方「新增考試日程」，考前 7 天就會每天自動跳出倒數警告。
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={14} /> 立即新增考試
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sortedExams.map((ex) => {
            const daysLeft = diffDaysFromToday(ex.date);
            const isDone = ex.status === 'completed' || (daysLeft !== null && daysLeft < 0);
            const inAlertWindow = !isDone && daysLeft !== null && daysLeft <= 7;

            return (
              <div
                key={ex.id}
                className="bento-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.9rem 1.25rem',
                  opacity: isDone ? 0.65 : 1,
                  borderLeft: inAlertWindow ? '4px solid var(--accent-danger)' : undefined,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ minWidth: '108px', flexShrink: 0, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{ex.date || '日期待定'}</div>
                  {ex.time && <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>{ex.time}</div>}
                  <div style={{ marginTop: '4px' }}>
                    {isDone ? (
                      <span className="badge-chip badge-green" style={{ fontSize: '0.7rem' }}>
                        <CheckCircle2 size={11} /> {ex.status === 'completed' ? '已完成' : '已過期'}
                      </span>
                    ) : daysLeft !== null ? (
                      <span className={`badge-chip ${daysLeft <= 3 ? 'badge-pink' : daysLeft <= 7 ? 'badge-amber' : 'badge-blue'}`} style={{ fontSize: '0.7rem' }}>
                        <Clock size={11} /> {daysLeft === 0 ? '今天考試' : `倒數 ${daysLeft} 天`}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                    <span className="badge-chip badge-purple">{ex.course}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ex.title}</span>
                    {inAlertWindow && (
                      <span className="badge-chip badge-pink" style={{ fontSize: '0.68rem' }}>每日警告啟用中</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    {ex.location && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><MapPin size={12} /> {ex.location}</span>}
                    {ex.scope && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><BookOpen size={12} /> {ex.scope}</span>}
                    {!ex.scope && ex.description && <span>{ex.description}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  {!isDone && (
                    <button type="button" className="btn btn-secondary btn-xs" onClick={() => onCompleteExam?.(ex.id)}>
                      <CheckCircle2 size={13} /> 標記完成
                    </button>
                  )}
                  {ex.deliverableFile && (
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      onClick={() => onPreviewFile?.({ title: ex.title, path: ex.deliverableFile, course: ex.course })}
                    >
                      <FileText size={13} /> 檢視教材
                    </button>
                  )}
                  <button
                    type="button"
                    className="icon-ghost-btn danger"
                    onClick={() => {
                      if (window.confirm(`確定要移除「${ex.title}」這筆考試記錄嗎？`)) onDeleteExam?.(ex.id);
                    }}
                    title="移除記錄"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Exam Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
              <h2 className="modal-title" style={{ margin: 0 }}>新增考試日程</h2>
              <button type="button" className="btn btn-secondary btn-icon-sm" onClick={() => setIsAddModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>考試名稱 *</label>
                <input type="text" className="form-control" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="例如：作業系統期末考、資料結構小考" />
              </div>
              <div className="form-group">
                <label>所屬科目</label>
                <select className="form-control" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                  {courses.map((c) => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                  <option value="__custom__">+ 自訂科目名稱</option>
                </select>
              </div>
              {selectedCourse === '__custom__' && (
                <div className="form-group">
                  <label>自訂科目</label>
                  <input type="text" className="form-control" required value={customCourse} onChange={(e) => setCustomCourse(e.target.value)} placeholder="輸入科目名稱" />
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>考試日期 *</label>
                  <input type="date" className="form-control" required value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>考試時間</label>
                  <input type="text" className="form-control" value={newTime} onChange={(e) => setNewTime(e.target.value)} placeholder="例如：09:00 - 11:00" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>教室 / 試場</label>
                  <input type="text" className="form-control" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="例如：志希館 I-204" />
                </div>
                <div className="form-group">
                  <label>考試範圍</label>
                  <input type="text" className="form-control" value={newScope} onChange={(e) => setNewScope(e.target.value)} placeholder="例如：Ch6 ~ Ch9" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>取消</button>
                <button type="submit" className="btn btn-primary">確認新增</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
