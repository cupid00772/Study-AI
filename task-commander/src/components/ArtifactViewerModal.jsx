import { useState, useEffect, useMemo, useRef } from 'react';
import { X, Maximize2, Minimize2, ExternalLink, FolderOpen, FileText, Code, Sparkles, BookOpen } from 'lucide-react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import mermaid from 'mermaid';

// 初始化 Mermaid 渲染引擎
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose', // 允許節點包含 click href 互動連結
  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    useMaxWidth: true
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
    clusterBorder: '#334155'
  }
});

function renderMarkdownWithKatex(content) {
  if (!content) return '';

  const mathTokens = [];
  const mermaidTokens = [];

  // 1. 保護 Mermaid 程式碼區塊（避免被 marked 轉為跳脫的 HTML）
  let tokenized = content.replace(/```mermaid\s*\n([\s\S]*?)\n```/g, (_match, code) => {
    const id = `%%MERMAID_BLOCK_${mermaidTokens.length}%%`;
    mermaidTokens.push(code.trim());
    return id;
  });

  // 2. 保護並預先渲染 Display Math: $$ ... $$
  tokenized = tokenized.replace(/\$\$([\s\S]+?)\$\$/g, (match, expr) => {
    try {
      const rendered = katex.renderToString(expr.trim(), {
        displayMode: true,
        throwOnError: false,
        strict: false
      });
      const id = `%%KATEX_BLOCK_${mathTokens.length}%%`;
      mathTokens.push(rendered);
      return id;
    } catch {
      return match;
    }
  });

  // 3. 保護並預先渲染 Inline Math: $ ... $
  tokenized = tokenized.replace(/(?<!\\)\$((?:[^$\n\\]|\\.)+?)\$/g, (match, expr) => {
    try {
      const rendered = katex.renderToString(expr.trim(), {
        displayMode: false,
        throwOnError: false,
        strict: false
      });
      const id = `%%KATEX_INLINE_${mathTokens.length}%%`;
      mathTokens.push(rendered);
      return id;
    } catch {
      return match;
    }
  });

  // 4. 使用 marked 解析 Markdown 語法
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

  // 6. 還原並建構 Mermaid 渲染卡片容器
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

export default function ArtifactViewerModal({ file, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rawContent, setRawContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const markdownContainerRef = useRef(null);

  const isHtml = file.path?.toLowerCase().endsWith('.html');
  const isMd = file.path?.toLowerCase().endsWith('.md');
  const isPdf = file.path?.toLowerCase().endsWith('.pdf');

  // ESC 鍵關閉支援
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadContent() {
      try {
        if (window.electronAPI?.readFileContent) {
          const res = await window.electronAPI.readFileContent(file.path);
          if (isMounted) {
            if (res.success) {
              setRawContent(res.content);
            } else {
              setError(res.error || '無法讀取檔案內容');
            }
            setLoading(false);
          }
        } else {
          // Fallback in web dev mode without Electron
          const res = await fetch(`/${file.path}`);
          if (res.ok) {
            const text = await res.text();
            if (isMounted) {
              setRawContent(text);
              setLoading(false);
            }
          } else {
            if (isMounted) {
              setRawContent(`## ${file.title}\n\n*路徑：\`${file.path}\`*\n\n> 💡 這是此成果的預覽模式。在桌面端可透過 Electron 直接存取本機完整檔案內容。`);
              setLoading(false);
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    loadContent();
    return () => { isMounted = false; };
  }, [file.path, file.title]);

  const renderedMarkdown = useMemo(() => {
    if (!isMd || !rawContent) return '';
    try {
      return renderMarkdownWithKatex(rawContent);
    } catch {
      return `<pre>${rawContent}</pre>`;
    }
  }, [isMd, rawContent]);

  // Mermaid 非同步繪製 Effect
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
            if (bindFunctions) {
              bindFunctions(renderArea);
            }
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

    return () => {
      isCancelled = true;
    };
  }, [renderedMarkdown]);

  // 處理內部跳轉連結 (例如 #sec-1 錨點) 讓其平滑捲動
  const handleContentClick = (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId) || document.querySelector(`[name="${targetId}"]`) || document.querySelector(`a[id="${targetId}"]`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleOpenExternal = () => {
    if (window.electronAPI?.openExternalPath) {
      window.electronAPI.openExternalPath(file.path);
    }
  };

  const handleShowInFolder = () => {
    if (window.electronAPI?.showItemInFolder) {
      window.electronAPI.showItemInFolder(file.path);
    }
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
        className={`viewer-modal-container ${isFullscreen ? 'fullscreen' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Modal Toolbar */}
        <div className="viewer-toolbar">
          <div className="viewer-file-info">
            <div className="vault-icon-badge" style={{ width: 34, height: 34 }}>
              {isHtml ? <Code size={18} /> : isPdf ? <BookOpen size={18} /> : <FileText size={18} />}
            </div>
            <div>
              <div className="viewer-file-title" title={file.title}>{file.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {file.course || 'Study-space'} • <code>{file.path}</code>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {window.electronAPI?.isElectron && (
              <>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleOpenExternal}
                  title="使用系統預設軟體開啟"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  <ExternalLink size={15} /> 外部開啟
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleShowInFolder}
                  title="在 Windows 檔案總管中標記"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  <FolderOpen size={15} /> 檔案總管
                </button>
              </>
            )}

            <button 
              className="btn btn-secondary btn-icon-circle"
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
        <div className="viewer-content-body" style={{ padding: isHtml ? 0 : '2rem' }}>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '10px', color: 'var(--text-muted)' }}>
              <Sparkles size={20} className="gemini-spin" style={{ color: 'var(--gemini-purple)' }} />
              載入成果內容中...
            </div>
          )}

          {error && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gemini-pink)' }}>
              <h3>⚠️ 讀取失敗</h3>
              <p>{error}</p>
              {window.electronAPI?.isElectron && (
                <button className="btn btn-primary" onClick={handleOpenExternal} style={{ marginTop: '1rem' }}>
                  <ExternalLink size={16} /> 直接用外部應用程式開啟
                </button>
              )}
            </div>
          )}

          {!loading && !error && (
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
              ) : isPdf ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <BookOpen size={48} style={{ color: 'var(--gemini-blue)', marginBottom: '1rem' }} />
                  <h3>PDF 格式文件</h3>
                  <p style={{ color: 'var(--text-muted)' }}>已就緒。點擊下方按鈕以系統預設 PDF 閱讀器開啟檢視：</p>
                  <button className="btn btn-primary" onClick={handleOpenExternal} style={{ marginTop: '1rem' }}>
                    <ExternalLink size={16} /> 開啟 PDF 閱讀
                  </button>
                </div>
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
