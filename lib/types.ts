export type CardMode =
  | "vocab"
  | "case"
  | "pattern"
  | "phrase"
  | "qa"
  | "code"
  | "speech"
  | "poem"
  | "stack"
  | "story"
  | "email"
  | "infographic"
  | "expression";

export type CardState = "new" | "due" | "learned";

interface BaseCard {
  id: string;
  tags: string[];
  learned: boolean;
  reviewCount: number;
  dueAt: string | null; // ISO date; null means new/due-now
  createdAt: string;
  updatedAt: string;
}

export interface VocabCard extends BaseCard {
  mode: "vocab";
  word: string;
  pron: string;
  def: string;
  examples: string[];
}

export interface CaseCard extends BaseCard {
  mode: "case";
  scenario: string;
  question: string;
  answer: string[];
}

export interface PatternCard extends BaseCard {
  mode: "pattern";
  pattern: string;
  hint: string;
  examples: string[];
}

export interface PhraseCard extends BaseCard {
  mode: "phrase";
  phrase: string;
  romaji: string;
  meaning: string;
  literal: string;
}

export interface QaCard extends BaseCard {
  mode: "qa";
  q: string;
  a: string;
  note: string;
}

export interface CodeCard extends BaseCard {
  mode: "code";
  task: string;
  code: string;
  note: string;
}

export interface SpeechCard extends BaseCard {
  mode: "speech";
  section: string;
  time: string;
  cue: string;
  line: string;
  note: string;
}

export interface PoemCard extends BaseCard {
  mode: "poem";
  form: string;
  lines: string[];
  meaning: string;
}

export interface StackCard extends BaseCard {
  mode: "stack";
  prompt: string;
  blocks: string[];
  fact: string;
}

export interface StoryCard extends BaseCard {
  mode: "story";
  genre: string;
  title: string;
  text: string[];
  takeaway: string;
}

export interface EmailCard extends BaseCard {
  mode: "email";
  purpose: string;
  context: string;
  subject: string;
  body: string;
  tip: string;
}

// "Say it" card: the front describes a situation, the back is the phrase to
// use in it. Built for functional phrases ("I'm afraid I disagree").
export interface ExpressionCard extends BaseCard {
  mode: "expression";
  phrase: string;
  situation: string;
  hindi: string;
  examples: string[];
}

export type InfographicLayout = "process" | "vocab" | "story" | "image";

export interface InfographicItem {
  emoji: string;
  heading: string;
  body: string;
}

export interface InfographicCard extends BaseCard {
  mode: "infographic";
  layout: InfographicLayout;
  title: string;
  items: InfographicItem[];
  // Data URL of an imported picture; only set when layout is "image".
  image?: string;
}

export type Card =
  | VocabCard
  | CaseCard
  | PatternCard
  | PhraseCard
  | QaCard
  | CodeCard
  | SpeechCard
  | PoemCard
  | StackCard
  | StoryCard
  | EmailCard
  | InfographicCard
  | ExpressionCard;

export interface StoryContent {
  kicker: string;
  title: string;
  dateline: string;
  words: string[];
  paras: string[];
}

// A leaf deck belongs to exactly one Category and holds the actual cards.
export interface Deck {
  id: string;
  categoryId: string;
  title: string;
  sub: string;
  cards: Card[];
  story?: StoryContent; // only ever present for vocab-mode decks
  createdAt: string;
  updatedAt: string;
}

// A category groups decks that share a mode (and therefore a front/back
// layout, hue, and glyph) — this is the artifact's top-level "deck" row.
export interface Category {
  id: string;
  title: string;
  sub: string;
  mode: CardMode;
  glyph: string;
  hue: number;
  createdAt: string;
  updatedAt: string;
}

export function cardState(card: Card): CardState {
  if (card.learned) return "learned";
  if (card.reviewCount === 0 && card.dueAt === null) return "new";
  return "due";
}

export function isCardDue(card: Card, now: number = Date.now()): boolean {
  if (card.learned) return false;
  if (card.dueAt === null) return true;
  return new Date(card.dueAt).getTime() <= now;
}
