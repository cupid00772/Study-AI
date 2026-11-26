import { useState, useEffect, useRef } from 'react';
import { Plus, Pin, Trash2, CheckCircle2, Circle, Palette, ExternalLink, Monitor, X } from 'lucide-react';
import { pushCloudDoc, SYNC_KEYS } from '../services/cloudSyncService';

const NOTE_COLORS = [
  { id: 'yellow', name: '晨曦黃', bg: 'rgba(254, 249, 195, 0.85)', border: '#fde047', text: '#713f12' },
  { id: 'pink', name: '櫻花粉', bg: 'rgba(255, 228, 230, 0.85)', border: '#fda4af', text: '#881337' },
  { id: 'green', name: '薄荷綠', bg: 'rgba(220, 252, 231, 0.85)', border: '#86efac', text: '#14532d' },
  { id: 'blue', name: '天空藍', bg: 'rgba(224, 242, 254, 0.85)', border: '#7dd3fc', text: '#0c4a6e' },
  { id: 'purple', name: '薰衣草', bg: 'rgba(243, 232, 255, 0.85)', border: '#d8b4fe', text: '#581c87' }
];

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    title: '期中考重點提醒 🎯',
    content: '1. 經濟學 CH8 租稅無謂損失圖形 (DWL) 要熟記面積計算。\n2. 資料結構樹的遞迴遍歷：前序、中序、後序代碼熟練。',
    color: 'yellow',
    isPinned: true,
    todos: [
      { id: 't1', text: '背熟 DS 54 核心速記卡', completed: true },
      { id: 't2', text: '完成計概第 5 回模擬考檢討', completed: false }
    ],
    updatedAt: '今天'
  },
  {
    id: 'note-2',
    title: '轉校手續待辦 📝',
    content: '下週二前去找中央資管系辦主任與導師取得轉校同意書簽名，記得帶信封！',
    color: 'pink',
    isPinned: false,
    todos: [
      { id: 't3', text: '印出審查資料封面', completed: true },
      { id: 't4', text: '信封貼好封面送註冊組', completed: false }
    ],
    updatedAt: '昨天'
  }
];

export default function StickyNotesBoard({ onRequireUnlock, showToast }) {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('wt_sticky_notes');
      return saved ? JSON.parse(saved) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  });
  const [deletedIds, setDeletedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('wt_sticky_notes_deleted');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeColor, setActiveColor] = useState('yellow');
  const [activeStickyIds, setActiveStickyIds] = useState([]);
  const skipNextCloudPushRef = useRef(true);

  useEffect(() => {
    try {
      localStorage.setItem('wt_sticky_notes', JSON.stringify(notes));
      localStorage.setItem('wt_sticky_notes_deleted', JSON.stringify(deletedIds));
    } catch {}
    if (skipNextCloudPushRef.current) {
      skipNextCloudPushRef.current = false;
      return;
    }
    pushCloudDoc(SYNC_KEYS.STICKY_NOTES, {
      notes,
      deletedIds,
      updatedAt: new Date().toISOString(),
    }).then((res) => {
      if (res?.authRequired) onRequireUnlock?.();
    });
  }, [notes, deletedIds, onRequireUnlock]);

  // 接收來自雲端 Realtime 或啟動合併的便條更新
  useEffect(() => {
    const onCloudUpdated = (e) => {
      const detail = e.detail;
      if (detail && Array.isArray(detail.notes)) {
        skipNextCloudPushRef.current = true;
        setNotes(detail.notes);
        if (Array.isArray(detail.deletedIds)) setDeletedIds(detail.deletedIds);
      }
    };
    window.addEventListener('tc-cloud-sticky-updated', onCloudUpdated);
    return () => window.removeEventListener('tc-cloud-sticky-updated', onCloudUpdated);
  }, []);

  // 監聽並獲取目前已在桌面開啟的便條紙 IDs
  useEffect(() => {
    if (window.electronAPI?.getActiveStickyIds) {
      window.electronAPI.getActiveStickyIds().then(ids => {
        if (Array.isArray(ids)) setActiveStickyIds(ids);
      });
    }

    if (window.electronAPI?.onActiveStickiesUpdated) {
      const unsubscribe = window.electronAPI.onActiveStickiesUpdated((ids) => {
        if (Array.isArray(ids)) setActiveStickyIds(ids);
      });
      return unsubscribe;
    }
  }, []);

  // 自動清理不存在於本機的孤兒幽靈便條紙 ID
  useEffect(() => {
    if (activeStickyIds.length > 0 && notes.length > 0) {
      const validIds = new Set(notes.map(n => n.id));
      activeStickyIds.forEach(id => {
        if (!validIds.has(id) && window.electronAPI?.deleteStickyPosition) {
          window.electronAPI.deleteStickyPosition(id);
        }
      });
    }
  }, [activeStickyIds, notes]);

  // 監聽來自獨立桌面視窗的變更
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'wt_sticky_notes' && e.newValue) {
        try {
          setNotes(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleAddNote = (shouldPopOut = true) => {
    const nowIso = new Date().toISOString();
    const newNote = {
      id: `note-${Date.now()}`,
      title: '新便條紙 📌',
      content: '點擊此處輸入備忘內容...',
      color: activeColor,
      isPinned: false,
      todos: [],
      updatedAt: nowIso
    };
    setNotes(prev => {
      const updated = [newNote, ...prev];
      try {
        localStorage.setItem('wt_sticky_notes', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 若在 Electron 環境中，直接在桌面以獨立視窗彈出顯示
    if (shouldPopOut && window.electronAPI?.createStickyWindow) {
      setTimeout(() => {
        window.electronAPI.createStickyWindow(newNote.id);
      }, 50);
    }
  };

  const handleTogglePopOut = (noteId) => {
    if (!window.electronAPI) return;
    if (activeStickyIds.includes(noteId)) {
      if (window.electronAPI.closeStickyWindow) {
        window.electronAPI.closeStickyWindow(noteId);
      }
    } else {
      if (window.electronAPI.createStickyWindow) {
        window.electronAPI.createStickyWindow(noteId);
      }
    }
  };

  const handlePopOutAll = () => {
    if (window.electronAPI?.createStickyWindow) {
      notes.forEach((note, idx) => {
        setTimeout(() => {
          window.electronAPI.createStickyWindow(note.id);
        }, idx * 100);
      });
    }
  };

  const handleCloseAllPopOut = () => {
    if (window.electronAPI?.closeStickyWindow) {
      activeStickyIds.forEach(id => {
        window.electronAPI.closeStickyWindow(id);
      });
    }
  };

  const handleUpdateNote = (id, field, value) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, [field]: value, updatedAt: new Date().toISOString() } : n));
  };

  const handleDeleteNote = (id) => {
    const target = notes.find(n => n.id === id);
    setNotes(prev => prev.filter(n => n.id !== id));
    setDeletedIds(prev => (prev.includes(id) ? prev : [...prev, id].slice(-200)));
    if (window.electronAPI?.deleteStickyPosition) {
      window.electronAPI.deleteStickyPosition(id);
    } else if (window.electronAPI?.closeStickyWindow) {
      window.electronAPI.closeStickyWindow(id);
    }
    if (target && showToast) {
      showToast(`已刪除便條「${target.title || '未命名便條'}」`, {
        actionLabel: '復原',
        onAction: () => {
          setNotes(prev => (prev.some(n => n.id === target.id) ? prev : [{ ...target, updatedAt: new Date().toISOString() }, ...prev]));
          setDeletedIds(prev => prev.filter(did => did !== target.id));
          showToast('已復原便條', { tone: 'success' });
        },
      });
    }
  };

  const handleTogglePin = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() } : n));
  };

  const handleToggleTodo = (noteId, todoId) => {
    setNotes(prev => prev.map(n => {
      if (n.id !== noteId) return n;
      return {
        ...n,
        updatedAt: new Date().toISOString(),
        todos: n.todos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)
      };
    }));
  };

  const handleAddTodo = (noteId, text) => {
    if (!text.trim()) return;
    setNotes(prev => prev.map(n => {
      if (n.id !== noteId) return n;
      return {
        ...n,
        updatedAt: new Date().toISOString(),
        todos: [...(n.todos || []), { id: `t-${Date.now()}`, text: text.trim(), completed: false }]
      };
    }));
  };

  const handleDeleteTodo = (noteId, todoId) => {
    setNotes(prev => prev.map(n => {
      if (n.id !== noteId) return n;
      return {
        ...n,
        updatedAt: new Date().toISOString(),
        todos: (n.todos || []).filter(t => t.id !== todoId)
      };
    }));
  };

  // 釘選的便條排在前面
  const sortedNotes = [...notes].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="assignments-container">
      {/* Top Toolbar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            type="button"
            className="btn btn-primary"
            onClick={() => handleAddNote(true)}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
          >
            <Plus size={16} /> {window.electronAPI ? '新增桌面便條紙' : '新增雲端便條'}
          </button>

          {window.electronAPI && (
            <>
              <button
                className="btn btn-secondary"
                onClick={handlePopOutAll}
                style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="將所有便條紙展開在桌面上（獨立透明視窗）"
              >
                <Monitor size={14} /> 全部釘在桌面
              </button>
              {activeStickyIds.length > 0 && (
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseAllPopOut}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}
                  title="將桌面懸浮的便條紙全部收回"
                >
                  <X size={14} /> 全部收回桌面
                </button>
              )}
            </>
          )}

          {/* Color Palette Selector */}
          <div className="nav-pills" style={{ padding: '4px 8px', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Palette size={13} /> 預設色彩：
            </span>
            {NOTE_COLORS.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveColor(c.id)}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: c.bg,
                  border: `2px solid ${activeColor === c.id ? 'var(--gemini-purple)' : c.border}`,
                  cursor: 'pointer',
                  transform: activeColor === c.id ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.15s'
                }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          {window.electronAPI ? (
            <>
              <span>📌 共有 {notes.length} 張便條紙（{activeStickyIds.length} 張於桌面顯示中）</span>
              <span style={{ opacity: 0.6 }}>• 變更自動同步至雲端並於重啟還原桌面位置</span>
            </>
          ) : (
            <span>📌 共有 {notes.length} 張雲端同步便條紙</span>
          )}
        </div>
      </div>

      {/* Sticky Notes Grid */}
      <div className="vault-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {sortedNotes.map(note => {
          const colorCfg = NOTE_COLORS.find(c => c.id === note.color) || NOTE_COLORS[0];

          return (
            <div 
              key={note.id}
              className="sticky-note-card"
              style={{
                background: colorCfg.bg,
                borderColor: colorCfg.border,
                color: colorCfg.text,
                boxShadow: note.isPinned ? '0 10px 25px rgba(0,0,0,0.12)' : 'var(--shadow-sm)',
                transform: note.isPinned ? 'translateY(-2px)' : 'none'
              }}
            >
              {/* Note Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => handleTogglePin(note.id)}
                    style={{
                      background: note.isPinned ? colorCfg.border : 'transparent',
                      border: 'none',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: colorCfg.text
                    }}
                    title={note.isPinned ? '取消釘選' : '釘選在最前'}
                  >
                    <Pin size={14} style={{ transform: note.isPinned ? 'rotate(45deg)' : 'none' }} />
                  </button>

                  {/* Change Note Color */}
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }} role="group" aria-label="切換便條顏色">
                    {NOTE_COLORS.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        className="sticky-color-dot"
                        onClick={() => handleUpdateNote(note.id, 'color', c.id)}
                        aria-label={`切換為${c.name}`}
                        aria-pressed={note.color === c.id}
                        title={c.name}
                        style={{
                          background: c.border,
                          borderColor: note.color === c.id ? colorCfg.text : 'transparent',
                          opacity: note.color === c.id ? 1 : 0.5,
                          transform: note.color === c.id ? 'scale(1.15)' : 'scale(1)'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {window.electronAPI && (
                    <button
                      type="button"
                      onClick={() => handleTogglePopOut(note.id)}
                      style={{
                        background: activeStickyIds.includes(note.id) ? 'rgba(34, 197, 94, 0.18)' : 'rgba(0, 0, 0, 0.05)',
                        border: `1px solid ${activeStickyIds.includes(note.id) ? '#22c55e' : colorCfg.border}`,
                        borderRadius: 'var(--radius-pill)',
                        cursor: 'pointer',
                        color: activeStickyIds.includes(note.id) ? '#15803d' : colorCfg.text,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s'
                      }}
                      title={activeStickyIds.includes(note.id) ? '點擊將此便條紙從桌面收回' : '釘選至桌面（獨立透明視窗）'}
                    >
                      <ExternalLink size={12} />
                      <span>{activeStickyIds.includes(note.id) ? '桌面顯示中 (點擊收回)' : '釘到桌面'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: colorCfg.text,
                      opacity: 0.72,
                      padding: '4px'
                    }}
                    title="刪除便條（可於 5 秒內復原）"
                    aria-label={`刪除便條「${note.title}」`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Editable Title */}
              <input
                type="text"
                className="sticky-note-title-input"
                value={note.title}
                onChange={(e) => handleUpdateNote(note.id, 'title', e.target.value)}
                style={{ color: colorCfg.text }}
                placeholder="便條標題..."
                aria-label="便條標題"
              />

              {/* Editable Content */}
              <textarea
                className="sticky-note-content-input"
                value={note.content}
                onChange={(e) => handleUpdateNote(note.id, 'content', e.target.value)}
                style={{ color: colorCfg.text }}
                placeholder="點擊輸入內容..."
                aria-label="便條內容"
                rows={4}
              />

              {/* Checklists inside Note */}
              {note.todos && note.todos.length > 0 && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {note.todos.map(t => (
                    <div 
                      key={t.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        gap: '6px'
                      }}
                    >
                      <button
                        type="button"
                        className="sticky-todo-row-btn"
                        onClick={() => handleToggleTodo(note.id, t.id)}
                        aria-pressed={t.completed}
                        style={{
                          textDecoration: t.completed ? 'line-through' : 'none',
                          opacity: t.completed ? 0.65 : 1
                        }}
                      >
                        {t.completed ? <CheckCircle2 size={15} style={{ flexShrink: 0 }} /> : <Circle size={15} style={{ flexShrink: 0 }} />}
                        <span>{t.text}</span>
                      </button>
                      <button
                        type="button"
                        className="sticky-todo-del-btn"
                        onClick={() => handleDeleteTodo(note.id, t.id)}
                        aria-label={`刪除待辦「${t.text}」`}
                        title="移除此項"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Add Todo Input */}
              <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: `1px dashed ${colorCfg.border}` }}>
                <input
                  type="text"
                  placeholder="+ 新增待辦事項..."
                  aria-label="新增便條待辦事項"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTodo(note.id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    color: colorCfg.text,
                    opacity: 0.85
                  }}
                />
              </div>

              {/* Footer Timestamp */}
              <div style={{ marginTop: '8px', fontSize: '0.72rem', opacity: 0.6, textAlign: 'right' }}>
                更新於：{note.updatedAt && /^\d{4}-\d{2}-\d{2}T/.test(note.updatedAt)
                  ? new Date(note.updatedAt).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : (note.updatedAt || '剛剛')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
