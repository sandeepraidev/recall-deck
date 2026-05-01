"use client";

import { useState, useEffect, useCallback } from "react";
import type { Deck } from "@/lib/types";
import { DEFAULT_COLOR_ID } from "@/lib/colors";

const STORAGE_KEY = "recall-deck:decks";
const STORAGE_VERSION = 1;

interface StorageSchema {
  version: number;
  decks: Deck[];
}

function readDecks(): Deck[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StorageSchema;
    if (parsed.version !== STORAGE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    // backfill fields for decks created before they existed
    return parsed.decks.map((d) => ({
      ...d,
      color: d.color ?? DEFAULT_COLOR_ID,
      textAlign: d.textAlign ?? "center",
    }));
  } catch {
    return [];
  }
}

function writeDecks(decks: Deck[]): void {
  try {
    const data: StorageSchema = { version: STORAGE_VERSION, decks };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable or quota exceeded — fail silently
  }
}

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setDecks(readDecks());
    setIsLoaded(true);
  }, []);

  const createDeck = useCallback(
    (deck: Omit<Deck, "id" | "createdAt" | "updatedAt">): Deck => {
      const now = new Date().toISOString();
      const newDeck: Deck = {
        ...deck,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      setDecks((prev) => {
        const updated = [...prev, newDeck];
        writeDecks(updated);
        return updated;
      });
      return newDeck;
    },
    []
  );

  const getDeck = useCallback(
    (id: string): Deck | undefined => {
      return decks.find((d) => d.id === id);
    },
    [decks]
  );

  const deleteDeck = useCallback((id: string): void => {
    setDecks((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      writeDecks(updated);
      return updated;
    });
  }, []);

  const updateDeck = useCallback((id: string, changes: Partial<Omit<Deck, "id" | "createdAt">>): void => {
    setDecks((prev) => {
      const updated = prev.map((d) =>
        d.id === id ? { ...d, ...changes, updatedAt: new Date().toISOString() } : d
      );
      writeDecks(updated);
      return updated;
    });
  }, []);

  const importDeck = useCallback((json: string): { ok: true; deck: Deck } | { ok: false; error: string } => {
    try {
      const parsed = JSON.parse(json) as Partial<Deck>;
      if (!parsed.name || !parsed.templateId || !Array.isArray(parsed.cards)) {
        return { ok: false, error: "Invalid deck format." };
      }
      const now = new Date().toISOString();
      const imported: Deck = {
        ...parsed,
        id: crypto.randomUUID(),
        name: parsed.name,
        templateId: parsed.templateId,
        color: parsed.color ?? DEFAULT_COLOR_ID,
        textAlign: parsed.textAlign ?? "center",
        cards: parsed.cards,
        createdAt: now,
        updatedAt: now,
      };
      setDecks((prev) => {
        const updated = [...prev, imported];
        writeDecks(updated);
        return updated;
      });
      return { ok: true, deck: imported };
    } catch {
      return { ok: false, error: "Could not parse JSON file." };
    }
  }, []);

  const importIntoDeck = useCallback((deckId: string, json: string): { ok: true } | { ok: false; error: string } => {
    try {
      const parsed = JSON.parse(json) as Partial<Deck>;
      if (!parsed.name || !parsed.templateId || !Array.isArray(parsed.cards)) {
        return { ok: false, error: "Invalid deck format." };
      }
      setDecks((prev) => {
        const updated = prev.map((d) =>
          d.id === deckId
            ? {
                ...d,
                name: parsed.name!,
                templateId: parsed.templateId!,
                color: parsed.color ?? d.color,
                textAlign: parsed.textAlign ?? d.textAlign,
                cards: parsed.cards!,
                updatedAt: new Date().toISOString(),
              }
            : d
        );
        writeDecks(updated);
        return updated;
      });
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not parse JSON file." };
    }
  }, []);

  return { decks, isLoaded, createDeck, getDeck, deleteDeck, updateDeck, importDeck, importIntoDeck };
}
