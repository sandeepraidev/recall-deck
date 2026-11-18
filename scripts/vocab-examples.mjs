// Helpers for topping up vocabulary examples in content/ deck files.
//
//   node scripts/vocab-examples.mjs status
//       Per deck file: how many vocab cards still have fewer than 4 examples.
//   node scripts/vocab-examples.mjs list <deck.json>
//       The short cards of one deck: id | word | meaning | existing examples.
//   node scripts/vocab-examples.mjs apply <deck.json> <patch.json>
//       Appends new examples. patch.json = { "<card id>": ["new example", ...] }.
//       Existing examples stay first; a card never gets more than 4; exact
//       repeats are skipped.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const MAX = 4;
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "content", "decks");
const [cmd, deckPath, patchPath] = process.argv.slice(2);

const load = (p) => JSON.parse(readFileSync(p, "utf8"));
const short = (deck) => deck.cards.filter((c) => c.mode === "vocab" && c.examples.length < MAX);

if (cmd === "status") {
  let total = 0;
  let sentences = 0;
  for (const f of readdirSync(ROOT, { recursive: true }).filter((f) => f.endsWith(".json")).sort()) {
    const s = short(load(path.join(ROOT, f)));
    if (s.length === 0) continue;
    const need = s.reduce((n, c) => n + MAX - c.examples.length, 0);
    total += s.length;
    sentences += need;
    console.log(`${String(s.length).padStart(4)} cards  ${String(need).padStart(4)} sentences  content/decks/${f}`);
  }
  console.log(`total: ${total} cards, ${sentences} sentences to write`);
} else if (cmd === "list" && deckPath) {
  for (const c of short(load(deckPath))) {
    console.log(`${c.id} | ${c.word} | ${c.def.split("\n")[0].slice(0, 80)} | ${c.examples.join(" // ")}`);
  }
} else if (cmd === "apply" && deckPath && patchPath) {
  const deck = load(deckPath);
  const patch = load(patchPath);
  const byId = new Map(deck.cards.map((c) => [c.id, c]));
  const unknown = Object.keys(patch).filter((id) => !byId.has(id));
  if (unknown.length) throw new Error(`unknown card ids: ${unknown.join(", ")}`);
  for (const [id, extra] of Object.entries(patch)) {
    const card = byId.get(id);
    for (const ex of extra) if (!card.examples.includes(ex) && card.examples.length < MAX) card.examples.push(ex);
  }
  writeFileSync(deckPath, JSON.stringify(deck, null, 1) + "\n");
  console.log(`${path.basename(deckPath)}: updated ${Object.keys(patch).length} cards, ${short(deck).length} still short`);
} else {
  console.log("usage: status | list <deck.json> | apply <deck.json> <patch.json>");
  process.exit(1);
}
