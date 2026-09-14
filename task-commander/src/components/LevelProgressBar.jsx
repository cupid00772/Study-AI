import React from 'react';

export default function LevelProgressBar({ level, xp, maxXp }) {
  const percentage = Math.min(100, (xp / maxXp) * 100);

  return (
    <div className="level-bar-container">
      <div className="level-badge">{level}</div>
      <div className="progress-wrapper">
        <div className="progress-header">
          <span>EXPERIENCE PROGRESS</span>
          <span>{xp} / {maxXp} XP</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </div>
  );
}
