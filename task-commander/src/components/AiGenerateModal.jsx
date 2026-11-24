import { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Sparkles,
  FileCheck,
  BookOpen,
  Code,
  Wand2,
  Play,
  Square,
  Save,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Settings,
  Cpu,
  RefreshCw,
  FileText,
  ExternalLink,
} from 'lucide-react';
import SlidingContainer from './SlidingContainer';
import mermaid from 'mermaid';
import { renderMarkdownWithKatex } from '../utils/markdownRenderer';
import {
  loadAiConfig,
  saveAiConfig,
  buildAiPrompt,
  streamAiGeneration,
  cleanGeneratedHtmlOutput,
  splitExamAndSolution,
  GEMINI_API_MODEL_PRESETS,
} from '../services/aiService';
import {
  fetchCloudAssetText,
  uploadTextAssetToCloud,
} from '../services/cloudAssetService';
import { pushCloudDoc, SYNC_KEYS } from '../services/cloudSyncService';
import { getResolvedCloudConfig } from '../services/supabaseClient';

const QUESTION_TYPE_OPTIONS = [
  '單選題',
  '多選題',
  '填充題',
  '簡答／申論題',
  '計算／證明題',
];

const DIFFICULTY_OPTIONS = [
  '基礎觀念檢核',
  '學校期中期末',
  '轉學考・研究所進階',
];

export default function AiGenerateModal({
  isOpen,
  onClose,
  deliverables = [],
  existingCourses = [],
  initialCategory = null,
  initialCourse = null,
  onSavedDeliverables,
  onPreviewFile,
  onOpenSettings,
  onRequireUnlock,
}) {
  const isElectron = Boolean(window.electronAPI?.isElectron);
  const cloudConfigured = getResolvedCloudConfig().configured;

  // AI Engine Config & live agy model discovery
  const [aiConfig, setAiConfig] = useState(() => loadAiConfig());
  const [agyInfo, setAgyInfo] = useState({ checked: false, available: false, models: [], error: '' });
  const [checkingAgy, setCheckingAgy] = useState(false);

  // Mode & Prompt Config
  const [mode, setMode] = useState(() => (initialCategory === 'Test_Bank' ? 'exam' : 'exam'));
  const [subject, setSubject] = useState(() => initialCourse || existingCourses[0] || '資料結構');
  const [topic, setTopic] = useState('');
  const [questionTypes, setQuestionTypes] = useState(['單選題', '計算／證明題']);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('學校期中期末');
  const [outputLayout, setOutputLayout] = useState('split'); // 'split' | 'combined'
  const [notesOptions, setNotesOptions] = useState({
    includeMermaid: true,
    includeFormulas: true,
    includeTables: true,
    includePractice: true,
  });
  const [customFormat, setCustomFormat] = useState('md');
  const [extraInstructions, setExtraInstructions] = useState('');

  // Reference Materials Picker
  const [showAllSubjectRefs, setShowAllSubjectRefs] = useState(false);
  const [selectedRefPaths, setSelectedRefPaths] = useState([]);

  // Streaming & Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [generatedText, setGeneratedText] = useState('');
  const [usageInfo, setUsageInfo] = useState(null);
  const [genError, setGenError] = useState('');
  const [outputViewMode, setOutputViewMode] = useState('preview'); // 'preview' | 'raw'
  const [splitPreviewTab, setSplitPreviewTab] = useState('exam'); // 'exam' | 'solution'
  const [isSaving, setIsSaving] = useState(false);
  const [savedItems, setSavedItems] = useState([]);

  const abortCtrlRef = useRef(null);
  const elapsedTimerRef = useRef(null);
  const outputEndRef = useRef(null);
  const previewBodyRef = useRef(null);

  const checkAgy = async () => {
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
          const hasCurrent = res.models.some((m) => m.id === prev.agyModel);
          if (hasCurrent) return prev;
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
  };

  useEffect(() => {
    if (!isOpen) return;
    setAiConfig(loadAiConfig());
    if (isElectron) checkAgy();
    return () => {
      if (abortCtrlRef.current) abortCtrlRef.current.abort();
      if (elapsedTimerRef.current) window.clearInterval(elapsedTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !isGenerating && !isSaving) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isGenerating, isSaving, onClose]);

  const candidateRefItems = useMemo(() => {
    const readableExts = new Set(['md', 'txt', 'html', 'htm', 'json']);
    return (deliverables || []).filter((d) => {
      const ext = String(d.format || d.path?.split('.').pop() || '').toLowerCase();
      if (!readableExts.has(ext)) return false;
      if (showAllSubjectRefs) return true;
      return d.course === subject;
    });
  }, [deliverables, subject, showAllSubjectRefs]);

  const toggleRefPath = (path) => {
    setSelectedRefPaths((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const toggleQuestionType = (qt) => {
    setQuestionTypes((prev) => {
      if (prev.includes(qt)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== qt);
      }
      return [...prev, qt];
    });
  };

  const updateEngine = (patch) => {
    setAiConfig((prev) => {
      const next = { ...prev, ...patch };
      saveAiConfig(next);
      return next;
    });
  };

  const loadReferenceFileTexts = async () => {
    const results = [];
    for (const refPath of selectedRefPaths) {
      const meta = (deliverables || []).find((d) => d.path === refPath);
      let content = '';
      if (isElectron && window.electronAPI?.readFileContent) {
        const res = await window.electronAPI.readFileContent(refPath);
        if (res?.success) content = res.content;
      }
      if (!content) {
        const cloudRes = await fetchCloudAssetText(refPath);
        if (cloudRes?.success) content = cloudRes.content;
      }
      if (content) {
        results.push({ title: meta?.title || refPath, path: refPath, content });
      }
    }
    return results;
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    setGenError('');
    setSavedItems([]);
    setGeneratedText('');
    setUsageInfo(null);
    setElapsedSec(0);
    setIsGenerating(true);

    const startedAt = Date.now();
    elapsedTimerRef.current = window.setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    }, 500);

    const ctrl = new AbortController();
    abortCtrlRef.current = ctrl;

    try {
      setStatusText(selectedRefPaths.length > 0 ? `正在讀取 ${selectedRefPaths.length} 份參考教材...` : '正在組合命題／整理指令...');
      const refTexts = await loadReferenceFileTexts();

      const { systemPrompt, userPrompt } = buildAiPrompt({
        mode,
        subject,
        topic: topic.trim(),
        examOptions: { questionTypes, questionCount, difficulty, outputLayout },
        notesOptions,
        customFormat,
        referenceFiles: refTexts,
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
          setGeneratedText(full);
        },
      });

      const finalOutput = res?.text || '';
      setGeneratedText(finalOutput);
      setUsageInfo(res?.usage || null);
      setStatusText(`生成完成（${res?.model || ''} · ${Math.max(1, Math.round((Date.now() - startedAt) / 1000))} 秒）`);
    } catch (err) {
      if (err?.name === 'AbortError') {
        setStatusText('已停止生成');
      } else {
        setGenError(err?.message || 'AI 生成發生錯誤');
        setStatusText('');
      }
    } finally {
      if (elapsedTimerRef.current) {
        window.clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
      abortCtrlRef.current = null;
      setIsGenerating(false);
    }
  };

  const handleStopGenerate = () => {
    if (abortCtrlRef.current) {
      abortCtrlRef.current.abort();
    }
  };

  const isHtmlOutput = mode === 'recitation' || (mode === 'custom' && customFormat === 'html');
  const splitParsed = useMemo(() => {
    if (mode !== 'exam' || outputLayout !== 'split') {
      return { isSplit: false, examText: generatedText, solutionText: '' };
    }
    return splitExamAndSolution(generatedText);
  }, [mode, outputLayout, generatedText]);

  const previewMarkdownHtml = useMemo(() => {
    if (isHtmlOutput || !generatedText) return '';
    const text = splitParsed.isSplit
      ? (splitPreviewTab === 'solution' ? splitParsed.solutionText : splitParsed.examText)
      : generatedText;
    try {
      return renderMarkdownWithKatex(text);
    } catch {
      return `<pre>${text}</pre>`;
    }
  }, [isHtmlOutput, generatedText, splitParsed, splitPreviewTab]);

  useEffect(() => {
    if (isGenerating || isHtmlOutput || outputViewMode !== 'preview' || !previewBodyRef.current) return undefined;
    const cards = previewBodyRef.current.querySelectorAll('.mermaid-diagram-card');
    if (cards.length === 0) return undefined;
    let cancelled = false;
    (async () => {
      for (let i = 0; i < cards.length; i++) {
        if (cancelled) break;
        const card = cards[i];
        const rawDiv = card.querySelector('.mermaid-raw');
        const area = card.querySelector('.mermaid-render-area');
        if (!rawDiv || !area) continue;
        try {
          const code = decodeURIComponent(rawDiv.textContent);
          const { svg, bindFunctions } = await mermaid.render(`ai-mermaid-${Date.now()}-${i}`, code);
          if (!cancelled && area) {
            area.innerHTML = svg;
            if (bindFunctions) bindFunctions(area);
          }
        } catch (err) {
          if (!cancelled && area) {
            area.innerHTML = `<div class="mermaid-error">⚠️ 圖表解析異常：${err.message || '語法錯誤'}</div>`;
          }
        }
      }
    })();
    return () => { cancelled = true; };
  }, [isGenerating, isHtmlOutput, outputViewMode, previewMarkdownHtml]);

  const handleSaveToVault = async () => {
    if (!generatedText.trim() || isSaving) return;
    setIsSaving(true);
    setGenError('');

    try {
      const today = new Date().toISOString().slice(0, 10);
      const stamp = new Date().toISOString().slice(11, 16).replace(':', '');
      const safeCourse = (subject || '未分類科目').trim().replace(/[\\/:*?"<>|]/g, '_');
      const baseTitle = topic.trim() || (
        mode === 'exam' ? `${subject} AI 模擬考卷`
          : mode === 'notes' ? `${subject} AI 重點整理`
            : mode === 'recitation' ? `${subject} AI 互動背誦卡`
              : `${subject} AI 自訂成果`
      );
      const safeBase = baseTitle.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_').slice(0, 52);

      const filesToCreate = [];

      if (mode === 'exam' && splitParsed.isSplit) {
        filesToCreate.push({
          title: `${baseTitle}（模擬試卷）`,
          relPath: `Test_Bank/${safeCourse}/${safeBase}_${today}_${stamp}_考卷.md`,
          content: splitParsed.examText,
          category: 'Test_Bank',
          type: 'exam',
          format: 'md',
          summary: `由 AI（${aiConfig.engine === 'agy' ? aiConfig.agyModel : aiConfig.engine === 'gemini' ? aiConfig.geminiModel : aiConfig.openaiModel}）依 ${selectedRefPaths.length} 份參考教材生成之${difficulty}模擬試卷（${questionCount} 題）。`,
          tags: ['AI生成', '模擬考卷', subject],
        });
        filesToCreate.push({
          title: `${baseTitle}（完整詳解）`,
          relPath: `Test_Bank/${safeCourse}/${safeBase}_${today}_${stamp}_詳解.md`,
          content: splitParsed.solutionText,
          category: 'Test_Bank',
          type: 'exam',
          format: 'md',
          summary: `對應「${baseTitle}」之逐題詳解與考點解析。`,
          tags: ['AI生成', '詳解', subject],
        });
      } else {
        const ext = isHtmlOutput ? 'html' : 'md';
        const finalContent = isHtmlOutput ? cleanGeneratedHtmlOutput(generatedText) : generatedText.trim();
        const targetCategory = mode === 'exam' ? 'Test_Bank' : 'Study_Materials';
        const targetType = mode === 'exam' ? 'exam' : mode === 'recitation' ? 'recitation' : 'notes';

        filesToCreate.push({
          title: baseTitle,
          relPath: `${targetCategory}/${safeCourse}/${safeBase}_${today}_${stamp}.${ext}`,
          content: finalContent,
          category: targetCategory,
          type: targetType,
          format: ext,
          summary: `由 AI（${aiConfig.engine === 'agy' ? aiConfig.agyModel : aiConfig.engine === 'gemini' ? aiConfig.geminiModel : aiConfig.openaiModel}）於成果庫直接生成。`,
          tags: ['AI生成', mode === 'exam' ? '模擬題' : mode === 'recitation' ? '背誦卡' : '重點教材', subject],
        });
      }

      const createdDeliverables = [];

      for (const f of filesToCreate) {
        if (isElectron && window.electronAPI?.writeFileContent) {
          const writeRes = await window.electronAPI.writeFileContent({
            relativePath: f.relPath,
            content: f.content,
          });
          if (!writeRes?.success) {
            throw new Error(writeRes?.error || `寫入本機檔案 ${f.relPath} 失敗`);
          }
          window.electronAPI?.syncCloudAssets?.({ singleFile: f.relPath }).catch(() => {});
        } else if (cloudConfigured) {
          const upRes = await uploadTextAssetToCloud(
            f.content,
            f.relPath,
            (nextManifest) => pushCloudDoc(SYNC_KEYS.ASSET_MANIFEST, nextManifest, { immediate: true })
          );
          if (!upRes?.success) {
            if (upRes?.authRequired) onRequireUnlock?.();
            throw new Error(upRes?.error || '上傳至雲端失敗（請先解鎖雲端寫入權限）');
          }
        } else {
          throw new Error('未設定雲端連線且非桌面版，無法儲存生成檔案');
        }

        createdDeliverables.push({
          id: `del-ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: f.title,
          course: subject,
          category: f.category,
          type: f.type,
          path: f.relPath,
          format: f.format,
          certified: true,
          updatedAt: today,
          summary: f.summary,
          tags: f.tags,
          _initialContent: f.content,
        });
      }

      const cleanForStore = createdDeliverables.map(({ _initialContent, ...rest }) => rest);
      await onSavedDeliverables?.(cleanForStore);
      setSavedItems(createdDeliverables);
      setStatusText(`已成功儲存 ${createdDeliverables.length} 份成果並收錄至 AI 成果庫！`);
    } catch (err) {
      setGenError(err?.message || '儲存成果失敗');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="viewer-modal-overlay">
      <div className="viewer-modal-container fullscreen ai-studio-modal">
        {/* Top Header */}
        <div className="viewer-toolbar" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div className="vault-icon-badge" style={{ width: 36, height: 36, background: 'var(--accent-gradient)', color: '#fff' }}>
              <Sparkles size={19} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.04rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>AI 成果庫智慧生成工作室</span>
                <span className="badge-chip badge-purple" style={{ fontSize: '0.7rem' }}>
                  {aiConfig.engine === 'agy'
                    ? `本機 AGY · ${aiConfig.agyModel}`
                    : aiConfig.engine === 'gemini'
                      ? `Gemini API · ${aiConfig.geminiModel}`
                      : `OpenAI/Ollama · ${aiConfig.openaiModel}`}
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                讀取科目現有教材 → 一鍵生成模擬試卷、重點整理或互動背誦卡 → 自動入庫並同步雲端
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Quick Engine & Model Selector */}
            <select
              className="form-control"
              style={{ width: 'auto', height: '32px', padding: '0 10px', fontSize: '0.78rem' }}
              value={aiConfig.engine}
              onChange={(e) => updateEngine({ engine: e.target.value })}
              disabled={isGenerating}
              title="切換 AI 引擎"
            >
              {isElectron && <option value="agy">⚡ 本機 Antigravity CLI (Neon / Carbon)</option>}
              <option value="gemini">🌐 Google Gemini API</option>
              <option value="openai">🔌 OpenAI 相容 / 本機 Ollama</option>
            </select>

            {aiConfig.engine === 'agy' && isElectron && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <select
                  className="form-control"
                  style={{ width: 'auto', maxWidth: '220px', height: '32px', padding: '0 10px', fontSize: '0.78rem' }}
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
                  title="重新偵測本機 agy 可用模型"
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
                title="前往系統設定管理 API Key 與模型端點"
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

        {/* 4-in-1 Mode Tabs */}
        <div className="ai-studio-mode-bar">
          <SlidingContainer
            className="nav-pills"
            activeKey={mode}
            indicatorClassName="sliding-pill-indicator pill-slider"
            style={{ padding: '3px', flexWrap: 'wrap' }}
          >
            <button type="button" className={`nav-pill-btn ${mode === 'exam' ? 'active' : ''}`} onClick={() => setMode('exam')} disabled={isGenerating}>
              <FileCheck size={14} /> 模擬考卷＋詳解
            </button>
            <button type="button" className={`nav-pill-btn ${mode === 'notes' ? 'active' : ''}`} onClick={() => setMode('notes')} disabled={isGenerating}>
              <BookOpen size={14} /> 整理重點教材
            </button>
            <button type="button" className={`nav-pill-btn ${mode === 'recitation' ? 'active' : ''}`} onClick={() => setMode('recitation')} disabled={isGenerating}>
              <Code size={14} /> 互動背誦卡 (HTML)
            </button>
            <button type="button" className={`nav-pill-btn ${mode === 'custom' ? 'active' : ''}`} onClick={() => setMode('custom')} disabled={isGenerating}>
              <Wand2 size={14} /> 自由指令生成
            </button>
          </SlidingContainer>

          {aiConfig.engine === 'agy' && agyInfo.checked && !agyInfo.available && (
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-danger)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={13} /> 偵測不到本機 agy CLI（{agyInfo.error || '請確認已安裝並登入 agy'}），可切換至 Gemini API
            </span>
          )}
        </div>

        {/* Main 2-Column Studio Body */}
        <div className="ai-studio-grid">
          {/* LEFT: Configuration & Reference Picker */}
          <div className="ai-studio-config-col">
            <div className="setting-grid-2">
              <div>
                <label className="setting-label">目標科目</label>
                <select
                  className="form-control"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setSelectedRefPaths([]);
                  }}
                  disabled={isGenerating}
                >
                  {existingCourses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  {!existingCourses.includes(subject) && subject && (
                    <option value={subject}>{subject}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="setting-label">主題／章節名稱</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={mode === 'exam' ? '例：Ch6 CPU排程與死結 模擬考' : '例：樹狀結構與AVL旋轉重點'}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
            </div>

            {/* Mode-Specific Controls */}
            {mode === 'exam' && (
              <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label className="setting-label">題型配置（可複選）</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {QUESTION_TYPE_OPTIONS.map((qt) => {
                      const active = questionTypes.includes(qt);
                      return (
                        <button
                          key={qt}
                          type="button"
                          className={`btn btn-xs ${active ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => toggleQuestionType(qt)}
                          disabled={isGenerating}
                        >
                          {qt}
                        </button>
                      );
                    })}
                  </div>
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
                      <option value={5}>5 題（快速小考）</option>
                      <option value={10}>10 題（標準單元考）</option>
                      <option value={15}>15 題（完整期中/期末）</option>
                      <option value={20}>20 題（魔鬼衝刺卷）</option>
                    </select>
                  </div>
                  <div>
                    <label className="setting-label">難度定位</label>
                    <select
                      className="form-control"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      disabled={isGenerating}
                    >
                      {DIFFICULTY_OPTIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="setting-label">輸出檔案形式</label>
                  <SlidingContainer
                    className="nav-pills"
                    activeKey={outputLayout}
                    indicatorClassName="sliding-pill-indicator pill-slider"
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '3px', gap: '4px' }}
                  >
                    <button
                      type="button"
                      className={`nav-pill-btn ${outputLayout === 'split' ? 'active' : ''}`}
                      onClick={() => setOutputLayout('split')}
                      disabled={isGenerating}
                      style={{ justifyContent: 'center', fontSize: '0.76rem', padding: '0.38rem' }}
                    >
                      分開存成「題目卷 + 詳解卷」
                    </button>
                    <button
                      type="button"
                      className={`nav-pill-btn ${outputLayout === 'combined' ? 'active' : ''}`}
                      onClick={() => setOutputLayout('combined')}
                      disabled={isGenerating}
                      style={{ justifyContent: 'center', fontSize: '0.76rem', padding: '0.38rem' }}
                    >
                      合卷（含折疊隱藏詳解）
                    </button>
                  </SlidingContainer>
                </div>
              </div>
            )}

            {mode === 'notes' && (
              <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <label className="setting-label" style={{ marginBottom: 2 }}>教材結構要素</label>
                {[
                  { key: 'includeMermaid', label: '開頭繪製 Mermaid 知識架構樹 (Tree Diagram)' },
                  { key: 'includeFormulas', label: '重要定理與 KaTeX 數學公式推導' },
                  { key: 'includeTables', label: '必考觀念對照表與常見考場陷阱' },
                  { key: 'includePractice', label: '文末附 3~5 題隨堂檢核練習（含折疊詳解）' },
                ].map((opt) => (
                  <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(notesOptions[opt.key])}
                      onChange={(e) => setNotesOptions((p) => ({ ...p, [opt.key]: e.target.checked }))}
                      disabled={isGenerating}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {mode === 'recitation' && (
              <div className="setting-box">
                <label className="setting-label">互動背誦卡數量</label>
                <select
                  className="form-control"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  disabled={isGenerating}
                >
                  <option value={10}>10 張核心卡片</option>
                  <option value={15}>15 張重點速記卡</option>
                  <option value={20}>20 張完整章節卡</option>
                  <option value={30}>30 張考前全掃描卡</option>
                </select>
              </div>
            )}

            {mode === 'custom' && (
              <div className="setting-box">
                <label className="setting-label">產出格式</label>
                <SlidingContainer
                  className="nav-pills"
                  activeKey={customFormat}
                  indicatorClassName="sliding-pill-indicator pill-slider"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '3px', gap: '4px' }}
                >
                  <button
                    type="button"
                    className={`nav-pill-btn ${customFormat === 'md' ? 'active' : ''}`}
                    onClick={() => setCustomFormat('md')}
                    disabled={isGenerating}
                    style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '0.38rem' }}
                  >
                    Markdown 文件 (.md)
                  </button>
                  <button
                    type="button"
                    className={`nav-pill-btn ${customFormat === 'html' ? 'active' : ''}`}
                    onClick={() => setCustomFormat('html')}
                    disabled={isGenerating}
                    style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '0.38rem' }}
                  >
                    獨立互動網頁 (.html)
                  </button>
                </SlidingContainer>
              </div>
            )}

            {/* Reference Materials Picker */}
            <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                <label className="setting-label" style={{ margin: 0 }}>
                  參考教材範圍（已選 {selectedRefPaths.length} 份）
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showAllSubjectRefs}
                    onChange={(e) => setShowAllSubjectRefs(e.target.checked)}
                    disabled={isGenerating}
                  />
                  顯示全部科目
                </label>
              </div>

              <div className="ai-ref-picker-list">
                {candidateRefItems.length === 0 ? (
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', padding: '8px 4px', textAlign: 'center' }}>
                    此科目目前無可讀取的 MD / HTML / TXT 參考檔，AI 將直接依主題與補充要求出題。
                  </div>
                ) : (
                  candidateRefItems.map((item) => {
                    const checked = selectedRefPaths.includes(item.path);
                    return (
                      <label key={item.id || item.path} className={`ai-ref-row ${checked ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRefPath(item.path)}
                          disabled={isGenerating}
                          style={{ accentColor: 'var(--accent-primary)' }}
                        />
                        <FileText size={13} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />
                        <span className="ai-ref-title" title={item.title}>{item.title}</span>
                        {showAllSubjectRefs && (
                          <span className="badge-chip badge-blue" style={{ fontSize: '0.65rem' }}>{item.course}</span>
                        )}
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Extra Prompt / Syllabus */}
            <div>
              <label className="setting-label">
                {mode === 'custom' ? '自由指令內容 *' : '補充考綱、弱點方向或貼上重點（選填）'}
              </label>
              <textarea
                className="form-control"
                rows={3}
                value={extraInstructions}
                onChange={(e) => setExtraInstructions(e.target.value)}
                disabled={isGenerating}
                placeholder={
                  mode === 'custom'
                    ? '例：幫我整理 B-Tree 與 B+ Tree 的插入/刪除差異對照表，並出 3 題轉學考等級的追蹤題...'
                    : '例：多考 Bankers Algorithm 安全性檢查與計算題，避開已經很熟的基本定義題...'
                }
              />
            </div>

            {/* Generate / Stop Button */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              {isGenerating ? (
                <button
                  type="button"
                  className="btn"
                  style={{ flex: 1, background: 'var(--accent-danger)', color: '#fff', border: 'none' }}
                  onClick={handleStopGenerate}
                >
                  <Square size={15} /> 停止生成（已進行 {elapsedSec} 秒）
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.65rem 1rem' }}
                  onClick={handleGenerate}
                  disabled={mode === 'custom' && !extraInstructions.trim() && !topic.trim()}
                >
                  <Play size={15} /> 開始 AI 智慧生成
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Live Streaming Preview & Save Column */}
          <div className="ai-studio-output-col">
            <div className="ai-studio-output-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexWrap: 'wrap' }}>
                <Cpu size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {statusText || (generatedText ? '已就緒，可檢視微調後一鍵存檔入庫' : '設定左側條件後點擊「開始 AI 智慧生成」')}
                </span>
                {usageInfo?.total_tokens > 0 && (
                  <span className="badge-chip" style={{ background: 'var(--bg-panel)', fontSize: '0.68rem' }}>
                    {usageInfo.total_tokens.toLocaleString()} tokens
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {splitParsed.isSplit && outputViewMode === 'preview' && (
                  <SlidingContainer
                    className="nav-pills"
                    activeKey={splitPreviewTab}
                    indicatorClassName="sliding-pill-indicator pill-slider"
                    style={{ padding: '2px' }}
                  >
                    <button
                      type="button"
                      className={`nav-pill-btn ${splitPreviewTab === 'exam' ? 'active' : ''}`}
                      onClick={() => setSplitPreviewTab('exam')}
                      style={{ fontSize: '0.72rem', padding: '0.24rem 0.55rem' }}
                    >
                      題目卷
                    </button>
                    <button
                      type="button"
                      className={`nav-pill-btn ${splitPreviewTab === 'solution' ? 'active' : ''}`}
                      onClick={() => setSplitPreviewTab('solution')}
                      style={{ fontSize: '0.72rem', padding: '0.24rem 0.55rem' }}
                    >
                      詳解卷
                    </button>
                  </SlidingContainer>
                )}

                <SlidingContainer
                  className="nav-pills"
                  activeKey={outputViewMode}
                  indicatorClassName="sliding-pill-indicator pill-slider"
                  style={{ padding: '2px' }}
                >
                  <button
                    type="button"
                    className={`nav-pill-btn ${outputViewMode === 'preview' ? 'active' : ''}`}
                    onClick={() => setOutputViewMode('preview')}
                    style={{ fontSize: '0.72rem', padding: '0.24rem 0.6rem' }}
                  >
                    <Eye size={12} /> 預覽
                  </button>
                  <button
                    type="button"
                    className={`nav-pill-btn ${outputViewMode === 'raw' ? 'active' : ''}`}
                    onClick={() => setOutputViewMode('raw')}
                    style={{ fontSize: '0.72rem', padding: '0.24rem 0.6rem' }}
                  >
                    <Edit3 size={12} /> 原始碼
                  </button>
                </SlidingContainer>
              </div>
            </div>

            {genError && (
              <div style={{ padding: '10px 14px', background: 'rgba(225, 29, 72, 0.1)', borderBottom: '1px solid rgba(225, 29, 72, 0.25)', color: 'var(--accent-danger)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{genError}</span>
              </div>
            )}

            <div className="ai-studio-output-body">
              {!generatedText && !isGenerating ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                  <Sparkles size={40} style={{ color: 'var(--accent-primary)', opacity: 0.45, marginBottom: '0.85rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                    準備就緒：直接在此生成考卷、教材與互動背誦卡
                  </div>
                  <div style={{ fontSize: '0.82rem', maxWidth: '420px', lineHeight: 1.6 }}>
                    桌面端可直接透過本機 Antigravity CLI 呼叫 <strong>Gemini 4 Neon / Carbon</strong> 或 <strong>Claude 5.5</strong>；網頁端亦可透過 Gemini API 或 OpenAI 相容端點即時串流生成。
                  </div>
                </div>
              ) : outputViewMode === 'raw' ? (
                <textarea
                  className="viewer-code-textarea"
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  readOnly={isGenerating}
                  spellCheck={false}
                />
              ) : isHtmlOutput ? (
                isGenerating ? (
                  <pre style={{ padding: '1rem 1.25rem', margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.8rem', fontFamily: 'Consolas, monospace', color: 'var(--text-muted)' }}>
                    {generatedText}
                  </pre>
                ) : (
                  <iframe
                    title="AI 生成互動網頁預覽"
                    className="viewer-iframe"
                    style={{ borderRadius: 0 }}
                    srcDoc={cleanGeneratedHtmlOutput(generatedText)}
                    sandbox="allow-scripts allow-same-origin"
                  />
                )
              ) : (
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <div
                    ref={previewBodyRef}
                    className="markdown-body"
                    dangerouslySetInnerHTML={{ __html: previewMarkdownHtml }}
                  />
                  <div ref={outputEndRef} />
                </div>
              )}
            </div>

            {/* Bottom Save Footer */}
            <div className="ai-studio-output-footer">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {savedItems.length > 0 ? (
                  <>
                    <CheckCircle2 size={15} style={{ color: 'var(--accent-emerald)' }} />
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                      已收錄 {savedItems.length} 份檔案至「{subject}」
                    </span>
                    {savedItems.map((si) => (
                      <button
                        key={si.id}
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => {
                          onClose();
                          onPreviewFile?.({ ...si, initialContent: si._initialContent });
                        }}
                      >
                        <ExternalLink size={12} /> 開啟「{si.title.slice(0, 18)}」
                      </button>
                    ))}
                  </>
                ) : generatedText ? (
                  <span>
                    {splitParsed.isSplit
                      ? '偵測到考卷與詳解分隔標記，儲存時將自動拆成 2 份檔案收錄至 Test_Bank'
                      : `已生成 ${generatedText.length.toLocaleString()} 字元 · 可切至「原始碼」微調後再存檔`}
                  </span>
                ) : (
                  <span>生成後將自動寫入對應科目資料夾並同步至雲端</span>
                )}
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveToVault}
                disabled={isGenerating || isSaving || !generatedText.trim()}
              >
                <Save size={14} /> {isSaving ? '儲存並同步中...' : '儲存並收錄至 AI 成果庫'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
