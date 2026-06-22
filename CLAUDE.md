# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See the root `../CLAUDE.md` for full project context, data pipeline, and architecture overview.

---

## Critical: Dev Server

```bash
npm run dev -- --webpack   # Turbopack causes file permission errors — always use --webpack
node_modules/.bin/tsc --noEmit   # npx tsc installs wrong package
npm run build              # Full production build — run before deploying
```

---

## Next.js 16 Breaking Changes

@AGENTS.md

- `middleware.ts` → `proxy.ts`, export named `proxy` (not default export)
- Tailwind v4: `@import "tailwindcss"` + `@theme {}` in CSS — no `tailwind.config.ts`
- Async Server Components: `getTranslations()` from `next-intl/server`, not `useTranslations()`
- Layout params are a `Promise`: `const { locale } = await params`
- Always import `Link`, `useRouter`, `usePathname` from `@/i18n/navigation`, not `next/navigation`

---

## Design System — Current Palette

Warm earthy luxury aesthetic. **Do not revert to old dark navy palette.**

| Token | Value | Usage |
|---|---|---|
| `#F5F1EA` | cream | page/section backgrounds |
| `#E8E2D5` | taupe | card borders, secondary bg |
| `#B8956A` | warm gold | all gold accents, CTAs, dividers |
| `#2A2620` | charcoal | primary text, dark buttons |
| `#6B6358` | warm grey | secondary text, labels |
| `#1A1814` | near-black | footer, dark panels |

Three fonts loaded in `app/[locale]/layout.tsx`:
- `--font-cairo` — Arabic UI (Cairo)
- `--font-cormorant` — luxury display serif (Cormorant Garamond weight 300 italic — all headings)
- `--font-manrope` — body/UI sans-serif (Latin)

`--font-sans` composes all three in priority order via `@theme {}` in `globals.css`.

---

## Homepage Sections

`app/[locale]/page.tsx` renders: `HeroSection → AnimatedCategories → EditorialRows → FeaturedProductsSection → VisitShowroom CTA → WhatsAppButton`

**HeroSection** — full-bleed video (`/public/hero-video.mp4`) with cream gradient vignettes. Content anchored bottom-left (bottom-right for RTL Arabic). No Three.js — `LuxuryScene.tsx` exists in `components/` but is unused; do not re-import it into HeroSection.

**AnimatedCategories** — 5 category cards, cream section bg, taupe card gradients. Links to `/products?category={id}`.

**EditorialRows** — two alternating full-width image+text rows, cream bg. Second row (`chambre`) uses `/public/homepage.png`. First row (`salon`) still shows gradient placeholder until a photo is added via `row.imageUrl`.

**FeaturedProductsSection** — horizontal snap carousel (`overflow-x-auto snap-x`), `useRef` + `scrollBy` for prev/next arrows. Each `ProductCard` is `snap-start flex-none w-72 sm:w-80`.

**ProductCard** — white card, taupe image bg, no 3D tilt. Hover: `translateY(-3px)` + shadow.

---

## i18n Pattern

Components hardcode trilingual strings inline — do not add component strings to `messages/*.json`. Only page-level strings go in `messages/`.

```ts
const label = locale === "ar" ? "النص" : locale === "fr" ? "Texte" : "Text";
```

RTL: phone numbers and other LTR strings inside RTL pages need `dir="ltr" className="inline-block"` to prevent digit reversal.

---

## Framer Motion TypeScript

```ts
import { type Variants } from "framer-motion";

const EASE_SPRING = [0.22, 1, 0.36, 1] as [number, number, number, number]; // NOT number[]
const v: Variants = {
  visible: { transition: { ease: "easeOut" as const } }, // "as const" required
};
```

---

## Turbopack Root

`next.config.ts` sets `turbopack: { root: path.join(__dirname, "..") }` — points to `Le01Aout/` parent so that `website/data/` (symlink to `../data/`) resolves correctly. Do not change this to `__dirname` or products JSON imports will break.
