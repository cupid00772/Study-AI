import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Sparkles,
  FileText,
  Code,
  BookOpen,
  Layers,
  Folder,
  FolderOpen,
  ChevronRight,
  ArrowLeft,
  Home,
  Plus,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Grid,
  List,
  Cpu,
  Binary,
  TrendingUp,
  BarChart3,
  Globe,
  Award,
  FolderPlus,
  FileCheck,
  RefreshCw,
  Cloud,
  CloudOff,
  Edit3,
  FilePlus2,
  SlidersHorizontal,
  Wand2,
} from 'lucide-react';
import ImportMaterialModal from './ImportMaterialModal';
import SlidingContainer from './SlidingContainer';
import VaultSubjectModal from './VaultSubjectModal';
import { resolveVaultSubjectIcon } from '../utils/vaultSubjectConfig';
import EditMaterialModal from './EditMaterialModal';
import CreateNoteModal from './CreateNoteModal';
import AiGenerateModal from './AiGenerateModal';
import { isAssetAvailableOnCloud } from '../services/cloudAssetService';

const CATEGORY_CONFIG = {
  Study_Materials: {
    key: 'Study_Materials',
    label: 'Study_Materials (學習教材庫)',
    shortLabel: 'Study_Materials',
    badge: '核心學習教材庫',
    icon: BookOpen,
    color: '#4285F4',
    bgSoft: 'rgba(66, 133, 244, 0.1)',
    desc: '系統化章節重點教材、重要定理推導與手機/桌面雙端互動背誦卡',
  },
  Test_Bank: {
    key: 'Test_Bank',
    label: 'Test_Bank (題庫與評量)',
    shortLabel: 'Test_Bank',
    badge: '題庫與模擬試卷',
    icon: FileCheck,
    color: '#9B72CF',
    bgSoft: 'rgba(155, 114, 207, 0.1)',
    desc: '台聯大/台大轉學考全真歷屆試題、單元衝刺測驗與逐題詳細解答',
  },
  Misc_Custom: {
    key: 'Misc_Custom',
    label: '雜項與自訂導入 (Custom & Reference)',
    shortLabel: '雜項與自訂導入',
    badge: '實習成果與自主導入',
    icon: Layers,
    color: '#34A853',
    bgSoft: 'rgba(52, 168, 83, 0.1)',
    desc: 'NCU 校園實地觀測心得報告、外部參考資料與個人自由導入之學習成果',
  },
};

const COURSE_ICON_MAP = {
  '作業系統': { icon: Cpu, color: '#4285F4' },
  '資料結構': { icon: Binary, color: '#9B72CF' },
  '資料與檔案結構': { icon: Binary, color: '#9B72CF' },
  '經濟學': { icon: TrendingUp, color: '#D96570' },
  '統計學': { icon: BarChart3, color: '#1BA0E2' },
  '機率與統計': { icon: BarChart3, color: '#1BA0E2' },
  '微積分': { icon: Award, color: '#FBBC04' },
  '計算機概論': { icon: Cpu, color: '#7952B3' },
  '通識地球物理': { icon: Globe, color: '#34A853' },
  '台聯大/台大轉學考': { icon: Award, color: '#E37400' },
};

const TYPE_CONFIG = {
  recitation: { label: '互動背誦卡', color: 'badge-purple', icon: Code },
  notes: { label: '教材筆記', color: 'badge-blue', icon: BookOpen },
  exam: { label: '考卷詳解', color: 'badge-pink', icon: FileCheck },
  report: { label: '實習報告', color: 'badge-green', icon: Layers },
  custom: { label: '自訂成果', color: 'badge-amber', icon: FolderPlus },
};

function getItemCategory(item) {
  if (item.category && CATEGORY_CONFIG[item.category]) {
    return item.category;
  }
  const p = item.path || '';
  if (p.startsWith('Study_Materials')) return 'Study_Materials';
  if (p.startsWith('Test_Bank')) return 'Test_Bank';
  return 'Misc_Custom';
}

function isTextEditableDeliverable(item) {
  const ext = String(item?.format || item?.path?.split('.').pop() || '').toLowerCase();
  return ['md', 'html', 'htm', 'txt', 'json'].includes(ext);
}

export default function ArtifactVault({
  deliverables = [],
  vaultSubjects = [],
  courses = [],
  onPreviewFile,
  onSaveDeliverables,
  onAddDeliverable,
  onUpdateDeliverable,
  onDeleteDeliverable,
  onSaveVaultSubject,
  onDeleteVaultSubject,
  onRequireUnlock,
  onOpenAiSettings,
  assetManifestVersion = 0,
}) {
  const isElectron = Boolean(window.electronAPI?.isElectron);
  const displayDeliverables = useMemo(() => {
    return Array.isArray(deliverables) ? deliverables : [];
  }, [deliverables]);
  const displayVaultSubjects = useMemo(() => {
    return Array.isArray(vaultSubjects) ? vaultSubjects : [];
  }, [vaultSubjects]);

  // Explorer Navigation Path: [] for Root; [catKey] for Category; [catKey, courseName] for Course
  const [pathSegments, setPathSegments] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('ALL');
  const [cloudOnlyFilter, setCloudOnlyFilter] = useState(false);

  // Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingDeliverable, setEditingDeliverable] = useState(null);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [isAiGenOpen, setIsAiGenOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2600);
  }, []);

  const handleCopyPath = useCallback((e, path) => {
    e.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(path);
      showToast(`已複製路徑：${path}`);
    }
  }, [showToast]);

  const handleOpenExternal = useCallback((e, path) => {
    e.stopPropagation();
    if (window.electronAPI?.openExternalPath) {
      window.electronAPI.openExternalPath(path);
    }
  }, []);

  const handleShowInFolder = useCallback((e, path) => {
    e.stopPropagation();
    if (window.electronAPI?.showItemInFolder) {
      window.electronAPI.showItemInFolder(path);
    }
  }, []);

  const customSubjectMap = useMemo(() => {
    const map = new Map();
    for (const s of displayVaultSubjects) {
      if (s?.name) map.set(s.name, s);
    }
    return map;
  }, [displayVaultSubjects]);

  const resolveCourseStyle = useCallback((courseName) => {
    const custom = customSubjectMap.get(courseName);
    if (custom) {
      return {
        icon: resolveVaultSubjectIcon(custom.icon),
        color: custom.color || '#4285F4',
        customSubject: custom,
      };
    }
    const preset = COURSE_ICON_MAP[courseName];
    if (preset) {
      return { ...preset, customSubject: null };
    }
    return { icon: BookOpen, color: 'var(--gemini-blue)', customSubject: null };
  }, [customSubjectMap]);

  // Compute Categorized Data (including empty Vault-only subjects!)
  const categorizedData = useMemo(() => {
    const categories = {
      Study_Materials: { ...CATEGORY_CONFIG.Study_Materials, items: [], courses: {} },
      Test_Bank: { ...CATEGORY_CONFIG.Test_Bank, items: [], courses: {} },
      Misc_Custom: { ...CATEGORY_CONFIG.Misc_Custom, items: [], courses: {} },
    };

    // Seed custom vault-only subjects first so 0-file folders remain visible
    displayVaultSubjects.forEach((subj) => {
      if (!subj?.name) return;
      const targetCats = Array.isArray(subj.categories) && subj.categories.length > 0
        ? subj.categories
        : ['Study_Materials', 'Test_Bank'];
      targetCats.forEach((catKey) => {
        if (categories[catKey] && !categories[catKey].courses[subj.name]) {
          categories[catKey].courses[subj.name] = [];
        }
      });
    });

    displayDeliverables.forEach((item) => {
      const catKey = getItemCategory(item);
      const targetCat = categories[catKey] || categories.Misc_Custom;
      targetCat.items.push(item);

      const courseName = item.course || '未分類科目';
      if (!targetCat.courses[courseName]) {
        targetCat.courses[courseName] = [];
      }
      targetCat.courses[courseName].push(item);
    });

    return categories;
  }, [displayDeliverables, displayVaultSubjects]);

  // Vault subject names for modals (Vault subjects + deliverables courses + semester courses for convenience)
  const existingVaultSubjectNames = useMemo(() => {
    const set = new Set();
    displayVaultSubjects.forEach((s) => { if (s?.name) set.add(s.name); });
    displayDeliverables.forEach((d) => { if (d?.course) set.add(d.course); });
    courses.forEach((c) => {
      const name = typeof c === 'string' ? c : c?.name;
      if (name) set.add(name);
    });
    return Array.from(set).filter(Boolean);
  }, [displayVaultSubjects, displayDeliverables, courses]);

  const currentCategoryKey = pathSegments[0] || null;
  const currentCourseKey = pathSegments[1] || null;

  const scopedItems = useMemo(() => {
    let items = displayDeliverables;

    if (currentCategoryKey) {
      items = items.filter((d) => getItemCategory(d) === currentCategoryKey);
    }

    if (currentCourseKey) {
      items = items.filter((d) => d.course === currentCourseKey);
    }

    if (formatFilter !== 'ALL') {
      items = items.filter((d) => (d.format || '').toLowerCase() === formatFilter.toLowerCase());
    }

    if (!isElectron && cloudOnlyFilter && assetManifestVersion >= 0) {
      items = items.filter((d) => isAssetAvailableOnCloud(d.path));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((d) =>
        d.title?.toLowerCase().includes(q) ||
        d.course?.toLowerCase().includes(q) ||
        d.summary?.toLowerCase().includes(q) ||
        d.path?.toLowerCase().includes(q) ||
        d.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return items;
  }, [displayDeliverables, currentCategoryKey, currentCourseKey, formatFilter, searchQuery, isElectron, cloudOnlyFilter, assetManifestVersion]);

  const navigateToRoot = () => {
    setPathSegments([]);
    setSearchQuery('');
  };

  const navigateToCategory = (catKey) => {
    setPathSegments([catKey]);
    setSearchQuery('');
  };

  const navigateToCourse = (catKey, courseName) => {
    setPathSegments([catKey, courseName]);
  };

  const navigateUp = () => {
    if (pathSegments.length > 0) {
      setPathSegments((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const handleImportNew = (newDeliverable) => {
    if (onAddDeliverable) {
      onAddDeliverable(newDeliverable);
    } else if (onSaveDeliverables) {
      onSaveDeliverables([newDeliverable, ...displayDeliverables]);
    }
    showToast(`成功導入「${newDeliverable.title}」！`);
    const cat = getItemCategory(newDeliverable);
    setPathSegments([cat, newDeliverable.course]);
  };

  const handleNoteCreated = async (newDeliverable, initialContent) => {
    if (onAddDeliverable) {
      await onAddDeliverable(newDeliverable);
    } else if (onSaveDeliverables) {
      await onSaveDeliverables([newDeliverable, ...displayDeliverables]);
    }
    const cat = getItemCategory(newDeliverable);
    setPathSegments([cat, newDeliverable.course]);
    onPreviewFile?.({
      ...newDeliverable,
      initialContent,
      startInEditMode: true,
    });
  };

  const handleAiSavedDeliverables = async (newItems) => {
    if (!Array.isArray(newItems) || newItems.length === 0) return;
    if (onSaveDeliverables) {
      await onSaveDeliverables([...newItems, ...displayDeliverables]);
    } else if (onAddDeliverable) {
      for (const item of newItems) {
        await onAddDeliverable(item);
      }
    }
    const first = newItems[0];
    if (first) {
      setPathSegments([getItemCategory(first), first.course]);
    }
    showToast(`已收錄 ${newItems.length} 份 AI 生成成果！`);
  };

  const handleSaveSubjectAndNavigate = async (subjectData) => {
    await onSaveVaultSubject?.(subjectData);
    if (subjectData.previousName && currentCourseKey === subjectData.previousName) {
      setPathSegments([currentCategoryKey || 'Study_Materials', subjectData.name]);
    } else if (!subjectData.previousName) {
      const targetCat = currentCategoryKey && subjectData.categories?.includes(currentCategoryKey)
        ? currentCategoryKey
        : (subjectData.categories?.[0] || 'Study_Materials');
      setPathSegments([targetCat, subjectData.name]);
    }
  };

  const handleScanWorkspace = async () => {
    if (!window.electronAPI?.scanWorkspaceDeliverables) {
      showToast('此功能需在 Electron 桌面端執行。');
      return;
    }
    setIsScanning(true);
    try {
      const res = await window.electronAPI.scanWorkspaceDeliverables();
      if (res && res.success && res.files) {
        const existingPaths = new Set(displayDeliverables.map((d) => d.path.replace(/\\/g, '/')));
        const newFiles = res.files.filter((f) => !existingPaths.has(f.path));

        if (newFiles.length === 0) {
          showToast('已完成檢查：目前工作區所有教材與題庫皆已完整收錄！');
        } else {
          const autoAdded = newFiles.map((f) => ({
            id: `del-auto-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            title: f.filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
            course: f.course,
            category: f.category,
            type: f.category === 'Test_Bank' ? 'exam' : f.ext === 'html' ? 'recitation' : 'notes',
            path: f.path,
            format: f.ext,
            certified: true,
            updatedAt: new Date().toISOString().slice(0, 10),
            summary: `自工作區目錄 ${f.path} 自動發現並認證之學習資料。`,
            tags: ['AI認證', f.course, '自動收錄'],
          }));

          const updated = [...autoAdded, ...displayDeliverables];
          if (onSaveDeliverables) {
            await onSaveDeliverables(updated);
          }
          showToast(`已成功發現並收錄 ${autoAdded.length} 份新學習資料！`);
        }
      }
    } catch (err) {
      showToast(`掃描失敗：${err.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const totalCertifiedCount = displayDeliverables.filter((d) => d.certified !== false).length;
  const totalCoursesCount = useMemo(() => {
    const set = new Set();
    displayVaultSubjects.forEach((s) => { if (s?.name) set.add(s.name); });
    displayDeliverables.forEach((d) => { if (d?.course) set.add(d.course); });
    return set.size;
  }, [displayVaultSubjects, displayDeliverables]);

  const currentCourseStyle = currentCourseKey ? resolveCourseStyle(currentCourseKey) : null;

  return (
    <div className="explorer-container">
      {/* 1. File Explorer Toolbar & Breadcrumb */}
      <div className="explorer-toolbar">
        {/* Breadcrumbs */}
        <div className="explorer-breadcrumbs">
          <button
            type="button"
            className="btn btn-secondary btn-icon-circle"
            onClick={navigateUp}
            disabled={pathSegments.length === 0}
            title="返回上一層資料夾"
            aria-label="返回上一層資料夾"
            style={{ width: 32, height: 32, opacity: pathSegments.length === 0 ? 0.4 : 1 }}
          >
            <ArrowLeft size={16} />
          </button>

          <button
            className={`breadcrumb-pill ${pathSegments.length === 0 ? 'active' : ''}`}
            onClick={navigateToRoot}
          >
            <Home size={14} /> 成果總庫 (Root)
          </button>

          {currentCategoryKey && (
            <>
              <span className="breadcrumb-separator"><ChevronRight size={14} /></span>
              <button
                className={`breadcrumb-pill ${!currentCourseKey ? 'active' : ''}`}
                onClick={() => navigateToCategory(currentCategoryKey)}
              >
                <FolderOpen size={14} style={{ color: CATEGORY_CONFIG[currentCategoryKey]?.color }} />
                {CATEGORY_CONFIG[currentCategoryKey]?.shortLabel || currentCategoryKey}
              </button>
            </>
          )}

          {currentCourseKey && (
            <>
              <span className="breadcrumb-separator"><ChevronRight size={14} /></span>
              <button className="breadcrumb-pill active">
                <BookOpen size={14} />
                {currentCourseKey}
              </button>
            </>
          )}
        </div>

        {/* Right Search & Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div className="search-input-wrapper" style={{ width: '205px' }}>
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder={currentCourseKey ? `搜尋 ${currentCourseKey}...` : '搜尋成果、標籤或科目...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.4rem 0.75rem 0.4rem 2rem', fontSize: '0.82rem', width: '100%' }}
            />
          </div>

          <SlidingContainer
            className="nav-pills"
            activeKey={viewMode}
            indicatorClassName="sliding-pill-indicator pill-slider"
            style={{ padding: '2px' }}
          >
            <button
              type="button"
              className={`nav-pill-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="卡片網格檢視"
              aria-label="卡片網格檢視"
              aria-pressed={viewMode === 'grid'}
              style={{ padding: '0.35rem 0.65rem' }}
            >
              <Grid size={15} />
            </button>
            <button
              type="button"
              className={`nav-pill-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="詳細資料清單檢視 (File Explorer 模式)"
              aria-label="詳細資料清單檢視"
              aria-pressed={viewMode === 'list'}
              style={{ padding: '0.35rem 0.65rem' }}
            >
              <List size={15} />
            </button>
          </SlidingContainer>

          {!isElectron && (
            <button
              className={`btn btn-sm ${cloudOnlyFilter ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCloudOnlyFilter((p) => !p)}
              title="只顯示已同步至雲端可直接閱讀的教材"
              style={{ fontSize: '0.78rem', gap: '5px' }}
            >
              <Cloud size={14} /> {cloudOnlyFilter ? '僅雲端可讀' : '全部檔案'}
            </button>
          )}

          {isElectron && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleScanWorkspace}
              disabled={isScanning}
              title="掃描 Study_Materials 與 Test_Bank 內尚未收錄的新教材或試卷"
            >
              <RefreshCw size={14} className={isScanning ? 'spin' : ''} /> 掃描
            </button>
          )}

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setEditingSubject(null); setIsSubjectModalOpen(true); }}
            title="新增 AI 成果庫專屬科目資料夾（不影響課表）"
          >
            <FolderPlus size={14} /> 新增科目
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsCreateNoteOpen(true)}
            title="直接新建空白或模板 Markdown 筆記並編輯"
          >
            <FilePlus2 size={14} /> 新建筆記
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Plus size={14} /> {isElectron ? '導入' : '上傳'}
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsAiGenOpen(true)}
            title="直接使用 AI 依現有教材生成模擬考卷、重點整理或互動背誦卡"
          >
            <Wand2 size={14} /> AI 生題／教材
          </button>
        </div>
      </div>

      {/* Animated stage wrapper for smooth folder navigation */}
      <div key={`${pathSegments.join('/')}-${Boolean(searchQuery.trim())}`} className="tab-view-stage" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 2. Top Stats Overview (Visible on Root) */}
        {pathSegments.length === 0 && !searchQuery.trim() && (
          <div className="explorer-stat-banner">
            <div className="explorer-stat-card">
              <div className="explorer-stat-icon" style={{ background: 'rgba(66, 133, 244, 0.12)', color: 'var(--gemini-blue)' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="explorer-stat-val">{totalCertifiedCount} 份</div>
                <div className="explorer-stat-label">AI 認證學習資料總數</div>
              </div>
            </div>

            <div className="explorer-stat-card">
              <div className="explorer-stat-icon" style={{ background: 'rgba(155, 114, 207, 0.12)', color: 'var(--gemini-purple)' }}>
                <BookOpen size={24} />
              </div>
              <div>
                <div className="explorer-stat-val">{totalCoursesCount} 門</div>
                <div className="explorer-stat-label">成果庫科目資料夾</div>
              </div>
            </div>

            <div className="explorer-stat-card">
              <div className="explorer-stat-icon" style={{ background: 'rgba(52, 168, 83, 0.12)', color: 'var(--gemini-emerald)' }}>
                <Edit3 size={22} />
              </div>
              <div>
                <div className="explorer-stat-val">即時編輯</div>
                <div className="explorer-stat-label">Markdown 分割預覽＋雲端同步</div>
              </div>
            </div>

            <div
              className="explorer-stat-card"
              role="button"
              tabIndex={0}
              onClick={() => setIsAiGenOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsAiGenOpen(true);
                }
              }}
              style={{ cursor: 'pointer', borderColor: 'rgba(99, 102, 241, 0.35)', background: 'var(--gemini-gradient-soft)' }}
              title="開啟 AI 成果庫生成工作室"
            >
              <div className="explorer-stat-icon" style={{ background: 'var(--accent-gradient)', color: '#fff' }}>
                <Sparkles size={22} />
              </div>
              <div>
                <div className="explorer-stat-val" style={{ fontSize: '1.08rem' }}>AI 智慧出題</div>
                <div className="explorer-stat-label">點擊生成考卷、教材與背誦卡 ➔</div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            LEVEL 0: ROOT VIEW - PREVIEW ALL THREE FOLDERS
           ========================================================================= */}
        {pathSegments.length === 0 && !searchQuery.trim() && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.15rem', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ fontSize: '1.12rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderOpen size={20} style={{ color: 'var(--gemini-blue)' }} />
                核心成果目錄總覽
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                點擊進入任一目錄瀏覽科目，或點上方「新增科目」／「AI 生題」
              </span>
            </div>

            <div className="folder-hero-grid">
              {Object.values(categorizedData).map((cat) => {
                const IconComp = cat.icon;
                const courseKeys = Object.keys(cat.courses);
                const previewItems = cat.items.slice(0, 3);

                return (
                  <div
                    key={cat.key}
                    className="folder-hero-card"
                    onClick={() => navigateToCategory(cat.key)}
                    style={{ '--card-accent': cat.color }}
                  >
                    <div>
                      <div className="folder-hero-header">
                        <div className="vault-icon-badge" style={{ background: cat.bgSoft, color: cat.color }}>
                          <IconComp size={24} />
                        </div>
                        <span className="badge-chip" style={{ background: cat.bgSoft, color: cat.color, fontWeight: 700 }}>
                          {cat.badge}
                        </span>
                      </div>

                      <h3 className="folder-hero-title">📁 {cat.shortLabel}</h3>
                      <div className="folder-hero-desc">{cat.desc}</div>

                      <div style={{ display: 'flex', gap: '10px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>
                        <span>📄 {cat.items.length} 份認證資料</span>
                        <span>•</span>
                        <span>📚 {courseKeys.length} 個科目</span>
                      </div>

                      <div className="folder-preview-pills">
                        {courseKeys.map((cName) => (
                          <span
                            key={cName}
                            className="badge-chip"
                            style={{ fontSize: '0.72rem', background: 'var(--bg-input)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToCourse(cat.key, cName);
                            }}
                          >
                            {cName} ({cat.courses[cName].length})
                          </span>
                        ))}
                      </div>

                      {previewItems.length > 0 && (
                        <div className="folder-recent-list">
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '2px' }}>
                            精選認證檔案預覽：
                          </div>
                          {previewItems.map((pItem) => (
                            <div
                              key={pItem.id}
                              className="folder-recent-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPreviewFile(pItem);
                              }}
                              title={`快速預覽 ${pItem.title}`}
                            >
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '210px' }}>
                                • {pItem.title}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--gemini-blue)', fontWeight: 600 }}>
                                開啟 ➔
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>點擊進入瀏覽科目</span>
                      <button
                        className="btn btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToCategory(cat.key);
                        }}
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                      >
                        開啟資料夾 ➔
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Highlights / Fast Track Section */}
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} style={{ color: 'var(--gemini-purple)' }} />
                  最新學習成果與 AI 認證資料 (Fast Track)
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>支援點擊直接閱讀或進入即時編輯</span>
              </div>

              <div className="vault-grid">
                {displayDeliverables.slice(0, 4).map((item) => {
                  const typeInfo = TYPE_CONFIG[item.type] || { label: item.type, color: 'badge-blue', icon: FileText };
                  const IconComponent = typeInfo.icon;
                  const editable = isTextEditableDeliverable(item);

                  return (
                    <div
                      key={item.id}
                      className="vault-card"
                      onClick={() => onPreviewFile(item)}
                    >
                      <div>
                        <div className="vault-card-header">
                          <div className="vault-icon-badge" style={{ background: 'var(--gemini-gradient-soft)' }}>
                            <IconComponent size={20} />
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className="badge-certified">
                              <ShieldCheck size={12} /> AI 認證
                            </span>
                            <span className="badge-chip badge-blue">{item.course}</span>
                            <span className={`badge-chip ${typeInfo.color}`}>{typeInfo.label}</span>
                          </div>
                        </div>

                        <h3 className="vault-title">{item.title}</h3>
                        <div className="vault-summary">{item.summary}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.65rem', wordBreak: 'break-all' }}>
                          <code>{item.path}</code>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                          <span style={{ color: 'var(--text-dim)' }}>{item.updatedAt || '最近更新'}</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {editable && (
                              <button
                                className="btn-action-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPreviewFile({ ...item, startInEditMode: true });
                                }}
                                title="編輯檔案內文"
                              >
                                <Edit3 size={12} /> 編輯
                              </button>
                            )}
                            <button
                              className="btn-action-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingDeliverable(item);
                              }}
                              title="修改資訊或移除"
                            >
                              <SlidersHorizontal size={12} />
                            </button>
                            <button
                              className="btn btn-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPreviewFile(item);
                              }}
                              style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                            >
                              <Sparkles size={13} /> 預覽
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* =========================================================================
            LEVEL 1: CATEGORY VIEW - SUBJECT CLASSIFICATION
           ========================================================================= */}
        {currentCategoryKey && !currentCourseKey && !searchQuery.trim() && (
          <div>
            <div style={{
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.2rem 1.45rem',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="vault-icon-badge" style={{
                  background: CATEGORY_CONFIG[currentCategoryKey]?.bgSoft,
                  color: CATEGORY_CONFIG[currentCategoryKey]?.color,
                  width: 48,
                  height: 48,
                }}>
                  {(() => {
                    const Icon = CATEGORY_CONFIG[currentCategoryKey]?.icon || Folder;
                    return <Icon size={26} />;
                  })()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.22rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    {CATEGORY_CONFIG[currentCategoryKey]?.label}
                  </h2>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    {CATEGORY_CONFIG[currentCategoryKey]?.desc}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="badge-chip" style={{ background: 'var(--bg-input)', fontSize: '0.8rem', padding: '0.38rem 0.85rem' }}>
                  收錄 <strong>{scopedItems.length}</strong> 份資料
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setEditingSubject(null); setIsSubjectModalOpen(true); }}
                >
                  <FolderPlus size={14} /> 新增科目資料夾
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsAiGenOpen(true)}
                >
                  <Wand2 size={14} /> AI 生題／教材
                </button>
              </div>
            </div>

            {/* Subject Folders Grid */}
            <div style={{ marginBottom: '1.45rem' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Folder size={18} style={{ color: 'var(--gemini-blue)' }} />
                科目分類資料夾（點擊進入，滑鼠移上可改名或調整圖示）
              </h3>

              <div className="subject-folder-grid">
                {Object.entries(categorizedData[currentCategoryKey]?.courses || {}).map(([courseName, cItems]) => {
                  const styleCfg = resolveCourseStyle(courseName);
                  const CourseIcon = styleCfg.icon;

                  return (
                    <div
                      key={courseName}
                      className="subject-folder-card"
                      onClick={() => navigateToCourse(currentCategoryKey, courseName)}
                      style={{ '--course-color': styleCfg.color }}
                    >
                      <div className="vault-icon-badge" style={{ background: 'var(--bg-input)', color: styleCfg.color, width: 38, height: 38 }}>
                        <CourseIcon size={20} />
                      </div>

                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {courseName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span><strong>{cItems.length}</strong> 份學習資料</span>
                          {styleCfg.customSubject && (
                            <span style={{ fontSize: '0.67rem', color: styleCfg.color, fontWeight: 700 }}>• 自訂科目</span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="icon-ghost-btn subject-folder-edit-btn"
                        title="編輯科目名稱／圖示／顏色"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSubject(
                            styleCfg.customSubject || {
                              id: `vsubj-${Date.now()}`,
                              name: courseName,
                              categories: [currentCategoryKey],
                              color: styleCfg.color.startsWith('#') ? styleCfg.color : '#4285F4',
                              icon: 'book',
                            }
                          );
                          setIsSubjectModalOpen(true);
                        }}
                      >
                        <Edit3 size={14} />
                      </button>

                      <ChevronRight size={17} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category items heading + format slider */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={18} style={{ color: 'var(--gemini-emerald)' }} />
                此分類下所有學習資料 ({scopedItems.length} 份)
              </h3>

              <SlidingContainer
                className="nav-pills"
                activeKey={formatFilter}
                indicatorClassName="sliding-pill-indicator pill-slider"
                style={{ padding: '2px' }}
              >
                {['ALL', 'md', 'html', 'pdf'].map((fmt) => (
                  <button
                    key={fmt}
                    className={`nav-pill-btn ${formatFilter === fmt ? 'active' : ''}`}
                    onClick={() => setFormatFilter(fmt)}
                    style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem' }}
                  >
                    {fmt === 'ALL' ? '全部格式' : fmt.toUpperCase()}
                  </button>
                ))}
              </SlidingContainer>
            </div>
          </div>
        )}

        {/* =========================================================================
            LEVEL 2: SUBJECT DETAIL VIEW
           ========================================================================= */}
        {currentCourseKey && (
          <div style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.2rem 1.45rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="vault-icon-badge" style={{
                background: 'var(--gemini-gradient-soft)',
                color: currentCourseStyle?.color || 'var(--gemini-blue)',
                width: 48,
                height: 48,
              }}>
                {(() => {
                  const Icon = currentCourseStyle?.icon || BookOpen;
                  return <Icon size={26} />;
                })()}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.22rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    {currentCourseKey}
                  </h2>
                  <span className="badge-chip badge-blue">{CATEGORY_CONFIG[currentCategoryKey]?.shortLabel}</span>
                  <button
                    type="button"
                    className="icon-ghost-btn"
                    title="編輯此科目名稱／樣式"
                    onClick={() => {
                      setEditingSubject(
                        currentCourseStyle?.customSubject || {
                          id: `vsubj-${Date.now()}`,
                          name: currentCourseKey,
                          categories: [currentCategoryKey || 'Study_Materials', 'Test_Bank'],
                          color: currentCourseStyle?.color?.startsWith('#') ? currentCourseStyle.color : '#4285F4',
                          icon: 'book',
                        }
                      );
                      setIsSubjectModalOpen(true);
                    }}
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                  此科目共收錄 <strong>{scopedItems.length}</strong> 份教材筆記、速記卡與測驗題庫
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <SlidingContainer
                className="nav-pills"
                activeKey={formatFilter}
                indicatorClassName="sliding-pill-indicator pill-slider"
                style={{ padding: '2px' }}
              >
                {['ALL', 'md', 'html', 'pdf'].map((fmt) => (
                  <button
                    key={fmt}
                    className={`nav-pill-btn ${formatFilter === fmt ? 'active' : ''}`}
                    onClick={() => setFormatFilter(fmt)}
                    style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem' }}
                  >
                    {fmt === 'ALL' ? '全部格式' : fmt.toUpperCase()}
                  </button>
                ))}
              </SlidingContainer>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsCreateNoteOpen(true)}
              >
                <FilePlus2 size={14} /> 新建筆記
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsAiGenOpen(true)}
              >
                <Wand2 size={14} /> 為此科 AI 生題
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            ITEMS DISPLAY: GRID OR LIST MODE
           ========================================================================= */}
        {(pathSegments.length > 0 || searchQuery.trim()) && (
          <>
            {scopedItems.length === 0 ? (
              <div className="gemini-card" style={{ textAlign: 'center', padding: '3.2rem 2rem' }}>
                <Sparkles size={40} style={{ color: 'var(--gemini-purple)', marginBottom: '0.9rem' }} />
                <h3>目前此資料夾尚未有學習資料</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0.5rem auto 1.4rem', fontSize: '0.88rem' }}>
                  你可以直接用內建 AI 幫「{currentCourseKey || '此分類'}」生成模擬試卷或重點整理，或是新建空白 Markdown 筆記與導入現有檔案！
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => setIsAiGenOpen(true)}>
                    <Wand2 size={15} /> AI 智慧生成考題／教材
                  </button>
                  <button className="btn btn-secondary" onClick={() => setIsCreateNoteOpen(true)}>
                    <FilePlus2 size={15} /> 新建 Markdown 筆記
                  </button>
                  <button className="btn btn-secondary" onClick={() => setIsImportModalOpen(true)}>
                    <Plus size={15} /> 導入既有檔案
                  </button>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="vault-grid">
                {scopedItems.map((item) => {
                  const typeInfo = TYPE_CONFIG[item.type] || { label: item.type, color: 'badge-blue', icon: FileText };
                  const IconComponent = typeInfo.icon;
                  const editable = isTextEditableDeliverable(item);

                  return (
                    <div
                      key={item.id}
                      className="vault-card"
                      onClick={() => onPreviewFile(item)}
                    >
                      <div>
                        <div className="vault-card-header">
                          <div className="vault-icon-badge">
                            <IconComponent size={20} />
                          </div>
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {item.certified !== false && (
                              <span className="badge-certified" title="AI 審核認證之學習資料">
                                <ShieldCheck size={12} /> AI 認證
                              </span>
                            )}
                            <span className="badge-chip badge-blue">{item.course}</span>
                            <span className={`badge-chip ${typeInfo.color}`}>{typeInfo.label}</span>
                            {item.format && (
                              <span className="badge-chip" style={{ background: 'var(--bg-input)', fontSize: '0.72rem' }}>
                                .{item.format.toLowerCase()}
                              </span>
                            )}
                            {!isElectron && (
                              isAssetAvailableOnCloud(item.path) ? (
                                <span className="badge-chip badge-green" style={{ fontSize: '0.68rem' }} title="已同步雲端，行動端可直接閱讀">
                                  <Cloud size={11} /> 雲端
                                </span>
                              ) : (
                                <span className="badge-chip" style={{ background: 'var(--bg-input)', color: 'var(--text-dim)', fontSize: '0.68rem' }} title="尚未上傳或為本機專屬大檔">
                                  <CloudOff size={11} /> 僅本機
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        <h3 className="vault-title">{item.title}</h3>
                        <div className="vault-summary">{item.summary}</div>
                      </div>

                      <div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="vault-tags" style={{ marginBottom: '0.65rem' }}>
                            {item.tags.map((tag, i) => (
                              <span key={i} style={{
                                fontSize: '0.72rem',
                                color: 'var(--text-muted)',
                                background: 'var(--bg-input)',
                                padding: '2px 8px',
                                borderRadius: '6px',
                              }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-dim)',
                          background: 'var(--bg-input)',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.75rem',
                        }}>
                          <code style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }} title={item.path}>
                            {item.path}
                          </code>
                          <button
                            className="btn-action-icon"
                            onClick={(e) => handleCopyPath(e, item.path)}
                            title="複製路徑"
                          >
                            <Copy size={12} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ color: 'var(--text-dim)' }}>{item.updatedAt || '最近更新'}</span>

                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {editable && (
                              <button
                                className="btn-action-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPreviewFile({ ...item, startInEditMode: true });
                                }}
                                title="直接編輯內文（即時預覽）"
                              >
                                <Edit3 size={12} /> 編輯
                              </button>
                            )}
                            <button
                              className="btn-action-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingDeliverable(item);
                              }}
                              title="修改標題／科目／摘要／標籤或刪除"
                            >
                              <SlidersHorizontal size={12} /> 管理
                            </button>
                            {isElectron && (
                              <>
                                <button
                                  className="btn-action-icon"
                                  onClick={(e) => handleOpenExternal(e, item.path)}
                                  title="以本機預設軟體開啟"
                                >
                                  <ExternalLink size={12} />
                                </button>
                                <button
                                  className="btn-action-icon"
                                  onClick={(e) => handleShowInFolder(e, item.path)}
                                  title="在 Windows 檔案總管中標記"
                                >
                                  <FolderOpen size={12} />
                                </button>
                              </>
                            )}
                            <button
                              className="btn btn-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPreviewFile(item);
                              }}
                              style={{ padding: '0.32rem 0.78rem', fontSize: '0.76rem' }}
                            >
                              <Sparkles size={12} /> 預覽
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="explorer-list-view">
                <div className="explorer-list-header">
                  <div>資料名稱 / 成果標題</div>
                  <div>所屬科目</div>
                  <div>類型</div>
                  <div>認證狀態</div>
                  <div>更新時間</div>
                  <div style={{ textAlign: 'right' }}>操作</div>
                </div>

                {scopedItems.map((item) => {
                  const typeInfo = TYPE_CONFIG[item.type] || { label: item.type, color: 'badge-blue', icon: FileText };
                  const IconComponent = typeInfo.icon;
                  const editable = isTextEditableDeliverable(item);

                  return (
                    <div
                      key={item.id}
                      className="explorer-list-row"
                      onClick={() => onPreviewFile(item)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                        <div className="vault-icon-badge" style={{ width: 32, height: 32, flexShrink: 0 }}>
                          <IconComponent size={16} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={item.title}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            <code>{item.path}</code>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="badge-chip badge-blue" style={{ fontSize: '0.74rem' }}>{item.course}</span>
                      </div>

                      <div>
                        <span className={`badge-chip ${typeInfo.color}`} style={{ fontSize: '0.74rem' }}>{typeInfo.label}</span>
                      </div>

                      <div>
                        {item.certified !== false ? (
                          <span className="badge-certified" style={{ fontSize: '0.72rem' }}>
                            <ShieldCheck size={12} /> AI 認證
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>自主收錄</span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.updatedAt || '最近'}
                      </div>

                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                        {editable && (
                          <button
                            className="btn-action-icon"
                            onClick={() => onPreviewFile({ ...item, startInEditMode: true })}
                            title="直接編輯檔案內文"
                          >
                            <Edit3 size={13} />
                          </button>
                        )}
                        <button
                          className="btn-action-icon"
                          onClick={() => setEditingDeliverable(item)}
                          title="修改資訊或移除"
                        >
                          <SlidersHorizontal size={13} />
                        </button>
                        {isElectron && (
                          <button
                            className="btn-action-icon"
                            onClick={(e) => handleShowInFolder(e, item.path)}
                            title="在檔案總管中顯示"
                          >
                            <FolderOpen size={13} />
                          </button>
                        )}
                        <button
                          className="btn btn-primary"
                          onClick={() => onPreviewFile(item)}
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.76rem' }}
                        >
                          預覽
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {isImportModalOpen && (
        <ImportMaterialModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImportNew}
          initialCategory={currentCategoryKey || 'Study_Materials'}
          existingCourses={existingVaultSubjectNames}
          onRequireUnlock={onRequireUnlock}
        />
      )}

      {isSubjectModalOpen && (
        <VaultSubjectModal
          isOpen={isSubjectModalOpen}
          onClose={() => { setIsSubjectModalOpen(false); setEditingSubject(null); }}
          initialSubject={editingSubject}
          defaultCategory={currentCategoryKey}
          existingNames={existingVaultSubjectNames}
          onSave={handleSaveSubjectAndNavigate}
          onDelete={(subj) => {
            onDeleteVaultSubject?.(subj);
            if (currentCourseKey === subj.name) {
              setPathSegments(currentCategoryKey ? [currentCategoryKey] : []);
            }
          }}
        />
      )}

      {editingDeliverable && (
        <EditMaterialModal
          item={editingDeliverable}
          existingCourses={existingVaultSubjectNames}
          onClose={() => setEditingDeliverable(null)}
          onSave={(updated) => onUpdateDeliverable?.(updated)}
          onDelete={(item, opts) => onDeleteDeliverable?.(item, opts)}
        />
      )}

      {isCreateNoteOpen && (
        <CreateNoteModal
          isOpen={isCreateNoteOpen}
          onClose={() => setIsCreateNoteOpen(false)}
          onCreated={handleNoteCreated}
          initialCategory={currentCategoryKey || 'Study_Materials'}
          initialCourse={currentCourseKey || existingVaultSubjectNames[0] || ''}
          existingCourses={existingVaultSubjectNames}
          onRequireUnlock={onRequireUnlock}
        />
      )}

      {isAiGenOpen && (
        <AiGenerateModal
          isOpen={isAiGenOpen}
          onClose={() => setIsAiGenOpen(false)}
          deliverables={displayDeliverables}
          existingCourses={existingVaultSubjectNames}
          initialCategory={currentCategoryKey}
          initialCourse={currentCourseKey}
          onSavedDeliverables={handleAiSavedDeliverables}
          onPreviewFile={onPreviewFile}
          onOpenSettings={onOpenAiSettings}
          onRequireUnlock={onRequireUnlock}
        />
      )}

      {toastMessage && (
        <div className="explorer-toast">
          <Check size={16} style={{ color: 'var(--gemini-emerald)' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
