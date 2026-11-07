import { useState, useMemo } from 'react';
import { CheckCircle2, Clock, AlertTriangle, FileText, Sparkles, Award } from 'lucide-react';
import defaultTracker from '../data/defaultTracker.json';

export default function AssignmentsBoard({ assignments = [], onCompleteAssignment, onPreviewFile }) {
  const displayAssignments = useMemo(() => {
    return assignments && assignments.length > 0 ? assignments : (defaultTracker.assignments || []);
  }, [assignments]);
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'

  const courseList = useMemo(() => {
    const set = new Set();
    displayAssignments.forEach(a => {
      if (a.course) set.add(a.course);
    });
    return ['ALL', ...Array.from(set)];
  }, [displayAssignments]);

  const filteredAssignments = useMemo(() => {
    return displayAssignments.filter(item => {
      return selectedCourse === 'ALL' || item.course === selectedCourse;
    });
  }, [displayAssignments, selectedCourse]);

  const columns = useMemo(() => {
    return {
      pending: {
        title: '待開始 (Pending)',
        badgeColor: 'badge-amber',
        items: filteredAssignments.filter(a => a.status === 'pending')
      },
      in_progress: {
        title: '進行中 (In Progress)',
        badgeColor: 'badge-blue',
        items: filteredAssignments.filter(a => a.status === 'in_progress')
      },
      completed: {
        title: '已完成 (Completed)',
        badgeColor: 'badge-green',
        items: filteredAssignments.filter(a => a.status === 'completed')
      }
    };
  }, [filteredAssignments]);

  const getDeadlineBadge = (dueDate, completed) => {
    if (completed) {
      return <span className="badge-chip badge-green"><CheckCircle2 size={12} /> 已完成</span>;
    }
    if (!dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="badge-chip badge-pink"><AlertTriangle size={12} /> 逾期 {Math.abs(diffDays)} 天</span>;
    }
    if (diffDays <= 3) {
      return <span className="badge-chip badge-amber"><Clock size={12} /> 倒數 {diffDays} 天</span>;
    }
    return <span className="badge-chip badge-blue"><Clock size={12} /> 還有 {diffDays} 天</span>;
  };

  const renderCard = (hw) => {
    const isCompleted = hw.status === 'completed';

    return (
      <div 
        key={hw.id} 
        className="assignment-card"
        style={{
          opacity: isCompleted ? 0.75 : 1,
          borderLeft: isCompleted ? '4px solid var(--gemini-emerald)' : '4px solid var(--gemini-blue)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
          <span className="badge-chip badge-blue">{hw.course}</span>
          {getDeadlineBadge(hw.dueDate, isCompleted)}
        </div>

        <div className="assignment-title">{hw.title}</div>
        {hw.description && <div className="assignment-desc">{hw.description}</div>}

        {/* Action Link Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '4px 0' }}>
          {hw.promptFile && (
            <button
              className="btn btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                onPreviewFile({ title: `${hw.title} - 題目說明`, path: hw.promptFile, course: hw.course });
              }}
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
            >
              <FileText size={12} /> 查看題目
            </button>
          )}

          {hw.deliverableFile && (
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                onPreviewFile({ title: `${hw.title} - 成果報告`, path: hw.deliverableFile, course: hw.course });
              }}
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
            >
              <Sparkles size={12} /> 檢視成果
            </button>
          )}
        </div>

        <div className="assignment-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--gemini-purple)', fontWeight: 700 }}>
            <Award size={14} /> +{hw.xp || 500} XP
          </div>

          {!isCompleted ? (
            <button
              className="btn btn-secondary"
              onClick={() => onCompleteAssignment(hw.id)}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', borderColor: 'var(--gemini-emerald)', color: 'var(--gemini-emerald)' }}
            >
              <CheckCircle2 size={13} /> 標記完成
            </button>
          ) : (
            <span style={{ fontSize: '0.78rem', color: 'var(--gemini-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> 已達成
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="assignments-container">
      {/* Filter and Top Navigation */}
      <div className="filter-bar">
        <div className="nav-pills" style={{ padding: '3px' }}>
          {courseList.map(c => (
            <button
              key={c}
              className={`nav-pill-btn ${selectedCourse === c ? 'active' : ''}`}
              onClick={() => setSelectedCourse(c)}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
            >
              {c === 'ALL' ? '全科作業' : c}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="nav-pills" style={{ padding: '3px' }}>
            <button
              className={`nav-pill-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              看板模式
            </button>
            <button
              className={`nav-pill-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              清單模式
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Mode */}
      {viewMode === 'kanban' ? (
        <div className="kanban-board">
          {Object.entries(columns).map(([colKey, col]) => (
            <div key={colKey} className="kanban-column">
              <div className="kanban-column-header">
                <div className="column-title-wrap">
                  <span className={`badge-chip ${col.badgeColor}`}>{col.title}</span>
                </div>
                <span className="column-count-badge">{col.items.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.items.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    目前無作業項目
                  </div>
                ) : (
                  col.items.map(hw => renderCard(hw))
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode */
        <div className="gemini-card" style={{ padding: '1rem' }}>
          {filteredAssignments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
              目前無作業項目
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredAssignments.map(hw => renderCard(hw))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
