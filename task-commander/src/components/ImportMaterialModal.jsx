import { useState, useRef } from 'react';
import SlidingContainer from './SlidingContainer';
import { useModalA11y } from '../hooks/useModalA11y';
import { X, FolderPlus, CheckCircle2, Sparkles, FolderOpen, UploadCloud, AlertCircle } from 'lucide-react';
import { uploadBrowserFileToCloud } from '../services/cloudAssetService';
import { pushCloudDoc, SYNC_KEYS } from '../services/cloudSyncService';
import { getResolvedCloudConfig } from '../services/supabaseClient';

export default function ImportMaterialModal({
  isOpen,
  onClose,
  onImport,
  initialCategory = 'Study_Materials',
  existingCourses = [],
  onRequireUnlock,
}) {
  const [category, setCategory] = useState(initialCategory);
  const [course, setCourse] = useState(existingCourses[0] || '資料結構');
  const [isCustomCourse, setIsCustomCourse] = useState(false);
  const [customCourseName, setCustomCourseName] = useState('');
  const [title, setTitle] = useState('');
  const [path, setPath] = useState('');
  const [type, setType] = useState('notes');
  const [format, setFormat] = useState('md');
  const [summary, setSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isCertified, setIsCertified] = useState(true);

  // Web/Cloud direct upload state
  const [selectedBrowserFile, setSelectedBrowserFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const isElectron = Boolean(window.electronAPI?.isElectron);
  const cloudConfigured = getResolvedCloudConfig().configured;

  const { dialogRef } = useModalA11y({ isOpen, onClose, disabled: isUploading });

  if (!isOpen) return null;

  const finalCourse = isCustomCourse ? (customCourseName.trim() || '自訂科目') : course;

  const handleSelectElectronFile = async () => {
    if (window.electronAPI?.selectFile) {
      const res = await window.electronAPI.selectFile();
      if (res && res.success) {
        setPath(res.relativePath || res.fullPath);
        if (res.ext) setFormat(res.ext);
        if (!title && res.filename) {
          setTitle(res.filename.replace(/\.[^/.]+$/, ''));
        }
        if (res.relativePath?.startsWith('Study_Materials')) setCategory('Study_Materials');
        else if (res.relativePath?.startsWith('Test_Bank')) setCategory('Test_Bank');
        else if (res.relativePath?.startsWith('Reference')) setCategory('Misc_Custom');
      }
    }
  };

  const handleSelectBrowserFile = (file) => {
    if (!file) return;
    setUploadError('');
    setSelectedBrowserFile(file);
    const extMatch = file.name.match(/\.([a-z0-9]+)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'md';
    setFormat(ext);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }
    const baseDir = category === 'Test_Bank' ? 'Test_Bank' : 'Study_Materials';
    const safeCourse = (finalCourse || '其他').replace(/[\\/:*?"<>|]/g, '_');
    setPath(`${baseDir}/${safeCourse}/${file.name}`);
    if (ext === 'html') setType('recitation');
    else if (category === 'Test_Bank') setType('exam');
  };

  const handlePathChange = (val) => {
    setPath(val);
    const match = val.match(/\.([a-z0-9]+)$/i);
    if (match) setFormat(match[1].toLowerCase());
    if (val.startsWith('Study_Materials')) setCategory('Study_Materials');
    else if (val.startsWith('Test_Bank')) setCategory('Test_Bank');
    else if (val.startsWith('Reference')) setCategory('Misc_Custom');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');

    if (!title.trim() || !path.trim()) {
      setUploadError('請填寫成果標題與檔案路徑（或選擇要上傳的檔案）。');
      return;
    }

    let finalPath = path.trim().replace(/\\/g, '/');

    // 若使用者從瀏覽器挑選了檔案，先上傳至 Supabase Storage
    if (selectedBrowserFile) {
      if (!cloudConfigured) {
        setUploadError('尚未設定 Supabase 雲端連線，無法從網頁直接上傳檔案。');
        return;
      }
      setIsUploading(true);
      try {
        const upRes = await uploadBrowserFileToCloud(
          selectedBrowserFile,
          finalPath,
          (nextManifest) => pushCloudDoc(SYNC_KEYS.ASSET_MANIFEST, nextManifest, { immediate: true })
        );
        if (!upRes.success) {
          if (upRes.authRequired) {
            onRequireUnlock?.();
          }
          setUploadError(upRes.error || '檔案上傳雲端失敗');
          return;
        }
        finalPath = upRes.relativePath;
      } finally {
        setIsUploading(false);
      }
    }

    const tags = tagsInput
      .split(/[,，\s]+/)
      .map((t) => t.trim())
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
      path: finalPath,
      format: format.toLowerCase(),
      certified: isCertified,
      updatedAt: new Date().toISOString().slice(0, 10),
      summary: summary.trim() || '使用者自訂導入之學習成果。',
      tags: tags.length > 0 ? tags : ['自主導入', '學習資料'],
    };

    // Electron 本機導入時同步單檔上雲（若已設 .env.local）
    if (isElectron && !selectedBrowserFile && window.electronAPI?.syncCloudAssets) {
      window.electronAPI.syncCloudAssets({ singleFile: finalPath }).catch(() => {});
    }

    onImport(newDeliverable);
    onClose();
  };

  return (
    <div className="viewer-modal-overlay">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-material-title"
        tabIndex={-1}
        className="viewer-modal-container"
        style={{ maxWidth: '680px', height: 'auto', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', paddingBottom: '0.9rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="vault-icon-badge" style={{ background: 'var(--gemini-gradient-soft)', color: 'var(--accent-blue)' }}>
              <FolderPlus size={22} />
            </div>
            <div>
              <h2 id="import-material-title" style={{ fontSize: '1.18rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                {isElectron ? '自行導入學習成果 / 資料' : '上傳教材或導入雲端學習資料'}
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isElectron
                  ? '收錄本機文件至 AI 成果庫並自動同步至雲端'
                  : '在 Laptop / 平板上直接選取檔案上傳，所有設備即時可閱讀（單檔上限 15 MB）'}
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-secondary btn-icon-circle" onClick={onClose} disabled={isUploading} aria-label="關閉導入視窗" style={{ width: 34, height: 34 }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.05rem' }}>
          {/* 1. Category selector */}
          <div>
            <span className="setting-label">1. 導入目的地分類 (Category)</span>
            <SlidingContainer
              className="nav-pills category-grid-pills form-grid-3"
              activeKey={category}
              indicatorClassName="sliding-pill-indicator pill-slider"
              style={{ padding: '4px' }}
            >
              {[
                { key: 'Study_Materials', label: '📘 Study_Materials' },
                { key: 'Test_Bank', label: '📝 Test_Bank' },
                { key: 'Misc_Custom', label: '📦 自訂導入' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`nav-pill-btn ${category === cat.key ? 'active' : ''}`}
                  onClick={() => setCategory(cat.key)}
                  style={{ textAlign: 'center', padding: '0.55rem 0.4rem', justifyContent: 'center', fontSize: '0.8rem' }}
                >
                  {cat.label}
                </button>
              ))}
            </SlidingContainer>
          </div>

          {/* 2. Course selection */}
          <div>
            <label className="setting-label">2. 所屬科目 (Course)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!isCustomCourse ? (
                <select
                  className="form-control"
                  value={course}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') setIsCustomCourse(true);
                    else setCourse(e.target.value);
                  }}
                  style={{ flex: 1 }}
                >
                  {existingCourses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__NEW__">+ 新增自訂科目...</option>
                </select>
              ) : (
                <div style={{ display: 'flex', flex: 1, gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="輸入新科目名稱（例：離散數學、計算機網路）"
                    value={customCourseName}
                    onChange={(e) => setCustomCourseName(e.target.value)}
                    autoFocus
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsCustomCourse(false)}
                  >
                    選擇已有
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. Direct File Upload Zone (Web / Laptop / Tablet) */}
          {(!isElectron || cloudConfigured) && (
            <div>
              <label className="setting-label">
                {isElectron ? '3. 上傳檔案至雲端（選填，或改用下方本機瀏覽）' : '3. 選擇要上傳的教材 / 題本檔案（MD / HTML / PDF / 圖片）'}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.html,.htm,.pdf,.png,.jpg,.jpeg,.webp,.svg,.txt,.json"
                style={{ display: 'none' }}
                onChange={(e) => handleSelectBrowserFile(e.target.files?.[0])}
              />
              <div
                role="button"
                tabIndex={0}
                aria-label="點擊挑選檔案或拖曳至此上傳雲端"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleSelectBrowserFile(e.dataTransfer.files?.[0]);
                }}
                style={{
                  border: '1.5px dashed var(--accent-primary)',
                  borderRadius: '12px',
                  padding: '0.9rem 1rem',
                  background: selectedBrowserFile ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-input)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  cursor: 'pointer',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <UploadCloud size={20} style={{ color: selectedBrowserFile ? 'var(--accent-emerald)' : 'var(--accent-primary)', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.82rem', minWidth: 0 }}>
                    {selectedBrowserFile ? (
                      <>
                        <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>已選取：{selectedBrowserFile.name}</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                          {(selectedBrowserFile.size / 1024).toFixed(1)} KB · 提交時將自動上傳至雲端並同步至所有設備
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontWeight: 600 }}>點擊挑選檔案或拖曳至此直接上傳雲端</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>支援 Markdown、HTML 背誦卡、PDF、圖片（上限 15 MB）</div>
                      </>
                    )}
                  </div>
                </div>
                <button type="button" className="btn btn-secondary btn-xs">
                  {selectedBrowserFile ? '更換檔案' : '挑選檔案'}
                </button>
              </div>
            </div>
          )}

          {/* 4. Title */}
          <div>
            <label className="setting-label">4. 成果標題 (Title)</label>
            <input
              type="text"
              className="form-control"
              placeholder="例：作業系統 Chapter 6 CPU 排程重點精華"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* 5. Path */}
          <div>
            <label className="setting-label">5. 檔案路徑 / 網址 (File Path or URL)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="例：Study_Materials/作業系統/Chapter_6_教材.md 或 https://..."
                value={path}
                onChange={(e) => handlePathChange(e.target.value)}
                required
                style={{ flex: 1 }}
              />
              {isElectron && window.electronAPI?.selectFile && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleSelectElectronFile}
                  title="從電腦工作區挑選檔案"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <FolderOpen size={15} /> 本機瀏覽
                </button>
              )}
            </div>
          </div>

          {/* 6. Type and Format */}
          <div className="setting-grid-2">
            <div>
              <label className="setting-label">成果類型 (Type)</label>
              <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="notes">📘 教材筆記 (Notes)</option>
                <option value="recitation">🎴 互動速記背誦卡 (Recitation)</option>
                <option value="exam">📝 考卷與題庫詳解 (Exam)</option>
                <option value="report">🔬 實習心得與報告 (Report)</option>
                <option value="custom">📦 其他自訂資料 (Custom)</option>
              </select>
            </div>
            <div>
              <label className="setting-label">檔案格式 (Format)</label>
              <select className="form-control" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="md">Markdown (.md)</option>
                <option value="html">HTML 網頁 (.html)</option>
                <option value="pdf">PDF 文件 (.pdf)</option>
                <option value="png">PNG 圖片 (.png)</option>
                <option value="jpg">JPG 圖片 (.jpg)</option>
                <option value="txt">純文字 (.txt)</option>
                <option value="other">其他格式</option>
              </select>
            </div>
          </div>

          {/* 7. Summary & Tags */}
          <div>
            <label className="setting-label">成果摘要簡介 (Summary)</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="簡要描述此學習資料的核心重點、觀念或考題範圍..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div>
            <label className="setting-label">標籤 (Tags，以逗號或空格分隔)</label>
            <input
              type="text"
              className="form-control"
              placeholder="例：期末考, CPU排程, 演算法"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {/* Certified Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.65rem 0.9rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <input
              type="checkbox"
              id="cert-check"
              checked={isCertified}
              onChange={(e) => setIsCertified(e.target.checked)}
              style={{ width: 17, height: 17, cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
            />
            <label htmlFor="cert-check" style={{ cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              <Sparkles size={15} style={{ color: 'var(--accent-purple)' }} />
              設為「AI 認證學習資料」
            </label>
          </div>

          {uploadError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-danger)', fontSize: '0.82rem' }}>
              <AlertCircle size={15} />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.25rem', paddingTop: '0.9rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isUploading}>
              取消
            </button>
            <button type="submit" className="btn btn-primary" disabled={isUploading}>
              <CheckCircle2 size={15} /> {isUploading ? '上傳至雲端中...' : '確定導入成果'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
