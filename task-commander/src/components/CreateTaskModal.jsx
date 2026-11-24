import { useState, useEffect } from 'react';
import { Target, X } from 'lucide-react';

export default function CreateTaskModal({ onClose, onAdd, initialTask = null, courseOptions = [] }) {
  const [title, setTitle] = useState(initialTask ? initialTask.title : '');
  const [desc, setDesc] = useState(initialTask ? initialTask.desc || '' : '');
  const [category, setCategory] = useState(initialTask ? initialTask.category : 'Daily');
  const [difficulty, setDifficulty] = useState(initialTask ? initialTask.difficulty || 'Medium' : 'Medium');
  const [relatedCourse, setRelatedCourse] = useState(initialTask?.relatedCourse || '');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const availableCourseOptions = [...new Set([
    ...courseOptions,
    ...(initialTask?.relatedCourse ? [initialTask.relatedCourse] : []),
  ])];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const taskData = {
      title: title.trim(),
      desc: desc.trim(),
      category,
      difficulty,
      relatedCourse: relatedCourse.trim() || undefined,
      dueDate: dueDate || undefined,
    };
    if (initialTask) {
      taskData.id = initialTask.id;
      taskData.completed = initialTask.completed;
    }
    onAdd(taskData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>任務名稱 *</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：複習作業系統 Ch6、每天背 50 個單字..."
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
              rows="3"
              placeholder="記錄執行步驟或重點備忘..."
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

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>取消</button>
            <button type="submit" className="btn btn-primary">{initialTask ? '儲存變更' : '建立任務'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
