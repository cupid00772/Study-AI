import { Suspense, lazy } from 'react';

const App = lazy(() => import('./App.jsx'));
const DesktopStickyNote = lazy(() => import('./components/DesktopStickyNote.jsx'));
const DesktopDailyWidget = lazy(() => import('./components/DesktopDailyWidget.jsx'));
const DesktopAlertWindow = lazy(() => import('./components/DesktopAlertWindow.jsx'));

export default function RootEntry({ mode }) {
  if (mode === 'sticky') {
    return (
      <Suspense fallback={null}>
        <DesktopStickyNote />
      </Suspense>
    );
  }
  if (mode === 'daily') {
    return (
      <Suspense fallback={null}>
        <DesktopDailyWidget />
      </Suspense>
    );
  }
  if (mode === 'alert') {
    return (
      <Suspense fallback={null}>
        <DesktopAlertWindow />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}

