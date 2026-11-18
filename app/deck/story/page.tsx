"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDecks } from "@/hooks/useDecks";
import BackButton from "@/components/layout/BackButton";
import StoryReader from "@/components/story/StoryReader";
import { chipBg, chipFg } from "@/lib/colors";

function StoryContent() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id") ?? "";
  const { isLoaded, getDeck, getCategory } = useDecks();

  if (!isLoaded) return null;

  const deck = getDeck(id);
  if (!deck || !deck.story) {
    return (
      <div className="pt-10 text-center text-muted">
        Story not found. <button onClick={() => router.push("/")} className="text-accent">Go home</button>
      </div>
    );
  }

  const category = getCategory(deck.categoryId);
  const hue = category?.hue ?? 285;

  return (
    <div className="mx-auto max-w-md px-5 pb-10 pt-1.5">
      <BackButton onClick={() => router.push(`/deck?id=${deck.id}`)} />
      <StoryReader story={deck.story} cards={deck.cards} chipBg={chipBg(hue)} chipFg={chipFg(hue)} />
    </div>
  );
}

export default function StoryPage() {
  return (
    <Suspense>
      <StoryContent />
    </Suspense>
  );
}
