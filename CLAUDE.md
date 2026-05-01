# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

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
