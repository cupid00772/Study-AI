import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// Module-level LIFO modal stack so Escape only closes the topmost active modal
const modalStack = [];
let globalListenerBound = false;
let nextModalId = 1;

function handleGlobalKeyDown(e) {
  if (e.key !== 'Escape') return;
  if (modalStack.length === 0) return;

  const top = modalStack[modalStack.length - 1];
  if (!top) return;

  e.preventDefault();
  e.stopPropagation();

  if (!top.disabledRef.current) {
    top.onCloseRef.current?.();
  }
}

function ensureGlobalListener() {
  if (globalListenerBound || typeof window === 'undefined') return;
  window.addEventListener('keydown', handleGlobalKeyDown);
  globalListenerBound = true;
}

export function hasOpenModal() {
  return modalStack.length > 0;
}

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => {
    if (el.getAttribute('aria-hidden') === 'true') return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
}

/**
 * Unified modal accessibility & LIFO Escape stack hook.
 * - Registers modal on LIFO stack so Escape closes only the topmost modal.
 * - Traps Tab / Shift+Tab focus within the dialog container.
 * - Restores focus to the triggering element when closed.
 */
export function useModalA11y({ isOpen = true, onClose, disabled = false, autoFocusDialog = true }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const disabledRef = useRef(disabled);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  useEffect(() => {
    if (!isOpen) return undefined;

    ensureGlobalListener();
    const id = nextModalId++;
    const entry = { id, onCloseRef, disabledRef };
    modalStack.push(entry);

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Move focus inside dialog if an autoFocus input didn't already take it
    const rafId = window.requestAnimationFrame(() => {
      const container = dialogRef.current;
      if (!container || !autoFocusDialog) return;
      if (container.contains(document.activeElement)) return;
      const focusables = getFocusableElements(container);
      if (focusables.length > 0) {
        focusables[0].focus({ preventScroll: true });
      } else if (typeof container.focus === 'function') {
        container.focus({ preventScroll: true });
      }
    });

    const handleTrapTab = (e) => {
      if (e.key !== 'Tab') return;
      if (modalStack[modalStack.length - 1]?.id !== id) return;
      const container = dialogRef.current;
      if (!container) return;

      const focusables = getFocusableElements(container);
      if (focusables.length === 0) {
        e.preventDefault();
        container.focus?.();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleTrapTab);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleTrapTab);
      const idx = modalStack.findIndex((item) => item.id === id);
      if (idx >= 0) modalStack.splice(idx, 1);

      const prev = previousFocusRef.current;
      if (prev && prev.isConnected && typeof prev.focus === 'function') {
        window.requestAnimationFrame(() => {
          if (modalStack.length === 0 && prev.isConnected) {
            prev.focus({ preventScroll: true });
          }
        });
      }
    };
  }, [isOpen, autoFocusDialog]);

  return { dialogRef };
}

