"use client";

import { useDecks } from "@/hooks/useDecks";
import StatTile from "@/components/deck/StatTile";
import { chipBg, chipFg } from "@/lib/colors";
import { computeDueCount, computeLearnedCount } from "@/lib/scheduling";

export default function StatsPage() {
  const { categories, decks, isLoaded } = useDecks();

  if (!isLoaded) return null;

  const statDecks = decks.length;
  const statDue = decks.reduce((a, d) => a + computeDueCount(d), 0);
  const statCards = decks.reduce((a, d) => a + d.cards.length, 0);
  const statLearned = decks.reduce((a, d) => a + computeLearnedCount(d), 0);

  return (
    <div>
      <div className="pb-[18px] pt-3.5 text-[30px] font-extrabold tracking-tight text-foreground">Stats</div>
      <div className="grid grid-cols-2 gap-3">
        <StatTile value={statDecks} label="Decks" compact />
        <StatTile value={statDue} label="Due today" color="var(--accent)" compact />
        <StatTile value={statCards} label="Total cards" compact />
        <StatTile value={statLearned} label="Learned" color="oklch(0.6 0.14 155)" compact />
      </div>

      <div className="px-0.5 pb-3 pt-6 text-[13px] font-bold tracking-wide text-muted">DUE BY DECK</div>
      {categories.map((cat) => {
        const due = decks.filter((d) => d.categoryId === cat.id).reduce((a, d) => a + computeDueCount(d), 0);
        return (
          <div key={cat.id} className="flex items-center justify-between border-t border-border/70 py-3">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-[7px] font-serif text-[13px] font-semibold"
                style={{ background: chipBg(cat.hue), color: chipFg(cat.hue) }}
              >
                {cat.glyph}
              </span>
              <span className="text-[14.5px] font-semibold text-foreground-2">{cat.title}</span>
            </div>
            <span className="text-[13px] font-extrabold" style={{ color: chipFg(cat.hue) }}>
              {due} due
            </span>
          </div>
        );
      })}
    </div>
  );
}
