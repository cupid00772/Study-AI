import React, { useEffect } from 'react';
import { BookOpen, Check } from 'lucide-react';

export default function CourseTaskModal({ course, tasks, onClose, onCompleteTask }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{ zIndex: 1000 }}
    >
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        onMouseDown={e => e.stopPropagation()} 
        style={{ maxWidth: '500px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <BookOpen size={24} style={{ color: 'var(--accent-gold)' }} />
          <h2 className="modal-title" style={{ margin: 0 }}>{course} - Pending Tasks</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>All caught up!</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} style={{
                background: 'var(--bg-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '4px' }}>{task.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{task.desc}</div>
                </div>
                <button 
                  className="btn btn-success" 
                  style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}
                  onClick={() => {
                    onCompleteTask(task.id, task.xp);
                  }}
                >
                  <Check size={14} /> Complete
                </button>
              </div>
            ))
          )}
        </div>

        <button className="btn" style={{ width: '100%', marginTop: '20px' }} onClick={onClose}>
          CLOSE
        </button>
      </div>
    </div>
  );
}
