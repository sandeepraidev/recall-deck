import type { Card } from "@/lib/types";

// One-line summaries used by list rows (Deck Detail's "all cards" list).
export function frontPreview(card: Card): string {
  switch (card.mode) {
    case "vocab":
      return card.word;
    case "case":
      return card.question;
    case "pattern":
      return card.pattern;
    case "phrase":
      return `${card.phrase}  ${card.romaji}`;
    case "qa":
      return card.q;
    case "code":
      return card.task;
    case "speech":
      return `${card.section} — ${card.cue}`;
    case "email":
      return card.purpose;
    case "poem":
      return `${card.form} — ${card.lines[0] ?? ""}`;
    case "stack":
      return card.prompt;
    case "story":
      return card.title;
    case "infographic":
      return card.title;
    case "expression":
      return card.phrase;
  }
}

export function backPreview(card: Card): string {
  switch (card.mode) {
    case "vocab":
      return card.def;
    case "case":
      return card.answer[0] ?? "";
    case "pattern":
      return card.examples[0] ?? "";
    case "phrase":
      return card.meaning;
    case "qa":
      return card.a;
    case "code":
      return card.code.replace(/\n/g, " ");
    case "speech":
      return card.line;
    case "email":
      return card.subject;
    case "poem":
      return card.meaning;
    case "stack":
      return card.fact;
    case "story":
      return card.text[0] ?? "";
    case "infographic": {
      if (card.layout === "image") return "image";
      const noun = card.layout === "process" ? "step" : card.layout === "vocab" ? "word" : "panel";
      const n = card.items.length;
      return `${card.layout} · ${n} ${noun}${n === 1 ? "" : "s"}`;
    }
    case "expression":
      return card.situation;
  }
}
