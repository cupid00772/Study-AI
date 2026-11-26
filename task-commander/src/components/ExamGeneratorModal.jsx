import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  X,
  Sparkles,
  Play,
  Square,
  Save,
  RefreshCw,
  Settings,
  Cpu,
  AlertCircle,
  CheckCircle2,
  FileText,
  Brain,
  Flame,
  Eye,
  Code,
  Rocket,
  Clock,
  Award,
  RotateCcw,
  BookOpen,
  Zap,
} from 'lucide-react';
import { renderMarkdownWithKatex } from '../utils/markdownRenderer';
import { useModalA11y } from '../hooks/useModalA11y';
import {
  loadAiConfig,
  saveAiConfig,
  streamAiGeneration,
  GEMINI_API_MODEL_PRESETS,
} from '../services/aiService';
import {
  getAssetManifest,
  fetchCloudAssetText,
  uploadTextAssetToCloud,
} from '../services/cloudAssetService';
import { pushCloudDoc, SYNC_KEYS } from '../services/cloudSyncService';
import { getResolvedCloudConfig } from '../services/supabaseClient';
import { MODE_LABELS } from '../utils/examArenaUtils';
import {
  ARENA_MODE_OPTIONS,
  QUESTION_FORMAT_OPTIONS,
  getPresetForSubject,
  buildInteractiveExamPrompt,
  parseAndRepairExamJson,
  buildExamSavePaths,
  convertExamJsonToMarkdown,
} from '../utils/examGeneratorUtils';

const CORE_SUBJECTS = ['微積分', '計算機概論', '英文'];

const DIFFICULTY_PRESETS = [
  '90+ 頂標鑑別（台聯大／清大資工水準）',
  '標準轉學考／大學期中期末',
  '基礎觀念喚醒與熱身',
];

function isRefRelevantToSubject(filePath, subject) {
  const lower = String(filePath || '').toLowerCase();
  if (lower.includes('ust_a4_nthu_cs_profile') || lower.includes('consolidated_learning_status')) {
    return CORE_SUBJECTS.includes(subject);
  }
  if (subject === '微積分') {
    return lower.includes('微積分') || lower.includes('calc');
  }
  if (subject === '計算機概論') {
    return lower.includes('計算機概論') || lower.includes('計概') || lower.includes('資料結構') || lower.includes('作業系統');
  }
  if (subject === '英文') {
    return lower.includes('英文') || lower.includes('english') || lower.includes('ust_transfer_english');
  }
  return subject ? lower.includes(subject.toLowerCase()) : false;
}

export default function ExamGeneratorModal({
  isOpen,
  onClose,
  initialSubject = '微積分',
  availableCourses = [],
  decayRows = [],
  mistakeBank = [],
  leechFlashcards = [],
  onExamSaved,
  onStartExam,
  onOpenSettings,
  onRequireUnlock,
  showToast,
}) {
  const isElectron = Boolean(window.electronAPI?.isElectron);
  const cloudConfigured = getResolvedCloudConfig().configured;

  const [aiConfig, setAiConfig] = useState(() => loadAiConfig());
  const [agyInfo, setAgyInfo] = useState({ checked: false, available: false, models: [], error: '' });
  const [checkingAgy, setCheckingAgy] = useState(false);

  // Exam parameters
  const initialPreset = getPresetForSubject(initialSubject && initialSubject !== 'ALL' ? initialSubject : '微積分');
  const [subject, setSubject] = useState(initialPreset.subject);
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [mode, setMode] = useState('mock');
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(initialPreset.questionCount);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(initialPreset.timeLimitMinutes);
  const [questionFormat, setQuestionFormat] = useState('auto');
  const [difficulty, setDifficulty] = useState(DIFFICULTY_PRESETS[0]);
  const [includeWeakChapters, setIncludeWeakChapters] = useState(true);
  const [includeMistakeRecall, setIncludeMistakeRecall] = useState(true);
  const [includeLeechRecall, setIncludeLeechRecall] = useState(true);
  const [extraInstructions, setExtraInstructions] = useState('');

  // Reference files discovery
  const [workspaceRefFiles, setWorkspaceRefFiles] = useState([]);
  const [selectedRefPaths, setSelectedRefPaths] = useState([]);
  const [showAllRefs, setShowAllRefs] = useState(false);
  const [refSearch, setRefSearch] = useState('');

  // Streaming & parsed state
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [rawOutput, setRawOutput] = useState('');
  const [parsedExam, setParsedExam] = useState(null);
  const [parseError, setParseError] = useState('');
  const [genError, setGenError] = useState('');
  const [usageInfo, setUsageInfo] = useState(null);
  const [rightView, setRightView] = useState('preview'); // 'preview' | 'raw'
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecord, setSavedRecord] = useState(null);

  const abortCtrlRef = useRef(null);
  const timerRef = useRef(null);

  const effectiveSubject = subject === '__CUSTOM__' ? (customSubjectInput.trim() || '自訂科目') : subject;

  const extraCourseChoices = useMemo(() => {
    const set = new Set();
    for (const c of availableCourses || []) {
      const name = typeof c === 'string' ? c : c?.name;
      if (name && !CORE_SUBJECTS.includes(name) && !name.includes('護照') && !name.includes('導師班') && !name.includes('服務學習')) {
        set.add(name);
      }
    }
    return Array.from(set);
  }, [availableCourses]);

  const checkAgy = useCallback(async () => {
    if (!isElectron || !window.electronAPI?.checkAgyCli) return;
    setCheckingAgy(true);
    try {
      const res = await window.electronAPI.checkAgyCli();
      setAgyInfo({
        checked: true,
        available: Boolean(res?.available),
        models: Array.isArray(res?.models) ? res.models : [],
        error: res?.error || '',
      });
      if (res?.available && Array.isArray(res.models) && res.models.length > 0) {
        setAiConfig((prev) => {
          if (res.models.some((m) => m.id === prev.agyModel)) return prev;
          const preferred =
            res.models.find((m) => m.id === 'gemini-4-neon-high') ||
            res.models.find((m) => m.id.includes('neon')) ||
            res.models[0];
          const next = { ...prev, agyModel: preferred.id };
          saveAiConfig(next);
          return next;
        });
      }
    } finally {
      setCheckingAgy(false);
    }
  }, [isElectron]);

  const loadAvailableReferences = useCallback(async () => {
    if (isElectron && window.electronAPI?.listArenaReferenceFiles) {
      const res = await window.electronAPI.listArenaReferenceFiles();
      if (res?.success && Array.isArray(res.files)) {
        setWorkspaceRefFiles(res.files);
        return res.files;
      }
    }
    // Web fallback: read readable markdown/txt files from Cloud Asset Manifest
    const manifest = getAssetManifest();
    const files = Object.keys(manifest?.files || {})
      .filter((p) => /\.(md|txt)$/i.test(p) && !p.includes('/archive/'))
      .map((p) => ({
        path: p,
        name: p.split('/').pop() || p,
        group: p.split('/')[0] || 'Cloud',
        size: manifest.files[p]?.size || 0,
      }))
      .sort((a, b) => a.path.localeCompare(b.path));
    setWorkspaceRefFiles(files);
    return files;
  }, [isElectron]);

  const applySubjectDefaults = useCallback(
    (nextSubj, refListOverride = null) => {
      const p = getPresetForSubject(nextSubj);
      setQuestionCount(p.questionCount);
      setTimeLimitMinutes(p.timeLimitMinutes);
      setQuestionFormat('auto');
      setDifficulty(CORE_SUBJECTS.includes(nextSubj) ? DIFFICULTY_PRESETS[0] : DIFFICULTY_PRESETS[1]);

      const sourceRefs = refListOverride || workspaceRefFiles;
      const availableSet = new Set(sourceRefs.map((f) => f.path));
      const autoSelected = p.recommendedRefs.filter((r) => availableSet.has(r));
      setSelectedRefPaths(autoSelected);
    },
    [workspaceRefFiles]
  );

  useEffect(() => {
    if (!isOpen) return;
    setAiConfig(loadAiConfig());
    const targetSubj = initialSubject && initialSubject !== 'ALL' ? initialSubject : '微積分';
    setSubject(targetSubj);
    if (isElectron) checkAgy();
    loadAvailableReferences().then((files) => {
      applySubjectDefaults(targetSubj, files);
    });
    return () => {
      if (abortCtrlRef.current) abortCtrlRef.current.abort();
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const { dialogRef } = useModalA11y({
    isOpen,
    onClose,
    disabled: isGenerating || isSaving,
  });

  const subjectWeakChapters = useMemo(() => {
    return (decayRows || []).filter(
      (r) =>
        r.subject === effectiveSubject &&
        (r.isOverdue || r.status?.includes('🔴') || r.status?.includes('🟡'))
    );
  }, [decayRows, effectiveSubject]);

  const subjectActiveMistakes = useMemo(() => {
    return (mistakeBank || []).filter(
      (m) => !m.resolved && m.subject === effectiveSubject
    );
  }, [mistakeBank, effectiveSubject]);

  const subjectLeechCards = useMemo(() => {
    return (leechFlashcards || []).filter(
      (c) => !c.suspended && c.subject === effectiveSubject
    );
  }, [leechFlashcards, effectiveSubject]);

  const visibleRefFiles = useMemo(() => {
    const q = refSearch.trim().toLowerCase();
    return workspaceRefFiles.filter((f) => {
      if (q) {
        return f.path.toLowerCase().includes(q) || f.name.toLowerCase().includes(q);
      }
      if (showAllRefs) return true;
      return selectedRefPaths.includes(f.path) || isRefRelevantToSubject(f.path, effectiveSubject);
    });
  }, [workspaceRefFiles, showAllRefs, refSearch, selectedRefPaths, effectiveSubject]);

  const updateEngine = (patch) => {
    setAiConfig((prev) => {
      const next = { ...prev, ...patch };
      saveAiConfig(next);
      return next;
    });
  };

  const toggleRefPath = (relPath) => {
    setSelectedRefPaths((prev) =>
      prev.includes(relPath) ? prev.filter((p) => p !== relPath) : [...prev, relPath]
    );
  };

  const handleSelectSubject = (nextSubj) => {
    setSubject(nextSubj);
    if (nextSubj !== '__CUSTOM__') {
      applySubjectDefaults(nextSubj);
    } else {
      setSelectedRefPaths([]);
    }
  };

  const handleSelectMode = (nextMode) => {
    setMode(nextMode);
    if (nextMode === 'micro_drill') {
      setQuestionCount(effectiveSubject === '英文' ? 15 : 8);
      setTimeLimitMinutes(15);
    } else {
      const p = getPresetForSubject(effectiveSubject);
      setQuestionCount(p.questionCount);
      setTimeLimitMinutes(p.timeLimitMinutes);
    }
  };

  const readSelectedReferenceContents = async () => {
    const loaded = [];
    for (const relPath of selectedRefPaths) {
      let content = '';
      if (isElectron && window.electronAPI?.readFileContent) {
        const res = await window.electronAPI.readFileContent(relPath);
        if (res?.success) content = res.content;
      }
      if (!content) {
        const cloudRes = await fetchCloudAssetText(relPath);
        if (cloudRes?.success) content = cloudRes.content;
      }
      if (content) {
        loaded.push({
          title: relPath.split('/').pop() || relPath,
          path: relPath,
          content,
        });
      }
    }
    return loaded;
  };

  const tryParseRawOutput = useCallback(
    (text) => {
      try {
        const parsed = parseAndRepairExamJson(text, {
          subject: effectiveSubject,
          mode,
          topic: topic.trim(),
          timeLimitMinutes,
        });
        setParsedExam(parsed);
        setParseError('');
        setRightView('preview');
        return parsed;
      } catch (err) {
        setParsedExam(null);
        setParseError(err?.message || 'JSON 解析失敗');
        setRightView('raw');
        return null;
      }
    },
    [effectiveSubject, mode, topic, timeLimitMinutes]
  );

  const handleGenerate = async () => {
    if (isGenerating) return;
    setGenError('');
    setParseError('');
    setParsedExam(null);
    setSavedRecord(null);
    setRawOutput('');
    setUsageInfo(null);
    setElapsedSec(0);
    setIsGenerating(true);

    const startedAt = Date.now();
    timerRef.current = window.setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    }, 500);

    const ctrl = new AbortController();
    abortCtrlRef.current = ctrl;

    try {
      setStatusText(
        selectedRefPaths.length > 0
          ? `正在讀取 ${selectedRefPaths.length} 份本機考古題與考情參考檔...`
          : '正在組合結構化命題指令...'
      );
      const refFiles = await readSelectedReferenceContents();

      const { systemPrompt, userPrompt } = buildInteractiveExamPrompt({
        subject: effectiveSubject,
        mode,
        topic: topic.trim(),
        questionCount,
        timeLimitMinutes,
        questionFormat,
        difficulty,
        includeRecallRatio: includeMistakeRecall ? 25 : 15,
        referenceFiles: refFiles,
        weakChapters: includeWeakChapters ? subjectWeakChapters : [],
        activeMistakes: includeMistakeRecall ? subjectActiveMistakes : [],
        leechFlashcards: includeLeechRecall ? subjectLeechCards : [],
        extraInstructions,
        isAgyCli: aiConfig.engine === 'agy',
      });

      const res = await streamAiGeneration({
        config: aiConfig,
        systemPrompt,
        userPrompt,
        signal: ctrl.signal,
        onStatus: (msg) => setStatusText(msg),
        onDelta: (_delta, full) => {
          setRawOutput(full);
        },
      });

      const finalText = res?.text || '';
      setRawOutput(finalText);
      setUsageInfo(res?.usage || null);
      const elapsed = Math.max(1, Math.round((Date.now() - startedAt) / 1000));

      const okExam = tryParseRawOutput(finalText);
      if (okExam) {
        setStatusText(`生成並驗證完成！共 ${okExam.questions.length} 題（${res?.model || ''} · ${elapsed} 秒）`);
      } else {
        setStatusText(`模型輸出完畢（${elapsed} 秒），但 JSON 需要微調後重新解析`);
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        setStatusText('已停止生成');
      } else {
        setGenError(err?.message || 'AI 試卷生成失敗');
        setStatusText('');
      }
    } finally {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      abortCtrlRef.current = null;
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    abortCtrlRef.current?.abort();
  };

  const saveExamFiles = async ({ startImmediately = false } = {}) => {
    if (!parsedExam || isSaving) return;
    setIsSaving(true);
    setGenError('');
    try {
      const paths = buildExamSavePaths(parsedExam);
      const finalExam = {
        ...parsedExam,
        sourceMarkdown: paths.examMdPath,
        answerMarkdown: paths.answerMdPath,
      };
      const { examMarkdown, answerMarkdown } = convertExamJsonToMarkdown(finalExam);
      const jsonContent = JSON.stringify(finalExam, null, 2);

      if (isElectron && window.electronAPI?.writeFileContent) {
        const filesToWrite = [
          { relativePath: paths.jsonPath, content: jsonContent },
          { relativePath: paths.examMdPath, content: examMarkdown },
          { relativePath: paths.answerMdPath, content: answerMarkdown },
        ];
        for (const f of filesToWrite) {
          const w = await window.electronAPI.writeFileContent(f);
          if (!w?.success) {
            throw new Error(w?.error || `寫入 ${f.relativePath} 失敗`);
          }
          window.electronAPI?.syncCloudAssets?.({ singleFile: f.relativePath }).catch(() => {});
        }
      } else if (cloudConfigured) {
        const pushManifestFn = (nextManifest) =>
          pushCloudDoc(SYNC_KEYS.ASSET_MANIFEST, nextManifest, { immediate: true });
        for (const f of [
          { path: paths.jsonPath, content: jsonContent },
          { path: paths.examMdPath, content: examMarkdown },
          { path: paths.answerMdPath, content: answerMarkdown },
        ]) {
          const up = await uploadTextAssetToCloud(f.content, f.path, pushManifestFn);
          if (!up?.success) {
            if (up?.authRequired) onRequireUnlock?.();
            throw new Error(up?.error || '雲端上傳失敗（請先點上方鎖頭解鎖寫入權限）');
          }
        }
      } else {
        throw new Error('非桌面端且未設定雲端寫入，無法儲存（但可直接點下方「直接開始作答」先行練習）');
      }

      const entry = {
        relativePath: paths.jsonPath,
        mtimeMs: Date.now(),
        data: finalExam,
      };
      setSavedRecord({ entry, paths });
      await onExamSaved?.(entry);
      showToast?.(`已生成並收錄「${finalExam.title}」（含互動 JSON ＋ 考卷／詳解 MD）`);

      if (startImmediately) {
        onClose();
        onStartExam?.(finalExam, paths.jsonPath);
      }
    } catch (err) {
      setGenError(err?.message || '儲存試卷失敗');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const recallPreviewCount = parsedExam
    ? (parsedExam.questions || []).filter((q) => q.isSpacedRecall).length
    : 0;

  return (
    <div className="viewer-modal-overlay">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="AI 互動試卷生成室"
        tabIndex={-1}
        className="viewer-modal-container fullscreen ai-studio-modal arena-gen-modal"
      >
        {/* Top Toolbar */}
        <div className="viewer-toolbar" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div className="vault-icon-badge" style={{ width: 36, height: 36, background: 'var(--accent-gradient)', color: '#fff' }}>
              <Sparkles size={19} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>AI 互動試卷生成室（.exam.json ＋ 考卷／詳解 MD）</span>
                <span className="badge-chip badge-purple" style={{ fontSize: '0.7rem' }}>
                  {aiConfig.engine === 'agy'
                    ? `本機 AGY · ${aiConfig.agyModel}`
                    : aiConfig.engine === 'gemini'
                      ? `Gemini API · ${aiConfig.geminiModel}`
                      : `OpenAI/Ollama · ${aiConfig.openaiModel}`}
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                自動掛載本機歷屆考古題 OCR 快取與弱點狀態表 → 生成後直接進刷題戰情室計時作答
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <select
              className="form-control"
              style={{ width: 'auto', height: '32px', padding: '0 10px', fontSize: '0.78rem' }}
              value={aiConfig.engine}
              onChange={(e) => updateEngine({ engine: e.target.value })}
              disabled={isGenerating}
              title="切換 AI 引擎"
            >
              {isElectron && <option value="agy">⚡ 本機 Antigravity CLI</option>}
              <option value="gemini">🌐 Google Gemini API</option>
              <option value="openai">🔌 OpenAI 相容 / Ollama</option>
            </select>

            {aiConfig.engine === 'agy' && isElectron && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <select
                  className="form-control"
                  style={{ width: 'auto', maxWidth: '215px', height: '32px', padding: '0 10px', fontSize: '0.78rem' }}
                  value={aiConfig.agyModel}
                  onChange={(e) => updateEngine({ agyModel: e.target.value })}
                  disabled={isGenerating}
                >
                  {agyInfo.models.length > 0 ? (
                    agyInfo.models.map((m) => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))
                  ) : (
                    <>
                      <option value="gemini-4-neon-high">Gemini 4 Neon (High)</option>
                      <option value="gemini-4-neon-xhigh">Gemini 4 Neon (XHigh)</option>
                      <option value="gemini-4-carbon-high">Gemini 4 Carbon (High)</option>
                      <option value="gemini-3.8-flash-high">Gemini 3.8 Flash (High)</option>
                    </>
                  )}
                </select>
                <button
                  type="button"
                  className="btn btn-secondary btn-icon-sm"
                  style={{ width: 30, height: 30 }}
                  onClick={checkAgy}
                  disabled={checkingAgy || isGenerating}
                  title="重新偵測本機 agy 模型"
                  aria-label="重新偵測本機 agy 模型"
                >
                  <RefreshCw size={13} className={checkingAgy ? 'spin' : ''} />
                </button>
              </div>
            )}

            {aiConfig.engine === 'gemini' && (
              <select
                className="form-control"
                style={{ width: 'auto', height: '32px', padding: '0 10px', fontSize: '0.78rem' }}
                value={aiConfig.geminiModel}
                onChange={(e) => updateEngine({ geminiModel: e.target.value })}
                disabled={isGenerating}
              >
                {GEMINI_API_MODEL_PRESETS.map((m) => (
                  <option key={m.id} value={m.id}>{m.id}</option>
                ))}
              </select>
            )}

            {onOpenSettings && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                disabled={isGenerating}
              >
                <Settings size={14} /> AI 設定
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary btn-icon-circle"
              onClick={onClose}
              disabled={isGenerating || isSaving}
              style={{ width: 34, height: 34 }}
              title="關閉"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main 2-Column Body */}
        <div className="ai-studio-grid">
          {/* LEFT: Exam Generation Config */}
          <div className="ai-studio-config-col">
            {aiConfig.engine === 'agy' && agyInfo.checked && !agyInfo.available && (
              <div className="arena-gen-warn">
                <AlertCircle size={14} />
                <span>偵測不到本機 agy CLI（{agyInfo.error || '請先於終端登入 agy'}），可切換至 Gemini API。</span>
              </div>
            )}

            {/* Subject Quick Select */}
            <div>
              <label className="setting-label">1. 選擇科目（自動載入該科歷屆考古與題型規範）</label>
              <div className="arena-gen-subject-grid">
                {CORE_SUBJECTS.map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    className={`arena-gen-subject-btn ${subject === subj ? 'active' : ''}`}
                    onClick={() => handleSelectSubject(subj)}
                    disabled={isGenerating}
                  >
                    <strong>{subj}</strong>
                    <span>{subj === '英文' ? '權重 ×1' : '權重 ×2'}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <select
                  className="form-control"
                  style={{ fontSize: '0.8rem', height: '34px' }}
                  value={CORE_SUBJECTS.includes(subject) ? '' : subject}
                  onChange={(e) => {
                    if (e.target.value) handleSelectSubject(e.target.value);
                  }}
                  disabled={isGenerating}
                >
                  <option value="">或選擇校內其他科目／自訂...</option>
                  {extraCourseChoices.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__CUSTOM__">✏️ 自訂科目名稱</option>
                </select>
                {subject === '__CUSTOM__' && (
                  <input
                    type="text"
                    className="form-control"
                    style={{ height: '34px', fontSize: '0.8rem' }}
                    placeholder="輸入科目名稱..."
                    value={customSubjectInput}
                    onChange={(e) => setCustomSubjectInput(e.target.value)}
                    disabled={isGenerating}
                  />
                )}
              </div>
            </div>

            {/* Mode Cards */}
            <div>
              <label className="setting-label">2. 出題策略</label>
              <div className="arena-gen-mode-grid">
                {ARENA_MODE_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`arena-gen-mode-pill ${mode === m.id ? 'active' : ''}`}
                    onClick={() => handleSelectMode(m.id)}
                    disabled={isGenerating}
                    title={m.desc}
                  >
                    <strong>{m.label}</strong>
                    <span>{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic & Counts */}
            <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label className="setting-label">命題章節／主題範圍（留空則依該科全範圍出題）</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={getPresetForSubject(effectiveSubject).defaultTopic}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="setting-grid-2">
                <div>
                  <label className="setting-label">題數</label>
                  <select
                    className="form-control"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    disabled={isGenerating}
                  >
                    <option value={5}>5 題（極速熱身）</option>
                    <option value={8}>8 題（精選微測）</option>
                    <option value={10}>10 題（標準單元）</option>
                    <option value={12}>12 題（微積分標準 10+2）</option>
                    <option value={15}>15 題（英文快刷／中卷）</option>
                    <option value={20}>20 題（計概／英文大卷）</option>
                    <option value={25}>25 題（全真高強度卷）</option>
                  </select>
                </div>
                <div>
                  <label className="setting-label">作答限時（分鐘）</label>
                  <input
                    type="number"
                    min={10}
                    max={180}
                    step={5}
                    className="form-control"
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(Number(e.target.value) || 60)}
                    disabled={isGenerating}
                  />
                </div>
              </div>

              <div className="setting-grid-2">
                <div>
                  <label className="setting-label">題型配置</label>
                  <select
                    className="form-control"
                    value={questionFormat}
                    onChange={(e) => setQuestionFormat(e.target.value)}
                    disabled={isGenerating}
                  >
                    {QUESTION_FORMAT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="setting-label">難度校準</label>
                  <select
                    className="form-control"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    disabled={isGenerating}
                  >
                    {DIFFICULTY_PRESETS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Adaptive weakness toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '2px' }}>
                <label className="arena-gen-check-row">
                  <input
                    type="checkbox"
                    checked={includeWeakChapters}
                    onChange={(e) => setIncludeWeakChapters(e.target.checked)}
                    disabled={isGenerating}
                  />
                  <Brain size={13} />
                  <span>自動對準記憶衰減 🔴/🟡 章節（{effectiveSubject} 目前 {subjectWeakChapters.length} 章）</span>
                </label>
                <label className="arena-gen-check-row">
                  <input
                    type="checkbox"
                    checked={includeMistakeRecall}
                    onChange={(e) => setIncludeMistakeRecall(e.target.checked)}
                    disabled={isGenerating}
                  />
                  <Flame size={13} />
                  <span>自動混入錯題本改編回馬槍（{effectiveSubject} 未攻克 {subjectActiveMistakes.length} 題）</span>
                </label>
                <label className="arena-gen-check-row">
                  <input
                    type="checkbox"
                    checked={includeLeechRecall}
                    onChange={(e) => setIncludeLeechRecall(e.target.checked)}
                    disabled={isGenerating}
                  />
                  <Zap size={13} />
                  <span>自動納入閃卡頑固卡加強抽考（{effectiveSubject} 頑固卡 {subjectLeechCards.length} 張）</span>
                </label>
              </div>
            </div>

            {/* Reference Picker */}
            <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <label className="setting-label" style={{ margin: 0 }}>
                  3. 本機考古題與參考資料（已選 {selectedRefPaths.length} 份）
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showAllRefs}
                    onChange={(e) => setShowAllRefs(e.target.checked)}
                    disabled={isGenerating}
                  />
                  顯示全部工作區參考檔 ({workspaceRefFiles.length})
                </label>
              </div>

              {(showAllRefs || workspaceRefFiles.length > 8) && (
                <input
                  type="text"
                  className="form-control"
                  style={{ height: '30px', fontSize: '0.76rem' }}
                  placeholder="搜尋參考檔名或路徑（例：OCR、Tree、OS）..."
                  value={refSearch}
                  onChange={(e) => setRefSearch(e.target.value)}
                  disabled={isGenerating}
                />
              )}

              <div className="ai-ref-picker-list" style={{ maxHeight: '145px' }}>
                {visibleRefFiles.length === 0 ? (
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', padding: '8px 4px', textAlign: 'center' }}>
                    此科目尚無預選參考檔（可勾選「顯示全部」或直接依 AI 知識庫出題）。
                  </div>
                ) : (
                  visibleRefFiles.map((f) => {
                    const checked = selectedRefPaths.includes(f.path);
                    return (
                      <label key={f.path} className={`ai-ref-row ${checked ? 'selected' : ''}`} title={f.path}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRefPath(f.path)}
                          disabled={isGenerating}
                          style={{ accentColor: 'var(--accent-primary)' }}
                        />
                        <FileText size={13} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />
                        <span className="ai-ref-title">{f.name}</span>
                        <span className="badge-chip badge-blue" style={{ fontSize: '0.64rem' }}>{f.group}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Extra Prompt */}
            <div>
              <label className="setting-label">補充出題要求（選填）</label>
              <textarea
                className="form-control"
                rows={2}
                value={extraInstructions}
                onChange={(e) => setExtraInstructions(e.target.value)}
                disabled={isGenerating}
                placeholder="例：多考重積分極座標變換與冪級數端點檢驗，避開純送分題..."
              />
            </div>

            {/* Trigger Button */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              {isGenerating ? (
                <button
                  type="button"
                  className="btn"
                  style={{ flex: 1, background: 'var(--accent-danger)', color: '#fff', border: 'none', padding: '0.65rem 1rem' }}
                  onClick={handleStop}
                >
                  <Square size={15} /> 停止生成（已耗時 {elapsedSec} 秒）
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.68rem 1rem' }}
                  onClick={handleGenerate}
                >
                  <Play size={15} /> 開始 AI 生成互動考卷
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Live Progress & Structured Exam Preview */}
          <div className="ai-studio-output-col">
            <div className="ai-studio-output-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexWrap: 'wrap' }}>
                <Cpu size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {statusText || (parsedExam ? '試卷結構已通過驗證，可直接存檔開考' : '設定左側科目與參考檔後點擊「開始 AI 生成互動考卷」')}
                </span>
                {usageInfo?.total_tokens > 0 && (
                  <span className="badge-chip" style={{ background: 'var(--bg-panel)', fontSize: '0.68rem' }}>
                    {usageInfo.total_tokens.toLocaleString()} tokens
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <button
                  type="button"
                  className={`arena-pill-btn ${rightView === 'preview' ? 'active' : ''}`}
                  onClick={() => setRightView('preview')}
                  disabled={!parsedExam && !isGenerating}
                >
                  <Eye size={12} /> 試卷預覽
                </button>
                <button
                  type="button"
                  className={`arena-pill-btn ${rightView === 'raw' ? 'active' : ''}`}
                  onClick={() => setRightView('raw')}
                >
                  <Code size={12} /> JSON 原始碼
                </button>
                {rightView === 'raw' && rawOutput.trim() && !isGenerating && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => tryParseRawOutput(rawOutput)}
                  >
                    <RefreshCw size={12} /> 重新解析
                  </button>
                )}
              </div>
            </div>

            {(genError || parseError) && (
              <div className="arena-gen-error-bar">
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{genError || parseError}</span>
              </div>
            )}

            <div className="ai-studio-output-body">
              {isGenerating ? (
                <div className="arena-gen-streaming-view">
                  <div className="arena-gen-pulse-head">
                    <RefreshCw size={18} className="spin" />
                    <div>
                      <strong>{statusText || '正在命製互動試卷並驗算解答...'}</strong>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        已耗時 {elapsedSec} 秒 · 已接收 {rawOutput.length.toLocaleString()} 字元（含詳解與 LaTeX 公式，通常需 25–75 秒）
                      </div>
                    </div>
                  </div>
                  {rawOutput && (
                    <pre className="arena-gen-stream-pre">
                      {rawOutput.slice(-2600)}
                    </pre>
                  )}
                </div>
              ) : rightView === 'raw' ? (
                <textarea
                  className="viewer-code-textarea"
                  value={rawOutput}
                  onChange={(e) => setRawOutput(e.target.value)}
                  spellCheck={false}
                  placeholder="AI 輸出的 .exam.json 原始碼會顯示在此，若發生格式問題可直接微調後點擊上方「重新解析」。"
                />
              ) : parsedExam ? (
                <div className="arena-gen-preview">
                  <div className="arena-gen-preview-hero">
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span className="arena-subj-tag">{parsedExam.subject}</span>
                      <span className="arena-mode-tag">{MODE_LABELS[parsedExam.mode] || parsedExam.mode}</span>
                      {recallPreviewCount > 0 && (
                        <span className="arena-chip recall"><RotateCcw size={11} /> {recallPreviewCount} 題回馬槍</span>
                      )}
                    </div>
                    <h3>{parsedExam.title}</h3>
                    <p>{parsedExam.instructions}</p>
                    <div className="arena-exam-card-stats" style={{ marginTop: '8px' }}>
                      <span><BookOpen size={13} /> 共 {parsedExam.questions.length} 題 · {parsedExam.totalPoints} 分</span>
                      <span><Clock size={13} /> {parsedExam.timeLimitMinutes} 分鐘</span>
                      <span><Award size={13} /> 目標 {parsedExam.targetScore}+</span>
                      {parsedExam.passages?.length > 0 && (
                        <span>📖 含 {parsedExam.passages.length} 篇閱讀文章</span>
                      )}
                    </div>
                  </div>

                  <div className="arena-gen-preview-note">
                    為維持實戰盲測效果，此預覽已自動隱藏解答與陷阱提示；正式交卷後才會解鎖完整詳解。
                  </div>

                  <div className="arena-gen-q-list">
                    {parsedExam.questions.map((q) => (
                      <div key={q.id} className="arena-gen-q-item">
                        <div className="arena-q-badges" style={{ marginBottom: '6px' }}>
                          <span className="arena-q-num">Q{q.number}</span>
                          <span className="arena-chip">
                            {q.type === 'mcq' ? `單選 (${q.options.length}選1)` : q.type === 'fill' ? '填充題' : '計算／證明'}
                          </span>
                          <span className="arena-chip">{q.points} 分</span>
                          <span className="arena-chip muted">{q.chapter}</span>
                          {q.isSpacedRecall && <span className="arena-chip recall">🔁 回馬槍</span>}
                        </div>
                        <div
                          className="arena-markdown markdown-body"
                          style={{ fontSize: '0.86rem' }}
                          dangerouslySetInnerHTML={{ __html: renderMarkdownWithKatex(q.prompt) }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                  <Sparkles size={40} style={{ color: 'var(--accent-primary)', opacity: 0.45, marginBottom: '0.85rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                    一鍵生成可互動計時作答的模擬試卷
                  </div>
                  <div style={{ fontSize: '0.82rem', maxWidth: '440px', lineHeight: 1.65 }}>
                    選擇科目與出題策略後，系統會自動讀取本機歷屆考古 OCR 快取、90+ 命題手冊與你的記憶衰減章節，生成完同步輸出 <code>.exam.json</code>、空白考卷 <code>.md</code> 與詳解 <code>.md</code>。
                  </div>
                </div>
              )}
            </div>

            {/* Footer Save & Start Actions */}
            <div className="ai-studio-output-footer">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {savedRecord ? (
                  <>
                    <CheckCircle2 size={15} style={{ color: 'var(--accent-emerald)' }} />
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                      已寫入 {savedRecord.paths.jsonPath}（並同步產出考卷／詳解 MD）
                    </span>
                  </>
                ) : parsedExam ? (
                  <span>
                    結構驗證通過：{parsedExam.questions.length} 題 · 總分 {parsedExam.totalPoints} 分（儲存時同步寫出 3 份檔案並上雲）
                  </span>
                ) : (
                  <span>桌面端預設走本機 Antigravity CLI（免 API Key）；網頁端支援 Gemini / OpenAI API</span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {parsedExam && !savedRecord && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => saveExamFiles({ startImmediately: false })}
                    disabled={isGenerating || isSaving}
                  >
                    <Save size={14} /> {isSaving ? '儲存中...' : '僅存入試卷庫'}
                  </button>
                )}

                {savedRecord ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      onClose();
                      onStartExam?.(savedRecord.entry.data, savedRecord.entry.relativePath);
                    }}
                  >
                    <Rocket size={14} /> 立即開始計時作答
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => saveExamFiles({ startImmediately: true })}
                    disabled={isGenerating || isSaving || !parsedExam}
                  >
                    <Rocket size={14} /> {isSaving ? '寫入並同步中...' : '儲存並立即開考'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
