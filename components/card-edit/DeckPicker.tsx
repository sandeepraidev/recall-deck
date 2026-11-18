"use client";

import { useState } from "react";
import type { Category, Deck } from "@/lib/types";
import { chipBg, chipFg } from "@/lib/colors";

interface DeckPickerProps {
  categories: Category[];
  decks: Deck[];
  value: string;
  onChange: (deckId: string) => void;
}

export default function DeckPicker({ categories, decks, value, onChange }: DeckPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = decks.find((d) => d.id === value);
  const selectedCat = selected ? categories.find((c) => c.id === selected.categoryId) : undefined;
  const hue = selectedCat?.hue ?? 285;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-white px-4 py-3.5"
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-[26px] w-[26px] items-center justify-center rounded-lg font-serif text-[14px] font-semibold"
            style={{ background: chipBg(hue), color: chipFg(hue) }}
          >
            {selectedCat?.glyph ?? "?"}
          </span>
          <span className="text-[15px] font-semibold text-foreground-2">{selected?.title ?? "Select a deck"}</span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a7a297"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-white" style={{ animation: "rc-face 0.2s ease" }}>
          {decks.map((d) => {
            const cat = categories.find((c) => c.id === d.categoryId);
            const dHue = cat?.hue ?? 285;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  onChange(d.id);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 border-t border-border/70 px-4 py-3 text-left first:border-t-0"
              >
                <span
                  className="flex h-6 w-6 flex-none items-center justify-center rounded-[7px] font-serif text-[13px] font-semibold"
                  style={{ background: chipBg(dHue), color: chipFg(dHue) }}
                >
                  {cat?.glyph}
                </span>
                <span className="text-[14.5px] font-semibold text-foreground-2">
                  {cat ? `${cat.title} · ${d.title}` : d.title}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
