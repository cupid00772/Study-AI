import { useState, useEffect, useMemo } from 'react';
import { X, Maximize2, Minimize2, ExternalLink, FolderOpen, FileText, Code, Sparkles, BookOpen } from 'lucide-react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function renderMarkdownWithKatex(content) {
  if (!content) return '';

  const mathTokens = [];

  // 1. Protect & render Display Math: $$ ... $$
  let tokenized = content.replace(/\$\$([\s\S]+?)\$\$/g, (match, expr) => {
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

  // 2. Protect & render Inline Math: $ ... $ (avoid escaped \$ or newlines)
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

  // 3. Parse Markdown with marked
  let html = '';
  try {
    html = marked.parse(tokenized, { gfm: true, breaks: true });
  } catch {
    html = `<pre>${content}</pre>`;
  }

  // 4. Restore rendered KaTeX HTML
  html = html.replace(/%%KATEX_(?:BLOCK|INLINE)_(\d+)%%/g, (_, idx) => {
    return mathTokens[Number(idx)] || '';
  });

  return html;
}

export default function ArtifactViewerModal({ file, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rawContent, setRawContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isHtml = file.path?.toLowerCase().endsWith('.html');
  const isMd = file.path?.toLowerCase().endsWith('.md');
  const isPdf = file.path?.toLowerCase().endsWith('.pdf');

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
    <div className="viewer-modal-overlay" onClick={onClose}>
      <div 
        className={`viewer-modal-container ${isFullscreen ? 'fullscreen' : ''}`}
        onClick={(e) => e.stopPropagation()}
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
                  className="markdown-body"
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
