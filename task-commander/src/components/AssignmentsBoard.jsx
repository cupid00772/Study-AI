import { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  Award, 
  Trash2, 
  Bot, 
  X, 
  ArrowRight, 
  Layers,
  BookOpen
} from 'lucide-react';
import defaultTracker from '../data/defaultTracker.json';

// AI 智慧審核與歸類規則引擎
function auditAssignmentItem(hw) {
  const title = (hw.title || '').trim();
  const course = (hw.course || '').trim();

  // 1. 判斷該不該放上去 (有效性與雜訊分析)
  const adminKeywords = [
    '出國補助', '補助申請', '國際菁英獎', '英語優等獎', '活動紀錄表', 
    '英檢證明', '成績單繳交區', '英檢課堂加分', '多益', '問卷調查', 
    '滿意度調查', '基本資料', '訪談紀錄', '不計分;不計次', '護照'
  ];
  const gradeNoticeKeywords = [
    '期中考-成績', '小考成績', '成績公告', '成績發布', '成績查詢'
  ];

  const isAdmin = adminKeywords.some(kw => title.includes(kw));
  const isGradeNotice = gradeNoticeKeywords.some(kw => title.includes(kw));
  const isPassportCourse = course.includes('護照') || course === '管理學院';

  let shouldInclude = true;
  let reason = '符合中央大學課堂學術作業、實習心得或習題練習標準，建議保留。';
  let tag = '正規課業';

  if (isAdmin) {
    shouldInclude = false;
    reason = '此為行政手續、出國獎助或活動認證紀錄表，非課堂學術作業，建議移出作業看板。';
    tag = '行政填表';
  } else if (isGradeNotice) {
    shouldInclude = false;
    reason = '此為單純考試成績發布公告，非學生待繳交作業任務，建議移出作業看板。';
    tag = '成績公告';
  } else if (isPassportCourse && !title.includes('作業') && !title.includes('習題') && !title.includes('心得')) {
    shouldInclude = false;
    reason = '此為管理學院非學分護照登記活動，建議移出作業看板以保持專注。';
    tag = '護照活動';
  }

  // 2. 判斷要放哪邊 (課程歸屬正規化)
  let suggestedCourse = course;
  if (course.includes('地球物理') || title.includes('地球物理') || title.includes('地電') || title.includes('地震')) {
    suggestedCourse = '通識地球物理';
  } else if (course.includes('統計') || title.includes('Statistics') || title.includes('統計')) {
    suggestedCourse = '統計學';
  } else if (course.includes('檔案結構') || course.includes('資料結構') || title.includes('資料結構') || title.includes('BST') || title.includes('樹')) {
    suggestedCourse = '資料與檔案結構';
  } else if (course.includes('作業系統') || title.includes('Operating') || title.includes('Synchronization') || title.includes('進程') || title.includes('CPU 排程')) {
    suggestedCourse = '作業系統';
  } else if (course.includes('經濟') || title.includes('Economics') || title.includes('無謂損失') || title.includes('DWL') || title.includes('供需')) {
    suggestedCourse = '經濟學';
  } else if (course.includes('邏輯') || title.includes('批判思考')) {
    suggestedCourse = '邏輯與批判思考';
  }

  return {
    ...hw,
    shouldInclude,
    suggestedCourse,
    isRemapped: suggestedCourse !== course,
    reason,
    tag
  };
}

export default function AssignmentsBoard({ 
  assignments = [], 
  courses: _courses = [],
  onCompleteAssignment, 
  onDeleteAssignment,
  onUpdateAssignments,
  onPreviewFile 
}) {
  const displayAssignments = useMemo(() => {
    return assignments && assignments.length > 0 ? assignments : (defaultTracker.assignments || []);
  }, [assignments]);

  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [scopeFilter, setScopeFilter] = useState('academic_only'); // 'academic_only' | 'all' | 'noise_only'
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiActiveTab, setAiActiveTab] = useState('noise'); // 'noise' | 'keep'
  const [selectedNoiseIds, setSelectedNoiseIds] = useState(new Set());

  // AI 審核分析結果
  const auditedList = useMemo(() => {
    return displayAssignments.map(auditAssignmentItem);
  }, [displayAssignments]);

  const academicAssignments = useMemo(() => {
    return auditedList.filter(a => a.shouldInclude);
  }, [auditedList]);

  const noiseAssignments = useMemo(() => {
    return auditedList.filter(a => !a.shouldInclude);
  }, [auditedList]);

  // 開啟 AI Modal 時，預設全選所有雜訊項目以供一鍵清理
  const handleOpenAiModal = () => {
    const ids = new Set(noiseAssignments.map(n => n.id));
    setSelectedNoiseIds(ids);
    setAiActiveTab(noiseAssignments.length > 0 ? 'noise' : 'keep');
    setIsAiModalOpen(true);
  };

  const toggleNoiseSelection = (id) => {
    setSelectedNoiseIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 一鍵套用 AI 建議：清理選定雜訊，並將正規課業標準化歸類
  const handleApplyAiRecommendations = () => {
    if (!onUpdateAssignments) return;
    
    // 1. 過濾掉被選中的雜訊
    const keptItems = auditedList.filter(item => !selectedNoiseIds.has(item.id));
    
    // 2. 套用標準科目歸屬
    const normalizedItems = keptItems.map(item => ({
      id: item.id,
      course: item.suggestedCourse || item.course,
      title: item.title,
      dueDate: item.dueDate,
      status: item.status,
      grade: item.grade,
      description: item.description,
      difficulty: item.difficulty || 'Medium',
      xp: item.xp || 500,
      promptFile: item.promptFile,
      deliverableFile: item.deliverableFile
    }));

    onUpdateAssignments(normalizedItems);
    setIsAiModalOpen(false);
  };

  // 根據 scopeFilter 與 selectedCourse 過濾清單
  const filteredAssignments = useMemo(() => {
    let list = auditedList;
    if (scopeFilter === 'academic_only') {
      list = academicAssignments;
    } else if (scopeFilter === 'noise_only') {
      list = noiseAssignments;
    }

    return list.filter(item => {
      return selectedCourse === 'ALL' || item.course === selectedCourse;
    });
  }, [auditedList, academicAssignments, noiseAssignments, scopeFilter, selectedCourse]);

  // 科目下拉 Pills
  const courseList = useMemo(() => {
    const set = new Set();
    const source = scopeFilter === 'academic_only' ? academicAssignments : auditedList;
    source.forEach(a => {
      if (a.course) set.add(a.course);
    });
    return ['ALL', ...Array.from(set)];
  }, [scopeFilter, academicAssignments, auditedList]);

  // 欄位分組
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

  // 單獨刪除作業處理函式
  const handleDeleteItem = (e, hw) => {
    e.stopPropagation();
    if (window.confirm(`確定要刪除作業「${hw.title}」嗎？\n此操作將從學業追蹤資料庫中完全移除。\n（所屬科目：${hw.course}）`)) {
      onDeleteAssignment?.(hw.id);
    }
  };

  const renderCard = (hw) => {
    const isCompleted = hw.status === 'completed';

    return (
      <div 
        key={hw.id} 
        className="assignment-card"
        style={{
          opacity: isCompleted ? 0.75 : 1,
          borderLeft: isCompleted ? '4px solid var(--gemini-emerald)' : '4px solid var(--gemini-blue)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
          <span className="badge-chip badge-blue">{hw.course}</span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {getDeadlineBadge(hw.dueDate, isCompleted)}
            {/* 需求 2: 刪除按鍵 */}
            <button
              className="btn btn-secondary btn-icon-circle"
              onClick={(e) => handleDeleteItem(e, hw)}
              title="刪除此項作業"
              style={{
                width: 26,
                height: 26,
                padding: 0,
                color: '#ef4444',
                borderColor: 'rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={12} />
            </button>
          </div>
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
      {/* Top Filter and Actions Bar */}
      <div className="filter-bar" style={{ flexWrap: 'wrap', gap: '10px' }}>
        {/* Scope Mode Selector */}
        <div className="nav-pills" style={{ padding: '3px' }}>
          <button
            className={`nav-pill-btn ${scopeFilter === 'academic_only' ? 'active' : ''}`}
            onClick={() => setScopeFilter('academic_only')}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            title="僅顯示由 AI 判定為正式學術課程之作業"
          >
            <BookOpen size={13} style={{ marginRight: 4 }} />
            正規課業 ({academicAssignments.length})
          </button>
          <button
            className={`nav-pill-btn ${scopeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setScopeFilter('all')}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            title="顯示所有爬取或自訂之項目"
          >
            <Layers size={13} style={{ marginRight: 4 }} />
            全部項目 ({displayAssignments.length})
          </button>
          {noiseAssignments.length > 0 && (
            <button
              className={`nav-pill-btn ${scopeFilter === 'noise_only' ? 'active' : ''}`}
              onClick={() => setScopeFilter('noise_only')}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', color: '#f59e0b' }}
              title="顯示被 AI 判定為行政填表、獎助或純公告之雜訊項目"
            >
              <AlertTriangle size={13} style={{ marginRight: 4 }} />
              雜訊項目 ({noiseAssignments.length})
            </button>
          )}
        </div>

        {/* Course Filter Pills */}
        <div className="nav-pills" style={{ padding: '3px', flexWrap: 'wrap' }}>
          {courseList.map(c => (
            <button
              key={c}
              className={`nav-pill-btn ${selectedCourse === c ? 'active' : ''}`}
              onClick={() => setSelectedCourse(c)}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              {c === 'ALL' ? '全科篩選' : c}
            </button>
          ))}
        </div>

        {/* View Mode & AI Button */}
        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
          {/* AI 審核按鈕 */}
          <button
            className="btn btn-primary"
            onClick={handleOpenAiModal}
            style={{ 
              fontSize: '0.8rem', 
              padding: '0.4rem 0.95rem',
              background: 'var(--gemini-gradient)',
              color: '#ffffff',
              boxShadow: 'var(--shadow-gemini)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="利用 AI 智慧判定作業真實性、過濾行政雜訊並重新規範科目歸屬"
          >
            <Bot size={15} />
            <span>AI 智慧審核與歸類</span>
            {noiseAssignments.length > 0 && (
              <span style={{
                background: '#ef4444',
                color: '#fff',
                borderRadius: '9999px',
                padding: '1px 6px',
                fontSize: '0.7rem',
                fontWeight: 800
              }}>
                {noiseAssignments.length}
              </span>
            )}
          </button>

          {/* 看板 / 清單切換 */}
          <div className="nav-pills" style={{ padding: '3px' }}>
            <button
              className={`nav-pill-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              看板
            </button>
            <button
              className={`nav-pill-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              清單
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
                    目前無符合條件之作業項目
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
              目前無符合條件之作業項目
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredAssignments.map(hw => (
                <div 
                  key={hw.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    background: 'var(--bg-app)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    gap: '15px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <span className="badge-chip badge-blue" style={{ flexShrink: 0 }}>{hw.course}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {hw.title}
                      </div>
                      {hw.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {hw.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    {getDeadlineBadge(hw.dueDate, hw.status === 'completed')}
                    
                    {!hw.status || hw.status !== 'completed' ? (
                      <button
                        className="btn btn-secondary"
                        onClick={() => onCompleteAssignment(hw.id)}
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.76rem', color: 'var(--gemini-emerald)', borderColor: 'var(--gemini-emerald)' }}
                      >
                        <CheckCircle2 size={13} /> 完成
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--gemini-emerald)', fontWeight: 700 }}>已達成</span>
                    )}

                    <button
                      className="btn btn-secondary btn-icon-circle"
                      onClick={(e) => handleDeleteItem(e, hw)}
                      title="刪除作業"
                      style={{
                        width: 28,
                        height: 28,
                        padding: 0,
                        color: '#ef4444',
                        borderColor: 'rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI 智慧作業審核與歸類彈窗 */}
      {isAiModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '820px', width: '92%', maxHeight: '86vh', display: 'flex', flexDirection: 'column', padding: '1.75rem' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'var(--gemini-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Bot size={16} />
                  </div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Gemini AI 智慧作業審核與歸類中心</h2>
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  AI 已自動診斷所有爬取與自訂之作業項目，精準辨別「課業作業」與「行政/補助填表雜訊」，並校正所屬科目。
                </p>
              </div>

              <button 
                className="btn btn-secondary btn-icon-circle"
                onClick={() => setIsAiModalOpen(false)}
                style={{ width: 32, height: 32, padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.25rem' }}>
              <div className="gemini-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>總追蹤項目</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{auditedList.length}</div>
              </div>
              <div className="gemini-card" style={{ padding: '0.85rem', textAlign: 'center', borderLeft: '4px solid var(--gemini-emerald)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--gemini-emerald)', fontWeight: 700, marginBottom: '4px' }}>正規課業 (建議保留)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gemini-emerald)' }}>{academicAssignments.length}</div>
              </div>
              <div className="gemini-card" style={{ padding: '0.85rem', textAlign: 'center', borderLeft: '4px solid #ef4444' }}>
                <div style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700, marginBottom: '4px' }}>行政雜訊 (建議過濾)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>{noiseAssignments.length}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="nav-pills" style={{ marginBottom: '1rem', padding: '3px' }}>
              <button
                className={`nav-pill-btn ${aiActiveTab === 'noise' ? 'active' : ''}`}
                onClick={() => setAiActiveTab('noise')}
                style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
              >
                ⚠️ 建議過濾移除 ({noiseAssignments.length})
              </button>
              <button
                className={`nav-pill-btn ${aiActiveTab === 'keep' ? 'active' : ''}`}
                onClick={() => setAiActiveTab('keep')}
                style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
              >
                ✅ 建議標準化保留 ({academicAssignments.length})
              </button>
            </div>

            {/* Tab Contents - Scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', minHeight: '220px', maxHeight: '340px', paddingRight: '4px' }}>
              {aiActiveTab === 'noise' ? (
                <div>
                  {noiseAssignments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--gemini-emerald)', fontWeight: 700 }}>
                      🎉 太棒了！目前無任何行政填表或成績發布等雜訊項目。
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px 6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>勾選欲立即刪除清理之項目：</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            className="btn-link"
                            onClick={() => setSelectedNoiseIds(new Set(noiseAssignments.map(n => n.id)))}
                            style={{ fontSize: '0.76rem', color: 'var(--gemini-blue)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            全部勾選
                          </button>
                          <button 
                            className="btn-link"
                            onClick={() => setSelectedNoiseIds(new Set())}
                            style={{ fontSize: '0.76rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            取消全選
                          </button>
                        </div>
                      </div>

                      {noiseAssignments.map(n => {
                        const isChecked = selectedNoiseIds.has(n.id);
                        return (
                          <div 
                            key={n.id}
                            onClick={() => toggleNoiseSelection(n.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              padding: '0.85rem',
                              borderRadius: '10px',
                              background: isChecked ? 'rgba(239, 68, 68, 0.06)' : 'var(--bg-app)',
                              border: isChecked ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--border-color)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => toggleNoiseSelection(n.id)}
                              style={{ marginTop: '3px', cursor: 'pointer' }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                                <span className="badge-chip badge-pink" style={{ fontSize: '0.7rem' }}>{n.tag}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>原所屬：{n.course}</span>
                              </div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '3px' }}>
                                {n.title}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                💡 判斷原因：{n.reason}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Keep & Normalize Tab */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '0 4px 6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    以下為符合中央大學學術標準之正規課堂作業，AI 已為其規劃標準歸屬科目：
                  </div>
                  {academicAssignments.map(item => (
                    <div 
                      key={item.id}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '10px',
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <span className="badge-chip badge-green" style={{ fontSize: '0.7rem' }}>正規課業</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.course}</span>
                          {item.isRemapped && (
                            <>
                              <ArrowRight size={11} color="var(--gemini-blue)" />
                              <span className="badge-chip badge-blue" style={{ fontSize: '0.7rem' }}>標準歸屬：{item.suggestedCourse}</span>
                            </>
                          )}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          {item.title}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.76rem', color: 'var(--gemini-purple)', fontWeight: 700 }}>+{item.xp || 500} XP</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{item.dueDate ? `期限: ${item.dueDate}` : '進行中'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {selectedNoiseIds.size > 0 ? (
                  <span>已選取 <strong style={{ color: '#ef4444' }}>{selectedNoiseIds.size}</strong> 項雜訊待清理</span>
                ) : (
                  <span>將保留所有正規課業並規範科目</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsAiModalOpen(false)}
                  style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem' }}
                >
                  取消
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleApplyAiRecommendations}
                  style={{ 
                    fontSize: '0.85rem', 
                    padding: '0.45rem 1.25rem',
                    background: 'var(--gemini-gradient)',
                    color: '#fff',
                    boxShadow: 'var(--shadow-gemini)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={14} />
                  <span>⚡ 一鍵套用 AI 建議（清理雜訊並自動歸類）</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
