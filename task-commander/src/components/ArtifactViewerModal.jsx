import { useState, useEffect, useMemo, useRef } from 'react';
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
} from 'lucide-react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import mermaid from 'mermaid';
import {
  fetchCloudAssetText,
  getCloudAssetUrl,
  isReferencePath,
} from '../services/cloudAssetService';

// 初始化 Mermaid 渲染引擎
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    useMaxWidth: true,
  },
  themeVariables: {
    darkMode: true,
    background: '#18191c',
    primaryColor: '#2563eb',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#3b82f6',
    lineColor: '#94a3b8',
    secondaryColor: '#7c3aed',
    tertiaryColor: '#059669',
    mainBkg: '#1e2025',
    nodeBorder: '#3b82f6',
    clusterBkg: '#131417',
    clusterBorder: '#334155',
  },
});

function renderMarkdownWithKatex(content) {
  if (!content) return '';

  const mathTokens = [];
  const mermaidTokens = [];

  // 1. 保護 Mermaid 程式碼區塊
  let tokenized = content.replace(/```mermaid\s*\n([\s\S]*?)\n```/g, (_match, code) => {
    const id = `%%MERMAID_BLOCK_${mermaidTokens.length}%%`;
    mermaidTokens.push(code.trim());
    return id;
  });

  // 2. Display Math: $$ ... $$
  tokenized = tokenized.replace(/\$\$([\s\S]+?)\$\$/g, (match, expr) => {
    try {
      const rendered = katex.renderToString(expr.trim(), {
        displayMode: true,
        throwOnError: false,
        strict: false,
      });
      const id = `%%KATEX_BLOCK_${mathTokens.length}%%`;
      mathTokens.push(rendered);
      return id;
    } catch {
      return match;
    }
  });

  // 3. Inline Math: $ ... $
  tokenized = tokenized.replace(/(?<!\\)\$((?:[^$\n\\]|\\.)+?)\$/g, (match, expr) => {
    try {
      const rendered = katex.renderToString(expr.trim(), {
        displayMode: false,
        throwOnError: false,
        strict: false,
      });
      const id = `%%KATEX_INLINE_${mathTokens.length}%%`;
      mathTokens.push(rendered);
      return id;
    } catch {
      return match;
    }
  });

  // 4. Marked 解析
  let html = '';
  try {
    html = marked.parse(tokenized, { gfm: true, breaks: true });
  } catch {
    html = `<pre>${content}</pre>`;
  }

  // 5. 還原 KaTeX HTML
  html = html.replace(/%%KATEX_(?:BLOCK|INLINE)_(\d+)%%/g, (_, idx) => {
    return mathTokens[Number(idx)] || '';
  });

  // 6. 還原 Mermaid 卡片容器
  html = html.replace(/(?:<p>)?%%MERMAID_BLOCK_(\d+)%%(?:<\/p>)?/g, (_, idx) => {
    const code = mermaidTokens[Number(idx)] || '';
    const encoded = encodeURIComponent(code);
    return `
      <div class="mermaid-diagram-card" data-idx="${idx}">
        <div class="mermaid-toolbar">
          <span style="display:flex;align-items:center;gap:6px;font-weight:600;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            互動式架構圖 (Tree Diagram)
          </span>
          <span style="font-size:0.72rem;opacity:0.75;">Mermaid Flowchart</span>
        </div>
        <div class="mermaid-render-area" id="mermaid-render-${idx}">
          <div class="mermaid-loading">
            <span class="mermaid-spinner"></span> 正在繪製架構圖...
          </div>
        </div>
        <div class="mermaid-raw" style="display: none;">${encoded}</div>
      </div>
    `;
  });

  return html;
}

export default function ArtifactViewerModal({ file, onClose, assetManifestVersion = 0 }) {
  const [isFullscreen, setIsFullscreen] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768));
  const [rawContent, setRawContent] = useState('');
  const [cloudUrl, setCloudUrl] = useState(null);
  const [desktopOnlyNotice, setDesktopOnlyNotice] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const markdownContainerRef = useRef(null);

  const lowerPath = String(file?.path || '').toLowerCase();
  const isHtml = lowerPath.endsWith('.html') || lowerPath.endsWith('.htm');
  const isMd = lowerPath.endsWith('.md');
  const isPdf = lowerPath.endsWith('.pdf');
  const isImage = /\.(png|jpe?g|webp|svg|gif)$/.test(lowerPath);
  const isElectron = Boolean(window.electronAPI?.isElectron);

  const resolvedCloudUrl = useMemo(() => {
    void assetManifestVersion;
    return getCloudAssetUrl(file.path);
  }, [file.path, assetManifestVersion]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      try {
        if (isMounted) setCloudUrl(resolvedCloudUrl);

        // PDF 與圖片不需讀取 UTF-8 文字
        if (isPdf || isImage) {
          if (isElectron) {
            if (isMounted) setLoading(false);
            return;
          }
          if (resolvedCloudUrl) {
            if (isMounted) setLoading(false);
            return;
          }
          if (isMounted) {
            setDesktopOnlyNotice(true);
            setLoading(false);
          }
          return;
        }

        // 1. Electron 桌面端優先讀本機硬碟，若本機尚無（例如剛從別台 Laptop 網頁上傳），自動回退讀雲端
        if (window.electronAPI?.readFileContent) {
          const res = await window.electronAPI.readFileContent(file.path);
          if (res?.success) {
            if (isMounted) {
              setRawContent(res.content);
              setLoading(false);
            }
            return;
          }
          if (resolvedCloudUrl) {
            const cloudRes = await fetchCloudAssetText(file.path);
            if (cloudRes.success) {
              if (isMounted) {
                setRawContent(cloudRes.content);
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

        // 2. Web / iOS / iPadOS 端：優先從 Supabase Storage 雲端載入
        if (resolvedCloudUrl) {
          const cloudRes = await fetchCloudAssetText(file.path);
          if (cloudRes.success) {
            if (isMounted) {
              setRawContent(cloudRes.content);
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

        // 3. 若未在雲端清單中：若是 Reference 原始大檔顯示專屬提示，否則嘗試靜態相對路徑備援
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
  }, [file.path, file.title, isPdf, isImage, isHtml, isElectron, resolvedCloudUrl]);

  const renderedMarkdown = useMemo(() => {
    if (!isMd || !rawContent) return '';
    try {
      return renderMarkdownWithKatex(rawContent);
    } catch {
      return `<pre>${rawContent}</pre>`;
    }
  }, [isMd, rawContent]);

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
          const { svg, bindFunctions } = await mermaid.render(uniqueId, rawCode);
          if (!isCancelled && renderArea) {
            renderArea.innerHTML = svg;
            if (bindFunctions) bindFunctions(renderArea);
          }
        } catch (err) {
          console.error('Mermaid render error:', err);
          if (!isCancelled && renderArea) {
            renderArea.innerHTML = `
              <div style="padding:1rem;width:100%;">
                <div class="mermaid-error">⚠️ 架構圖解析異常：${err.message || '語法未支援'}</div>
                <pre style="margin-top:0.75rem;font-size:0.8rem;max-height:220px;overflow:auto;">${rawCode}</pre>
              </div>
            `;
          }
        }
      }
    };

    renderMermaidDiagrams();
    return () => { isCancelled = true; };
  }, [renderedMarkdown]);

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

  return (
    <div className="viewer-modal-overlay">
      <div className={`viewer-modal-container ${isFullscreen ? 'fullscreen' : ''}`}>
        {/* Modal Toolbar */}
        <div className="viewer-toolbar">
          <div className="viewer-file-info">
            <div className="vault-icon-badge" style={{ width: 34, height: 34 }}>
              {isHtml ? <Code size={18} /> : isPdf ? <BookOpen size={18} /> : isImage ? <ImageIcon size={18} /> : <FileText size={18} />}
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="viewer-file-title" title={file.title}>{file.title}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.course || 'Study-space'} · <code>{file.path}</code>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {isElectron ? (
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
            ) : null}

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
              onClick={onClose}
              title="關閉"
              style={{ width: 34, height: 34 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div
          className="viewer-content-body"
          style={{ padding: (isHtml || (isPdf && !isElectron && cloudUrl)) ? 0 : undefined }}
        >
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '10px', color: 'var(--text-muted)' }}>
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
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-danger)' }}>
              <h3>⚠️ 讀取失敗</h3>
              <p>{error}</p>
              {isElectron && (
                <button className="btn btn-primary" onClick={handleOpenExternal} style={{ marginTop: '1rem' }}>
                  <ExternalLink size={16} /> 直接用外部應用程式開啟
                </button>
              )}
            </div>
          )}

          {!loading && !desktopOnlyNotice && !error && (
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
