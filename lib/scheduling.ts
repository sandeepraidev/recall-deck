import type { Card, Deck } from "@/lib/types";
import { isCardDue } from "@/lib/types";

// A small, real (non-fake) review interval — not spaced-repetition (SM-2),
// since the source artifact never had a grading UI (Again/Hard/Good/Easy),
// only Previous/Next. A card is "learned" after 3 reviews; each earlier
// review pushes it out a bit further before it's due again.
const INTERVAL_DAYS = [1, 3, 7];
const LEARNED_AFTER_REVIEWS = INTERVAL_DAYS.length;

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function markCardReviewed<T extends Card>(card: T): T {
  const reviewCount = card.reviewCount + 1;
  const learned = reviewCount >= LEARNED_AFTER_REVIEWS;
  return {
    ...card,
    reviewCount,
    learned,
    dueAt: learned ? null : addDays(INTERVAL_DAYS[reviewCount - 1] ?? 7),
    updatedAt: new Date().toISOString(),
  };
}

export function computeDueCards(deck: Deck): Card[] {
  return deck.cards.filter((c) => isCardDue(c));
}

export function computeDueCount(deck: Deck): number {
  return computeDueCards(deck).length;
}

export function computeLearnedCount(deck: Deck): number {
  return deck.cards.filter((c) => c.learned).length;
}
