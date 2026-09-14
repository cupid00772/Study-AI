import React, { useState, useEffect } from 'react';

export default function CreateTaskModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Daily');
  const [difficulty, setDifficulty] = useState('Easy');
  const [xp, setXp] = useState(100);
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Auto-calculate XP and Difficulty
  useEffect(() => {
    if (isManualOverride) return;

    let calcXp = 100;
    let calcDiff = 'Easy';
    const text = title + ' ' + desc;

    if (text.length > 20) calcXp += 50;
    if (text.length > 50) calcXp += 100;

    if (text.includes('轉學') || text.includes('期末') || text.includes('考古題') || text.includes('專題')) {
      calcXp += 500;
      calcDiff = 'Hard';
    } else if (text.includes('複習') || text.includes('作業') || text.includes('整理')) {
      calcXp += 200;
      calcDiff = 'Medium';
    } else if (text.length > 100) {
      calcDiff = 'Medium';
    }

    setXp(calcXp);
    setDifficulty(calcDiff);
  }, [title, desc, isManualOverride]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, desc, category, difficulty, xp: Number(xp) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">NEW MISSION BRIEFING</h2>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <select className="form-control" value={difficulty} onChange={e => {
                setDifficulty(e.target.value);
                setIsManualOverride(true);
              }}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Experience Reward (XP)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="number" 
                className="form-control" 
                value={xp} 
                onChange={e => {
                  setXp(e.target.value);
                  setIsManualOverride(true);
                }} 
              />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                {isManualOverride ? '(Manual)' : '(Auto)'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>CREATE MISSION</button>
            <button type="button" className="btn" onClick={onClose}>ABORT</button>
          </div>
        </form>
      </div>
    </div>
  );
}
