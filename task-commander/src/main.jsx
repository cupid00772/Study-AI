import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import DesktopStickyNote from './components/DesktopStickyNote.jsx';
import DesktopDailyWidget from './components/DesktopDailyWidget.jsx';
import DesktopAlertWindow from './components/DesktopAlertWindow.jsx';

// 提前標記平台 class 避免首幀背景閃爍
if (typeof document !== 'undefined') {
  const isElectron = Boolean(window.electronAPI?.isElectron);
  document.documentElement.classList.add(isElectron ? 'is-electron' : 'is-web');
}

// 僅於非 Electron 正式網頁版註冊 PWA Service Worker
if (
  typeof window !== 'undefined'
  && !window.electronAPI?.isElectron
  && 'serviceWorker' in navigator
  && import.meta.env.PROD
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');

const root = createRoot(document.getElementById('root'));

if (mode === 'sticky') {
  root.render(<DesktopStickyNote />);
} else if (mode === 'daily') {
  root.render(<DesktopDailyWidget />);
} else if (mode === 'alert') {
  root.render(<DesktopAlertWindow />);
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
