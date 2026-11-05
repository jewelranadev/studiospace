"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CircleHelp, Loader2, X } from "lucide-react";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible confirmation dialog (no external dialog dependency).
 *
 * - `open` controls visibility; render it next to the action that triggers it.
 * - `onConfirm` may return a promise; while it runs both buttons are disabled
 *   and a spinner is shown on the confirm button.
 * - The caller closes the dialog (`onClose`) once the operation succeeds, and
 *   keeps it open on failure so the user can retry. Errors are toasted by the
 *   caller, not by this component.
 * - `variant="destructive"` styles the confirm button as a destructive action.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  icon,
  onConfirm,
  onClose,
}) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const processingRef = useRef(false);
  const onConfirmRef = useRef(onConfirm);
  const onCloseRef = useRef(onClose);
  const [processing, setProcessing] = useState(false);

  const titleId = useId();
  const descriptionId = useId();

  const destructive = variant === "destructive";

  // Keep the latest callbacks available to the long-lived keydown effect
  // without re-running it (parents pass inline closures).
  useEffect(() => {
    onConfirmRef.current = onConfirm;
    onCloseRef.current = onClose;
  });

  // Focus trap, Escape handling and scroll lock — re-run only when `open`
  // changes so the dialog is stable while it is displayed.
  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      cancelRef.current?.focus();
    }, 0);

    const getFocusable = () => {
      if (!dialogRef.current) return [];
      return Array.from(dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR));
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        if (processingRef.current) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const inside = dialogRef.current?.contains(active);

      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  const handleConfirm = async () => {
    if (processingRef.current) return;

    processingRef.current = true;
    setProcessing(true);

    try {
      await onConfirmRef.current?.();
    } catch {
      // Callers surface their own error toasts; keep the dialog open for retry.
    } finally {
      processingRef.current = false;
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    if (processing) return;
    onCloseRef.current?.();
  };

  if (!open || typeof document === "undefined") return null;

  const resolvedIcon =
    icon ?? (destructive ? <AlertTriangle size={24} /> : <CircleHelp size={24} />);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancel}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl outline-none dark:border-gray-700 dark:bg-gray-800"
      >
        <button
          type="button"
          onClick={handleCancel}
          disabled={processing}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
              destructive
                ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                : "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
            }`}
          >
            {resolvedIcon}
          </div>

          <div className="min-w-0 pr-6">
            <h2
              id={titleId}
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              {title}
            </h2>

            {description && (
              <p
                id={descriptionId}
                className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
              >
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={handleCancel}
            disabled={processing}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              destructive
                ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500 dark:ring-offset-gray-800"
                : "bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500 dark:ring-offset-gray-800"
            }`}
          >
            {processing && <Loader2 size={16} className="animate-spin" />}
            {processing ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
