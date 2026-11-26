import { useState } from 'react';
import { Lock, Unlock, ShieldCheck, X, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useModalA11y } from '../hooks/useModalA11y';
import {
  getResolvedCloudConfig,
  unlockCloudWrite,
  lockCloudWrite,
} from '../services/supabaseClient';
import { flushPendingWrites } from '../services/cloudSyncService';

export default function CloudUnlockModal({
  isOpen,
  onClose,
  canWrite,
  currentEmail,
  pendingCount = 0,
  onUnlocked,
  onLocked,
}) {
  const cfg = getResolvedCloudConfig();
  const [email, setEmail] = useState(currentEmail || cfg.ownerEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { dialogRef } = useModalA11y({ isOpen, onClose, disabled: submitting });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);
    try {
      const res = await unlockCloudWrite(email, password);
      if (!res.success) {
        setError(res.error || '驗證失敗，請確認帳號與密碼');
        return;
      }
      const flushRes = await flushPendingWrites();
      setSuccessMsg(
        flushRes.flushed > 0
          ? `已解鎖寫入權限，並自動補同步 ${flushRes.flushed} 項變更！`
          : '已解鎖此裝置的雲端寫入權限（之後免重複輸入）！'
      );
      onUnlocked?.(res.user);
      setTimeout(() => {
        onClose();
      }, 750);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLock = async () => {
    setSubmitting(true);
    try {
      await lockCloudWrite();
      onLocked?.();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cloud-unlock-modal-title"
        tabIndex={-1}
        className="modal-content"
        style={{ maxWidth: '440px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            {canWrite ? (
              <Unlock size={20} style={{ color: 'var(--accent-emerald)' }} />
            ) : (
              <Lock size={20} style={{ color: 'var(--accent-primary)' }} />
            )}
            <h2 id="cloud-unlock-modal-title" className="modal-title" style={{ margin: 0, fontSize: '1.1rem' }}>
              {canWrite ? '雲端寫入權限已解鎖' : '解鎖雲端編輯與上傳權限'}
            </h2>
          </div>
          <button type="button" className="btn btn-secondary btn-icon-sm" onClick={onClose} aria-label="關閉">
            <X size={16} />
          </button>
        </div>

        {canWrite ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="setting-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.84rem', lineHeight: 1.5 }}>
                目前裝置已以 <strong>{currentEmail || email || '本人帳號'}</strong> 登入，所有新增、勾選與上傳檔案都會即時同步至其他設備。
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                關閉
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={submitting}
                onClick={handleLock}
                style={{ color: 'var(--accent-danger)', borderColor: 'rgba(225,29,72,0.3)' }}
              >
                <Lock size={14} /> 鎖定切回唯讀模式
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              目前為<strong>公開唯讀模式</strong>（可免登入瀏覽全部資料）。為防止公開網址遭陌生人竄改，首次在此裝置新增、修改或上傳教材時，請輸入你的本人編輯密碼一次，系統將永久記住於此裝置。
            </p>

            {pendingCount > 0 && (
              <div className="badge-chip badge-amber" style={{ alignSelf: 'flex-start', padding: '4px 10px' }}>
                尚有 {pendingCount} 筆變更等待解鎖後同步上雲
              </div>
            )}

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="cloud-unlock-email">本人帳號 Email</label>
              <input
                id="cloud-unlock-email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="cloud-unlock-password">編輯解鎖密碼</label>
              <div className="password-input-wrap">
                <input
                  id="cloud-unlock-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="輸入你在 Supabase 建立的密碼"
                  required
                  autoFocus
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                  title={showPassword ? '隱藏密碼' : '顯示密碼'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-danger)', fontSize: '0.8rem' }}>
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div role="status" aria-live="polite" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 600 }}>
                <CheckCircle2 size={15} />
                <span>{successMsg}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                先保持唯讀
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <Unlock size={14} /> {submitting ? '驗證中...' : '解鎖並同步'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
