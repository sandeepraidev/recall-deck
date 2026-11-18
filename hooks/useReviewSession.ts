"use client";

import { useState, useCallback } from "react";
import type { Card } from "@/lib/types";

interface UseReviewSessionOptions {
  cards: Card[]; // the due cards for this session, fixed at session start
  stack: boolean; // stack mode swipes the card away before advancing
  onCardReviewed: (cardId: string) => void;
}

// Mirrors the artifact's Previous/Next review flow (no grading UI ever
// existed in the source), but backs it with real per-card scheduling
// instead of a hardcoded "due" counter.
export function useReviewSession({ cards, stack, onCardReviewed }: UseReviewSessionOptions) {
  const [cardIdx, setCardIdx] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);

  const total = cards.length;
  const done = total === 0 || cardIdx >= total;
  const card = total === 0 ? undefined : cards[Math.min(cardIdx, total - 1)];

  const advance = useCallback(() => {
    if (card && !isReplaying) onCardReviewed(card.id);
    setCardIdx((i) => i + 1);
  }, [card, onCardReviewed, isReplaying]);

  const nextCard = useCallback(() => {
    if (stack) {
      setExiting(true);
      setTimeout(() => {
        advance();
        setExiting(false);
      }, 240);
    } else {
      advance();
    }
  }, [stack, advance]);

  const prevCard = useCallback(() => {
    setCardIdx((i) => Math.max(i - 1, 0));
  }, []);

  const restart = useCallback(() => {
    setIsReplaying(true);
    setCardIdx(0);
    setExiting(false);
  }, []);

  const isLast = cardIdx + 1 >= total;

  return {
    card,
    cardIdx,
    total,
    done,
    exiting,
    nextCard,
    swipeNext: advance, // the drag gesture already animated the card out
    prevCard,
    restart,
    canGoPrev: cardIdx > 0,
    nextLabel: isLast ? "Finish" : "Next",
    progressPct: total === 0 ? 100 : Math.round((Math.min(cardIdx, total) / total) * 100),
    counter: `${Math.min(cardIdx + 1, total)}/${total}`,
  };
}
