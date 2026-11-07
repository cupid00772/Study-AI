import React, { useState } from 'react';

function calculateTaskMeta(title, desc) {
  let calculatedXp = 100;
  let calculatedDifficulty = 'Easy';
  const text = `${title} ${desc}`;

  if (text.length > 20) calculatedXp += 50;
  if (text.length > 50) calculatedXp += 100;

  if (text.includes('轉學') || text.includes('期末') || text.includes('考古題') || text.includes('專題')) {
    calculatedXp += 500;
    calculatedDifficulty = 'Hard';
  } else if (text.includes('複習') || text.includes('作業') || text.includes('整理')) {
    calculatedXp += 200;
    calculatedDifficulty = 'Medium';
  } else if (text.length > 100) {
    calculatedDifficulty = 'Medium';
  }

  return { calculatedXp, calculatedDifficulty };
}

export default function CreateTaskModal({ onClose, onAdd, initialTask = null, courseOptions = [] }) {
  const [title, setTitle] = useState(initialTask ? initialTask.title : '');
  const [desc, setDesc] = useState(initialTask ? initialTask.desc : '');
  const [category, setCategory] = useState(initialTask ? initialTask.category : 'Daily');
  const [difficulty, setDifficulty] = useState(initialTask ? initialTask.difficulty : 'Easy');
  const [xp, setXp] = useState(initialTask ? initialTask.xp : 100);
  const [relatedCourse, setRelatedCourse] = useState(initialTask && initialTask.relatedCourse ? initialTask.relatedCourse : '');
  const [dueDate, setDueDate] = useState(initialTask && initialTask.dueDate ? initialTask.dueDate : '');
  const [isManualOverride, setIsManualOverride] = useState(!!initialTask);
  const [validationError, setValidationError] = useState('');

  const { calculatedXp, calculatedDifficulty } = calculateTaskMeta(title, desc);
  const displayedXp = isManualOverride ? xp : calculatedXp;
  const displayedDifficulty = isManualOverride ? difficulty : calculatedDifficulty;
  const availableCourseOptions = [...new Set([
    ...courseOptions,
    ...(initialTask?.relatedCourse ? [initialTask.relatedCourse] : [])
  ])];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const normalizedXp = Number(displayedXp);
    if (!Number.isInteger(normalizedXp) || normalizedXp < 0) {
      setValidationError('XP must be a non-negative whole number.');
      return;
    }

    const taskData = { 
      title: title.trim(), 
      desc: desc.trim(), 
      category, 
      difficulty: displayedDifficulty, 
      xp: normalizedXp,
      relatedCourse: relatedCourse.trim() || undefined,
      dueDate: dueDate || undefined
    };
    if (initialTask) {
      taskData.id = initialTask.id;
      taskData.completed = initialTask.completed;
    }
    onAdd(taskData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{initialTask ? 'UPDATE MISSION BRIEFING' : 'NEW MISSION BRIEFING'}</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Mission Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Enter objective..."
              required
            />
          </div>

          <div className="form-group">
            <label>Intel / Description</label>
            <textarea 
              className="form-control" 
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
              rows="3"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label>Classification</label>
              <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Daily">Daily Objective</option>
                <option value="Main">Main Campaign</option>
                <option value="Challenge">Special Challenge</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty Rating</label>
              <select className="form-control" value={displayedDifficulty} onChange={e => {
                setDifficulty(e.target.value);
                setIsManualOverride(true);
              }}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label>Related Course (Optional)</label>
              <select
                className="form-control"
                value={relatedCourse}
                onChange={e => setRelatedCourse(e.target.value)}
                disabled={availableCourseOptions.length === 0}
              >
                <option value="">No related course</option>
                {availableCourseOptions.map(course => <option key={course} value={course}>{course}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date (Optional)</label>
              <input 
                type="date" 
                className="form-control" 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Experience Reward (XP)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="number" 
                className="form-control" 
                min="0"
                step="1"
                value={displayedXp} 
                onChange={e => {
                  setXp(e.target.value);
                  setIsManualOverride(true);
                }} 
              />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                {isManualOverride ? '(Manual)' : '(Auto)'}
              </span>
            </div>
            {validationError && <div role="alert" style={{ color: 'var(--danger, #ff4444)', marginTop: '0.5rem' }}>{validationError}</div>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>{initialTask ? 'UPDATE MISSION' : 'CREATE MISSION'}</button>
            <button type="button" className="btn" onClick={onClose}>ABORT</button>
          </div>
        </form>
      </div>
    </div>
  );
}
