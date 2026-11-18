"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import * as store from "@/lib/store";

// Every page reads the same shared library (lib/store.ts), loaded once per
// app launch, so moving between pages never reloads anything.
export function useDecks() {
  useEffect(() => store.ensureLoaded(), []);
  const { categories, decks, isLoaded, loadError } = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  const getCategory = useCallback((id: string) => categories.find((c) => c.id === id), [categories]);
  const getDeck = useCallback((id: string) => decks.find((d) => d.id === id), [decks]);
  const getDecksForCategory = useCallback((categoryId: string) => decks.filter((d) => d.categoryId === categoryId), [decks]);

  return {
    categories,
    decks,
    isLoaded,
    loadError,
    getCategory,
    getDeck,
    getDecksForCategory,
    createCategory: store.createCategory,
    createDeck: store.createDeck,
    importDeck: store.importDeck,
    updateCategory: store.updateCategory,
    updateDeck: store.updateDeck,
    deleteDeck: store.deleteDeck,
    deleteCategory: store.deleteCategory,
    addCard: store.addCard,
    updateCard: store.updateCard,
    deleteCard: store.deleteCard,
    markCardReviewed: store.markCardReviewed,
  };
}
