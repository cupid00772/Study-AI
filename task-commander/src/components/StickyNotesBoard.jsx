import { useState, useEffect } from 'react';
import { Plus, Pin, Trash2, CheckCircle2, Circle, Palette } from 'lucide-react';

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

export default function StickyNotesBoard() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('wt_sticky_notes');
      return saved ? JSON.parse(saved) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  });

  const [activeColor, setActiveColor] = useState('yellow');

  useEffect(() => {
    try {
      localStorage.setItem('wt_sticky_notes', JSON.stringify(notes));
    } catch {}
  }, [notes]);

  const handleAddNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: '新便條紙 📌',
      content: '點擊此處輸入備忘內容...',
      color: activeColor,
      isPinned: false,
      todos: [],
      updatedAt: '剛剛'
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleUpdateNote = (id, field, value) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, [field]: value, updatedAt: '剛剛' } : n));
  };

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleTogglePin = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  const handleToggleTodo = (noteId, todoId) => {
    setNotes(prev => prev.map(n => {
      if (n.id !== noteId) return n;
      return {
        ...n,
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
        todos: [...n.todos, { id: `t-${Date.now()}`, text: text.trim(), completed: false }]
      };
    }));
  };

  const handleDeleteTodo = (noteId, todoId) => {
    setNotes(prev => prev.map(n => {
      if (n.id !== noteId) return n;
      return {
        ...n,
        todos: n.todos.filter(t => t.id !== todoId)
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
            className="btn btn-primary"
            onClick={handleAddNote}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
          >
            <Plus size={16} /> 新增便條紙
          </button>

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

        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          📌 共有 {notes.length} 張便條紙（點擊文字直接編輯，自動儲存）
        </span>
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
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {NOTE_COLORS.map(c => (
                      <div
                        key={c.id}
                        onClick={() => handleUpdateNote(note.id, 'color', c.id)}
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: c.border,
                          cursor: 'pointer',
                          opacity: note.color === c.id ? 1 : 0.45,
                          transform: note.color === c.id ? 'scale(1.2)' : 'scale(1)'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteNote(note.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: colorCfg.text,
                    opacity: 0.6,
                    padding: '4px'
                  }}
                  title="刪除便條"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Editable Title */}
              <input
                type="text"
                className="sticky-note-title-input"
                value={note.title}
                onChange={(e) => handleUpdateNote(note.id, 'title', e.target.value)}
                style={{ color: colorCfg.text }}
                placeholder="便條標題..."
              />

              {/* Editable Content */}
              <textarea
                className="sticky-note-content-input"
                value={note.content}
                onChange={(e) => handleUpdateNote(note.id, 'content', e.target.value)}
                style={{ color: colorCfg.text }}
                placeholder="點擊輸入內容..."
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
                        fontSize: '0.85rem',
                        gap: '6px'
                      }}
                    >
                      <div 
                        onClick={() => handleToggleTodo(note.id, t.id)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          cursor: 'pointer',
                          textDecoration: t.completed ? 'line-through' : 'none',
                          opacity: t.completed ? 0.6 : 1
                        }}
                      >
                        {t.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                        <span>{t.text}</span>
                      </div>
                      <span 
                        onClick={() => handleDeleteTodo(note.id, t.id)} 
                        style={{ cursor: 'pointer', opacity: 0.4, fontSize: '0.75rem' }}
                      >
                        ✕
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Add Todo Input */}
              <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: `1px dashed ${colorCfg.border}` }}>
                <input
                  type="text"
                  placeholder="+ 新增待辦事項..."
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
                    outline: 'none',
                    fontSize: '0.8rem',
                    color: colorCfg.text,
                    opacity: 0.8
                  }}
                />
              </div>

              {/* Footer Timestamp */}
              <div style={{ marginTop: '8px', fontSize: '0.72rem', opacity: 0.6, textAlign: 'right' }}>
                更新於：{note.updatedAt}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
