// Validates the bundled content in content/. Run with `npm run check:content`.
//
// Checks: every deck file is listed in content/index.ts, ids are unique,
// decks point at existing categories, cards have their mode's fields, each
// vocabulary word appears once in the whole library, and vocabulary cards have
// at most MAX_VOCAB_EXAMPLES examples (pass --strict to require exactly that many).
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "content");
const MAX_VOCAB_EXAMPLES = 4;
const strict = process.argv.includes("--strict");

const REQUIRED = {
  vocab: ["word", "def", "examples"],
  case: ["scenario", "question", "answer"],
  pattern: ["pattern", "examples"],
  phrase: ["phrase", "meaning"],
  qa: ["q", "a"],
  code: ["task", "code"],
  speech: ["cue", "line"],
  poem: ["lines", "meaning"],
  stack: ["prompt", "fact"],
  story: ["title", "text"],
  email: ["purpose", "subject", "body"],
  infographic: ["layout", "title"],
  expression: ["phrase", "situation", "examples"],
};

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);

const categories = JSON.parse(readFileSync(path.join(ROOT, "categories.json"), "utf8"));
const categoryIds = new Set(categories.map((c) => c.id));
const index = readFileSync(path.join(ROOT, "index.ts"), "utf8");

const deckFiles = readdirSync(path.join(ROOT, "decks"), { recursive: true })
  .filter((f) => f.endsWith(".json"))
  .map((f) => path.join("decks", f));

const ids = new Map();
const claim = (id, where) => {
  if (ids.has(id)) fail(`duplicate id ${id} in ${where} (also in ${ids.get(id)})`);
  ids.set(id, where);
};
categories.forEach((c) => claim(c.id, "categories.json"));

const words = new Map();
let cardCount = 0;
let vocabShort = 0;

for (const file of deckFiles) {
  if (!index.includes(`"./${file}"`)) fail(`${file} is not listed in content/index.ts`);
  const deck = JSON.parse(readFileSync(path.join(ROOT, file), "utf8"));
  claim(deck.id, file);
  if (!categoryIds.has(deck.categoryId)) fail(`${file}: unknown category ${deck.categoryId}`);
  if (!deck.title) fail(`${file}: missing title`);
  for (const card of deck.cards) {
    cardCount += 1;
    const where = `${file} ${card.id}`;
    claim(card.id, file);
    const required = REQUIRED[card.mode];
    if (!required) {
      fail(`${where}: unknown mode ${card.mode}`);
      continue;
    }
    for (const field of required) {
      const v = card[field];
      if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0 && field !== "examples")) fail(`${where}: missing ${field}`);
    }
    if (card.mode === "vocab") {
      const key = card.word.toLowerCase().replace(/\s+/g, " ").trim();
      if (words.has(key)) fail(`${where}: "${card.word}" duplicates ${words.get(key)}`);
      words.set(key, where);
      if (card.examples.length > MAX_VOCAB_EXAMPLES) fail(`${where}: ${card.examples.length} examples (max ${MAX_VOCAB_EXAMPLES})`);
      if (card.examples.length < MAX_VOCAB_EXAMPLES) {
        vocabShort += 1;
        if (strict) fail(`${where}: only ${card.examples.length} examples`);
      }
      const seen = new Set();
      for (const ex of card.examples) {
        if (seen.has(ex)) fail(`${where}: repeated example "${ex}"`);
        seen.add(ex);
      }
    }
  }
}

for (const w of warnings) console.warn("warning:", w);
console.log(`${categories.length} categories, ${deckFiles.length} decks, ${cardCount} cards, ${words.size} vocabulary words`);
if (vocabShort) console.log(`${vocabShort} vocabulary cards have fewer than ${MAX_VOCAB_EXAMPLES} examples`);
if (errors.length) {
  for (const e of errors) console.error("error:", e);
  process.exit(1);
}
console.log("content OK");
