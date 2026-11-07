import React, { useState } from 'react';
import { Settings, Plus, Trash2, X } from 'lucide-react';

export default function SettingsModal({ onClose, weeklySchedule, setWeeklySchedule, reminders, setReminders }) {
  const [activeTab, setActiveTab] = useState('reminders');
  
  // 提醒事項狀態
  const [newReminder, setNewReminder] = useState('');

  // 課表狀態
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [newCourse, setNewCourse] = useState('');

  // 新增提醒
  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newReminder.trim()) return;
    setReminders(previousReminders => [...previousReminders, newReminder.trim()]);
    setNewReminder('');
  };

  // 刪除提醒
  const handleDeleteReminder = (index) => {
    setReminders(previousReminders => previousReminders.filter((_, i) => i !== index));
  };

  // 新增課表
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.trim()) return;
    setWeeklySchedule(previousSchedule => ({
      ...previousSchedule,
      [selectedDay]: [...(previousSchedule[selectedDay] || []), newCourse.trim()]
    }));
    setNewCourse('');
  };

  // 刪除課表
  const handleDeleteCourse = (day, index) => {
    setWeeklySchedule(previousSchedule => ({
      ...previousSchedule,
      [day]: (previousSchedule[day] || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={24} style={{ color: 'var(--accent-gold)' }} />
            SYSTEM SETTINGS
          </h2>
          <button className="btn" aria-label="Close settings" onClick={onClose} style={{ padding: '5px' }}><X size={20} /></button>
        </div>

        <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <button 
            className={`btn ${activeTab === 'reminders' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('reminders')}
          >
            DAILY REMINDERS
          </button>
          <button 
            className={`btn ${activeTab === 'schedule' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('schedule')}
          >
            WEEKLY SCHEDULE
          </button>
        </div>

        {activeTab === 'reminders' && (
          <div>
            <form onSubmit={handleAddReminder} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input 
                type="text" 
                className="form-control" 
                value={newReminder} 
                onChange={e => setNewReminder(e.target.value)} 
                placeholder="Enter new reminder (e.g., 吃感冒藥)"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 15px' }}>
                <Plus size={18} />
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {reminders.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No reminders set.</div>}
              {reminders.map((reminder, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)', padding: '10px 15px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <span>{reminder}</span>
                  <button type="button" className="btn" aria-label={`Delete reminder: ${reminder}`} style={{ padding: '5px', color: '#ff4444', borderColor: '#ff4444' }} onClick={() => handleDeleteReminder(idx)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
              {dayNames.map(day => (
                <button 
                  key={day}
                  className={`btn ${selectedDay === day ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '5px 10px', fontSize: '0.85rem' }}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>

            <form onSubmit={handleAddCourse} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input 
                type="text" 
                className="form-control" 
                value={newCourse} 
                onChange={e => setNewCourse(e.target.value)} 
                placeholder={`Add course for ${selectedDay} (e.g., 計算機概論)`}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 15px' }}>
                <Plus size={18} />
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
              {(!weeklySchedule[selectedDay] || weeklySchedule[selectedDay].length === 0) && (
                <div style={{ color: 'var(--text-muted)' }}>No classes scheduled for {selectedDay}.</div>
              )}
              {weeklySchedule[selectedDay] && weeklySchedule[selectedDay].map((course, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)', padding: '10px 15px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <span>{course}</span>
                  <button type="button" className="btn" aria-label={`Delete course: ${course}`} style={{ padding: '5px', color: '#ff4444', borderColor: '#ff4444' }} onClick={() => handleDeleteCourse(selectedDay, idx)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button className="btn btn-success" onClick={onClose} style={{ width: '100%' }}>
            SAVE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
