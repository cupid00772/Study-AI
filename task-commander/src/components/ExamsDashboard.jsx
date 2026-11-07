import { useState } from 'react';
import { Calendar, Award, Sparkles, BookOpen, Clock, FileText, CheckCircle2 } from 'lucide-react';
import defaultTracker from '../data/defaultTracker.json';

export default function ExamsDashboard({ exams = [], calendarEvents = [], onPreviewFile, onCompleteExam }) {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'calendar' | 'transfer'

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

  return (
    <div className="assignments-container">
      {/* Top Navigation Tabs */}
      <div className="filter-bar">
        <div className="nav-pills">
          <button
            className={`nav-pill-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={16} /> 各科考試與期中衝刺
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="gemini-card" style={{ background: 'var(--gemini-gradient-soft)', border: '1px solid rgba(155, 114, 207, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <Sparkles size={22} style={{ color: 'var(--gemini-purple)' }} />
              <h3 style={{ margin: 0, fontWeight: 800 }}>期中考倒數衝刺專區</h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              由 Antigravity 整理的期中核心背誦表已上線！直接在 Task Commander 內開啟互動背誦卡，打勾紀錄自動記憶。
            </p>
          </div>

          <div className="vault-grid">
            {courseExams.map(ex => {
              const daysLeft = calculateDaysLeft(ex.date);

              return (
                <div key={ex.id} className="gemini-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className="badge-chip badge-purple">{ex.course}</span>
                      {daysLeft !== null && (
                        <span className={`badge-chip ${daysLeft <= 7 ? 'badge-pink' : 'badge-amber'}`}>
                          <Clock size={12} /> {daysLeft < 0 ? '已評量' : `倒數 ${daysLeft} 天`}
                        </span>
                      )}
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
                      <CheckCircle2 size={13} /> {ex.status === 'completed' ? `已完成 (+${ex.xp || 1000} XP)` : `標記完成 (+${ex.xp || 1000} XP)`}
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
        </div>
      )}

      {/* Tab 2: NCU Calendar Events */}
      {activeTab === 'calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="gemini-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>國立中央大學官方校曆重要日程</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>來源：NCU 教務處註冊組校曆</span>
            </div>
            <span className="badge-chip badge-blue">115 學年度 (2026 ~ 2027) 最新校曆</span>
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
                  <span className="badge-chip badge-purple">+{ex.xp} XP</span>
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
    </div>
  );
}
