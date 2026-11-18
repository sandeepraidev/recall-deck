"use client";

import Link from "next/link";
import { useLongPress } from "@/hooks/useLongPress";
import type { Deck } from "@/lib/types";
import { computeDueCount } from "@/lib/scheduling";

interface CollectionRowProps {
  deck: Deck;
  chipBg: string;
  chipFg: string;
  onLongPress?: () => void;
}

export default function CollectionRow({ deck, chipBg, chipFg, onLongPress }: CollectionRowProps) {
  const pressHandlers = useLongPress(onLongPress);
  const due = computeDueCount(deck);
  const countLine = `${deck.cards.length} cards${deck.story ? " · own story" : ""}`;

  return (
    <Link
      href={`/deck?id=${deck.id}`}
      className="mb-3 block select-none rounded-[20px] border border-border bg-white p-4 shadow-[0_2px_10px_rgba(30,20,60,0.03)] [-webkit-touch-callout:none]"
      {...pressHandlers}
    >
      <div className="flex items-center justify-between">
        <div className="text-[16px] font-bold text-foreground-2">{deck.title}</div>
        <div className="rounded-[7px] px-2.5 py-1 text-[11px] font-extrabold" style={{ color: chipFg, background: chipBg }}>
          {due} due
        </div>
      </div>
      <div className="mt-1.5 text-[13px] font-medium text-muted">{deck.sub}</div>
      <div className="mt-2 text-[12px] font-semibold text-muted-2">{countLine}</div>
    </Link>
  );
}
