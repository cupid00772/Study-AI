import { useState, useEffect, createElement } from 'react';
import { X, FolderPlus, Check, Trash2 } from 'lucide-react';
import {
  VAULT_SUBJECT_ICONS,
  VAULT_SUBJECT_COLORS,
  resolveVaultSubjectIcon,
} from '../utils/vaultSubjectConfig';

export default function VaultSubjectModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialSubject = null,
  defaultCategory = null,
  existingNames = [],
}) {
  const isEditing = Boolean(initialSubject);
  const [name, setName] = useState(initialSubject?.name || '');
  const [categories, setCategories] = useState(() => {
    if (Array.isArray(initialSubject?.categories) && initialSubject.categories.length > 0) {
      return initialSubject.categories;
    }
    if (defaultCategory && ['Study_Materials', 'Test_Bank', 'Misc_Custom'].includes(defaultCategory)) {
      return Array.from(new Set([defaultCategory, 'Study_Materials', 'Test_Bank']));
    }
    return ['Study_Materials', 'Test_Bank'];
  });
  const [color, setColor] = useState(initialSubject?.color || VAULT_SUBJECT_COLORS[0]);
  const [icon, setIcon] = useState(initialSubject?.icon || 'book');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleCategory = (catKey) => {
    setCategories((prev) => {
      if (prev.includes(catKey)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((c) => c !== catKey);
      }
      return [...prev, catKey];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('請輸入科目資料夾名稱');
      return;
    }
    if (/[\\/:*?"<>|]/.test(trimmed)) {
      setError('科目名稱不可包含 \\ / : * ? " < > | 等檔名保留字元');
      return;
    }
    const lowerSet = new Set(
      existingNames
        .filter((n) => !isEditing || n !== initialSubject?.name)
        .map((n) => String(n).trim().toLowerCase())
    );
    if (lowerSet.has(trimmed.toLowerCase())) {
      setError(`科目「${trimmed}」已存在於 AI 成果庫中`);
      return;
    }

    onSave?.({
      id: initialSubject?.id || `vsubj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: trimmed,
      previousName: initialSubject?.name || null,
      categories,
      color,
      icon,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="vault-icon-badge" style={{ background: `${color}1f`, color, width: 38, height: 38 }}>
              {createElement(resolveVaultSubjectIcon(icon), { size: 20 })}
            </div>
            <div>
              <h2 className="modal-title" style={{ margin: 0, fontSize: '1.08rem' }}>
                {isEditing ? '編輯成果庫科目資料夾' : '新增 AI 成果庫科目'}
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                僅存於 AI 成果庫專用資料夾，不影響本學期課表與作業清單
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-secondary btn-icon-sm" onClick={onClose} aria-label="關閉">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="setting-label">科目名稱 *</label>
            <input
              type="text"
              className="form-control"
              placeholder="例如：線性代數、演算法、英文多益、系統分析"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              autoFocus
              required
            />
          </div>

          <div>
            <label className="setting-label">顯示於哪些成果分類資料夾</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { key: 'Study_Materials', label: '📘 學習教材庫' },
                { key: 'Test_Bank', label: '📝 題庫與評量' },
                { key: 'Misc_Custom', label: '📦 雜項自訂' },
              ].map((cat) => {
                const active = categories.includes(cat.key);
                return (
                  <button
                    key={cat.key}
                    type="button"
                    className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => toggleCategory(cat.key)}
                    style={{ fontSize: '0.76rem', padding: '0.45rem 0.35rem' }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="setting-label">代表色彩</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {VAULT_SUBJECT_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setColor(hex)}
                  aria-label={`顏色 ${hex}`}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: hex,
                    border: color === hex ? '3px solid var(--text-main)' : '2px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    transition: 'transform 0.14s ease',
                    transform: color === hex ? 'scale(1.12)' : 'scale(1)',
                  }}
                >
                  {color === hex && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="setting-label">資料夾圖示</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
              {VAULT_SUBJECT_ICONS.map((item) => {
                const IconComp = item.icon;
                const active = icon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIcon(item.id)}
                    title={item.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '8px 4px',
                      borderRadius: '10px',
                      border: `1px solid ${active ? color : 'var(--border-color)'}`,
                      background: active ? `${color}1c` : 'var(--bg-input)',
                      color: active ? color : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <IconComp size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-danger)', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginTop: '6px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            {isEditing && onDelete ? (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--accent-danger)', borderColor: 'rgba(225, 29, 72, 0.35)' }}
                onClick={() => {
                  if (window.confirm(`確定要從成果庫移除自訂科目資料夾「${initialSubject.name}」嗎？（已收錄的檔案不會被刪除）`)) {
                    onDelete(initialSubject);
                    onClose();
                  }
                }}
              >
                <Trash2 size={14} /> 移除自訂資料夾
              </button>
            ) : <span />}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                取消
              </button>
              <button type="submit" className="btn btn-primary">
                <FolderPlus size={15} /> {isEditing ? '儲存科目設定' : '建立科目資料夾'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
