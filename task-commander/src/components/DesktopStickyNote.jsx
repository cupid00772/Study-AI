import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Circle, X, Trash2 } from 'lucide-react';
import PencilStrikeText from './PencilStrikeText';

// 100% opaque curated palettes for Light & Dark modes (zero semi-transparent white corner halos)
const NOTE_COLORS = [
  {
    id: 'yellow',
    name: '晨曦黃',
    dot: '#eab308',
    light: { bg: '#fef9c3', headerBg: '#fef3a6', border: '#e5cf52', divider: '#ead978', text: '#422006', muted: '#713f12', btnBg: '#f5e794' },
    dark: { bg: '#252116', headerBg: '#2e281a', border: '#544621', divider: '#3d341d', text: '#fef3c7', muted: '#d6be80', btnBg: '#3a321d' },
  },
  {
    id: 'pink',
    name: '櫻花粉',
    dot: '#f43f5e',
    light: { bg: '#ffe4e6', headerBg: '#ffd2d7', border: '#f5a3af', divider: '#f4bec6', text: '#4c0519', muted: '#881337', btnBg: '#fcc5cc' },
    dark: { bg: '#26181d', headerBg: '#301d24', border: '#5e2c3a', divider: '#42232d', text: '#ffe4e6', muted: '#e5a3b3', btnBg: '#3f232c' },
  },
  {
    id: 'green',
    name: '薄荷綠',
    dot: '#10b981',
    light: { bg: '#dcfce7', headerBg: '#c6f6d5', border: '#7cd99f', divider: '#a6e9be', text: '#052e16', muted: '#166534', btnBg: '#b8f0cb' },
    dark: { bg: '#15231c', headerBg: '#1b2d24', border: '#275740', divider: '#223e30', text: '#d1fae5', muted: '#8fd4b2', btnBg: '#20392c' },
  },
  {
    id: 'blue',
    name: '天空藍',
    dot: '#0ea5e9',
    light: { bg: '#e0f2fe', headerBg: '#c8e8fc', border: '#7bc6f2', divider: '#abd9f5', text: '#082f49', muted: '#075985', btnBg: '#bae0fa' },
    dark: { bg: '#141f2b', headerBg: '#1a2838', border: '#264d70', divider: '#20384f', text: '#e0f2fe', muted: '#93c5e6', btnBg: '#1e344a' },
  },
  {
    id: 'purple',
    name: '薰衣草',
    dot: '#8b5cf6',
    light: { bg: '#f3e8ff', headerBg: '#e7d4ff', border: '#c59ef7', divider: '#d8bdf9', text: '#2e1065', muted: '#5b21b6', btnBg: '#dec5fd' },
    dark: { bg: '#1f192b', headerBg: '#282038', border: '#4c3870', divider: '#382b52', text: '#f3e8ff', muted: '#c4b0e6', btnBg: '#33274a' },
  },
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
      { id: 't2', text: '完成計概第 5 回模擬考檢討', completed: false },
    ],
    updatedAt: '今天',
  },
  {
    id: 'note-2',
    title: '轉校手續待辦 📝',
    content: '下週二前去找中央資管系辦主任與導師取得轉校同意書簽名，記得帶信封！',
    color: 'pink',
    isPinned: false,
    todos: [
      { id: 't3', text: '印出審查資料封面', completed: true },
      { id: 't4', text: '信封貼好封面送註冊組', completed: false },
    ],
    updatedAt: '昨天',
  },
];

function getNote(noteId) {
  if (!noteId) return null;
  try {
    const saved = localStorage.getItem('wt_sticky_notes');
    if (saved) {
      const notes = JSON.parse(saved);
      const found = notes.find((n) => n.id === noteId);
      if (found) return found;
    }
  } catch {}

  const defaultFound = DEFAULT_NOTES.find((n) => n.id === noteId);
  if (defaultFound) return defaultFound;

  return {
    id: noteId,
    title: '新便條紙 📌',
    content: '點擊此處輸入備忘內容...',
    color: 'yellow',
    isPinned: true,
    todos: [],
    updatedAt: '剛剛',
  };
}

function saveNote(noteId, updatedNote) {
  try {
    let notes = [];
    const saved = localStorage.getItem('wt_sticky_notes');
    if (saved) {
      notes = JSON.parse(saved);
    }
    const stamped = { ...updatedNote, updatedAt: new Date().toISOString() };
    const idx = notes.findIndex((n) => n.id === noteId);
    if (idx >= 0) {
      notes[idx] = stamped;
    } else {
      notes.push(stamped);
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

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
    setNote((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value, updatedAt: '剛剛' };
      saveNote(noteId, updated);
      return updated;
    });
  }, [noteId]);

  const handleToggleTodo = useCallback((todoId) => {
    setNote((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        todos: (prev.todos || []).map((t) => (t.id === todoId ? { ...t, completed: !t.completed } : t)),
        updatedAt: '剛剛',
      };
      saveNote(noteId, updated);
      return updated;
    });
  }, [noteId]);

  const handleAddTodo = useCallback((text) => {
    if (!text.trim()) return;
    setNote((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        todos: [...(prev.todos || []), { id: `t-${Date.now()}`, text: text.trim(), completed: false }],
        updatedAt: '剛剛',
      };
      saveNote(noteId, updated);
      return updated;
    });
  }, [noteId]);

  const handleDeleteTodo = useCallback((todoId) => {
    setNote((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        todos: (prev.todos || []).filter((t) => t.id !== todoId),
        updatedAt: '剛剛',
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
          const remaining = notes.filter((n) => n.id !== noteId);
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
      <div className="desktop-widget-root">
        <div
          className="desktop-widget-shell"
          style={{
            background: isDark ? '#161922' : '#ffffff',
            borderRadius: '16px',
            border: `1px solid ${isDark ? '#272d3f' : '#e2e8f0'}`,
            color: isDark ? '#94a3b8' : '#64748b',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.88rem',
          }}
        >
          找不到便條紙
        </div>
      </div>
    );
  }

  const colorGroup = NOTE_COLORS.find((c) => c.id === note.color) || NOTE_COLORS[0];
  const theme = isDark ? colorGroup.dark : colorGroup.light;

  const formattedTime = note.updatedAt && /^\d{4}-\d{2}-\d{2}T/.test(note.updatedAt)
    ? new Date(note.updatedAt).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : (note.updatedAt || '剛剛');

  return (
    <div className="desktop-widget-root">
      <div
        className="desktop-widget-shell"
        style={{
          background: theme.bg,
          borderRadius: '16px',
          border: `1px solid ${theme.border}`,
          color: theme.text,
        }}
      >
        {/* Drag Handle Header */}
        <div
          className="desktop-widget-header"
          style={{
            background: theme.headerBg,
            borderBottom: `1px solid ${theme.divider}`,
            padding: '8px 11px 8px 13px',
            minHeight: '36px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none' }}>
            <div style={{ display: 'flex', gap: '6px', WebkitAppRegion: 'no-drag' }}>
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => updateField('color', c.id)}
                  style={{
                    width: '13px',
                    height: '13px',
                    padding: 0,
                    borderRadius: '50%',
                    background: c.dot,
                    cursor: 'pointer',
                    opacity: note.color === c.id ? 1 : 0.45,
                    transform: note.color === c.id ? 'scale(1.18)' : 'scale(1)',
                    border: note.color === c.id ? `2px solid ${theme.text}` : '1px solid rgba(0,0,0,0.18)',
                    transition: 'transform 0.16s ease, opacity 0.16s ease',
                  }}
                  title={c.name}
                  aria-label={`切換為${c.name}`}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', WebkitAppRegion: 'no-drag' }}>
            <button
              type="button"
              className="desktop-widget-close-btn"
              onClick={handleDelete}
              style={{ background: theme.btnBg, color: theme.muted, border: 'none' }}
              title="刪除便條紙"
            >
              <Trash2 size={12} />
            </button>
            <button
              type="button"
              className="desktop-widget-close-btn"
              onClick={handleClose}
              style={{ background: theme.btnBg, color: theme.muted, border: 'none' }}
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
          padding: '12px 15px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <input
            type="text"
            value={note.title}
            onChange={(e) => updateField('title', e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.98rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
              lineHeight: 1.4,
              color: theme.text,
              width: '100%',
              padding: '2px 0',
              fontFamily: 'inherit',
            }}
            placeholder="便條標題..."
          />

          <textarea
            value={note.content}
            onChange={(e) => updateField('content', e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.86rem',
              fontWeight: 400,
              letterSpacing: '0.02em',
              color: theme.text,
              width: '100%',
              resize: 'none',
              lineHeight: 1.7,
              flex: 1,
              minHeight: '64px',
              padding: '2px 0',
              fontFamily: 'inherit',
            }}
            placeholder="輸入備忘內容..."
          />

          {/* Todos with Pencil Strike-through */}
          {note.todos && note.todos.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              borderTop: `1px dashed ${theme.divider}`,
              paddingTop: '9px',
              marginTop: '2px',
            }}>
              {note.todos.map((t) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div
                    onClick={() => handleToggleTodo(t.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      cursor: 'pointer',
                      flex: 1,
                      minWidth: 0,
                      fontSize: '0.84rem',
                      lineHeight: 1.5,
                      letterSpacing: '0.02em',
                      color: t.completed ? theme.muted : theme.text,
                    }}
                  >
                    {t.completed ? (
                      <CheckCircle2 size={15} style={{ flexShrink: 0, opacity: 0.75 }} />
                    ) : (
                      <Circle size={15} style={{ flexShrink: 0, opacity: 0.7 }} />
                    )}
                    <PencilStrikeText active={Boolean(t.completed)} strokeColor={theme.muted}>
                      {t.text}
                    </PencilStrikeText>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteTodo(t.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: theme.muted,
                      cursor: 'pointer',
                      opacity: 0.55,
                      fontSize: '0.74rem',
                      padding: '2px 4px',
                      flexShrink: 0,
                    }}
                    title="移除待辦"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Todo */}
          <div style={{ borderTop: `1px dashed ${theme.divider}`, paddingTop: '7px', marginTop: 'auto' }}>
            <input
              type="text"
              placeholder="+ 新增待辦項目（按 Enter）..."
              onKeyDown={(e) => {
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
                fontSize: '0.82rem',
                letterSpacing: '0.02em',
                color: theme.muted,
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '5px 15px 8px',
          fontSize: '0.72rem',
          color: theme.muted,
          opacity: 0.72,
          textAlign: 'right',
          flexShrink: 0,
          letterSpacing: '0.02em',
        }}>
          更新於：{formattedTime}
        </div>
      </div>
    </div>
  );
}
