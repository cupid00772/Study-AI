import React, { useState } from 'react';
import { Bell, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import CourseTaskModal from './CourseTaskModal';

export default function DailyReminders({ weeklySchedule = {}, reminders = [], reminderCompletions = {}, today, tasks = [], onCompleteTask, onToggleReminder }) {
  const [selectedCourse, setSelectedCourse] = useState(null);

  // 取得明天的星期幾 (0-6)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const tomorrowDayName = dayNames[tomorrow.getDay()];

  // 取得明天的課表
  const tomorrowCourses = weeklySchedule[tomorrowDayName] || [];
  const normalizeCourse = course => course.trim().toLocaleLowerCase();

  // 計算每個課程是否有未完成的相關任務 (作業)
  const courseTasksCount = {};
  tomorrowCourses.forEach(course => {
    courseTasksCount[course] = tasks.filter(t => !t.completed && t.relatedCourse && normalizeCourse(t.relatedCourse) === normalizeCourse(course)).length;
  });

  return (
    <div className="gemini-card" style={{
      marginBottom: '1.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1.25rem 1.5rem'
    }}>
      {/* 頂部標題 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.95rem' }}>
        <Bell size={18} style={{ color: 'var(--gemini-purple)' }} />
        <span>每日提醒與明日課程 (AGENDA & REMINDERS)</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* 日常提醒 */}
        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            今日專注叮嚀
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {reminders.length === 0 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>今日暫無個人提醒事項</span>
            ) : (
              reminders.map((reminder, idx) => {
                const isCompleted = reminderCompletions[`${today}:${reminder}`];
                return (
                  <div 
                    key={idx} 
                    style={{
                      background: isCompleted ? 'var(--bg-input)' : 'var(--bg-panel)',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: `1px solid ${isCompleted ? 'var(--border-subtle)' : 'var(--border-color)'}`,
                      cursor: 'pointer',
                      opacity: isCompleted ? 0.6 : 1,
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      boxShadow: isCompleted ? 'none' : 'var(--shadow-sm)',
                      transition: 'all 0.2s'
                    }} 
                    onClick={() => onToggleReminder(reminder)}
                  >
                    <CheckCircle2 size={15} color={isCompleted ? 'var(--gemini-emerald)' : 'var(--text-dim)'} />
                    <span>{reminder}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 明日課表與作業提醒 */}
        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            明日課堂 ({tomorrowDayName})
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {tomorrowCourses.length === 0 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>明天沒有排課，好好衝刺轉學考與專題！🎉</span>
            ) : (
              tomorrowCourses.map((course, idx) => {
                const badgeCount = courseTasksCount[course];
                return (
                  <div 
                    key={idx} 
                    onClick={() => {
                      if (badgeCount > 0) {
                        setSelectedCourse(course);
                      }
                    }}
                    style={{
                      background: badgeCount > 0 ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-panel)',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: `1px solid ${badgeCount > 0 ? '#ef4444' : 'var(--border-color)'}`,
                      cursor: badgeCount > 0 ? 'pointer' : 'default',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <CalendarIcon size={14} color={badgeCount > 0 ? '#ef4444' : 'var(--gemini-blue)'} />
                    <span style={{ fontWeight: 600, color: badgeCount > 0 ? '#ef4444' : 'var(--text-main)' }}>{course}</span>
                    {badgeCount > 0 && (
                      <span style={{
                        background: '#ef4444',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-pill)'
                      }}>
                        {badgeCount} 待辦
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Modal */}
      {selectedCourse && (
        <CourseTaskModal 
          course={selectedCourse}
          tasks={tasks.filter(t => !t.completed && t.relatedCourse && normalizeCourse(t.relatedCourse) === normalizeCourse(selectedCourse))}
          onClose={() => setSelectedCourse(null)}
          onCompleteTask={onCompleteTask}
        />
      )}
    </div>
  );
}
