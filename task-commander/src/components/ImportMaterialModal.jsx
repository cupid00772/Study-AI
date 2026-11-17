import { useState, useEffect } from 'react';
import { X, FolderPlus, CheckCircle2, Sparkles, FolderOpen } from 'lucide-react';

export default function ImportMaterialModal({ isOpen, onClose, onImport, initialCategory = 'Study_Materials', existingCourses = [] }) {
  const [category, setCategory] = useState(initialCategory);
  const [course, setCourse] = useState(existingCourses[0] || '資料結構');
  const [isCustomCourse, setIsCustomCourse] = useState(false);
  const [customCourseName, setCustomCourseName] = useState('');
  const [title, setTitle] = useState('');
  const [path, setPath] = useState('');

  // ESC 鍵關閉支援
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  const [type, setType] = useState('notes');
  const [format, setFormat] = useState('md');
  const [summary, setSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isCertified, setIsCertified] = useState(true);

  if (!isOpen) return null;

  const handleSelectFile = async () => {
    if (window.electronAPI?.selectFile) {
      const res = await window.electronAPI.selectFile();
      if (res && res.success) {
        setPath(res.relativePath || res.fullPath);
        if (res.ext) {
          setFormat(res.ext);
        }
        if (!title && res.filename) {
          setTitle(res.filename.replace(/\.[^/.]+$/, ''));
        }
        // Auto guess category from path
        if (res.relativePath?.startsWith('Study_Materials')) {
          setCategory('Study_Materials');
        } else if (res.relativePath?.startsWith('Test_Bank')) {
          setCategory('Test_Bank');
        } else if (res.relativePath?.startsWith('Reference')) {
          setCategory('Misc_Custom');
        }
      }
    }
  };

  const handlePathChange = (val) => {
    setPath(val);
    const match = val.match(/\.([a-z0-9]+)$/i);
    if (match) {
      setFormat(match[1].toLowerCase());
    }
    if (val.startsWith('Study_Materials')) {
      setCategory('Study_Materials');
    } else if (val.startsWith('Test_Bank')) {
      setCategory('Test_Bank');
    } else if (val.startsWith('Reference')) {
      setCategory('Misc_Custom');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !path.trim()) {
      alert('請填寫成果標題與檔案路徑！');
      return;
    }

    const finalCourse = isCustomCourse ? customCourseName.trim() || '自訂科目' : course;
    const tags = tagsInput
      .split(/[,，\s]+/)
      .map(t => t.trim())
      .filter(Boolean);

    if (isCertified && !tags.includes('AI認證')) {
      tags.unshift('AI認證');
    }

    const newDeliverable = {
      id: `del-custom-${Date.now()}`,
      title: title.trim(),
      course: finalCourse,
      category,
      type,
      path: path.trim(),
      format: format.toLowerCase(),
      certified: isCertified,
      updatedAt: new Date().toISOString().slice(0, 10),
      summary: summary.trim() || '使用者自訂導入之學習成果。',
      tags: tags.length > 0 ? tags : ['自主導入', '學習資料']
    };

    onImport(newDeliverable);
    onClose();
  };

  return (
    <div 
      className="viewer-modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="viewer-modal-container" 
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', height: 'auto', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="vault-icon-badge" style={{ background: 'var(--gemini-gradient-soft)', color: 'var(--gemini-blue)' }}>
              <FolderPlus size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                自行導入學習成果 / 資料
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                將工作區現存文件或自訂筆記收錄至 AI 成果庫，支援分門別類與認證標註
              </div>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon-circle" onClick={onClose} style={{ width: 34, height: 34 }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* 1. Category selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--text-main)' }}>
              1. 導入目的地分類 (Category)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button
                type="button"
                className={`nav-pill-btn ${category === 'Study_Materials' ? 'active' : ''}`}
                onClick={() => setCategory('Study_Materials')}
                style={{ textAlign: 'center', padding: '0.65rem 0.5rem', justifyContent: 'center', fontSize: '0.82rem' }}
              >
                📘 Study_Materials
              </button>
              <button
                type="button"
                className={`nav-pill-btn ${category === 'Test_Bank' ? 'active' : ''}`}
                onClick={() => setCategory('Test_Bank')}
                style={{ textAlign: 'center', padding: '0.65rem 0.5rem', justifyContent: 'center', fontSize: '0.82rem' }}
              >
                📝 Test_Bank
              </button>
              <button
                type="button"
                className={`nav-pill-btn ${category === 'Misc_Custom' ? 'active' : ''}`}
                onClick={() => setCategory('Misc_Custom')}
                style={{ textAlign: 'center', padding: '0.65rem 0.5rem', justifyContent: 'center', fontSize: '0.82rem' }}
              >
                📦 雜項與自訂導入
              </button>
            </div>
          </div>

          {/* 2. Course selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--text-main)' }}>
              2. 所屬科目 (Course)
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {!isCustomCourse ? (
                <select
                  className="search-input"
                  value={course}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsCustomCourse(true);
                    } else {
                      setCourse(e.target.value);
                    }
                  }}
                  style={{ flex: 1, padding: '0.6rem 0.85rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
                >
                  {existingCourses.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__NEW__">+ 新增自訂科目...</option>
                </select>
              ) : (
                <div style={{ display: 'flex', flex: 1, gap: '8px' }}>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="輸入新科目名稱（例：離散數學、計算機網路）"
                    value={customCourseName}
                    onChange={(e) => setCustomCourseName(e.target.value)}
                    autoFocus
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsCustomCourse(false)}
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                  >
                    選擇已有
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--text-main)' }}>
              3. 成果標題 (Title)
            </label>
            <input
              type="text"
              className="search-input"
              placeholder="例：作業系統 Chapter 6 CPU 排程重點精華"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* 4. Path with browse button */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--text-main)' }}>
              4. 檔案路徑 (File Path)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="search-input"
                placeholder="例：Study_Materials/作業系統/Chapter_6_教材.md 或 Reference/xxx.docx"
                value={path}
                onChange={(e) => handlePathChange(e.target.value)}
                required
                style={{ flex: 1 }}
              />
              {window.electronAPI?.selectFile && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSelectFile}
                  title="從電腦中挑選檔案"
                  style={{ whiteSpace: 'nowrap', gap: '6px' }}
                >
                  <FolderOpen size={16} /> 瀏覽檔案
                </button>
              )}
            </div>
          </div>

          {/* 5. Type and Format */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--text-main)' }}>
                5. 成果類型 (Type)
              </label>
              <select
                className="search-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
              >
                <option value="notes">📘 教材筆記 (Notes)</option>
                <option value="recitation">🎴 互動速記背誦卡 (Recitation)</option>
                <option value="exam">📝 考卷與題庫詳解 (Exam)</option>
                <option value="report">🔬 實習心得與報告 (Report)</option>
                <option value="custom">📦 其他自訂資料 (Custom)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--text-main)' }}>
                6. 檔案格式 (Format)
              </label>
              <select
                className="search-input"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
              >
                <option value="md">Markdown (.md)</option>
                <option value="html">HTML 網頁 (.html)</option>
                <option value="pdf">PDF 文件 (.pdf)</option>
                <option value="docx">Word 文件 (.docx)</option>
                <option value="py">Python 程式碼 (.py)</option>
                <option value="json">JSON 資料 (.json)</option>
                <option value="other">其他格式</option>
              </select>
            </div>
          </div>

          {/* 7. Summary */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--text-main)' }}>
              7. 成果摘要簡介 (Summary)
            </label>
            <textarea
              className="search-input"
              rows={2}
              placeholder="簡要描述此學習資料的核心重點、觀念或考題範圍..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={{ width: '100%', resize: 'vertical', borderRadius: 'var(--radius-sm)' }}
            />
          </div>

          {/* 8. Tags */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--text-main)' }}>
              8. 標籤 (Tags，以逗號或空格分隔)
            </label>
            <input
              type="text"
              className="search-input"
              placeholder="例：期末考, CPU排程, 演算法, 轉學考"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {/* 9. Certified Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1rem', background: 'var(--bg-panel-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <input
              type="checkbox"
              id="cert-check"
              checked={isCertified}
              onChange={(e) => setIsCertified(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--gemini-purple)' }}
            />
            <label htmlFor="cert-check" style={{ cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} style={{ color: 'var(--gemini-purple)' }} />
              設為「AI 認證學習資料 (Certified Learning Material)」
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.55rem 1.4rem' }}>
              <CheckCircle2 size={16} /> 確定導入成果
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

