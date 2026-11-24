import { useState } from 'react';
import SlidingContainer from './SlidingContainer';
import {
  Home,
  CheckSquare,
  Calendar,
  Crosshair,
  StickyNote,
  FolderGit2,
  MoreHorizontal,
  ListTodo,
  BookOpen,
  GraduationCap,
  Settings,
  Sun,
  Moon,
  Lock,
  Unlock,
  RefreshCw,
  X,
} from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  onNavigateTab,
  urgentAssignmentCount = 0,
  urgentExamCount = 0,
  theme,
  onToggleTheme,
  onOpenSettings,
  onOpenCredits,
  onOpenUnlock,
  onForceSync,
  isSyncing,
  cloudCanWrite,
  cloudConfigured,
}) {
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryTabs = [
    { id: 'dashboard', label: '首頁', icon: Home },
    { id: 'assignments', label: '作業', icon: CheckSquare, badge: urgentAssignmentCount || null, urgent: urgentAssignmentCount > 0 },
    { id: 'arena', label: '刷題', icon: Crosshair },
    { id: 'exams', label: '考試', icon: Calendar, badge: urgentExamCount || null, urgent: urgentExamCount > 0 },
    { id: 'vault', label: '教材', icon: FolderGit2 },
  ];

  const isSecondaryActive = activeTab === 'notes' || activeTab === 'missions' || activeTab === 'courses';

  const pickSecondary = (tabId) => {
    onNavigateTab(tabId);
    setMoreOpen(false);
  };

  return (
    <>
      <SlidingContainer
        as="nav"
        className="mobile-bottom-nav"
        activeKey={isSecondaryActive || moreOpen ? '__more__' : activeTab}
        indicatorClassName="sliding-pill-indicator mobile-nav-slider"
        aria-label="行動端主導覽"
      >
        {primaryTabs.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-nav-btn ${active ? 'active' : ''}`}
              onClick={() => onNavigateTab(item.id)}
            >
              <span className="mobile-nav-icon-wrap">
                <Icon size={20} />
                {item.badge !== null && item.badge !== undefined && (
                  <span className={`mobile-nav-badge ${item.urgent ? 'urgent' : ''}`}>
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </span>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          className={`mobile-nav-btn ${isSecondaryActive || moreOpen ? 'active' : ''}`}
          onClick={() => setMoreOpen(true)}
        >
          <span className="mobile-nav-icon-wrap">
            <MoreHorizontal size={20} />
          </span>
          <span className="mobile-nav-label">更多</span>
        </button>
      </SlidingContainer>

      {/* Slide-up More Action Sheet */}
      {moreOpen && (
        <div className="mobile-sheet-overlay">
          <div className="mobile-sheet-panel">
            <div className="mobile-sheet-header">
              <span style={{ fontWeight: 800, fontSize: '0.96rem' }}>更多功能與工具</span>
              <button
                type="button"
                className="btn btn-secondary btn-icon-sm"
                onClick={() => setMoreOpen(false)}
                aria-label="關閉選單"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mobile-sheet-grid">
              <button type="button" className={`mobile-sheet-tile ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => pickSecondary('notes')}>
                <StickyNote size={20} />
                <span>雲端便條</span>
              </button>
              <button type="button" className={`mobile-sheet-tile ${activeTab === 'missions' ? 'active' : ''}`} onClick={() => pickSecondary('missions')}>
                <ListTodo size={20} />
                <span>每日任務</span>
              </button>
              <button type="button" className={`mobile-sheet-tile ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => pickSecondary('courses')}>
                <BookOpen size={20} />
                <span>科目與課表</span>
              </button>
              <button type="button" className="mobile-sheet-tile" onClick={() => { setMoreOpen(false); onOpenCredits?.(); }}>
                <GraduationCap size={20} />
                <span>128 學分表</span>
              </button>
              <button type="button" className="mobile-sheet-tile" onClick={() => { setMoreOpen(false); onForceSync?.(); }}>
                <RefreshCw size={20} className={isSyncing ? 'spin' : ''} />
                <span>{isSyncing ? '同步中...' : '同步雲端'}</span>
              </button>
              {cloudConfigured && (
                <button type="button" className="mobile-sheet-tile" onClick={() => { setMoreOpen(false); onOpenUnlock?.(); }}>
                  {cloudCanWrite ? <Unlock size={20} style={{ color: 'var(--accent-emerald)' }} /> : <Lock size={20} style={{ color: 'var(--accent-amber)' }} />}
                  <span>{cloudCanWrite ? '已解鎖編輯' : '解鎖編輯'}</span>
                </button>
              )}
              <button type="button" className="mobile-sheet-tile" onClick={() => { onToggleTheme?.(); }}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                <span>{theme === 'light' ? '深色模式' : '淺色模式'}</span>
              </button>
              <button type="button" className="mobile-sheet-tile" onClick={() => { setMoreOpen(false); onOpenSettings?.(); }}>
                <Settings size={20} />
                <span>系統設定</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

