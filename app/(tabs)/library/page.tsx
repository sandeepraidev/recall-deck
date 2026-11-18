"use client";

import { useDecks } from "@/hooks/useDecks";
import DeckRow from "@/components/home/DeckRow";

export default function LibraryPage() {
  const { categories, decks, isLoaded } = useDecks();

  if (!isLoaded) return null;

  return (
    <div>
      <div className="pb-1 pt-3.5 text-[30px] font-extrabold tracking-tight text-foreground">Library</div>
      <div className="pb-[18px] text-[13.5px] text-muted">All {categories.length} decks in one place.</div>
      {categories.map((cat) => (
        <DeckRow key={cat.id} category={cat} decks={decks.filter((d) => d.categoryId === cat.id)} showDue={false} />
      ))}
    </div>
  );
}
