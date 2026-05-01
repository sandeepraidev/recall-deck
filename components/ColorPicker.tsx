"use client";

import { CARD_COLORS } from "@/lib/colors";

interface ColorPickerProps {
  value: string;
  onChange: (id: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Card Color</label>
      <div className="flex flex-wrap gap-2">
        {CARD_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            title={c.label}
            onClick={() => onChange(c.id)}
            className="relative h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none"
            style={{ background: c.dot }}
            aria-label={c.label}
          >
            {value === c.id && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
            {value === c.id && (
              <span
                className="absolute -inset-1 rounded-full border-2 border-foreground opacity-60"
                style={{ pointerEvents: "none" }}
              />
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">
        {CARD_COLORS.find((c) => c.id === value)?.label ?? ""}
      </p>
    </div>
  );
}
