"use client";

import { useDecks } from "@/hooks/useDecks";
import { computeLearnedCount } from "@/lib/scheduling";

export default function ProfilePage() {
  const { decks, isLoaded } = useDecks();

  if (!isLoaded) return null;

  const statDecks = decks.length;
  const statCards = decks.reduce((a, d) => a + d.cards.length, 0);
  const statLearned = decks.reduce((a, d) => a + computeLearnedCount(d), 0);

  return (
    <div>
      <div className="pb-[18px] pt-3.5 text-[30px] font-extrabold tracking-tight text-foreground">Profile</div>
      <div className="flex items-center gap-4 rounded-[20px] border border-border bg-white p-[18px]">
        <div
          className="flex h-[58px] w-[58px] items-center justify-center rounded-full font-serif text-[24px] font-semibold"
          style={{ background: "oklch(0.95 0.045 285)", color: "oklch(0.47 0.13 285)" }}
        >
          Y
        </div>
        <div>
          <div className="text-[18px] font-bold text-foreground-2">You</div>
          <div className="mt-0.5 text-[13px] text-muted">Studying since Jan 2026</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl border border-border bg-white p-3.5 px-2 text-center">
          <div className="text-[19px] font-extrabold text-foreground-2">{statDecks}</div>
          <div className="text-[11px] font-semibold text-muted">Decks</div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-3.5 px-2 text-center">
          <div className="text-[19px] font-extrabold text-foreground-2">{statCards}</div>
          <div className="text-[11px] font-semibold text-muted">Cards</div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-3.5 px-2 text-center">
          <div className="text-[19px] font-extrabold" style={{ color: "oklch(0.6 0.14 155)" }}>
            {statLearned}
          </div>
          <div className="text-[11px] font-semibold text-muted">Learned</div>
        </div>
      </div>
    </div>
  );
}
