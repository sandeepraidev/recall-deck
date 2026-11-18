"use client";

import { useEffect, useState } from "react";

interface EditDetailsSheetProps {
  open: boolean;
  heading: string;
  title: string;
  sub: string;
  onSave: (values: { title: string; sub: string }) => void;
  onCancel: () => void;
}

// Bottom sheet for renaming a category or deck. Mounted only while open so the
// fields always start from the current values.
function Form({ heading, title, sub, onSave, onCancel }: Omit<EditDetailsSheetProps, "open">) {
  const [titleDraft, setTitleDraft] = useState(title);
  const [subDraft, setSubDraft] = useState(sub);
  const canSave = titleDraft.trim().length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={heading}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto w-full max-w-md rounded-t-3xl bg-white px-5 pb-6 pt-5"
      >
        <div className="text-[17px] font-extrabold text-foreground">{heading}</div>
        <div className="mb-1.5 mt-4 text-[12px] font-bold tracking-wide text-muted">TITLE</div>
        <input
          value={titleDraft}
          onChange={(e) => setTitleDraft(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-border p-3 text-[16px] font-semibold text-foreground-2 outline-none"
        />
        <div className="mb-1.5 mt-4 text-[12px] font-bold tracking-wide text-muted">DESCRIPTION</div>
        <textarea
          value={subDraft}
          onChange={(e) => setSubDraft(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-xl border border-border p-3 text-[15px] leading-relaxed text-foreground-2 outline-none"
        />
        <button
          type="button"
          disabled={!canSave}
          onClick={() => onSave({ title: titleDraft.trim(), sub: subDraft.trim() })}
          className="mt-5 flex h-[50px] w-full items-center justify-center rounded-2xl bg-accent text-[15px] font-bold text-white disabled:opacity-40"
        >
          Save
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

export default function EditDetailsSheet({ open, ...rest }: EditDetailsSheetProps) {
  return open ? <Form {...rest} /> : null;
}
