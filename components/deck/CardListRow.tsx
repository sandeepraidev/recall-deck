"use client";

import Link from "next/link";
import { useLongPress } from "@/hooks/useLongPress";
import type { Card } from "@/lib/types";
import { cardState } from "@/lib/types";
import { frontPreview, backPreview } from "@/lib/cardPreview";
import { chipBg, chipFg } from "@/lib/colors";

const STATE_HUE = { new: 285, due: null, learned: 155 } as const;
const STATE_TEXT = { new: "New", due: "Due", learned: "Learned" } as const;

interface CardListRowProps {
  card: Card;
  deckId: string;
  deckHue: number;
  onLongPress?: () => void;
}

export default function CardListRow({ card, deckId, deckHue, onLongPress }: CardListRowProps) {
  const state = cardState(card);
  const hue = STATE_HUE[state] ?? deckHue;
  const pressHandlers = useLongPress(onLongPress);

  return (
    <Link
      href={`/card/edit?deckId=${deckId}&cardId=${card.id}`}
      className="flex select-none items-center gap-3 border-t border-border/70 px-0 py-3.5 [-webkit-touch-callout:none]"
      {...pressHandlers}
    >
      <div className="h-2 w-2 flex-none rounded-full" style={{ background: chipFg(hue) }} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14.5px] font-semibold text-foreground-2">{frontPreview(card)}</div>
        <div className="mt-0.5 truncate text-[12.5px] text-muted-2">{backPreview(card)}</div>
      </div>
      <div className="flex-none rounded-md px-2 py-0.5 text-[10.5px] font-bold" style={{ color: chipFg(hue), background: chipBg(hue) }}>
        {STATE_TEXT[state]}
      </div>
    </Link>
  );
}
