export const ARENA_PATHS = {
  HISTORY_JSON: 'Test_Bank/Exam_paper/Transfer/exam_arena_history.json',
  CONSOLIDATED_STATUS: 'Test_Bank/Exam_paper/Transfer/Consolidated_Learning_Status.md',
  FLASHCARDS: 'Review_Dashboard/Active_Recall_Flashcards.md',
  SUBJECT_STATUS: {
    微積分: 'Test_Bank/Exam_paper/Transfer/微積分/Learning_Status.md',
    計算機概論: 'Test_Bank/Exam_paper/Transfer/計算機概論/Learning_Status.md',
    英文: 'Test_Bank/Exam_paper/Transfer/UST_Transfer_English/Learning_Status.md',
  },
  SUBJECT_REVIEW: {
    微積分: 'Review_Dashboard/Calculus_Review.md',
    計算機概論: 'Review_Dashboard/CS_Review.md',
    英文: 'Review_Dashboard/English_Review.md',
  },
};

export const SUBJECT_CONFIG = {
  微積分: {
    key: '微積分',
    label: '微積分',
    weight: 2,
    baseline115: 84,
    target116: 94,
    defaultHalfLife: 10,
    color: '#4f46e5',
  },
  計算機概論: {
    key: '計算機概論',
    label: '計算機概論',
    weight: 2,
    baseline115: 80,
    target116: 92,
    defaultHalfLife: 7,
    color: '#059669',
  },
  英文: {
    key: '英文',
    label: '英文',
    weight: 1,
    baseline115: 80,
    target116: 92,
    defaultHalfLife: 5,
    color: '#d97706',
  },
};

export const CONFIDENCE_OPTIONS = [
  { id: 'confident', label: '會寫', shortLabel: '會寫', tone: 'emerald' },
  { id: 'guessed', label: '靠猜', shortLabel: '靠猜', tone: 'amber' },
  { id: 'forgot', label: '忘記公式 / 定義', shortLabel: '忘記', tone: 'danger' },
];

export const MODE_LABELS = {
  diagnostic: '喚醒診斷卷',
  mock: '全真模擬卷',
  targeted: '弱點打擊卷',
  sweep: '章節掃題卷',
  micro_drill: '高頻微訓練',
  spaced_recall: '回馬槍專卷',
  mistake_retry: '錯題重練',
};

export function getTodayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDaysISO(dateStr, days) {
  const base = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
  if (Number.isNaN(base.getTime())) return getTodayISO();
  base.setDate(base.getDate() + Number(days || 0));
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function diffDaysFromToday(dateStr) {
  if (!dateStr) return 999;
  const parsed = new Date(`${String(dateStr).trim()}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return 999;
  const today = new Date(`${getTodayISO()}T00:00:00`);
  return Math.max(0, Math.round((today.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24)));
}

export function formatSeconds(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function normalizeAnswerText(val) {
  return String(val || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
}

export function suggestFillSelfGrade(question, userAnswer) {
  const normUser = normalizeAnswerText(userAnswer);
  if (!normUser) return null;
  const candidates = [question.answer, ...(Array.isArray(question.acceptableAnswers) ? question.acceptableAnswers : [])]
    .filter(Boolean)
    .map(normalizeAnswerText);
  if (candidates.includes(normUser)) return 'correct';
  return null;
}

export function gradeQuestionItem(question, response = {}) {
  const pts = Number(question.points || 0);
  const userAnswer = String(response.answer || '').trim();
  const confidence = response.confidence || null;

  if (question.type === 'mcq') {
    const isCorrect =
      userAnswer !== '' &&
      normalizeAnswerText(userAnswer) === normalizeAnswerText(question.answer);
    return {
      status: isCorrect ? 'correct' : 'wrong',
      earnedPoints: isCorrect ? pts : 0,
      maxPoints: pts,
      needsManualGrade: false,
      isBlindSpot: !isCorrect || confidence === 'guessed' || confidence === 'forgot',
      confidence,
    };
  }

  const sg = response.selfGrade || null;
  if (sg === 'correct') {
    return {
      status: 'correct',
      earnedPoints: pts,
      maxPoints: pts,
      needsManualGrade: false,
      isBlindSpot: confidence === 'guessed' || confidence === 'forgot',
      confidence,
    };
  }
  if (sg === 'partial') {
    return {
      status: 'partial',
      earnedPoints: Math.round(pts * 0.5 * 10) / 10,
      maxPoints: pts,
      needsManualGrade: false,
      isBlindSpot: true,
      confidence,
    };
  }
  if (sg === 'wrong') {
    return {
      status: 'wrong',
      earnedPoints: 0,
      maxPoints: pts,
      needsManualGrade: false,
      isBlindSpot: true,
      confidence,
    };
  }

  return {
    status: 'pending',
    earnedPoints: 0,
    maxPoints: pts,
    needsManualGrade: true,
    isBlindSpot: userAnswer === '' || confidence === 'guessed' || confidence === 'forgot',
    confidence,
  };
}

export function gradeExamSession(exam, responses = {}) {
  const questions = Array.isArray(exam?.questions) ? exam.questions : [];
  let earnedPoints = 0;
  let maxPoints = 0;
  let correctCount = 0;
  let partialCount = 0;
  let wrongCount = 0;
  let pendingCount = 0;

  const confidenceStats = {
    confidentCorrect: 0,
    guessedCorrect: 0,
    forgotCount: 0,
    untaggedCount: 0,
  };

  const perQuestion = {};
  const blindSpotQuestions = [];

  for (const q of questions) {
    const resp = responses[q.id] || {};
    const graded = gradeQuestionItem(q, resp);
    perQuestion[q.id] = graded;

    earnedPoints += graded.earnedPoints;
    maxPoints += graded.maxPoints;

    if (graded.status === 'correct') correctCount += 1;
    else if (graded.status === 'partial') partialCount += 1;
    else if (graded.status === 'wrong') wrongCount += 1;
    else pendingCount += 1;

    if (!resp.confidence) confidenceStats.untaggedCount += 1;
    if (resp.confidence === 'forgot') confidenceStats.forgotCount += 1;
    if (graded.status === 'correct' && resp.confidence === 'confident') {
      confidenceStats.confidentCorrect += 1;
    }
    if (graded.status === 'correct' && resp.confidence === 'guessed') {
      confidenceStats.guessedCorrect += 1;
    }

    if (graded.isBlindSpot) {
      blindSpotQuestions.push({
        question: q,
        response: resp,
        graded,
      });
    }
  }

  const percentage = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 1000) / 10 : 0;

  return {
    earnedPoints: Math.round(earnedPoints * 10) / 10,
    maxPoints,
    percentage,
    correctCount,
    partialCount,
    wrongCount,
    pendingCount,
    confidenceStats,
    perQuestion,
    blindSpotQuestions,
  };
}

export function computeWeightedProjection(history = []) {
  const latestBySubject = {};
  for (const entry of history) {
    const subj = entry.subject;
    if (!SUBJECT_CONFIG[subj]) continue;
    if (entry.mode === 'mistake_retry') continue;
    if (!latestBySubject[subj]) {
      latestBySubject[subj] = entry.percentage;
    }
  }

  const calc = latestBySubject['微積分'] ?? SUBJECT_CONFIG['微積分'].baseline115;
  const cs = latestBySubject['計算機概論'] ?? SUBJECT_CONFIG['計算機概論'].baseline115;
  const eng = latestBySubject['英文'] ?? SUBJECT_CONFIG['英文'].baseline115;

  const weightedTotal = Math.round((calc * 2 + cs * 2 + eng * 1) * 10) / 10;

  return {
    scores: { 微積分: calc, 計算機概論: cs, 英文: eng },
    hasLiveAttempt: {
      微積分: latestBySubject['微積分'] !== undefined,
      計算機概論: latestBySubject['計算機概論'] !== undefined,
      英文: latestBySubject['英文'] !== undefined,
    },
    weightedTotal,
    cutoff115Regular: 442,
    cutoff115Waitlist: 416,
    target116Safe: 454,
  };
}

export function parseConsolidatedLearningStatus(mdText) {
  if (!mdText) return [];
  const lines = mdText.split(/\r?\n/);
  const rows = [];
  let currentSubject = '其他';

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+.*?(微積分|計算機概論|英文)/);
    if (headingMatch) {
      currentSubject = headingMatch[1];
      continue;
    }
    if (!line.trim().startsWith('|')) continue;
    if (/^\|\s*:?---/.test(line.trim())) continue;

    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 7) continue;
    if (cells[0].includes('章節') && cells[1].includes('狀態')) continue;

    const chapter = cells[0].replace(/\*\*/g, '').trim();
    const status = cells[1];
    const lastReviewed = cells[2];
    const halfLifeDays = Number(cells[3]) || (SUBJECT_CONFIG[currentSubject]?.defaultHalfLife ?? 7);
    const nextReviewDate = cells[4];
    const stability = cells[5];
    const notes = cells[6];
    const daysSince = diffDaysFromToday(lastReviewed);
    const decayRatio = halfLifeDays > 0 ? daysSince / halfLifeDays : 1;
    const isOverdue = daysSince >= halfLifeDays || status.includes('🔴');

    rows.push({
      id: `${currentSubject}::${chapter}`,
      subject: currentSubject,
      chapter,
      status,
      lastReviewed,
      halfLifeDays,
      nextReviewDate,
      stability,
      notes,
      daysSince,
      decayRatio,
      isOverdue,
    });
  }

  return rows;
}

export function computeChapterUpdatesFromGrade(exam, responses, gradeResult) {
  const questions = Array.isArray(exam?.questions) ? exam.questions : [];
  const byChapter = new Map();

  for (const q of questions) {
    const chap = String(q.chapter || '').trim();
    if (!chap) continue;
    if (!byChapter.has(chap)) {
      byChapter.set(chap, {
        chapter: chap,
        total: 0,
        correct: 0,
        wrong: 0,
        guessed: 0,
        forgot: 0,
        pitfalls: [],
      });
    }
    const bucket = byChapter.get(chap);
    const g = gradeResult.perQuestion[q.id];
    const resp = responses[q.id] || {};
    bucket.total += 1;
    if (g?.status === 'correct') bucket.correct += 1;
    else if (g?.status === 'wrong' || g?.status === 'partial') bucket.wrong += 1;
    if (resp.confidence === 'guessed') bucket.guessed += 1;
    if (resp.confidence === 'forgot') bucket.forgot += 1;
    if (g?.isBlindSpot && q.subtopic) {
      bucket.pitfalls.push(q.subtopic);
    }
  }

  const today = getTodayISO();
  const baseHalfLife = SUBJECT_CONFIG[exam?.subject]?.defaultHalfLife ?? 7;
  const updates = [];

  for (const [, b] of byChapter.entries()) {
    let status = '🟢';
    let halfLife = baseHalfLife * 2;
    let stability = '穩固';

    if (b.wrong > 0 || b.forgot > 0) {
      status = '🔴';
      halfLife = Math.max(3, Math.floor(baseHalfLife * 0.5));
      stability = b.forgot > 0 ? '脆化' : '波動';
    } else if (b.guessed > 0) {
      status = '🟡';
      halfLife = baseHalfLife;
      stability = '波動';
    }

    const nextReviewDate = addDaysISO(today, halfLife);
    const uniquePitfalls = [...new Set(b.pitfalls)].slice(0, 3);
    const noteAppend =
      uniquePitfalls.length > 0
        ? `[${today} 刷題待補] ${uniquePitfalls.join('、')}`
        : `[${today} 刷題通過] ${b.correct}/${b.total} 穩固`;

    updates.push({
      chapter: b.chapter,
      status,
      lastReviewed: today,
      halfLifeDays: halfLife,
      nextReviewDate,
      stability,
      noteAppend,
    });
  }

  return updates;
}

export function updateLearningStatusMarkdown(mdText, updates = []) {
  if (!mdText || updates.length === 0) return mdText;
  const lines = mdText.split(/\r?\n/);

  const matchChapter = (cellChapter, targetChapter) => {
    const a = cellChapter.replace(/\*\*/g, '').trim().toLowerCase();
    const b = targetChapter.replace(/\*\*/g, '').trim().toLowerCase();
    return a === b || a.includes(b) || b.includes(a);
  };

  const nextLines = lines.map((line) => {
    if (!line.trim().startsWith('|') || /^\|\s*:?---/.test(line.trim())) return line;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 7) return line;
    if (cells[0].includes('章節') && cells[1].includes('狀態')) return line;

    const hit = updates.find((u) => matchChapter(cells[0], u.chapter));
    if (!hit) return line;

    const oldNotes = cells[6] || '';
    const mergedNotes = oldNotes.includes(hit.noteAppend)
      ? oldNotes
      : oldNotes
        ? `${oldNotes}；${hit.noteAppend}`
        : hit.noteAppend;

    return `| ${cells[0]} | ${hit.status} | ${hit.lastReviewed} | ${hit.halfLifeDays} | ${hit.nextReviewDate} | ${hit.stability} | ${mergedNotes} |`;
  });

  return nextLines.join('\n');
}

export function buildFlashcardAppendBlock(exam, blindSpotQuestions = []) {
  if (!blindSpotQuestions || blindSpotQuestions.length === 0) return '';
  const today = getTodayISO();
  const rows = blindSpotQuestions.map((item, idx) => {
    const q = item.question;
    const tag = `${exam.subject || 'Exam'}-${today.slice(5)}-${idx + 1}`;
    const promptText = String(q.subtopic || q.chapter || `Q${q.number}`).replace(/\|/g, '/');
    const core = String(q.mnemonic || q.coreFormula || q.pitfall || q.answer || '')
      .replace(/\r?\n/g, ' ')
      .replace(/\|/g, '/');
    return `| ${tag} | **${promptText}**（${q.chapter || ''}） | ${core} |`;
  });

  return [
    '',
    `## 🔁 刷題戰情室自動萃取：${exam.title} (${today})`,
    '',
    '| # | 主動回憶提問 (Prompt) | 精準答案與一句話口訣 (Answer & Mnemonic) |',
    '| :-: | :--- | :--- |',
    ...rows,
    '',
  ].join('\n');
}
