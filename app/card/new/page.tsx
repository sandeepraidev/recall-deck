"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDecks } from "@/hooks/useDecks";
import DeckPicker from "@/components/card-edit/DeckPicker";
import CardEditForm from "@/components/card-edit/CardEditForm";
import { emptyInfographic, parseCardFields } from "@/lib/cardForm";
import { ACCENT } from "@/lib/colors";
import type { Card, InfographicItem, InfographicLayout } from "@/lib/types";

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function NewCardContent() {
  const params = useSearchParams();
  const router = useRouter();
  const requestedDeckId = params.get("deckId");
  const { isLoaded, categories, decks, getCategory, addCard } = useDecks();

  const [deckId, setDeckId] = useState(requestedDeckId ?? "");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [examples, setExamples] = useState<string[]>([""]);
  const [tags, setTags] = useState("");
  const [addToReview, setAddToReview] = useState(true);
  const [infographic, setInfographic] = useState<{ layout: InfographicLayout; items: InfographicItem[]; image?: string }>({
    layout: "process",
    items: emptyInfographic("process"),
  });

  if (!isLoaded) return null;
  if (decks.length === 0) {
    return (
      <div className="pt-10 text-center text-muted">
        No decks yet. <button onClick={() => router.push("/")} className="text-accent">Go home</button>
      </div>
    );
  }

  const activeDeckId = deckId || decks[0].id;
  const activeDeck = decks.find((d) => d.id === activeDeckId) ?? decks[0];
  const category = getCategory(activeDeck.categoryId);
  const mode = category?.mode ?? "vocab";

  function handleSave() {
    const now = new Date().toISOString();
    const parsed = parseCardFields(mode, front, back, undefined, examples);
    const fields = parsed.mode === "infographic" ? { ...parsed, ...infographic } : parsed;
    const card: Card = {
      ...fields,
      id: crypto.randomUUID(),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      learned: false,
      reviewCount: 0,
      dueAt: addToReview ? null : addDays(1),
      createdAt: now,
      updatedAt: now,
    } as Card;
    addCard(activeDeck.id, card);
    router.push(`/deck?id=${activeDeck.id}`);
  }

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col">
      <div className="flex flex-none items-center justify-between px-5 pb-2.5 pt-1.5">
        <button type="button" onClick={() => router.back()} className="text-[15px] font-semibold text-muted">
          Cancel
        </button>
        <div className="text-[16px] font-extrabold text-foreground">New card</div>
        <button type="button" onClick={handleSave} className="text-[15px] font-extrabold" style={{ color: ACCENT }}>
          Save
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-2">
        <div className="mb-2 text-[12px] font-bold tracking-wide text-muted">DECK</div>
        <DeckPicker categories={categories} decks={decks} value={activeDeck.id} onChange={setDeckId} />

        <div className="mt-[22px]">
          <CardEditForm
            mode={mode}
            front={front}
            back={back}
            tags={tags}
            addToReview={addToReview}
            onFrontChange={setFront}
            onBackChange={setBack}
            onTagsChange={setTags}
            onToggleAddToReview={() => setAddToReview((v) => !v)}
            examples={examples}
            onExamplesChange={setExamples}
            infographic={infographic}
            onInfographicChange={setInfographic}
          />
        </div>
      </div>
    </div>
  );
}

export default function NewCardPage() {
  return (
    <Suspense>
      <NewCardContent />
    </Suspense>
  );
}
