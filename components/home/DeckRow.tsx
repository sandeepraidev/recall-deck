"use client";

import Link from "next/link";
import { useLongPress } from "@/hooks/useLongPress";
import type { Category, Deck } from "@/lib/types";
import { MODES } from "@/lib/modes";
import { chipBg, chipFg } from "@/lib/colors";
import { computeDueCount } from "@/lib/scheduling";

interface DeckRowProps {
  category: Category;
  decks: Deck[];
  showDue?: boolean;
  onLongPress?: () => void;
}

export default function DeckRow({ category, decks, showDue = true, onLongPress }: DeckRowProps) {
  const pressHandlers = useLongPress(onLongPress);
  const due = decks.reduce((sum, d) => sum + computeDueCount(d), 0);
  const bg = chipBg(category.hue);
  const fg = chipFg(category.hue);

  return (
    <Link
      href={`/collection?id=${category.id}`}
      className="mb-3 flex select-none items-center gap-3.5 rounded-[20px] border border-border bg-white p-[15px] shadow-[0_2px_10px_rgba(30,20,60,0.03)] [-webkit-touch-callout:none]"
      {...pressHandlers}
    >
      <div className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-2xl" style={{ background: bg }}>
        <div className="font-serif text-[22px] font-semibold" style={{ color: fg }}>
          {category.glyph}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <span className="rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide" style={{ color: fg, background: bg }}>
          {MODES[category.mode].name}
        </span>
        <div className="mt-1 truncate text-[15.5px] font-bold text-foreground-2">{category.title}</div>
        <div className="text-[12.5px] font-medium text-muted">
          {decks.length} collection{decks.length === 1 ? "" : "s"} · {due} due
        </div>
      </div>
      {showDue && (
        <div className="flex-none text-right">
          <div className="text-[12px] font-extrabold" style={{ color: fg }}>
            {due}
          </div>
          <div className="text-[10px] font-semibold text-muted-2">due</div>
        </div>
      )}
    </Link>
  );
}
