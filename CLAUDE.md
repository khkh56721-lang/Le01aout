# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See the root `../CLAUDE.md` for full project context, data pipeline, and architecture overview.

---

## Critical: Dev Server

```bash
npm run dev -- --webpack   # Turbopack causes file permission errors — always use --webpack
node_modules/.bin/tsc --noEmit   # npx tsc installs wrong package
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

## Three.js / WebGL

`LuxuryScene.tsx` uses `@react-three/fiber` + `@react-three/drei`. It **must** be loaded with:

```ts
const LuxuryScene = dynamic(() => import("./LuxuryScene"), { ssr: false });
// then: <Suspense fallback={...}><LuxuryScene /></Suspense>
```

Never import it directly — Three.js breaks SSR.

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

## i18n Pattern (no i18n JSON for components)

Components hardcode trilingual strings inline — do not add component strings to `messages/*.json`. Only page-level strings (hero title, meta, etc.) go in `messages/`.

```ts
const label = locale === "ar" ? "النص" : locale === "fr" ? "Texte" : "Text";
```

---

## Image Placeholders

All `product.images` arrays are currently empty (Cloudinary sync pending). Components use dark gradient fallbacks — they upgrade automatically once `sync_photos.py` + `airtable_to_json.py` run. Do not add hardcoded placeholder images.
