import { useState, useEffect } from 'react';
import { X, FilePlus2, CheckCircle2, AlertCircle } from 'lucide-react';
import SlidingContainer from './SlidingContainer';
import { uploadTextAssetToCloud } from '../services/cloudAssetService';
import { pushCloudDoc, SYNC_KEYS } from '../services/cloudSyncService';
import { getResolvedCloudConfig } from '../services/supabaseClient';

const TEMPLATES = {
  blank: {
    label: '空白筆記',
    build: (title, course) => `# ${title}\n\n> 科目：${course}  \n> 建立日期：${new Date().toISOString().slice(0, 10)}\n\n## 重點整理\n\n- \n`,
  },
  study: {
    label: '章節教材（含知識樹）',
    build: (title, course) => `# ${title}\n\n> 科目：${course}  \n> 建立日期：${new Date().toISOString().slice(0, 10)}\n\n## 1. 知識架構樹\n\n\`\`\`mermaid\nflowchart TD\n  A["${title}"] --> B["核心概念 1"]\n  A --> C["核心概念 2"]\n  B --> D["公式 / 定理"]\n  C --> E["常見考題"]\n\`\`\`\n\n## 2. 核心觀念與公式\n\n- 重要公式範例：$$E = mc^2$$\n\n## 3. 必考陷阱與比較表\n\n| 概念 | 定義 | 常見考點 |\n| --- | --- | --- |\n| 項目 A |  |  |\n\n## 4. 隨堂練習題\n\n1. **題目**：...\n   <details><summary>點擊查看詳解</summary>\n\n   解答內容寫在這裡。\n\n   </details>\n`,
  },
  mistake: {
    label: '錯題檢討筆記',
    build: (title, course) => `# ${title}\n\n> 科目：${course} · 錯題檢討紀錄\n\n## 錯題 #1\n\n- **原題目 / 來源**：\n- **我的錯誤想法**：\n- **正確觀念與解題步驟**：\n- **考前提醒一句話**：\n\n---\n\n## 錯題 #2\n\n- **原題目 / 來源**：\n- **正確觀念與解題步驟**：\n`,
  },
};

export default function CreateNoteModal({
  isOpen,
  onClose,
  onCreated,
  initialCategory = 'Study_Materials',
  initialCourse = '',
  existingCourses = [],
  onRequireUnlock,
}) {
  const isElectron = Boolean(window.electronAPI?.isElectron);
  const cloudConfigured = getResolvedCloudConfig().configured;

  const [category, setCategory] = useState(
    ['Study_Materials', 'Test_Bank', 'Misc_Custom'].includes(initialCategory)
      ? initialCategory
      : 'Study_Materials'
  );
  const [course, setCourse] = useState(initialCourse || existingCourses[0] || '自訂科目');
  const [title, setTitle] = useState('');
  const [templateKey, setTemplateKey] = useState('study');
  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !saving) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('請輸入筆記標題');
      return;
    }

    setError('');
    setSaving(true);
    try {
      const safeCourse = (course || '未分類科目').trim().replace(/[\\/:*?"<>|]/g, '_');
      const safeFileBase = trimmedTitle.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_').slice(0, 60);
      const baseDir = category === 'Test_Bank' ? 'Test_Bank' : 'Study_Materials';
      const relPath = `${baseDir}/${safeCourse}/${safeFileBase}.md`;
      const initialContent = (TEMPLATES[templateKey] || TEMPLATES.blank).build(trimmedTitle, course || '未分類科目');

      if (isElectron && window.electronAPI?.writeFileContent) {
        const writeRes = await window.electronAPI.writeFileContent({
          relativePath: relPath,
          content: initialContent,
        });
        if (!writeRes?.success) {
          setError(writeRes?.error || '無法建立本機檔案');
          return;
        }
        window.electronAPI?.syncCloudAssets?.({ singleFile: relPath }).catch(() => {});
      } else if (cloudConfigured) {
        const upRes = await uploadTextAssetToCloud(
          initialContent,
          relPath,
          (nextManifest) => pushCloudDoc(SYNC_KEYS.ASSET_MANIFEST, nextManifest, { immediate: true })
        );
        if (!upRes?.success) {
          if (upRes?.authRequired) onRequireUnlock?.();
          setError(upRes?.error || '建立雲端筆記失敗（請先解鎖雲端寫入權限）');
          return;
        }
      } else {
        setError('目前未設定雲端連線且非桌面模式，無法保存新建筆記');
        return;
      }

      const newDeliverable = {
        id: `del-note-${Date.now()}`,
        title: trimmedTitle,
        course: course || '未分類科目',
        category,
        type: category === 'Test_Bank' ? 'exam' : 'notes',
        path: relPath,
        format: 'md',
        certified: true,
        updatedAt: new Date().toISOString().slice(0, 10),
        summary: summary.trim() || `自建 Markdown 筆記（${TEMPLATES[templateKey]?.label || '筆記'}）。`,
        tags: [course || '學習筆記', '自建筆記'],
      };

      onCreated?.(newDeliverable, initialContent);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="vault-icon-badge" style={{ width: 36, height: 36 }}>
              <FilePlus2 size={18} />
            </div>
            <div>
              <h2 className="modal-title" style={{ margin: 0, fontSize: '1.08rem' }}>新建 Markdown 學習筆記</h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                建立後立即開啟內建即時預覽編輯器（支援 KaTeX 公式與 Mermaid 圖表）
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-secondary btn-icon-sm" onClick={onClose} disabled={saving}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="setting-label">存放分類</label>
            <SlidingContainer
              className="nav-pills"
              activeKey={category}
              indicatorClassName="sliding-pill-indicator pill-slider"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', padding: '4px' }}
            >
              {[
                { key: 'Study_Materials', label: '📘 學習教材庫' },
                { key: 'Test_Bank', label: '📝 題庫與評量' },
                { key: 'Misc_Custom', label: '📦 雜項自訂' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`nav-pill-btn ${category === cat.key ? 'active' : ''}`}
                  onClick={() => setCategory(cat.key)}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '0.46rem 0.35rem' }}
                >
                  {cat.label}
                </button>
              ))}
            </SlidingContainer>
          </div>

          <div className="setting-grid-2">
            <div>
              <label className="setting-label">所屬科目</label>
              <select className="form-control" value={course} onChange={(e) => setCourse(e.target.value)}>
                {existingCourses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                {!existingCourses.includes(course) && course && (
                  <option value={course}>{course}</option>
                )}
              </select>
            </div>

            <div>
              <label className="setting-label">起始模板</label>
              <select className="form-control" value={templateKey} onChange={(e) => setTemplateKey(e.target.value)}>
                {Object.entries(TEMPLATES).map(([k, tpl]) => (
                  <option key={k} value={k}>{tpl.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="setting-label">筆記標題 *</label>
            <input
              type="text"
              className="form-control"
              placeholder="例：Ch7 虛擬記憶體重點整理"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              autoFocus
              required
            />
          </div>

          <div>
            <label className="setting-label">摘要簡介（選填）</label>
            <input
              type="text"
              className="form-control"
              placeholder="一句話摘要此份筆記內容..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-danger)', fontSize: '0.8rem' }}>
              <AlertCircle size={14} /> <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
              取消
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <CheckCircle2 size={15} /> {saving ? '建立中...' : '建立並立即編輯'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
