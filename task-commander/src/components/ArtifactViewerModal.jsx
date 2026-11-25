import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  ExternalLink,
  FolderOpen,
  FileText,
  Code,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  CloudOff,
  Edit3,
  Save,
  Eye,
  Columns2,
  Check,
  AlertCircle,
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import SlidingContainer from './SlidingContainer';
import { renderMarkdownWithKatex } from '../utils/markdownRenderer';
import { renderMermaidSafe, renderMermaidErrorInto } from '../utils/mermaidRenderer';
import {
  fetchCloudAssetText,
  getCloudAssetUrl,
  isReferencePath,
  uploadTextAssetToCloud,
} from '../services/cloudAssetService';
import { pushCloudDoc, SYNC_KEYS } from '../services/cloudSyncService';
import { getResolvedCloudConfig } from '../services/supabaseClient';

const MD_SNIPPETS = [
  { label: 'H2', insert: '\n## 章節標題\n', title: '插入二級標題' },
  { label: '粗體', wrap: ['**', '**'], title: '粗體強調' },
  { label: '程式碼', wrap: ['`', '`'], title: '行內程式碼' },
  { label: '$ 公式', wrap: ['$', '$'], title: '行內 LaTeX 數學公式' },
  { label: '$$ 區塊公式', insert: '\n$$\n\\sum_{i=1}^{n} x_i\n$$\n', title: '獨立數學公式區塊' },
  { label: 'Mermaid 圖', insert: '\n```mermaid\nflowchart TD\n  A["主題"] --> B["重點 1"]\n  A --> C["重點 2"]\n```\n', title: '插入 Mermaid 流程/知識樹圖' },
  { label: '折疊詳解', insert: '\n<details>\n<summary>點擊展開詳解</summary>\n\n在此填寫解答步驟...\n\n</details>\n', title: '插入可折疊解答區塊' },
];

export default function ArtifactViewerModal({
  file,
  onClose,
  assetManifestVersion = 0,
  onContentSaved,
  onRequireUnlock,
}) {
  const [isFullscreen, setIsFullscreen] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768));
  const [rawContent, setRawContent] = useState(file?.initialContent || '');
  const [cloudUrl, setCloudUrl] = useState(null);
  const [desktopOnlyNotice, setDesktopOnlyNotice] = useState(false);
  const [loading, setLoading] = useState(!file?.initialContent);
  const [error, setError] = useState(null);
  const markdownContainerRef = useRef(null);
  const editorTextareaRef = useRef(null);

  // Edit mode state
  const lowerPath = String(file?.path || '').toLowerCase();
  const isHtml = lowerPath.endsWith('.html') || lowerPath.endsWith('.htm');
  const isMd = lowerPath.endsWith('.md');
  const isPdf = lowerPath.endsWith('.pdf');
  const isImage = /\.(png|jpe?g|webp|svg|gif)$/.test(lowerPath);
  const isEditableText = isMd || isHtml || lowerPath.endsWith('.txt') || lowerPath.endsWith('.json');
  const isElectron = Boolean(window.electronAPI?.isElectron);

  const [isEditing, setIsEditing] = useState(() => Boolean(file?.startInEditMode && isEditableText));
  const [editPaneMode, setEditPaneMode] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= 900 ? 'split' : 'edit'
  ); // 'split' | 'edit' | 'preview'
  const [editDraft, setEditDraft] = useState(file?.initialContent || '');
  const [debouncedPreviewText, setDebouncedPreviewText] = useState(file?.initialContent || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState('');
  const [saveError, setSaveError] = useState('');

  const isDirty = isEditing && editDraft !== rawContent;

  const resolvedCloudUrl = useMemo(() => {
    void assetManifestVersion;
    return getCloudAssetUrl(file.path);
  }, [file.path, assetManifestVersion]);

  const handleRequestClose = useCallback(() => {
    if (isDirty) {
      if (!window.confirm('尚有未儲存的編輯內容，確定要放棄修改並關閉嗎？')) return;
    }
    onClose();
  }, [isDirty, onClose]);

  const handleSaveEdit = useCallback(async () => {
    if (!isEditableText || isSaving) return;
    setIsSaving(true);
    setSaveError('');
    setSaveFeedback('');

    try {
      let savedSomewhere = false;

      // 1. Electron 桌面端直接寫入本機硬碟 + 背景增量上雲
      if (isElectron && window.electronAPI?.writeFileContent) {
        const res = await window.electronAPI.writeFileContent({
          relativePath: file.path,
          content: editDraft,
        });
        if (!res?.success) {
          setSaveError(res?.error || '寫入本機檔案失敗');
          return;
        }
        savedSomewhere = true;
        window.electronAPI?.syncCloudAssets?.({ singleFile: file.path }).catch(() => {});
      } else {
        // 2. Web / iPad / 手機端：上傳至 Supabase Storage
        const cfg = getResolvedCloudConfig();
        if (!cfg.configured) {
          setSaveError('尚未設定 Supabase 雲端連線，無法於網頁端儲存修改');
          return;
        }
        const upRes = await uploadTextAssetToCloud(
          editDraft,
          file.path,
          (nextManifest) => pushCloudDoc(SYNC_KEYS.ASSET_MANIFEST, nextManifest, { immediate: true })
        );
        if (!upRes?.success) {
          if (upRes?.authRequired) onRequireUnlock?.();
          setSaveError(upRes?.error || '雲端儲存失敗，請先解鎖編輯權限');
          return;
        }
        savedSomewhere = true;
      }

      if (savedSomewhere) {
        setRawContent(editDraft);
        setDebouncedPreviewText(editDraft);
        setSaveFeedback(isElectron ? '已儲存本機檔案並自動同步上雲' : '已儲存並同步至雲端');
        onContentSaved?.(file, editDraft);
        window.setTimeout(() => setSaveFeedback(''), 2600);
      }
    } finally {
      setIsSaving(false);
    }
  }, [isEditableText, isSaving, isElectron, file, editDraft, onContentSaved, onRequireUnlock]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleRequestClose();
      } else if (isEditing && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveEdit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRequestClose, isEditing, handleSaveEdit]);

  // Debounce live preview while editing so KaTeX & Mermaid stay responsive
  useEffect(() => {
    if (!isEditing) return undefined;
    const timer = window.setTimeout(() => {
      setDebouncedPreviewText(editDraft);
    }, 240);
    return () => window.clearTimeout(timer);
  }, [isEditing, editDraft]);

  useEffect(() => {
    let isMounted = true;
    if (file?.initialContent) {
      return () => { isMounted = false; };
    }

    async function loadContent() {
      try {
        if (isMounted) setCloudUrl(resolvedCloudUrl);

        if (isPdf || isImage) {
          if (isElectron || resolvedCloudUrl) {
            if (isMounted) setLoading(false);
            return;
          }
          if (isMounted) {
            setDesktopOnlyNotice(true);
            setLoading(false);
          }
          return;
        }

        // 1. Electron 優先讀本機，若無則回退雲端
        if (window.electronAPI?.readFileContent) {
          const res = await window.electronAPI.readFileContent(file.path);
          if (res?.success) {
            if (isMounted) {
              setRawContent(res.content);
              setEditDraft(res.content);
              setDebouncedPreviewText(res.content);
              setLoading(false);
            }
            return;
          }
          if (resolvedCloudUrl) {
            const cloudRes = await fetchCloudAssetText(file.path);
            if (cloudRes.success) {
              if (isMounted) {
                setRawContent(cloudRes.content);
                setEditDraft(cloudRes.content);
                setDebouncedPreviewText(cloudRes.content);
                setLoading(false);
              }
              return;
            }
          }
          if (isMounted) {
            setError(res?.error || '無法讀取檔案內容');
            setLoading(false);
          }
          return;
        }

        // 2. Web / iOS / iPadOS：從 Supabase Storage 載入
        if (resolvedCloudUrl) {
          const cloudRes = await fetchCloudAssetText(file.path);
          if (cloudRes.success) {
            if (isMounted) {
              setRawContent(cloudRes.content);
              setEditDraft(cloudRes.content);
              setDebouncedPreviewText(cloudRes.content);
              setLoading(false);
            }
            return;
          }
          if (isMounted) {
            setError(cloudRes.error || '讀取雲端檔案失敗');
            setLoading(false);
          }
          return;
        }

        // 3. Reference 原始大檔提示或靜態路徑備援
        if (isReferencePath(file.path)) {
          if (isMounted) {
            setDesktopOnlyNotice(true);
            setLoading(false);
          }
          return;
        }

        try {
          const res = await fetch(`./${String(file.path).replace(/^\/+/, '')}`);
          if (res.ok) {
            const text = await res.text();
            if (!text.trimStart().startsWith('<!doctype html') || isHtml) {
              if (isMounted) {
                setRawContent(text);
                setEditDraft(text);
                setDebouncedPreviewText(text);
                setLoading(false);
              }
              return;
            }
          }
        } catch {}

        if (isMounted) {
          setDesktopOnlyNotice(true);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || '載入內容時發生異常');
          setLoading(false);
        }
      }
    }

    loadContent();
    return () => { isMounted = false; };
  }, [file.path, file.title, file?.initialContent, isPdf, isImage, isHtml, isElectron, resolvedCloudUrl]);

  const activeTextForPreview = isEditing ? debouncedPreviewText : rawContent;

  const renderedMarkdown = useMemo(() => {
    if (!isMd || !activeTextForPreview) return '';
    try {
      return renderMarkdownWithKatex(activeTextForPreview);
    } catch {
      return `<pre>${activeTextForPreview}</pre>`;
    }
  }, [isMd, activeTextForPreview]);

  useEffect(() => {
    if (!markdownContainerRef.current) return;
    const cards = markdownContainerRef.current.querySelectorAll('.mermaid-diagram-card');
    if (cards.length === 0) return;

    let isCancelled = false;

    const renderMermaidDiagrams = async () => {
      for (let i = 0; i < cards.length; i++) {
        if (isCancelled) break;
        const card = cards[i];
        const rawDiv = card.querySelector('.mermaid-raw');
        const renderArea = card.querySelector('.mermaid-render-area');
        if (!rawDiv || !renderArea) continue;

        const rawCode = decodeURIComponent(rawDiv.textContent);
        const uniqueId = `mermaid-svg-${Date.now()}-${i}`;

        try {
          const { svg, bindFunctions } = await renderMermaidSafe(uniqueId, rawCode);
          if (!isCancelled && renderArea) {
            renderArea.innerHTML = svg;
            if (bindFunctions) bindFunctions(renderArea);
          }
        } catch (err) {
          console.error('Mermaid render error:', err);
          if (!isCancelled && renderArea) {
            renderMermaidErrorInto(renderArea, err, rawCode);
          }
        }
      }
    };

    renderMermaidDiagrams();
    return () => { isCancelled = true; };
  }, [renderedMarkdown, isEditing, editPaneMode]);

  const handleInsertSnippet = (snippet) => {
    const el = editorTextareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = editDraft.slice(0, start);
    const selected = editDraft.slice(start, end);
    const after = editDraft.slice(end);
    let nextText = editDraft;
    let nextCursor = start;

    if (snippet.wrap) {
      const [prefix, suffix] = snippet.wrap;
      nextText = `${before}${prefix}${selected || '內容'}${suffix}${after}`;
      nextCursor = start + prefix.length + (selected || '內容').length;
    } else if (snippet.insert) {
      nextText = `${before}${snippet.insert}${after}`;
      nextCursor = start + snippet.insert.length;
    }
    setEditDraft(nextText);
    window.requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const handleContentClick = (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId)
        || document.querySelector(`[name="${targetId}"]`)
        || document.querySelector(`a[id="${targetId}"]`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleOpenExternal = () => {
    if (window.electronAPI?.openExternalPath) {
      window.electronAPI.openExternalPath(file.path);
    } else if (cloudUrl) {
      window.open(cloudUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShowInFolder = () => {
    if (window.electronAPI?.showItemInFolder) {
      window.electronAPI.showItemInFolder(file.path);
    }
  };

  const handleEnterEdit = () => {
    setEditDraft(rawContent);
    setSaveError('');
    setSaveFeedback('');
    setIsEditing(true);
  };

  const handleExitEdit = () => {
    if (isDirty && !window.confirm('尚有未儲存的修改，確定要放棄變更並退出編輯模式嗎？')) {
      return;
    }
    setEditDraft(rawContent);
    setSaveError('');
    setIsEditing(false);
  };

  const canEditNow = isEditableText && !loading && !desktopOnlyNotice && !error;

  return (
    <div className="viewer-modal-overlay">
      <div className={`viewer-modal-container ${isFullscreen || isEditing ? 'fullscreen' : ''}`}>
        {/* Modal Toolbar */}
        <div className="viewer-toolbar">
          <div className="viewer-file-info">
            <div className="vault-icon-badge" style={{ width: 34, height: 34 }}>
              {isHtml ? <Code size={18} /> : isPdf ? <BookOpen size={18} /> : isImage ? <ImageIcon size={18} /> : <FileText size={18} />}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="viewer-file-title" title={file.title}>{file.title}</div>
                {isDirty && (
                  <span className="badge-chip badge-amber" style={{ fontSize: '0.68rem' }}>未儲存</span>
                )}
                {saveFeedback && (
                  <span className="badge-chip badge-green" style={{ fontSize: '0.68rem' }}>
                    <Check size={11} /> {saveFeedback}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.course || 'Study-space'} · <code>{file.path}</code>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
            {canEditNow && !isEditing && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleEnterEdit}
                title="直接編輯此檔案內容並同步本機與雲端"
              >
                <Edit3 size={14} /> <span>編輯內容</span>
              </button>
            )}

            {isEditing && (
              <>
                <SlidingContainer
                  className="nav-pills"
                  activeKey={editPaneMode}
                  indicatorClassName="sliding-pill-indicator pill-slider"
                  style={{ padding: '2px' }}
                >
                  <button
                    type="button"
                    className={`nav-pill-btn ${editPaneMode === 'split' ? 'active' : ''}`}
                    onClick={() => setEditPaneMode('split')}
                    style={{ fontSize: '0.74rem', padding: '0.28rem 0.6rem' }}
                    title="左右分割即時預覽"
                  >
                    <Columns2 size={13} /> 分割
                  </button>
                  <button
                    type="button"
                    className={`nav-pill-btn ${editPaneMode === 'edit' ? 'active' : ''}`}
                    onClick={() => setEditPaneMode('edit')}
                    style={{ fontSize: '0.74rem', padding: '0.28rem 0.6rem' }}
                    title="純程式碼/Markdown 編輯"
                  >
                    <Edit3 size={13} /> 編輯
                  </button>
                  <button
                    type="button"
                    className={`nav-pill-btn ${editPaneMode === 'preview' ? 'active' : ''}`}
                    onClick={() => setEditPaneMode('preview')}
                    style={{ fontSize: '0.74rem', padding: '0.28rem 0.6rem' }}
                    title="全畫面預覽"
                  >
                    <Eye size={13} /> 預覽
                  </button>
                </SlidingContainer>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveEdit}
                  disabled={isSaving || !isDirty}
                  title="儲存檔案變更 (Ctrl+S)"
                >
                  <Save size={14} /> <span>{isSaving ? '儲存中...' : '儲存 (Ctrl+S)'}</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleExitEdit}
                  disabled={isSaving}
                >
                  完成編輯
                </button>
              </>
            )}

            {!isEditing && (
              isElectron ? (
                <>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleOpenExternal}
                    title="使用系統預設軟體開啟"
                  >
                    <ExternalLink size={14} /> <span className="hide-on-mobile">外部開啟</span>
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleShowInFolder}
                    title="在 Windows 檔案總管中標記"
                  >
                    <FolderOpen size={14} /> <span className="hide-on-mobile">檔案總管</span>
                  </button>
                </>
              ) : cloudUrl ? (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleOpenExternal}
                  title="在新分頁開啟原始檔案（iOS PDF / 背誦卡推薦）"
                >
                  <ExternalLink size={14} /> <span>新分頁開啟</span>
                </button>
              ) : null
            )}

            <button
              className="btn btn-secondary btn-icon-circle hide-on-mobile"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? '還原視窗' : '全螢幕檢視'}
              style={{ width: 34, height: 34 }}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            <button
              className="btn btn-secondary btn-icon-circle"
              onClick={handleRequestClose}
              title="關閉"
              style={{ width: 34, height: 34 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Save error bar */}
        {saveError && (
          <div style={{ padding: '8px 16px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--accent-danger)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid rgba(225, 29, 72, 0.25)' }}>
            <AlertCircle size={14} /> <span>{saveError}</span>
          </div>
        )}

        {/* Markdown quick formatting toolbar while editing */}
        {isEditing && isMd && editPaneMode !== 'preview' && (
          <div className="viewer-editor-toolbar">
            <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 700 }}>快捷插入：</span>
            {MD_SNIPPETS.map((s) => (
              <button
                key={s.label}
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => handleInsertSnippet(s)}
                title={s.title}
              >
                {s.label}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {editDraft.length.toLocaleString()} 字元
            </span>
          </div>
        )}

        {/* Modal Content Body */}
        <div
          className="viewer-content-body"
          style={{
            padding: (isEditing || isHtml || (isPdf && !isElectron && cloudUrl)) ? 0 : undefined,
            overflow: isEditing ? 'hidden' : 'auto',
            display: isEditing ? 'flex' : 'block',
          }}
        >
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', gap: '10px', color: 'var(--text-muted)' }}>
              <Sparkles size={20} className="spin" style={{ color: 'var(--accent-primary)' }} />
              載入成果內容中...
            </div>
          )}

          {!loading && desktopOnlyNotice && (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', maxWidth: '460px', margin: '0 auto' }}>
              <CloudOff size={44} style={{ color: 'var(--text-dim)', marginBottom: '0.85rem' }} />
              <h3 style={{ margin: '0 0 0.5rem' }}>
                {isReferencePath(file.path) ? '此檔案為 Reference 本機原始大檔' : '檔案尚未上傳至雲端儲存庫'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                {isReferencePath(file.path)
                  ? '為節省雲端空間，Reference 資料夾內的大型原始課堂投影片與 PDF 僅保留在 Windows / Laptop 本機資料夾中。'
                  : '請在 Windows 或 Laptop 本機執行 `npm run sync:assets`（或於桌面版設定頁點「同步本機教材至雲端」），同步完成後即可於行動端直接閱讀。'}
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                <code>{file.path}</code>
              </div>
            </div>
          )}

          {!loading && !desktopOnlyNotice && error && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-danger)', width: '100%' }}>
              <h3>⚠️ 讀取失敗</h3>
              <p>{error}</p>
              {isElectron && (
                <button className="btn btn-primary" onClick={handleOpenExternal} style={{ marginTop: '1rem' }}>
                  <ExternalLink size={16} /> 直接用外部應用程式開啟
                </button>
              )}
            </div>
          )}

          {/* LIVE EDITOR MODE (Split / Edit / Preview) */}
          {!loading && !desktopOnlyNotice && !error && isEditing && (
            <div className={`viewer-split-editor mode-${editPaneMode}`}>
              {editPaneMode !== 'preview' && (
                <div className="viewer-editor-pane">
                  <textarea
                    ref={editorTextareaRef}
                    className="viewer-code-textarea"
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    spellCheck={false}
                    placeholder="在此編輯 Markdown / HTML / 文字內容..."
                  />
                </div>
              )}

              {editPaneMode !== 'edit' && (
                <div className="viewer-preview-pane" style={{ padding: isHtml ? 0 : '1.4rem 1.75rem' }}>
                  {isHtml ? (
                    <iframe
                      title={`${file.title} 即時預覽`}
                      className="viewer-iframe"
                      style={{ borderRadius: 0 }}
                      srcDoc={activeTextForPreview}
                      sandbox="allow-scripts allow-same-origin"
                    />
                  ) : isMd ? (
                    <div
                      ref={markdownContainerRef}
                      className="markdown-body"
                      onClick={handleContentClick}
                      dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
                    />
                  ) : (
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'inherit', margin: 0 }}>
                      {activeTextForPreview}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STANDARD READ-ONLY PREVIEW MODE */}
          {!loading && !desktopOnlyNotice && !error && !isEditing && (
            <>
              {isHtml ? (
                <iframe
                  title={file.title}
                  className="viewer-iframe"
                  srcDoc={rawContent}
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : isMd ? (
                <div
                  ref={markdownContainerRef}
                  className="markdown-body"
                  onClick={handleContentClick}
                  dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
                />
              ) : isImage ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  {cloudUrl ? (
                    <img
                      src={cloudUrl}
                      alt={file.title}
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: 'var(--shadow-md)' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <ImageIcon size={44} style={{ color: 'var(--accent-blue)', marginBottom: '0.75rem' }} />
                      <p style={{ color: 'var(--text-muted)' }}>本機圖片檔案，點擊外部檢視：</p>
                      <button className="btn btn-primary" onClick={handleOpenExternal}>
                        <ExternalLink size={15} /> 開啟圖片
                      </button>
                    </div>
                  )}
                </div>
              ) : isPdf ? (
                !isElectron && cloudUrl ? (
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{
                      padding: '8px 14px',
                      background: 'var(--bg-input)',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      flexWrap: 'wrap',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                    }}>
                      <span>若在 iPhone / iPad Safari 無法順暢翻頁，建議點右側按鈕以系統原生檢視器開啟。</span>
                      <a
                        href={cloudUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-xs"
                        style={{ textDecoration: 'none' }}
                      >
                        <ExternalLink size={13} /> 以原生 PDF 檢視器開啟
                      </a>
                    </div>
                    <iframe
                      title={file.title}
                      src={cloudUrl}
                      className="viewer-iframe"
                      style={{ flex: 1, borderRadius: 0 }}
                    />
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <BookOpen size={48} style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }} />
                    <h3>PDF 格式文件</h3>
                    <p style={{ color: 'var(--text-muted)' }}>點擊下方按鈕以系統預設 PDF 閱讀器開啟檢視：</p>
                    <button className="btn btn-primary" onClick={handleOpenExternal} style={{ marginTop: '1rem' }}>
                      <ExternalLink size={16} /> 開啟 PDF 閱讀
                    </button>
                  </div>
                )
              ) : (
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'inherit' }}>
                  {rawContent}
                </pre>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
