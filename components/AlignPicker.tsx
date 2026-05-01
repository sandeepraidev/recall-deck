"use client";

import type { TextAlign } from "@/lib/types";

interface AlignPickerProps {
  value: TextAlign;
  onChange: (align: TextAlign) => void;
}

const OPTIONS: { value: TextAlign; label: string; icon: string }[] = [
  { value: "left",   label: "Left",   icon: "⬅" },
  { value: "center", label: "Center", icon: "↔" },
  { value: "right",  label: "Right",  icon: "➡" },
];

export default function AlignPicker({ value, onChange }: AlignPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">Text Alignment</span>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors
              ${value === opt.value
                ? "border-accent bg-accent text-white"
                : "border-border bg-background text-muted hover:border-accent hover:text-foreground"
              }`}
          >
            <span className="text-base leading-none">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
