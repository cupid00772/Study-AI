import { marked } from 'marked';
import katex from 'katex';

export function renderMarkdownWithKatex(content) {
  if (!content) return '';

  const mathTokens = [];
  const mermaidTokens = [];

  // 1. 保護 Mermaid 程式碼區塊
  let tokenized = content.replace(/```mermaid\s*\r?\n([\s\S]*?)\r?\n```/g, (_match, code) => {
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
