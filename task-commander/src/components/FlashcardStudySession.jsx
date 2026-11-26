import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Lightbulb,
  AlertTriangle,
  Flame,
  Clock,
  Keyboard,
  Edit3,
  CheckCircle2,
  Sparkles,
  Undo2,
  Eye,
  Shuffle,
  X,
} from 'lucide-react';
import { renderMarkdownWithKatex } from '../utils/markdownRenderer';
import { SUBJECT_CONFIG, getTodayISO } from '../utils/examArenaUtils';
import {
  FLASHCARD_RATING_OPTIONS,
  FLASHCARD_STATUS_META,
  HESITATION_THRESHOLD_SECONDS,
  previewSm2Schedule,
  isCardLeech,
} from '../utils/flashcardUtils';
import { hasOpenModal } from '../hooks/useModalA11y';

function CardMarkdown({ content, className = '' }) {
  const html = useMemo(() => renderMarkdownWithKatex(content || ''), [content]);
  return (
    <div
      className={`fc-markdown markdown-body ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const MODE_META = {
  due: { label: '今日到期複習', tone: 'primary' },
  cram: { label: '考前自由刷 (Cram)', tone: 'purple' },
  leech: { label: '頑固卡特訓', tone: 'danger' },
  new: { label: '新卡預習', tone: 'blue' },
  single: { label: '單卡強化', tone: 'amber' },
};

export default function FlashcardStudySession({
  initialCards = [],
  allCardsById,
  mode = 'due',
  subjectLabel = '全部科目',
  isCramMode = false,
  dailyGoal = 20,
  reviewedToday = 0,
  streakDays = 0,
  onRateCard,
  onUndoReview,
  onEditCard,
  onExit,
  onRestartCram,
}) {
  const [queueIds, setQueueIds] = useState(() => initialCards.map((c) => c.id));
  const [cursor, setCursor] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [requeuedCount, setRequeuedCount] = useState(0);

  // Elapsed hesitation timer for current card front
  const [elapsedMs, setElapsedMs] = useState(0);
  const cardShownAtRef = useRef(0);
  const flipLatencyMsRef = useRef(null);

  // Session analytics & undo stack
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
    totalResponseMs: 0,
  });
  const [undoStack, setUndoStack] = useState([]);

  // Mobile touch swipe state
  const touchStartRef = useRef(null);
  const [swipeDeltaX, setSwipeDeltaX] = useState(0);

  const todayISO = getTodayISO();
  const currentCardId = queueIds[cursor] || null;
  const currentCard = currentCardId ? allCardsById.get(currentCardId) || null : null;
  const isComplete = cursor >= queueIds.length || !currentCard;

  // Reset per-card timer subscription whenever active card changes
  useEffect(() => {
    if (isComplete) return undefined;
    cardShownAtRef.current = Date.now();
    flipLatencyMsRef.current = null;

    const timer = window.setInterval(() => {
      if (flipLatencyMsRef.current === null) {
        setElapsedMs(Date.now() - cardShownAtRef.current);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [cursor, currentCardId, isComplete]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => {
      if (!prev && flipLatencyMsRef.current === null) {
        const dt = Date.now() - cardShownAtRef.current;
        flipLatencyMsRef.current = dt;
        setElapsedMs(dt);
      }
      return !prev;
    });
  }, []);

  const ratingPreviews = useMemo(() => {
    if (!currentCard) return {};
    const out = {};
    for (const opt of FLASHCARD_RATING_OPTIONS) {
      out[opt.rating] = previewSm2Schedule(currentCard, opt.rating, todayISO);
    }
    return out;
  }, [currentCard, todayISO]);

  const handleRate = useCallback(
    (rating) => {
      if (!currentCard || isComplete) return;
      const responseMs = flipLatencyMsRef.current ?? (Date.now() - cardShownAtRef.current);

      const snapshot = {
        cursor,
        queueIds: [...queueIds],
        requeuedCount,
        sessionStats: { ...sessionStats },
        cardId: currentCard.id,
        prevCard: currentCard,
        rating,
      };
      setUndoStack((prev) => [...prev.slice(-19), snapshot]);

      onRateCard?.(currentCard.id, rating, { responseMs, isCramMode });

      const ratingKey = rating === 1 ? 'again' : rating === 2 ? 'hard' : rating === 3 ? 'good' : 'easy';
      setSessionStats((prev) => ({
        ...prev,
        reviewed: prev.reviewed + 1,
        [ratingKey]: (prev[ratingKey] || 0) + 1,
        totalResponseMs: prev.totalResponseMs + responseMs,
      }));

      // Intra-session re-queue when marked Again (1)
      if (rating === 1) {
        setQueueIds((prev) => {
          const next = [...prev];
          const insertAt = Math.min(next.length, cursor + 3);
          next.splice(insertAt, 0, currentCard.id);
          return next;
        });
        setRequeuedCount((n) => n + 1);
      }

      setIsFlipped(false);
      setElapsedMs(0);
      setShowHint(false);
      setSwipeDeltaX(0);
      setCursor((c) => c + 1);
    },
    [currentCard, isComplete, cursor, queueIds, requeuedCount, sessionStats, onRateCard, isCramMode]
  );

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setQueueIds(last.queueIds);
    setCursor(last.cursor);
    setRequeuedCount(last.requeuedCount);
    setSessionStats(last.sessionStats);
    setElapsedMs(0);
    setShowHint(false);
    setSwipeDeltaX(0);
    setIsFlipped(true);
    onUndoReview?.(last.prevCard, last.rating);
  }, [undoStack, onUndoReview]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e) => {
      if (hasOpenModal()) return;
      const tag = String(e.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target?.isContentEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (showShortcuts) setShowShortcuts(false);
        else onExit?.();
        return;
      }

      if (isComplete) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key.toLowerCase() === 'h' && !isFlipped && currentCard?.hint) {
        e.preventDefault();
        setShowHint((p) => !p);
      } else if (e.key.toLowerCase() === 'z' && undoStack.length > 0) {
        e.preventDefault();
        handleUndo();
      } else if (isFlipped && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        handleRate(Number(e.key));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isComplete, isFlipped, currentCard, showShortcuts, undoStack.length, handleFlip, handleRate, handleUndo, onExit]);

  // Touch swipe handlers for mobile PWA
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e) => {
    if (!touchStartRef.current || !isFlipped) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12) {
      setSwipeDeltaX(Math.max(-140, Math.min(140, dx)));
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    const dx = swipeDeltaX;
    touchStartRef.current = null;
    setSwipeDeltaX(0);
    if (!isFlipped) return;
    if (dx <= -75) {
      handleRate(1); // Swipe left -> Again
    } else if (dx >= 75) {
      handleRate(3); // Swipe right -> Good
    }
  };

  const elapsedSec = elapsedMs / 1000;
  const isHesitating = elapsedSec >= HESITATION_THRESHOLD_SECONDS;
  const modeMeta = MODE_META[mode] || MODE_META.due;
  const totalSlots = Math.max(1, queueIds.length);
  const progressPct = Math.min(100, Math.round((Math.min(cursor, totalSlots) / totalSlots) * 100));

  // ================= SESSION COMPLETE VIEW =================
  if (isComplete) {
    const avgSec = sessionStats.reviewed > 0
      ? (sessionStats.totalResponseMs / sessionStats.reviewed / 1000).toFixed(1)
      : '0.0';
    const goalPct = Math.min(100, Math.round((reviewedToday / Math.max(1, dailyGoal)) * 100));

    return (
      <div className="fc-study-shell">
        <div className="fc-study-topbar">
          <button type="button" className="arena-btn-secondary" onClick={onExit}>
            <ArrowLeft size={15} /> 返回閃卡中樞
          </button>
          <span className={`fc-mode-pill tone-${modeMeta.tone}`}>{modeMeta.label}</span>
        </div>

        <div className="fc-complete-card">
          <div className="fc-complete-icon">
            <CheckCircle2 size={38} />
          </div>
          <h2>本輪主動回憶完成！</h2>
          <p>
            已完成 <strong>{sessionStats.reviewed}</strong> 次主動檢索（平均思考 {avgSec} 秒），
            {requeuedCount > 0 ? `成功攻克 ${requeuedCount} 次本輪回馬槍重練。` : '全數穩定過關！'}
          </p>

          <div className="fc-complete-breakdown">
            <div className="fc-brk-pill tone-danger">
              <span>重來</span>
              <strong>{sessionStats.again}</strong>
            </div>
            <div className="fc-brk-pill tone-amber">
              <span>困難</span>
              <strong>{sessionStats.hard}</strong>
            </div>
            <div className="fc-brk-pill tone-primary">
              <span>記得</span>
              <strong>{sessionStats.good}</strong>
            </div>
            <div className="fc-brk-pill tone-emerald">
              <span>秒答</span>
              <strong>{sessionStats.easy}</strong>
            </div>
          </div>

          <div className="fc-complete-goal-box">
            <div className="fc-complete-goal-head">
              <span>今日目標進度：{reviewedToday} / {dailyGoal} 次</span>
              <strong>🔥 連續 {streakDays} 天</strong>
            </div>
            <div className="arena-meter-track">
              <div
                className="arena-meter-fill"
                style={{ width: `${goalPct}%`, background: 'var(--accent-emerald)' }}
              />
            </div>
          </div>

          <div className="fc-complete-actions">
            {onRestartCram && (
              <button type="button" className="arena-btn-secondary" onClick={onRestartCram}>
                <Shuffle size={15} /> 再刷一輪自由洗牌
              </button>
            )}
            <button type="button" className="arena-btn-primary" onClick={onExit}>
              <Sparkles size={15} /> 返回閃卡中樞
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subjColor = SUBJECT_CONFIG[currentCard.subject]?.color || '#7c3aed';
  const statusMeta = FLASHCARD_STATUS_META[currentCard.srs?.status] || FLASHCARD_STATUS_META.new;
  const leech = isCardLeech(currentCard);

  return (
    <div className="fc-study-shell">
      {/* Top Progress Bar & Controls */}
      <div className="fc-study-topbar">
        <div className="fc-study-topbar-left">
          <button type="button" className="arena-btn-secondary" onClick={onExit}>
            <ArrowLeft size={15} /> 結束練習
          </button>
          <span className={`fc-mode-pill tone-${modeMeta.tone}`}>{modeMeta.label}</span>
          <span className="fc-study-subj-chip">{subjectLabel}</span>
        </div>

        <div className="fc-study-topbar-right">
          <span className="fc-study-counter">
            <strong>{cursor + 1}</strong> / {queueIds.length}
            {requeuedCount > 0 && <em className="fc-requeue-badge">含 {requeuedCount} 次重練</em>}
          </span>
          <button
            type="button"
            className="arena-btn-ghost"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            title="撤銷上一張評分 (Z)"
          >
            <Undo2 size={14} /> 撤銷
          </button>
          {onEditCard && (
            <button
              type="button"
              className="arena-btn-ghost"
              onClick={() => onEditCard(currentCard)}
              title="編輯此張閃卡"
            >
              <Edit3 size={14} /> 編輯
            </button>
          )}
          <button
            type="button"
            className="arena-btn-ghost"
            onClick={() => setShowShortcuts((p) => !p)}
            title="鍵盤快捷鍵說明"
            aria-label="鍵盤快捷鍵說明"
          >
            <Keyboard size={14} />
          </button>
        </div>
      </div>

      {/* Slim Session Progress Track */}
      <div className="fc-study-progress-track">
        <div className="fc-study-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {showShortcuts && (
        <div className="fc-shortcuts-bar">
          <span><kbd>Space</kbd> / <kbd>Enter</kbd> 翻面</span>
          <span><kbd>1</kbd> 重來 · <kbd>2</kbd> 困難 · <kbd>3</kbd> 記得 · <kbd>4</kbd> 秒答</span>
          <span><kbd>H</kbd> 提示 · <kbd>Z</kbd> 撤銷 · <kbd>Esc</kbd> 返回</span>
          <span className="fc-swipe-hint">手機翻面後：左滑重來 / 右滑記得</span>
          <button type="button" className="fc-icon-close" onClick={() => setShowShortcuts(false)} aria-label="關閉快捷鍵提示">
            <X size={13} />
          </button>
        </div>
      )}

      {/* Main 3D Flip Card Stage */}
      <div
        className="fc-card-stage"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isFlipped && Math.abs(swipeDeltaX) > 20 && (
          <div className={`fc-swipe-indicator ${swipeDeltaX < 0 ? 'is-left' : 'is-right'}`}>
            {swipeDeltaX < 0 ? '← 重來 (Again)' : '記得 (Good) →'}
          </div>
        )}

        <div
          className="fc-swipe-wrap"
          style={
            swipeDeltaX !== 0
              ? { transform: `translateX(${swipeDeltaX}px) rotate(${swipeDeltaX * 0.04}deg)` }
              : undefined
          }
        >
        <div
          className={`fc-flip-card ${isFlipped ? 'is-flipped' : ''}`}
          onClick={() => {
            if (!isFlipped) handleFlip();
          }}
        >
          {/* ===== FRONT FACE ===== */}
          <div className="fc-card-face fc-card-front">
            <div className="fc-face-header">
              <div className="fc-face-badges">
                <span
                  className="arena-subj-tag"
                  style={{ background: `${subjColor}18`, color: subjColor }}
                >
                  {currentCard.subject}
                </span>
                {currentCard.code && <span className="fc-code-chip">{currentCard.code}</span>}
                {currentCard.chapter && <span className="fc-chapter-chip">{currentCard.chapter}</span>}
                <span className={`fc-status-pill tone-${statusMeta.tone}`}>{statusMeta.label}</span>
                {leech && (
                  <span className="fc-leech-pill">
                    <Flame size={11} /> 頑固卡 ({currentCard.srs.lapses} 次忘記)
                  </span>
                )}
              </div>

              <div className={`fc-hesitation-timer ${isHesitating ? 'is-warn' : ''}`} title="3 秒猶豫檢測：超過 3 秒代表記憶提取正在衰減">
                <Clock size={13} />
                <span>{elapsedSec.toFixed(1)}s</span>
                {isHesitating && <small>逾 3 秒</small>}
              </div>
            </div>

            <div className="fc-face-body fc-front-body">
              <div className="fc-side-eyebrow">ACTIVE RECALL PROMPT · 主動回憶提問</div>
              <CardMarkdown content={currentCard.front} className="fc-prompt-md" />

              {currentCard.hint && (
                <div className="fc-hint-area" onClick={(e) => e.stopPropagation()}>
                  {showHint ? (
                    <div className="fc-hint-box">
                      <Lightbulb size={14} />
                      <span>{currentCard.hint}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="fc-hint-btn"
                      onClick={() => setShowHint(true)}
                    >
                      <Lightbulb size={13} /> 偷看提示 (H)
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="fc-face-footer">
              <span className="fc-flip-cue">
                <Eye size={14} /> 點擊卡片或按 <kbd>Space</kbd> 翻面核對答案
              </span>
            </div>
          </div>

          {/* ===== BACK FACE ===== */}
          <div className="fc-card-face fc-card-back">
            <div className="fc-face-header">
              <div className="fc-face-badges">
                <span
                  className="arena-subj-tag"
                  style={{ background: `${subjColor}18`, color: subjColor }}
                >
                  {currentCard.subject}
                </span>
                {currentCard.code && <span className="fc-code-chip">{currentCard.code}</span>}
                <span className={`fc-hesitation-timer ${isHesitating ? 'is-warn' : ''}`}>
                  <Clock size={12} /> 回想 {elapsedSec.toFixed(1)}s
                </span>
              </div>

              <button
                type="button"
                className="arena-btn-ghost"
                style={{ padding: '4px 9px', fontSize: '0.75rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
              >
                <RotateCcw size={12} /> 翻回題目
              </button>
            </div>

            <div className="fc-back-prompt-recap">
              <CardMarkdown content={currentCard.front} />
            </div>

            <div className="fc-face-body fc-back-body">
              <div className="fc-side-eyebrow is-answer">ANSWER & KEY POINTS · 精準答案</div>
              <CardMarkdown content={currentCard.back} className="fc-answer-md" />

              {currentCard.mnemonic && (
                <div className="fc-callout is-mnemonic">
                  <Lightbulb size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div className="fc-callout-title">速記口訣 / 易混對照</div>
                    <CardMarkdown content={currentCard.mnemonic} />
                  </div>
                </div>
              )}

              {currentCard.pitfall && (
                <div className="fc-callout is-pitfall">
                  <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div className="fc-callout-title">考場防錯陷阱</div>
                    <CardMarkdown content={currentCard.pitfall} />
                  </div>
                </div>
              )}

              {currentCard.tags && currentCard.tags.length > 0 && (
                <div className="fc-card-tags-row">
                  {currentCard.tags.map((t) => (
                    <span key={t} className="fc-tag-chip">#{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="fc-study-controls">
        {!isFlipped ? (
          <button
            type="button"
            className="fc-reveal-big-btn"
            onClick={handleFlip}
          >
            <Eye size={17} /> 顯示答案與口訣 <kbd>Space</kbd>
          </button>
        ) : (
          <>
            {isHesitating && (
              <div className="fc-hesitation-advice">
                <AlertTriangle size={14} />
                <span>
                  本題思考 <strong>{elapsedSec.toFixed(1)} 秒</strong>（超過 3 秒警戒線），記憶提取偏慢，建議選擇「重來」或「困難」以安排高頻回馬槍。
                </span>
              </div>
            )}

            <div className="fc-rating-grid">
              {FLASHCARD_RATING_OPTIONS.map((opt) => {
                const prev = ratingPreviews[opt.rating];
                const warnEasy = opt.rating === 4 && isHesitating;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`fc-rate-btn tone-${opt.tone} ${warnEasy ? 'is-dimmed' : ''}`}
                    onClick={() => handleRate(opt.rating)}
                  >
                    <div className="fc-rate-top">
                      <kbd>{opt.key}</kbd>
                      <strong>{opt.label}</strong>
                    </div>
                    <span className="fc-rate-interval">{prev?.label || opt.subtitle}</span>
                    <small className="fc-rate-sub">{opt.subtitle}</small>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
