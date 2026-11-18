# Next tasks — handoff prompt

Paste the prompt below into a new Claude Code session (after `/clear`) to continue.

---

## Prompt

Continue the Recall Deck content work. Read `CLAUDE.md` (the "Data" section) and this file (`docs/next-tasks.md`) first.

**Background (already done, don't redo):**
- Built-in content is bundled JSON in `content/` (one file per deck under `content/decks/<category>/`, categories in `content/categories.json`, all registered in `content/index.ts`). It is the source of truth; there is no seed TypeScript any more.
- User data (progress, edits, deletions, own cards) is one `user-data.json` on the device (`lib/userData.ts`), merged with content in `lib/library.ts`, served by the shared store `lib/store.ts` via `hooks/useDecks.ts`. Editing content needs **no migration**: devices pick up JSON changes on the next build.
- Duplicate vocabulary words were removed (each word exists once), the GRE deck was removed, and every vocabulary card has at most 4 examples.
- All card types render on one page (no flip), from `components/review/CardContent.tsx`.
- Done so far: Stand-up Meetings and Software Product Demo have 4 examples on every card; 20 new Email, 20 Case Study and 20 Q&A cards were added (`pack7-*` ids).
- DONE 2026-11-18: every vocabulary card (4,242) now has exactly 4 examples; `node scripts/check-content.mjs --strict` passes and the build is installed on emulator-5554. The main task below is complete; only the "Other pending items" remain.

**Main task: give every vocabulary card exactly 4 examples.**
Run `node scripts/vocab-examples.mjs status` to see what's left (it was 2,224 cards / 6,019 sentences across 22 deck files). Work deck by deck, in this order:
1. `content/decks/workplace-english/*` (work-and-engineering-communication, discussion-and-meeting-vocabulary, leadership-influence-and-career-growth, problem-solving-and-critical-thinking)
2. `content/decks/workplace-communication/convey-a-message.json`, `convey-ideas.json`
3. `content/decks/tech-and-finance-domain/*`
4. `content/decks/ielts-and-academic-vocabulary/*`
5. `content/decks/idioms-phrasal-verbs-and-proverbs/*`, `content/decks/english-expressions/*`
6. Everything else the status command lists.

For each deck:
1. `node scripts/vocab-examples.mjs list <deck.json>` shows each short card: id | word | meaning | existing examples.
2. Write a patch file **outside the repo** (your scratchpad), shaped `{ "<card id>": ["new example", ...] }`, with exactly as many new sentences as the card is missing (4 minus its current count).
3. `node scripts/vocab-examples.mjs apply <deck.json> <patch.json>`. It appends, keeps existing examples first, never exceeds 4 and skips exact repeats.

Rules for the sentences:
- Use the word or phrase exactly, with the meaning given on the card (not another sense of the word).
- Short, natural, everyday or workplace English for an Indian professional learning English; 6–16 words.
- Each example of a card shows a different situation; don't repeat or lightly reword the existing ones.
- Plain ASCII apostrophes are fine. No Hindi in examples (Hindi stays in the definition).
- Never change card ids, words or definitions; only add examples.

After every 2–3 decks:
- `npm run check:content` (must say "content OK"; add `--strict` at the very end: `node scripts/check-content.mjs --strict` must pass when everything is done).
- `npx tsc --noEmit` and `npm run lint`.
- Tell me which decks are finished and what's left.

When all decks are done, build and deploy to the emulator (see below) and check one card from a few decks shows 4 numbered examples.

**Deploy to the Android emulator (emulator-5554):**
```bash
npm run build && npx cap sync android
cd android && JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew installDebug && cd ..
~/Library/Android/sdk/platform-tools/adb -s emulator-5554 shell monkey -p com.recalldeck.app -c android.intent.category.LAUNCHER 1
```
Don't uninstall the app (that wipes user data) unless I ask.

**Other pending items (only if I ask):**
- Remove `@capacitor-community/sqlite`, `lib/sqlite/` and `lib/legacyMigration.ts` once every device has launched this version once (they only migrate data from the old database).
- DONE 2026-11-18: release APK rebuilt and copied to `RecallDeck.apk` (signed with the same key as before).
- Committed 2026-11-18 on branch `app-redesign-and-content`; not merged to main or pushed. Ask before further commits.
