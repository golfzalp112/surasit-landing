# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 political campaign landing page for "สุรสิทธิ์ นิธิวุฒิวรรักษ์" (Surasit Nithiwuttiwarak), MP candidate for Chonburi District 6, Thailand. Thai-language single-page application.

## Commands

```bash
npm run dev     # Start development server at localhost:3000
npm run build   # Build for production
npm run start   # Run production server
npm run lint    # Run ESLint (eslint-config-next with core-web-vitals + TypeScript)
```

## Tech Stack

- **Framework**: Next.js 16.1.1 with App Router
- **React**: 19.2.3
- **Styling**: Tailwind CSS 4 (v4 syntax with `@import "tailwindcss"` and `@theme inline`)
- **Language**: TypeScript (strict mode)

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with Thai metadata (lang="th")
│   ├── page.tsx        # Entry point, renders SurasitLandingPagePro
│   ├── globals.css     # Tailwind v4 imports and CSS variables
│   └── favicon.ico
└── components/
    └── SurasitLandingPage.tsx  # Main component (~1150 lines)
```

### Key Patterns

- **Single-page app**: All sections in `SurasitLandingPage.tsx` with smooth scroll navigation between sections (hero, problems, solutions, credentials, track-record, vote, area)
- **Client component**: Uses `"use client"` directive for interactivity (scroll tracking, lightbox, countdown timer)
- **Custom hook**: `useInView` - IntersectionObserver for scroll-triggered animations
- **Animation component**: `AnimateIn` wraps content with fade/scale/slide reveal effects (fadeUp, fadeLeft, fadeRight, scale, flip)
- **Inline CSS keyframes**: Animations (`float`, `slideDown`, `floatRotate`, `spin`, `marquee`) defined in component's `<style>` tag
- **Path alias**: `@/*` maps to `./src/*`

### Static Assets

Images served from `/public/` and referenced directly (e.g., `/logo.jpg`, `/baner.png`, `/sura1.png`, `/qr.jpg`).

## Notes

- Thai language throughout - metadata, content, and Thai comments in code
- Deployed to Vercel (`surasit-landing.vercel.app`)
- Election date hardcoded as February 8, 2026 (Buddhist Era 2569)
- External integrations: Google Drive video embed, LINE Official Account, Facebook share
