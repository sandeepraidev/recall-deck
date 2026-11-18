import { Capacitor } from "@capacitor/core";
import { CONTENT_CATEGORIES, CONTENT_DECKS } from "@/content";
import type { ContentCard } from "@/lib/contentTypes";
import { CONTENT_CARDS, CONTENT_CATEGORY_IDS, cardFromContent } from "@/lib/library";
import type { Card } from "@/lib/types";
import { emptyUserData, type UserData } from "@/lib/userData";

// Older versions kept the whole library in SQLite. On the first launch of
// this version, the user's own data (progress, their own cards and decks,
// edits and deletions of built-in content) is copied into user-data.json.
// Returns null when there is no old database to migrate.
export async function migrateFromLegacyDatabase(): Promise<UserData | null> {
  if (!Capacitor.isNativePlatform()) return null;
  const { readLegacyDatabase } = await import("@/lib/sqlite/legacyDatabase");
  const snapshot = await readLegacyDatabase();
  if (!snapshot) return null;

  const { categories, decks, cardIdsByDeck, meta } = snapshot;
  const user = emptyUserData();

  // Built-in ids look like "deck-12" or "pack6-card-40"; the user's own are
  // UUIDs. Built-in ids missing from content/ were dropped on purpose
  // (duplicates, the GRE deck), so they are not carried over.
  const isBuiltInId = (id: string) => /^(?:pack\d+-)?(?:card|deck|cat)-\d+$/.test(id);
  // Built-in content absent from the old database was deleted by the user,
  // unless its pack had simply not been imported yet.
  const wasImported = (id: string) => {
    const pack = /^pack(\d+)-/.exec(id);
    return meta.has(pack ? `contentPack${pack[1]}` : "initialized");
  };

  const keepProgress = (card: Card) => {
    if (card.reviewCount > 0 || card.learned || card.dueAt) {
      user.progress[card.id] = { learned: card.learned, reviewCount: card.reviewCount, dueAt: card.dueAt, updatedAt: card.updatedAt };
    }
  };

  const dbCategoryIds = new Set(categories.map((c) => c.id));
  for (const cat of categories) {
    if (CONTENT_CATEGORY_IDS.has(cat.id)) {
      const content = CONTENT_CATEGORIES.find((c) => c.id === cat.id)!;
      if (cat.title !== content.title || cat.sub !== content.sub) {
        user.editedCategories[cat.id] = { title: cat.title, sub: cat.sub, updatedAt: cat.updatedAt };
      }
    } else if (!isBuiltInId(cat.id)) {
      user.categories.push(cat);
    }
  }
  for (const cat of CONTENT_CATEGORIES) {
    if (!dbCategoryIds.has(cat.id) && wasImported(cat.id)) user.deletedCategories.push(cat.id);
  }

  const dbDeckIds = new Set(decks.map((d) => d.id));
  for (const deck of decks) {
    const content = CONTENT_DECKS.find((d) => d.id === deck.id);
    if (!content) {
      if (!isBuiltInId(deck.id)) {
        user.decks.push(deck);
        deck.cards.forEach(keepProgress);
      }
      continue;
    }
    if (deck.title !== content.title || deck.sub !== content.sub) {
      user.editedDecks[deck.id] = { title: deck.title, sub: deck.sub, updatedAt: deck.updatedAt };
    }
    const contentIds = new Set(content.cards.map((c) => c.id));
    const dbCardIds = cardIdsByDeck.get(deck.id) ?? new Set<string>();
    const loaded = new Set(deck.cards.map((c) => c.id));
    for (const id of dbCardIds) {
      // An untouched built-in card the user moved here from another deck.
      if (!loaded.has(id) && !contentIds.has(id) && CONTENT_CARDS.has(id)) {
        (user.addedCards[deck.id] ??= []).push(cardFromContent(CONTENT_CARDS.get(id)!));
      }
    }
    for (const card of deck.cards) {
      if (contentIds.has(card.id)) {
        keepProgress(card);
        if (isEdited(card, CONTENT_CARDS.get(card.id)!)) user.editedCards[card.id] = card;
      } else if (!isBuiltInId(card.id) || CONTENT_CARDS.has(card.id)) {
        // The user's own card, or a built-in card they moved here.
        (user.addedCards[deck.id] ??= []).push(card);
        keepProgress(card);
      }
    }
    for (const id of contentIds) if (!dbCardIds.has(id)) user.deletedCards.push(id);
  }
  for (const deck of CONTENT_DECKS) {
    if (!dbDeckIds.has(deck.id) && wasImported(deck.id)) user.deletedDecks.push(deck.id);
  }

  return user;
}

const PROGRESS_FIELDS = new Set(["id", "tags", "learned", "reviewCount", "dueAt", "createdAt", "updatedAt"]);

function textFields(card: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(card).filter(([k, v]) => !PROGRESS_FIELDS.has(k) && k !== "examples" && v !== null && v !== undefined)
  );
}

function sameValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// Whether the user changed a built-in card. Example lists were trimmed and
// extended when the content moved to JSON, so they only count as edited when
// neither list is a continuation of the other.
function isEdited(card: Card, content: ContentCard): boolean {
  const mine = textFields(card);
  const theirs = textFields(content);
  const keys = new Set([...Object.keys(mine), ...Object.keys(theirs)]);
  for (const k of keys) if (!sameValue(mine[k], theirs[k])) return true;
  if ("examples" in card && "examples" in content) {
    const a = card.examples;
    const b = content.examples;
    const n = Math.min(a.length, b.length);
    return !sameValue(a.slice(0, n), b.slice(0, n));
  }
  return false;
}
