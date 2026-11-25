import { useState, useEffect } from 'react';
import {
  Target,
  X,
  Plus,
  Trash2,
  ListChecks,
  Repeat,
  Clock,
  CheckSquare,
  Square,
} from 'lucide-react';
import {
  WEEKDAY_OPTIONS,
  normalizeRepeatDays,
  createChecklistItem,
} from '../utils/taskScheduleUtils';

export default function CreateTaskModal({ onClose, onAdd, initialTask = null, courseOptions = [] }) {
  const [title, setTitle] = useState(initialTask ? initialTask.title : '');
  const [desc, setDesc] = useState(initialTask ? initialTask.desc || '' : '');
  const [category, setCategory] = useState(initialTask ? initialTask.category : 'Daily');
  const [difficulty, setDifficulty] = useState(initialTask ? initialTask.difficulty || 'Medium' : 'Medium');
  const [relatedCourse, setRelatedCourse] = useState(initialTask?.relatedCourse || '');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');
  const [repeatDays, setRepeatDays] = useState(() => normalizeRepeatDays(initialTask?.repeatDays));
  const [reminderTime, setReminderTime] = useState(initialTask?.reminderTime || '');
  const [checklist, setChecklist] = useState(() =>
    Array.isArray(initialTask?.checklist)
      ? initialTask.checklist.map((item) => ({
          id: item.id || createChecklistItem(item.text).id,
          text: String(item.text || ''),
          done: Boolean(item.done),
        }))
      : []
  );
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const availableCourseOptions = [...new Set([
    ...courseOptions,
    ...(initialTask?.relatedCourse ? [initialTask.relatedCourse] : []),
  ])];

  const handleToggleDay = (dayVal) => {
    setRepeatDays((prev) =>
      prev.includes(dayVal)
        ? prev.filter((d) => d !== dayVal)
        : normalizeRepeatDays([...prev, dayVal])
    );
  };

  const handleAddChecklistItem = () => {
    const trimmed = newItemText.trim();
    if (!trimmed) return;
    setChecklist((prev) => [...prev, createChecklistItem(trimmed)]);
    setNewItemText('');
  };

  const handleToggleChecklistDone = (itemId) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item))
    );
  };

  const handleChangeChecklistText = (itemId, text) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, text } : item))
    );
  };

  const handleRemoveChecklistItem = (itemId) => {
    setChecklist((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cleanedChecklist = checklist
      .map((item) => ({ ...item, text: String(item.text || '').trim() }))
      .filter((item) => item.text.length > 0);

    const normDays = category === 'Daily' ? normalizeRepeatDays(repeatDays) : [];
    const effectiveRepeatDays = normDays.length > 0 && normDays.length < 7 ? normDays : undefined;

    const taskData = {
      title: title.trim(),
      desc: desc.trim(),
      category,
      difficulty,
      relatedCourse: relatedCourse.trim() || undefined,
      dueDate: dueDate || undefined,
      repeatDays: effectiveRepeatDays,
      reminderTime: category === 'Daily' && reminderTime ? reminderTime : undefined,
      checklist: cleanedChecklist.length > 0 ? cleanedChecklist : undefined,
    };

    if (initialTask) {
      taskData.id = initialTask.id;
      taskData.completed =
        cleanedChecklist.length > 0
          ? cleanedChecklist.every((item) => item.done)
          : Boolean(initialTask.completed);
      if (initialTask.xp !== undefined) {
        taskData.xp = initialTask.xp;
      }
    }
    onAdd(taskData);
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: 560, maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={19} style={{ color: 'var(--accent-primary)' }} />
            <h2 className="modal-title" style={{ margin: 0 }}>
              {initialTask ? '編輯任務' : '新增任務'}
            </h2>
          </div>
          <button type="button" className="btn btn-secondary btn-icon-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', minHeight: 0 }}>
            <div className="form-group">
              <label>任務名稱 *</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：複習作業系統 Ch6、Monday workout..."
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>補充說明</label>
              <textarea
                className="form-control"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows="2"
                placeholder="記錄執行步驟、影片連結或重點備忘..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>任務分類</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Daily">每日核心目標</option>
                  <option value="Main">學期主線任務</option>
                  <option value="Challenge">轉學考／衝刺挑戰</option>
                </select>
              </div>

              <div className="form-group">
                <label>優先級</label>
                <select className="form-control" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="Easy">一般</option>
                  <option value="Medium">中優先</option>
                  <option value="Hard">高優先</option>
                </select>
              </div>
            </div>

            {category === 'Daily' && (
              <div className="form-group" style={{ background: 'var(--bg-input)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <label style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Repeat size={13} /> 重複星期（未指定則每天顯示）
                  </label>
                  <button
                    type="button"
                    className={`weekday-pill-btn ${repeatDays.length === 0 ? 'active' : ''}`}
                    onClick={() => setRepeatDays([])}
                  >
                    每天
                  </button>
                </div>

                <div className="weekday-picker-row">
                  {WEEKDAY_OPTIONS.map((opt) => {
                    const active = repeatDays.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`weekday-pill-btn ${active ? 'active' : ''}`}
                        onClick={() => handleToggleDay(opt.value)}
                        title={opt.label}
                      >
                        {opt.short}
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
                    <Clock size={13} /> 提醒時間（選填）
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    style={{ maxWidth: '150px', padding: '0.35rem 0.65rem' }}
                  />
                  {reminderTime && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setReminderTime('')}
                    >
                      清除
                    </button>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>所屬科目（選填）</label>
                <select className="form-control" value={relatedCourse} onChange={(e) => setRelatedCourse(e.target.value)}>
                  <option value="">不限科目</option>
                  {availableCourseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>預計期限（選填）</label>
                <input type="date" className="form-control" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0.25rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ListChecks size={13} /> 子任務清單（可逐組勾選，共 {checklist.length} 項）
              </label>

              {checklist.length > 0 && (
                <div className="checklist-editor-list">
                  {checklist.map((item) => (
                    <div key={item.id} className="checklist-editor-row">
                      <button
                        type="button"
                        className="icon-ghost-btn"
                        onClick={() => handleToggleChecklistDone(item.id)}
                        title={item.done ? '標記為未完成' : '標記為完成'}
                        style={{ color: item.done ? 'var(--accent-emerald)' : 'var(--text-muted)' }}
                      >
                        {item.done ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                      <input
                        type="text"
                        className="form-control"
                        value={item.text}
                        onChange={(e) => handleChangeChecklistText(item.id, e.target.value)}
                        style={{ padding: '0.38rem 0.65rem', fontSize: '0.82rem' }}
                      />
                      <button
                        type="button"
                        className="icon-ghost-btn danger"
                        onClick={() => handleRemoveChecklistItem(item.id)}
                        title="移除此項"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input
                  type="text"
                  className="form-control"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklistItem();
                    }
                  }}
                  placeholder="新增子項目（按 Enter 加入）"
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddChecklistItem}
                  disabled={!newItemText.trim()}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Plus size={14} /> 新增
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>取消</button>
            <button type="submit" className="btn btn-primary">{initialTask ? '儲存變更' : '建立任務'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
