# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 political campaign landing page for "สุรสิทธิ์ นิธิวุฒิวรรักษ์" (Surasit Nithiwuttiwarak), a candidate for Member of Parliament in Chonburi District 6, Thailand. The site is a Thai-language single-page application.

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
- **Styling**: Tailwind CSS 4 (via @tailwindcss/postcss)
- **Language**: TypeScript (strict mode)

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata (Thai language)
│   ├── page.tsx        # Entry point, renders SurasitLandingPagePro
│   ├── globals.css     # Tailwind imports and CSS variables
│   └── favicon.ico
└── components/
    └── SurasitLandingPage.tsx  # Main component (~1200 lines)
```

### Key Patterns

- **Single-page app**: All sections are in `SurasitLandingPage.tsx` with smooth scroll navigation
- **Client component**: Uses `"use client"` directive for interactivity (scroll tracking, counters, lightbox)
- **Custom hooks**:
  - `useInView`: IntersectionObserver for scroll-triggered animations
  - `useCountUp`: Animated number counter with easing
- **Animation components**: `AnimateIn` and `StaggerIn` for reveal animations
- **Path alias**: `@/*` maps to `./src/*`

### Static Assets

Images are served from `/public/` and referenced directly (e.g., `/logo.jpg`, `/baner.jpg`, `/sura1.png`).

## Notes

- Thai language throughout - metadata, content, and comments
- Deployed to Vercel (references `surasit-landing.vercel.app`)
- Election date hardcoded as February 8, 2026 (Buddhist Era 2569)
