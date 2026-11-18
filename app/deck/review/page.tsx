"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDecks } from "@/hooks/useDecks";
import { useReviewSession } from "@/hooks/useReviewSession";
import StudyCard from "@/components/review/StudyCard";
import ProgressBar from "@/components/ui/ProgressBar";
import { chipBg, chipFg, ACCENT } from "@/lib/colors";
import { computeDueCards } from "@/lib/scheduling";
import type { Category, Deck } from "@/lib/types";

interface ReviewSessionProps {
  deck: Deck;
  category: Category | undefined;
  markCardReviewed: (deckId: string, cardId: string) => void;
  onClose: () => void;
}

function ReviewSession({ deck, category, markCardReviewed, onClose }: ReviewSessionProps) {
  // Fixed at session start. When nothing is due the deck is still studyable:
  // practice mode walks every card without touching the schedule.
  const [{ cards: sessionCards, practice }] = useState(() => {
    const due = computeDueCards(deck);
    return due.length > 0 ? { cards: due, practice: false } : { cards: deck.cards, practice: true };
  });
  const hue = category?.hue ?? 285;
  const bg = chipBg(hue);
  const fg = chipFg(hue);
  const isStack = category?.mode === "stack";

  const session = useReviewSession({
    cards: sessionCards,
    stack: isStack,
    onCardReviewed: (cardId) => {
      if (!practice) markCardReviewed(deck.id, cardId);
    },
  });

  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="flex flex-none items-center gap-3 px-5 pb-1 pt-1.5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-border bg-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3a3730" strokeWidth="2.4" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
        <ProgressBar pct={session.progressPct} fill={fg} track="#e6e1d8" heightPx={7} />
        <div className="min-w-[40px] text-right text-[13px] font-bold text-muted">{session.counter}</div>
      </div>

      {session.done ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center" style={{ animation: "rc-pop 0.4s ease" }}>
          <div className="mb-[22px] flex h-[84px] w-[84px] items-center justify-center rounded-full" style={{ background: bg }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="text-[24px] font-extrabold tracking-tight text-foreground">Session complete</div>
          <div className="mt-2 max-w-[260px] text-[14.5px] leading-relaxed text-muted">
            You {practice ? "practiced" : "reviewed"} {sessionCards.length} card{sessionCards.length === 1 ? "" : "s"} in {deck.title}.{" "}
            {practice ? "Nothing was due, so your schedule is unchanged." : "Nice pace — come back tomorrow to keep the streak."}
          </div>
          <div className="mt-7 flex flex-col gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-[50px] rounded-2xl px-[34px] text-[15px] font-bold text-white"
              style={{ background: ACCENT }}
            >
              Back to deck
            </button>
            {sessionCards.length > 0 && (
              <button
                type="button"
                onClick={session.restart}
                className="h-[50px] rounded-2xl px-[34px] text-[15px] font-bold"
                style={{ border: `1.5px solid ${ACCENT}`, color: ACCENT }}
              >
                Study again
              </button>
            )}
          </div>
        </div>
      ) : session.card ? (
        <div className="flex flex-1 flex-col overflow-hidden px-5 pt-3">
          <StudyCard
            card={session.card}
            chipBg={bg}
            chipFg={fg}
            exiting={session.exiting}
            remaining={sessionCards.length - session.cardIdx}
            canGoPrev={session.canGoPrev}
            onSwipeNext={session.swipeNext}
            onSwipePrev={session.prevCard}
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-muted">
          This deck has no cards yet.
        </div>
      )}
    </div>
  );
}

function ReviewContent() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id") ?? "";
  const { isLoaded, getDeck, getCategory, markCardReviewed } = useDecks();

  if (!isLoaded) return null;

  const deck = getDeck(id);
  if (!deck) {
    return (
      <div className="flex h-screen items-center justify-center text-muted">
        Deck not found. <button onClick={() => router.push("/")} className="ml-1 text-accent">Go home</button>
      </div>
    );
  }

  return (
    <ReviewSession
      key={deck.id}
      deck={deck}
      category={getCategory(deck.categoryId)}
      markCardReviewed={markCardReviewed}
      onClose={() => router.push(`/deck?id=${deck.id}`)}
    />
  );
}

export default function ReviewPage() {
  return (
    <Suspense>
      <ReviewContent />
    </Suspense>
  );
}
