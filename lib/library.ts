import { CONTENT_CATEGORIES, CONTENT_DECKS } from "@/content";
import type { ContentCard } from "@/lib/contentTypes";
import type { Card, Category, Deck } from "@/lib/types";
import type { UserData } from "@/lib/userData";

// Builds the library the app shows: the bundled content in content/, with the
// user's changes from user-data.json applied on top.

// Timestamp for built-in content the user hasn't touched.
const CONTENT_EPOCH = "2026-01-01T00:00:00.000Z";

export const CONTENT_CATEGORY_IDS = new Set(CONTENT_CATEGORIES.map((c) => c.id));
export const CONTENT_DECK_IDS = new Set(CONTENT_DECKS.map((d) => d.id));
export const CONTENT_CARDS = new Map(CONTENT_DECKS.flatMap((d) => d.cards.map((c) => [c.id, c] as const)));
const CONTENT_CARD_IDS_BY_DECK = new Map(CONTENT_DECKS.map((d) => [d.id, new Set(d.cards.map((c) => c.id))]));

// Whether a card is one of the bundled cards of this deck (as opposed to a
// card the user added or moved into it).
export function isContentCardOf(deckId: string, cardId: string): boolean {
  return CONTENT_CARD_IDS_BY_DECK.get(deckId)?.has(cardId) ?? false;
}

export function cardFromContent(card: ContentCard): Card {
  return { ...card, tags: [], learned: false, reviewCount: 0, dueAt: null, createdAt: CONTENT_EPOCH, updatedAt: CONTENT_EPOCH } as Card;
}

export function withProgress(card: Card, user: UserData): Card {
  const progress = user.progress[card.id];
  return progress ? { ...card, ...progress } : card;
}

export function buildLibrary(user: UserData): { categories: Category[]; decks: Deck[] } {
  const deletedCategories = new Set(user.deletedCategories);
  const deletedDecks = new Set(user.deletedDecks);
  const deletedCards = new Set(user.deletedCards);

  const categories: Category[] = [
    ...CONTENT_CATEGORIES.filter((c) => !deletedCategories.has(c.id)).map((c): Category => {
      const edited = user.editedCategories[c.id] as UserData["editedCategories"][string] | undefined;
      return { ...c, createdAt: CONTENT_EPOCH, updatedAt: CONTENT_EPOCH, ...edited };
    }),
    ...user.categories,
  ];
  const visibleCategories = new Set(categories.map((c) => c.id));

  const decks: Deck[] = [
    ...CONTENT_DECKS.filter((d) => visibleCategories.has(d.categoryId) && !deletedDecks.has(d.id)).map((d): Deck => {
      const edited = user.editedDecks[d.id] as UserData["editedDecks"][string] | undefined;
      return {
        id: d.id,
        categoryId: d.categoryId,
        title: edited?.title ?? d.title,
        sub: edited?.sub ?? d.sub,
        story: d.story,
        createdAt: CONTENT_EPOCH,
        updatedAt: edited?.updatedAt ?? CONTENT_EPOCH,
        cards: [
          ...d.cards.filter((c) => !deletedCards.has(c.id)).map((c) => user.editedCards[c.id] ?? cardFromContent(c)),
          ...(user.addedCards[d.id] ?? []),
        ].map((c) => withProgress(c, user)),
      };
    }),
    ...user.decks
      .filter((d) => visibleCategories.has(d.categoryId))
      .map((d) => ({ ...d, cards: d.cards.map((c) => withProgress(c, user)) })),
  ];

  return { categories, decks };
}
