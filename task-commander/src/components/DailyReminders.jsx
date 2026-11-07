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
    <div style={{
      background: 'var(--bg-panel)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '15px 20px',
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      {/* 頂部標題 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 'bold' }}>
        <Bell size={18} style={{ color: 'var(--accent-gold)' }} />
        <span>AGENDA & REMINDERS</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* 日常提醒 */}
        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>TODAY'S REMINDERS</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {reminders.length === 0 ? (
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No reminders for today.</span>
            ) : (
              reminders.map((reminder, idx) => {
                const isCompleted = reminderCompletions[`${today}:${reminder}`];
                return (
                <div key={idx} style={{
                  background: 'var(--bg-dark)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  opacity: isCompleted ? 0.65 : 1,
                  textDecoration: isCompleted ? 'line-through' : 'none'
                }} onClick={() => onToggleReminder(reminder)} role="button" tabIndex="0" onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onToggleReminder(reminder);
                  }
                }} aria-label={`${isCompleted ? 'Uncomplete' : 'Complete'} reminder: ${reminder}`}>
                  <CheckCircle2 size={16} color={isCompleted ? 'var(--success)' : 'var(--text-muted)'} />
                  {reminder}
                </div>
                );
              })
            )}
          </div>
        </div>

        {/* 明日課表與作業提醒 */}
        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>TOMORROW'S CLASSES ({tomorrowDayName})</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {tomorrowCourses.length === 0 ? (
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No classes tomorrow! 🎉</span>
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
                      background: badgeCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-dark)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: badgeCount > 0 ? '1px solid #ef4444' : '1px solid var(--border-color)',
                      cursor: badgeCount > 0 ? 'pointer' : 'default',
                      position: 'relative',
                      transition: 'all 0.2s'
                    }}
                    role={badgeCount > 0 ? 'button' : undefined}
                    tabIndex={badgeCount > 0 ? 0 : -1}
                    onKeyDown={event => {
                      if (badgeCount > 0 && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault();
                        setSelectedCourse(course);
                      }
                    }}
                    aria-label={badgeCount > 0 ? `${course}, ${badgeCount} pending tasks` : course}
                  >
                    <CalendarIcon size={16} color={badgeCount > 0 ? '#ef4444' : 'var(--text-main)'} />
                    <span style={{ color: badgeCount > 0 ? '#ef4444' : 'var(--text-main)' }}>{course}</span>
                    {badgeCount > 0 && (
                      <span
                        aria-label="Pending task for tomorrow's class"
                        title="Pending task for tomorrow's class"
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#ef4444',
                          boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.15)'
                        }}
                      />
                    )}
                    {badgeCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ef4444',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 5px rgba(239, 68, 68, 0.5)'
                      }}>
                        {badgeCount}
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
