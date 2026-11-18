# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run check:content  # Validate the bundled content in content/
```

## Data

- **Built-in content** lives in `content/`: one JSON file per deck under `content/decks/<category>/`, categories in `content/categories.json`, all registered in `content/index.ts`. These files are the source of truth and are bundled into the app. Card/deck/category ids must never change once shipped (user progress and edits are keyed by them).
- **User data** (review progress, edits/deletions of built-in content, the user's own categories/decks/cards) is one JSON file on the device, `user-data.json` (`lib/userData.ts`; localStorage on web).
- `lib/library.ts` merges the two; `lib/store.ts` is the single shared in-memory store every page reads through `hooks/useDecks.ts`.
- `lib/sqlite/` and `lib/legacyMigration.ts` only exist to copy data from the old SQLite database on the first launch after upgrading.

## Architecture

This is a **Next.js 16 App Router** project using React 19, TypeScript (strict mode), and Tailwind CSS v4.

**Key conventions:**
- All routes and layouts live under `app/` using file-based App Router conventions
- Default components are React Server Components; add `"use client"` explicitly for client components
- Path alias `@/*` maps to the project root
- Fonts are loaded via `next/font` in `app/layout.tsx` and applied through CSS variables
- Tailwind CSS v4 is configured via PostCSS (`postcss.config.mjs`); no `tailwind.config.js` — theme tokens are defined in `app/globals.css` using `@theme inline`
- ESLint uses the flat config format (`eslint.config.mjs`) with Next.js core web vitals rules

No test framework is configured yet.
