import type { Card, CardMode, InfographicItem, InfographicLayout } from "@/lib/types";

// The edit screen only exposes two free-text fields (front/back), matching
// the source design's editFrontLabel/editBackLabel — but several modes pack
// more than one structured field into "back" (e.g. vocab's "DEFINITION &
// EXAMPLE"). These functions define one consistent text convention per mode
// so a real create/edit form can round-trip through two textareas.

function firstLineRest(text: string): [string, string] {
  const idx = text.indexOf("\n");
  if (idx === -1) return [text.trim(), ""];
  return [text.slice(0, idx).trim(), text.slice(idx + 1).trim()];
}

function lastLineRest(text: string): [string, string] {
  const lines = text.split("\n");
  const last = (lines.pop() ?? "").trim();
  return [lines.join("\n").trim(), last];
}

function splitLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");
}

function splitParas(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p !== "");
}

export function formFrontFor(card: Card): string {
  switch (card.mode) {
    case "vocab":
      return card.word;
    case "case":
      return card.scenario ? `${card.scenario}\n${card.question}` : card.question;
    case "pattern":
      return card.pattern;
    case "phrase":
      return card.phrase;
    case "qa":
      return card.q;
    case "code":
      return card.task;
    case "speech":
      return card.cue;
    case "poem":
      return card.form;
    case "stack":
      return card.prompt;
    case "story":
      return card.title;
    case "email":
      return card.purpose;
    case "infographic":
      return card.title;
    case "expression":
      return card.hindi ? `${card.situation}\n${card.hindi}` : card.situation;
  }
}

export function formBackFor(card: Card): string {
  switch (card.mode) {
    case "vocab":
      return card.def;
    case "case":
      return card.answer.join("\n");
    case "pattern":
      return card.examples.join("\n");
    case "phrase":
      return card.literal ? `${card.meaning}\n${card.literal}` : card.meaning;
    case "qa":
      return card.note ? `${card.a}\n${card.note}` : card.a;
    case "code":
      return card.code;
    case "speech":
      return card.note ? `${card.line}\n${card.note}` : card.line;
    case "poem":
      return [...card.lines, card.meaning].join("\n");
    case "stack":
      return card.fact;
    case "story":
      return [...card.text, card.takeaway].join("\n\n");
    case "email":
      return `${card.subject}\n${card.body}`;
    case "infographic":
      return "";
    case "expression":
      return [card.phrase, ...card.examples].join("\n");
  }
}

// Distributes over the Card union so each switch branch below can return
// its own variant's shape (a plain Omit<Card, ...> collapses to only the
// fields common to every variant, since Card is itself a union).
type NewCardFields<C extends Card = Card> = C extends unknown
  ? Omit<C, "id" | "tags" | "learned" | "reviewCount" | "dueAt" | "createdAt" | "updatedAt">
  : never;

// `examples` comes from the vocab form's separate example inputs; other modes ignore it.
export function parseCardFields(
  mode: CardMode,
  front: string,
  back: string,
  existing?: Card,
  examples: string[] = []
): NewCardFields {
  switch (mode) {
    case "vocab": {
      const prev = existing?.mode === "vocab" ? existing : undefined;
      return {
        mode,
        word: front,
        pron: prev?.pron ?? "",
        def: back.trim(),
        examples: examples.map((e) => e.trim()).filter((e) => e !== ""),
      };
    }
    case "case": {
      const [scenario, question] = lastLineRest(front);
      return { mode, scenario, question: question || scenario, answer: splitLines(back) };
    }
    case "pattern": {
      const prev = existing?.mode === "pattern" ? existing : undefined;
      return { mode, pattern: front, hint: prev?.hint ?? "", examples: splitLines(back) };
    }
    case "phrase": {
      const [meaning, literal] = firstLineRest(back);
      const prev = existing?.mode === "phrase" ? existing : undefined;
      return { mode, phrase: front, romaji: prev?.romaji ?? "", meaning, literal };
    }
    case "qa": {
      const [a, note] = firstLineRest(back);
      return { mode, q: front, a, note };
    }
    case "code": {
      const prev = existing?.mode === "code" ? existing : undefined;
      return { mode, task: front, code: back, note: prev?.note ?? "" };
    }
    case "speech": {
      const [line, note] = firstLineRest(back);
      const prev = existing?.mode === "speech" ? existing : undefined;
      return { mode, section: prev?.section ?? "", time: prev?.time ?? "", cue: front, line, note };
    }
    case "poem": {
      const [lines, meaning] = lastLineRest(back);
      return { mode, form: front, lines: splitLines(lines), meaning };
    }
    case "stack": {
      const prev = existing?.mode === "stack" ? existing : undefined;
      return { mode, prompt: front, blocks: prev?.blocks ?? [], fact: back };
    }
    case "story": {
      const paras = splitParas(back);
      const takeaway = paras.pop() ?? "";
      const prev = existing?.mode === "story" ? existing : undefined;
      return { mode, genre: prev?.genre ?? "Original", title: front, text: paras.length ? paras : [back], takeaway };
    }
    case "email": {
      const [subject, body] = firstLineRest(back);
      const prev = existing?.mode === "email" ? existing : undefined;
      return { mode, purpose: front, context: prev?.context ?? "", subject, body, tip: prev?.tip ?? "" };
    }
    case "expression": {
      const [situation, hindi] = firstLineRest(front);
      const [phrase, ...examples] = splitLines(back);
      return { mode, phrase: phrase ?? "", situation, hindi, examples };
    }
    case "infographic": {
      // Layout and items come from the structured editor, not the text fields.
      const prev = existing?.mode === "infographic" ? existing : undefined;
      return {
        mode,
        layout: prev?.layout ?? "process",
        title: front,
        items: prev?.items ?? [],
        ...(prev?.image ? { image: prev.image } : {}),
      };
    }
  }
}

// Starter content shown in a new infographic card's editor, so each layout's
// intended shape is obvious before the user types anything.
export function emptyInfographic(layout: InfographicLayout): InfographicItem[] {
  switch (layout) {
    case "process":
      return [
        { emoji: "💧", heading: "Boil water", body: "Bring a cup of water to a rolling boil." },
        { emoji: "🍃", heading: "Add tea leaves", body: "Steep for 3 minutes." },
        { emoji: "🥛", heading: "Add milk", body: "Pour in and simmer briefly." },
      ];
    case "vocab":
      return [
        { emoji: "🍎", heading: "Apple", body: "A round fruit, red or green." },
        { emoji: "🍌", heading: "Banana", body: "A long yellow fruit." },
      ];
    case "image":
      return [];
    case "story":
      return [
        { emoji: "🌅", heading: "Once upon a time", body: "Set the scene." },
        { emoji: "⚡", heading: "Then", body: "Something changes." },
        { emoji: "🌟", heading: "In the end", body: "How it resolves." },
      ];
  }
}
