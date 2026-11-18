import type { Card, CardMode, Category, Deck, StoryContent } from "@/lib/types";
import { MODES } from "@/lib/modes";
import { markCardReviewed as scheduleReview } from "@/lib/scheduling";
import { CONTENT_CATEGORY_IDS, CONTENT_DECK_IDS, buildLibrary, isContentCardOf } from "@/lib/library";
import { emptyUserData, readUserData, saveUserData, type UserData } from "@/lib/userData";

// The one library shared by every page. It is loaded once per app launch
// (bundled content + the user's data file) and every change updates the
// in-memory library and the user's data file together.

export interface LibraryState {
  categories: Category[];
  decks: Deck[];
  isLoaded: boolean;
  loadError: string | null;
}

const INITIAL: LibraryState = { categories: [], decks: [], isLoaded: false, loadError: null };
let state: LibraryState = INITIAL;
let user: UserData = emptyUserData();
const listeners = new Set<() => void>();

function setState(next: Partial<LibraryState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getSnapshot = () => state;
export const getServerSnapshot = () => INITIAL;

let loading: Promise<void> | null = null;

export function ensureLoaded(): void {
  loading ??= load();
}

async function load(): Promise<void> {
  try {
    let data = await readUserData();
    if (!data) {
      // First launch of this version: bring over data from the old database.
      const { migrateFromLegacyDatabase } = await import("@/lib/legacyMigration");
      data = (await migrateFromLegacyDatabase()) ?? emptyUserData();
      saveUserData(data);
    }
    user = data;
    setState({ ...buildLibrary(user), isLoaded: true, loadError: null });
  } catch (err) {
    console.error("[store] failed to load the library", err);
    const msg = err instanceof Error ? err.message : String(err);
    setState({ loadError: msg || "Unknown error" });
  }
}

// ── helpers ──

function commit(nextUser: UserData, next: Partial<LibraryState>) {
  user = nextUser;
  saveUserData(user);
  setState(next);
}

function nowIso(): string {
  return new Date().toISOString();
}

const withAdded = <T>(list: T[], value: T) => (list.includes(value) ? list : [...list, value]);

function omitKey<T>(record: Record<string, T>, key: string): Record<string, T> {
  const { [key]: _removed, ...rest } = record;
  void _removed;
  return rest;
}

function mapDeck(deckId: string, fn: (deck: Deck) => Deck): Deck[] {
  return state.decks.map((d) => (d.id === deckId ? fn(d) : d));
}

// Where a card the user owns lives in their data, if it isn't built in.
function replaceOwnCard(u: UserData, deckId: string, cardId: string, fn: (cards: Card[]) => Card[]): UserData | null {
  if (u.addedCards[deckId]?.some((c) => c.id === cardId)) {
    return { ...u, addedCards: { ...u.addedCards, [deckId]: fn(u.addedCards[deckId]) } };
  }
  const ownDeck = u.decks.find((d) => d.id === deckId);
  if (ownDeck?.cards.some((c) => c.id === cardId)) {
    return { ...u, decks: u.decks.map((d) => (d.id === deckId ? { ...d, cards: fn(d.cards) } : d)) };
  }
  return null;
}

// ── categories ──

export function createCategory(data: { title: string; sub: string; mode: CardMode }): Category {
  const m = MODES[data.mode];
  const cat: Category = {
    id: crypto.randomUUID(),
    title: data.title,
    sub: data.sub,
    mode: data.mode,
    glyph: m.defaultGlyph,
    hue: m.defaultHue,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  commit({ ...user, categories: [...user.categories, cat] }, { categories: [...state.categories, cat] });
  return cat;
}

export function updateCategory(id: string, changes: Pick<Category, "title" | "sub">) {
  const existing = state.categories.find((c) => c.id === id);
  if (!existing) return;
  const changed: Category = { ...existing, ...changes, updatedAt: nowIso() };
  const nextUser = CONTENT_CATEGORY_IDS.has(id)
    ? { ...user, editedCategories: { ...user.editedCategories, [id]: { title: changed.title, sub: changed.sub, updatedAt: changed.updatedAt } } }
    : { ...user, categories: user.categories.map((c) => (c.id === id ? changed : c)) };
  commit(nextUser, { categories: state.categories.map((c) => (c.id === id ? changed : c)) });
}

export function deleteCategory(id: string) {
  const ownDeckIds = new Set(user.decks.filter((d) => d.categoryId === id).map((d) => d.id));
  const nextUser: UserData = {
    ...user,
    categories: user.categories.filter((c) => c.id !== id),
    decks: user.decks.filter((d) => !ownDeckIds.has(d.id)),
    deletedCategories: CONTENT_CATEGORY_IDS.has(id) ? withAdded(user.deletedCategories, id) : user.deletedCategories,
  };
  commit(nextUser, {
    categories: state.categories.filter((c) => c.id !== id),
    decks: state.decks.filter((d) => d.categoryId !== id),
  });
}

// ── decks ──

function addOwnDeck(deck: Deck): Deck {
  commit({ ...user, decks: [...user.decks, deck] }, { decks: [...state.decks, deck] });
  return deck;
}

export function createDeck(categoryId: string, data: { title: string; sub: string }): Deck {
  return addOwnDeck({
    id: crypto.randomUUID(),
    categoryId,
    title: data.title,
    sub: data.sub,
    cards: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
}

export function importDeck(categoryId: string, data: { title: string; sub: string; cards: Card[]; story?: StoryContent }): Deck {
  const now = nowIso();
  return addOwnDeck({
    id: crypto.randomUUID(),
    categoryId,
    title: data.title,
    sub: data.sub,
    cards: data.cards.map((c) => ({ ...c, id: crypto.randomUUID() })),
    story: data.story,
    createdAt: now,
    updatedAt: now,
  });
}

export function updateDeck(id: string, changes: Partial<Pick<Deck, "title" | "sub">>) {
  const existing = state.decks.find((d) => d.id === id);
  if (!existing) return;
  const changed: Deck = { ...existing, ...changes, updatedAt: nowIso() };
  const nextUser = CONTENT_DECK_IDS.has(id)
    ? { ...user, editedDecks: { ...user.editedDecks, [id]: { title: changed.title, sub: changed.sub, updatedAt: changed.updatedAt } } }
    : { ...user, decks: user.decks.map((d) => (d.id === id ? { ...d, title: changed.title, sub: changed.sub, updatedAt: changed.updatedAt } : d)) };
  commit(nextUser, { decks: mapDeck(id, () => changed) });
}

export function deleteDeck(id: string) {
  const nextUser: UserData = {
    ...user,
    decks: user.decks.filter((d) => d.id !== id),
    addedCards: omitKey(user.addedCards, id),
    deletedDecks: CONTENT_DECK_IDS.has(id) ? withAdded(user.deletedDecks, id) : user.deletedDecks,
  };
  commit(nextUser, { decks: state.decks.filter((d) => d.id !== id) });
}

// ── cards ──

export function addCard(deckId: string, card: Card) {
  const ownDeck = user.decks.some((d) => d.id === deckId);
  const nextUser: UserData = ownDeck
    ? { ...user, decks: user.decks.map((d) => (d.id === deckId ? { ...d, cards: [...d.cards, card] } : d)) }
    : { ...user, addedCards: { ...user.addedCards, [deckId]: [...(user.addedCards[deckId] ?? []), card] } };
  commit(nextUser, { decks: mapDeck(deckId, (d) => ({ ...d, cards: [...d.cards, card], updatedAt: nowIso() })) });
}

export function updateCard(deckId: string, cardId: string, changes: Partial<Card>) {
  const existing = state.decks.find((d) => d.id === deckId)?.cards.find((c) => c.id === cardId);
  if (!existing) return;
  const updated = { ...existing, ...changes, updatedAt: nowIso() } as Card;
  const nextUser =
    replaceOwnCard(user, deckId, cardId, (cards) => cards.map((c) => (c.id === cardId ? updated : c))) ??
    { ...user, editedCards: { ...user.editedCards, [cardId]: updated } };
  commit(nextUser, {
    decks: mapDeck(deckId, (d) => ({ ...d, cards: d.cards.map((c) => (c.id === cardId ? updated : c)), updatedAt: nowIso() })),
  });
}

export function deleteCard(deckId: string, cardId: string) {
  let nextUser = replaceOwnCard(user, deckId, cardId, (cards) => cards.filter((c) => c.id !== cardId)) ?? user;
  if (isContentCardOf(deckId, cardId)) {
    nextUser = { ...nextUser, deletedCards: withAdded(nextUser.deletedCards, cardId) };
  }
  // Progress is kept: moving a card is a delete here followed by an add in
  // the other deck, with the same id.
  commit(nextUser, {
    decks: mapDeck(deckId, (d) => ({ ...d, cards: d.cards.filter((c) => c.id !== cardId), updatedAt: nowIso() })),
  });
}

export function markCardReviewed(deckId: string, cardId: string) {
  const existing = state.decks.find((d) => d.id === deckId)?.cards.find((c) => c.id === cardId);
  if (!existing) return;
  const reviewed = scheduleReview(existing);
  const { learned, reviewCount, dueAt, updatedAt } = reviewed;
  commit(
    { ...user, progress: { ...user.progress, [cardId]: { learned, reviewCount, dueAt, updatedAt } } },
    { decks: mapDeck(deckId, (d) => ({ ...d, cards: d.cards.map((c) => (c.id === cardId ? reviewed : c)) })) }
  );
}
