import type { Card, Category, StoryContent } from "@/lib/types";

// Shapes of the bundled JSON files in content/. They hold only what a card
// says; progress, timestamps and tags come from the user's data at runtime.

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type ContentCard = DistributiveOmit<Card, "tags" | "createdAt" | "updatedAt" | "learned" | "reviewCount" | "dueAt">;

export type ContentCategory = Omit<Category, "createdAt" | "updatedAt">;

export interface ContentDeck {
  id: string;
  categoryId: string;
  title: string;
  sub: string;
  story?: StoryContent;
  cards: ContentCard[];
}
