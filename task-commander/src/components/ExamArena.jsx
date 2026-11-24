import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Crosshair,
  BookOpen,
  Clock,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Brain,
  Flame,
  FileText,
  ChevronLeft,
  ChevronRight,
  Save,
  Sparkles,
  Upload,
  Filter,
  ShieldAlert,
  Award,
  Check,
  HelpCircle,
  Zap,
  History,
} from 'lucide-react';
import { renderMarkdownWithKatex } from '../utils/markdownRenderer';
import {
  ARENA_PATHS,
  SUBJECT_CONFIG,
  CONFIDENCE_OPTIONS,
  MODE_LABELS,
  getTodayISO,
  formatSeconds,
  suggestFillSelfGrade,
  gradeExamSession,
  computeWeightedProjection,
  parseConsolidatedLearningStatus,
  computeChapterUpdatesFromGrade,
  updateLearningStatusMarkdown,
  buildFlashcardAppendBlock,
} from '../utils/examArenaUtils';

const LOCAL_HISTORY_KEY = 'tc_exam_arena_history_v1';
const LOCAL_MISTAKES_KEY = 'tc_exam_arena_mistakes_v1';

function readLocalJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

function MarkdownBlock({ content, className = '' }) {
  const html = useMemo(() => renderMarkdownWithKatex(content || ''), [content]);
  return (
    <div
      className={`arena-markdown markdown-body ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function ExamArena({ onPreviewFile, showToast }) {
  const isElectron = Boolean(window.electronAPI?.isElectron);

  const [subTab, setSubTab] = useState('library'); // 'library' | 'mistakes' | 'decay' | 'history'
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [exams, setExams] = useState([]);
  const [isLoadingExams, setIsLoadingExams] = useState(false);

  const [history, setHistory] = useState(() => readLocalJson(LOCAL_HISTORY_KEY, []));
  const [mistakeBank, setMistakeBank] = useState(() => readLocalJson(LOCAL_MISTAKES_KEY, []));
  const [decayRows, setDecayRows] = useState([]);
  const [decayLoadError, setDecayLoadError] = useState('');

  // Active exam session state
  const [activeSession, setActiveSession] = useState(null);
  // activeSession = { exam, relativePath, phase: 'taking'|'reviewing', currentIndex, responses, secondsLeft, timerPaused, elapsedSeconds, reviewFilter, synced }
  const [isSyncingResults, setIsSyncingResults] = useState(false);

  const fileInputRef = useRef(null);

  const notify = useCallback(
    (msg) => {
      if (typeof showToast === 'function') showToast(msg);
    },
    [showToast]
  );

  const fetchWorkspaceArenaPayload = useCallback(async () => {
    const out = { exams: null, history: null, mistakes: null, decayRows: null, decayError: '' };
    if (isElectron && window.electronAPI?.listExamPapers) {
      const res = await window.electronAPI.listExamPapers();
      if (res?.success && Array.isArray(res.exams)) {
        out.exams = res.exams;
      }
    }

    if (isElectron && window.electronAPI?.readFileContent) {
      const histRes = await window.electronAPI.readFileContent(ARENA_PATHS.HISTORY_JSON);
      if (histRes?.success && histRes.content) {
        try {
          const parsed = JSON.parse(histRes.content);
          if (Array.isArray(parsed.history)) out.history = parsed.history;
          if (Array.isArray(parsed.mistakes)) out.mistakes = parsed.mistakes;
        } catch {
          // ignore malformed history
        }
      }

      const statusRes = await window.electronAPI.readFileContent(ARENA_PATHS.CONSOLIDATED_STATUS);
      if (statusRes?.success && statusRes.content) {
        out.decayRows = parseConsolidatedLearningStatus(statusRes.content);
      } else {
        out.decayError = '尚未讀取到 Consolidated_Learning_Status.md';
      }
    }
    return out;
  }, [isElectron]);

  const applyWorkspaceArenaPayload = useCallback((payload) => {
    if (!payload) return;
    if (payload.exams) setExams(payload.exams);
    if (payload.history) {
      setHistory(payload.history);
      writeLocalJson(LOCAL_HISTORY_KEY, payload.history);
    }
    if (payload.mistakes) {
      setMistakeBank(payload.mistakes);
      writeLocalJson(LOCAL_MISTAKES_KEY, payload.mistakes);
    }
    if (payload.decayRows) {
      setDecayRows(payload.decayRows);
      setDecayLoadError('');
    } else if (payload.decayError) {
      setDecayLoadError(payload.decayError);
    }
  }, []);

  const loadWorkspaceArenaData = useCallback(async () => {
    setIsLoadingExams(true);
    try {
      const payload = await fetchWorkspaceArenaPayload();
      applyWorkspaceArenaPayload(payload);
    } finally {
      setIsLoadingExams(false);
    }
  }, [fetchWorkspaceArenaPayload, applyWorkspaceArenaPayload]);

  useEffect(() => {
    let cancelled = false;
    fetchWorkspaceArenaPayload().then((payload) => {
      if (!cancelled) applyWorkspaceArenaPayload(payload);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchWorkspaceArenaPayload, applyWorkspaceArenaPayload]);

  // Persist history & mistakes to workspace JSON + localStorage
  const persistArenaStore = useCallback(
    async (nextHistory, nextMistakes) => {
      setHistory(nextHistory);
      setMistakeBank(nextMistakes);
      writeLocalJson(LOCAL_HISTORY_KEY, nextHistory);
      writeLocalJson(LOCAL_MISTAKES_KEY, nextMistakes);

      if (isElectron && window.electronAPI?.writeFileContent) {
        await window.electronAPI.writeFileContent({
          relativePath: ARENA_PATHS.HISTORY_JSON,
          content: JSON.stringify(
            {
              updatedAt: new Date().toISOString(),
              history: nextHistory,
              mistakes: nextMistakes,
            },
            null,
            2
          ),
        });
      }
    },
    [isElectron]
  );

  // Countdown timer when taking an exam
  const isTaking = activeSession?.phase === 'taking' && !activeSession?.timerPaused;
  useEffect(() => {
    if (!isTaking) return undefined;
    const timer = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev || prev.phase !== 'taking' || prev.timerPaused) return prev;
        const nextLeft = Math.max(0, (prev.secondsLeft || 0) - 1);
        return {
          ...prev,
          secondsLeft: nextLeft,
          elapsedSeconds: (prev.elapsedSeconds || 0) + 1,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTaking]);

  // Start an exam
  const startExamSession = useCallback((examData, relativePath = '') => {
    const timeMins = Number(examData.timeLimitMinutes || 60);
    setActiveSession({
      exam: examData,
      relativePath,
      phase: 'taking',
      currentIndex: 0,
      responses: {},
      secondsLeft: timeMins * 60,
      timerPaused: false,
      elapsedSeconds: 0,
      reviewFilter: 'all',
      synced: false,
    });
  }, []);

  // Import local .exam.json (works in browser & Electron)
  const handleImportExamJson = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || '{}'));
          if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
            notify('匯入失敗：JSON 缺少有效的 questions 陣列');
            return;
          }
          const entry = {
            relativePath: `imported/${file.name}`,
            mtimeMs: Date.now(),
            data: parsed,
          };
          setExams((prev) => [entry, ...prev.filter((x) => x.data?.id !== parsed.id)]);
          notify(`已匯入試卷：${parsed.title || file.name}`);
        } catch (err) {
          notify(`JSON 解析失敗：${err.message}`);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [notify]
  );

  // Update answer or confidence in active session
  const updateQuestionResponse = useCallback((questionId, patch) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const existing = prev.responses[questionId] || {};
      return {
        ...prev,
        responses: {
          ...prev.responses,
          [questionId]: { ...existing, ...patch },
        },
      };
    });
  }, []);

  // Submit active exam -> transition to reviewing phase with smart pre-suggestions for fill questions
  const handleSubmitExam = useCallback(() => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const questions = prev.exam?.questions || [];
      const nextResponses = { ...prev.responses };

      for (const q of questions) {
        if (q.type === 'fill') {
          const resp = nextResponses[q.id] || {};
          if (!resp.selfGrade && resp.answer) {
            const suggested = suggestFillSelfGrade(q, resp.answer);
            if (suggested) {
              nextResponses[q.id] = { ...resp, selfGrade: suggested };
            }
          }
        }
      }

      return {
        ...prev,
        phase: 'reviewing',
        responses: nextResponses,
        timerPaused: true,
        reviewFilter: 'all',
      };
    });
  }, []);

  const currentGrade = useMemo(() => {
    if (!activeSession || activeSession.phase !== 'reviewing') return null;
    return gradeExamSession(activeSession.exam, activeSession.responses);
  }, [activeSession]);

  // Save attempt, update mistake bank, and write back to Learning_Status.md + Active_Recall_Flashcards.md
  const handleSyncReviewToWorkspace = useCallback(async () => {
    if (!activeSession || !currentGrade) return;
    setIsSyncingResults(true);
    try {
      const { exam, responses, elapsedSeconds } = activeSession;
      const today = getTodayISO();

      const attemptRecord = {
        id: `att-${Date.now()}`,
        examId: exam.id,
        examTitle: exam.title,
        subject: exam.subject || '其他',
        mode: exam.mode || 'mock',
        date: today,
        timestamp: new Date().toISOString(),
        earnedPoints: currentGrade.earnedPoints,
        maxPoints: currentGrade.maxPoints,
        percentage: currentGrade.percentage,
        elapsedSeconds: elapsedSeconds || 0,
        correctCount: currentGrade.correctCount,
        wrongCount: currentGrade.wrongCount,
        blindSpotCount: currentGrade.blindSpotQuestions.length,
        confidentCorrect: currentGrade.confidenceStats.confidentCorrect,
        guessedCorrect: currentGrade.confidenceStats.guessedCorrect,
        forgotCount: currentGrade.confidenceStats.forgotCount,
      };

      const nextHistory = [attemptRecord, ...history].slice(0, 120);

      // Update mistake bank: add/update blind spots; resolve mastered items if retrying
      const mistakeMap = new Map(mistakeBank.map((m) => [m.key, m]));
      for (const q of exam.questions || []) {
        const g = currentGrade.perQuestion[q.id];
        const resp = responses[q.id] || {};
        const key = `${exam.subject || '其他'}::${q.chapter || ''}::${q.id}`;

        if (g?.isBlindSpot) {
          const existing = mistakeMap.get(key);
          const reasons = [];
          if (g.status === 'wrong') reasons.push('答錯');
          if (g.status === 'partial') reasons.push('部分對');
          if (resp.confidence === 'guessed') reasons.push('靠猜');
          if (resp.confidence === 'forgot') reasons.push('忘記公式/定義');
          if (reasons.length === 0) reasons.push('待檢核');

          mistakeMap.set(key, {
            key,
            subject: exam.subject || '其他',
            examTitle: exam.title,
            chapter: q.chapter || '未分類',
            subtopic: q.subtopic || '',
            question: q,
            passage: q.passageId
              ? (exam.passages || []).find((p) => p.id === q.passageId) || null
              : null,
            lastUserAnswer: resp.answer || '',
            reasons: [...new Set(reasons)],
            missCount: (existing?.missCount || 0) + 1,
            lastMissedAt: today,
            resolved: false,
          });
        } else if (g?.status === 'correct' && resp.confidence === 'confident') {
          if (mistakeMap.has(key)) {
            mistakeMap.set(key, {
              ...mistakeMap.get(key),
              resolved: true,
              resolvedAt: today,
            });
          }
        }
      }

      const nextMistakes = Array.from(mistakeMap.values()).sort((a, b) =>
        String(b.lastMissedAt || '').localeCompare(String(a.lastMissedAt || ''))
      );

      await persistArenaStore(nextHistory, nextMistakes);

      // Write back Learning_Status.md, Consolidated_Learning_Status.md, and Active_Recall_Flashcards.md
      let syncedFilesCount = 0;
      if (isElectron && window.electronAPI?.readFileContent && window.electronAPI?.writeFileContent) {
        const chapterUpdates = computeChapterUpdatesFromGrade(exam, responses, currentGrade);

        const targetStatusFiles = [ARENA_PATHS.CONSOLIDATED_STATUS];
        if (ARENA_PATHS.SUBJECT_STATUS[exam.subject]) {
          targetStatusFiles.push(ARENA_PATHS.SUBJECT_STATUS[exam.subject]);
        }

        for (const relPath of targetStatusFiles) {
          const readRes = await window.electronAPI.readFileContent(relPath);
          if (readRes?.success && readRes.content) {
            const updatedMd = updateLearningStatusMarkdown(readRes.content, chapterUpdates);
            if (updatedMd !== readRes.content) {
              await window.electronAPI.writeFileContent({
                relativePath: relPath,
                content: updatedMd,
              });
              syncedFilesCount += 1;
            }
          }
        }

        if (currentGrade.blindSpotQuestions.length > 0) {
          const fcRes = await window.electronAPI.readFileContent(ARENA_PATHS.FLASHCARDS);
          const appendBlock = buildFlashcardAppendBlock(exam, currentGrade.blindSpotQuestions);
          if (appendBlock) {
            const existingFc = fcRes?.success ? fcRes.content : '# ⚡ 主動回憶閃卡庫\n';
            await window.electronAPI.writeFileContent({
              relativePath: ARENA_PATHS.FLASHCARDS,
              content: `${existingFc.trimEnd()}\n${appendBlock}`,
            });
            syncedFilesCount += 1;
          }
        }

        // Refresh decay dashboard rows
        const refreshedStatus = await window.electronAPI.readFileContent(ARENA_PATHS.CONSOLIDATED_STATUS);
        if (refreshedStatus?.success && refreshedStatus.content) {
          setDecayRows(parseConsolidatedLearningStatus(refreshedStatus.content));
        }
      }

      setActiveSession((prev) => (prev ? { ...prev, synced: true } : prev));
      notify(
        syncedFilesCount > 0
          ? `已儲存成績並同步更新 ${syncedFilesCount} 份狀態表／閃卡庫`
          : '已儲存本次作答紀錄與錯題本'
      );
    } finally {
      setIsSyncingResults(false);
    }
  }, [activeSession, currentGrade, history, mistakeBank, persistArenaStore, isElectron, notify]);

  // Launch Mistake Retry Session
  const startMistakeRetrySession = useCallback(
    (subject = 'ALL') => {
      const activeMistakes = mistakeBank.filter(
        (m) => !m.resolved && (subject === 'ALL' || m.subject === subject)
      );
      if (activeMistakes.length === 0) {
        notify('目前沒有待攻克的錯題');
        return;
      }

      const passagesMap = new Map();
      const questions = activeMistakes.map((m, idx) => {
        if (m.passage) passagesMap.set(m.passage.id, m.passage);
        return {
          ...m.question,
          number: idx + 1,
          isSpacedRecall: true,
        };
      });

      const totalPoints = questions.reduce((sum, q) => sum + Number(q.points || 5), 0);

      const syntheticExam = {
        schemaVersion: '1.0',
        id: `mistake-retry-${Date.now()}`,
        title: `錯題與盲區回馬槍重練（${subject === 'ALL' ? '全科' : subject} · ${questions.length} 題）`,
        subject: subject === 'ALL' ? (activeMistakes[0]?.subject || '綜合') : subject,
        track: 'UST_A4_NTHU_CS',
        mode: 'mistake_retry',
        createdAt: getTodayISO(),
        timeLimitMinutes: Math.max(15, questions.length * 4),
        totalPoints,
        targetScore: 100,
        instructions: '本卷由歷史「答錯 / 靠猜 / 忘記公式」盲區題目組成，全對且標註「會寫」後自動從錯題本解除！',
        passages: Array.from(passagesMap.values()),
        sections: [{ id: 'retry-sec', title: '錯題盲區重測', description: '無提示作答並重新標註信心狀態' }],
        questions,
      };

      startExamSession(syntheticExam, '');
    },
    [mistakeBank, startExamSession, notify]
  );

  const toggleMistakeResolved = useCallback(
    async (key) => {
      const nextMistakes = mistakeBank.map((m) =>
        m.key === key
          ? { ...m, resolved: !m.resolved, resolvedAt: !m.resolved ? getTodayISO() : null }
          : m
      );
      await persistArenaStore(history, nextMistakes);
    },
    [mistakeBank, history, persistArenaStore]
  );

  // Derived metrics
  const projection = useMemo(() => computeWeightedProjection(history), [history]);
  const unresolvedMistakes = useMemo(() => mistakeBank.filter((m) => !m.resolved), [mistakeBank]);
  const overdueDecayRows = useMemo(() => decayRows.filter((r) => r.isOverdue), [decayRows]);

  const filteredExams = useMemo(() => {
    if (subjectFilter === 'ALL') return exams;
    return exams.filter((e) => (e.data?.subject || '其他') === subjectFilter);
  }, [exams, subjectFilter]);

  const filteredMistakes = useMemo(() => {
    return unresolvedMistakes.filter(
      (m) => subjectFilter === 'ALL' || m.subject === subjectFilter
    );
  }, [unresolvedMistakes, subjectFilter]);

  const filteredDecayRows = useMemo(() => {
    if (subjectFilter === 'ALL') return decayRows;
    return decayRows.filter((r) => r.subject === subjectFilter);
  }, [decayRows, subjectFilter]);

  const latestAttemptByExamId = useMemo(() => {
    const map = {};
    for (const h of history) {
      if (h.examId && !map[h.examId]) map[h.examId] = h;
    }
    return map;
  }, [history]);

  // =========================================================================
  // RENDER: ACTIVE EXAM TAKING / REVIEWING SESSION
  // =========================================================================
  if (activeSession) {
    const { exam, phase, currentIndex, responses, secondsLeft, timerPaused, reviewFilter, synced } =
      activeSession;
    const questions = exam.questions || [];
    const currentQ = questions[currentIndex] || questions[0];
    const currentResp = currentQ ? responses[currentQ.id] || {} : {};
    const currentPassage = currentQ?.passageId
      ? (exam.passages || []).find((p) => p.id === currentQ.passageId) || null
      : null;

    const answeredCount = questions.filter((q) => String(responses[q.id]?.answer || '').trim() !== '').length;
    const taggedCount = questions.filter((q) => Boolean(responses[q.id]?.confidence)).length;

    if (phase === 'taking' && currentQ) {
      const isLowTime = secondsLeft <= 300;
      const sectionInfo = (exam.sections || []).find((s) => s.id === currentQ.sectionId);

      return (
        <div className="arena-session-shell">
          {/* Top sticky exam bar */}
          <div className="arena-session-topbar">
            <div className="arena-session-title-group">
              <button
                type="button"
                className="arena-btn-ghost"
                onClick={() => {
                  if (window.confirm('確定離開本次作答？未交卷的作答進度將不會儲存。')) {
                    setActiveSession(null);
                  }
                }}
              >
                <ChevronLeft size={16} />
                離開考場
              </button>
              <div>
                <div className="arena-session-title">{exam.title}</div>
                <div className="arena-session-meta">
                  <span>{exam.subject}</span>
                  <span>·</span>
                  <span>已答 {answeredCount}/{questions.length}</span>
                  <span>·</span>
                  <span>信心標籤 {taggedCount}/{questions.length}</span>
                </div>
              </div>
            </div>

            <div className="arena-session-actions">
              <div className={`arena-timer-pill ${isLowTime ? 'is-urgent' : ''}`}>
                <Clock size={15} />
                <span>{formatSeconds(secondsLeft)}</span>
                <button
                  type="button"
                  className="arena-timer-toggle"
                  onClick={() =>
                    setActiveSession((prev) => (prev ? { ...prev, timerPaused: !prev.timerPaused } : prev))
                  }
                  title={timerPaused ? '繼續計時' : '暫停計時'}
                >
                  {timerPaused ? <Play size={13} /> : <Pause size={13} />}
                </button>
              </div>

              <button
                type="button"
                className="arena-btn-primary"
                onClick={() => {
                  const untaggedAnswered = questions.filter(
                    (q) => String(responses[q.id]?.answer || '').trim() !== '' && !responses[q.id]?.confidence
                  ).length;
                  if (untaggedAnswered > 0) {
                    const proceed = window.confirm(
                      `還有 ${untaggedAnswered} 題已作答但尚未標註「會寫 / 靠猜 / 忘記公式」。仍要直接交卷嗎？`
                    );
                    if (!proceed) return;
                  }
                  handleSubmitExam();
                }}
              >
                <CheckCircle2 size={15} />
                交卷批改
              </button>
            </div>
          </div>

          <div className="arena-session-body">
            {/* Left Navigator */}
            <aside className="arena-nav-panel">
              <div className="arena-nav-header">
                <span>題號導覽</span>
                <span className="arena-nav-sub">{currentIndex + 1} / {questions.length}</span>
              </div>
              <div className="arena-nav-grid">
                {questions.map((q, idx) => {
                  const r = responses[q.id] || {};
                  const hasAns = String(r.answer || '').trim() !== '';
                  const confClass = r.confidence ? `conf-${r.confidence}` : '';
                  return (
                    <button
                      key={q.id}
                      type="button"
                      className={`arena-nav-dot ${idx === currentIndex ? 'is-current' : ''} ${hasAns ? 'is-answered' : ''} ${confClass}`}
                      onClick={() =>
                        setActiveSession((prev) => (prev ? { ...prev, currentIndex: idx } : prev))
                      }
                      title={`第 ${q.number} 題${q.isSpacedRecall ? '（間隔複習回馬槍）' : ''}`}
                    >
                      <span>{q.number}</span>
                      {q.isSpacedRecall && <span className="arena-recall-pip" />}
                    </button>
                  );
                })}
              </div>

              <div className="arena-nav-legend">
                <div><span className="legend-dot conf-confident" /> 會寫</div>
                <div><span className="legend-dot conf-guessed" /> 靠猜</div>
                <div><span className="legend-dot conf-forgot" /> 忘記公式</div>
                <div><span className="legend-dot is-recall" /> 間隔回馬槍</div>
              </div>

              <div className="arena-no-hint-box">
                <ShieldAlert size={14} />
                <span>無提示實戰模式：作答期間已鎖定解答、公式與陷阱提示。</span>
              </div>
            </aside>

            {/* Right Main Question Stage */}
            <div className={`arena-question-stage ${currentPassage ? 'has-passage' : ''}`}>
              {currentPassage && (
                <div className="arena-passage-pane">
                  <div className="arena-passage-title">{currentPassage.title}</div>
                  <MarkdownBlock content={currentPassage.content} />
                </div>
              )}

              <div className="arena-question-pane">
                {sectionInfo && (
                  <div className="arena-section-banner">
                    <strong>{sectionInfo.title}</strong>
                    {sectionInfo.description && <span>{sectionInfo.description}</span>}
                  </div>
                )}

                <div className="arena-q-header">
                  <div className="arena-q-badges">
                    <span className="arena-q-num">Q{currentQ.number}</span>
                    <span className="arena-chip">
                      {currentQ.type === 'mcq' ? '單選題' : currentQ.type === 'fill' ? '填充題' : '計算／證明題'}
                    </span>
                    <span className="arena-chip">{currentQ.points} 分</span>
                    {currentQ.chapter && <span className="arena-chip muted">{currentQ.chapter}</span>}
                    {currentQ.isSpacedRecall && (
                      <span className="arena-chip recall">
                        <RotateCcw size={11} /> 間隔複習回馬槍
                      </span>
                    )}
                  </div>
                </div>

                <div className="arena-q-prompt">
                  <MarkdownBlock content={currentQ.prompt} />
                </div>

                {/* Answer Input Area */}
                {currentQ.type === 'mcq' ? (
                  <div className="arena-mcq-list">
                    {(currentQ.options || []).map((opt) => {
                      const selected = currentResp.answer === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          className={`arena-mcq-option ${selected ? 'is-selected' : ''}`}
                          onClick={() => updateQuestionResponse(currentQ.id, { answer: opt.key })}
                        >
                          <span className="arena-mcq-key">{opt.key}</span>
                          <div className="arena-mcq-text">
                            <MarkdownBlock content={opt.text} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="arena-text-answer-box">
                    <label className="arena-input-label">
                      {currentQ.type === 'fill'
                        ? '填寫最終精簡答案（支援 LaTeX，例如 $\\frac{16}{5}$ 或純文字 16/5）'
                        : '輸入你的最終答案與關鍵推導步驟（交卷後將與標準詳解並列自評）'}
                    </label>
                    <textarea
                      className={`arena-answer-textarea ${currentQ.type === 'calculation' ? 'is-tall' : ''}`}
                      value={currentResp.answer || ''}
                      onChange={(e) => updateQuestionResponse(currentQ.id, { answer: e.target.value })}
                      placeholder={
                        currentQ.type === 'fill'
                          ? '例：y = 2x - 1, y = -10x - 25 或 [e^-2, e^2)'
                          : '記錄你的變數代換、邊界檢查與最終結果...'
                      }
                    />
                    {currentResp.answer && currentResp.answer.includes('$') && (
                      <div className="arena-math-preview">
                        <div className="arena-preview-tag">LaTeX 即時預覽</div>
                        <MarkdownBlock content={currentResp.answer} />
                      </div>
                    )}
                  </div>
                )}

                {/* Mandatory Confidence Tagging Bar */}
                <div className="arena-confidence-bar">
                  <div className="arena-confidence-title">
                    <Brain size={15} />
                    <span>作答信心標記（必選，區分真會與猜對）：</span>
                  </div>
                  <div className="arena-confidence-buttons">
                    {CONFIDENCE_OPTIONS.map((opt) => {
                      const active = currentResp.confidence === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={`arena-conf-btn tone-${opt.tone} ${active ? 'is-active' : ''}`}
                          onClick={() => updateQuestionResponse(currentQ.id, { confidence: opt.id })}
                        >
                          {opt.id === 'confident' && <Check size={14} />}
                          {opt.id === 'guessed' && <HelpCircle size={14} />}
                          {opt.id === 'forgot' && <AlertTriangle size={14} />}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Prev / Next Controls */}
                <div className="arena-stage-footer">
                  <button
                    type="button"
                    className="arena-btn-secondary"
                    disabled={currentIndex === 0}
                    onClick={() =>
                      setActiveSession((prev) =>
                        prev ? { ...prev, currentIndex: Math.max(0, prev.currentIndex - 1) } : prev
                      )
                    }
                  >
                    <ChevronLeft size={16} /> 上一題
                  </button>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      className="arena-btn-primary"
                      onClick={() =>
                        setActiveSession((prev) =>
                          prev
                            ? { ...prev, currentIndex: Math.min(questions.length - 1, prev.currentIndex + 1) }
                            : prev
                        )
                      }
                    >
                      下一題 <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button type="button" className="arena-btn-primary" onClick={handleSubmitExam}>
                      <CheckCircle2 size={16} /> 完成並交卷批改
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
    // REVIEWING PHASE
    // =========================================================================
    const visibleReviewQuestions = questions.filter((q) => {
      const g = currentGrade?.perQuestion[q.id];
      if (reviewFilter === 'blindspots') return Boolean(g?.isBlindSpot);
      if (reviewFilter === 'pending') return Boolean(g?.needsManualGrade);
      return true;
    });

    const subjectMeta = SUBJECT_CONFIG[exam.subject];
    const weightedContrib = subjectMeta
      ? Math.round(currentGrade.percentage * subjectMeta.weight * 10) / 10
      : null;

    return (
      <div className="arena-review-shell">
        <div className="arena-session-topbar">
          <div className="arena-session-title-group">
            <button
              type="button"
              className="arena-btn-ghost"
              onClick={() => setActiveSession(null)}
            >
              <ChevronLeft size={16} />
              返回戰情室
            </button>
            <div>
              <div className="arena-session-title">批改與復盤：{exam.title}</div>
              <div className="arena-session-meta">
                <span>耗時 {formatSeconds(activeSession.elapsedSeconds)}</span>
                <span>·</span>
                <span>目標分數 {exam.targetScore || 90} 分</span>
              </div>
            </div>
          </div>

          <div className="arena-session-actions">
            <button
              type="button"
              className="arena-btn-secondary"
              onClick={() => startExamSession(exam, activeSession.relativePath)}
            >
              <RotateCcw size={14} /> 重寫本卷
            </button>
            <button
              type="button"
              className={`arena-btn-primary ${synced ? 'is-synced' : ''}`}
              disabled={isSyncingResults || currentGrade.pendingCount > 0}
              title={
                currentGrade.pendingCount > 0
                  ? `請先完成剩餘 ${currentGrade.pendingCount} 題填充/計算題自評再同步`
                  : '儲存成績、更新錯題本並回寫 Learning_Status.md 與閃卡庫'
              }
              onClick={handleSyncReviewToWorkspace}
            >
              <Save size={15} />
              {isSyncingResults
                ? '同步寫回中...'
                : synced
                  ? '已同步至狀態表與閃卡庫'
                  : '儲存並同步寫回狀態表＋閃卡'}
            </button>
          </div>
        </div>

        {/* Score Summary Strip */}
        <div className="arena-review-summary">
          <div className="arena-score-hero">
            <div className="arena-score-big">
              {currentGrade.earnedPoints}
              <span className="arena-score-max"> / {currentGrade.maxPoints}</span>
            </div>
            <div className="arena-score-sub">
              得分率 <strong>{currentGrade.percentage}%</strong>
              {weightedContrib !== null && (
                <span>（清大資工加權貢獻 {weightedContrib} / {subjectMeta.weight * 100}）</span>
              )}
            </div>
          </div>

          <div className="arena-stat-pills">
            <div className="arena-stat-pill tone-emerald">
              <span>會寫且對</span>
              <strong>{currentGrade.confidenceStats.confidentCorrect}</strong>
            </div>
            <div className="arena-stat-pill tone-amber">
              <span>靠猜答對（列入盲區）</span>
              <strong>{currentGrade.confidenceStats.guessedCorrect}</strong>
            </div>
            <div className="arena-stat-pill tone-danger">
              <span>錯誤 / 忘記公式</span>
              <strong>{currentGrade.wrongCount} / {currentGrade.confidenceStats.forgotCount}</strong>
            </div>
            <div className="arena-stat-pill tone-primary">
              <span>本回盲區總數</span>
              <strong>{currentGrade.blindSpotQuestions.length}</strong>
            </div>
          </div>
        </div>

        {currentGrade.pendingCount > 0 && (
          <div className="arena-pending-banner">
            <AlertTriangle size={16} />
            <span>
              本卷尚有 <strong>{currentGrade.pendingCount} 題</strong> 填充／計算題等待你對照詳解進行步驟自評，自評完成後即可一鍵同步寫回學習狀態表與閃卡庫。
            </span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="arena-filter-row">
          <button
            type="button"
            className={`arena-filter-pill ${reviewFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSession((p) => (p ? { ...p, reviewFilter: 'all' } : p))}
          >
            全部題目 ({questions.length})
          </button>
          <button
            type="button"
            className={`arena-filter-pill ${reviewFilter === 'blindspots' ? 'active' : ''}`}
            onClick={() => setActiveSession((p) => (p ? { ...p, reviewFilter: 'blindspots' } : p))}
          >
            只看盲區：錯題＋靠猜＋遺忘 ({currentGrade.blindSpotQuestions.length})
          </button>
          {currentGrade.pendingCount > 0 && (
            <button
              type="button"
              className={`arena-filter-pill urgent ${reviewFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveSession((p) => (p ? { ...p, reviewFilter: 'pending' } : p))}
            >
              待自評題目 ({currentGrade.pendingCount})
            </button>
          )}
        </div>

        {/* Review Question Cards */}
        <div className="arena-review-list">
          {visibleReviewQuestions.map((q) => {
            const resp = responses[q.id] || {};
            const g = currentGrade.perQuestion[q.id];
            const confLabel =
              CONFIDENCE_OPTIONS.find((c) => c.id === resp.confidence)?.label || '未標記信心';

            return (
              <div
                key={q.id}
                className={`arena-review-card status-${g.status} ${g.isBlindSpot ? 'is-blindspot' : ''}`}
              >
                <div className="arena-review-card-head">
                  <div className="arena-q-badges">
                    <span className="arena-q-num">Q{q.number}</span>
                    <span className={`arena-status-badge status-${g.status}`}>
                      {g.status === 'correct' && <><CheckCircle2 size={13} /> 正確 ({g.earnedPoints}/{g.maxPoints})</>}
                      {g.status === 'partial' && <><AlertTriangle size={13} /> 部分對 ({g.earnedPoints}/{g.maxPoints})</>}
                      {g.status === 'wrong' && <><XCircle size={13} /> 錯誤 (0/{g.maxPoints})</>}
                      {g.status === 'pending' && <><Clock size={13} /> 待自評 ({g.maxPoints} 分)</>}
                    </span>
                    <span className={`arena-chip conf-tag-${resp.confidence || 'none'}`}>
                      信心：{confLabel}
                    </span>
                    {q.chapter && <span className="arena-chip muted">{q.chapter}</span>}
                    {q.isSpacedRecall && <span className="arena-chip recall">🔁 回馬槍</span>}
                  </div>
                </div>

                <div className="arena-review-prompt">
                  <MarkdownBlock content={q.prompt} />
                </div>

                {/* Comparison Area */}
                <div className="arena-answer-compare">
                  <div className="arena-compare-box">
                    <div className="arena-compare-label">你的作答</div>
                    <div className="arena-compare-value">
                      {resp.answer ? <MarkdownBlock content={resp.answer} /> : <span className="arena-dim">（未作答）</span>}
                    </div>
                  </div>
                  <div className="arena-compare-box is-truth">
                    <div className="arena-compare-label">標準答案</div>
                    <div className="arena-compare-value">
                      <MarkdownBlock content={q.answer} />
                    </div>
                  </div>
                </div>

                {/* Manual Self-Grading for Fill / Calculation */}
                {q.type !== 'mcq' && (
                  <div className="arena-self-grade-bar">
                    <span>對照下方標準步驟自評給分：</span>
                    <div className="arena-self-grade-btns">
                      <button
                        type="button"
                        className={`arena-sg-btn tone-emerald ${resp.selfGrade === 'correct' ? 'active' : ''}`}
                        onClick={() => updateQuestionResponse(q.id, { selfGrade: 'correct' })}
                      >
                        ✅ 全對 ({q.points} 分)
                      </button>
                      <button
                        type="button"
                        className={`arena-sg-btn tone-amber ${resp.selfGrade === 'partial' ? 'active' : ''}`}
                        onClick={() => updateQuestionResponse(q.id, { selfGrade: 'partial' })}
                      >
                        🟡 部分對 ({Math.round(q.points * 0.5 * 10) / 10} 分)
                      </button>
                      <button
                        type="button"
                        className={`arena-sg-btn tone-danger ${resp.selfGrade === 'wrong' ? 'active' : ''}`}
                        onClick={() => updateQuestionResponse(q.id, { selfGrade: 'wrong' })}
                      >
                        ❌ 錯誤 (0 分)
                      </button>
                    </div>
                  </div>
                )}

                {/* Solution & Pitfalls */}
                <div className="arena-solution-panel">
                  <div className="arena-solution-title">完整詳解</div>
                  <MarkdownBlock content={q.solution} />

                  <div className="arena-insight-grid">
                    {q.coreFormula && (
                      <div className="arena-insight-box tone-blue">
                        <div className="arena-insight-label">📌 核心公式 / 定義</div>
                        <MarkdownBlock content={q.coreFormula} />
                      </div>
                    )}
                    {q.pitfall && (
                      <div className="arena-insight-box tone-amber">
                        <div className="arena-insight-label">⚠️ 易錯陷阱</div>
                        <MarkdownBlock content={q.pitfall} />
                      </div>
                    )}
                    {q.mnemonic && (
                      <div className="arena-insight-box tone-purple">
                        <div className="arena-insight-label">⚡ 一句話考前口訣</div>
                        <MarkdownBlock content={q.mnemonic} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: ARENA HUB (Library / Mistakes / Decay / History)
  // =========================================================================
  const gapToRegular = Math.round((projection.cutoff115Regular - projection.weightedTotal) * 10) / 10;
  const gapToSafe = Math.round((projection.target116Safe - projection.weightedTotal) * 10) / 10;

  return (
    <div className="arena-hub">
      {/* Top NTHU CS A4 Projection Hero */}
      <section className="arena-hero-card">
        <div className="arena-hero-left">
          <div className="arena-hero-eyebrow">
            <Crosshair size={14} />
            <span>116 台聯大 A4 · 清大資工 (405) 刷題戰情室</span>
          </div>
          <div className="arena-hero-score-row">
            <div className="arena-hero-total">
              {projection.weightedTotal}
              <span> / 500</span>
            </div>
            <div className="arena-hero-gap">
              {gapToRegular > 0 ? (
                <span className="arena-gap-pill is-warn">距 115 正取 (442) 差 {gapToRegular} 分</span>
              ) : (
                <span className="arena-gap-pill is-ok">已超越 115 正取線 (442)</span>
              )}
              {gapToSafe > 0 ? (
                <span className="arena-gap-pill is-target">距 116 安全目標 (454) 差 {gapToSafe} 分</span>
              ) : (
                <span className="arena-gap-pill is-ok">達標 454 安全區</span>
              )}
            </div>
          </div>

          <div className="arena-subject-meters">
            {Object.values(SUBJECT_CONFIG).map((cfg) => {
              const score = projection.scores[cfg.key];
              const isLive = projection.hasLiveAttempt[cfg.key];
              return (
                <div key={cfg.key} className="arena-meter-item">
                  <div className="arena-meter-head">
                    <span className="arena-meter-name">
                      {cfg.label} <small>×{cfg.weight}</small>
                    </span>
                    <span className="arena-meter-val">
                      <strong>{score}</strong> / 目標 {cfg.target116}
                      <em className="arena-meter-src">{isLive ? '最新實測' : '115基準'}</em>
                    </span>
                  </div>
                  <div className="arena-meter-track">
                    <div
                      className="arena-meter-fill"
                      style={{ width: `${Math.min(100, score)}%`, background: cfg.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="arena-hero-right">
          <div className="arena-kpi-grid">
            <button type="button" className="arena-kpi-box" onClick={() => setSubTab('library')}>
              <BookOpen size={17} />
              <strong>{exams.length}</strong>
              <span>已收錄互動卷</span>
            </button>
            <button type="button" className="arena-kpi-box is-danger" onClick={() => setSubTab('mistakes')}>
              <Flame size={17} />
              <strong>{unresolvedMistakes.length}</strong>
              <span>待攻克錯題盲區</span>
            </button>
            <button type="button" className="arena-kpi-box is-amber" onClick={() => setSubTab('decay')}>
              <Brain size={17} />
              <strong>{overdueDecayRows.length}</strong>
              <span>記憶衰減待喚醒</span>
            </button>
            <button
              type="button"
              className="arena-kpi-box is-purple"
              onClick={() =>
                onPreviewFile?.({
                  title: '116 主動回憶閃卡庫',
                  path: ARENA_PATHS.FLASHCARDS,
                  format: 'md',
                })
              }
            >
              <Zap size={17} />
              <strong>閃卡</strong>
              <span>考前速記快篩</span>
            </button>
          </div>
        </div>
      </section>

      {/* Sub-navigation & Subject Filter */}
      <div className="arena-toolbar">
        <div className="arena-subtabs">
          <button
            type="button"
            className={`arena-subtab ${subTab === 'library' ? 'active' : ''}`}
            onClick={() => setSubTab('library')}
          >
            <BookOpen size={15} /> 試卷庫 ({exams.length})
          </button>
          <button
            type="button"
            className={`arena-subtab ${subTab === 'mistakes' ? 'active' : ''}`}
            onClick={() => setSubTab('mistakes')}
          >
            <Flame size={15} /> 錯題與回馬槍重練 ({unresolvedMistakes.length})
          </button>
          <button
            type="button"
            className={`arena-subtab ${subTab === 'decay' ? 'active' : ''}`}
            onClick={() => setSubTab('decay')}
          >
            <Brain size={15} /> 記憶衰減看板 ({overdueDecayRows.length})
          </button>
          <button
            type="button"
            className={`arena-subtab ${subTab === 'history' ? 'active' : ''}`}
            onClick={() => setSubTab('history')}
          >
            <History size={15} /> 作答紀錄 ({history.length})
          </button>
        </div>

        <div className="arena-toolbar-right">
          <div className="arena-subject-pills">
            {['ALL', '微積分', '計算機概論', '英文'].map((subj) => (
              <button
                key={subj}
                type="button"
                className={`arena-pill-btn ${subjectFilter === subj ? 'active' : ''}`}
                onClick={() => setSubjectFilter(subj)}
              >
                {subj === 'ALL' ? '全部科目' : subj}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="arena-btn-secondary"
            onClick={loadWorkspaceArenaData}
            disabled={isLoadingExams}
            title="重新掃描 Test_Bank/Exam_paper/ 內的所有 .exam.json"
          >
            <RefreshCw size={14} className={isLoadingExams ? 'spin' : ''} />
            重新掃描
          </button>

          <button
            type="button"
            className="arena-btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            title="手動匯入 .exam.json 試卷"
          >
            <Upload size={14} /> 匯入 JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImportExamJson}
          />
        </div>
      </div>

      {/* ================= SUBTAB 1: LIBRARY ================= */}
      {subTab === 'library' && (
        <div className="arena-exam-grid">
          {filteredExams.length === 0 ? (
            <div className="arena-empty-card">
              <Sparkles size={28} />
              <h3>尚無符合篩選的互動試卷 (.exam.json)</h3>
              <p>
                {isElectron
                  ? '請點擊右上角「重新掃描」，或使用 Antigravity 的 Mock Exam Generator / Question Sweeper 產出新考卷後自動載入。'
                  : '目前為瀏覽器模式，可點擊右上角「匯入 JSON」載入工作區內的 .exam.json 互動試卷。'}
              </p>
            </div>
          ) : (
            filteredExams.map((entry) => {
              const ex = entry.data || {};
              const qList = ex.questions || [];
              const recallCount = qList.filter((q) => q.isSpacedRecall).length;
              const lastAttempt = latestAttemptByExamId[ex.id];
              const subjMeta = SUBJECT_CONFIG[ex.subject];

              return (
                <article key={entry.relativePath || ex.id} className="arena-exam-card">
                  <div className="arena-exam-card-top">
                    <span
                      className="arena-subj-tag"
                      style={{
                        background: subjMeta ? `${subjMeta.color}18` : undefined,
                        color: subjMeta?.color,
                      }}
                    >
                      {ex.subject || '一般科目'}
                      {subjMeta ? ` ×${subjMeta.weight}` : ''}
                    </span>
                    <span className="arena-mode-tag">
                      {MODE_LABELS[ex.mode] || ex.mode || '模擬卷'}
                    </span>
                  </div>

                  <h3 className="arena-exam-card-title">{ex.title}</h3>
                  <p className="arena-exam-card-desc">{ex.instructions}</p>

                  <div className="arena-exam-card-stats">
                    <span><FileText size={13} /> {qList.length} 題 · {ex.totalPoints || 100} 分</span>
                    <span><Clock size={13} /> {ex.timeLimitMinutes || 60} 分鐘</span>
                    {recallCount > 0 && (
                      <span className="is-recall"><RotateCcw size={13} /> {recallCount} 題回馬槍</span>
                    )}
                    {ex.targetScore && (
                      <span><Award size={13} /> 目標 {ex.targetScore}+</span>
                    )}
                  </div>

                  {lastAttempt && (
                    <div className="arena-last-attempt">
                      上次實測 ({lastAttempt.date})：<strong>{lastAttempt.percentage}%</strong>
                      （盲區 {lastAttempt.blindSpotCount} 題）
                    </div>
                  )}

                  <div className="arena-exam-card-actions">
                    <button
                      type="button"
                      className="arena-btn-primary"
                      onClick={() => startExamSession(ex, entry.relativePath)}
                    >
                      <Play size={14} /> 開始計時作答
                    </button>
                    {ex.sourceMarkdown && (
                      <button
                        type="button"
                        className="arena-btn-ghost"
                        onClick={() =>
                          onPreviewFile?.({
                            title: `${ex.title}（原卷 Markdown）`,
                            path: ex.sourceMarkdown,
                            format: 'md',
                          })
                        }
                      >
                        檢視原卷 MD
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      {/* ================= SUBTAB 2: MISTAKE BANK ================= */}
      {subTab === 'mistakes' && (
        <div className="arena-mistakes-panel">
          <div className="arena-panel-header">
            <div>
              <h3>錯題與盲區重練清單（含答錯、靠猜、忘記公式）</h3>
              <p>每次交卷並同步後自動彙整；重練時「答對且標記會寫」即自動解除。</p>
            </div>
            <button
              type="button"
              className="arena-btn-primary"
              disabled={filteredMistakes.length === 0}
              onClick={() => startMistakeRetrySession(subjectFilter)}
            >
              <Flame size={15} />
              啟動無提示回馬槍重練 ({filteredMistakes.length} 題)
            </button>
          </div>

          {filteredMistakes.length === 0 ? (
            <div className="arena-empty-card">
              <CheckCircle2 size={28} />
              <h3>目前沒有待修補的錯題盲區</h3>
              <p>完成任一份診斷卷或模擬卷並點擊「儲存並同步」後，所有答錯、靠猜與忘記公式的題目會自動進入此清單。</p>
            </div>
          ) : (
            <div className="arena-mistake-list">
              {filteredMistakes.map((m) => (
                <div key={m.key} className="arena-mistake-item">
                  <div className="arena-mistake-head">
                    <div className="arena-q-badges">
                      <span className="arena-chip">{m.subject}</span>
                      <span className="arena-chip muted">{m.chapter}</span>
                      {m.reasons.map((r) => (
                        <span key={r} className="arena-chip danger">{r}</span>
                      ))}
                      <span className="arena-chip">累計失誤 {m.missCount} 次</span>
                    </div>
                    <button
                      type="button"
                      className="arena-btn-ghost"
                      onClick={() => toggleMistakeResolved(m.key)}
                    >
                      <Check size={14} /> 標記已攻克
                    </button>
                  </div>
                  <div className="arena-mistake-body">
                    <MarkdownBlock content={m.question?.prompt || ''} />
                  </div>
                  {m.question?.mnemonic && (
                    <div className="arena-mistake-mnemonic">
                      ⚡ 速記口訣：{m.question.mnemonic}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= SUBTAB 3: MEMORY DECAY DASHBOARD ================= */}
      {subTab === 'decay' && (
        <div className="arena-decay-panel">
          <div className="arena-panel-header">
            <div>
              <h3>記憶衰減與間隔複習排程看板</h3>
              <p>即時解析 Consolidated_Learning_Status.md；超過半衰期或標記 🔴 的章節會優先被混入新考卷回馬槍。</p>
            </div>
            <div className="arena-panel-header-actions">
              <button
                type="button"
                className="arena-btn-secondary"
                onClick={() =>
                  onPreviewFile?.({
                    title: '116 綜合學習狀態追蹤表',
                    path: ARENA_PATHS.CONSOLIDATED_STATUS,
                    format: 'md',
                  })
                }
              >
                <FileText size={14} /> 開啟狀態表 MD
              </button>
              <button
                type="button"
                className="arena-btn-secondary"
                onClick={() =>
                  onPreviewFile?.({
                    title: '116 主動回憶閃卡庫',
                    path: ARENA_PATHS.FLASHCARDS,
                    format: 'md',
                  })
                }
              >
                <Zap size={14} /> 開啟主動回憶閃卡
              </button>
            </div>
          </div>

          {decayLoadError ? (
            <div className="arena-empty-card">
              <Filter size={26} />
              <h3>{decayLoadError}</h3>
              <p>請在桌面端（Electron）開啟 Task Commander 以即時讀取工作區學習狀態表。</p>
            </div>
          ) : (
            <div className="arena-decay-grid">
              {filteredDecayRows.map((row) => {
                const pct = Math.min(100, Math.round(row.decayRatio * 100));
                const tone = row.status.includes('🔴') || row.decayRatio >= 1
                  ? 'danger'
                  : row.decayRatio >= 0.65 || row.status.includes('🟡')
                    ? 'amber'
                    : 'emerald';

                return (
                  <div key={row.id} className={`arena-decay-card tone-${tone}`}>
                    <div className="arena-decay-top">
                      <span className="arena-chip">{row.subject}</span>
                      <span className="arena-decay-status">
                        {row.status} {row.stability}
                      </span>
                    </div>
                    <h4 className="arena-decay-chapter">{row.chapter}</h4>
                    <div className="arena-decay-bar-wrap">
                      <div className="arena-decay-bar-label">
                        <span>距上次複習 <strong>{row.daysSince}</strong> 天 / 半衰期 {row.halfLifeDays} 天</span>
                        <span>{row.isOverdue ? '⚠️ 需立即喚醒' : `下次 ${row.nextReviewDate}`}</span>
                      </div>
                      <div className="arena-meter-track">
                        <div className={`arena-decay-fill tone-${tone}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <p className="arena-decay-notes">{row.notes}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= SUBTAB 4: HISTORY ================= */}
      {subTab === 'history' && (
        <div className="arena-history-panel">
          {history.length === 0 ? (
            <div className="arena-empty-card">
              <History size={28} />
              <h3>尚無刷題紀錄</h3>
              <p>前往「試卷庫」完成第一份 116 喚醒診斷卷，系統將自動追蹤你的清大資工加權預估總分變化。</p>
            </div>
          ) : (
            <div className="arena-history-table-wrap">
              <table className="arena-history-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>科目</th>
                    <th>試卷名稱</th>
                    <th>得分</th>
                    <th>耗時</th>
                    <th>會寫對 / 靠猜對 / 遺忘</th>
                    <th>盲區題數</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id}>
                      <td>{h.date}</td>
                      <td><span className="arena-chip">{h.subject}</span></td>
                      <td>{h.examTitle}</td>
                      <td>
                        <strong>{h.earnedPoints}/{h.maxPoints}</strong> ({h.percentage}%)
                      </td>
                      <td>{formatSeconds(h.elapsedSeconds)}</td>
                      <td>
                        {h.confidentCorrect} / {h.guessedCorrect} / {h.forgotCount}
                      </td>
                      <td>
                        <span className={`arena-chip ${h.blindSpotCount > 0 ? 'danger' : ''}`}>
                          {h.blindSpotCount} 題
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
