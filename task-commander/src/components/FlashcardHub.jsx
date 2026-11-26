import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Zap,
  Play,
  Shuffle,
  Flame,
  Plus,
  Wand2,
  RefreshCw,
  Download,
  FileText,
  Search,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  PauseCircle,
  PlayCircle,
  CheckSquare,
  Square,
  RotateCcw,
  BarChart3,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { renderMarkdownWithKatex } from '../utils/markdownRenderer';
import { SUBJECT_CONFIG, getTodayISO } from '../utils/examArenaUtils';
import {
  FLASHCARD_PATHS,
  FLASHCARD_STATUS_META,
  CORE_FLASHCARD_SUBJECTS,
  computeFlashcardStats,
  buildStudyQueue,
  applySm2Review,
  isCardDue,
  isCardLeech,
  exportFlashcardsToAnkiTsv,
  addCardsWithDedup,
  normalizeFlashcard,
} from '../utils/flashcardUtils';
import FlashcardStudySession from './FlashcardStudySession';
import FlashcardEditorModal from './FlashcardEditorModal';
import FlashcardAiModal from './FlashcardAiModal';
import ConfirmDialog from './ConfirmDialog';

function MiniMarkdown({ content, className = '' }) {
  const html = useMemo(() => renderMarkdownWithKatex(content || ''), [content]);
  return (
    <div
      className={`fc-markdown markdown-body ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const STATUS_FILTERS = [
  { id: 'all', label: '全部卡片' },
  { id: 'due', label: '今日到期' },
  { id: 'leech', label: '🔥 頑固卡' },
  { id: 'new', label: '新卡' },
  { id: 'learning', label: '學習中' },
  { id: 'review', label: '複習中' },
  { id: 'mastered', label: '已穩固' },
  { id: 'suspended', label: '已暫停' },
];

export default function FlashcardHub({
  store,
  subjectFilter = 'ALL',
  courses = [],
  decayRows = [],
  mistakeBank = [],
  onUpdateStore,
  onResyncFromMd,
  onPreviewFile,
  onOpenAiSettings,
  showToast,
  pendingAction = null,
  onConsumePendingAction,
  onStudyActiveChange,
}) {
  const todayISO = getTodayISO();
  const cards = useMemo(() => (Array.isArray(store?.cards) ? store.cards : []), [store]);
  const stats = useMemo(() => computeFlashcardStats(store, todayISO), [store, todayISO]);

  // Active Focus Study session
  const [studySession, setStudySession] = useState(null); // { initialCards, mode, subjectLabel, isCramMode }

  const isStudying = Boolean(studySession);
  useEffect(() => {
    onStudyActiveChange?.(isStudying);
    if (isStudying) {
      const mainEl = document.querySelector('.app-main-scrollable');
      if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'instant' });
    }
    return () => {
      if (isStudying) onStudyActiveChange?.(false);
    };
  }, [isStudying, onStudyActiveChange]);

  // Hub UI controls
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [maskAll, setMaskAll] = useState(true);
  const [revealedIds, setRevealedIds] = useState(() => new Set());

  // Batch management
  const [batchMode, setBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  // Modals
  const [editorState, setEditorState] = useState(null); // null | { card: null | Flashcard }
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSyncingMd, setIsSyncingMd] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState(null);

  const cardsById = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);

  const allTags = useMemo(() => {
    const set = new Set();
    for (const c of cards) {
      for (const t of c.tags || []) set.add(t);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [cards]);

  const availableSubjects = useMemo(() => {
    const set = new Set(CORE_FLASHCARD_SUBJECTS);
    for (const c of cards) {
      if (c.subject) set.add(c.subject);
    }
    for (const course of courses || []) {
      const name = typeof course === 'string' ? course : course?.name;
      if (name && !name.includes('護照') && !name.includes('導師班') && !name.includes('服務學習')) {
        set.add(name);
      }
    }
    return Array.from(set);
  }, [cards, courses]);

  // Filtered list for Masked Rapid Scan & Card Manager
  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cards.filter((c) => {
      if (subjectFilter !== 'ALL' && c.subject !== subjectFilter) return false;
      if (tagFilter !== 'ALL' && !(c.tags || []).includes(tagFilter)) return false;

      if (statusFilter === 'suspended') {
        if (!c.suspended) return false;
      } else if (statusFilter === 'due') {
        if (!isCardDue(c, todayISO)) return false;
      } else if (statusFilter === 'leech') {
        if (!isCardLeech(c)) return false;
      } else if (['new', 'learning', 'review', 'mastered'].includes(statusFilter)) {
        if (c.suspended || c.srs?.status !== statusFilter) return false;
      } else if (statusFilter === 'all') {
        if (c.suspended) return false;
      }

      if (q) {
        const hay = `${c.code} ${c.subject} ${c.chapter} ${c.front} ${c.back} ${c.mnemonic} ${c.pitfall} ${(c.tags || []).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cards, subjectFilter, tagFilter, statusFilter, searchQuery, todayISO]);

  // Due & Leech counts respecting active subject filter
  const scopedDueQueue = useMemo(
    () => buildStudyQueue(cards, { subject: subjectFilter, mode: 'due', todayISO }),
    [cards, subjectFilter, todayISO]
  );
  const scopedLeechQueue = useMemo(
    () => buildStudyQueue(cards, { subject: subjectFilter, mode: 'leech', todayISO }),
    [cards, subjectFilter, todayISO]
  );

  const launchStudy = useCallback(
    (mode = 'due', { shuffle = false, customCards = null } = {}) => {
      const queue = customCards
        ? customCards
        : buildStudyQueue(cards, {
            subject: subjectFilter,
            mode,
            tag: tagFilter,
            search: searchQuery,
            shuffle,
            todayISO,
          });

      if (queue.length === 0) {
        showToast?.(
          mode === 'due'
            ? '目前篩選範圍沒有到期卡片，可點「考前自由刷」隨時複習！'
            : mode === 'leech'
              ? '太棒了！目前沒有頑固遺忘卡'
              : '找不到符合條件的閃卡'
        );
        return;
      }

      setStudySession({
        initialCards: queue,
        mode,
        subjectLabel: subjectFilter === 'ALL' ? '全部科目' : subjectFilter,
        isCramMode: mode === 'cram',
      });
    },
    [cards, subjectFilter, tagFilter, searchQuery, todayISO, showToast]
  );

  // Consume deep-link actions from DashboardHome or CommandPalette
  useEffect(() => {
    if (!pendingAction) return undefined;
    const timer = window.setTimeout(() => {
      if (pendingAction === 'start_due') {
        if (scopedDueQueue.length > 0) {
          launchStudy('due');
        } else if (cards.length > 0) {
          launchStudy('cram', { shuffle: true });
        }
      } else if (pendingAction === 'open_ai') {
        setIsAiModalOpen(true);
      } else if (pendingAction === 'open_new') {
        setEditorState({ card: null });
      }
      onConsumePendingAction?.();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pendingAction, scopedDueQueue.length, cards.length, launchStudy, onConsumePendingAction]);

  // SM-2 rating handler
  const handleRateCard = useCallback(
    (cardId, rating, { responseMs } = {}) => {
      onUpdateStore?.(
        (prev) => {
          const { nextStore } = applySm2Review(prev, cardId, rating, {
            responseMs,
            todayISO: getTodayISO(),
          });
          return nextStore;
        },
        { syncMarkdown: false }
      );
    },
    [onUpdateStore]
  );

  const handleUndoReview = useCallback(
    (prevCard, rating) => {
      if (!prevCard?.id) return;
      onUpdateStore?.(
        (prev) => {
          const today = getTodayISO();
          const prevDay = prev.reviewLog?.[today];
          const ratingKey = rating === 1 ? 'again' : rating === 2 ? 'hard' : rating === 3 ? 'good' : 'easy';
          const nextLog = { ...(prev.reviewLog || {}) };
          if (prevDay && prevDay.reviewed > 0) {
            nextLog[today] = {
              ...prevDay,
              reviewed: Math.max(0, prevDay.reviewed - 1),
              [ratingKey]: Math.max(0, (prevDay[ratingKey] || 0) - 1),
            };
          }
          return {
            ...prev,
            cards: (prev.cards || []).map((c) => (c.id === prevCard.id ? prevCard : c)),
            reviewLog: nextLog,
            updatedAt: new Date().toISOString(),
          };
        },
        { syncMarkdown: false }
      );
    },
    [onUpdateStore]
  );

  // Save created or edited card
  const handleSaveCard = useCallback(
    async (cardDraft, isNew) => {
      const normalized = normalizeFlashcard(cardDraft, getTodayISO());
      await onUpdateStore?.(
        (prev) => {
          const existing = prev.cards || [];
          const nextCards = isNew
            ? [normalized, ...existing]
            : existing.map((c) => (c.id === normalized.id ? { ...c, ...normalized, updatedAt: new Date().toISOString() } : c));
          const nextDeleted = (prev.deletedIds || []).filter((id) => id !== normalized.id);
          return {
            ...prev,
            cards: nextCards,
            deletedIds: nextDeleted,
            updatedAt: new Date().toISOString(),
          };
        },
        { syncMarkdown: true, immediateCloud: true }
      );
      setEditorState(null);
      showToast?.(isNew ? '已新增閃卡並同步回寫 Active_Recall_Flashcards.md' : '已更新閃卡內容並同步');
    },
    [onUpdateStore, showToast]
  );

  const handleDeleteCards = useCallback((idsToDelete) => {
    const uniqueIds = Array.from(new Set(idsToDelete || []));
    if (uniqueIds.length === 0) return;
    setPendingDeleteIds(uniqueIds);
  }, []);

  const handleConfirmDeleteCards = useCallback(async () => {
    const idSet = new Set(pendingDeleteIds || []);
    setPendingDeleteIds(null);
    if (idSet.size === 0) return;
    await onUpdateStore?.(
      (prev) => ({
        ...prev,
        cards: (prev.cards || []).filter((c) => !idSet.has(c.id)),
        deletedIds: [...new Set([...(prev.deletedIds || []), ...idSet])].slice(-300),
        updatedAt: new Date().toISOString(),
      }),
      { syncMarkdown: true, immediateCloud: true }
    );
    setSelectedIds(new Set());
    showToast?.(`已刪除 ${idSet.size} 張閃卡`);
  }, [pendingDeleteIds, onUpdateStore, showToast]);

  const handleToggleSuspend = useCallback(
    async (cardIds, forceSuspend = null) => {
      const idSet = new Set(cardIds);
      if (idSet.size === 0) return;
      const nowIso = new Date().toISOString();
      await onUpdateStore?.(
        (prev) => ({
          ...prev,
          cards: (prev.cards || []).map((c) =>
            idSet.has(c.id)
              ? { ...c, suspended: forceSuspend === null ? !c.suspended : forceSuspend, updatedAt: nowIso }
              : c
          ),
          updatedAt: nowIso,
        }),
        { syncMarkdown: false }
      );
      setSelectedIds(new Set());
      showToast?.(`已更新 ${idSet.size} 張閃卡的暫停狀態`);
    },
    [onUpdateStore, showToast]
  );

  const handleResetProgress = useCallback(
    async (cardIds) => {
      const idSet = new Set(cardIds);
      if (idSet.size === 0) return;
      const nowIso = new Date().toISOString();
      const today = getTodayISO();
      await onUpdateStore?.(
        (prev) => ({
          ...prev,
          cards: (prev.cards || []).map((c) =>
            idSet.has(c.id)
              ? {
                  ...c,
                  srs: {
                    status: 'new',
                    repetitions: 0,
                    intervalDays: 0,
                    easeFactor: 2.5,
                    lapses: 0,
                    reviewCount: 0,
                    lastRating: null,
                    dueDate: today,
                    lastReviewedAt: null,
                    lastResponseMs: null,
                  },
                  updatedAt: nowIso,
                }
              : c
          ),
          updatedAt: nowIso,
        }),
        { syncMarkdown: false }
      );
      setSelectedIds(new Set());
      showToast?.(`已重設 ${idSet.size} 張閃卡的 SM-2 學習進度`);
    },
    [onUpdateStore, showToast]
  );

  // Quick lapse during Masked Rapid Scan ("沒背熟 → 排入今日重練")
  const handleQuickLapse = useCallback(
    (cardId) => {
      handleRateCard(cardId, 1, { responseMs: 4000 });
      showToast?.('已標記須強化，排入今日優先複習佇列');
    },
    [handleRateCard, showToast]
  );

  const handleImportAiCards = useCallback(
    async (selectedCards) => {
      if (!selectedCards || selectedCards.length === 0) return;
      let summary = { addedCount: 0, skippedCount: 0 };
      await onUpdateStore?.(
        (prev) => {
          const res = addCardsWithDedup(prev, selectedCards, getTodayISO());
          summary = { addedCount: res.addedCount, skippedCount: res.skippedCount };
          return res.nextStore;
        },
        { syncMarkdown: true, immediateCloud: true }
      );
      setIsAiModalOpen(false);
      showToast?.(
        summary.skippedCount > 0
          ? `已匯入 ${summary.addedCount} 張 AI 閃卡（略過 ${summary.skippedCount} 張重複）並同步 MD`
          : `已成功匯入 ${summary.addedCount} 張 AI 閃卡並同步至 Active_Recall_Flashcards.md`
      );
    },
    [onUpdateStore, showToast]
  );

  const handleManualSyncMd = useCallback(async () => {
    if (isSyncingMd) return;
    setIsSyncingMd(true);
    try {
      const res = await onResyncFromMd?.({ exportBack: true });
      showToast?.(
        res?.addedFromMd > 0
          ? `雙向同步完成：從 MD 新收錄 ${res.addedFromMd} 張閃卡並已更新檔案`
          : '雙向同步完成：閃卡庫與 Active_Recall_Flashcards.md 已完全一致'
      );
    } finally {
      setIsSyncingMd(false);
    }
  }, [isSyncingMd, onResyncFromMd, showToast]);

  const handleExportAnki = useCallback(() => {
    const target = filteredCards.length > 0 ? filteredCards : cards;
    if (target.length === 0) {
      showToast?.('沒有可匯出的閃卡');
      return;
    }
    const tsv = exportFlashcardsToAnkiTsv(target);
    const blob = new Blob([`\uFEFF${tsv}`], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TaskCommander_Flashcards_${todayISO}.tsv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast?.(`已匯出 ${target.length} 張閃卡為 Anki TSV（可直接匯入 Anki）`);
  }, [filteredCards, cards, todayISO, showToast]);

  const handleChangeDailyGoal = useCallback(
    (nextGoal) => {
      onUpdateStore?.(
        (prev) => ({
          ...prev,
          dailyGoal: Number(nextGoal),
          updatedAt: new Date().toISOString(),
        }),
        { syncMarkdown: false }
      );
    },
    [onUpdateStore]
  );

  const toggleRevealCard = (cardId) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  const toggleMaskAll = () => {
    setMaskAll((prev) => {
      const next = !prev;
      setRevealedIds(new Set());
      return next;
    });
  };

  const toggleSelectId = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ================= FOCUS STUDY MODE =================
  if (studySession) {
    return (
      <>
        <FlashcardStudySession
          initialCards={studySession.initialCards}
          allCardsById={cardsById}
          mode={studySession.mode}
          subjectLabel={studySession.subjectLabel}
          isCramMode={studySession.isCramMode}
          dailyGoal={stats.dailyGoal}
          reviewedToday={stats.reviewedToday}
          streakDays={stats.streakDays}
          onRateCard={handleRateCard}
          onUndoReview={handleUndoReview}
          onEditCard={(card) => setEditorState({ card })}
          onExit={() => setStudySession(null)}
          onRestartCram={() => launchStudy('cram', { shuffle: true })}
        />

        {editorState && (
          <FlashcardEditorModal
            card={editorState.card}
            availableSubjects={availableSubjects}
            defaultSubject={subjectFilter !== 'ALL' ? subjectFilter : '計算機概論'}
            onSave={handleSaveCard}
            onResetProgress={(id) => handleResetProgress([id])}
            onClose={() => setEditorState(null)}
          />
        )}
      </>
    );
  }

  // ================= FLASHCARD HUB & MASKED RAPID SCAN =================
  const totalDist = Math.max(1, stats.totalActive);
  const pctNew = Math.round((stats.newCount / totalDist) * 100);
  const pctLearning = Math.round((stats.learningCount / totalDist) * 100);
  const pctReview = Math.round((stats.reviewCount / totalDist) * 100);
  const pctMastered = Math.max(0, 100 - pctNew - pctLearning - pctReview);

  return (
    <div className="fc-hub-wrap">
      {/* 1. Primary Action & KPI Strip */}
      <section className="fc-hub-hero">
        <div className="fc-hub-hero-main">
          <div className="fc-hub-eyebrow">
            <Zap size={14} /> SM-2 智慧主動回憶引擎 · 3 秒猶豫檢核 · 雙向同步 Markdown
          </div>
          <h3 className="fc-hub-title">
            {scopedDueQueue.length > 0 ? (
              <>
                {subjectFilter === 'ALL' ? '今日共有' : `「${subjectFilter}」今日共有`}{' '}
                <strong className="fc-highlight-num">{scopedDueQueue.length}</strong> 張閃卡到期
              </>
            ) : (
              <>
                <CheckCircle2 size={20} style={{ color: 'var(--accent-emerald)', verticalAlign: '-4px' }} />{' '}
                {subjectFilter === 'ALL' ? '今日到期閃卡已全部清空！' : `「${subjectFilter}」今日到期已全數複習！`}
              </>
            )}
          </h3>
          <p className="fc-hub-desc">
            每天 5–10 分鐘口頭快答；思考逾 3 秒自動提醒記憶衰減，頑固忘記卡將自動回饋給 AI 試卷生成器加強回馬槍抽考。
          </p>

          <div className="fc-hub-cta-row">
            <button
              type="button"
              className="arena-btn-primary fc-btn-lg"
              onClick={() =>
                scopedDueQueue.length > 0
                  ? launchStudy('due')
                  : launchStudy('cram', { shuffle: true })
              }
            >
              <Play size={16} />
              {scopedDueQueue.length > 0
                ? `開始專注翻卡 (${scopedDueQueue.length} 張到期)`
                : `啟動考前自由洗牌 (${filteredCards.length || stats.totalActive} 張)`}
            </button>

            <button
              type="button"
              className="arena-btn-secondary"
              onClick={() => launchStudy('cram', { shuffle: true })}
              title="無視到期日，將目前篩選卡片洗牌進行考前衝刺"
            >
              <Shuffle size={14} /> 考前自由刷 (Cram)
            </button>

            {scopedLeechQueue.length > 0 && (
              <button
                type="button"
                className="arena-btn-secondary fc-btn-leech"
                onClick={() => launchStudy('leech')}
                title="集中攻克反覆忘記的頑固卡"
              >
                <Flame size={14} /> 頑固卡特訓 ({scopedLeechQueue.length})
              </button>
            )}
          </div>
        </div>

        <div className="fc-hub-kpi-grid">
          <div className="fc-kpi-tile">
            <span className="fc-kpi-label">今日複習進度</span>
            <div className="fc-kpi-val-row">
              <strong>{stats.reviewedToday}</strong>
              <select
                className="fc-goal-select"
                value={stats.dailyGoal}
                onChange={(e) => handleChangeDailyGoal(e.target.value)}
                title="調整每日閃卡目標張數"
                aria-label="每日複習目標"
              >
                {[10, 15, 20, 30, 50, 80].map((g) => (
                  <option key={g} value={g}>/ {g} 張</option>
                ))}
              </select>
            </div>
            <div className="arena-meter-track" style={{ marginTop: 6 }}>
              <div
                className="arena-meter-fill"
                style={{ width: `${stats.todayProgressPct}%`, background: 'var(--accent-primary)' }}
              />
            </div>
          </div>

          <div className="fc-kpi-tile">
            <span className="fc-kpi-label">連續複習 Streak</span>
            <div className="fc-kpi-val-row">
              <strong style={{ color: stats.streakDays > 0 ? 'var(--accent-emerald)' : undefined }}>
                {stats.streakDays}
              </strong>
              <span>天</span>
            </div>
            <small className="fc-kpi-sub">已穩固 {stats.masteredCount} / {stats.totalActive} 張</small>
          </div>

          <button
            type="button"
            className="fc-kpi-tile is-clickable"
            onClick={() => setStatusFilter(statusFilter === 'leech' ? 'all' : 'leech')}
          >
            <span className="fc-kpi-label">🔥 頑固遺忘卡</span>
            <div className="fc-kpi-val-row">
              <strong style={{ color: stats.leechCount > 0 ? 'var(--accent-danger)' : 'var(--accent-emerald)' }}>
                {stats.leechCount}
              </strong>
              <span>張</span>
            </div>
            <small className="fc-kpi-sub">失誤 ≥ 3 次自動標記</small>
          </button>

          <button
            type="button"
            className="fc-kpi-tile is-clickable"
            onClick={() => setShowAnalytics((p) => !p)}
          >
            <span className="fc-kpi-label">統計儀表板</span>
            <div className="fc-kpi-val-row">
              <BarChart3 size={18} style={{ color: 'var(--accent-purple)' }} />
              <span style={{ fontWeight: 700, fontSize: '0.86rem' }}>{showAnalytics ? '收合圖表' : '展開圖表'}</span>
              {showAnalytics ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
            <small className="fc-kpi-sub">熟練度＆近 14 日熱度</small>
          </button>
        </div>
      </section>

      {/* 2. Collapsible Flashcard Analytics Dashboard */}
      {showAnalytics && (
        <section className="fc-analytics-grid">
          {/* Left: Mastery & Subject Breakdown */}
          <div className="fc-analytics-card">
            <div className="fc-analytics-head">
              <h4><Target size={15} /> 記憶熟練度與各科分布</h4>
              <span className="fc-analytics-meta">啟用中 {stats.totalActive} 張{stats.suspendedCount > 0 ? ` · 暫停 ${stats.suspendedCount}` : ''}</span>
            </div>

            <div className="fc-stacked-bar" title="新卡 / 學習中 / 複習中 / 已穩固">
              {stats.newCount > 0 && <div className="fc-seg is-new" style={{ width: `${pctNew}%` }} />}
              {stats.learningCount > 0 && <div className="fc-seg is-learning" style={{ width: `${pctLearning}%` }} />}
              {stats.reviewCount > 0 && <div className="fc-seg is-review" style={{ width: `${pctReview}%` }} />}
              {stats.masteredCount > 0 && <div className="fc-seg is-mastered" style={{ width: `${pctMastered}%` }} />}
            </div>

            <div className="fc-legend-row">
              <span><i className="fc-dot is-new" /> 新卡 {stats.newCount}</span>
              <span><i className="fc-dot is-learning" /> 學習中 {stats.learningCount}</span>
              <span><i className="fc-dot is-review" /> 複習中 {stats.reviewCount}</span>
              <span><i className="fc-dot is-mastered" /> 已穩固 {stats.masteredCount}</span>
            </div>

            <div className="fc-subj-breakdown">
              {stats.bySubject.map((s) => (
                <div key={s.subject} className="fc-subj-row">
                  <div className="fc-subj-row-head">
                    <span className="fc-subj-name">
                      <i className="fc-subj-dot" style={{ background: s.color }} />
                      {s.subject}
                    </span>
                    <span className="fc-subj-meta">
                      到期 <strong>{s.due}</strong> · 共 {s.total} 張
                      {s.leech > 0 && <em className="fc-subj-leech">🔥 {s.leech}</em>}
                    </span>
                  </div>
                  <div className="arena-meter-track">
                    <div
                      className="arena-meter-fill"
                      style={{ width: `${s.masteryPct}%`, background: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Last 14 Days Activity Bar Chart */}
          <div className="fc-analytics-card">
            <div className="fc-analytics-head">
              <h4><BarChart3 size={15} /> 近 14 天複習紀錄</h4>
              <span className="fc-analytics-meta">
                今日：重來 {stats.todayLog.again} · 困難 {stats.todayLog.hard} · 記得 {stats.todayLog.good} · 秒答 {stats.todayLog.easy}
              </span>
            </div>

            <div className="fc-activity-chart">
              {stats.last14Days.map((day) => {
                const heightPct = day.reviewed > 0
                  ? Math.max(12, Math.round((day.reviewed / stats.maxDailyReviews) * 100))
                  : 4;
                const hitGoal = day.reviewed >= stats.dailyGoal;
                return (
                  <div
                    key={day.date}
                    className={`fc-bar-col ${day.isToday ? 'is-today' : ''}`}
                    title={`${day.date}：複習 ${day.reviewed} 次（重來 ${day.again} / 困難 ${day.hard} / 記得 ${day.good} / 秒答 ${day.easy}）`}
                  >
                    <span className="fc-bar-count">{day.reviewed > 0 ? day.reviewed : ''}</span>
                    <div className="fc-bar-track">
                      <div
                        className={`fc-bar-fill ${day.reviewed === 0 ? 'is-empty' : hitGoal ? 'is-goal' : ''}`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="fc-bar-label">{day.isToday ? '今' : day.label.slice(3)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. Management & Rapid Scan Toolbar */}
      <div className="fc-toolbar">
        <div className="fc-toolbar-left">
          <div className="fc-search-box">
            <Search size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋閃卡提問、答案、口訣或編號..."
            />
          </div>

          <select
            className="fc-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="篩選卡片狀態"
          >
            {STATUS_FILTERS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>

          {allTags.length > 0 && (
            <select
              className="fc-filter-select"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              aria-label="篩選標籤"
            >
              <option value="ALL">全部標籤</option>
              {allTags.map((t) => (
                <option key={t} value={t}>#{t}</option>
              ))}
            </select>
          )}
        </div>

        <div className="fc-toolbar-right">
          <button
            type="button"
            className={`arena-btn-secondary ${maskAll ? 'fc-btn-active' : ''}`}
            onClick={toggleMaskAll}
            title="切換清單遮罩模式（考前 5 分鐘逐題點擊揭曉答案）"
          >
            {maskAll ? <Eye size={14} /> : <EyeOff size={14} />}
            {maskAll ? '全部展開答案' : '全部遮罩速掃'}
          </button>

          <button
            type="button"
            className="arena-btn-primary"
            onClick={() => setEditorState({ card: null })}
          >
            <Plus size={14} /> 新增閃卡
          </button>

          <button
            type="button"
            className="arena-btn-secondary fc-btn-ai"
            onClick={() => setIsAiModalOpen(true)}
            title="使用本機 agy / Gemini / OpenAI 依教材或錯題批量生成閃卡"
          >
            <Wand2 size={14} /> AI 生成閃卡
          </button>

          <button
            type="button"
            className="arena-btn-ghost"
            onClick={() => {
              setBatchMode((p) => !p);
              setSelectedIds(new Set());
            }}
            title="批次選取卡片進行暫停、重設或刪除"
          >
            <CheckSquare size={14} /> {batchMode ? '退出批次' : '批次管理'}
          </button>

          <button
            type="button"
            className="arena-btn-ghost"
            onClick={handleManualSyncMd}
            disabled={isSyncingMd}
            title="雙向同步 Review_Dashboard/Active_Recall_Flashcards.md"
          >
            <RefreshCw size={14} className={isSyncingMd ? 'spin' : ''} /> 同步 MD
          </button>

          <button
            type="button"
            className="arena-btn-ghost"
            onClick={handleExportAnki}
            title="匯出目前清單為 Anki 相容 TSV 檔"
          >
            <Download size={14} /> Anki
          </button>

          <button
            type="button"
            className="arena-btn-ghost"
            onClick={() =>
              onPreviewFile?.({
                title: '116 主動回憶閃卡庫 (Markdown 原檔)',
                path: FLASHCARD_PATHS.MARKDOWN,
                format: 'md',
              })
            }
            title="檢視或手動編輯原始 Active_Recall_Flashcards.md"
          >
            <FileText size={14} /> 原檔
          </button>
        </div>
      </div>

      {/* Batch Action Bar */}
      {batchMode && (
        <div className="fc-batch-bar">
          <div className="fc-batch-left">
            <button
              type="button"
              className="arena-btn-ghost"
              onClick={() => {
                if (selectedIds.size === filteredCards.length) {
                  setSelectedIds(new Set());
                } else {
                  setSelectedIds(new Set(filteredCards.map((c) => c.id)));
                }
              }}
            >
              {selectedIds.size === filteredCards.length && filteredCards.length > 0 ? <CheckSquare size={14} /> : <Square size={14} />}
              全選目前 ({selectedIds.size}/{filteredCards.length})
            </button>
          </div>
          <div className="fc-batch-actions">
            <button
              type="button"
              className="arena-btn-secondary"
              disabled={selectedIds.size === 0}
              onClick={() => handleToggleSuspend(Array.from(selectedIds), true)}
            >
              <PauseCircle size={14} /> 暫停
            </button>
            <button
              type="button"
              className="arena-btn-secondary"
              disabled={selectedIds.size === 0}
              onClick={() => handleResetProgress(Array.from(selectedIds))}
            >
              <RotateCcw size={14} /> 重設進度
            </button>
            <button
              type="button"
              className="arena-btn-secondary fc-btn-danger"
              disabled={selectedIds.size === 0}
              onClick={() => handleDeleteCards(Array.from(selectedIds))}
            >
              <Trash2 size={14} /> 刪除 ({selectedIds.size})
            </button>
          </div>
        </div>
      )}

      {/* 4. Masked Rapid Scan & Card Library List */}
      <div className="fc-scan-header-hint">
        <span>
          清單遮罩速掃 · 共顯示 <strong>{filteredCards.length}</strong> 張閃卡
          {maskAll ? '（答案已預設遮罩，點擊右側即可翻開核對）' : '（目前全部展開）'}
        </span>
        {filteredCards.length > 0 && (
          <button
            type="button"
            className="link-btn"
            onClick={() => launchStudy('cram', { customCards: filteredCards })}
          >
            以此清單啟動翻卡 ({filteredCards.length} 張) →
          </button>
        )}
      </div>

      {filteredCards.length === 0 ? (
        <div className="arena-empty-card">
          <Sparkles size={28} />
          <h3>沒有符合目前篩選條件的閃卡</h3>
          <p>你可以切換狀態篩選、點上方「新增閃卡」，或使用「AI 生成閃卡」一鍵從筆記與錯題產卡。</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" className="arena-btn-primary" onClick={() => setEditorState({ card: null })}>
              <Plus size={14} /> 手動新增閃卡
            </button>
            <button type="button" className="arena-btn-secondary" onClick={() => setIsAiModalOpen(true)}>
              <Wand2 size={14} /> AI 批量造卡
            </button>
          </div>
        </div>
      ) : (
        <div className="fc-scan-list">
          {filteredCards.map((card) => {
            const subjColor = SUBJECT_CONFIG[card.subject]?.color || '#7c3aed';
            const stMeta = FLASHCARD_STATUS_META[card.srs?.status] || FLASHCARD_STATUS_META.new;
            const due = isCardDue(card, todayISO);
            const leech = isCardLeech(card);
            const isRevealed = !maskAll || revealedIds.has(card.id);
            const isChecked = selectedIds.has(card.id);

            return (
              <article
                key={card.id}
                className={`fc-scan-item ${card.suspended ? 'is-suspended' : ''} ${leech ? 'is-leech' : ''}`}
              >
                <div className="fc-scan-item-top">
                  <div className="fc-face-badges">
                    {batchMode && (
                      <button
                        type="button"
                        className="fc-batch-checkbox"
                        onClick={() => toggleSelectId(card.id)}
                        aria-label="選取閃卡"
                      >
                        {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    )}
                    <span
                      className="arena-subj-tag"
                      style={{ background: `${subjColor}18`, color: subjColor }}
                    >
                      {card.subject}
                    </span>
                    {card.code && <span className="fc-code-chip">{card.code}</span>}
                    {card.chapter && <span className="fc-chapter-chip">{card.chapter}</span>}
                    <span className={`fc-status-pill tone-${stMeta.tone}`}>{stMeta.label}</span>
                    {due && !card.suspended && <span className="fc-due-pill">今日到期</span>}
                    {!due && !card.suspended && card.srs?.dueDate && (
                      <span className="fc-next-due-chip">下次 {card.srs.dueDate.slice(5)}</span>
                    )}
                    {leech && (
                      <span className="fc-leech-pill">
                        <Flame size={11} /> 頑固 ({card.srs.lapses})
                      </span>
                    )}
                    {card.suspended && <span className="fc-code-chip">已暫停</span>}
                  </div>

                  <div className="fc-scan-item-actions">
                    <button
                      type="button"
                      className="fc-mini-action"
                      onClick={() => handleQuickLapse(card.id)}
                      title="速掃覺得不熟：標記須強化並排入今日回馬槍"
                    >
                      <Flame size={13} /> 須強化
                    </button>
                    <button
                      type="button"
                      className="fc-mini-action"
                      onClick={() => setEditorState({ card })}
                      title="編輯閃卡"
                      aria-label="編輯閃卡"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      className="fc-mini-action"
                      onClick={() => handleToggleSuspend([card.id])}
                      title={card.suspended ? '恢復啟用' : '暫停排程'}
                      aria-label={card.suspended ? '恢復啟用' : '暫停排程'}
                    >
                      {card.suspended ? <PlayCircle size={13} /> : <PauseCircle size={13} />}
                    </button>
                    <button
                      type="button"
                      className="fc-mini-action is-danger"
                      onClick={() => handleDeleteCards([card.id])}
                      title="刪除閃卡"
                      aria-label="刪除閃卡"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="fc-scan-split">
                  <div className="fc-scan-prompt">
                    <div className="fc-scan-col-label">提問 (Prompt)</div>
                    <MiniMarkdown content={card.front} />
                    {card.tags && card.tags.length > 0 && (
                      <div className="fc-card-tags-row" style={{ marginTop: 6 }}>
                        {card.tags.map((t) => (
                          <span key={t} className="fc-tag-chip">#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    className={`fc-scan-answer ${isRevealed ? 'is-revealed' : 'is-masked'}`}
                    onClick={() => {
                      if (maskAll) toggleRevealCard(card.id);
                    }}
                    role={maskAll ? 'button' : undefined}
                    tabIndex={maskAll ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (maskAll && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        toggleRevealCard(card.id);
                      }
                    }}
                  >
                    <div className="fc-scan-col-label">
                      <span>答案與口訣 (Answer)</span>
                      {maskAll && (
                        <span className="fc-reveal-toggle-tag">
                          {isRevealed ? <><EyeOff size={11} /> 點擊重新遮罩</> : <><Eye size={11} /> 點擊揭曉</>}
                        </span>
                      )}
                    </div>

                    {isRevealed ? (
                      <div className="fc-scan-answer-content">
                        <MiniMarkdown content={card.back} />
                        {card.mnemonic && (
                          <div className="fc-scan-inline-note is-mnemonic">
                            <Lightbulb size={12} /> <strong>口訣：</strong>
                            <MiniMarkdown content={card.mnemonic} className="is-inline" />
                          </div>
                        )}
                        {card.pitfall && (
                          <div className="fc-scan-inline-note is-pitfall">
                            <AlertTriangle size={12} /> <strong>陷阱：</strong>
                            <MiniMarkdown content={card.pitfall} className="is-inline" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="fc-mask-curtain">
                        <div className="fc-mask-blurred-preview" aria-hidden="true">
                          {card.back.slice(0, 90)}
                        </div>
                        <span className="fc-mask-pill">
                          <Eye size={13} /> 先口頭回答，再點擊核對答案
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {editorState && (
        <FlashcardEditorModal
          card={editorState.card}
          availableSubjects={availableSubjects}
          defaultSubject={subjectFilter !== 'ALL' ? subjectFilter : '計算機概論'}
          onSave={handleSaveCard}
          onResetProgress={(id) => handleResetProgress([id])}
          onClose={() => setEditorState(null)}
        />
      )}

      {isAiModalOpen && (
        <FlashcardAiModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          initialSubject={subjectFilter !== 'ALL' ? subjectFilter : '計算機概論'}
          availableSubjects={availableSubjects}
          decayRows={decayRows}
          mistakeBank={mistakeBank}
          existingCards={cards}
          onImportCards={handleImportAiCards}
          onOpenSettings={onOpenAiSettings}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDeleteIds && pendingDeleteIds.length > 0)}
        title="刪除閃卡"
        message={
          pendingDeleteIds?.length
            ? `確定要刪除這 ${pendingDeleteIds.length} 張閃卡嗎？此操作將同步更新 Active_Recall_Flashcards.md。`
            : ''
        }
        confirmLabel="確定刪除"
        cancelLabel="取消"
        danger
        onConfirm={handleConfirmDeleteCards}
        onCancel={() => setPendingDeleteIds(null)}
      />
    </div>
  );
}
