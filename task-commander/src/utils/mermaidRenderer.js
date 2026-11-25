import mermaid from 'mermaid';

let initialized = false;

export function ensureMermaidInitialized() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    layout: 'dagre',
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
  initialized = true;
}

export function isModuleImportError(err) {
  const msg = String(err?.message || err || '');
  return /Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module|Loading chunk|ChunkLoadError/i.test(msg);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function clearAppCachesAndReload() {
  try {
    if ('caches' in window) {
      const keys = await window.caches.keys();
      await Promise.all(keys.map((k) => window.caches.delete(k)));
    }
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.update().catch(() => {})));
    }
  } catch {
    // ignore cache cleanup failures
  }
  window.location.reload();
}

export async function renderMermaidSafe(uniqueId, rawCode) {
  ensureMermaidInitialized();

  try {
    return await mermaid.render(uniqueId, rawCode);
  } catch (firstErr) {
    if (!isModuleImportError(firstErr)) {
      throw firstErr;
    }
    // Safari/WebKit transient dynamic-import failure retry (WebKit #242740)
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    try {
      return await mermaid.render(`${uniqueId}-retry`, rawCode);
    } catch (retryErr) {
      if (retryErr && typeof retryErr === 'object') {
        retryErr.isChunkLoadError = isModuleImportError(retryErr);
      }
      throw retryErr;
    }
  }
}

export function renderMermaidErrorInto(container, err, rawCode = '') {
  if (!container) return;
  const chunkErr = Boolean(err?.isChunkLoadError || isModuleImportError(err));
  const safeMsg = escapeHtml(err?.message || '語法未支援');
  const safeCode = escapeHtml(rawCode);

  if (chunkErr) {
    container.innerHTML = `
      <div style="padding:1rem;width:100%;">
        <div class="mermaid-error" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <span>⚠️ 偵測到新版部署或圖表模組載入中斷（${safeMsg}），請重新整理以載入最新版本。</span>
          <button type="button" class="btn btn-primary btn-xs mermaid-reload-btn" style="flex-shrink:0;">重新整理頁面</button>
        </div>
        ${safeCode ? `<pre style="margin-top:0.75rem;font-size:0.8rem;max-height:220px;overflow:auto;">${safeCode}</pre>` : ''}
      </div>
    `;
    const btn = container.querySelector('.mermaid-reload-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        btn.disabled = true;
        btn.textContent = '重新載入中...';
        clearAppCachesAndReload();
      });
    }
    return;
  }

  container.innerHTML = `
    <div style="padding:1rem;width:100%;">
      <div class="mermaid-error">⚠️ 架構圖解析異常：${safeMsg}</div>
      ${safeCode ? `<pre style="margin-top:0.75rem;font-size:0.8rem;max-height:220px;overflow:auto;">${safeCode}</pre>` : ''}
    </div>
  `;
}
