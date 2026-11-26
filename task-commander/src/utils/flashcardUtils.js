// ============================================================================
// Task Commander — Active Recall Flashcards SM-2 Engine, Markdown Interop & AI
// ============================================================================

import { getTodayISO, addDaysISO, SUBJECT_CONFIG } from './examArenaUtils.js';
import { repairJsonStringLiterals } from './examGeneratorUtils.js';

export const FLASHCARD_PATHS = {
  STORE_JSON: 'Review_Dashboard/flashcards_store.json',
  MARKDOWN: 'Review_Dashboard/Active_Recall_Flashcards.md',
};

export const LOCAL_FLASHCARDS_KEY = 'tc_flashcards_store_v1';
export const DEFAULT_DAILY_GOAL = 20;
export const LEECH_LAPSE_THRESHOLD = 3;
export const HESITATION_THRESHOLD_SECONDS = 3;

export const CORE_FLASHCARD_SUBJECTS = ['計算機概論', '微積分', '英文'];

export const FLASHCARD_RATING_OPTIONS = [
  { rating: 1, key: '1', id: 'again', label: '重來', subtitle: '忘記／答錯', tone: 'danger' },
  { rating: 2, key: '2', id: 'hard', label: '困難', subtitle: '勉強想起', tone: 'amber' },
  { rating: 3, key: '3', id: 'good', label: '記得', subtitle: '穩定回憶', tone: 'primary' },
  { rating: 4, key: '4', id: 'easy', label: '秒答', subtitle: '3 秒內反射', tone: 'emerald' },
];

export const FLASHCARD_STATUS_META = {
  new: { label: '新卡', tone: 'blue' },
  learning: { label: '學習中', tone: 'amber' },
  review: { label: '複習中', tone: 'primary' },
  mastered: { label: '已穩固', tone: 'emerald' },
};

const SUBJECT_HEADER_DECOR = {
  計算機概論: { icon: '💻', subtitle: '防遺忘高危名詞與核心考點', codePrefix: 'CS' },
  微積分: { icon: '📐', subtitle: '易忘公式與零容錯檢核閃卡', codePrefix: 'CA' },
  英文: { icon: '📘', subtitle: '學術字彙、易混詞與必考文法', codePrefix: 'EN' },
};

// ============================================================================
// Normalization & Fingerprinting
// ============================================================================

export function computeCardFingerprint(subject, front) {
  const normSubj = String(subject || '其他').trim().toLowerCase();
  const normFront = String(front || '')
    .replace(/\*\*/g, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  const raw = `${normSubj}::${normFront}`;
  // Deterministic 64-bit-ish FNV hash (two 32-bit halves)
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < raw.length; i += 1) {
    const c = raw.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x85ebca6b) >>> 0;
  }
  return `fp-${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}`;
}

export function createDefaultSrs(todayISO = getTodayISO()) {
  return {
    status: 'new',
    repetitions: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    lapses: 0,
    reviewCount: 0,
    lastRating: null,
    dueDate: todayISO,
    lastReviewedAt: null,
    lastResponseMs: null,
  };
}

export function normalizeFlashcard(raw = {}, todayISO = getTodayISO()) {
  const nowIso = new Date().toISOString();
  const subject = String(raw.subject || '其他').trim() || '其他';
  const front = String(raw.front || '').trim();
  const back = String(raw.back || '').trim();
  const srsRaw = raw.srs && typeof raw.srs === 'object' ? raw.srs : {};
  const repetitions = Math.max(0, Number(srsRaw.repetitions) || 0);
  const intervalDays = Math.max(0, Number(srsRaw.intervalDays) || 0);
  const easeFactor = Math.min(3.0, Math.max(1.3, Number(srsRaw.easeFactor) || 2.5));
  const lapses = Math.max(0, Number(srsRaw.lapses) || 0);
  const reviewCount = Math.max(0, Number(srsRaw.reviewCount) || 0);

  let status = srsRaw.status;
  if (!['new', 'learning', 'review', 'mastered'].includes(status)) {
    if (reviewCount === 0 && repetitions === 0) status = 'new';
    else if (intervalDays >= 14) status = 'mastered';
    else if (repetitions <= 1) status = 'learning';
    else status = 'review';
  }

  const tags = Array.isArray(raw.tags)
    ? [...new Set(raw.tags.map((t) => String(t || '').trim()).filter(Boolean))]
    : [];

  const fingerprint = raw.fingerprint || computeCardFingerprint(subject, front);
  const id = String(raw.id || `fc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`).trim();

  return {
    id,
    code: String(raw.code || '').trim(),
    subject,
    chapter: String(raw.chapter || '').trim(),
    front,
    back,
    hint: String(raw.hint || '').trim(),
    mnemonic: String(raw.mnemonic || '').trim(),
    pitfall: String(raw.pitfall || '').trim(),
    tags,
    source: raw.source || 'manual',
    sourceRef: String(raw.sourceRef || '').trim(),
    fingerprint,
    suspended: Boolean(raw.suspended),
    srs: {
      status,
      repetitions,
      intervalDays,
      easeFactor: Math.round(easeFactor * 100) / 100,
      lapses,
      reviewCount,
      lastRating: srsRaw.lastRating ?? null,
      dueDate: srsRaw.dueDate || todayISO,
      lastReviewedAt: srsRaw.lastReviewedAt || null,
      lastResponseMs: Number.isFinite(Number(srsRaw.lastResponseMs)) ? Number(srsRaw.lastResponseMs) : null,
    },
    createdAt: raw.createdAt || nowIso,
    updatedAt: raw.updatedAt || nowIso,
  };
}

export function createEmptyFlashcardsStore() {
  return {
    schemaVersion: 1,
    cards: [],
    deletedIds: [],
    reviewLog: {},
    dailyGoal: DEFAULT_DAILY_GOAL,
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeFlashcardsStore(raw = null, todayISO = getTodayISO()) {
  if (!raw || typeof raw !== 'object') return createEmptyFlashcardsStore();
  const deletedIds = Array.isArray(raw.deletedIds)
    ? [...new Set(raw.deletedIds.map((id) => String(id || '').trim()).filter(Boolean))]
    : [];
  const deletedSet = new Set(deletedIds);

  const cards = Array.isArray(raw.cards)
    ? raw.cards
        .filter((c) => c && typeof c === 'object' && String(c.front || '').trim())
        .map((c) => normalizeFlashcard(c, todayISO))
        .filter((c) => !deletedSet.has(c.id))
    : [];

  const reviewLog = {};
  if (raw.reviewLog && typeof raw.reviewLog === 'object' && !Array.isArray(raw.reviewLog)) {
    for (const [dateKey, entry] of Object.entries(raw.reviewLog)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !entry || typeof entry !== 'object') continue;
      reviewLog[dateKey] = {
        reviewed: Math.max(0, Number(entry.reviewed) || 0),
        again: Math.max(0, Number(entry.again) || 0),
        hard: Math.max(0, Number(entry.hard) || 0),
        good: Math.max(0, Number(entry.good) || 0),
        easy: Math.max(0, Number(entry.easy) || 0),
      };
    }
  }

  const dailyGoal = Math.max(5, Math.min(200, Number(raw.dailyGoal) || DEFAULT_DAILY_GOAL));

  return {
    schemaVersion: 1,
    cards,
    deletedIds: deletedIds.slice(-300),
    reviewLog,
    dailyGoal,
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

// ============================================================================
// SM-2 Spaced Repetition Engine
// ============================================================================

export function formatIntervalLabel(days) {
  const d = Number(days) || 0;
  if (d <= 0) return '本輪重練';
  if (d === 1) return '1 天後';
  if (d < 30) return `${d} 天後`;
  const months = Math.round((d / 30) * 10) / 10;
  return `${months} 個月後`;
}

export function isCardDue(card, todayISO = getTodayISO()) {
  if (!card || card.suspended) return false;
  const srs = card.srs || {};
  if (srs.status === 'new') return true;
  if (!srs.dueDate) return true;
  return String(srs.dueDate) <= String(todayISO);
}

export function isCardLeech(card) {
  if (!card || card.suspended) return false;
  return (card.srs?.lapses || 0) >= LEECH_LAPSE_THRESHOLD;
}

export function previewSm2Schedule(card, rating, todayISO = getTodayISO()) {
  const srs = card?.srs || createDefaultSrs(todayISO);
  const prevReps = Math.max(0, Number(srs.repetitions) || 0);
  const prevInterval = Math.max(0, Number(srs.intervalDays) || 0);
  const prevEf = Math.min(3.0, Math.max(1.3, Number(srs.easeFactor) || 2.5));
  const prevLapses = Math.max(0, Number(srs.lapses) || 0);

  let repetitions = prevReps;
  let intervalDays = prevInterval;
  let easeFactor = prevEf;
  let lapses = prevLapses;
  let status = srs.status || 'new';
  let requeueInSession = false;

  if (rating === 1) {
    // Again: reset repetition streak, increment lapses, re-queue within current session
    repetitions = 0;
    intervalDays = 0;
    easeFactor = Math.max(1.3, prevEf - 0.2);
    lapses = prevLapses + 1;
    status = 'learning';
    requeueInSession = true;
  } else if (rating === 2) {
    // Hard: modest growth, slight ease penalty
    easeFactor = Math.max(1.3, prevEf - 0.15);
    if (prevReps === 0) {
      repetitions = 1;
      intervalDays = 1;
      status = 'learning';
    } else {
      repetitions = prevReps + 1;
      intervalDays = Math.min(180, Math.max(1, Math.round(Math.max(1, prevInterval) * 1.2)));
      status = intervalDays >= 14 ? 'mastered' : 'review';
    }
  } else if (rating === 3) {
    // Good: standard SM-2 progression (1d -> 6d -> interval * EF)
    repetitions = prevReps + 1;
    easeFactor = prevEf;
    if (prevReps === 0) {
      intervalDays = 1;
      status = 'learning';
    } else if (prevReps === 1) {
      intervalDays = 6;
      status = 'review';
    } else {
      intervalDays = Math.min(180, Math.max(prevInterval + 1, Math.round(prevInterval * prevEf)));
      status = intervalDays >= 14 ? 'mastered' : 'review';
    }
  } else {
    // Easy (rating === 4): fast promotion + ease boost
    repetitions = Math.max(2, prevReps + 1);
    easeFactor = Math.min(3.0, prevEf + 0.15);
    if (prevReps === 0) {
      intervalDays = 4;
      status = 'review';
    } else if (prevReps === 1) {
      intervalDays = 8;
      status = 'review';
    } else {
      intervalDays = Math.min(180, Math.max(prevInterval + 2, Math.round(prevInterval * prevEf * 1.3)));
      status = intervalDays >= 14 ? 'mastered' : 'review';
    }
  }

  easeFactor = Math.round(easeFactor * 100) / 100;
  const dueDate = intervalDays > 0 ? addDaysISO(todayISO, intervalDays) : todayISO;

  return {
    status,
    repetitions,
    intervalDays,
    easeFactor,
    lapses,
    dueDate,
    requeueInSession,
    label: formatIntervalLabel(intervalDays),
  };
}

export function applySm2Review(store, cardId, rating, { responseMs = null, todayISO = getTodayISO() } = {}) {
  const safeStore = normalizeFlashcardsStore(store, todayISO);
  const nowIso = new Date().toISOString();
  let updatedCard = null;
  let preview = null;

  const nextCards = safeStore.cards.map((card) => {
    if (card.id !== cardId) return card;
    preview = previewSm2Schedule(card, rating, todayISO);
    updatedCard = {
      ...card,
      srs: {
        ...card.srs,
        status: preview.status,
        repetitions: preview.repetitions,
        intervalDays: preview.intervalDays,
        easeFactor: preview.easeFactor,
        lapses: preview.lapses,
        reviewCount: (card.srs?.reviewCount || 0) + 1,
        lastRating: rating,
        dueDate: preview.dueDate,
        lastReviewedAt: nowIso,
        lastResponseMs: Number.isFinite(Number(responseMs)) ? Math.round(Number(responseMs)) : null,
      },
      updatedAt: nowIso,
    };
    return updatedCard;
  });

  if (!updatedCard) {
    return { nextStore: safeStore, updatedCard: null, preview: null };
  }

  const prevDay = safeStore.reviewLog[todayISO] || { reviewed: 0, again: 0, hard: 0, good: 0, easy: 0 };
  const ratingKey = rating === 1 ? 'again' : rating === 2 ? 'hard' : rating === 3 ? 'good' : 'easy';
  const nextLog = {
    ...safeStore.reviewLog,
    [todayISO]: {
      ...prevDay,
      reviewed: prevDay.reviewed + 1,
      [ratingKey]: (prevDay[ratingKey] || 0) + 1,
    },
  };

  return {
    nextStore: {
      ...safeStore,
      cards: nextCards,
      reviewLog: nextLog,
      updatedAt: nowIso,
    },
    updatedCard,
    preview,
  };
}

// ============================================================================
// Study Queue & Analytics
// ============================================================================

function shuffleCopy(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildStudyQueue(
  cards = [],
  {
    subject = 'ALL',
    mode = 'due', // 'due' | 'cram' | 'leech' | 'new'
    tag = 'ALL',
    search = '',
    shuffle = false,
    todayISO = getTodayISO(),
  } = {}
) {
  const q = String(search || '').trim().toLowerCase();
  const filtered = (cards || []).filter((c) => {
    if (!c || c.suspended) return false;
    if (subject && subject !== 'ALL' && c.subject !== subject) return false;
    if (tag && tag !== 'ALL' && !(c.tags || []).includes(tag)) return false;
    if (q) {
      const hay = `${c.code} ${c.subject} ${c.chapter} ${c.front} ${c.back} ${c.mnemonic} ${(c.tags || []).join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    if (mode === 'due') return isCardDue(c, todayISO);
    if (mode === 'leech') return isCardLeech(c) || (c.srs?.lapses || 0) > 0;
    if (mode === 'new') return c.srs?.status === 'new';
    return true; // 'cram'
  });

  if (shuffle) {
    return shuffleCopy(filtered);
  }

  // Smart priority sort: leeches & overdue learning first, then overdue review, then new cards
  const rankCard = (c) => {
    const leechBoost = isCardLeech(c) ? 0 : 10;
    const statusOrder = { learning: 1, review: 2, new: 3, mastered: 4 };
    const st = statusOrder[c.srs?.status] ?? 3;
    return leechBoost + st;
  };

  return [...filtered].sort((a, b) => {
    const ra = rankCard(a);
    const rb = rankCard(b);
    if (ra !== rb) return ra - rb;
    const da = String(a.srs?.dueDate || '');
    const db = String(b.srs?.dueDate || '');
    if (da !== db) return da.localeCompare(db);
    return (b.srs?.lapses || 0) - (a.srs?.lapses || 0);
  });
}

export function computeFlashcardStats(store, todayISO = getTodayISO()) {
  const safeStore = normalizeFlashcardsStore(store, todayISO);
  const cards = safeStore.cards;
  const activeCards = cards.filter((c) => !c.suspended);
  const suspendedCount = cards.length - activeCards.length;

  let dueCount = 0;
  let newCount = 0;
  let learningCount = 0;
  let reviewCount = 0;
  let masteredCount = 0;
  let leechCount = 0;

  const subjectMap = new Map();
  for (const subj of CORE_FLASHCARD_SUBJECTS) {
    subjectMap.set(subj, { subject: subj, total: 0, due: 0, newCount: 0, learning: 0, review: 0, mastered: 0, leech: 0 });
  }

  for (const c of activeCards) {
    const due = isCardDue(c, todayISO);
    const leech = isCardLeech(c);
    const st = c.srs?.status || 'new';

    if (due) dueCount += 1;
    if (leech) leechCount += 1;
    if (st === 'new') newCount += 1;
    else if (st === 'learning') learningCount += 1;
    else if (st === 'mastered') masteredCount += 1;
    else reviewCount += 1;

    if (!subjectMap.has(c.subject)) {
      subjectMap.set(c.subject, {
        subject: c.subject,
        total: 0,
        due: 0,
        newCount: 0,
        learning: 0,
        review: 0,
        mastered: 0,
        leech: 0,
      });
    }
    const bucket = subjectMap.get(c.subject);
    bucket.total += 1;
    if (due) bucket.due += 1;
    if (leech) bucket.leech += 1;
    if (st === 'new') bucket.newCount += 1;
    else if (st === 'learning') bucket.learning += 1;
    else if (st === 'mastered') bucket.mastered += 1;
    else bucket.review += 1;
  }

  const bySubject = Array.from(subjectMap.values())
    .filter((b) => b.total > 0 || CORE_FLASHCARD_SUBJECTS.includes(b.subject))
    .map((b) => ({
      ...b,
      color: SUBJECT_CONFIG[b.subject]?.color || '#7c3aed',
      masteryPct: b.total > 0 ? Math.round(((b.mastered + b.review * 0.5) / b.total) * 100) : 0,
    }));

  // Today's progress
  const todayLog = safeStore.reviewLog[todayISO] || { reviewed: 0, again: 0, hard: 0, good: 0, easy: 0 };
  const reviewedToday = todayLog.reviewed || 0;
  const dailyGoal = safeStore.dailyGoal || DEFAULT_DAILY_GOAL;
  const todayProgressPct = Math.min(100, Math.round((reviewedToday / Math.max(1, dailyGoal)) * 100));

  // Compute Streak (consecutive days ending today or yesterday with reviewed > 0)
  let streakDays = 0;
  let checkDate = todayISO;
  if ((safeStore.reviewLog[todayISO]?.reviewed || 0) <= 0) {
    checkDate = addDaysISO(todayISO, -1);
  }
  for (let i = 0; i < 365; i += 1) {
    const entry = safeStore.reviewLog[checkDate];
    if (entry && entry.reviewed > 0) {
      streakDays += 1;
      checkDate = addDaysISO(checkDate, -1);
    } else {
      break;
    }
  }

  // Last 14 days activity
  const last14Days = [];
  let maxDailyReviews = 1;
  for (let offset = -13; offset <= 0; offset += 1) {
    const d = addDaysISO(todayISO, offset);
    const entry = safeStore.reviewLog[d] || { reviewed: 0, again: 0, hard: 0, good: 0, easy: 0 };
    if (entry.reviewed > maxDailyReviews) maxDailyReviews = entry.reviewed;
    last14Days.push({
      date: d,
      label: d.slice(5),
      isToday: offset === 0,
      ...entry,
    });
  }

  return {
    totalAll: cards.length,
    totalActive: activeCards.length,
    suspendedCount,
    dueCount,
    newCount,
    learningCount,
    reviewCount,
    masteredCount,
    leechCount,
    reviewedToday,
    todayLog,
    dailyGoal,
    todayProgressPct,
    streakDays,
    last14Days,
    maxDailyReviews,
    bySubject,
  };
}

// ============================================================================
// Math- & Code-Safe Markdown Table Parser / Serializer
// ============================================================================

/**
 * Splits a Markdown table row by unescaped `|` characters ONLY when outside
 * `$...$`, `$$...$$`, and inline `` `...` `` code spans.
 * Prevents breaking LaTeX expressions like `\left|\frac{\partial(x,y)}{\partial(u,v)}\right|`
 * or `\|\mathbf{v}\|`.
 */
export function splitMarkdownTableRow(line) {
  const trimmed = String(line || '').trim();
  if (!trimmed.startsWith('|')) return null;

  let inner = trimmed.slice(1);
  if (inner.endsWith('|') && !inner.endsWith('\\|')) {
    inner = inner.slice(0, -1);
  }

  const cells = [];
  let current = '';
  let inInlineCode = false;
  let inDisplayMath = false;
  let inInlineMath = false;

  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i];
    const next = i + 1 < inner.length ? inner[i + 1] : '';

    // Inside inline code: only closing backtick exits
    if (inInlineCode) {
      if (ch === '`') inInlineCode = false;
      current += ch;
      continue;
    }

    // Toggle inline code (outside math)
    if (!inInlineMath && !inDisplayMath && ch === '`') {
      inInlineCode = true;
      current += ch;
      continue;
    }

    // Escaped char inside or outside math
    if (ch === '\\') {
      if (!inInlineMath && !inDisplayMath && next === '|') {
        current += '|';
        i += 1;
        continue;
      }
      current += ch + next;
      if (i + 1 < inner.length) i += 1;
      continue;
    }

    // Toggle $$ display math
    if (ch === '$' && next === '$') {
      inDisplayMath = !inDisplayMath;
      current += '$$';
      i += 1;
      continue;
    }

    // Toggle $ inline math
    if (!inDisplayMath && ch === '$') {
      inInlineMath = !inInlineMath;
      current += ch;
      continue;
    }

    // Top-level column separator
    if (ch === '|' && !inInlineMath && !inDisplayMath) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  cells.push(current.trim());
  return cells;
}

function inferSubjectFromHeading(headingLine, code = '') {
  const h = String(headingLine || '');
  const c = String(code || '').toUpperCase();

  if (h.includes('計算機概論') || h.includes('計概') || c.startsWith('CS-')) return '計算機概論';
  if (h.includes('微積分') || /calculus/i.test(h) || c.startsWith('CA-')) return '微積分';
  if (h.includes('英文') || /english/i.test(h) || c.startsWith('EN-')) return '英文';
  if (h.includes('資料結構')) return '資料結構';
  if (h.includes('作業系統')) return '作業系統';
  if (h.includes('統計學')) return '統計學';
  if (h.includes('經濟學')) return '經濟學';

  // Generic custom heading: `## 📚 科目名稱：說明` or `## 科目名稱`
  const cleaned = h
    .replace(/^#{2,3}\s*/, '')
    .replace(/^[^\u4e00-\u9fa5A-Za-z0-9]+/, '')
    .replace(/^[一二三四五六七八九十]+[、.．]\s*/, '')
    .trim();
  const colonIdx = cleaned.search(/[：:（(]/);
  const candidate = (colonIdx > 0 ? cleaned.slice(0, colonIdx) : cleaned).trim();
  if (candidate && !candidate.includes('刷題戰情室自動萃取')) {
    return candidate.slice(0, 24);
  }
  return '其他';
}

function inferChapterFromHeading(headingLine) {
  const cleaned = String(headingLine || '')
    .replace(/^#{2,3}\s*/, '')
    .trim();
  const match = cleaned.match(/[：:]\s*([^（(]+)/);
  if (match && match[1]) return match[1].trim();
  return '';
}

function extractMnemonicFromAnswer(rawAnswer) {
  const text = String(rawAnswer || '').replace(/<br\s*\/?>/gi, '\n').trim();
  // Match `口訣：...` near the end
  const m = text.match(/(?:^|[。；;\n]\s*)口訣[：:]\s*(.+)$/);
  if (m && m[1]) {
    const mnemonic = m[1].replace(/^[「『"']|[」』"']$/g, '').trim();
    const back = text.slice(0, m.index).replace(/[。；;\s]+$/, '').trim();
    if (back) {
      return { back, mnemonic };
    }
  }
  return { back: text, mnemonic: '' };
}

function stripOuterBold(text) {
  const s = String(text || '').trim();
  if (s.startsWith('**') && s.endsWith('**') && s.indexOf('**', 2) === s.length - 2) {
    return s.slice(2, -2).trim();
  }
  return s;
}

export function parseFlashcardsMarkdown(mdText, todayISO = getTodayISO()) {
  if (!mdText) return [];
  const lines = String(mdText).split(/\r?\n/);
  const cards = [];
  let currentHeading = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^#{2,3}\s+/.test(trimmed)) {
      currentHeading = trimmed;
      continue;
    }
    if (!trimmed.startsWith('|')) continue;
    if (/^\|[\s:|-]+\|?$/.test(trimmed) && trimmed.includes('-')) continue;

    const cells = splitMarkdownTableRow(trimmed);
    if (!cells || cells.length < 3) continue;
    // Skip table header rows
    if (
      (cells[0] === '#' || cells[0].includes('編號')) &&
      (cells[1].includes('提問') || cells[1].includes('Prompt') || cells[1].includes('正面'))
    ) {
      continue;
    }

    const code = cells[0].replace(/\*\*/g, '').trim();
    const rawFront = cells[1].replace(/<br\s*\/?>/gi, '\n').trim();
    const rawBack = cells[2].trim();
    if (!rawFront || !rawBack) continue;

    const subject = inferSubjectFromHeading(currentHeading, code);
    const chapter = inferChapterFromHeading(currentHeading);
    const front = stripOuterBold(rawFront);
    const { back, mnemonic } = extractMnemonicFromAnswer(rawBack);
    const extraPitfall = cells[3] ? cells[3].replace(/<br\s*\/?>/gi, '\n').trim() : '';

    const isSeedCode = /^[A-Z]{2,4}-\d{2,3}$/i.test(code);
    const id = isSeedCode
      ? `seed-${code.toLowerCase()}`
      : `md-${computeCardFingerprint(subject, front).slice(3, 15)}`;

    const tags = [];
    if (isSeedCode) tags.push('核心種子');
    if (currentHeading.includes('自動萃取')) tags.push('刷題萃取');

    cards.push(
      normalizeFlashcard(
        {
          id,
          code,
          subject,
          chapter,
          front,
          back,
          mnemonic,
          pitfall: extraPitfall,
          tags,
          source: isSeedCode ? 'seed_md' : 'md_import',
          sourceRef: code || '',
        },
        todayISO
      )
    );
  }

  return cards;
}

export function mergeMarkdownIntoStore(store, mdText, todayISO = getTodayISO()) {
  const safeStore = normalizeFlashcardsStore(store, todayISO);
  const parsed = parseFlashcardsMarkdown(mdText, todayISO);
  if (parsed.length === 0) return { nextStore: safeStore, addedCount: 0 };

  const deletedSet = new Set(safeStore.deletedIds || []);
  const byId = new Set(safeStore.cards.map((c) => c.id));
  const byCode = new Set(safeStore.cards.map((c) => c.code).filter(Boolean));
  const byFp = new Set(safeStore.cards.map((c) => c.fingerprint || computeCardFingerprint(c.subject, c.front)));

  const newCards = [];
  for (const c of parsed) {
    if (deletedSet.has(c.id)) continue;
    if (byId.has(c.id)) continue;
    if (c.code && byCode.has(c.code)) continue;
    if (byFp.has(c.fingerprint)) continue;

    newCards.push(c);
    byId.add(c.id);
    if (c.code) byCode.add(c.code);
    byFp.add(c.fingerprint);
  }

  if (newCards.length === 0) {
    return { nextStore: safeStore, addedCount: 0 };
  }

  return {
    nextStore: {
      ...safeStore,
      cards: [...safeStore.cards, ...newCards],
      updatedAt: new Date().toISOString(),
    },
    addedCount: newCards.length,
  };
}

function escapeTableCell(text) {
  const s = String(text || '').trim().replace(/\r?\n/g, '<br>');
  // Escape pipes `|` ONLY outside $...$, $$...$$, and `...`
  let out = '';
  let inCode = false;
  let inInlineMath = false;
  let inDisplayMath = false;

  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];
    const next = i + 1 < s.length ? s[i + 1] : '';

    if (inCode) {
      if (ch === '`') inCode = false;
      out += ch;
      continue;
    }
    if (!inInlineMath && !inDisplayMath && ch === '`') {
      inCode = true;
      out += ch;
      continue;
    }
    if (ch === '\\') {
      out += ch + next;
      if (i + 1 < s.length) i += 1;
      continue;
    }
    if (ch === '$' && next === '$') {
      inDisplayMath = !inDisplayMath;
      out += '$$';
      i += 1;
      continue;
    }
    if (!inDisplayMath && ch === '$') {
      inInlineMath = !inInlineMath;
      out += ch;
      continue;
    }
    if (ch === '|' && !inInlineMath && !inDisplayMath) {
      out += '\\|';
      continue;
    }
    out += ch;
  }
  return out;
}

export function serializeStoreToMarkdown(store) {
  const safeStore = normalizeFlashcardsStore(store);
  const grouped = new Map();

  for (const subj of CORE_FLASHCARD_SUBJECTS) {
    grouped.set(subj, []);
  }
  for (const c of safeStore.cards) {
    if (!grouped.has(c.subject)) grouped.set(c.subject, []);
    grouped.get(c.subject).push(c);
  }

  const sections = [
    '# ⚡ 116 台聯大 A4 主動回憶閃卡庫 (Active Recall Flashcards)',
    '',
    '> **使用方式**：可在 Task Commander「刷題戰情室 → 主動回憶閃卡」進行 SM-2 智慧翻卡、3 秒猶豫檢核與清單遮罩速掃。',
    `> **同步狀態**：共收錄 **${safeStore.cards.length}** 張主動回憶閃卡（最後同步：${getTodayISO()}），與本機 \`flashcards_store.json\` 及 Supabase 雲端雙向互通。`,
  ];

  const numerals = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  let secIdx = 0;

  for (const [subj, list] of grouped.entries()) {
    if (list.length === 0) continue;
    const decor = SUBJECT_HEADER_DECOR[subj] || { icon: '📚', subtitle: '重點觀念與高頻考點', codePrefix: 'FC' };
    const numLabel = numerals[secIdx] || String(secIdx + 1);
    secIdx += 1;

    sections.push('', '---', '', `## ${decor.icon} ${numLabel}、${subj}：${decor.subtitle}`, '');
    sections.push('| # | 主動回憶提問 (Prompt) | 精準答案與一句話口訣 (Answer & Mnemonic) |');
    sections.push('| :-: | :--- | :--- |');

    list.forEach((card, idx) => {
      const code = card.code || `${decor.codePrefix}-${String(idx + 1).padStart(2, '0')}`;
      const frontCell = escapeTableCell(`**${card.front}**`);
      const answerParts = [card.back];
      if (card.pitfall) answerParts.push(`⚠️ 陷阱：${card.pitfall}`);
      if (card.mnemonic) answerParts.push(`口訣：${card.mnemonic}`);
      const backCell = escapeTableCell(answerParts.join('。'));
      sections.push(`| ${code} | ${frontCell} | ${backCell} |`);
    });
  }

  sections.push('');
  return sections.join('\n');
}

// ============================================================================
// Mistake & Exam Question -> Structured Flashcard Extraction
// ============================================================================

export function createCardFromExamQuestion({ exam, question, reasons = [], source = 'exam_blindspot', todayISO = getTodayISO() }) {
  if (!question) return null;
  const subject = String(exam?.subject || '其他').trim() || '其他';
  const chapter = String(question.chapter || '').trim();
  const subtopic = String(question.subtopic || '').trim();

  // Build crisp front prompt (use real question stem; if very long, combine subtopic + concise stem)
  let rawPrompt = String(question.prompt || '').trim();
  if (rawPrompt.length > 360) {
    rawPrompt = `${rawPrompt.slice(0, 340).trim()}...`;
  }
  const front = subtopic && !rawPrompt.includes(subtopic)
    ? `【${subtopic}】${rawPrompt}`
    : (rawPrompt || subtopic || `Q${question.number || ''}`);

  // Build comprehensive back answer (resolve MCQ option text if applicable)
  const answerParts = [];
  if (question.type === 'mcq' && Array.isArray(question.options)) {
    const hit = question.options.find(
      (o) => String(o.key || '').trim().toUpperCase() === String(question.answer || '').trim().toUpperCase()
    );
    if (hit) {
      answerParts.push(`**答案 (${hit.key})**：${hit.text}`);
    } else if (question.answer) {
      answerParts.push(`**答案**：${question.answer}`);
    }
  } else if (question.answer) {
    answerParts.push(`**答案**：${question.answer}`);
  }

  if (question.coreFormula) {
    answerParts.push(`**核心觀念／公式**：${question.coreFormula}`);
  } else if (question.solution) {
    const shortSol = String(question.solution).trim();
    answerParts.push(shortSol.length > 260 ? `${shortSol.slice(0, 250).trim()}...` : shortSol);
  }

  const back = answerParts.join('\n\n') || String(question.mnemonic || '請對照原題詳解');
  const sourceRef = `${subject}::${chapter}::${question.id || question.number || ''}`;

  return normalizeFlashcard(
    {
      id: `fc-${computeCardFingerprint(subject, front).slice(3, 15)}`,
      subject,
      chapter,
      front,
      back,
      hint: subtopic ? `考點提示：${subtopic}` : '',
      mnemonic: String(question.mnemonic || '').trim(),
      pitfall: String(question.pitfall || '').trim(),
      tags: [...new Set(['刷題盲區', ...(Array.isArray(reasons) ? reasons : [])])],
      source,
      sourceRef,
    },
    todayISO
  );
}

export function createCardFromMistake(mistake, todayISO = getTodayISO()) {
  if (!mistake?.question) return null;
  const card = createCardFromExamQuestion({
    exam: { subject: mistake.subject, title: mistake.examTitle },
    question: mistake.question,
    reasons: mistake.reasons || [],
    source: 'mistake_bank',
    todayISO,
  });
  if (card && mistake.key) {
    card.sourceRef = mistake.key;
  }
  return card;
}

export function addCardsWithDedup(store, incomingCards = [], todayISO = getTodayISO()) {
  const safeStore = normalizeFlashcardsStore(store, todayISO);
  const byId = new Set(safeStore.cards.map((c) => c.id));
  const byFp = new Set(safeStore.cards.map((c) => c.fingerprint || computeCardFingerprint(c.subject, c.front)));
  const bySourceRef = new Set(safeStore.cards.map((c) => c.sourceRef).filter(Boolean));
  const deletedSet = new Set(safeStore.deletedIds || []);

  const toAdd = [];
  let skippedCount = 0;

  for (const raw of incomingCards || []) {
    if (!raw) continue;
    const card = normalizeFlashcard(raw, todayISO);
    if (!card.front || !card.back) {
      skippedCount += 1;
      continue;
    }
    if (
      byId.has(card.id) ||
      byFp.has(card.fingerprint) ||
      (card.sourceRef && bySourceRef.has(card.sourceRef))
    ) {
      skippedCount += 1;
      continue;
    }

    // If user explicitly adds back a previously deleted card, revive it by removing tombstone
    deletedSet.delete(card.id);
    toAdd.push(card);
    byId.add(card.id);
    byFp.add(card.fingerprint);
    if (card.sourceRef) bySourceRef.add(card.sourceRef);
  }

  if (toAdd.length === 0) {
    return { nextStore: safeStore, addedCount: 0, skippedCount };
  }

  return {
    nextStore: {
      ...safeStore,
      cards: [...toAdd, ...safeStore.cards],
      deletedIds: Array.from(deletedSet),
      updatedAt: new Date().toISOString(),
    },
    addedCount: toAdd.length,
    skippedCount,
  };
}

// ============================================================================
// Conflict-Free Cross-Device Merge (Supabase Realtime + Local)
// ============================================================================

function parseMs(val) {
  if (!val) return 0;
  const ms = Date.parse(val);
  return Number.isFinite(ms) ? ms : 0;
}

function mergeSingleCard(localCard, remoteCard) {
  const tLocal = parseMs(localCard.updatedAt);
  const tRemote = parseMs(remoteCard.updatedAt);
  const contentWinner = tRemote >= tLocal ? remoteCard : localCard;

  // For SRS progress, prefer higher reviewCount; on tie prefer newer lastReviewedAt
  const lSrs = localCard.srs || {};
  const rSrs = remoteCard.srs || {};
  const lCount = Number(lSrs.reviewCount) || 0;
  const rCount = Number(rSrs.reviewCount) || 0;
  let srsWinner = lSrs;
  if (rCount > lCount) {
    srsWinner = rSrs;
  } else if (rCount === lCount && parseMs(rSrs.lastReviewedAt) >= parseMs(lSrs.lastReviewedAt)) {
    srsWinner = rSrs;
  }

  return normalizeFlashcard({
    ...contentWinner,
    srs: srsWinner,
    updatedAt: new Date(Math.max(tLocal, tRemote, Date.now())).toISOString(),
  });
}

export function mergeFlashcardsPayload(localRaw = {}, remoteRaw = {}) {
  const local = normalizeFlashcardsStore(localRaw);
  const remote = normalizeFlashcardsStore(remoteRaw);

  const deletedSet = new Set([...(local.deletedIds || []), ...(remote.deletedIds || [])]);
  const mapById = new Map();
  const fpToId = new Map();

  const ingest = (list) => {
    for (const card of list || []) {
      if (!card?.id || deletedSet.has(card.id)) continue;
      const existingById = mapById.get(card.id);
      if (existingById) {
        mapById.set(card.id, mergeSingleCard(existingById, card));
        continue;
      }
      const fp = card.fingerprint || computeCardFingerprint(card.subject, card.front);
      const existingIdByFp = fpToId.get(fp);
      if (existingIdByFp && mapById.has(existingIdByFp)) {
        const merged = mergeSingleCard(mapById.get(existingIdByFp), card);
        mapById.set(existingIdByFp, { ...merged, id: existingIdByFp });
        continue;
      }
      mapById.set(card.id, card);
      fpToId.set(fp, card.id);
    }
  };

  ingest(local.cards);
  ingest(remote.cards);

  // Merge reviewLog per day (take max reviewed)
  const reviewLog = {};
  const allDates = new Set([...Object.keys(local.reviewLog || {}), ...Object.keys(remote.reviewLog || {})]);
  for (const d of allDates) {
    const lDay = local.reviewLog?.[d];
    const rDay = remote.reviewLog?.[d];
    if (!lDay) reviewLog[d] = rDay;
    else if (!rDay) reviewLog[d] = lDay;
    else reviewLog[d] = (rDay.reviewed || 0) >= (lDay.reviewed || 0) ? rDay : lDay;
  }

  const dailyGoal = parseMs(remote.updatedAt) >= parseMs(local.updatedAt)
    ? (remote.dailyGoal || local.dailyGoal || DEFAULT_DAILY_GOAL)
    : (local.dailyGoal || remote.dailyGoal || DEFAULT_DAILY_GOAL);

  return {
    schemaVersion: 1,
    cards: Array.from(mapById.values()),
    deletedIds: Array.from(deletedSet).slice(-300),
    reviewLog,
    dailyGoal,
    updatedAt: new Date(Math.max(parseMs(local.updatedAt), parseMs(remote.updatedAt), Date.now())).toISOString(),
  };
}

// ============================================================================
// Anki TSV Export
// ============================================================================

function sanitizeTsvField(str) {
  return String(str || '')
    .replace(/\t/g, '  ')
    .replace(/\r?\n/g, '<br>');
}

export function exportFlashcardsToAnkiTsv(cards = []) {
  const lines = [
    '#separator:tab',
    '#html:true',
    '#tags column:3',
  ];

  for (const c of cards || []) {
    if (!c?.front || !c?.back) continue;
    const frontHtml = c.hint
      ? `${sanitizeTsvField(c.front)}<br><small style="color:#64748b">提示：${sanitizeTsvField(c.hint)}</small>`
      : sanitizeTsvField(c.front);

    const backBlocks = [sanitizeTsvField(c.back)];
    if (c.mnemonic) backBlocks.push(`<b>口訣：</b>${sanitizeTsvField(c.mnemonic)}`);
    if (c.pitfall) backBlocks.push(`<b>陷阱：</b>${sanitizeTsvField(c.pitfall)}`);
    const backHtml = backBlocks.join('<br><br>');

    const tags = [c.subject, c.chapter, ...(c.tags || [])]
      .map((t) => String(t || '').trim().replace(/\s+/g, '_'))
      .filter(Boolean)
      .join(' ');

    lines.push(`${frontHtml}\t${backHtml}\t${tags}`);
  }

  return lines.join('\n');
}

// ============================================================================
// AI Flashcard Generator Prompt & Robust JSON Parser
// ============================================================================

export function buildAiFlashcardsPrompt({
  subject = '計算機概論',
  topic = '',
  count = 10,
  style = 'exam_high_yield', // 'exam_high_yield' | 'formula_drill' | 'vocab_contrast' | 'concept_trap'
  referenceFiles = [],
  weakChapters = [],
  activeMistakes = [],
  existingFronts = [],
  extraInstructions = '',
  isAgyCli = false,
}) {
  const safeCount = Math.max(3, Math.min(30, Number(count) || 10));
  const styleDescMap = {
    exam_high_yield: '高含金量轉學考／期中期末考點（精準提問＋直接答案＋一句話口訣＋考場陷阱）',
    formula_drill: '核心公式、定理前提條件、積分／複雜度與邊界檢核快篩',
    vocab_contrast: '學術單字正負向對照、易混形近詞辨析、必考文法句型陷阱',
    concept_trap: '專攻容易混淆的觀念比較（A vs B）與歷屆實考高失分盲區',
  };
  const styleDesc = styleDescMap[style] || styleDescMap.exam_high_yield;

  const agyGuard = isAgyCli
    ? '【重要執行指令】你現在處於純 JSON 閃卡輸出模式：嚴禁呼叫任何工具（不要讀檔、不要寫檔、不要執行指令），不要輸出任何前言或結語，只輸出一個合法完整的 JSON 物件。\n\n'
    : '';

  const systemPrompt = `${agyGuard}你是專精大學理工／商管課程與台聯大 A4（清大資工 90+ 頂標）的記憶科學與命題專家。
你的唯一任務是輸出**嚴格合法的單一 JSON 物件**，內含高質量的「主動回憶閃卡 (Active Recall Flashcards)」。

【絕對格式與品質鐵律】
1. 只輸出單一 JSON 物件（以 \`{\` 開頭、\`}\` 結尾），包含 \`cards\` 陣列。
2. 所有 LaTeX 數學公式務必使用雙重反斜線跳脫（例如 \`"$\\\\frac{1}{2}$"\`、\`"$\\\\int_0^1 x\\\\,dx$"\`、\`"$\\\\theta$"\`、\`"$\\\\le$"\`、\`"$\\\\neq$"\`）。
3. 每張閃卡正面 \`front\` 必須是「單一明確、可在 3–10 秒內口頭回答」的主動回憶提問，禁止寬泛如「請介紹第三章」。
4. 背面 \`back\` 精煉直擊得分要點；\`mnemonic\` 給一句好背的口訣或易混對照；\`pitfall\` 點出最致命的扣分陷阱。
5. 一律使用繁體中文（台灣大學常用學術名詞，關鍵術語附英文）。`;

  const weakBlock = Array.isArray(weakChapters) && weakChapters.length > 0
    ? `\n【優先補強的記憶衰減章節】\n${weakChapters.slice(0, 8).map((w) => `- ${w.chapter}（${w.status}，${w.notes || ''}）`).join('\n')}\n`
    : '';

  const mistakeBlock = Array.isArray(activeMistakes) && activeMistakes.length > 0
    ? `\n【考生近期錯題與盲區（優先轉為高頻防錯閃卡）】\n${activeMistakes.slice(0, 8).map((m, i) => `${i + 1}. [${m.chapter}] ${m.subtopic || m.question?.prompt?.slice(0, 60) || ''}（原因：${(m.reasons || []).join('、')}）`).join('\n')}\n`
    : '';

  const dedupBlock = Array.isArray(existingFronts) && existingFronts.length > 0
    ? `\n【閃卡庫已收錄提問（請勿重複出相同考點）】\n${existingFronts.slice(0, 20).map((f) => `- ${String(f).slice(0, 75)}`).join('\n')}\n`
    : '';

  let refBlock = '';
  if (Array.isArray(referenceFiles) && referenceFiles.length > 0) {
    const budget = 32000;
    const perFile = Math.max(3000, Math.floor(budget / referenceFiles.length));
    const parts = referenceFiles
      .filter((r) => r?.content)
      .map((r) => `### 參考資料：${r.title || r.path}\n${r.content.slice(0, perFile)}`);
    if (parts.length > 0) {
      refBlock = `\n===== 參考教材／筆記內容 =====\n${parts.join('\n\n---\n\n')}\n===== 參考資料結束 =====\n`;
    }
  }

  const extraBlock = extraInstructions?.trim() ? `\n【使用者額外要求】\n${extraInstructions.trim()}\n` : '';

  const userPrompt = `請為科目「${subject}」製作 **${safeCount} 張**高含金量主動回憶閃卡：
- 範圍／主題：${topic?.trim() || `${subject} 核心高頻考點與易忘盲區`}
- 閃卡風格：${styleDesc}
${weakBlock}${mistakeBlock}${dedupBlock}${extraBlock}
【JSON 輸出格式】
{
  "subject": "${subject}",
  "cards": [
    {
      "chapter": "所屬章節名稱",
      "front": "精準的主動回憶提問（支援 Markdown、行內程式碼與 LaTeX $...$）",
      "back": "精準核心答案（精簡有力，直接命中評分關鍵）",
      "hint": "可選的極簡記憶線索（答不出來時偷看，不要直接洩漏答案）",
      "mnemonic": "一句話速記口訣或正反對照",
      "pitfall": "考場最常見的失分陷阱",
      "tags": ["標籤1", "標籤2"]
    }
  ]
}
${refBlock}
請直接輸出完整合法 JSON 物件：`;

  return { systemPrompt, userPrompt };
}

function extractOutermostJson(raw) {
  let text = String(raw || '').replace(/^\uFEFF/, '').trim();
  const fenceMatch = text.match(/```(?:json)?\s*\r?\n([\s\S]*?)\r?\n```/i);
  if (fenceMatch && fenceMatch[1]) {
    text = fenceMatch[1].trim();
  }
  const objIdx = text.indexOf('{');
  const arrIdx = text.indexOf('[');
  if (objIdx < 0 && arrIdx < 0) return text;
  const start = objIdx >= 0 && (arrIdx < 0 || objIdx < arrIdx) ? objIdx : arrIdx;
  const openCh = text[start];
  const closeCh = openCh === '{' ? '}' : ']';

  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === openCh) depth += 1;
    else if (ch === closeCh) {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  const lastClose = text.lastIndexOf(closeCh);
  return lastClose > start ? text.slice(start, lastClose + 1) : text.slice(start);
}

export function parseAndRepairFlashcardsJson(rawText, { subject = '計算機概論', topic = '' } = {}) {
  const extracted = extractOutermostJson(rawText);
  if (!extracted) {
    throw new Error('AI 回覆為空，無法解析閃卡 JSON');
  }

  let parsed = null;
  try {
    parsed = JSON.parse(extracted);
  } catch {
    const repaired = repairJsonStringLiterals(extracted);
    parsed = JSON.parse(repaired);
  }

  const rawList = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.cards)
      ? parsed.cards
      : Array.isArray(parsed?.flashcards)
        ? parsed.flashcards
        : [];

  if (rawList.length === 0) {
    throw new Error('JSON 中找不到有效的 cards 閃卡陣列');
  }

  const defaultSubject = String(parsed?.subject || subject || '其他').trim();
  const normalized = [];

  for (const item of rawList) {
    if (!item || typeof item !== 'object') continue;
    const front = String(item.front || item.prompt || item.question || '').trim();
    const back = String(item.back || item.answer || '').trim();
    if (!front || !back) continue;

    normalized.push(
      normalizeFlashcard({
        id: `fc-ai-${computeCardFingerprint(item.subject || defaultSubject, front).slice(3, 15)}`,
        subject: String(item.subject || defaultSubject).trim(),
        chapter: String(item.chapter || topic || '').trim(),
        front,
        back,
        hint: String(item.hint || '').trim(),
        mnemonic: String(item.mnemonic || '').trim(),
        pitfall: String(item.pitfall || '').trim(),
        tags: [...new Set(['AI生成', ...(Array.isArray(item.tags) ? item.tags : [])])],
        source: 'ai_generated',
      })
    );
  }

  if (normalized.length === 0) {
    throw new Error('解析後的閃卡皆缺少有效 front / back 欄位');
  }

  return normalized;
}
