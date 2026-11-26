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
  Flag,
  Maximize2,
  Minimize2,
  Keyboard,
  PenTool,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Target,
  Lightbulb,
  Pin,
  X,
  ArrowRight,
  Wand2,
} from 'lucide-react';
import ExamGeneratorModal from './ExamGeneratorModal';
import { useModalA11y } from '../hooks/useModalA11y';
import FlashcardHub from './FlashcardHub';
import { renderMarkdownWithKatex } from '../utils/markdownRenderer';
import {
  getAssetManifest,
  fetchCloudAssetText,
  uploadTextAssetToCloud,
} from '../services/cloudAssetService';
import { pushCloudDoc, SYNC_KEYS } from '../services/cloudSyncService';
import { getCloudAuthState } from '../services/supabaseClient';
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
} from '../utils/examArenaUtils';
import {
  computeFlashcardStats,
  createCardFromExamQuestion,
  createCardFromMistake,
  addCardsWithDedup,
  isCardLeech,
} from '../utils/flashcardUtils';

const LOCAL_HISTORY_KEY = 'tc_exam_arena_history_v1';
const LOCAL_MISTAKES_KEY = 'tc_exam_arena_mistakes_v1';
const LOCAL_DRAFTS_KEY = 'tc_exam_arena_drafts_v1';
const LOCAL_REVIEW_DRAFT_KEY = 'tc_exam_arena_review_draft_v1';

const MATH_SNIPPETS = [
  { label: '分數', insert: '\\frac{}{}', cursorBack: 3, title: '插入分數 \\frac{a}{b}' },
  { label: '根號', insert: '\\sqrt{}', cursorBack: 1, title: '插入根號 \\sqrt{x}' },
  { label: 'π', insert: '\\pi', cursorBack: 0, title: '插入 \\pi' },
  { label: '∞', insert: '\\infty', cursorBack: 0, title: '插入 \\infty' },
  { label: 'eˣ', insert: 'e^{}', cursorBack: 1, title: '插入指數 e^{x}' },
  { label: 'ln', insert: '\\ln()', cursorBack: 1, title: '插入自然對數 \\ln()' },
  { label: '±', insert: '\\pm ', cursorBack: 0, title: '插入正負號 \\pm' },
  { label: '≤', insert: '\\le ', cursorBack: 0, title: '插入小於等於 \\le' },
  { label: '≥', insert: '\\ge ', cursorBack: 0, title: '插入大於等於 \\ge' },
  { label: '∫', insert: '\\int_{}^{}', cursorBack: 4, title: '插入定積分 \\int_{a}^{b}' },
  { label: 'Σ', insert: '\\sum_{n=1}^{\\infty}', cursorBack: 0, title: '插入無窮級數' },
  { label: '[a,b)', insert: '[, )', cursorBack: 3, title: '插入半開閉區間' },
];

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

function formatAnswerForMathPreview(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  if (s.includes('$')) return s;
  if (/[\\^_]/.test(s)) return `$${s}$`;
  return s;
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

export default function ExamArena({
  onPreviewFile,
  showToast,
  assetManifestVersion = 0,
  courses = [],
  onOpenAiSettings,
  onRequireUnlock,
  flashcardsStore = null,
  onUpdateFlashcards,
  onResyncFlashcardsFromMd,
  launchTarget = null,
  onConsumeLaunchTarget,
  onSessionActiveChange,
}) {
  const isElectron = Boolean(window.electronAPI?.isElectron);

  const [subTab, setSubTab] = useState('library'); // 'library' | 'flashcards' | 'mistakes' | 'decay' | 'history'
  const [pendingFlashcardAction, setPendingFlashcardAction] = useState(null);
  const [isFlashcardStudying, setIsFlashcardStudying] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [exams, setExams] = useState([]);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [examLoadError, setExamLoadError] = useState('');

  const [history, setHistory] = useState(() => readLocalJson(LOCAL_HISTORY_KEY, []));
  const [mistakeBank, setMistakeBank] = useState(() => readLocalJson(LOCAL_MISTAKES_KEY, []));
  const [draftsMap, setDraftsMap] = useState(() => readLocalJson(LOCAL_DRAFTS_KEY, {}));
  const [savedReviewDraft, setSavedReviewDraft] = useState(() => readLocalJson(LOCAL_REVIEW_DRAFT_KEY, null));
  const [decayRows, setDecayRows] = useState([]);
  const [decayLoadError, setDecayLoadError] = useState('');

  // AI Exam Generator Modal
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);

  // Active exam session state
  const [activeSession, setActiveSession] = useState(null);
  const [isSyncingResults, setIsSyncingResults] = useState(false);

  // Answering UI enhancements
  const [focusMode, setFocusMode] = useState(false);
  const [fontScale, setFontScale] = useState('md'); // 'sm' | 'md' | 'lg'
  const [navFilter, setNavFilter] = useState('all'); // 'all' | 'unanswered' | 'flagged' | 'untagged'
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [scratchpadOpen, setScratchpadOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null); // null | 'exit' | 'submit'

  const { dialogRef: confirmModalRef } = useModalA11y({
    isOpen: Boolean(confirmModal),
    onClose: () => setConfirmModal(null),
  });

  // Notify App shell when an exam/review/flashcard session is active so tab switches preserve live state
  useEffect(() => {
    onSessionActiveChange?.(Boolean(activeSession || isFlashcardStudying));
    return () => {
      onSessionActiveChange?.(false);
    };
  }, [activeSession, isFlashcardStudying, onSessionActiveChange]);

  // Auto-persist unsynced review phase (including self-grades) so reloads never lose self-grading work
  useEffect(() => {
    if (!activeSession || activeSession.phase !== 'reviewing') return;
    if (activeSession.synced) {
      setSavedReviewDraft(null);
      try { localStorage.removeItem(LOCAL_REVIEW_DRAFT_KEY); } catch {}
      return;
    }
    const payload = {
      exam: activeSession.exam,
      relativePath: activeSession.relativePath || '',
      responses: activeSession.responses || {},
      flaggedIds: activeSession.flaggedIds || [],
      eliminated: activeSession.eliminated || {},
      elapsedSeconds: activeSession.elapsedSeconds || 0,
      reviewFilter: activeSession.reviewFilter || 'all',
      savedAt: new Date().toISOString(),
    };
    setSavedReviewDraft(payload);
    writeLocalJson(LOCAL_REVIEW_DRAFT_KEY, payload);
  }, [activeSession]);

  const fileInputRef = useRef(null);
  const answerTextareaRef = useRef(null);

  const notify = useCallback(
    (msg) => {
      if (typeof showToast === 'function') showToast(msg);
    },
    [showToast]
  );

  const fetchWorkspaceArenaPayload = useCallback(async () => {
    const out = { exams: null, examError: '', history: null, mistakes: null, decayRows: null, decayError: '' };
    if (isElectron && window.electronAPI?.listExamPapers) {
      const res = await window.electronAPI.listExamPapers();
      if (res?.success && Array.isArray(res.exams)) {
        out.exams = res.exams;
        if (Array.isArray(res.parseErrors) && res.parseErrors.length > 0) {
          out.examError = `有 ${res.parseErrors.length} 份試卷 JSON 解析失敗：${res.parseErrors[0].file}`;
        }
      } else if (res?.error) {
        out.examError = `本機掃描試卷失敗：${res.error}`;
      }

      if (window.electronAPI?.readFileContent) {
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
    }

    // Web / Vercel mode: load .exam.json & Consolidated_Learning_Status.md from Supabase Cloud Asset Manifest
    const manifest = getAssetManifest();
    const manifestFiles = manifest?.files || {};
    const examPaths = Object.keys(manifestFiles).filter(
      (p) =>
        p.startsWith('Test_Bank/') &&
        !p.includes('/archive/') &&
        p.toLowerCase().endsWith('.exam.json')
    );

    if (examPaths.length > 0) {
      const loaded = await Promise.all(
        examPaths.map(async (relPath) => {
          const res = await fetchCloudAssetText(relPath);
          if (!res?.success || !res.content) return null;
          try {
            const data = JSON.parse(res.content);
            const updatedMs = manifestFiles[relPath]?.updatedAt
              ? Date.parse(manifestFiles[relPath].updatedAt) || 0
              : 0;
            return { relativePath: relPath, mtimeMs: updatedMs, data };
          } catch {
            return null;
          }
        })
      );
      const validExams = loaded.filter(Boolean).sort((a, b) => {
        const da = String(a.data?.createdAt || '');
        const db = String(b.data?.createdAt || '');
        if (db !== da) return db.localeCompare(da);
        return (b.mtimeMs || 0) - (a.mtimeMs || 0);
      });
      out.exams = validExams;
    } else {
      out.exams = [];
    }

    if (manifestFiles[ARENA_PATHS.HISTORY_JSON]) {
      const histRes = await fetchCloudAssetText(ARENA_PATHS.HISTORY_JSON);
      if (histRes?.success && histRes.content) {
        try {
          const parsed = JSON.parse(histRes.content);
          const localHist = readLocalJson(LOCAL_HISTORY_KEY, []);
          const localMist = readLocalJson(LOCAL_MISTAKES_KEY, []);
          if (Array.isArray(parsed.history) && parsed.history.length >= localHist.length) {
            out.history = parsed.history;
          }
          if (Array.isArray(parsed.mistakes) && parsed.mistakes.length >= localMist.length) {
            out.mistakes = parsed.mistakes;
          }
        } catch {
          // ignore malformed cloud history
        }
      }
    }

    if (manifestFiles[ARENA_PATHS.CONSOLIDATED_STATUS]) {
      const statusRes = await fetchCloudAssetText(ARENA_PATHS.CONSOLIDATED_STATUS);
      if (statusRes?.success && statusRes.content) {
        out.decayRows = parseConsolidatedLearningStatus(statusRes.content);
      }
    } else {
      out.decayError = '雲端資產清單載入中或尚未同步 Consolidated_Learning_Status.md（可點右上角重新同步）';
    }

    return out;
  }, [isElectron]);

  const applyWorkspaceArenaPayload = useCallback((payload) => {
    if (!payload) return;
    if (payload.exams) setExams(payload.exams);
    setExamLoadError(payload.examError || '');
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
  }, [fetchWorkspaceArenaPayload, applyWorkspaceArenaPayload, assetManifestVersion]);

  // Live auto-refresh when Electron detects a new/modified .exam.json in Test_Bank
  useEffect(() => {
    if (!isElectron || !window.electronAPI?.onExamPapersUpdated) return undefined;
    const unsub = window.electronAPI.onExamPapersUpdated(() => {
      loadWorkspaceArenaData();
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [isElectron, loadWorkspaceArenaData]);

  // Persist drafts automatically during taking phase
  const saveDraftForSession = useCallback((session) => {
    if (!session || session.phase !== 'taking' || !session.exam?.id) return;
    const examId = session.exam.id;
    setDraftsMap((prev) => {
      const next = {
        ...prev,
        [examId]: {
          examId,
          currentIndex: session.currentIndex,
          responses: session.responses,
          flaggedIds: session.flaggedIds || [],
          eliminated: session.eliminated || {},
          secondsLeft: session.secondsLeft,
          elapsedSeconds: session.elapsedSeconds,
          savedAt: new Date().toISOString(),
        },
      };
      writeLocalJson(LOCAL_DRAFTS_KEY, next);
      return next;
    });
  }, []);

  const clearDraftForExam = useCallback((examId) => {
    if (!examId) return;
    setDraftsMap((prev) => {
      if (!prev[examId]) return prev;
      const next = { ...prev };
      delete next[examId];
      writeLocalJson(LOCAL_DRAFTS_KEY, next);
      return next;
    });
  }, []);

  // Debounced autosave of responses/flags/scratchpad while taking
  useEffect(() => {
    if (!activeSession || activeSession.phase !== 'taking') return undefined;
    const timer = window.setTimeout(() => {
      saveDraftForSession(activeSession);
    }, 600);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeSession?.phase,
    activeSession?.currentIndex,
    activeSession?.responses,
    activeSession?.flaggedIds,
    activeSession?.eliminated,
    saveDraftForSession,
  ]);

  // Persist history & mistakes
  const persistArenaStore = useCallback(
    async (nextHistory, nextMistakes) => {
      setHistory(nextHistory);
      setMistakeBank(nextMistakes);
      writeLocalJson(LOCAL_HISTORY_KEY, nextHistory);
      writeLocalJson(LOCAL_MISTAKES_KEY, nextMistakes);

      const serialized = JSON.stringify(
        {
          updatedAt: new Date().toISOString(),
          history: nextHistory,
          mistakes: nextMistakes,
        },
        null,
        2
      );

      if (isElectron && window.electronAPI?.writeFileContent) {
        await window.electronAPI.writeFileContent({
          relativePath: ARENA_PATHS.HISTORY_JSON,
          content: serialized,
        });
      } else {
        const auth = await getCloudAuthState();
        if (auth?.canWrite) {
          await uploadTextAssetToCloud(serialized, ARENA_PATHS.HISTORY_JSON, (nextManifest) =>
            pushCloudDoc(SYNC_KEYS.ASSET_MANIFEST, nextManifest)
          );
        }
      }
    },
    [isElectron]
  );

  // Countdown timer when taking an exam
  const isTaking = activeSession?.phase === 'taking' && !activeSession?.timerPaused && !confirmModal;
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

  // Start or resume an exam
  const startExamSession = useCallback(
    (examData, relativePath = '', { resumeDraft = false } = {}) => {
      const timeMins = Number(examData.timeLimitMinutes || 60);
      const draft = resumeDraft && examData?.id ? draftsMap[examData.id] : null;
      if (!resumeDraft && examData?.id) {
        clearDraftForExam(examData.id);
      }
      setConfirmModal(null);
      setNavFilter('all');
      setMobileNavOpen(false);
      setScratchpadOpen(false);
      setActiveSession({
        exam: examData,
        relativePath,
        phase: 'taking',
        currentIndex: draft ? Math.min(draft.currentIndex || 0, Math.max(0, (examData.questions?.length || 1) - 1)) : 0,
        responses: draft?.responses || {},
        flaggedIds: Array.isArray(draft?.flaggedIds) ? draft.flaggedIds : [],
        eliminated: draft?.eliminated || {},
        secondsLeft: typeof draft?.secondsLeft === 'number' ? draft.secondsLeft : timeMins * 60,
        timerPaused: false,
        elapsedSeconds: draft?.elapsedSeconds || 0,
        reviewFilter: 'all',
        synced: false,
      });
    },
    [draftsMap, clearDraftForExam]
  );

  // Import local .exam.json
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

  // Update answer, confidence, or scratchpad
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

  const toggleFlagQuestion = useCallback((questionId) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const list = Array.isArray(prev.flaggedIds) ? prev.flaggedIds : [];
      const exists = list.includes(questionId);
      return {
        ...prev,
        flaggedIds: exists ? list.filter((id) => id !== questionId) : [...list, questionId],
      };
    });
  }, []);

  const toggleEliminateOption = useCallback((questionId, optKey) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const elimMap = prev.eliminated || {};
      const currentList = Array.isArray(elimMap[questionId]) ? elimMap[questionId] : [];
      const exists = currentList.includes(optKey);
      const nextList = exists ? currentList.filter((k) => k !== optKey) : [...currentList, optKey];

      // If eliminating the currently selected option, clear selection
      const currentResp = prev.responses[questionId] || {};
      const nextResponses =
        !exists && currentResp.answer === optKey
          ? { ...prev.responses, [questionId]: { ...currentResp, answer: '' } }
          : prev.responses;

      return {
        ...prev,
        responses: nextResponses,
        eliminated: { ...elimMap, [questionId]: nextList },
      };
    });
  }, []);

  const handleSelectMcqOption = useCallback((questionId, optKey) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const elimMap = prev.eliminated || {};
      const currentElim = Array.isArray(elimMap[questionId]) ? elimMap[questionId] : [];
      const cleanedElim = currentElim.includes(optKey)
        ? { ...elimMap, [questionId]: currentElim.filter((k) => k !== optKey) }
        : elimMap;
      const existing = prev.responses[questionId] || {};
      return {
        ...prev,
        eliminated: cleanedElim,
        responses: {
          ...prev.responses,
          [questionId]: { ...existing, answer: optKey },
        },
      };
    });
  }, []);

  const insertMathSnippet = useCallback(
    (questionId, snippet) => {
      const el = answerTextareaRef.current;
      const currentVal = String(activeSession?.responses?.[questionId]?.answer || '');
      if (!el) {
        updateQuestionResponse(questionId, { answer: `${currentVal}${snippet.insert}` });
        return;
      }
      const start = el.selectionStart ?? currentVal.length;
      const end = el.selectionEnd ?? currentVal.length;
      const nextVal = currentVal.slice(0, start) + snippet.insert + currentVal.slice(end);
      updateQuestionResponse(questionId, { answer: nextVal });
      const nextCursor = start + snippet.insert.length - (snippet.cursorBack || 0);
      window.requestAnimationFrame(() => {
        if (answerTextareaRef.current) {
          answerTextareaRef.current.focus();
          answerTextareaRef.current.setSelectionRange(nextCursor, nextCursor);
        }
      });
    },
    [activeSession, updateQuestionResponse]
  );

  // Submit active exam -> transition to reviewing phase
  const handleSubmitExam = useCallback(() => {
    setConfirmModal(null);
    setActiveSession((prev) => {
      if (!prev) return prev;
      if (prev.exam?.id) clearDraftForExam(prev.exam.id);
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
  }, [clearDraftForExam]);

  // Keyboard shortcuts during taking phase
  useEffect(() => {
    if (!activeSession || activeSession.phase !== 'taking' || confirmModal) return undefined;

    const onKeyDown = (e) => {
      const tag = String(e.target?.tagName || '').toLowerCase();
      const isTyping = tag === 'textarea' || tag === 'input' || tag === 'select' || e.target?.isContentEditable;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const questions = activeSession.exam?.questions || [];
      const currentQ = questions[activeSession.currentIndex];
      if (!currentQ) return;

      if (isTyping) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveSession((p) => (p ? { ...p, currentIndex: Math.max(0, p.currentIndex - 1) } : p));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveSession((p) =>
          p ? { ...p, currentIndex: Math.min(questions.length - 1, p.currentIndex + 1) } : p
        );
      } else if (e.key === '1') {
        e.preventDefault();
        updateQuestionResponse(currentQ.id, { confidence: 'confident' });
      } else if (e.key === '2') {
        e.preventDefault();
        updateQuestionResponse(currentQ.id, { confidence: 'guessed' });
      } else if (e.key === '3') {
        e.preventDefault();
        updateQuestionResponse(currentQ.id, { confidence: 'forgot' });
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFlagQuestion(currentQ.id);
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        setScratchpadOpen((p) => !p);
      } else if (currentQ.type === 'mcq' && /^[a-e]$/i.test(e.key)) {
        const upper = e.key.toUpperCase();
        const valid = (currentQ.options || []).some((o) => o.key === upper);
        if (valid) {
          e.preventDefault();
          handleSelectMcqOption(currentQ.id, upper);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeSession, confirmModal, updateQuestionResponse, toggleFlagQuestion, handleSelectMcqOption]);

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

        if (currentGrade.blindSpotQuestions.length > 0 && onUpdateFlashcards) {
          const extractedCards = currentGrade.blindSpotQuestions
            .map((item) => {
              const reasons = [];
              if (item.graded?.status === 'wrong') reasons.push('答錯');
              if (item.graded?.status === 'partial') reasons.push('部分對');
              if (item.response?.confidence === 'guessed') reasons.push('靠猜');
              if (item.response?.confidence === 'forgot') reasons.push('忘記公式/定義');
              return createCardFromExamQuestion({
                exam,
                question: item.question,
                reasons,
                source: 'exam_blindspot',
                todayISO: today,
              });
            })
            .filter(Boolean);

          if (extractedCards.length > 0) {
            let addedCount = 0;
            await onUpdateFlashcards(
              (prev) => {
                const res = addCardsWithDedup(prev, extractedCards, today);
                addedCount = res.addedCount;
                return res.nextStore;
              },
              { syncMarkdown: true, immediateCloud: true }
            );
            if (addedCount > 0) syncedFilesCount += 1;
          }
        }

        const refreshedStatus = await window.electronAPI.readFileContent(ARENA_PATHS.CONSOLIDATED_STATUS);
        if (refreshedStatus?.success && refreshedStatus.content) {
          setDecayRows(parseConsolidatedLearningStatus(refreshedStatus.content));
        }
      } else {
        const auth = await getCloudAuthState();
        if (currentGrade.blindSpotQuestions.length > 0 && onUpdateFlashcards) {
          const extractedCards = currentGrade.blindSpotQuestions
            .map((item) => {
              const reasons = [];
              if (item.graded?.status === 'wrong') reasons.push('答錯');
              if (item.graded?.status === 'partial') reasons.push('部分對');
              if (item.response?.confidence === 'guessed') reasons.push('靠猜');
              if (item.response?.confidence === 'forgot') reasons.push('忘記公式/定義');
              return createCardFromExamQuestion({
                exam,
                question: item.question,
                reasons,
                source: 'exam_blindspot',
                todayISO: today,
              });
            })
            .filter(Boolean);
          if (extractedCards.length > 0) {
            let addedCount = 0;
            await onUpdateFlashcards(
              (prev) => {
                const res = addCardsWithDedup(prev, extractedCards, today);
                addedCount = res.addedCount;
                return res.nextStore;
              },
              { syncMarkdown: Boolean(auth?.canWrite), immediateCloud: true }
            );
            if (addedCount > 0) syncedFilesCount += 1;
          }
        }

        if (auth?.canWrite) {
          const pushManifestFn = (nextManifest) => pushCloudDoc(SYNC_KEYS.ASSET_MANIFEST, nextManifest);
          const chapterUpdates = computeChapterUpdatesFromGrade(exam, responses, currentGrade);
          const targetStatusFiles = [ARENA_PATHS.CONSOLIDATED_STATUS];
          if (ARENA_PATHS.SUBJECT_STATUS[exam.subject]) {
            targetStatusFiles.push(ARENA_PATHS.SUBJECT_STATUS[exam.subject]);
          }
          for (const relPath of targetStatusFiles) {
            const readRes = await fetchCloudAssetText(relPath);
            if (readRes?.success && readRes.content) {
              const updatedMd = updateLearningStatusMarkdown(readRes.content, chapterUpdates);
              if (updatedMd !== readRes.content) {
                const upRes = await uploadTextAssetToCloud(updatedMd, relPath, pushManifestFn);
                if (upRes?.success) syncedFilesCount += 1;
              }
            }
          }
          const refreshedStatus = await fetchCloudAssetText(ARENA_PATHS.CONSOLIDATED_STATUS);
          if (refreshedStatus?.success && refreshedStatus.content) {
            setDecayRows(parseConsolidatedLearningStatus(refreshedStatus.content));
          }
        }
      }

      setActiveSession((prev) => (prev ? { ...prev, synced: true } : prev));
      notify(
        syncedFilesCount > 0
          ? `已儲存成績並同步更新 ${syncedFilesCount} 份狀態表／閃卡庫`
          : isElectron
            ? '已儲存本次作答紀錄與錯題本'
            : '已儲存至本機瀏覽器（若需同步回寫雲端狀態表，請先點鎖頭解鎖編輯）'
      );
    } finally {
      setIsSyncingResults(false);
    }
  }, [activeSession, currentGrade, history, mistakeBank, persistArenaStore, isElectron, notify, onUpdateFlashcards]);

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

  // Consume external deep-link launches (DashboardHome / CommandPalette)
  useEffect(() => {
    if (!launchTarget) return;
    if (launchTarget.subTab) {
      setSubTab(launchTarget.subTab);
    }
    if (launchTarget.action) {
      setPendingFlashcardAction(launchTarget.action);
    }
    onConsumeLaunchTarget?.();
  }, [launchTarget, onConsumeLaunchTarget]);

  // Derived metrics
  const projection = useMemo(() => computeWeightedProjection(history), [history]);
  const unresolvedMistakes = useMemo(() => mistakeBank.filter((m) => !m.resolved), [mistakeBank]);
  const overdueDecayRows = useMemo(() => decayRows.filter((r) => r.isOverdue), [decayRows]);
  const flashcardStats = useMemo(() => computeFlashcardStats(flashcardsStore), [flashcardsStore]);
  const leechFlashcards = useMemo(
    () => (flashcardsStore?.cards || []).filter((c) => isCardLeech(c)),
    [flashcardsStore]
  );
  const flashcardSourceRefSet = useMemo(
    () => new Set((flashcardsStore?.cards || []).map((c) => c.sourceRef).filter(Boolean)),
    [flashcardsStore]
  );

  const handlePromoteMistakeToFlashcard = useCallback(
    async (mistake) => {
      if (!onUpdateFlashcards || !mistake) return;
      const card = createCardFromMistake(mistake, getTodayISO());
      if (!card) return;
      let added = 0;
      await onUpdateFlashcards(
        (prev) => {
          const res = addCardsWithDedup(prev, [card], getTodayISO());
          added = res.addedCount;
          return res.nextStore;
        },
        { syncMarkdown: true, immediateCloud: true }
      );
      notify(added > 0 ? '已將此錯題轉為結構化閃卡並同步 MD' : '此錯題已存在於閃卡庫中');
    },
    [onUpdateFlashcards, notify]
  );

  const handlePromoteAllMistakesToFlashcards = useCallback(
    async (list) => {
      if (!onUpdateFlashcards || !list || list.length === 0) return;
      const today = getTodayISO();
      const cards = list.map((m) => createCardFromMistake(m, today)).filter(Boolean);
      let added = 0;
      let skipped = 0;
      await onUpdateFlashcards(
        (prev) => {
          const res = addCardsWithDedup(prev, cards, today);
          added = res.addedCount;
          skipped = res.skippedCount;
          return res.nextStore;
        },
        { syncMarkdown: true, immediateCloud: true }
      );
      notify(
        added > 0
          ? `已批量收錄 ${added} 張錯題閃卡（略過 ${skipped} 張重複）並同步 MD`
          : '目前篩選的錯題皆已收錄在閃卡庫中'
      );
    },
    [onUpdateFlashcards, notify]
  );

  const subjectFilterOptions = useMemo(() => {
    const base = ['ALL', '微積分', '計算機概論', '英文'];
    const extras = new Set();
    for (const e of exams) {
      const s = e.data?.subject;
      if (s && !base.includes(s)) extras.add(s);
    }
    for (const c of flashcardsStore?.cards || []) {
      if (c.subject && !base.includes(c.subject)) extras.add(c.subject);
    }
    return [...base, ...Array.from(extras)];
  }, [exams, flashcardsStore]);

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

  const handleExamGeneratedAndSaved = useCallback(
    async (newEntry) => {
      if (newEntry?.data) {
        setExams((prev) => [
          newEntry,
          ...prev.filter((x) => x.relativePath !== newEntry.relativePath && x.data?.id !== newEntry.data.id),
        ]);
      }
      await loadWorkspaceArenaData();
    },
    [loadWorkspaceArenaData]
  );

  // =========================================================================
  // RENDER: ACTIVE EXAM TAKING / REVIEWING SESSION
  // =========================================================================
  if (activeSession) {
    const {
      exam,
      phase,
      currentIndex,
      responses,
      flaggedIds = [],
      eliminated = {},
      secondsLeft,
      timerPaused,
      reviewFilter,
      synced,
    } = activeSession;
    const questions = exam.questions || [];
    const currentQ = questions[currentIndex] || questions[0];
    const currentResp = currentQ ? responses[currentQ.id] || {} : {};
    const currentPassage = currentQ?.passageId
      ? (exam.passages || []).find((p) => p.id === currentQ.passageId) || null
      : null;

    const answeredQuestions = questions.filter((q) => String(responses[q.id]?.answer || '').trim() !== '');
    const unansweredQuestions = questions.filter((q) => String(responses[q.id]?.answer || '').trim() === '');
    const untaggedQuestions = questions.filter((q) => !responses[q.id]?.confidence);
    const flaggedSet = new Set(flaggedIds);
    const answeredCount = answeredQuestions.length;
    const taggedCount = questions.length - untaggedQuestions.length;
    const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

    if (phase === 'taking' && currentQ) {
      const isUrgentTime = secondsLeft <= 300;
      const isWarnTime = !isUrgentTime && secondsLeft <= 600;
      const sectionInfo = (exam.sections || []).find((s) => s.id === currentQ.sectionId);
      const isFlagged = flaggedSet.has(currentQ.id);
      const currentEliminated = Array.isArray(eliminated[currentQ.id]) ? eliminated[currentQ.id] : [];
      const hasAnswer = String(currentResp.answer || '').trim() !== '';
      const needsConfidenceNudge = hasAnswer && !currentResp.confidence;
      const mathPreviewSource = formatAnswerForMathPreview(currentResp.answer);
      const shouldShowMathPreview = Boolean(
        currentResp.answer && (currentResp.answer.includes('$') || /[\\^_]/.test(currentResp.answer))
      );

      const navQuestions = questions
        .map((q, idx) => ({ q, idx }))
        .filter(({ q }) => {
          const r = responses[q.id] || {};
          const ans = String(r.answer || '').trim() !== '';
          if (navFilter === 'unanswered') return !ans;
          if (navFilter === 'flagged') return flaggedSet.has(q.id);
          if (navFilter === 'untagged') return !r.confidence;
          return true;
        });

      const jumpToNextUnanswered = () => {
        const after = questions.findIndex(
          (q, idx) => idx > currentIndex && String(responses[q.id]?.answer || '').trim() === ''
        );
        const target =
          after >= 0
            ? after
            : questions.findIndex((q) => String(responses[q.id]?.answer || '').trim() === '');
        if (target >= 0) {
          setActiveSession((prev) => (prev ? { ...prev, currentIndex: target } : prev));
        } else {
          notify('所有題目皆已填答完成！');
        }
      };

      return (
        <div className={`arena-session-shell font-scale-${fontScale}`}>
          {/* Top Sticky Glass Exam Bar */}
          <div className="arena-session-topbar is-sticky">
            <div className="arena-session-topbar-main">
              <div className="arena-session-title-group">
                <button
                  type="button"
                  className="arena-btn-ghost"
                  onClick={() => setConfirmModal('exit')}
                >
                  <ChevronLeft size={16} />
                  離開
                </button>
                <div style={{ minWidth: 0 }}>
                  <div className="arena-session-title">{exam.title}</div>
                  <div className="arena-session-meta">
                    <span>{exam.subject}</span>
                    <span>·</span>
                    <span>已答 <strong>{answeredCount}/{questions.length}</strong></span>
                    <span>·</span>
                    <span>信心 <strong>{taggedCount}/{questions.length}</strong></span>
                    {flaggedIds.length > 0 && (
                      <>
                        <span>·</span>
                        <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>
                          旗標 {flaggedIds.length}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="arena-session-actions">
                {/* Font scale controls (kept visible on mobile) + Desktop-only Focus & Shortcuts */}
                <div className="arena-utility-group">
                  <button
                    type="button"
                    className="arena-icon-btn"
                    onClick={() =>
                      setFontScale((prev) => (prev === 'lg' ? 'md' : prev === 'md' ? 'sm' : 'sm'))
                    }
                    disabled={fontScale === 'sm'}
                    title="縮小字體"
                    aria-label="縮小字體"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    className="arena-icon-btn"
                    onClick={() =>
                      setFontScale((prev) => (prev === 'sm' ? 'md' : prev === 'md' ? 'lg' : 'lg'))
                    }
                    disabled={fontScale === 'lg'}
                    title="放大字體"
                    aria-label="放大字體"
                  >
                    A+
                  </button>
                  <button
                    type="button"
                    className={`arena-icon-btn arena-desktop-only-tools ${focusMode ? 'is-active' : ''}`}
                    onClick={() => setFocusMode((p) => !p)}
                    title={focusMode ? '顯示左側題號導覽' : '專注模式（收合題號欄，放大作答區）'}
                    aria-label={focusMode ? '退出專注模式' : '切換專注模式'}
                  >
                    {focusMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                  <button
                    type="button"
                    className={`arena-icon-btn arena-desktop-only-tools ${showShortcuts ? 'is-active' : ''}`}
                    onClick={() => setShowShortcuts((p) => !p)}
                    title="鍵盤快捷鍵說明"
                    aria-label="鍵盤快捷鍵說明"
                  >
                    <Keyboard size={14} />
                  </button>
                </div>

                <div
                  className={`arena-timer-pill ${isUrgentTime ? 'is-urgent' : isWarnTime ? 'is-warn' : ''}`}
                >
                  <Clock size={15} />
                  <span>{formatSeconds(secondsLeft)}</span>
                  <button
                    type="button"
                    className="arena-timer-toggle"
                    onClick={() =>
                      setActiveSession((prev) => (prev ? { ...prev, timerPaused: !prev.timerPaused } : prev))
                    }
                    title={timerPaused ? '繼續計時' : '暫停計時'}
                    aria-label={timerPaused ? '繼續計時' : '暫停計時'}
                  >
                    {timerPaused ? <Play size={12} /> : <Pause size={12} />}
                  </button>
                </div>

                <button
                  type="button"
                  className="arena-btn-primary"
                  onClick={() => setConfirmModal('submit')}
                >
                  <CheckCircle2 size={15} />
                  交卷批改
                </button>
              </div>
            </div>

            {/* Thin Progress Bar */}
            <div className="arena-session-progress-track" aria-label={`作答進度 ${progressPct}%`}>
              <div className="arena-session-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>

            {showShortcuts && (
              <div className="arena-shortcuts-strip">
                <span><kbd>←</kbd> <kbd>→</kbd> 上／下一題</span>
                <span><kbd>A</kbd>–<kbd>E</kbd> 單選快選</span>
                <span><kbd>1</kbd> 會寫 · <kbd>2</kbd> 靠猜 · <kbd>3</kbd> 忘記</span>
                <span><kbd>F</kbd> 插旗待查</span>
                <span><kbd>S</kbd> 草稿紙</span>
                <span>右鍵選項：刪除線排除法</span>
              </div>
            )}
          </div>

          {/* Mobile Compact Navigator Toggle */}
          <div className="arena-mobile-nav-bar">
            <button
              type="button"
              className="arena-mobile-nav-trigger"
              onClick={() => setMobileNavOpen((p) => !p)}
            >
              <span>
                題號導覽 <strong>Q{currentQ.number}</strong> / {questions.length}（已答 {answeredCount}）
              </span>
              {mobileNavOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {unansweredQuestions.length > 0 && (
              <button type="button" className="arena-btn-ghost" onClick={jumpToNextUnanswered}>
                下一未答 <ArrowRight size={13} />
              </button>
            )}
          </div>

          <div className={`arena-session-body ${focusMode ? 'is-focus' : ''}`}>
            {/* Left Navigator */}
            {!focusMode && (
              <aside className={`arena-nav-panel ${mobileNavOpen ? 'is-mobile-open' : ''}`}>
                <div className="arena-nav-header">
                  <span>題號導覽</span>
                  <span className="arena-nav-sub">
                    {answeredCount} / {questions.length} 已答
                  </span>
                </div>

                {/* Quick Filter inside Navigator */}
                <div className="arena-nav-filter-row">
                  {[
                    { id: 'all', label: '全', count: questions.length },
                    { id: 'unanswered', label: '未答', count: unansweredQuestions.length },
                    { id: 'flagged', label: '旗', count: flaggedIds.length },
                    { id: 'untagged', label: '無標', count: untaggedQuestions.length },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`arena-nav-filter-btn ${navFilter === f.id ? 'active' : ''}`}
                      onClick={() => setNavFilter(f.id)}
                    >
                      {f.label}
                      {f.count > 0 && <small>{f.count}</small>}
                    </button>
                  ))}
                </div>

                <div className="arena-nav-grid">
                  {navQuestions.length === 0 ? (
                    <div className="arena-nav-empty">此篩選目前無題目</div>
                  ) : (
                    navQuestions.map(({ q, idx }) => {
                      const r = responses[q.id] || {};
                      const hasAns = String(r.answer || '').trim() !== '';
                      const confClass = r.confidence ? `conf-${r.confidence}` : '';
                      const flagged = flaggedSet.has(q.id);
                      return (
                        <button
                          key={q.id}
                          type="button"
                          className={`arena-nav-dot ${idx === currentIndex ? 'is-current' : ''} ${hasAns ? 'is-answered' : ''} ${confClass} ${flagged ? 'is-flagged' : ''}`}
                          onClick={() => {
                            setActiveSession((prev) => (prev ? { ...prev, currentIndex: idx } : prev));
                            setMobileNavOpen(false);
                          }}
                          title={`第 ${q.number} 題${flagged ? '（已插旗複查）' : ''}${q.isSpacedRecall ? '（間隔複習回馬槍）' : ''}`}
                        >
                          <span>{q.number}</span>
                          {q.isSpacedRecall && <span className="arena-recall-pip" />}
                          {flagged && <span className="arena-flag-pip" />}
                        </button>
                      );
                    })
                  )}
                </div>

                {unansweredQuestions.length > 0 && (
                  <button
                    type="button"
                    className="arena-btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem', padding: '6px 10px' }}
                    onClick={jumpToNextUnanswered}
                  >
                    跳至下一題未答 ({unansweredQuestions.length})
                  </button>
                )}

                <div className="arena-nav-legend">
                  <div><span className="legend-dot conf-confident" /> 會寫</div>
                  <div><span className="legend-dot conf-guessed" /> 靠猜</div>
                  <div><span className="legend-dot conf-forgot" /> 忘記公式</div>
                  <div><span className="legend-dot is-flag" /> 插旗複查</div>
                  <div><span className="legend-dot is-recall" /> 間隔回馬槍</div>
                </div>

                <div className="arena-no-hint-box">
                  <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>實戰盲測模式：已鎖定解答與提示，進度自動暫存於本機。</span>
                </div>
              </aside>
            )}

            {/* Right Main Question Stage */}
            <div className={`arena-question-stage ${currentPassage ? 'has-passage' : ''}`}>
              {currentPassage && (
                <div className="arena-passage-pane">
                  <div className="arena-passage-title">
                    <BookOpen size={15} />
                    <span>{currentPassage.title}</span>
                  </div>
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

                  <div className="arena-q-tools">
                    <button
                      type="button"
                      className={`arena-tool-chip ${scratchpadOpen || currentResp.scratchpad ? 'is-active' : ''}`}
                      onClick={() => setScratchpadOpen((p) => !p)}
                      title="開啟或收合本題草稿驗算區 (快捷鍵 S)"
                    >
                      <PenTool size={13} />
                      <span>草稿{currentResp.scratchpad ? ' (有筆記)' : ''}</span>
                    </button>
                    <button
                      type="button"
                      className={`arena-tool-chip is-flag-btn ${isFlagged ? 'is-flagged' : ''}`}
                      onClick={() => toggleFlagQuestion(currentQ.id)}
                      title="插旗標記待交卷前複查 (快捷鍵 F)"
                    >
                      <Flag size={13} />
                      <span>{isFlagged ? '已插旗' : '插旗複查'}</span>
                    </button>
                  </div>
                </div>

                <div className="arena-q-prompt">
                  <MarkdownBlock content={currentQ.prompt} />
                </div>

                {/* Answer Input Area */}
                {currentQ.type === 'mcq' ? (
                  <div className="arena-mcq-list" role="radiogroup" aria-label={`第 ${currentQ.number} 題選項`}>
                    {(currentQ.options || []).map((opt) => {
                      const selected = currentResp.answer === opt.key;
                      const isElim = currentEliminated.includes(opt.key);
                      return (
                        <div
                          key={opt.key}
                          className={`arena-mcq-option-wrap ${selected ? 'is-selected' : ''} ${isElim ? 'is-eliminated' : ''}`}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            toggleEliminateOption(currentQ.id, opt.key);
                          }}
                        >
                          <button
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            className="arena-mcq-option-main"
                            onClick={() => handleSelectMcqOption(currentQ.id, opt.key)}
                          >
                            <span className="arena-mcq-key">{opt.key}</span>
                            <div className="arena-mcq-text">
                              <MarkdownBlock content={opt.text} />
                            </div>
                            {selected && (
                              <span className="arena-mcq-selected-check" aria-hidden="true">
                                <Check size={15} />
                              </span>
                            )}
                          </button>
                          <button
                            type="button"
                            className={`arena-mcq-elim-btn ${isElim ? 'active' : ''}`}
                            onClick={() => toggleEliminateOption(currentQ.id, opt.key)}
                            title={isElim ? '取消排除' : '刪除線排除此選項（亦可在選項上按右鍵）'}
                            aria-label={isElim ? `取消排除選項 ${opt.key}` : `排除選項 ${opt.key}`}
                          >
                            <EyeOff size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="arena-text-answer-box">
                    <div className="arena-input-header">
                      <label className="arena-input-label" htmlFor={`arena-ans-${currentQ.id}`}>
                        {currentQ.type === 'fill'
                          ? '最終精簡答案（支援直接輸入 LaTeX 如 \\frac{27}{20} 或純文字 27/20）'
                          : '輸入你的最終答案與關鍵推導步驟（交卷後與標準詳解並列自評）'}
                      </label>
                    </div>

                    {/* Math Quick-Insert Toolbar */}
                    <div className="arena-math-toolbar" aria-label="數學符號快捷輸入列">
                      {MATH_SNIPPETS.map((snip) => (
                        <button
                          key={snip.label}
                          type="button"
                          className="arena-math-chip"
                          title={snip.title}
                          onClick={() => insertMathSnippet(currentQ.id, snip)}
                        >
                          {snip.label}
                        </button>
                      ))}
                    </div>

                    <textarea
                      id={`arena-ans-${currentQ.id}`}
                      ref={answerTextareaRef}
                      className={`arena-answer-textarea ${currentQ.type === 'calculation' ? 'is-tall' : ''}`}
                      value={currentResp.answer || ''}
                      onChange={(e) => updateQuestionResponse(currentQ.id, { answer: e.target.value })}
                      placeholder={
                        currentQ.type === 'fill'
                          ? '例：y = 4x - 4, y = -2x - 1 或 \\frac{27}{20} 或 [e^{-3}, e^3)'
                          : '記錄你的變數代換、臨界點分析、邊界條件與最終結果...'
                      }
                    />

                    {shouldShowMathPreview && (
                      <div className="arena-math-preview">
                        <div className="arena-preview-tag">LaTeX 即時渲染預覽</div>
                        <MarkdownBlock content={mathPreviewSource} />
                      </div>
                    )}
                  </div>
                )}

                {/* Collapsible Scratchpad */}
                {scratchpadOpen && (
                  <div className="arena-scratchpad-box">
                    <div className="arena-scratchpad-head">
                      <span><PenTool size={13} /> 本題草稿與驗算區（不計入答案欄，復盤時可對照）</span>
                      <button
                        type="button"
                        className="arena-btn-ghost"
                        style={{ padding: '2px 8px', fontSize: '0.74rem' }}
                        onClick={() => setScratchpadOpen(false)}
                      >
                        收合
                      </button>
                    </div>
                    <textarea
                      className="arena-scratchpad-textarea"
                      value={currentResp.scratchpad || ''}
                      onChange={(e) => updateQuestionResponse(currentQ.id, { scratchpad: e.target.value })}
                      placeholder="隨手記錄變數代換、界線檢查、指標追蹤值或單字刪去理由..."
                    />
                  </div>
                )}

                {/* Confidence Tagging Cards */}
                <div className={`arena-confidence-bar ${needsConfidenceNudge ? 'needs-nudge' : ''}`}>
                  <div className="arena-confidence-title">
                    <Brain size={15} />
                    <span>
                      作答信心標記
                      {needsConfidenceNudge && <em className="arena-nudge-pill">請標記此題把握度</em>}
                    </span>
                  </div>
                  <div className="arena-confidence-buttons">
                    {CONFIDENCE_OPTIONS.map((opt, idx) => {
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
                          <span>{opt.label}</span>
                          <kbd className="arena-conf-kbd">{idx + 1}</kbd>
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

                  <div className="arena-footer-progress-text">
                    第 <strong>{currentIndex + 1}</strong> / {questions.length} 題
                  </div>

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
                    <button
                      type="button"
                      className="arena-btn-primary"
                      onClick={() => setConfirmModal('submit')}
                    >
                      <CheckCircle2 size={16} /> 檢視並交卷
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Custom In-App Exit / Submit Confirm Modals */}
          {confirmModal === 'exit' && (
            <div className="arena-modal-backdrop" onClick={() => setConfirmModal(null)}>
              <div
                ref={confirmModalRef}
                role="dialog"
                aria-modal="true"
                aria-label="離開本次考場確認"
                tabIndex={-1}
                className="arena-confirm-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="arena-confirm-head">
                  <h3>離開本次考場？</h3>
                  <button type="button" className="arena-icon-btn" onClick={() => setConfirmModal(null)} aria-label="關閉視窗">
                    <X size={16} />
                  </button>
                </div>
                <p className="arena-confirm-desc">
                  目前已作答 <strong>{answeredCount} / {questions.length}</strong> 題（剩餘時間 {formatSeconds(secondsLeft)}）。你可以暫存進度稍後回來續寫，或直接放棄本次進度。
                </p>
                <div className="arena-confirm-actions">
                  <button type="button" className="arena-btn-ghost" onClick={() => setConfirmModal(null)}>
                    繼續作答
                  </button>
                  <button
                    type="button"
                    className="arena-btn-danger-ghost"
                    onClick={() => {
                      if (exam?.id) clearDraftForExam(exam.id);
                      setConfirmModal(null);
                      setActiveSession(null);
                      notify('已放棄本次未交卷進度');
                    }}
                  >
                    放棄進度離開
                  </button>
                  <button
                    type="button"
                    className="arena-btn-primary"
                    onClick={() => {
                      saveDraftForSession(activeSession);
                      setConfirmModal(null);
                      setActiveSession(null);
                      notify('已自動暫存作答進度，隨時可回試卷庫繼續作答');
                    }}
                  >
                    <Save size={14} /> 暫存並離開
                  </button>
                </div>
              </div>
            </div>
          )}

          {confirmModal === 'submit' && (
            <div className="arena-modal-backdrop" onClick={() => setConfirmModal(null)}>
              <div
                ref={confirmModalRef}
                role="dialog"
                aria-modal="true"
                aria-label="交卷前作答總覽確認"
                tabIndex={-1}
                className="arena-confirm-modal is-wide"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="arena-confirm-head">
                  <h3>交卷前作答總覽確認</h3>
                  <button type="button" className="arena-icon-btn" onClick={() => setConfirmModal(null)} aria-label="關閉視窗">
                    <X size={16} />
                  </button>
                </div>

                <div className="arena-submit-stat-grid">
                  <div className="arena-submit-stat tone-emerald">
                    <span>已作答</span>
                    <strong>{answeredCount} / {questions.length}</strong>
                  </div>
                  <div className={`arena-submit-stat ${unansweredQuestions.length > 0 ? 'tone-danger' : ''}`}>
                    <span>未作答</span>
                    <strong>{unansweredQuestions.length}</strong>
                  </div>
                  <div className={`arena-submit-stat ${untaggedQuestions.length > 0 ? 'tone-amber' : ''}`}>
                    <span>未標信心</span>
                    <strong>{untaggedQuestions.length}</strong>
                  </div>
                  <div className={`arena-submit-stat ${flaggedIds.length > 0 ? 'tone-purple' : ''}`}>
                    <span>已插旗複查</span>
                    <strong>{flaggedIds.length}</strong>
                  </div>
                </div>

                {unansweredQuestions.length > 0 && (
                  <div className="arena-submit-jump-block">
                    <div className="arena-submit-jump-label">尚未填答題號（點擊直接跳轉補寫）：</div>
                    <div className="arena-submit-jump-chips">
                      {unansweredQuestions.map((q) => {
                        const idx = questions.findIndex((item) => item.id === q.id);
                        return (
                          <button
                            key={q.id}
                            type="button"
                            className="arena-jump-chip is-danger"
                            onClick={() => {
                              setActiveSession((p) => (p ? { ...p, currentIndex: idx } : p));
                              setConfirmModal(null);
                            }}
                          >
                            Q{q.number}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {flaggedIds.length > 0 && (
                  <div className="arena-submit-jump-block">
                    <div className="arena-submit-jump-label">已插旗待複查題號：</div>
                    <div className="arena-submit-jump-chips">
                      {flaggedIds.map((fid) => {
                        const idx = questions.findIndex((item) => item.id === fid);
                        const q = questions[idx];
                        if (!q) return null;
                        return (
                          <button
                            key={fid}
                            type="button"
                            className="arena-jump-chip is-amber"
                            onClick={() => {
                              setActiveSession((p) => (p ? { ...p, currentIndex: idx } : p));
                              setConfirmModal(null);
                            }}
                          >
                            Q{q.number}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="arena-confirm-actions">
                  <button type="button" className="arena-btn-secondary" onClick={() => setConfirmModal(null)}>
                    返回檢查
                  </button>
                  <button type="button" className="arena-btn-primary" onClick={handleSubmitExam}>
                    <CheckCircle2 size={15} /> 確認交卷並解鎖詳解
                  </button>
                </div>
              </div>
            </div>
          )}
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
    const targetScore = Number(exam.targetScore || 90);
    const hitTarget = currentGrade.percentage >= targetScore;

    const scrollToReviewQuestion = (qId) => {
      if (reviewFilter !== 'all') {
        setActiveSession((p) => (p ? { ...p, reviewFilter: 'all' } : p));
      }
      window.requestAnimationFrame(() => {
        const el = document.getElementById(`arena-review-q-${qId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };

    return (
      <div className="arena-review-shell">
        <div className="arena-session-topbar is-sticky">
          <div className="arena-session-topbar-main">
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
                  <span>目標 {targetScore} 分</span>
                  <span>·</span>
                  <span style={{ color: hitTarget ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontWeight: 700 }}>
                    {hitTarget ? '達標' : `距目標差 ${Math.round((targetScore - currentGrade.percentage) * 10) / 10}%`}
                  </span>
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

          {/* Review Quick Jump Strip */}
          <div className="arena-review-jump-strip">
            {questions.map((q) => {
              const g = currentGrade.perQuestion[q.id];
              return (
                <button
                  key={q.id}
                  type="button"
                  className={`arena-review-dot status-${g.status} ${g.isBlindSpot ? 'is-blind' : ''}`}
                  onClick={() => scrollToReviewQuestion(q.id)}
                  title={`跳至 Q${q.number}（${g.status === 'correct' ? '正確' : g.status === 'partial' ? '部分對' : g.status === 'wrong' ? '錯誤' : '待自評'}）`}
                >
                  {q.number}
                </button>
              );
            })}
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
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>
              本卷尚有 <strong>{currentGrade.pendingCount} 題</strong> 填充／計算題等待你對照詳解進行步驟自評，完成後即可一鍵同步寫回學習狀態表與閃卡庫。
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
                id={`arena-review-q-${q.id}`}
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
                    {q.isSpacedRecall && (
                      <span className="arena-chip recall"><RotateCcw size={11} /> 回馬槍</span>
                    )}
                  </div>
                </div>

                <div className="arena-review-prompt">
                  <MarkdownBlock content={q.prompt} />
                </div>

                {/* MCQ Full Option Breakdown vs Text Answer Comparison */}
                {q.type === 'mcq' && Array.isArray(q.options) && q.options.length > 0 ? (
                  <div className="arena-review-mcq-list">
                    {q.options.map((opt) => {
                      const isCorrectOpt = String(q.answer || '').trim().toUpperCase() === opt.key;
                      const isUserPick = String(resp.answer || '').trim().toUpperCase() === opt.key;
                      const stateClass = isCorrectOpt
                        ? 'is-correct'
                        : isUserPick
                          ? 'is-wrong-pick'
                          : '';
                      return (
                        <div key={opt.key} className={`arena-review-mcq-opt ${stateClass}`}>
                          <span className="arena-mcq-key">{opt.key}</span>
                          <div className="arena-mcq-text">
                            <MarkdownBlock content={opt.text} />
                          </div>
                          <div className="arena-review-opt-tags">
                            {isCorrectOpt && (
                              <span className="arena-opt-tag is-correct"><Check size={12} /> 正確答案</span>
                            )}
                            {isUserPick && !isCorrectOpt && (
                              <span className="arena-opt-tag is-wrong"><X size={12} /> 你的選擇</span>
                            )}
                            {isUserPick && isCorrectOpt && (
                              <span className="arena-opt-tag is-picked">你的選擇</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {!resp.answer && (
                      <div className="arena-review-unanswered-note">本題未作答</div>
                    )}
                  </div>
                ) : (
                  <div className="arena-answer-compare">
                    <div className="arena-compare-box">
                      <div className="arena-compare-label">你的作答</div>
                      <div className="arena-compare-value">
                        {resp.answer ? (
                          <MarkdownBlock content={formatAnswerForMathPreview(resp.answer)} />
                        ) : (
                          <span className="arena-dim">（未作答）</span>
                        )}
                      </div>
                    </div>
                    <div className="arena-compare-box is-truth">
                      <div className="arena-compare-label">標準答案</div>
                      <div className="arena-compare-value">
                        <MarkdownBlock content={q.answer} />
                      </div>
                    </div>
                  </div>
                )}

                {resp.scratchpad && (
                  <div className="arena-review-scratchpad">
                    <div className="arena-compare-label">你的考場草稿筆記</div>
                    <pre>{resp.scratchpad}</pre>
                  </div>
                )}

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
                        <CheckCircle2 size={14} /> 全對 ({q.points} 分)
                      </button>
                      <button
                        type="button"
                        className={`arena-sg-btn tone-amber ${resp.selfGrade === 'partial' ? 'active' : ''}`}
                        onClick={() => updateQuestionResponse(q.id, { selfGrade: 'partial' })}
                      >
                        <AlertTriangle size={14} /> 部分對 ({Math.round(q.points * 0.5 * 10) / 10} 分)
                      </button>
                      <button
                        type="button"
                        className={`arena-sg-btn tone-danger ${resp.selfGrade === 'wrong' ? 'active' : ''}`}
                        onClick={() => updateQuestionResponse(q.id, { selfGrade: 'wrong' })}
                      >
                        <XCircle size={14} /> 錯誤 (0 分)
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
                        <div className="arena-insight-label"><Pin size={13} /> 核心公式 / 定義</div>
                        <MarkdownBlock content={q.coreFormula} />
                      </div>
                    )}
                    {q.pitfall && (
                      <div className="arena-insight-box tone-amber">
                        <div className="arena-insight-label"><AlertTriangle size={13} /> 易錯陷阱</div>
                        <MarkdownBlock content={q.pitfall} />
                      </div>
                    )}
                    {q.mnemonic && (
                      <div className="arena-insight-box tone-purple">
                        <div className="arena-insight-label"><Lightbulb size={13} /> 一句話考前口訣</div>
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

  const hideHubChrome = subTab === 'flashcards' && isFlashcardStudying;

  return (
    <div className="arena-hub">
      {/* Top NTHU CS A4 Projection Hero */}
      {!hideHubChrome && (
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
              onClick={() => setSubTab('flashcards')}
            >
              <Zap size={17} />
              <strong>{flashcardStats.dueCount > 0 ? `${flashcardStats.dueCount} 到期` : `${flashcardStats.totalActive} 張`}</strong>
              <span>主動回憶閃卡{flashcardStats.streakDays > 0 ? ` · ${flashcardStats.streakDays}天` : ''}</span>
            </button>
          </div>
        </div>
      </section>
      )}

      {!hideHubChrome && savedReviewDraft?.exam && (
        <div className="arena-review-resume-banner" role="status">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span>
              有尚未同步的復盤自評草稿：<strong>{savedReviewDraft.exam.title}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="arena-btn-primary"
              onClick={() => {
                setActiveSession({
                  exam: savedReviewDraft.exam,
                  relativePath: savedReviewDraft.relativePath || '',
                  phase: 'reviewing',
                  currentIndex: 0,
                  responses: savedReviewDraft.responses || {},
                  flaggedIds: savedReviewDraft.flaggedIds || [],
                  eliminated: savedReviewDraft.eliminated || {},
                  secondsLeft: 0,
                  elapsedSeconds: savedReviewDraft.elapsedSeconds || 0,
                  timerPaused: true,
                  reviewFilter: savedReviewDraft.reviewFilter || 'all',
                  synced: false,
                });
              }}
            >
              繼續復盤與同步
            </button>
            <button
              type="button"
              className="arena-btn-ghost"
              onClick={() => {
                setSavedReviewDraft(null);
                try { localStorage.removeItem(LOCAL_REVIEW_DRAFT_KEY); } catch {}
              }}
            >
              清除草稿
            </button>
          </div>
        </div>
      )}

      {!hideHubChrome && examLoadError && (
        <div className="arena-pending-banner">
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>{examLoadError}</span>
        </div>
      )}

      {/* Sub-navigation & Subject Filter */}
      {!hideHubChrome && (
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
            className={`arena-subtab ${subTab === 'flashcards' ? 'active' : ''}`}
            onClick={() => setSubTab('flashcards')}
          >
            <Zap size={15} /> 主動回憶閃卡 ({flashcardStats.dueCount > 0 ? `${flashcardStats.dueCount} 到期` : flashcardStats.totalActive})
          </button>
          <button
            type="button"
            className={`arena-subtab ${subTab === 'mistakes' ? 'active' : ''}`}
            onClick={() => setSubTab('mistakes')}
          >
            <Flame size={15} /> 錯題重練 ({unresolvedMistakes.length})
          </button>
          <button
            type="button"
            className={`arena-subtab ${subTab === 'decay' ? 'active' : ''}`}
            onClick={() => setSubTab('decay')}
          >
            <Brain size={15} /> 記憶衰減 ({overdueDecayRows.length})
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
            {subjectFilterOptions.map((subj) => (
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
            className="arena-btn-primary"
            onClick={() => setIsGenModalOpen(true)}
            title="自動讀取本機歷屆考古題與弱點狀態，一鍵生成可互動計時作答的 .exam.json 試卷"
          >
            <Wand2 size={14} /> AI 生成試卷
          </button>

          <button
            type="button"
            className="arena-btn-secondary"
            onClick={loadWorkspaceArenaData}
            disabled={isLoadingExams}
            title="重新掃描 Test_Bank/ 內的所有 .exam.json"
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
      )}

      {/* ================= SUBTAB 1: LIBRARY ================= */}
      {subTab === 'library' && (
        <div className="arena-exam-grid">
          {filteredExams.length === 0 ? (
            <div className="arena-empty-card">
              <Sparkles size={28} />
              <h3>尚無符合篩選的互動試卷 (.exam.json)</h3>
              <p>
                {isElectron
                  ? '可直接點擊下方「AI 生成試卷」讀取本機歷屆考古題產出新考卷，或點擊「重新掃描」載入工作區既有檔案。'
                  : '網頁版會自動從 Supabase 雲端載入試卷；你也可以直接點下方「AI 生成試卷」線上命題，或點擊「重新掃描」／「匯入 JSON」。'}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button type="button" className="arena-btn-primary" onClick={() => setIsGenModalOpen(true)}>
                  <Wand2 size={15} /> 立即 AI 生成互動試卷
                </button>
                <button type="button" className="arena-btn-secondary" onClick={loadWorkspaceArenaData}>
                  <RefreshCw size={14} /> 重新掃描
                </button>
              </div>
            </div>
          ) : (
            filteredExams.map((entry) => {
              const ex = entry.data || {};
              const qList = ex.questions || [];
              const recallCount = qList.filter((q) => q.isSpacedRecall).length;
              const lastAttempt = latestAttemptByExamId[ex.id];
              const subjMeta = SUBJECT_CONFIG[ex.subject];
              const draft = ex.id ? draftsMap[ex.id] : null;
              const draftAnswered = draft
                ? Object.values(draft.responses || {}).filter((r) => String(r?.answer || '').trim() !== '').length
                : 0;

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {draft && (
                        <span className="arena-draft-badge">
                          進行中 · {draftAnswered}/{qList.length}
                        </span>
                      )}
                      <span className="arena-mode-tag">
                        {MODE_LABELS[ex.mode] || ex.mode || '模擬卷'}
                      </span>
                    </div>
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
                      <Target size={13} />
                      <span>
                        上次實測 ({lastAttempt.date})：<strong>{lastAttempt.percentage}%</strong>
                        （盲區 {lastAttempt.blindSpotCount} 題）
                      </span>
                    </div>
                  )}

                  <div className="arena-exam-card-actions">
                    {draft ? (
                      <>
                        <button
                          type="button"
                          className="arena-btn-primary"
                          onClick={() => startExamSession(ex, entry.relativePath, { resumeDraft: true })}
                        >
                          <Play size={14} /> 繼續上次作答
                        </button>
                        <button
                          type="button"
                          className="arena-btn-secondary"
                          onClick={() => startExamSession(ex, entry.relativePath, { resumeDraft: false })}
                          title="清除暫存進度並重新計時"
                        >
                          <RotateCcw size={13} /> 重頭開始
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="arena-btn-primary"
                        onClick={() => startExamSession(ex, entry.relativePath)}
                      >
                        <Play size={14} /> 開始計時作答
                      </button>
                    )}

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
                        原卷 MD
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      {/* ================= SUBTAB 1.5: ACTIVE RECALL FLASHCARDS ================= */}
      {subTab === 'flashcards' && (
        <FlashcardHub
          store={flashcardsStore}
          subjectFilter={subjectFilter}
          courses={courses}
          decayRows={decayRows}
          mistakeBank={mistakeBank}
          onUpdateStore={onUpdateFlashcards}
          onResyncFromMd={onResyncFlashcardsFromMd}
          onPreviewFile={onPreviewFile}
          onOpenAiSettings={onOpenAiSettings}
          showToast={showToast}
          pendingAction={pendingFlashcardAction}
          onConsumePendingAction={() => setPendingFlashcardAction(null)}
          onStudyActiveChange={setIsFlashcardStudying}
        />
      )}

      {/* ================= SUBTAB 2: MISTAKE BANK ================= */}
      {subTab === 'mistakes' && (
        <div className="arena-mistakes-panel">
          <div className="arena-panel-header">
            <div>
              <h3>錯題與盲區重練清單（含答錯、靠猜、忘記公式）</h3>
              <p>每次交卷並同步後自動彙整；重練時「答對且標記會寫」即自動解除，也可一鍵轉為 SM-2 主動回憶閃卡。</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="arena-btn-secondary"
                disabled={filteredMistakes.length === 0}
                onClick={() => handlePromoteAllMistakesToFlashcards(filteredMistakes)}
                title="將目前篩選的所有錯題批量轉為結構化閃卡（自動去重）"
              >
                <Zap size={14} /> 全部轉為閃卡
              </button>
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
          </div>

          {filteredMistakes.length === 0 ? (
            <div className="arena-empty-card">
              <CheckCircle2 size={28} />
              <h3>目前沒有待修補的錯題盲區</h3>
              <p>完成任一份診斷卷或模擬卷並點擊「儲存並同步」後，所有答錯、靠猜與忘記公式的題目會自動進入此清單。</p>
            </div>
          ) : (
            <div className="arena-mistake-list">
              {filteredMistakes.map((m) => {
                const alreadyInFlashcards = flashcardSourceRefSet.has(m.key);
                return (
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {alreadyInFlashcards ? (
                        <span className="arena-chip" style={{ color: 'var(--accent-purple)' }}>
                          <Zap size={12} /> 已收錄閃卡
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="arena-btn-ghost"
                          onClick={() => handlePromoteMistakeToFlashcard(m)}
                          title="將此錯題轉為結構化主動回憶閃卡"
                        >
                          <Zap size={13} /> 轉為閃卡
                        </button>
                      )}
                      <button
                        type="button"
                        className="arena-btn-ghost"
                        onClick={() => toggleMistakeResolved(m.key)}
                      >
                        <Check size={14} /> 標記已攻克
                      </button>
                    </div>
                  </div>
                  <div className="arena-mistake-body">
                    <MarkdownBlock content={m.question?.prompt || ''} />
                  </div>
                  {m.question?.mnemonic && (
                    <div className="arena-mistake-mnemonic">
                      <Lightbulb size={14} /> 速記口訣：{m.question.mnemonic}
                    </div>
                  )}
                </div>
                );
              })}
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
                onClick={() => setSubTab('flashcards')}
              >
                <Zap size={14} /> 開啟主動回憶閃卡 ({flashcardStats.dueCount} 到期)
              </button>
            </div>
          </div>

          {decayLoadError ? (
            <div className="arena-empty-card">
              <Filter size={26} />
              <h3>{decayLoadError}</h3>
              <p>請點擊上方「重新掃描」或等待雲端同步完成，即可自動載入章節記憶衰減狀態。</p>
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
                        <span>{row.isOverdue ? '需立即喚醒' : `下次 ${row.nextReviewDate}`}</span>
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
      {subTab === 'history' && (() => {
        const filteredHistory = subjectFilter === 'ALL'
          ? history
          : history.filter((h) => h.subject === subjectFilter);
        return (
        <div className="arena-history-panel">
          {filteredHistory.length === 0 ? (
            <div className="arena-empty-card">
              <History size={28} />
              <h3>{history.length === 0 ? '尚無刷題紀錄' : `目前無「${subjectFilter}」的刷題紀錄`}</h3>
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
                  {filteredHistory.map((h) => (
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
        );
      })()}

      {/* AI Exam Generator Modal */}
      <ExamGeneratorModal
        isOpen={isGenModalOpen}
        onClose={() => setIsGenModalOpen(false)}
        initialSubject={subjectFilter === 'ALL' ? '微積分' : subjectFilter}
        availableCourses={courses}
        decayRows={decayRows}
        mistakeBank={mistakeBank}
        leechFlashcards={leechFlashcards}
        onExamSaved={handleExamGeneratedAndSaved}
        onStartExam={(examData, relPath) => startExamSession(examData, relPath)}
        onOpenSettings={onOpenAiSettings}
        onRequireUnlock={onRequireUnlock}
        showToast={showToast}
      />
    </div>
  );
}
