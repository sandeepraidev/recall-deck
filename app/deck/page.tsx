"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useDecks } from "@/hooks/useDecks";
import StudyCard from "@/components/StudyCard";
import { TEMPLATES } from "@/lib/templates";
import { exportDeckAsJson } from "@/lib/exportDeck";

function DeckStudy() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const { getDeck, isLoaded, importIntoDeck } = useDecks();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = importIntoDeck(id, ev.target?.result as string);
      if (!result.ok) {
        setImportError(result.error);
        setTimeout(() => setImportError(null), 4000);
      } else {
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    };
    reader.readAsText(file);
  }

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-surface" />
      </div>
    );
  }

  const deck = getDeck(id);
  if (!deck) notFound();

  const template = TEMPLATES[deck.templateId];
  const card = deck.cards[currentIndex];
  const total = deck.cards.length;

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            ← All Decks
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">
              {template?.icon} {template?.name}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="*/*"
              className="hidden"
              onChange={handleImport}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium transition-colors hover:bg-surface-hover"
            >
              Import
            </button>
            <button
              type="button"
              onClick={() => void exportDeckAsJson(deck)}
              className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium transition-colors hover:bg-surface-hover"
            >
              Export
            </button>
            <Link
              href={`/deck/edit?id=${id}`}
              className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium transition-colors hover:bg-surface-hover"
            >
              Edit
            </Link>
          </div>
        </div>

        {importError && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {importError}
          </div>
        )}

        <h1 className="mb-2 text-xl font-bold">{deck.name}</h1>
        <p className="mb-8 text-sm text-muted">
          Card {currentIndex + 1} of {total}
        </p>

        {/* Progress bar */}
        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        {/* Study card with embedded prev/next */}
        <StudyCard
          card={card}
          templateId={deck.templateId}
          colorId={deck.color}
          textAlign={deck.textAlign ?? "center"}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped((f) => !f)}
          onPrev={() => setCurrentIndex((i) => i - 1)}
          onNext={() => setCurrentIndex((i) => i + 1)}
          canPrev={currentIndex > 0}
          canNext={currentIndex < total - 1}
        />

        {/* Completion message */}
        {currentIndex === total - 1 && isFlipped && (
          <div className="mt-8 rounded-xl border border-border bg-surface p-5 text-center">
            <p className="font-semibold">You&apos;ve reached the end! 🎉</p>
            <p className="mt-1 text-sm text-muted">Go back to the start or return to your decks.</p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => { setCurrentIndex(0); setIsFlipped(false); }}
                className="inline-flex h-9 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
              >
                Restart
              </button>
              <Link
                href="/"
                className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-surface-hover transition-colors"
              >
                All Decks
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeckPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-surface" />
      </div>
    }>
      <DeckStudy />
    </Suspense>
  );
}
