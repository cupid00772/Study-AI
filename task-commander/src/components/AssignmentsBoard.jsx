import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Sparkles,
  Trash2,
  ExternalLink,
  Plus,
  X,
  Play,
  RotateCcw,
  Search,
} from 'lucide-react';
import { diffDaysFromToday, isNoiseAssignment, openExternalUrl } from '../utils/academicUtils';

export default function AssignmentsBoard({
  assignments = [],
  courses = [],
  onChangeStatus,
  onDeleteAssignment,
  onAddAssignment,
  onPreviewFile,
  isMobile = false,
}) {
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(() => (isMobile || (typeof window !== 'undefined' && window.innerWidth < 768) ? 'list' : 'kanban')); // 'kanban' | 'list'
  const [dragOverCol, setDragOverCol] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add assignment form
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState(courses[0]?.name || '資料與檔案結構');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLink, setNewLink] = useState('');

  // 自動過濾非課業行政雜訊
  const cleanAssignments = useMemo(() => {
    return (Array.isArray(assignments) ? assignments : []).filter((hw) => !isNoiseAssignment(hw));
  }, [assignments]);

  const courseList = useMemo(() => {
    const set = new Set();
    cleanAssignments.forEach((a) => { if (a.course) set.add(a.course); });
    return ['ALL', ...Array.from(set)];
  }, [cleanAssignments]);

  const filteredAssignments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cleanAssignments
      .filter((item) => {
        if (selectedCourse !== 'ALL' && item.course !== selectedCourse) return false;
        if (q && !`${item.title} ${item.course} ${item.description || ''}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        const da = diffDaysFromToday(a.dueDate);
        const db = diffDaysFromToday(b.dueDate);
        if (a.status === 'completed' && b.status === 'completed') {
          return (db ?? -999) - (da ?? -999);
        }
        return (da ?? 999) - (db ?? 999);
      });
  }, [cleanAssignments, selectedCourse, searchQuery]);

  const columns = useMemo(() => ({
    pending: {
      title: '待開始',
      badgeColor: 'badge-amber',
      items: filteredAssignments.filter((a) => !a.status || a.status === 'pending'),
    },
    in_progress: {
      title: '進行中',
      badgeColor: 'badge-blue',
      items: filteredAssignments.filter((a) => a.status === 'in_progress'),
    },
    completed: {
      title: '已完成',
      badgeColor: 'badge-green',
      items: filteredAssignments.filter((a) => a.status === 'completed'),
    },
  }), [filteredAssignments]);

  const getDeadlineBadge = (dueDate, completed, grade) => {
    if (completed) {
      return (
        <span className="badge-chip badge-green">
          <CheckCircle2 size={12} /> {grade ? `得分 ${grade}` : '已完成'}
        </span>
      );
    }
    const diffDays = diffDaysFromToday(dueDate);
    if (diffDays === null) return null;
    if (diffDays < 0) {
      return <span className="badge-chip badge-pink"><AlertTriangle size={12} /> 逾期 {Math.abs(diffDays)} 天</span>;
    }
    if (diffDays === 0) {
      return <span className="badge-chip badge-pink"><Clock size={12} /> 今天截止</span>;
    }
    if (diffDays <= 3) {
      return <span className="badge-chip badge-amber"><Clock size={12} /> 倒數 {diffDays} 天</span>;
    }
    return <span className="badge-chip badge-blue"><Clock size={12} /> 剩 {diffDays} 天</span>;
  };

  const handleDeleteItem = (e, hw) => {
    e.stopPropagation();
    if (window.confirm(`確定要移除「${hw.title}」嗎？\n移除後將自動加入忽略清單，下次同步 eeclass 不會再復活。`)) {
      onDeleteAssignment?.(hw.id);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddAssignment?.({
      id: `hw-custom-${Date.now()}`,
      course: newCourse || '自訂科目',
      title: newTitle.trim(),
      dueDate: newDueDate || '',
      status: 'pending',
      grade: '',
      description: newDesc.trim(),
      link: newLink.trim() || null,
      promptFile: null,
      deliverableFile: null,
    });
    setNewTitle('');
    setNewDueDate('');
    setNewDesc('');
    setNewLink('');
    setIsAddModalOpen(false);
  };

  const handleDrop = (e, statusKey) => {
    e.preventDefault();
    setDragOverCol(null);
    const hwId = e.dataTransfer.getData('text/plain');
    if (hwId) onChangeStatus?.(hwId, statusKey);
  };

  const renderCard = (hw) => {
    const isCompleted = hw.status === 'completed';
    const isInProgress = hw.status === 'in_progress';
    const daysLeft = diffDaysFromToday(hw.dueDate);
    const isOverdue = !isCompleted && daysLeft !== null && daysLeft < 0;

    return (
      <div
        key={hw.id}
        className="assignment-card"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', hw.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
        style={{
          opacity: isCompleted ? 0.72 : 1,
          borderLeft: `4px solid ${isCompleted ? 'var(--accent-emerald)' : isOverdue ? 'var(--accent-danger)' : isInProgress ? 'var(--accent-primary)' : 'var(--accent-amber)'}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
          <span className="badge-chip badge-blue">{hw.course}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {getDeadlineBadge(hw.dueDate, isCompleted, hw.grade)}
            <button
              type="button"
              className="icon-ghost-btn danger"
              onClick={(e) => handleDeleteItem(e, hw)}
              title="移除並忽略此作業"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div className="assignment-title">{hw.title}</div>
        {hw.description && <div className="assignment-desc">{hw.description}</div>}

        {/* 檔案與 eeclass 直連 */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {hw.link && (
            <button
              type="button"
              className="btn btn-secondary btn-xs"
              onClick={(e) => { e.stopPropagation(); openExternalUrl(hw.link); }}
            >
              <ExternalLink size={12} /> 開啟 eeclass
            </button>
          )}
          {hw.promptFile && (
            <button
              type="button"
              className="btn btn-secondary btn-xs"
              onClick={(e) => {
                e.stopPropagation();
                onPreviewFile?.({ title: `${hw.title} - 題目說明`, path: hw.promptFile, course: hw.course });
              }}
            >
              <FileText size={12} /> 題目
            </button>
          )}
          {hw.deliverableFile && (
            <button
              type="button"
              className="btn btn-primary btn-xs"
              onClick={(e) => {
                e.stopPropagation();
                onPreviewFile?.({ title: `${hw.title} - 解答/成果`, path: hw.deliverableFile, course: hw.course });
              }}
            >
              <Sparkles size={12} /> 檢視成果
            </button>
          )}
        </div>

        {/* 底部狀態切換 */}
        <div className="assignment-footer">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {hw.dueDate ? `期限 ${hw.dueDate}` : '未設截止日'}
          </span>

          <div style={{ display: 'flex', gap: '6px' }}>
            {!isCompleted && !isInProgress && (
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => onChangeStatus?.(hw.id, 'in_progress')}
                title="移至進行中"
              >
                <Play size={11} /> 進行中
              </button>
            )}
            {!isCompleted ? (
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => onChangeStatus?.(hw.id, 'completed')}
                style={{ borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}
              >
                <CheckCircle2 size={12} /> 完成
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => onChangeStatus?.(hw.id, 'pending')}
                title="改回未完成"
              >
                <RotateCcw size={11} /> 重開
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="assignments-container">
      {/* Toolbar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="搜尋作業名稱或科目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '32px', height: '36px', width: '210px', borderRadius: 'var(--radius-pill)', fontSize: '0.84rem' }}
            />
          </div>

          <div className="nav-pills" style={{ padding: '3px', flexWrap: 'wrap' }}>
            {courseList.map((c) => (
              <button
                key={c}
                type="button"
                className={`nav-pill-btn ${selectedCourse === c ? 'active' : ''}`}
                onClick={() => setSelectedCourse(c)}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                {c === 'ALL' ? `全部 (${cleanAssignments.length})` : c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
          <div className="nav-pills" style={{ padding: '3px' }}>
            <button
              type="button"
              className={`nav-pill-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            >
              看板
            </button>
            <button
              type="button"
              className={`nav-pill-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            >
              清單
            </button>
          </div>

          <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={15} /> 新增作業
          </button>
        </div>
      </div>

      {/* Kanban / List */}
      {viewMode === 'kanban' ? (
        <div className="kanban-board">
          {Object.entries(columns).map(([colKey, col]) => (
            <div
              key={colKey}
              className={`kanban-column ${dragOverCol === colKey ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); if (dragOverCol !== colKey) setDragOverCol(colKey); }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => handleDrop(e, colKey)}
            >
              <div className="kanban-column-header">
                <div className="column-title-wrap">
                  <span className={`badge-chip ${col.badgeColor}`}>{col.title}</span>
                </div>
                <span className="column-count-badge">{col.items.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.items.length === 0 ? (
                  <div className="empty-mini" style={{ padding: '2rem 1rem' }}>
                    {colKey === 'in_progress' ? '可將作業卡片拖曳至此追蹤進度' : '目前無符合項目'}
                  </div>
                ) : (
                  col.items.map(renderCard)
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bento-card" style={{ padding: '1rem' }}>
          {filteredAssignments.length === 0 ? (
            <div className="empty-mini" style={{ padding: '3rem' }}>目前無符合條件之作業</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredAssignments.map((hw) => {
                const isCompleted = hw.status === 'completed';
                return (
                  <div key={hw.id} className="assignment-list-row">
                    <span className="badge-chip badge-blue" style={{ flexShrink: 0 }}>{hw.course}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {hw.title}
                      </div>
                      {hw.description && (
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {hw.description}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {getDeadlineBadge(hw.dueDate, isCompleted, hw.grade)}
                      {hw.link && (
                        <button type="button" className="icon-ghost-btn" onClick={() => openExternalUrl(hw.link)} title="開啟 eeclass">
                          <ExternalLink size={14} />
                        </button>
                      )}
                      {!isCompleted ? (
                        <button type="button" className="btn btn-secondary btn-xs" onClick={() => onChangeStatus?.(hw.id, 'completed')}>
                          <CheckCircle2 size={12} /> 完成
                        </button>
                      ) : (
                        <button type="button" className="btn btn-secondary btn-xs" onClick={() => onChangeStatus?.(hw.id, 'pending')}>
                          <RotateCcw size={12} /> 重開
                        </button>
                      )}
                      <button type="button" className="icon-ghost-btn danger" onClick={(e) => handleDeleteItem(e, hw)} title="移除">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 新增作業彈窗 */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
              <h2 className="modal-title" style={{ margin: 0 }}>新增作業任務</h2>
              <button type="button" className="btn btn-secondary btn-icon-sm" onClick={() => setIsAddModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>作業名稱 *</label>
                <input type="text" className="form-control" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="例如：作業系統 Ch6 排程實作" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>所屬科目</label>
                  <select className="form-control" value={newCourse} onChange={(e) => setNewCourse(e.target.value)}>
                    {(courses || []).map((c) => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>截止日期</label>
                  <input type="date" className="form-control" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>備註說明</label>
                <input type="text" className="form-control" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="繳交格式、補交規定或重點備註..." />
              </div>
              <div className="form-group">
                <label>繳交連結（選填）</label>
                <input type="url" className="form-control" value={newLink} onChange={(e) => setNewLink(e.target.value)} placeholder="https://ncueeclass.ncu.edu.tw/..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>取消</button>
                <button type="submit" className="btn btn-primary">建立作業</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
