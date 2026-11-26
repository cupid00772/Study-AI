import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Wand2,
  Play,
  Square,
  RefreshCw,
  Settings,
  Cpu,
  AlertCircle,
  CheckSquare,
  Square as SquareIcon,
  Brain,
  Flame,
  Eye,
  Code,
  Lightbulb,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { renderMarkdownWithKatex } from '../utils/markdownRenderer';
import {
  loadAiConfig,
  saveAiConfig,
  streamAiGeneration,
  GEMINI_API_MODEL_PRESETS,
} from '../services/aiService';
import { getAssetManifest, fetchCloudAssetText } from '../services/cloudAssetService';
import {
  CORE_FLASHCARD_SUBJECTS,
  computeCardFingerprint,
  buildAiFlashcardsPrompt,
  parseAndRepairFlashcardsJson,
} from '../utils/flashcardUtils';
import { useModalA11y } from '../hooks/useModalA11y';

const STYLE_OPTIONS = [
  { id: 'exam_high_yield', label: '高頻考點速記（定義＋口訣＋陷阱）' },
  { id: 'formula_drill', label: '核心公式與邊界檢核快篩' },
  { id: 'vocab_contrast', label: '學術字彙正負向對照與文法陷阱' },
  { id: 'concept_trap', label: '易混觀念比較（A vs B 盲區攻克）' },
];

function PreviewMd({ content }) {
  const html = useMemo(() => renderMarkdownWithKatex(content || ''), [content]);
  return <div className="fc-markdown markdown-body" dangerouslySetInnerHTML={{ __html: html }} />;
}

function isRefRelevant(filePath, subject) {
  const lower = String(filePath || '').toLowerCase();
  if (subject === '微積分') return lower.includes('微積分') || lower.includes('calc');
  if (subject === '計算機概論') return lower.includes('計算機概論') || lower.includes('計概') || lower.includes('資料結構') || lower.includes('作業系統') || lower.includes('cs_review');
  if (subject === '英文') return lower.includes('英文') || lower.includes('english');
  return subject ? lower.includes(subject.toLowerCase()) : false;
}

export default function FlashcardAiModal({
  isOpen,
  onClose,
  initialSubject = '計算機概論',
  availableSubjects = CORE_FLASHCARD_SUBJECTS,
  decayRows = [],
  mistakeBank = [],
  existingCards = [],
  onImportCards,
  onOpenSettings,
}) {
  const isElectron = Boolean(window.electronAPI?.isElectron);

  const [aiConfig, setAiConfig] = useState(() => loadAiConfig());
  const [agyInfo, setAgyInfo] = useState({ checked: false, available: false, models: [], error: '' });
  const [checkingAgy, setCheckingAgy] = useState(false);

  const [subject, setSubject] = useState(initialSubject || '計算機概論');
  const [customSubject, setCustomSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [style, setStyle] = useState(initialSubject === '英文' ? 'vocab_contrast' : 'exam_high_yield');
  const [includeWeakChapters, setIncludeWeakChapters] = useState(true);
  const [includeMistakes, setIncludeMistakes] = useState(true);
  const [extraInstructions, setExtraInstructions] = useState('');

  // Reference files
  const [workspaceRefs, setWorkspaceRefs] = useState([]);
  const [selectedRefPaths, setSelectedRefPaths] = useState([]);
  const [showAllRefs, setShowAllRefs] = useState(false);
  const [refSearch, setRefSearch] = useState('');

  // Streaming & preview state
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [rawOutput, setRawOutput] = useState('');
  const [generatedCards, setGeneratedCards] = useState([]);
  const [checkedIds, setCheckedIds] = useState(() => new Set());
  const [parseError, setParseError] = useState('');
  const [genError, setGenError] = useState('');
  const [rightView, setRightView] = useState('preview'); // 'preview' | 'raw'

  const abortRef = useRef(null);
  const timerRef = useRef(null);

  const effectiveSubject = subject === '__CUSTOM__' ? (customSubject.trim() || '自訂科目') : subject;

  const subjectChoices = useMemo(() => {
    const set = new Set([...CORE_FLASHCARD_SUBJECTS, ...(availableSubjects || [])]);
    return Array.from(set);
  }, [availableSubjects]);

  const existingFpSet = useMemo(
    () => new Set((existingCards || []).map((c) => c.fingerprint || computeCardFingerprint(c.subject, c.front))),
    [existingCards]
  );

  const subjectWeakChapters = useMemo(
    () => (decayRows || []).filter((r) => r.subject === effectiveSubject && (r.isOverdue || r.status?.includes('🔴') || r.status?.includes('🟡'))),
    [decayRows, effectiveSubject]
  );

  const subjectMistakes = useMemo(
    () => (mistakeBank || []).filter((m) => !m.resolved && m.subject === effectiveSubject),
    [mistakeBank, effectiveSubject]
  );

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
    } finally {
      setCheckingAgy(false);
    }
  }, [isElectron]);

  const loadRefs = useCallback(async () => {
    if (isElectron && window.electronAPI?.listArenaReferenceFiles) {
      const res = await window.electronAPI.listArenaReferenceFiles();
      if (res?.success && Array.isArray(res.files)) {
        setWorkspaceRefs(res.files);
        return;
      }
    }
    const manifest = getAssetManifest();
    const files = Object.keys(manifest?.files || {})
      .filter((p) => /\.(md|txt)$/i.test(p) && !p.includes('/archive/'))
      .map((p) => ({ path: p, name: p.split('/').pop() || p, group: p.split('/')[0] || 'Cloud' }))
      .sort((a, b) => a.path.localeCompare(b.path));
    setWorkspaceRefs(files);
  }, [isElectron]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const timer = window.setTimeout(() => {
      if (isElectron) checkAgy();
      loadRefs();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isOpen, isElectron, checkAgy, loadRefs]);

  const { dialogRef } = useModalA11y({ isOpen, onClose, disabled: isGenerating });

  const visibleRefs = useMemo(() => {
    const q = refSearch.trim().toLowerCase();
    return workspaceRefs.filter((f) => {
      if (q) return f.path.toLowerCase().includes(q) || f.name.toLowerCase().includes(q);
      if (showAllRefs) return true;
      return selectedRefPaths.includes(f.path) || isRefRelevant(f.path, effectiveSubject);
    });
  }, [workspaceRefs, refSearch, showAllRefs, selectedRefPaths, effectiveSubject]);

  const updateEngine = (patch) => {
    setAiConfig((prev) => {
      const next = { ...prev, ...patch };
      saveAiConfig(next);
      return next;
    });
  };

  const tryParse = useCallback(
    (text) => {
      try {
        const cards = parseAndRepairFlashcardsJson(text, {
          subject: effectiveSubject,
          topic: topic.trim(),
        });
        setGeneratedCards(cards);
        setCheckedIds(new Set(cards.filter((c) => !existingFpSet.has(c.fingerprint)).map((c) => c.id)));
        setParseError('');
        setRightView('preview');
        return cards;
      } catch (err) {
        setGeneratedCards([]);
        setParseError(err?.message || '閃卡 JSON 解析失敗');
        setRightView('raw');
        return null;
      }
    },
    [effectiveSubject, topic, existingFpSet]
  );

  const handleGenerate = async () => {
    if (isGenerating) return;
    setGenError('');
    setParseError('');
    setGeneratedCards([]);
    setRawOutput('');
    setElapsedSec(0);
    setIsGenerating(true);

    const startedAt = Date.now();
    timerRef.current = window.setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    }, 500);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      setStatusText(selectedRefPaths.length > 0 ? `讀取 ${selectedRefPaths.length} 份參考筆記...` : '組裝主動回憶閃卡指令...');
      const refContents = [];
      for (const relPath of selectedRefPaths) {
        let content = '';
        if (isElectron && window.electronAPI?.readFileContent) {
          const r = await window.electronAPI.readFileContent(relPath);
          if (r?.success) content = r.content;
        }
        if (!content) {
          const cr = await fetchCloudAssetText(relPath);
          if (cr?.success) content = cr.content;
        }
        if (content) refContents.push({ title: relPath.split('/').pop(), path: relPath, content });
      }

      const existingFronts = (existingCards || [])
        .filter((c) => c.subject === effectiveSubject)
        .map((c) => c.front);

      const { systemPrompt, userPrompt } = buildAiFlashcardsPrompt({
        subject: effectiveSubject,
        topic: topic.trim(),
        count: cardCount,
        style,
        referenceFiles: refContents,
        weakChapters: includeWeakChapters ? subjectWeakChapters : [],
        activeMistakes: includeMistakes ? subjectMistakes : [],
        existingFronts,
        extraInstructions,
        isAgyCli: aiConfig.engine === 'agy',
      });

      const res = await streamAiGeneration({
        config: aiConfig,
        systemPrompt,
        userPrompt,
        signal: ctrl.signal,
        onStatus: (m) => setStatusText(m),
        onDelta: (_d, full) => setRawOutput(full),
      });

      const finalText = res?.text || '';
      setRawOutput(finalText);
      const elapsed = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      const parsed = tryParse(finalText);
      if (parsed) {
        setStatusText(`生成完成！共 ${parsed.length} 張閃卡（${res?.model || ''} · ${elapsed} 秒）`);
      } else {
        setStatusText(`輸出完畢（${elapsed} 秒），但 JSON 需要微調`);
      }
    } catch (err) {
      if (err?.name === 'AbortError') setStatusText('已停止生成');
      else {
        setGenError(err?.message || 'AI 閃卡生成失敗');
        setStatusText('');
      }
    } finally {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      abortRef.current = null;
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const selectedList = generatedCards.filter((c) => checkedIds.has(c.id));

  return createPortal(
    <div className="arena-modal-backdrop fc-portal-backdrop" onClick={() => !isGenerating && onClose?.()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="AI 批量生成主動回憶閃卡"
        tabIndex={-1}
        className="fc-ai-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fc-modal-header">
          <div className="fc-modal-title-group">
            <Wand2 size={18} style={{ color: 'var(--accent-purple)' }} />
            <div>
              <h3>AI 批量生成主動回憶閃卡</h3>
              <p>自動避開既有閃卡重複考點，支援讀取筆記與錯題，產出結構化 Q&A＋口訣＋陷阱。</p>
            </div>
          </div>
          <button
            type="button"
            className="arena-icon-btn"
            onClick={() => !isGenerating && onClose?.()}
            disabled={isGenerating}
            aria-label="關閉"
          >
            <X size={16} />
          </button>
        </div>

        <div className="fc-ai-body">
          {/* Left Settings Pane */}
          <div className="fc-ai-left">
            <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="setting-label" style={{ margin: 0 }}>
                  <Cpu size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} /> 1. AI 生成引擎
                </label>
                {onOpenSettings && (
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      onClose?.();
                      onOpenSettings();
                    }}
                  >
                    <Settings size={12} /> 引擎設定
                  </button>
                )}
              </div>

              <div className="fc-engine-pills">
                {isElectron && (
                  <button
                    type="button"
                    className={`arena-pill-btn ${aiConfig.engine === 'agy' ? 'active' : ''}`}
                    onClick={() => updateEngine({ engine: 'agy' })}
                    disabled={isGenerating}
                  >
                    本機 agy CLI
                  </button>
                )}
                <button
                  type="button"
                  className={`arena-pill-btn ${aiConfig.engine === 'gemini' ? 'active' : ''}`}
                  onClick={() => updateEngine({ engine: 'gemini' })}
                  disabled={isGenerating}
                >
                  Gemini API
                </button>
                <button
                  type="button"
                  className={`arena-pill-btn ${aiConfig.engine === 'openai' ? 'active' : ''}`}
                  onClick={() => updateEngine({ engine: 'openai' })}
                  disabled={isGenerating}
                >
                  OpenAI / Ollama
                </button>
              </div>

              {aiConfig.engine === 'agy' && isElectron && (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <select
                    className="form-control"
                    value={aiConfig.agyModel}
                    onChange={(e) => updateEngine({ agyModel: e.target.value })}
                    disabled={isGenerating || checkingAgy}
                  >
                    {(agyInfo.models.length > 0 ? agyInfo.models : [{ id: aiConfig.agyModel || 'gemini-4-neon-high', label: aiConfig.agyModel || 'gemini-4-neon-high' }]).map((m) => (
                      <option key={m.id} value={m.id}>{m.label || m.id}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="arena-btn-ghost"
                    onClick={checkAgy}
                    disabled={checkingAgy}
                    title="重新偵測本機 agy CLI"
                    aria-label="重新偵測本機 agy CLI"
                  >
                    <RefreshCw size={13} className={checkingAgy ? 'spin' : ''} />
                  </button>
                </div>
              )}

              {aiConfig.engine === 'gemini' && (
                <select
                  className="form-control"
                  value={aiConfig.geminiModel}
                  onChange={(e) => updateEngine({ geminiModel: e.target.value })}
                  disabled={isGenerating}
                >
                  {GEMINI_API_MODEL_PRESETS.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label className="setting-label" style={{ margin: 0 }}>2. 科目、範圍與風格</label>

              <div className="fc-form-row-2">
                <select
                  className="form-control"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isGenerating}
                >
                  {subjectChoices.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="__CUSTOM__">+ 自訂科目...</option>
                </select>

                <select
                  className="form-control"
                  value={cardCount}
                  onChange={(e) => setCardCount(Number(e.target.value))}
                  disabled={isGenerating}
                >
                  {[5, 8, 10, 15, 20].map((n) => (
                    <option key={n} value={n}>生成 {n} 張閃卡</option>
                  ))}
                </select>
              </div>

              {subject === '__CUSTOM__' && (
                <input
                  type="text"
                  className="form-control"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="輸入自訂科目名稱..."
                  disabled={isGenerating}
                />
              )}

              <input
                type="text"
                className="form-control"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="主題範圍（例：Ch4 C++ OOP 多型與指標、Stokes/Div 定理）"
                disabled={isGenerating}
              />

              <select
                className="form-control"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                disabled={isGenerating}
              >
                {STYLE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>

              <label className="arena-gen-check-row">
                <input
                  type="checkbox"
                  checked={includeWeakChapters}
                  onChange={(e) => setIncludeWeakChapters(e.target.checked)}
                  disabled={isGenerating}
                />
                <Brain size={13} />
                <span>優先針對記憶衰減 🔴/🟡 章節（{subjectWeakChapters.length} 章）</span>
              </label>

              <label className="arena-gen-check-row">
                <input
                  type="checkbox"
                  checked={includeMistakes}
                  onChange={(e) => setIncludeMistakes(e.target.checked)}
                  disabled={isGenerating}
                />
                <Flame size={13} />
                <span>融入未攻克錯題盲區（{subjectMistakes.length} 題）</span>
              </label>
            </div>

            <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="setting-label" style={{ margin: 0 }}>
                  3. 參考筆記／題庫（已選 {selectedRefPaths.length} 份）
                </label>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="checkbox"
                    checked={showAllRefs}
                    onChange={(e) => setShowAllRefs(e.target.checked)}
                    disabled={isGenerating}
                  />
                  全部 ({workspaceRefs.length})
                </label>
              </div>
              <input
                type="text"
                className="form-control"
                style={{ height: 30, fontSize: '0.76rem' }}
                placeholder="篩選筆記檔名..."
                value={refSearch}
                onChange={(e) => setRefSearch(e.target.value)}
                disabled={isGenerating}
              />
              <div className="ai-ref-picker-list" style={{ maxHeight: 115 }}>
                {visibleRefs.length === 0 ? (
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', padding: 8, textAlign: 'center' }}>
                    無符合參考檔（AI 仍可依主題直接產卡）
                  </div>
                ) : (
                  visibleRefs.slice(0, 40).map((f) => {
                    const checked = selectedRefPaths.includes(f.path);
                    return (
                      <label key={f.path} className={`ai-ref-picker-item ${checked ? 'is-selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={isGenerating}
                          onChange={() =>
                            setSelectedRefPaths((prev) =>
                              prev.includes(f.path) ? prev.filter((p) => p !== f.path) : [...prev, f.path]
                            )
                          }
                        />
                        <span className="ai-ref-name" title={f.path}>{f.name}</span>
                      </label>
                    );
                  })
                )}
              </div>

              <textarea
                className="form-control"
                rows={2}
                value={extraInstructions}
                onChange={(e) => setExtraInstructions(e.target.value)}
                placeholder="補充指示（例：多出易混淆的英文學術單字反義對照）..."
                disabled={isGenerating}
              />
            </div>
          </div>

          {/* Right Preview & Selection Pane */}
          <div className="fc-ai-right">
            <div className="fc-ai-right-head">
              <div className="fc-ai-status">
                {statusText ? (
                  <span>{statusText}</span>
                ) : (
                  <span style={{ color: 'var(--text-dim)' }}>設定左側條件後點「開始 AI 生成閃卡」，產出後可逐張預覽勾選入庫。</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  className={`arena-pill-btn ${rightView === 'preview' ? 'active' : ''}`}
                  onClick={() => setRightView('preview')}
                >
                  <Eye size={12} /> 卡片預覽 ({generatedCards.length})
                </button>
                <button
                  type="button"
                  className={`arena-pill-btn ${rightView === 'raw' ? 'active' : ''}`}
                  onClick={() => setRightView('raw')}
                >
                  <Code size={12} /> 原始 JSON
                </button>
              </div>
            </div>

            {genError && (
              <div className="fc-form-error" style={{ margin: '0 0 10px' }}>
                <AlertCircle size={14} /> {genError}
              </div>
            )}
            {parseError && (
              <div className="fc-form-error" style={{ margin: '0 0 10px' }}>
                <AlertCircle size={14} /> {parseError}
                <button type="button" className="arena-btn-ghost" style={{ marginLeft: 'auto', padding: '2px 8px' }} onClick={() => tryParse(rawOutput)}>
                  重新解析
                </button>
              </div>
            )}

            {rightView === 'raw' ? (
              <textarea
                className="form-control fc-ai-raw-box"
                value={rawOutput}
                onChange={(e) => setRawOutput(e.target.value)}
                placeholder="AI 串流輸出的 JSON 將顯示於此..."
              />
            ) : generatedCards.length === 0 ? (
              <div className="fc-ai-empty">
                <Wand2 size={30} />
                <p>{isGenerating ? `AI 正在即時串流產卡中（已收到 ${rawOutput.length} 字元）...` : '尚未生成閃卡預覽'}</p>
              </div>
            ) : (
              <div className="fc-ai-cards-list">
                <div className="fc-ai-select-bar">
                  <button
                    type="button"
                    className="arena-btn-ghost"
                    onClick={() => {
                      if (checkedIds.size === generatedCards.length) setCheckedIds(new Set());
                      else setCheckedIds(new Set(generatedCards.map((c) => c.id)));
                    }}
                  >
                    {checkedIds.size === generatedCards.length ? <CheckSquare size={14} /> : <SquareIcon size={14} />}
                    全選 / 全不選（已勾 {selectedList.length}/{generatedCards.length} 張）
                  </button>
                </div>

                {generatedCards.map((c, idx) => {
                  const isDup = existingFpSet.has(c.fingerprint);
                  const isChecked = checkedIds.has(c.id);
                  return (
                    <div
                      key={c.id || idx}
                      className={`fc-ai-preview-item ${isChecked ? 'is-checked' : ''} ${isDup ? 'is-dup' : ''}`}
                      onClick={() =>
                        setCheckedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(c.id)) next.delete(c.id);
                          else next.add(c.id);
                          return next;
                        })
                      }
                    >
                      <div className="fc-ai-preview-head">
                        <span className="fc-batch-checkbox">
                          {isChecked ? <CheckSquare size={15} /> : <SquareIcon size={15} />}
                        </span>
                        <strong>#{idx + 1}</strong>
                        <span className="arena-chip">{c.subject}</span>
                        {c.chapter && <span className="arena-chip muted">{c.chapter}</span>}
                        {isDup && <span className="arena-chip danger">與現有閃卡重複</span>}
                      </div>

                      <div className="fc-ai-preview-front">
                        <PreviewMd content={c.front} />
                      </div>
                      <div className="fc-ai-preview-back">
                        <PreviewMd content={c.back} />
                        {c.mnemonic && (
                          <div className="fc-scan-inline-note is-mnemonic" style={{ marginTop: 4 }}>
                            <Lightbulb size={12} /> <strong>口訣：</strong>{c.mnemonic}
                          </div>
                        )}
                        {c.pitfall && (
                          <div className="fc-scan-inline-note is-pitfall" style={{ marginTop: 4 }}>
                            <AlertTriangle size={12} /> <strong>陷阱：</strong>{c.pitfall}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="fc-modal-footer" style={{ justifyContent: 'space-between' }}>
          <div>
            {isGenerating ? (
              <button type="button" className="arena-btn-secondary fc-btn-danger" onClick={() => abortRef.current?.abort()}>
                <Square size={14} /> 停止生成 ({elapsedSec}s)
              </button>
            ) : (
              <button type="button" className="arena-btn-primary" onClick={handleGenerate}>
                <Play size={14} /> 開始 AI 生成閃卡
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="arena-btn-secondary" onClick={() => !isGenerating && onClose?.()} disabled={isGenerating}>
              關閉
            </button>
            <button
              type="button"
              className="arena-btn-primary"
              disabled={selectedList.length === 0 || isGenerating}
              onClick={() => onImportCards?.(selectedList)}
            >
              <Plus size={15} /> 匯入已勾選的 {selectedList.length} 張閃卡並同步 MD
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
