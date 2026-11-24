import { useState, useEffect } from 'react';
import { X, Edit3, CheckCircle2, Trash2, Sparkles, AlertTriangle } from 'lucide-react';
import SlidingContainer from './SlidingContainer';

export default function EditMaterialModal({
  item,
  existingCourses = [],
  onClose,
  onSave,
  onDelete,
}) {
  const isElectron = Boolean(window.electronAPI?.isElectron);
  const [title, setTitle] = useState(item?.title || '');
  const [category, setCategory] = useState(
    item?.category ||
      (String(item?.path || '').startsWith('Test_Bank')
        ? 'Test_Bank'
        : String(item?.path || '').startsWith('Study_Materials')
          ? 'Study_Materials'
          : 'Misc_Custom')
  );
  const [course, setCourse] = useState(item?.course || existingCourses[0] || '未分類科目');
  const [isCustomCourse, setIsCustomCourse] = useState(
    Boolean(item?.course && !existingCourses.includes(item.course))
  );
  const [customCourseName, setCustomCourseName] = useState(item?.course || '');
  const [type, setType] = useState(item?.type || 'notes');
  const [summary, setSummary] = useState(item?.summary || '');
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(item?.tags) ? item.tags.join(', ') : ''
  );
  const [isCertified, setIsCertified] = useState(item?.certified !== false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [trashLocalFile, setTrashLocalFile] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!item) return null;

  const finalCourse = isCustomCourse ? (customCourseName.trim() || '未分類科目') : course;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const tags = tagsInput
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    onSave?.({
      ...item,
      title: title.trim(),
      category,
      course: finalCourse,
      type,
      summary: summary.trim(),
      tags,
      certified: isCertified,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '1.45rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div className="vault-icon-badge" style={{ width: 36, height: 36 }}>
              <Edit3 size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 className="modal-title" style={{ margin: 0, fontSize: '1.08rem' }}>編輯學習成果資訊</h2>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <code>{item.path}</code>
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-secondary btn-icon-sm" onClick={onClose} aria-label="關閉">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="setting-label">所屬大分類</label>
            <SlidingContainer
              className="nav-pills"
              activeKey={category}
              indicatorClassName="sliding-pill-indicator pill-slider"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', padding: '4px' }}
            >
              {[
                { key: 'Study_Materials', label: '📘 Study_Materials' },
                { key: 'Test_Bank', label: '📝 Test_Bank' },
                { key: 'Misc_Custom', label: '📦 雜項自訂' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`nav-pill-btn ${category === cat.key ? 'active' : ''}`}
                  onClick={() => setCategory(cat.key)}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '0.48rem 0.35rem' }}
                >
                  {cat.label}
                </button>
              ))}
            </SlidingContainer>
          </div>

          <div className="setting-grid-2">
            <div>
              <label className="setting-label">成果標題 *</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="setting-label">所屬科目</label>
              {!isCustomCourse ? (
                <select
                  className="form-control"
                  value={course}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsCustomCourse(true);
                      setCustomCourseName('');
                    } else {
                      setCourse(e.target.value);
                    }
                  }}
                >
                  {existingCourses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__NEW__">+ 輸入其他科目...</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="輸入科目名稱"
                    value={customCourseName}
                    onChange={(e) => setCustomCourseName(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => setIsCustomCourse(false)}
                  >
                    列表
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="setting-grid-2">
            <div>
              <label className="setting-label">成果類型</label>
              <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="notes">📘 教材筆記 (Notes)</option>
                <option value="recitation">🎴 互動背誦卡 (Recitation)</option>
                <option value="exam">📝 考卷與題庫詳解 (Exam)</option>
                <option value="report">🔬 實習心得與報告 (Report)</option>
                <option value="custom">📦 其他自訂資料 (Custom)</option>
              </select>
            </div>
            <div>
              <label className="setting-label">標籤（以逗號或空格分隔）</label>
              <input
                type="text"
                className="form-control"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="例：期末考, 模擬題, 重點整理"
              />
            </div>
          </div>

          <div>
            <label className="setting-label">摘要簡介</label>
            <textarea
              className="form-control"
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="簡要描述此學習資料的章節範圍與重點..."
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '0.6rem 0.85rem', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={isCertified}
              onChange={(e) => setIsCertified(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--accent-primary)' }}
            />
            <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} />
            <span>標記為「AI 認證學習資料」</span>
          </label>

          {/* Safe Delete Accordion */}
          {onDelete && (
            <div style={{ border: '1px solid rgba(225, 29, 72, 0.28)', borderRadius: '12px', padding: '10px 12px', background: 'rgba(225, 29, 72, 0.04)' }}>
              {!confirmDeleteOpen ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    需要移除這筆學習成果嗎？
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    style={{ color: 'var(--accent-danger)', borderColor: 'rgba(225, 29, 72, 0.35)' }}
                    onClick={() => setConfirmDeleteOpen(true)}
                  >
                    <Trash2 size={13} /> 刪除此項目
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-danger)', fontWeight: 700, fontSize: '0.82rem' }}>
                    <AlertTriangle size={14} /> 確認移除「{item.title}」
                  </div>
                  {isElectron && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.78rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={trashLocalFile}
                        onChange={(e) => setTrashLocalFile(e.target.checked)}
                        style={{ accentColor: 'var(--accent-danger)' }}
                      />
                      <span>同時將本機硬碟檔案移至 Windows 回收桶（可從回收桶復原）</span>
                    </label>
                  )}
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                    {trashLocalFile
                      ? '檔案將移至系統回收桶，並自 AI 成果庫清單移除。'
                      : '僅自 AI 成果庫清單移除並加入忽略清單（避免自動重新掃入），不刪除硬碟原檔。'}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary btn-xs" onClick={() => setConfirmDeleteOpen(false)}>
                      取消刪除
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs"
                      style={{ background: 'var(--accent-danger)', color: '#fff', border: 'none' }}
                      onClick={() => {
                        onDelete(item, { deleteLocalFile: trashLocalFile });
                        onClose();
                      }}
                    >
                      <Trash2 size={12} /> 確定移除
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={15} /> 儲存修改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
