import type { Card } from "@/lib/types";

// Vocab examples used to be one newline-joined string (`ex`); they are now a
// string[] (`examples`). These helpers read either shape so SQLite rows, old
// exports and the legacy localStorage blob keep working.

export function splitExamples(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");
}

// Parses the `vocab_ex` column: a JSON array, or a legacy newline-delimited string.
export function parseExamples(raw: string | null | undefined): string[] {
  if (!raw) return [];
  if (raw.startsWith("[")) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((e): e is string => typeof e === "string" && e.trim() !== "");
    } catch {
      // Not JSON after all (a sentence starting with "["); fall through.
    }
  }
  return splitExamples(raw);
}

// Converts a vocab card carrying the legacy `ex` string to `examples`.
export function normalizeCard<C extends Card>(card: C): C {
  if (card.mode !== "vocab") return card;
  const { ex, ...rest } = card as C & { ex?: unknown };
  const examples = Array.isArray(card.examples)
    ? card.examples
    : typeof ex === "string"
      ? splitExamples(ex)
      : [];
  return { ...rest, examples } as C;
}
