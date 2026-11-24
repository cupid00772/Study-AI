import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Home,
  CheckSquare,
  Calendar,
  ListTodo,
  StickyNote,
  FolderGit2,
  BookOpen,
  RefreshCw,
  BellRing,
  Play,
  Settings,
  Sun,
  Moon,
  Plus,
  FileText,
  CornerDownLeft,
} from 'lucide-react';

export default function CommandPalette({
  onClose,
  trackerData,
  theme,
  onNavigateTab,
  onPreviewFile,
  onTriggerSync,
  onTriggerAlertTest,
  onStartFocus,
  onToggleTheme,
  onOpenSettings,
  onOpenNewTask,
}) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(timer);
  }, []);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [];

    // 1. Quick Actions
    const isElectron = Boolean(window.electronAPI?.isElectron);
    const actions = [
      { id: 'act-focus', group: '快速指令', title: '開始 25 分鐘讀書專注計時', icon: Play, run: () => { onNavigateTab('dashboard'); onStartFocus(25); } },
      { id: 'act-sync', group: '快速指令', title: isElectron ? '立即同步中央大學 eeclass 與雲端資料' : '立即同步雲端最新資料', icon: RefreshCw, run: () => onTriggerSync() },
      ...(isElectron ? [{ id: 'act-alert', group: '快速指令', title: '立即測試並彈出警告視窗', icon: BellRing, run: () => onTriggerAlertTest() }] : []),
      { id: 'act-new-task', group: '快速指令', title: '新增每日／學期任務', icon: Plus, run: () => onOpenNewTask() },
      { id: 'act-theme', group: '快速指令', title: `切換為${theme === 'light' ? '深色' : '淺色'}外觀主題`, icon: theme === 'light' ? Moon : Sun, run: () => onToggleTheme() },
      { id: 'act-settings', group: '快速指令', title: '開啟系統與雲端同步設定', icon: Settings, run: () => onOpenSettings() },
    ];

    // 2. Navigation Tabs
    const navs = [
      { id: 'nav-dashboard', group: '頁面導覽', title: '總覽首頁 (Dashboard)', icon: Home, run: () => onNavigateTab('dashboard') },
      { id: 'nav-assignments', group: '頁面導覽', title: '作業管理看板', icon: CheckSquare, run: () => onNavigateTab('assignments') },
      { id: 'nav-exams', group: '頁面導覽', title: '考試日程與倒數', icon: Calendar, run: () => onNavigateTab('exams') },
      { id: 'nav-missions', group: '頁面導覽', title: '每日任務與目標', icon: ListTodo, run: () => onNavigateTab('missions') },
      { id: 'nav-notes', group: '頁面導覽', title: '桌面便條管理', icon: StickyNote, run: () => onNavigateTab('notes') },
      { id: 'nav-vault', group: '頁面導覽', title: 'AI 成果庫 (教材與題庫)', icon: FolderGit2, run: () => onNavigateTab('vault') },
      { id: 'nav-courses', group: '頁面導覽', title: '科目與本學期課表', icon: BookOpen, run: () => onNavigateTab('courses') },
    ];

    for (const a of [...actions, ...navs]) {
      if (!q || a.title.toLowerCase().includes(q) || a.group.toLowerCase().includes(q)) {
        list.push(a);
      }
    }

    // 3. Pending Assignments
    for (const hw of trackerData?.assignments || []) {
      if (hw.status === 'completed') continue;
      const hay = `${hw.course} ${hw.title}`.toLowerCase();
      if (q && !hay.includes(q)) continue;
      list.push({
        id: `hw-${hw.id}`,
        group: '待繳作業',
        title: hw.title,
        subtitle: `${hw.course}${hw.dueDate ? ` · 截止 ${hw.dueDate}` : ''}`,
        icon: CheckSquare,
        run: () => onNavigateTab('assignments'),
      });
    }

    // 4. Deliverables (when searching or top 6)
    const deliverables = trackerData?.deliverables || [];
    let delCount = 0;
    for (const d of deliverables) {
      const hay = `${d.course || ''} ${d.title || ''} ${(d.tags || []).join(' ')}`.toLowerCase();
      if (q && !hay.includes(q)) continue;
      if (!q && delCount >= 4) break;
      delCount++;
      list.push({
        id: `del-${d.id}`,
        group: 'AI 成果庫',
        title: d.title,
        subtitle: `${d.course} · ${d.path}`,
        icon: FileText,
        run: () => onPreviewFile({ title: d.title, path: d.path, course: d.course }),
      });
      if (delCount >= 12) break;
    }

    return list;
  }, [query, trackerData, theme, onNavigateTab, onPreviewFile, onTriggerSync, onTriggerAlertTest, onStartFocus, onToggleTheme, onOpenSettings, onOpenNewTask]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (items.length ? (prev + 1) % items.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (items.length ? (prev - 1 + items.length) % items.length : 0));
      } else if (e.key === 'Enter' && items[activeIndex]) {
        e.preventDefault();
        items[activeIndex].run();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, activeIndex, onClose]);

  return (
    <div className="modal-overlay" style={{ alignItems: 'flex-start', paddingTop: '11vh' }} onClick={onClose}>
      <div className="cmd-palette-box" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-palette-input-row">
          <Search size={17} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="輸入指令、科目、作業或教材關鍵字..."
            className="cmd-palette-input"
          />
          <kbd className="kbd-chip">ESC</kbd>
        </div>

        <div className="cmd-palette-list">
          {items.length === 0 ? (
            <div className="empty-mini" style={{ padding: '2rem' }}>找不到符合「{query}」的項目</div>
          ) : (
            items.map((item, idx) => {
              const Icon = item.icon;
              const showGroup = idx === 0 || items[idx - 1].group !== item.group;
              return (
                <div key={item.id}>
                  {showGroup && <div className="cmd-group-label">{item.group}</div>}
                  <button
                    type="button"
                    className={`cmd-item-row ${idx === activeIndex ? 'active' : ''}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      item.run();
                      onClose();
                    }}
                  >
                    <Icon size={15} className="cmd-item-icon" />
                    <div className="cmd-item-text">
                      <div className="cmd-item-title">{item.title}</div>
                      {item.subtitle && <div className="cmd-item-sub">{item.subtitle}</div>}
                    </div>
                    {idx === activeIndex && <CornerDownLeft size={13} style={{ color: 'var(--text-dim)' }} />}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
