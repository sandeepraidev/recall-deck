"use client";

import { useEffect } from "react";

interface ConfirmSheetProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmSheet({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }: ConfirmSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto w-full max-w-md rounded-t-3xl bg-white px-5 pb-6 pt-5"
      >
        <div className="text-[17px] font-extrabold text-foreground">{title}</div>
        {message && <div className="mt-1.5 text-[14px] leading-relaxed text-muted">{message}</div>}
        <button
          type="button"
          onClick={onConfirm}
          className="mt-5 flex h-[50px] w-full items-center justify-center rounded-2xl bg-destructive text-[15px] font-bold text-white"
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="mt-2 flex h-[50px] w-full items-center justify-center rounded-2xl border border-border-strong bg-white text-[15px] font-bold text-[#3a3730]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
