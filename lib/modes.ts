import type { CardMode } from "@/lib/types";

export interface ModeDefinition {
  id: CardMode;
  name: string;
  editFrontLabel: string;
  editBackLabel: string;
  editFrontPlaceholder: string;
  editBackPlaceholder: string;
  defaultHue: number;
  defaultGlyph: string;
}

export const MODES: Record<CardMode, ModeDefinition> = {
  vocab: {
    id: "vocab",
    name: "Vocabulary",
    editFrontLabel: "WORD",
    editBackLabel: "DEFINITION",
    editFrontPlaceholder: "e.g. Ephemeral",
    editBackPlaceholder: "Meaning of the word",
    defaultHue: 285,
    defaultGlyph: "V",
  },
  case: {
    id: "case",
    name: "Case Study",
    editFrontLabel: "SCENARIO & PROMPT",
    editBackLabel: "MODEL APPROACH",
    editFrontPlaceholder: "Describe the situation and the question…",
    editBackPlaceholder: "Outline the structured answer…",
    defaultHue: 155,
    defaultGlyph: "C",
  },
  pattern: {
    id: "pattern",
    name: "Sentence Pattern",
    editFrontLabel: "PATTERN",
    editBackLabel: "EXAMPLES",
    editFrontPlaceholder: "e.g. No sooner ___ than ___",
    editBackPlaceholder: "One example per line",
    defaultHue: 60,
    defaultGlyph: "S",
  },
  phrase: {
    id: "phrase",
    name: "Phrase",
    editFrontLabel: "PHRASE",
    editBackLabel: "MEANING",
    editFrontPlaceholder: "e.g. お願いします",
    editBackPlaceholder: "Meaning and any literal note",
    defaultHue: 25,
    defaultGlyph: "語",
  },
  qa: {
    id: "qa",
    name: "Q & A",
    editFrontLabel: "QUESTION",
    editBackLabel: "ANSWER",
    editFrontPlaceholder: "Type the question…",
    editBackPlaceholder: "The answer, plus an optional note",
    defaultHue: 250,
    defaultGlyph: "Q",
  },
  code: {
    id: "code",
    name: "Code",
    editFrontLabel: "TASK",
    editBackLabel: "CODE & NOTE",
    editFrontPlaceholder: "e.g. Swap two variables",
    editBackPlaceholder: "The code snippet…",
    defaultHue: 320,
    defaultGlyph: "{ }",
  },
  speech: {
    id: "speech",
    name: "Speech",
    editFrontLabel: "CUE / SECTION",
    editBackLabel: "LINE & DELIVERY",
    editFrontPlaceholder: "e.g. Opening hook",
    editBackPlaceholder: "The line you will say, and a delivery note…",
    defaultHue: 200,
    defaultGlyph: "“",
  },
  poem: {
    id: "poem",
    name: "Poem",
    editFrontLabel: "FORM",
    editBackLabel: "LINES & MEANING",
    editFrontPlaceholder: "e.g. Ghazal Couplet",
    editBackPlaceholder: "The lines, one per row…",
    defaultHue: 15,
    defaultGlyph: "❝",
  },
  stack: {
    id: "stack",
    name: "Stack (DSA)",
    editFrontLabel: "OPERATION",
    editBackLabel: "EXPLANATION",
    editFrontPlaceholder: "e.g. Push: add to the top",
    editBackPlaceholder: "How the operation works…",
    defaultHue: 340,
    defaultGlyph: "▤",
  },
  story: {
    id: "story",
    name: "Story",
    editFrontLabel: "TITLE",
    editBackLabel: "TEXT & TAKEAWAY",
    editFrontPlaceholder: "e.g. The Cracked Pot",
    editBackPlaceholder: "The story text, then a takeaway…",
    defaultHue: 265,
    defaultGlyph: "☰",
  },
  email: {
    id: "email",
    name: "Email",
    editFrontLabel: "PURPOSE",
    editBackLabel: "SUBJECT & BODY",
    editFrontPlaceholder: "e.g. Decline a meeting politely",
    editBackPlaceholder: "Subject line, then the email body…",
    defaultHue: 100,
    defaultGlyph: "@",
  },
  infographic: {
    id: "infographic",
    name: "Infographic",
    editFrontLabel: "TITLE",
    editBackLabel: "ITEMS",
    editFrontPlaceholder: "e.g. How to make masala chai",
    editBackPlaceholder: "",
    defaultHue: 45,
    defaultGlyph: "◈",
  },
  expression: {
    id: "expression",
    name: "Expression",
    editFrontLabel: "SITUATION",
    editBackLabel: "PHRASE & EXAMPLES",
    editFrontPlaceholder: "When to use it, then an optional Hindi line",
    editBackPlaceholder: "The phrase, then one example per line",
    defaultHue: 180,
    defaultGlyph: "»",
  },
};

export const MODE_LIST: ModeDefinition[] = Object.values(MODES);
