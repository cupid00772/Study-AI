import { useId } from 'react';
import { AlertTriangle, HelpCircle, X } from 'lucide-react';
import { useModalA11y } from '../hooks/useModalA11y';

export default function ConfirmDialog({
  isOpen,
  title = '確認操作',
  message = '',
  confirmLabel = '確定',
  cancelLabel = '取消',
  danger = false,
  onConfirm,
  onCancel,
}) {
  const titleId = useId();
  const descId = useId();
  const { dialogRef } = useModalA11y({ isOpen, onClose: onCancel });

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay is-confirm-layer"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className="modal-content confirm-dialog-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-dialog-head">
          <div className={`confirm-dialog-icon ${danger ? 'is-danger' : 'is-info'}`}>
            {danger ? <AlertTriangle size={20} /> : <HelpCircle size={20} />}
          </div>
          <div className="confirm-dialog-copy">
            <h3 id={titleId} className="confirm-dialog-title">{title}</h3>
            {message && (
              <p id={descId} className="confirm-dialog-message">{message}</p>
            )}
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-icon-sm"
            onClick={onCancel}
            aria-label="關閉確認視窗"
          >
            <X size={16} />
          </button>
        </div>

        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${danger ? 'btn-danger-solid' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

