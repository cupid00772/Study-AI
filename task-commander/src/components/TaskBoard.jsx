import React, { useState } from 'react';
import { Star, AlertTriangle, Crosshair, Check } from 'lucide-react';

function TaskCard({ task, onComplete }) {
  const [isOpen, setIsOpen] = useState(false);

  const getDiffClass = (diff) => {
    if (diff === 'Easy') return 'diff-easy';
    if (diff === 'Hard') return 'diff-hard';
    return 'diff-medium';
  };

  return (
    <>
      <div className="task-card" onClick={() => setIsOpen(true)}>
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span className={`diff-badge ${getDiffClass(task.difficulty)}`}>{task.difficulty}</span>
          <span className="xp-reward"><Star size={14}/> {task.xp} XP</span>
        </div>
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{task.title}</h2>
            <div className="modal-meta">
              <span className={`diff-badge ${getDiffClass(task.difficulty)}`}>{task.difficulty}</span>
              <span className="xp-reward" style={{ float: 'right' }}><Star size={16}/> {task.xp} XP</span>
            </div>
            
            <div className="modal-desc">
              <strong><Crosshair size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> Objective:</strong><br/>
              {task.desc}
            </div>

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

export default function TaskBoard({ tasks, onComplete }) {
  const dailyTasks = tasks.filter(t => t.category === 'Daily');
  const mainTasks = tasks.filter(t => t.category === 'Main');
  const challengeTasks = tasks.filter(t => t.category === 'Challenge');

  return (
    <div className="tasks-grid">
      <div className="task-column">
        <div className="column-title">
          <AlertTriangle size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> Daily Objectives
        </div>
        {dailyTasks.map(t => <TaskCard key={t.id} task={t} onComplete={onComplete} />)}
        {dailyTasks.length === 0 && <div style={{ color: '#666', fontSize: '0.9rem' }}>No daily tasks remaining.</div>}
      </div>

      <div className="task-column">
        <div className="column-title">
          <Star size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> Main Campaign
        </div>
        {mainTasks.map(t => <TaskCard key={t.id} task={t} onComplete={onComplete} />)}
        {mainTasks.length === 0 && <div style={{ color: '#666', fontSize: '0.9rem' }}>No main tasks remaining.</div>}
      </div>

      <div className="task-column">
        <div className="column-title">
          <Crosshair size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> Special Challenges
        </div>
        {challengeTasks.map(t => <TaskCard key={t.id} task={t} onComplete={onComplete} />)}
        {challengeTasks.length === 0 && <div style={{ color: '#666', fontSize: '0.9rem' }}>No special tasks remaining.</div>}
      </div>
    </div>
  );
}
