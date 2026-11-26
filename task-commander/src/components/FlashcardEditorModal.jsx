import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Save,
  Eye,
  Edit3,
  RotateCcw,
  Lightbulb,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { renderMarkdownWithKatex } from '../utils/markdownRenderer';
import { CORE_FLASHCARD_SUBJECTS } from '../utils/flashcardUtils';
import { useModalA11y } from '../hooks/useModalA11y';

function LivePreviewMd({ content }) {
  const html = useMemo(() => renderMarkdownWithKatex(content || ''), [content]);
  return (
    <div
      className="fc-markdown markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function FlashcardEditorModal({
  card = null,
  availableSubjects = CORE_FLASHCARD_SUBJECTS,
  defaultSubject = '計算機概論',
  onSave,
  onResetProgress,
  onClose,
}) {
  const isNew = !card;
  const initialSubject = card?.subject || defaultSubject || '計算機概論';
  const subjectList = useMemo(() => {
    const set = new Set([...CORE_FLASHCARD_SUBJECTS, ...(availableSubjects || [])]);
    if (initialSubject) set.add(initialSubject);
    return Array.from(set);
  }, [availableSubjects, initialSubject]);

  const [subject, setSubject] = useState(initialSubject);
  const [customSubject, setCustomSubject] = useState('');
  const [code, setCode] = useState(card?.code || '');
  const [chapter, setChapter] = useState(card?.chapter || '');
  const [front, setFront] = useState(card?.front || '');
  const [back, setBack] = useState(card?.back || '');
  const [hint, setHint] = useState(card?.hint || '');
  const [mnemonic, setMnemonic] = useState(card?.mnemonic || '');
  const [pitfall, setPitfall] = useState(card?.pitfall || '');
  const [tagsText, setTagsText] = useState((card?.tags || []).join(', '));
  const [suspended, setSuspended] = useState(Boolean(card?.suspended));
  const [showPreview, setShowPreview] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const effectiveSubject = subject === '__CUSTOM__'
    ? (customSubject.trim() || '其他')
    : subject;

  const parsedTags = useMemo(() => {
    return [...new Set(
      tagsText
        .split(/[,，\s]+/)
        .map((t) => t.replace(/^#/, '').trim())
        .filter(Boolean)
    )];
  }, [tagsText]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!front.trim()) {
      setErrorMsg('請填寫「正面提問 (Prompt)」');
      return;
    }
    if (!back.trim()) {
      setErrorMsg('請填寫「背面解答 (Answer)」');
      return;
    }
    setErrorMsg('');

    const payload = {
      ...(card || {}),
      subject: effectiveSubject,
      code: code.trim(),
      chapter: chapter.trim(),
      front: front.trim(),
      back: back.trim(),
      hint: hint.trim(),
      mnemonic: mnemonic.trim(),
      pitfall: pitfall.trim(),
      tags: parsedTags,
      suspended,
      source: card?.source || 'manual',
    };

    onSave?.(payload, isNew);
  };

  const { dialogRef } = useModalA11y({ isOpen: true, onClose });
  const handleSubmitRef = useRef(handleSubmit);

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSubmitRef.current?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return createPortal(
    <div className="arena-modal-backdrop fc-portal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={isNew ? '新增主動回憶閃卡' : '編輯閃卡'}
        tabIndex={-1}
        className="fc-editor-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fc-modal-header">
          <div className="fc-modal-title-group">
            <Edit3 size={18} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <h3>{isNew ? '新增主動回憶閃卡' : `編輯閃卡${card.code ? ` (${card.code})` : ''}`}</h3>
              <p>支援 Markdown、行內程式碼與 LaTeX 公式（$...$ / $$...$$），按 Ctrl+S 快速儲存。</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="arena-btn-ghost"
              onClick={() => setShowPreview((p) => !p)}
            >
              <Eye size={14} /> {showPreview ? '隱藏預覽' : '顯示預覽'}
            </button>
            <button type="button" className="arena-icon-btn" onClick={onClose} aria-label="關閉">
              <X size={16} />
            </button>
          </div>
        </div>

        <form className={`fc-editor-body ${showPreview ? 'has-preview' : ''}`} onSubmit={handleSubmit}>
          {/* Left Form Column */}
          <div className="fc-editor-form">
            <div className="fc-form-row-3">
              <div>
                <label className="setting-label">科目</label>
                <select
                  className="form-control"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {subjectList.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="__CUSTOM__">+ 自訂科目...</option>
                </select>
              </div>

              <div>
                <label className="setting-label">章節 / 主題（選填）</label>
                <input
                  type="text"
                  className="form-control"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="例：Ch7 網路原理"
                />
              </div>

              <div>
                <label className="setting-label">編號（選填）</label>
                <input
                  type="text"
                  className="form-control"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="例：CS-11"
                />
              </div>
            </div>

            {subject === '__CUSTOM__' && (
              <div>
                <label className="setting-label">自訂科目名稱</label>
                <input
                  type="text"
                  className="form-control"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="例：資料結構、作業系統、統計學、線性代數..."
                />
              </div>
            )}

            <div>
              <label className="setting-label">正面提問 Prompt（必填，建議 3–10 秒內能口頭作答）</label>
              <textarea
                className="form-control fc-textarea"
                rows={3}
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="例：球座標體積元素 $dV$ 與柱座標體積元素 $dV$？"
              />
            </div>

            <div>
              <label className="setting-label">背面解答 Answer（必填，支援 Markdown 與 LaTeX）</label>
              <textarea
                className="form-control fc-textarea"
                rows={4}
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="例：球座標：$\rho^2 \sin\phi \, d\rho \, d\phi \, d\theta$；柱座標：$r \, dz \, dr \, d\theta$"
              />
            </div>

            <div className="fc-form-row-2">
              <div>
                <label className="setting-label">速記口訣 / 易混對照（選填）</label>
                <input
                  type="text"
                  className="form-control"
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  placeholder="例：球要平方再乘 sinφ"
                />
              </div>

              <div>
                <label className="setting-label">考場防錯陷阱（選填）</label>
                <input
                  type="text"
                  className="form-control"
                  value={pitfall}
                  onChange={(e) => setPitfall(e.target.value)}
                  placeholder="例：常忘記單位化或漏掉絕對值"
                />
              </div>
            </div>

            <div className="fc-form-row-2">
              <div>
                <label className="setting-label">偷看提示 Hint（選填，翻面前可按 H 展開）</label>
                <input
                  type="text"
                  className="form-control"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="例：先想 Jacobian 行列式..."
                />
              </div>

              <div>
                <label className="setting-label">標籤（以逗號或空白分隔）</label>
                <input
                  type="text"
                  className="form-control"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="例：高頻公式, 115實考, 易忘"
                />
              </div>
            </div>

            <div className="fc-editor-meta-row">
              <label className="arena-gen-check-row">
                <input
                  type="checkbox"
                  checked={suspended}
                  onChange={(e) => setSuspended(e.target.checked)}
                />
                <span>暫停此張卡片（暫不出現在每日到期排程中）</span>
              </label>

              {!isNew && card.srs && (
                <div className="fc-srs-summary-strip">
                  <span>
                    SM-2：複習 {card.srs.reviewCount} 次 · 間隔 {card.srs.intervalDays} 天 · EF {card.srs.easeFactor} · 忘記 {card.srs.lapses} 次 · 到期 {card.srs.dueDate}
                  </span>
                  {onResetProgress && (
                    <button
                      type="button"
                      className="arena-btn-ghost"
                      style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                      onClick={() => onResetProgress(card.id)}
                    >
                      <RotateCcw size={12} /> 重設進度
                    </button>
                  )}
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="fc-form-error">
                <AlertTriangle size={14} /> {errorMsg}
              </div>
            )}
          </div>

          {/* Right Live Preview Column */}
          {showPreview && (
            <div className="fc-editor-preview">
              <div className="fc-preview-label">
                <Sparkles size={13} /> 即時 KaTeX 卡面預覽
              </div>

              <div className="fc-preview-card">
                <div className="fc-preview-side-tag">FRONT · 正面提問</div>
                {front.trim() ? (
                  <LivePreviewMd content={front} />
                ) : (
                  <p className="fc-preview-placeholder">輸入正面提問後立即預覽...</p>
                )}
                {hint.trim() && (
                  <div className="fc-hint-box" style={{ marginTop: 10 }}>
                    <Lightbulb size={13} /> <span>{hint}</span>
                  </div>
                )}
              </div>

              <div className="fc-preview-card is-back">
                <div className="fc-preview-side-tag is-answer">BACK · 背面解答</div>
                {back.trim() ? (
                  <LivePreviewMd content={back} />
                ) : (
                  <p className="fc-preview-placeholder">輸入背面解答後立即預覽...</p>
                )}

                {mnemonic.trim() && (
                  <div className="fc-callout is-mnemonic" style={{ marginTop: 10 }}>
                    <Lightbulb size={14} style={{ flexShrink: 0 }} />
                    <div>
                      <div className="fc-callout-title">速記口訣</div>
                      <LivePreviewMd content={mnemonic} />
                    </div>
                  </div>
                )}

                {pitfall.trim() && (
                  <div className="fc-callout is-pitfall" style={{ marginTop: 8 }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                    <div>
                      <div className="fc-callout-title">考場陷阱</div>
                      <LivePreviewMd content={pitfall} />
                    </div>
                  </div>
                )}

                {parsedTags.length > 0 && (
                  <div className="fc-card-tags-row" style={{ marginTop: 10 }}>
                    {parsedTags.map((t) => (
                      <span key={t} className="fc-tag-chip">#{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </form>

        <div className="fc-modal-footer">
          <button type="button" className="arena-btn-secondary" onClick={onClose}>
            取消
          </button>
          <button type="button" className="arena-btn-primary" onClick={handleSubmit}>
            <Save size={15} /> {isNew ? '新增並同步 MD' : '儲存變更並同步'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
