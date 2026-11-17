import { useState } from 'react';
import { Calendar, Award, Sparkles, BookOpen, Clock, FileText, CheckCircle2, Trash2, ExternalLink, Plus, X, MapPin } from 'lucide-react';
import defaultTracker from '../data/defaultTracker.json';

export default function ExamsDashboard({
  exams = [],
  calendarEvents = [],
  courses = [],
  onPreviewFile,
  onCompleteExam,
  onDeleteExam,
  onAddExam
}) {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'calendar' | 'transfer'
  const [isManagingMode, setIsManagingMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState('upcoming'); // 'upcoming' | 'completed' | 'all'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New exam form state
  const [newTitle, setNewTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.name || '作業系統');
  const [customCourse, setCustomCourse] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newScope, setNewScope] = useState('');
  const [newCategory, setNewCategory] = useState('期末考試');

  const resolvedCalendarEvents = calendarEvents && calendarEvents.length > 0 ? calendarEvents : (defaultTracker.calendar_events || []);
  const resolvedExams = exams && exams.length > 0 ? exams : (defaultTracker.exams || []);

  const ncuMilestones = resolvedCalendarEvents.filter(e => e.isMajor || e.category === 'Official_Exam');

  const courseExams = resolvedExams.filter(e => e.course !== '台聯大/台大轉學考');
  const transferExams = resolvedExams.filter(e => e.course === '台聯大/台大轉學考');

  const calculateDaysLeft = (targetDate) => {
    if (!targetDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getEventBadge = (startDate, endDate) => {
    if (!startDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;

    if (today >= start && today <= end) {
      return <span className="badge-chip badge-pink" style={{ marginTop: '4px' }}>🔥 進行中</span>;
    }
    const diffDays = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return <span className="badge-chip badge-blue" style={{ marginTop: '4px' }}>已結束</span>;
    }
    if (diffDays <= 7) {
      return <span className="badge-chip badge-pink" style={{ marginTop: '4px' }}>⚡ 倒數 {diffDays} 天</span>;
    }
    if (diffDays <= 14) {
      return <span className="badge-chip badge-amber" style={{ marginTop: '4px' }}>⏳ 距今 {diffDays} 天</span>;
    }
    return <span className="badge-chip badge-green" style={{ marginTop: '4px' }}>距今 {diffDays} 天</span>;
  };

  const unifiedFinalExam = resolvedCalendarEvents.find(e => e.id === 'ncu-115-1-final') || {
    title: '115-1 統一期末考試週',
    startDate: '2026-12-21',
    endDate: '2026-12-24',
    description: '國立中央大學 115 學年度第一學期全校統一期末考試週（各科期末筆試與綜合評量由授課教師依規定排定）'
  };

  // Filtered course exams
  const filteredCourseExams = courseExams.filter(ex => {
    const days = calculateDaysLeft(ex.date);
    const isCompleted = ex.status === 'completed' || (days !== null && days < 0);
    if (filterStatus === 'upcoming') return !isCompleted;
    if (filterStatus === 'completed') return isCompleted;
    return true;
  });

  const upcomingCount = courseExams.filter(ex => {
    const days = calculateDaysLeft(ex.date);
    return ex.status !== 'completed' && (days === null || days >= 0);
  }).length;

  const completedCount = courseExams.length - upcomingCount;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const courseName = selectedCourse === '__custom__' ? (customCourse.trim() || '自訂科目') : selectedCourse;

    const newExam = {
      id: `exam-custom-${Date.now()}`,
      course: courseName,
      title: newTitle.trim(),
      date: newDate || undefined,
      time: newTime.trim() || undefined,
      location: newLocation.trim() || undefined,
      scope: newScope.trim() || undefined,
      category: newCategory,
      description: newScope.trim() ? `範圍：${newScope.trim()}` : (newTime.trim() ? `時間：${newTime.trim()}` : ''),
      status: 'upcoming',
      xp: 1000,
      color: '#4285F4'
    };

    onAddExam?.(newExam);

    // Reset form
    setNewTitle('');
    setNewDate('');
    setNewTime('');
    setNewLocation('');
    setNewScope('');
    setCustomCourse('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="assignments-container">
      {/* Top Navigation Tabs */}
      <div className="filter-bar">
        <div className="nav-pills">
          <button
            className={`nav-pill-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={16} /> 各科考試與期末追蹤
          </button>
          <button
            className={`nav-pill-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar size={16} /> 中央大學官方校曆考週
          </button>
          <button
            className={`nav-pill-btn ${activeTab === 'transfer' ? 'active' : ''}`}
            onClick={() => setActiveTab('transfer')}
          >
            <Award size={16} /> 轉學考歷屆全真題庫
          </button>
        </div>
      </div>

      {/* Tab 1: Course Exams & Recitation */}
      {activeTab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* 中央大學官方統一考試週 HIGHLIGHT BANNER */}
          <div className="gemini-card" style={{ background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.12) 0%, rgba(155, 114, 207, 0.15) 100%)', border: '1px solid rgba(66, 133, 244, 0.35)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.35rem' }}>
                <Calendar size={22} style={{ color: '#4285f4' }} />
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.12rem' }}>中央大學 115-1 官方統一考試週</h3>
                {getEventBadge(unifiedFinalExam.startDate, unifiedFinalExam.endDate)}
              </div>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
                統一期末考試週：{unifiedFinalExam.startDate} ～ {unifiedFinalExam.endDate}（第 16 週 全校統一評量）
              </p>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                各科期末筆試與評量日程由授課教師依規定排定於本週辦理。已公布考程的科目可隨時點擊右側自行填寫，未公告則維持自由設定。
              </p>
            </div>

            {/* Action Buttons: Add Custom Exam & Manage */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="btn btn-primary"
                onClick={() => setIsAddModalOpen(true)}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="點擊自行新增一筆考試日程"
              >
                <Plus size={16} />
                <span>+ 自行新增考試日程</span>
              </button>
              <button
                className={`btn ${isManagingMode ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setIsManagingMode(prev => !prev)}
                style={{ fontSize: '0.82rem', padding: '0.5rem 0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                title={isManagingMode ? '完成並退出管理' : '開啟考試/教材刪除管理'}
              >
                <Trash2 size={14} />
                <span>{isManagingMode ? '完成管理' : '管理/刪除'}</span>
              </button>
            </div>
          </div>

          {/* Sub Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`nav-pill-btn ${filterStatus === 'upcoming' ? 'active' : ''}`}
                onClick={() => setFilterStatus('upcoming')}
                style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
              >
                待應試 / 倒數中 ({upcomingCount})
              </button>
              <button
                className={`nav-pill-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
                style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
              >
                已評量 / 歷史考程 ({completedCount})
              </button>
              <button
                className={`nav-pill-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
                style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
              >
                全部 ({courseExams.length})
              </button>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              期中考試已全數評量完成。後續各科期末考公告後可自行填寫追蹤。
            </span>
          </div>

          {/* Course Exams Grid */}
          {filteredCourseExams.length === 0 ? (
            <div className="gemini-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
              <Sparkles size={36} style={{ color: 'var(--gemini-purple)', margin: '0 auto 0.75rem', opacity: 0.7 }} />
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {filterStatus === 'upcoming' ? '目前無進行中的待應試考程' : '無符合條件的考試記錄'}
              </div>
              <div style={{ fontSize: '0.84rem' }}>
                期中考試均已結束。若老師在課堂或 eeclass 公布了期末考時間，可隨時點擊上方「+ 自行新增考試日程」自行記錄！
              </div>
            </div>
          ) : (
            <div className="vault-grid">
              {filteredCourseExams.map(ex => {
                const daysLeft = calculateDaysLeft(ex.date);
                const isDone = ex.status === 'completed' || (daysLeft !== null && daysLeft < 0);

                return (
                  <div key={ex.id} className="gemini-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="badge-chip badge-purple">{ex.course}</span>
                          {ex.category && (
                            <span className="badge-chip badge-blue" style={{ fontSize: '0.75rem' }}>{ex.category}</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isDone ? (
                            <span className="badge-chip badge-green">
                              <CheckCircle2 size={12} /> 已評量
                            </span>
                          ) : (
                            daysLeft !== null && (
                              <span className={`badge-chip ${daysLeft <= 7 ? 'badge-pink' : 'badge-amber'}`}>
                                <Clock size={12} /> {`倒數 ${daysLeft} 天`}
                              </span>
                            )
                          )}
                          <button
                            className="btn btn-secondary btn-icon-circle"
                            onClick={() => {
                              if (window.confirm(`確定要從考試看板刪除「${ex.title}」嗎？`)) {
                                onDeleteExam?.(ex.id);
                              }
                            }}
                            title="刪除此考試記錄"
                            style={{
                              width: 28,
                              height: 28,
                              padding: 0,
                              color: '#ef4444',
                              borderColor: isManagingMode ? '#ef4444' : 'rgba(239, 68, 68, 0.3)',
                              background: isManagingMode ? 'rgba(239, 68, 68, 0.1)' : undefined
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 700 }}>{ex.title}</h3>
                      
                      {/* Date & Location tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.65rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {ex.date && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={13} /> {ex.date} {ex.time ? `(${ex.time})` : ''}
                          </span>
                        )}
                        {ex.location && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} /> {ex.location}
                          </span>
                        )}
                      </div>

                      {ex.scope && (
                        <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', marginBottom: '0.5rem', padding: '0.4rem 0.6rem', background: 'var(--bg-glass)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                          <strong>範圍：</strong>{ex.scope}
                        </div>
                      )}

                      {ex.description && !ex.scope && (
                        <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          {ex.description}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => onCompleteExam?.(ex.id)}
                        disabled={ex.status === 'completed'}
                        style={{
                          padding: '0.4rem 0.85rem',
                          fontSize: '0.8rem',
                          background: ex.status === 'completed' ? 'rgba(52, 168, 83, 0.15)' : undefined,
                          color: ex.status === 'completed' ? '#137333' : undefined,
                          borderColor: ex.status === 'completed' ? 'rgba(52, 168, 83, 0.3)' : undefined
                        }}
                      >
                        <CheckCircle2 size={13} /> {ex.status === 'completed' ? `已評量 (+${ex.xp || 1000} XP)` : `標記完成 (+${ex.xp || 1000} XP)`}
                      </button>

                      {ex.deliverableFile && (
                        <button
                          className="btn btn-primary"
                          onClick={() => onPreviewFile({ title: ex.title, path: ex.deliverableFile, course: ex.course })}
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                        >
                          <Sparkles size={13} /> 開啟背誦/題本
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: NCU Calendar Events */}
      {activeTab === 'calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="gemini-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>國立中央大學官方校曆重要日程</h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>來源：國立中央大學教務處註冊組官方校曆</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span className="badge-chip badge-blue">115 學年度 (2026 ~ 2027) 最新校曆</span>
              <a
                href="https://pdc.adm.ncu.edu.tw/Calendar/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                onClick={(e) => {
                  if (window.electronAPI?.openExternalPath) {
                    e.preventDefault();
                    window.electronAPI.openExternalPath('https://pdc.adm.ncu.edu.tw/Calendar/');
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  padding: '0.42rem 0.95rem',
                  textDecoration: 'none',
                  color: 'var(--gemini-blue)',
                  borderColor: 'rgba(66, 133, 244, 0.35)',
                  background: 'var(--gemini-gradient-soft)'
                }}
                title="在新瀏覽器視窗開啟國立中央大學教務處官方校曆專區"
              >
                <ExternalLink size={14} /> 開啟中大官方校曆專區
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ncuMilestones.map(event => {
              return (
                <div key={event.id} className="gemini-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="vault-icon-badge" style={{ background: 'var(--gemini-gradient-soft)' }}>
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>{event.title}</span>
                        <span className="badge-chip badge-blue">{event.scope}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        {event.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {event.startDate} {event.endDate && event.endDate !== event.startDate ? `~ ${event.endDate}` : ''}
                    </div>
                    {getEventBadge(event.startDate, event.endDate)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Transfer Past Exams */}
      {activeTab === 'transfer' && (
        <div className="vault-grid">
          {transferExams.map(ex => (
            <div key={ex.id} className="gemini-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge-chip badge-amber">轉學考衝刺</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge-chip badge-purple">+{ex.xp} XP</span>
                    <button
                      className="btn btn-secondary btn-icon-circle"
                      onClick={() => {
                        if (window.confirm(`確定要刪除「${ex.title}」這份轉學考教材嗎？`)) {
                          onDeleteExam?.(ex.id);
                        }
                      }}
                      title="刪除此教材"
                      style={{ width: 28, height: 28, padding: 0, color: '#ef4444' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 700 }}>{ex.title}</h3>
                <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {ex.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => onCompleteExam?.(ex.id)}
                  disabled={ex.status === 'completed'}
                  style={{
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.8rem',
                    background: ex.status === 'completed' ? 'rgba(52, 168, 83, 0.15)' : undefined,
                    color: ex.status === 'completed' ? '#137333' : undefined,
                    borderColor: ex.status === 'completed' ? 'rgba(52, 168, 83, 0.3)' : undefined
                  }}
                >
                  <CheckCircle2 size={13} /> {ex.status === 'completed' ? `已完成 (+${ex.xp || 1200} XP)` : `標記完成 (+${ex.xp || 1200} XP)`}
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => onPreviewFile({ title: ex.title, path: ex.deliverableFile, course: ex.course })}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  <FileText size={13} /> 開啟題本與解答
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 自行新增考試日程 MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} style={{ color: 'var(--gemini-purple)' }} />
                <h2 className="modal-title" style={{ margin: 0 }}>自行新增考試日程</h2>
              </div>
              <button
                className="btn btn-secondary btn-icon-circle"
                onClick={() => setIsAddModalOpen(false)}
                style={{ width: 32, height: 32, padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  考試名稱 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="例如：作業系統期末考試、經濟學期末考"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    所屬科目
                  </label>
                  <select
                    className="form-control"
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                  >
                    {courses.map(c => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                    <option value="__custom__">+ 其他 (自行輸入)</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    考試類別
                  </label>
                  <select
                    className="form-control"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                  >
                    <option value="期末考試">期末考試 (Final Exam)</option>
                    <option value="期中考試">期中考試 (Midterm Exam)</option>
                    <option value="隨堂測驗">隨堂測驗 (Quiz)</option>
                    <option value="模擬考試">模擬考試 (Mock Exam)</option>
                  </select>
                </div>
              </div>

              {selectedCourse === '__custom__' && (
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    自訂科目名稱
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="請輸入科目名稱"
                    value={customCourse}
                    onChange={e => setCustomCourse(e.target.value)}
                    required
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    考試日期
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    考試節次 / 時間
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="例如：09:00 - 12:00 或 隨堂"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  試場 / 教室地點
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="例如：管二館 I1-017、志希館 I-204"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  考試範圍 / 核心備註
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="例如：Ch6 ~ Ch8 包含死結與虛擬記憶體、選擇題 35 題..."
                  value={newScope}
                  onChange={e => setNewScope(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  確認新增此考試日程
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
