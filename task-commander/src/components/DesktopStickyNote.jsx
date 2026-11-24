import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Circle, X, Trash2 } from 'lucide-react';

const NOTE_COLORS = [
  { id: 'yellow', name: '晨曦黃', bg: 'rgba(254, 249, 195, 0.95)', border: '#fde047', text: '#713f12' },
  { id: 'pink', name: '櫻花粉', bg: 'rgba(255, 228, 230, 0.95)', border: '#fda4af', text: '#881337' },
  { id: 'green', name: '薄荷綠', bg: 'rgba(220, 252, 231, 0.95)', border: '#86efac', text: '#14532d' },
  { id: 'blue', name: '天空藍', bg: 'rgba(224, 242, 254, 0.95)', border: '#7dd3fc', text: '#0c4a6e' },
  { id: 'purple', name: '薰衣草', bg: 'rgba(243, 232, 255, 0.95)', border: '#d8b4fe', text: '#581c87' }
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

function getNote(noteId) {
  if (!noteId) return null;
  try {
    const saved = localStorage.getItem('wt_sticky_notes');
    if (saved) {
      const notes = JSON.parse(saved);
      const found = notes.find(n => n.id === noteId);
      if (found) return found;
    }
  } catch {}

  const defaultFound = DEFAULT_NOTES.find(n => n.id === noteId);
  if (defaultFound) return defaultFound;

  return {
    id: noteId,
    title: '新便條紙 📌',
    content: '點擊此處輸入備忘內容...',
    color: 'yellow',
    isPinned: true,
    todos: [],
    updatedAt: '剛剛'
  };
}

function saveNote(noteId, updatedNote) {
  try {
    let notes = [];
    const saved = localStorage.getItem('wt_sticky_notes');
    if (saved) {
      notes = JSON.parse(saved);
    }
    const idx = notes.findIndex(n => n.id === noteId);
    if (idx >= 0) {
      notes[idx] = { ...updatedNote, updatedAt: '剛剛' };
    } else {
      notes.push({ ...updatedNote, updatedAt: '剛剛' });
    }
    localStorage.setItem('wt_sticky_notes', JSON.stringify(notes));
  } catch {}
}

export default function DesktopStickyNote() {
  const params = new URLSearchParams(window.location.search);
  const noteId = params.get('noteId');

  const [note, setNote] = useState(() => getNote(noteId));
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('wt_theme') === 'dark'; } catch { return false; }
  });

  // Sync from other windows via storage event
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'wt_sticky_notes') {
        const updated = getNote(noteId);
        if (updated) setNote(updated);
      }
      if (e.key === 'wt_theme') {
        setIsDark(e.newValue === 'dark');
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [noteId]);

  const updateField = useCallback((field, value) => {
    setNote(prev => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value, updatedAt: '剛剛' };
      saveNote(noteId, updated);
      return updated;
    });
  }, [noteId]);

  const handleToggleTodo = useCallback((todoId) => {
    setNote(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        todos: prev.todos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t),
        updatedAt: '剛剛'
      };
      saveNote(noteId, updated);
      return updated;
    });
  }, [noteId]);

  const handleAddTodo = useCallback((text) => {
    if (!text.trim()) return;
    setNote(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        todos: [...(prev.todos || []), { id: `t-${Date.now()}`, text: text.trim(), completed: false }],
        updatedAt: '剛剛'
      };
      saveNote(noteId, updated);
      return updated;
    });
  }, [noteId]);

  const handleDeleteTodo = useCallback((todoId) => {
    setNote(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        todos: prev.todos.filter(t => t.id !== todoId),
        updatedAt: '剛剛'
      };
      saveNote(noteId, updated);
      return updated;
    });
  }, [noteId]);

  const handleClose = () => {
    if (window.electronAPI?.closeStickyWindow) {
      window.electronAPI.closeStickyWindow(noteId);
    } else if (window.electronAPI?.closeCurrentWindow) {
      window.electronAPI.closeCurrentWindow();
    } else {
      window.close();
    }
  };

  const handleDelete = () => {
    if (window.confirm('確定要從桌面與資料庫中刪除這張便條紙嗎？')) {
      try {
        const saved = localStorage.getItem('wt_sticky_notes');
        if (saved) {
          const notes = JSON.parse(saved);
          const remaining = notes.filter(n => n.id !== noteId);
          localStorage.setItem('wt_sticky_notes', JSON.stringify(remaining));
        }
      } catch {}
      if (window.electronAPI?.deleteStickyPosition) {
        window.electronAPI.deleteStickyPosition(noteId);
      } else {
        handleClose();
      }
    }
  };

  if (!note) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.9)', borderRadius: '14px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#666', fontSize: '0.9rem'
      }}>
        找不到便條紙 😅
      </div>
    );
  }

  const colorCfg = NOTE_COLORS.find(c => c.id === note.color) || NOTE_COLORS[0];
  const darkOverlay = isDark ? 'rgba(0,0,0,0.15)' : 'transparent';

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: 'transparent',
      fontFamily: "'Segoe UI', 'Noto Sans TC', system-ui, -apple-system, sans-serif",
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        background: colorCfg.bg,
        backgroundImage: `linear-gradient(${darkOverlay}, ${darkOverlay})`,
        borderRadius: '14px',
        border: `2px solid ${colorCfg.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: colorCfg.text,
      }}>
        {/* Drag Handle + Close */}
        <div style={{
          WebkitAppRegion: 'drag',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px 4px 14px',
          borderBottom: `1px solid ${colorCfg.border}`,
          minHeight: '32px',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.72rem', opacity: 0.8, userSelect: 'none',
          }}>
            <span>📌</span>
            {/* Color switcher dots */}
            <div style={{ display: 'flex', gap: '4px', WebkitAppRegion: 'no-drag' }}>
              {NOTE_COLORS.map(c => (
                <div
                  key={c.id}
                  onClick={() => updateField('color', c.id)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: c.border,
                    cursor: 'pointer',
                    opacity: note.color === c.id ? 1 : 0.45,
                    transform: note.color === c.id ? 'scale(1.2)' : 'none',
                    border: '1px solid rgba(0,0,0,0.15)',
                    transition: 'transform 0.15s, opacity 0.15s'
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', WebkitAppRegion: 'no-drag' }}>
            <button
              onClick={handleDelete}
              style={{
                background: 'rgba(0,0,0,0.06)',
                border: 'none',
                borderRadius: '50%',
                width: '22px', height: '22px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: colorCfg.text,
                opacity: 0.6,
                transition: 'opacity 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
              title="刪除便條紙"
            >
              <Trash2 size={12} />
            </button>
            <button
              onClick={handleClose}
              style={{
                background: 'rgba(0,0,0,0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '22px', height: '22px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: colorCfg.text,
                opacity: 0.6,
                transition: 'opacity 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'rgba(220,38,38,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.background = 'rgba(0,0,0,0.08)'; }}
              title="收合至主程式（保留便條內容）"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 14px 8px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {/* Title */}
          <input
            type="text"
            value={note.title}
            onChange={e => updateField('title', e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: colorCfg.text,
              width: '100%',
              padding: '2px 0',
            }}
            placeholder="便條標題..."
          />

          {/* Content */}
          <textarea
            value={note.content}
            onChange={e => updateField('content', e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.82rem',
              color: colorCfg.text,
              width: '100%',
              resize: 'none',
              lineHeight: 1.6,
              flex: 1,
              minHeight: '60px',
              padding: '2px 0',
              fontFamily: 'inherit',
            }}
            placeholder="輸入內容..."
          />

          {/* Todos */}
          {note.todos && note.todos.length > 0 && (
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '3px',
              borderTop: `1px dashed ${colorCfg.border}`,
              paddingTop: '6px', marginTop: '2px',
            }}>
              {note.todos.map(t => (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontSize: '0.8rem', gap: '6px',
                }}>
                  <div
                    onClick={() => handleToggleTodo(t.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      cursor: 'pointer',
                      textDecoration: t.completed ? 'line-through' : 'none',
                      opacity: t.completed ? 0.55 : 1,
                      flex: 1,
                    }}
                  >
                    {t.completed ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                    <span>{t.text}</span>
                  </div>
                  <span
                    onClick={() => handleDeleteTodo(t.id)}
                    style={{ cursor: 'pointer', opacity: 0.35, fontSize: '0.7rem', flexShrink: 0 }}
                  >✕</span>
                </div>
              ))}
            </div>
          )}

          {/* Add Todo */}
          <div style={{
            borderTop: `1px dashed ${colorCfg.border}`,
            paddingTop: '5px', marginTop: 'auto',
          }}>
            <input
              type="text"
              placeholder="+ 新增待辦..."
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleAddTodo(e.target.value);
                  e.target.value = '';
                }
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.78rem',
                color: colorCfg.text,
                opacity: 0.7,
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '4px 14px 6px',
          fontSize: '0.68rem',
          opacity: 0.45,
          textAlign: 'right',
          flexShrink: 0,
        }}>
          更新於：{note.updatedAt}
        </div>
      </div>
    </div>
  );
}
