import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import RootEntry from './RootEntry.jsx';

// 提前標記平台 class 避免首幀背景閃爍
if (typeof document !== 'undefined') {
  const isElectron = Boolean(window.electronAPI?.isElectron);
  document.documentElement.classList.add(isElectron ? 'is-electron' : 'is-web');
}

// 僅於非 Electron 正式網頁版註冊 PWA Service Worker 與動態模組失效自動復原
if (
  typeof window !== 'undefined'
  && !window.electronAPI?.isElectron
) {
  // Vercel 新部署更新 chunk hash 後，舊分頁若觸發動態 import 失敗自動重載一次
  window.addEventListener('vite:preloadError', (event) => {
    const RELOAD_KEY = 'tc_preload_reload_ts';
    try {
      const lastTs = Number(window.sessionStorage.getItem(RELOAD_KEY) || '0');
      if (Date.now() - lastTs > 15000) {
        event.preventDefault();
        window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
        window.location.reload();
      }
    } catch {
      // sessionStorage 不可用時退回預設拋錯，交由元件內 UI 提示手動重整
    }
  });

  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
}

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');

const root = createRoot(document.getElementById('root'));

if (mode === 'sticky' || mode === 'daily' || mode === 'alert') {
  root.render(<RootEntry mode={mode} />);
} else {
  root.render(
    <StrictMode>
      <RootEntry mode={null} />
    </StrictMode>,
  );
}
