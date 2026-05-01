"use client";

import Link from "next/link";
import type { Deck } from "@/lib/types";
import { TEMPLATES } from "@/lib/templates";
import { exportDeckAsJson } from "@/lib/exportDeck";

interface DeckListProps {
  decks: Deck[];
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function DeckList({ decks, onDelete }: DeckListProps) {
  const sorted = [...decks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((deck) => {
        const template = TEMPLATES[deck.templateId];
        return (
          <div key={deck.id} className="relative flex flex-col rounded-xl border border-border bg-surface transition-colors hover:bg-surface-hover">
            <Link href={`/deck?id=${deck.id}`} className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{template?.icon ?? "🗂️"}</span>
                <span className="text-xs text-muted">{template?.name ?? deck.templateId}</span>
              </div>
              <h3 className="font-semibold leading-snug">{deck.name}</h3>
              <div className="mt-auto flex items-center justify-between text-xs text-muted">
                <span>{deck.cards.length} card{deck.cards.length !== 1 ? "s" : ""}</span>
                <span>{formatDate(deck.updatedAt)}</span>
              </div>
            </Link>

            {/* Actions */}
            <div className="absolute right-3 top-3 flex items-center gap-1">
              <button
                type="button"
                onClick={() => void exportDeckAsJson(deck)}
                className="rounded-md px-2 py-1 text-xs text-muted hover:text-accent"
                aria-label={`Export ${deck.name}`}
              >
                Export
              </button>
              <button
                type="button"
                onClick={() => onDelete(deck.id)}
                className="rounded-md px-2 py-1 text-xs text-muted hover:text-destructive"
                aria-label={`Delete ${deck.name}`}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
