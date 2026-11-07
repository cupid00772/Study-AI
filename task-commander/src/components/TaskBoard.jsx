import React, { useState } from 'react';
import { Star, AlertTriangle, Crosshair, Check, Trash2, Edit, BookOpen, CalendarDays } from 'lucide-react';

function TaskCard({ task, onComplete, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentDate = new Date();
  const todayKey = [
    currentDate.getFullYear(),
    String(currentDate.getMonth() + 1).padStart(2, '0'),
    String(currentDate.getDate()).padStart(2, '0')
  ].join('-');
  const isOverdue = task.dueDate && task.dueDate < todayKey;

  const getDiffClass = (diff) => {
    if (diff === 'Easy') return 'diff-easy';
    if (diff === 'Hard') return 'diff-hard';
    return 'diff-medium';
  };

  return (
    <>
      <div 
        className="task-card" 
        onClick={() => setIsOpen(true)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        role="button"
        tabIndex="0"
        aria-label={`Open mission ${task.title}`}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', task.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
      >
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span className={`diff-badge ${getDiffClass(task.difficulty)}`}>{task.difficulty}</span>
          <span className="xp-reward"><Star size={14}/> {task.xp} XP</span>
        </div>
        {task.relatedCourse && (
          <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookOpen size={12} /> {task.relatedCourse}
          </div>
        )}
        {task.dueDate && (
          <div style={{ marginTop: '8px', fontSize: '0.8rem', color: isOverdue ? '#ff4444' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CalendarDays size={12} /> {isOverdue ? 'Overdue: ' : 'Due: '}{task.dueDate}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 className="modal-title" style={{ margin: 0 }}>{task.title}</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn" aria-label={`Edit ${task.title}`} style={{ padding: '0.25rem 0.5rem' }} onClick={() => { setIsOpen(false); onEdit(task); }}>
                  <Edit size={16} />
                </button>
                <button className="btn" aria-label={`Delete ${task.title}`} style={{ padding: '0.25rem 0.5rem', color: '#ff4444', borderColor: '#ff4444' }} onClick={() => {
                  if(window.confirm('Are you sure you want to delete this mission?')) {
                    onDelete(task.id);
                    setIsOpen(false);
                  }
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="modal-meta" style={{ marginTop: '1rem' }}>
              <span className={`diff-badge ${getDiffClass(task.difficulty)}`}>{task.difficulty}</span>
              <span className="xp-reward" style={{ float: 'right' }}><Star size={16}/> {task.xp} XP</span>
            </div>
            
            <div className="modal-desc">
              <strong><Crosshair size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> Objective:</strong><br/>
              {task.desc}
            </div>

            {task.dueDate && (
              <div style={{ marginBottom: '1rem', color: isOverdue ? '#ff4444' : 'var(--text-muted)' }}>
                <CalendarDays size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} />{' '}
                {isOverdue ? 'Overdue: ' : 'Due: '}{task.dueDate}
              </div>
            )}

            <button className="btn btn-success" onClick={() => {
              onComplete(task.id, task.xp);
              setIsOpen(false);
            }}>
              <Check size={18} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> COMPLETE MISSION
            </button>
            <button className="btn" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => setIsOpen(false)}>
              CANCEL
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function TaskBoard({ tasks, onComplete, onEdit, onDelete, onCategoryChange }) {
  const dailyTasks = tasks.filter(t => t.category === 'Daily');
  const mainTasks = tasks.filter(t => t.category === 'Main');
  const challengeTasks = tasks.filter(t => t.category === 'Challenge');

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onCategoryChange) {
      onCategoryChange(taskId, category);
    }
  };

  return (
    <div className="tasks-grid">
      <div 
        className="task-column" 
        onDragOver={handleDragOver} 
        onDrop={(e) => handleDrop(e, 'Daily')}
      >
        <div className="column-title">
          <AlertTriangle size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> Daily Objectives
        </div>
        {dailyTasks.map(t => <TaskCard key={t.id} task={t} onComplete={onComplete} onEdit={onEdit} onDelete={onDelete} />)}
        {dailyTasks.length === 0 && <div style={{ color: '#666', fontSize: '0.9rem' }}>No daily tasks remaining.</div>}
      </div>

      <div 
        className="task-column"
        onDragOver={handleDragOver} 
        onDrop={(e) => handleDrop(e, 'Main')}
      >
        <div className="column-title">
          <Star size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> Main Campaign
        </div>
        {mainTasks.map(t => <TaskCard key={t.id} task={t} onComplete={onComplete} onEdit={onEdit} onDelete={onDelete} />)}
        {mainTasks.length === 0 && <div style={{ color: '#666', fontSize: '0.9rem' }}>No main tasks remaining.</div>}
      </div>

      <div 
        className="task-column"
        onDragOver={handleDragOver} 
        onDrop={(e) => handleDrop(e, 'Challenge')}
      >
        <div className="column-title">
          <Crosshair size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> Special Challenges
        </div>
        {challengeTasks.map(t => <TaskCard key={t.id} task={t} onComplete={onComplete} onEdit={onEdit} onDelete={onDelete} />)}
        {challengeTasks.length === 0 && <div style={{ color: '#666', fontSize: '0.9rem' }}>No special tasks remaining.</div>}
      </div>
    </div>
  );
}
