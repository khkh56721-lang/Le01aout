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

`app/[locale]/page.tsx` renders: `Navbar → HeroHouseTour → AnimatedCategories → EditorialRows → FeaturedProductsSection → 3D Design Teaser → Testimonials → FAQ → VisitShowroom CTA → WhatsAppButton`

**Navbar** (`components/Navbar.tsx`) — sticky; cream (`#F5F1EA`), turns solid + shadow when scrolled >40px. Animated framer-motion mobile menu (scroll-locked, closes on route change). Logo is `/public/logo.png` (white line-art on a **transparent** bg) — `invert`ed here so it reads as black on cream; the Footer leaves it white on the dark bg. Language switcher links to the current `pathname` in each other locale.

**HeroHouseTour** (`components/HeroHouseTour.tsx` + `lib/houseTour.ts`) — the hero since 2026-09-02, rebuilt 2026-09-03. A camera that flies through ONE house:

> open on the whole **house** → fly into a room → cut inside and push through its **products** → fly back out → next room → …

- **FULL BLEED UNDER A FLOATING HEADER.** The hero is pulled up with `-mt-20 sm:-mt-24` and is `h-[100svh]`, and `Navbar` goes **transparent on the homepage until you scroll** (`overHero`). A solid cream bar sitting on the house photo is the "cut" Khaled reported three times — two surfaces that look like different pages. A soft top wash keeps the black logo legible over the photo.
- **THE HOUSE IS `object-contain` ON A PHONE.** `cover` on a 9:16 render in a 390x844 viewport trims ~8.6% off each side, which clipped the salon and the dining room off the one frame whose job is "here is the whole home". Contained, the whole building shows and the leftover band is cream — the same cream as the page, so it reads as air, not letterboxing. `project()`/`frame()` both take a fit mode, and the pan bound is derived from the IMAGE's edges (`fL/fR/fT/fB`), not the element's.
- **IT PLAYS ONCE AND STOPS**, resting on the wide house (~28s). Khaled: "don't repeat the cycle, just stop on the part where we are seeing it from outside." A hero that loops forever competes with the page; one that finishes leaves a still photograph behind it. Tapping the room rail restarts from that room.
- **The shot list returns to the WHOLE HOUSE between every room** (`house → room → its products → house → next room`). Flying room-to-room directly stopped reading as one home.
- **NO PROSE IN THE HERO AT ALL** — no product name, no `PR_` code, and no description line for the rooms or the house (Khaled, 2026-09-03: "people can get access to it directly"). What is left is an eyebrow, the room name, the progress dashes and two buttons over a photograph; the portrait scrim was lightened to match, so the picture gets the space back. The `line_ar/fr/en` fields stay in `houseTour.ts` unused, in case the copy is ever wanted back. **The EditorialRows descriptions further down the homepage are deliberately KEPT** — those are the "salon and bedroom" rows he asked to leave alone.
- **ONE SCREEN, and it plays itself.** `h-[calc(100svh-var(--nav))]`, **not sticky, no scroll track**. The previous version pinned 3.4 viewports of scroll and Khaled's verdict was that nobody should scroll three screens to see a hero, and that the drift looked broken rather than cinematic. Scroll now just leaves the hero. Moves are `MOVE_MS` 600ms with a hard ease-out; holds are ~0.7–1.2s. Pauses when off-screen or the tab is hidden, and honours `prefers-reduced-motion`.
- **The house is the connective tissue.** `HOUSE` in `houseTour.ts` is an architectural cutaway holding all five rooms; each room carries a `region`/`regionTall` — its centre inside that render — so flying between rooms is one continuous space instead of a slideshow of unrelated photographs. **Regenerating the house means re-measuring all five regions.**
- **Every image exists TWICE — 16:9 and 9:16.** ~99% of visitors are on a phone, where object-cover on a landscape render hid whole products (the dining room lost its table, bar cart and ficus). `<picture media="(orientation: portrait)">` picks one and downloads only it; next/image cannot express art direction and would ship both.
- ⚠️ **`frame()` SCALES ABOUT THE PRODUCT, IT DOES NOT TRANSLATE TO IT — and the obvious implementation is wrong.** `object-cover` **clips** the image to the element, so translating the layer to centre a product does not pan across the photo: it drags the already-cropped picture sideways and exposes the cream background. That shipped once and made the gold bedroom mirror look sliced in half on a phone. The camera therefore sets `transform-origin` to the product's own position (scaling about any origin inside the element always keeps it covering) and permits a pan toward centre only within `T ∈ [(Z-1)(o-1)/Z, (Z-1)o/Z]`, the range that provably keeps both edges outside the frame. **`project()`** converts an image-% to a container-% for whatever object-cover is doing at the measured box — never replace it with a magic factor.
- **Hotspot coordinates are measured per framing** (`hotspots` off the 16:9, `hotspotsTall` off the 9:16). `getTourRooms()` resolves every code against `products.json` at build time and **throws** if one is missing or if the two framings list different products — deleting a product breaks the build instead of leaving a dead dot, and a phone visitor can never see a different set from a desktop one.
- **Three scrims, not one.** Landscape stays weak (a heavy wash turned the mocha velvet grey, and the colour is the product); portrait-on-a-product is tall (type lands on a bright close-up); portrait-on-the-house is light again (the establishing shot's job is to show the building, and the tall scrim buried its whole lower floor).
- Responsive widths via `roomUrl()`/`srcSet()`/`WIDTHS_TALL`/`WIDTHS_WIDE` — a single fixed `w_2400` was sending phones 850 KB a room instead of ~190 KB. Only the current room and the next are mounted. **Live payload: 224 KB of hero imagery on a phone.**
- ⚠️ `<html dir>` is already set per locale, so **flex reverses on its own in Arabic** — never add `flex-row-reverse` on top. Use `ps-*`/`pe-*`/`text-start`.
- The hero images are served **without** the `lib/watermark.ts` mark, on purpose.

`components/HeroSection.tsx` (the old video hero) and `LuxuryScene.tsx` are both unused — do not re-import either.

**AnimatedCategories** — 5 category cards, cream section bg, taupe card gradients. Links to `/products?category={id}`.

**EditorialRows** — two alternating full-width image+text rows, cream bg. **No watermark** (Khaled, 2026-09-03: the logo on these lifestyle shots looked wrong). Same for the **AnimatedCategories** tiles. `ProductCard`, `ProductGallery` and `ProductVariants` DO keep their marks — real product photos are what the watermark is for. Second row (`chambre`) uses `/public/homepage.png`. First row (`salon`) still shows gradient placeholder until a photo is added via `row.imageUrl`.

**FeaturedProductsSection** — cream section bg (`bg-[#F5F1EA]`), horizontal snap carousel (`overflow-x-auto snap-x`), `useRef` + `scrollBy` for prev/next arrows. Each `ProductCard` is `snap-start flex-none w-72 sm:w-80`.

**ProductCard** — white card (`bg-white`) with taupe border + taupe image bg (`#E8E2D5`), no 3D tilt. Green in-stock badge, text-link "Discover" CTA. Hover: `-translate-y-1` lift + `shadow-lg`, image `scale-105`.

**3D Design Teaser** — inline in `page.tsx` (NOT a component), dark full-width band (`bg-[#1A1814]`) after Featured: image + text, links to `/design`. Wrapped in cream→dark and dark→cream gradient fade strips. RTL swaps image/text order (`lg:order-2`).

**Testimonials** (`components/Testimonials.tsx`) — 5-star review cards with avatar initials + trust header, hover lift. ⚠️ Names are PLACEHOLDERS (Aïcha M. / Mohamed O. / Fatimetou B.) — replace with real reviews before launch.

**FAQ** (`components/FAQ.tsx`) — 6 trilingual Q&As, animated accordion, premium card styling.

**VisitShowroom CTA** — taupe band (`bg-[#E8E2D5]`), address + WhatsApp/Contact buttons. Inline in `page.tsx`.

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
