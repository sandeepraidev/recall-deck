"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useDecks } from "@/hooks/useDecks";
import DeckList from "@/components/DeckList";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const { decks, isLoaded, deleteDeck, importDeck } = useDecks();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const result = importDeck(text);
      if (!result.ok) {
        setImportError(result.error);
        setTimeout(() => setImportError(null), 4000);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Recall Deck</h1>
            <p className="mt-0.5 text-sm text-muted">Your memory card decks</p>
          </div>
          <div className="flex items-center gap-2">
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
              className="inline-flex h-10 items-center rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-surface-hover"
            >
              Import
            </button>
            <Link
              href="/create"
              className="inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              + New Deck
            </Link>
          </div>
        </div>

        {importError && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {importError}
          </div>
        )}

        {!isLoaded ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-surface" />
            ))}
          </div>
        ) : decks.length === 0 ? (
          <EmptyState
            title="No decks yet"
            subtitle="Create your first recall deck to start memorising anything."
            actionLabel="Create a Deck"
            actionHref="/create"
          />
        ) : (
          <DeckList decks={decks} onDelete={deleteDeck} />
        )}
      </div>
    </div>
  );
}
