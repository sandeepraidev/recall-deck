"use client";

import { useMemo, useState } from "react";
import { useDecks } from "@/hooks/useDecks";
import DeckRow from "@/components/home/DeckRow";
import ResumeCard from "@/components/home/ResumeCard";
import EmptyState from "@/components/EmptyState";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import { computeDueCount } from "@/lib/scheduling";

function formatToday(): string {
  return new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export default function HomePage() {
  const { categories, decks, isLoaded, loadError, getCategory, deleteCategory } = useDecks();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const resume = useMemo(() => {
    if (decks.length === 0) return null;
    let best = decks[0];
    let bestDue = -1;
    for (const d of decks) {
      const due = computeDueCount(d);
      if (due > bestDue) {
        best = d;
        bestDue = due;
      }
    }
    const total = best.cards.length || 1;
    const studied = best.cards.filter((c) => c.learned || c.reviewCount > 0).length;
    return { deck: best, pct: Math.round((studied / total) * 100) };
  }, [decks]);

  const trimmedQuery = query.trim().toLowerCase();
  const filteredCategories = trimmedQuery
    ? categories.filter((cat) => {
        const catDecks = decks.filter((d) => d.categoryId === cat.id);
        return (
          cat.title.toLowerCase().includes(trimmedQuery) ||
          cat.sub.toLowerCase().includes(trimmedQuery) ||
          catDecks.some((d) => d.title.toLowerCase().includes(trimmedQuery))
        );
      })
    : categories;

  if (loadError) {
    return (
      <div className="pt-6">
        <div className="rounded-[20px] border border-border bg-white p-5">
          <div className="text-[17px] font-bold text-foreground">Couldn&apos;t load your decks</div>
          <div className="mt-2 text-[14px] leading-relaxed text-muted">Your saved progress couldn&apos;t be read. Nothing has been deleted.</div>
          <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-background p-3 font-mono text-[12.5px] text-foreground-2">{loadError}</pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 h-[46px] w-full rounded-2xl bg-accent text-[15px] font-bold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="space-y-3 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[80px] animate-pulse rounded-[20px] bg-white" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between py-2 pb-[18px]">
        {searchOpen ? (
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search decks…"
            className="mr-3 flex-1 rounded-full border border-border bg-white px-4 py-2.5 text-[15px] text-foreground-2 outline-none"
          />
        ) : (
          <div>
            <div className="text-[13px] font-semibold tracking-wide text-muted">{formatToday()}</div>
            <div className="mt-0.5 text-[30px] font-extrabold tracking-tight text-foreground">Recall Deck</div>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setSearchOpen((o) => !o);
            setQuery("");
          }}
          className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full border border-border bg-white shadow-[0_2px_8px_rgba(30,20,60,0.05)]"
        >
          {searchOpen ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5a554c" strokeWidth="2.2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5a554c" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
          )}
        </button>
      </div>

      {!searchOpen && resume && (() => {
        const cat = getCategory(resume.deck.categoryId);
        return (
          <ResumeCard
            href={`/deck?id=${resume.deck.id}`}
            title={resume.deck.title}
            subtitle={`${computeDueCount(resume.deck)} cards due${cat ? ` · ${cat.title}` : ""}`}
            pct={resume.pct}
          />
        );
      })()}

      <div className="mb-3.5 mt-[26px] flex items-baseline justify-between px-0.5">
        <div className="text-[18px] font-bold text-foreground">{trimmedQuery ? "Results" : "Your decks"}</div>
        <div className="text-[13px] font-semibold text-accent">{filteredCategories.length} decks</div>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="No decks yet" subtitle="Create your first card to start a new deck." actionLabel="New card" actionHref="/card/new" />
      ) : filteredCategories.length === 0 ? (
        <div className="pt-6 text-center text-muted">No decks match &ldquo;{query}&rdquo;.</div>
      ) : (
        filteredCategories.map((cat) => (
          <DeckRow
            key={cat.id}
            category={cat}
            decks={decks.filter((d) => d.categoryId === cat.id)}
            onLongPress={() => setPendingDelete(cat.id)}
          />
        ))
      )}

      <ConfirmSheet
        open={pendingDelete !== null}
        title={`Delete "${(pendingDelete && getCategory(pendingDelete)?.title) || "deck"}"?`}
        message="All its collections and cards will be removed. This can't be undone."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteCategory(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
