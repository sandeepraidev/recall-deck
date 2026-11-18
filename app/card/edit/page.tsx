"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDecks } from "@/hooks/useDecks";
import DeckPicker from "@/components/card-edit/DeckPicker";
import CardEditForm from "@/components/card-edit/CardEditForm";
import { emptyInfographic, formFrontFor, formBackFor, parseCardFields } from "@/lib/cardForm";
import { isCardDue } from "@/lib/types";
import { ACCENT } from "@/lib/colors";
import type { Card, InfographicItem, InfographicLayout } from "@/lib/types";

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function EditCardContent() {
  const params = useSearchParams();
  const router = useRouter();
  const deckId = params.get("deckId") ?? "";
  const cardId = params.get("cardId") ?? "";
  const { isLoaded, categories, decks, getCategory, getDeck, updateCard, deleteCard, addCard } = useDecks();

  const deck = getDeck(deckId);
  const card = deck?.cards.find((c) => c.id === cardId);

  const [front, setFront] = useState<string | null>(null);
  const [back, setBack] = useState<string | null>(null);
  const [examples, setExamples] = useState<string[] | null>(null);
  const [tags, setTags] = useState<string | null>(null);
  const [addToReview, setAddToReview] = useState<boolean | null>(null);
  const [targetDeckId, setTargetDeckId] = useState<string | null>(null);
  const [infographic, setInfographic] = useState<{ layout: InfographicLayout; items: InfographicItem[]; image?: string } | null>(null);

  if (!isLoaded) return null;
  if (!deck || !card) {
    return (
      <div className="pt-10 text-center text-muted">
        Card not found. <button onClick={() => router.push("/")} className="text-accent">Go home</button>
      </div>
    );
  }

  const activeTargetDeckId = targetDeckId ?? deck.id;
  const targetCategory = getCategory(getDeck(activeTargetDeckId)?.categoryId ?? deck.categoryId);
  const mode = targetCategory?.mode ?? card.mode;

  const frontValue = front ?? formFrontFor(card);
  const backValue = back ?? formBackFor(card);
  const examplesValue = examples ?? (card.mode === "vocab" ? card.examples : []);
  const tagsValue = tags ?? card.tags.join(", ");
  const addToReviewValue = addToReview ?? isCardDue(card);
  const infographicValue =
    infographic ??
    (card.mode === "infographic"
      ? { layout: card.layout, items: card.items, image: card.image }
      : { layout: "process" as InfographicLayout, items: emptyInfographic("process") });

  function handleSave() {
    const parsed = parseCardFields(mode, frontValue, backValue, card, examplesValue);
    const fields = parsed.mode === "infographic" ? { ...parsed, ...infographicValue } : parsed;
    const changes = {
      ...fields,
      tags: tagsValue.split(",").map((t) => t.trim()).filter(Boolean),
      dueAt: addToReviewValue ? null : addDays(1),
    } as Partial<Card>;

    if (activeTargetDeckId === deck!.id) {
      updateCard(deck!.id, card!.id, changes);
    } else {
      deleteCard(deck!.id, card!.id);
      addCard(activeTargetDeckId, { ...card!, ...changes } as Card);
    }
    router.push(`/deck?id=${activeTargetDeckId}`);
  }

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col">
      <div className="flex flex-none items-center justify-between px-5 pb-2.5 pt-1.5">
        <button type="button" onClick={() => router.back()} className="text-[15px] font-semibold text-muted">
          Cancel
        </button>
        <div className="text-[16px] font-extrabold text-foreground">Edit card</div>
        <button type="button" onClick={handleSave} className="text-[15px] font-extrabold" style={{ color: ACCENT }}>
          Save
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-2">
        <div className="mb-2 text-[12px] font-bold tracking-wide text-muted">DECK</div>
        <DeckPicker categories={categories} decks={decks} value={activeTargetDeckId} onChange={setTargetDeckId} />

        <div className="mt-[22px]">
          <CardEditForm
            mode={mode}
            front={frontValue}
            back={backValue}
            tags={tagsValue}
            addToReview={addToReviewValue}
            onFrontChange={setFront}
            onBackChange={setBack}
            onTagsChange={setTags}
            onToggleAddToReview={() => setAddToReview(!addToReviewValue)}
            examples={examplesValue}
            onExamplesChange={setExamples}
            infographic={infographicValue}
            onInfographicChange={setInfographic}
          />
        </div>
      </div>
    </div>
  );
}

export default function EditCardPage() {
  return (
    <Suspense>
      <EditCardContent />
    </Suspense>
  );
}
