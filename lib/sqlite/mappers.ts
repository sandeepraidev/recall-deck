import type {
  Card,
  CardMode,
  Category,
  Deck,
  InfographicItem,
  InfographicLayout,
  StoryContent,
} from "@/lib/types";
import { parseExamples } from "@/lib/examples";

export interface CategoryRow {
  id: string;
  title: string;
  sub: string;
  mode: string;
  glyph: string;
  hue: number;
  created_at: string;
  updated_at: string;
}

export interface DeckRow {
  id: string;
  category_id: string;
  title: string;
  sub: string;
  created_at: string;
  updated_at: string;
}

export interface DeckStoryRow {
  deck_id: string;
  kicker: string;
  title: string;
  dateline: string;
}

export interface CardRow {
  id: string;
  deck_id: string;
  mode: string;
  learned: number;
  review_count: number;
  due_at: string | null;
  created_at: string;
  updated_at: string;

  vocab_word: string | null;
  vocab_pron: string | null;
  vocab_def: string | null;
  vocab_ex: string | null;
  case_scenario: string | null;
  case_question: string | null;
  pattern_pattern: string | null;
  pattern_hint: string | null;
  phrase_phrase: string | null;
  phrase_romaji: string | null;
  phrase_meaning: string | null;
  phrase_literal: string | null;
  qa_q: string | null;
  qa_a: string | null;
  qa_note: string | null;
  code_task: string | null;
  code_code: string | null;
  code_note: string | null;
  speech_section: string | null;
  speech_time: string | null;
  speech_cue: string | null;
  speech_line: string | null;
  speech_note: string | null;
  poem_form: string | null;
  poem_meaning: string | null;
  stack_prompt: string | null;
  stack_fact: string | null;
  story_genre: string | null;
  story_title: string | null;
  story_takeaway: string | null;
  email_purpose: string | null;
  email_context: string | null;
  email_subject: string | null;
  email_body: string | null;
  email_tip: string | null;
  infographic_layout: string | null;
  infographic_title: string | null;
  infographic_items: string | null;
  infographic_image: string | null;
  expression_phrase: string | null;
  expression_situation: string | null;
  expression_hindi: string | null;
}

export type ListItemOwnerType = "card" | "deck_story";

export interface ListItemRow {
  owner_type: ListItemOwnerType;
  owner_id: string;
  field: string;
  position: number;
  value: string;
}

export function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    title: row.title,
    sub: row.sub,
    mode: row.mode as CardMode,
    glyph: row.glyph,
    hue: row.hue,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function rowToDeck(row: DeckRow, cards: Card[], story?: StoryContent): Deck {
  return {
    id: row.id,
    categoryId: row.category_id,
    title: row.title,
    sub: row.sub,
    cards,
    story,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function rowsToStory(row: DeckStoryRow, listItemsByField: Map<string, string[]>): StoryContent {
  return {
    kicker: row.kicker,
    title: row.title,
    dateline: row.dateline,
    words: listItemsByField.get("words") ?? [],
    paras: listItemsByField.get("paras") ?? [],
  };
}

function parseLayout(raw: string | null): InfographicLayout {
  return raw === "vocab" || raw === "story" || raw === "image" ? raw : "process";
}

function parseItems(raw: string | null): InfographicItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((it) => ({
      emoji: typeof it?.emoji === "string" ? it.emoji : "",
      heading: typeof it?.heading === "string" ? it.heading : "",
      body: typeof it?.body === "string" ? it.body : "",
    }));
  } catch {
    return [];
  }
}

export function rowToCard(row: CardRow, listItemsByField: Map<string, string[]>): Card {
  const base = {
    id: row.id,
    tags: listItemsByField.get("tags") ?? [],
    learned: row.learned === 1,
    reviewCount: row.review_count,
    dueAt: row.due_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  const mode = row.mode as CardMode;
  switch (mode) {
    case "vocab":
      return { ...base, mode, word: row.vocab_word ?? "", pron: row.vocab_pron ?? "", def: row.vocab_def ?? "", examples: parseExamples(row.vocab_ex) };
    case "case":
      return {
        ...base,
        mode,
        scenario: row.case_scenario ?? "",
        question: row.case_question ?? "",
        answer: listItemsByField.get("answer") ?? [],
      };
    case "pattern":
      return {
        ...base,
        mode,
        pattern: row.pattern_pattern ?? "",
        hint: row.pattern_hint ?? "",
        examples: listItemsByField.get("examples") ?? [],
      };
    case "phrase":
      return {
        ...base,
        mode,
        phrase: row.phrase_phrase ?? "",
        romaji: row.phrase_romaji ?? "",
        meaning: row.phrase_meaning ?? "",
        literal: row.phrase_literal ?? "",
      };
    case "qa":
      return { ...base, mode, q: row.qa_q ?? "", a: row.qa_a ?? "", note: row.qa_note ?? "" };
    case "code":
      return { ...base, mode, task: row.code_task ?? "", code: row.code_code ?? "", note: row.code_note ?? "" };
    case "speech":
      return {
        ...base,
        mode,
        section: row.speech_section ?? "",
        time: row.speech_time ?? "",
        cue: row.speech_cue ?? "",
        line: row.speech_line ?? "",
        note: row.speech_note ?? "",
      };
    case "poem":
      return {
        ...base,
        mode,
        form: row.poem_form ?? "",
        meaning: row.poem_meaning ?? "",
        lines: listItemsByField.get("lines") ?? [],
      };
    case "stack":
      return {
        ...base,
        mode,
        prompt: row.stack_prompt ?? "",
        fact: row.stack_fact ?? "",
        blocks: listItemsByField.get("blocks") ?? [],
      };
    case "story":
      return {
        ...base,
        mode,
        genre: row.story_genre ?? "",
        title: row.story_title ?? "",
        takeaway: row.story_takeaway ?? "",
        text: listItemsByField.get("text") ?? [],
      };
    case "email":
      return {
        ...base,
        mode,
        purpose: row.email_purpose ?? "",
        context: row.email_context ?? "",
        subject: row.email_subject ?? "",
        body: row.email_body ?? "",
        tip: row.email_tip ?? "",
      };
    case "infographic":
      return {
        ...base,
        mode,
        layout: parseLayout(row.infographic_layout),
        title: row.infographic_title ?? "",
        items: parseItems(row.infographic_items),
        ...(row.infographic_image ? { image: row.infographic_image } : {}),
      };
    case "expression":
      return {
        ...base,
        mode,
        phrase: row.expression_phrase ?? "",
        situation: row.expression_situation ?? "",
        hindi: row.expression_hindi ?? "",
        examples: listItemsByField.get("examples") ?? [],
      };
  }
}
