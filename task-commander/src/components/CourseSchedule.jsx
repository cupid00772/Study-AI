import { useState, useMemo } from 'react';
import SlidingContainer from './SlidingContainer';
import { BookOpen, Calendar, GraduationCap, ExternalLink, MapPin, Clock, User } from 'lucide-react';
import { deriveWeeklyScheduleFromCourses, openExternalUrl } from '../utils/academicUtils';

const WEEKDAYS = [
  { key: 'Monday', label: '週一' },
  { key: 'Tuesday', label: '週二' },
  { key: 'Wednesday', label: '週三' },
  { key: 'Thursday', label: '週四' },
  { key: 'Friday', label: '週五' },
];

export default function CourseSchedule({ currentCourses = [], onOpenGraduationCredits }) {
  const [viewTab, setViewTab] = useState('timetable'); // 'timetable' | 'cards'

  const displayCourses = useMemo(() => (Array.isArray(currentCourses) ? currentCourses : []), [currentCourses]);
  const weeklyMap = useMemo(() => deriveWeeklyScheduleFromCourses(displayCourses), [displayCourses]);

  const totalCredits = useMemo(
    () => displayCourses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0),
    [displayCourses]
  );

  const todayWeekdayKey = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

  return (
    <div className="assignments-container">
      {/* Toolbar */}
      <div className="filter-bar">
        <SlidingContainer
          className="nav-pills"
          activeKey={viewTab}
          indicatorClassName="sliding-pill-indicator pill-slider"
          style={{ padding: '3px' }}
        >
          <button
            type="button"
            className={`nav-pill-btn ${viewTab === 'timetable' ? 'active' : ''}`}
            onClick={() => setViewTab('timetable')}
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}
          >
            <Calendar size={14} /> 本學期週課表
          </button>
          <button
            type="button"
            className={`nav-pill-btn ${viewTab === 'cards' ? 'active' : ''}`}
            onClick={() => setViewTab('cards')}
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}
          >
            <BookOpen size={14} /> 修課明細 ({displayCourses.length})
          </button>
        </SlidingContainer>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
          <span className="badge-chip badge-blue">本學期共 {totalCredits} 學分</span>
          {onOpenGraduationCredits && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenGraduationCredits}
              title="選課前檢視資管系 128 畢業學分進度"
            >
              <GraduationCap size={14} /> 畢業學分檢核表 (選課用)
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Auto-derived Weekly Timetable */}
      {viewTab === 'timetable' && (
        <div className="weekly-timetable-grid">
          {WEEKDAYS.map((day) => {
            const list = weeklyMap[day.key] || [];
            const isToday = todayWeekdayKey === day.key;
            return (
              <div key={day.key} className={`weekday-col ${isToday ? 'is-today' : ''}`}>
                <div className="weekday-col-head">
                  <span>{day.label}</span>
                  {isToday && <span className="today-dot-pill">今天</span>}
                </div>
                <div className="weekday-col-body">
                  {list.length === 0 ? (
                    <div className="empty-mini" style={{ padding: '1.5rem 0.5rem' }}>無排課</div>
                  ) : (
                    list.map((cls) => (
                      <div key={cls.id} className="timetable-slot" style={{ borderLeftColor: cls.color }}>
                        <div className="slot-title">{cls.name}</div>
                        <div className="slot-meta"><Clock size={11} /> {cls.time}</div>
                        {cls.location && <div className="slot-meta"><MapPin size={11} /> {cls.location}</div>}
                        {cls.instructor && <div className="slot-meta"><User size={11} /> {cls.instructor}</div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Course Cards */}
      {viewTab === 'cards' && (
        <div className="vault-grid">
          {displayCourses.map((c) => (
            <div key={c.id} className="bento-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `3px solid ${c.color || 'var(--accent-primary)'}` }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="badge-chip badge-blue">{c.code}</span>
                    {c.serial && <span className="badge-chip" style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>流水號 {c.serial}</span>}
                  </div>
                  <span className="badge-chip badge-purple">{c.category} · {c.credits} 學分</span>
                </div>

                <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.08rem', fontWeight: 800 }}>{c.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '0.45rem' }}>
                  {c.location} · {c.schedule}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {c.description}
                </p>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.7rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>授課教師：{c.instructor}</span>
                {c.eeclass_id && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => openExternalUrl(`https://ncueeclass.ncu.edu.tw/course/${c.eeclass_id}`)}
                  >
                    <ExternalLink size={12} /> eeclass
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
