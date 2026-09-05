"use client";

// The homepage hero — a camera that flies through one house.
//
// THE SHAPE OF IT, and why it is not what it was:
//
//   open on the whole HOUSE  →  fly into a room  →  cut inside that room and
//   push through its products  →  fly back out to the house  →  next room  →  …
//
// The previous version was five separate room photographs cross-fading over 3.4
// viewports of scroll. Khaled's verdict, and he was right: it never read as one
// home, the camera drifted so slowly it looked broken, and nobody should have to
// scroll three screens to see the hero. So:
//
//   • ONE SCREEN. No sticky track, no scroll hijack. The hero is exactly one
//     viewport and the page scrolls past it normally. Scrolling is for leaving
//     the hero, not for operating it.
//   • IT PLAYS ITSELF, fast. Moves are ~600ms with a hard ease-out so they land
//     rather than glide; holds are ~1s.
//   • THE HOUSE IS THE CONNECTIVE TISSUE. A single architectural cutaway holds
//     all five rooms, so flying between them is one continuous space instead of
//     a slideshow of unrelated pictures.
//
// PORTRAIT IS THE PRIMARY CASE. ~99% of this business's visitors are on a phone.
// Every image exists as both 16:9 and 9:16 and `<picture>` picks by orientation,
// because object-cover on a landscape render hid whole products on a phone.
//
// project() converts an image-% to a container-% for whatever object-cover is
// doing at the measured box size — never replace it with a magic factor.
//
// `<html dir>` is already set per locale, so flex reverses on its own in Arabic.
// Never add flex-row-reverse on top. Use ps-*/pe-*/text-start.

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  roomUrl,
  srcSet,
  WIDTHS_TALL,
  WIDTHS_WIDE,
  HOUSE,
  type TourRoom,
} from "@/lib/houseTour";
import { whatsAppUrl, productWhatsAppMessage } from "@/lib/whatsapp";

const ART_WIDE = 2752 / 1536;
const ART_TALL = 1536 / 2752;

// PACING, per Khaled: linger on the house, then rip through the products.
// "give it a sec or a second and a half… after that going to the items in each
// room should be faster." The whole house is the shot that sells the idea; a
// product only has to register.
const HOLD_ESTABLISH = 1600; // the whole house, first time
const HOLD_HOUSE = 1000; // the whole house again, between rooms
const HOLD_ROOM = 620; // flying into one room of the house
const HOLD_PRODUCT = 780; // resting on one product
const MOVE_MS = 560;
const FADE_MS = 380;

// Push-in strength. TALL WAS TOO STRONG: at 1.9 a product sitting near the edge
// of the frame — the gold bedroom mirror at x:89 was the one Khaled caught — got
// clamped against the picture edge and read as cut in half. Less zoom keeps the
// piece whole, and the phone crop is already doing half the work.
const ZOOM_PRODUCT_TALL = 1.5;
const ZOOM_PRODUCT_WIDE = 1.4;
const ZOOM_ROOM_TALL = 1.85; // diving into one room of the house
const ZOOM_ROOM_WIDE = 1.9;

type Locale = "ar" | "fr" | "en";
const pick = <T,>(l: Locale, ar: T, fr: T, en: T): T =>
  l === "ar" ? ar : l === "fr" ? fr : en;

interface Box { w: number; h: number }

/** One beat of the film. */
type Shot =
  | { kind: "house"; first?: boolean; last?: boolean }
  | { kind: "room"; room: number }
  | { kind: "product"; room: number; product: number };

export default function HeroHouseTour({ rooms }: { rooms: TourRoom[] }) {
  const locale = useLocale() as Locale;
  const isRtl = locale === "ar";

  const stageRef = useRef<HTMLElement>(null);
  const [box, setBox] = useState<Box>({ w: 0, h: 0 });
  const [motion, setMotion] = useState(true);
  const [inView, setInView] = useState(true);
  const [i, setI] = useState(0);
  /** Set when the visitor picks a room themselves — stops the film stealing it back. */
  const [held, setHeld] = useState(false);

  const tall = box.w > 0 && box.h > box.w;
  const art = tall ? ART_TALL : ART_WIDE;

  // house → room → its products → BACK OUT TO THE WHOLE HOUSE → next room.
  // Returning to the full building between rooms is what makes it read as one
  // home being explored rather than a queue of rooms.
  const shots = useMemo<Shot[]>(() => {
    const out: Shot[] = [];
    rooms.forEach((r, ri) => {
      out.push({ kind: "house", first: ri === 0 });
      out.push({ kind: "room", room: ri });
      r.hotspots.forEach((_, pi) => out.push({ kind: "product", room: ri, product: pi }));
    });
    // IT PLAYS ONCE AND STOPS HERE, on the whole house — Khaled: "don't repeat
    // the cycle, just stop on the part where we are seeing it from outside."
    // A hero that loops forever competes with the page for attention; one that
    // finishes leaves a still photograph of the home behind it.
    out.push({ kind: "house", last: true });
    return out;
  }, [rooms]);

  const shot = shots[Math.min(i, shots.length - 1)];
  // On a house beat the camera is wide, but the room it is ABOUT to enter still
  // drives the rail and the label, so the transition reads as one movement.
  const shotIdx = Math.min(i, shots.length - 1);
  const nextRoomShot = shots.slice(shotIdx).find((s) => s.kind !== "house") as
    | Extract<Shot, { kind: "room" | "product" }>
    | undefined;
  const roomIndex = shot.kind === "house" ? (nextRoomShot?.room ?? 0) : shot.room;
  const isFirstHouse = shot.kind === "house" && shot.first === true;
  const finished = shot.kind === "house" && shot.last === true;
  const room = rooms[roomIndex];
  const spots = tall ? room.hotspotsTall : room.hotspots;
  const product = shot.kind === "product" ? spots[shot.product] : null;

  /* ── measurement ──────────────────────────────────────────────────────── */

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setBox((p) => (p.w === width && p.h === height ? p : { w: width, h: height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotion(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Stop the film when the hero is off screen or the tab is hidden. It is an
  // ambient loop; it has no business running against a page nobody is looking at.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting && document.visibilityState === "visible"),
      { threshold: 0.25 },
    );
    io.observe(el);
    const vis = () => setInView(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  /* ── the film ─────────────────────────────────────────────────────────── */

  useEffect(() => {
    if (!motion || !inView || held || finished) return;
    const hold =
      shot.kind === "house"
        ? isFirstHouse
          ? HOLD_ESTABLISH
          : HOLD_HOUSE
        : shot.kind === "room"
          ? HOLD_ROOM
          : HOLD_PRODUCT;
    const t = setTimeout(() => setI((n) => Math.min(n + 1, shots.length - 1)), hold);
    return () => clearTimeout(t);
  }, [i, shot.kind, isFirstHouse, finished, motion, inView, held, shots.length]);

  /* ── object-cover projection ──────────────────────────────────────────── */

  // Where an image-% lands as a fraction of the container, and where the image's
  // own edges are — both depend on how the picture is fitted.
  //
  // `contain` exists for one reason: THE HOUSE ON A PHONE. object-cover on a
  // 9:16 render in a 390x844 viewport trims ~8.6% off each side, which quietly
  // clipped the salon and the dining room off the establishing shot — the one
  // frame whose entire job is "here is the whole home". Contained, the whole
  // building is visible and the leftover band top and bottom is cream, the same
  // cream as the page, so it reads as air rather than letterboxing.
  const project = useCallback(
    (x: number, y: number, fit: "cover" | "contain" = "cover") => {
      const { w, h } = box;
      if (!w || !h) return { fx: x / 100, fy: y / 100, fL: 0, fR: 1, fT: 0, fB: 1 };
      const wider = w / h > art;
      const fills = fit === "cover" ? wider : !wider;
      const dw = fills ? w : h * art;
      const dh = fills ? w / art : h;
      const ox = (w - dw) / 2;
      const oy = (h - dh) / 2;
      return {
        fx: (ox + (x / 100) * dw) / w,
        fy: (oy + (y / 100) * dh) / h,
        fL: ox / w,
        fR: (ox + dw) / w,
        fT: oy / h,
        fB: (oy + dh) / h,
      };
    },
    [box, art],
  );

  /**
   * Where to point the camera at `p`, as a CSS transform-origin + transform.
   *
   * ⚠️ THE OBVIOUS IMPLEMENTATION IS WRONG AND IT SHIPPED ONCE. Translating the
   * layer to centre a product does NOT pan across the photo: `object-cover`
   * CLIPS the image to the element, so moving the element drags the already
   * cropped picture sideways and leaves the cream background showing. That is
   * exactly what made the gold bedroom mirror look sliced in half on a phone.
   *
   * So: scale about the product's OWN position (scaling about any origin inside
   * the element always keeps it covering), then allow a pan toward centre only
   * within the range that provably keeps both edges outside the frame:
   *
   *     T ∈ [ (Z-1)(o-1)/Z , (Z-1)o/Z ]
   *
   * where `o` is the origin as a fraction and `Z` the zoom. Inside that band the
   * frame can never leave the picture, whatever coordinate it is handed.
   */
  const frame = useCallback(
    (p: { x: number; y: number } | null, zoom: number, fit: "cover" | "contain" = "cover") => {
      if (!p || !motion || !box.w) return { transformOrigin: "50% 50%", transform: "none" };

      const { fx, fy, fL, fR, fT, fB } = project(p.x, p.y, fit);
      const ox = Math.min(Math.max(fx, 0), 1);
      const oy = Math.min(Math.max(fy, 0), 1);

      // Keep both picture edges outside the frame:
      //   T ∈ [ o(Z-1)/Z + 1/Z - far , o(Z-1)/Z - near ]
      // With cover (near=0, far=1) this reduces to the familiar (Z-1)(o-1)/Z …
      // (Z-1)o/Z; with contain the picture is inset, so the band is tighter.
      const pan = (o: number, f: number, near: number, far: number) => {
        const base = (o * (zoom - 1)) / zoom;
        const lo = base + 1 / zoom - far;
        const hi = base - near;
        const want = (0.5 - f) / zoom;
        return lo > hi ? (lo + hi) / 2 : Math.min(Math.max(want, lo), hi);
      };

      return {
        transformOrigin: `${ox * 100}% ${oy * 100}%`,
        transform: `scale(${zoom}) translate(${pan(ox, fx, fL, fR) * 100}%, ${pan(oy, fy, fT, fB) * 100}%)`,
      };
    },
    [motion, box, project],
  );

  /** The house is contained on a phone so none of it is cropped away. */
  const houseFit: "cover" | "contain" = tall ? "contain" : "cover";

  // The house sits wide on a house beat, then flies to the room it is entering.
  const houseCam =
    shot.kind === "house"
      ? { transformOrigin: "50% 50%", transform: "none" }
      : frame(
          tall ? room.regionTall : room.region,
          tall ? ZOOM_ROOM_TALL : ZOOM_ROOM_WIDE,
          houseFit,
        );

  const roomCam = frame(product, tall ? ZOOM_PRODUCT_TALL : ZOOM_PRODUCT_WIDE);

  const showHouse = shot.kind !== "product";

  const jumpRoom = useCallback(
    (ri: number) => {
      const at = shots.findIndex((s) => s.kind === "room" && s.room === ri);
      if (at >= 0) {
        setI(at);
        setHeld(false);
      }
    },
    [shots],
  );

  const jumpProduct = useCallback(
    (ri: number, pi: number) => {
      const at = shots.findIndex(
        (s) => s.kind === "product" && s.room === ri && s.product === pi,
      );
      if (at >= 0) {
        setI(at);
        setHeld(true);
      }
    },
    [shots],
  );

  const roomName = pick(locale, room.label_ar, room.label_fr, room.label_en);
  const trans = motion ? `transform ${MOVE_MS}ms cubic-bezier(0.16, 0.84, 0.24, 1)` : undefined;

  /** House plus the current room, and the next one so its photo is ready. */
  const mounted = new Set([roomIndex, (roomIndex + 1) % rooms.length]);

  return (
    // The negative top margin pulls the hero UP underneath the sticky header, so
    // the house photo runs to the very top of the page and the header floats on
    // it. Navbar turns transparent on the homepage to match (see Navbar.tsx).
    // Without this the two are separate surfaces with a hard line between them —
    // the "cut" Khaled kept reporting.
    <section
      ref={stageRef}
      className="relative -mt-20 sm:-mt-24 h-[100svh] overflow-hidden bg-[#F5F1EA]"
    >
      {/* ── The house ──────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 transition-opacity ease-out"
        style={{ opacity: showHouse ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
        aria-hidden={!showHouse}
      >
        <div
          className="absolute inset-0 will-change-transform"
          style={{ ...houseCam, transition: trans }}
        >
          <Shot fit={houseFit} src={HOUSE.wide} srcTall={HOUSE.tall} alt={pick(locale, "منزل مفروش بالكامل من متجرنا", "Une maison entièrement meublée par nous", "A home furnished entirely by us")} eager />
        </div>
      </div>

      {/* ── The rooms ──────────────────────────────────────────────────── */}
      {rooms.map((r, ri) => {
        if (!mounted.has(ri)) return null;
        const on = !showHouse && ri === roomIndex;
        return (
          <div
            key={r.id}
            className="absolute inset-0 transition-opacity ease-out"
            style={{ opacity: on ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
            aria-hidden={!on}
          >
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                ...(ri === roomIndex ? roomCam : { transformOrigin: "50% 50%", transform: "none" }),
                transition: trans,
              }}
            >
              <Shot
                src={r.image}
                srcTall={r.imageTall}
                alt={pick(locale, r.label_ar, r.label_fr, r.label_en)}
              />
            </div>
          </div>
        );
      })}

      {/* The header now floats ON the photo, so this is no longer hiding a seam —
          it is just enough lift for the black logo and links to stay readable
          over whatever part of the house is behind them. */}
      <div
        className="absolute inset-x-0 top-0 h-28 sm:h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(245,241,234,0.85) 0%, rgba(245,241,234,0.55) 45%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Scrim. Three cases, and the third one matters:
          - landscape: weak on purpose, a heavy wash turned the mocha velvet grey
            and the colour is the product;
          - portrait on a product: tall, because the type lands on a bright
            pushed-in close-up rather than distant floor;
          - portrait on the HOUSE: light again. The establishing shot's whole job
            is to show the building, and the tall scrim buried its lower floor —
            salon, entrance and dining all vanished under it. The type block is
            also shorter here (no product name, no dashes), so it needs less. */}
      <div
        className="absolute inset-0 pointer-events-none transition-[background] duration-500"
        style={{
          background: !tall
            ? "linear-gradient(to top, rgba(245,241,234,0.95) 0%, rgba(245,241,234,0.58) 15%, rgba(245,241,234,0.10) 33%, transparent 50%)"
            : shot.kind === "house"
              ? "linear-gradient(to top, rgba(245,241,234,0.95) 0%, rgba(245,241,234,0.78) 11%, rgba(245,241,234,0.38) 23%, rgba(245,241,234,0.08) 35%, transparent 47%)"
              // Lighter since the description lines came out: the block is now a
              // name, a progress line and two buttons, so it needs far less cover
              // and the photograph gets the space back.
              : "linear-gradient(to top, rgba(245,241,234,0.95) 0%, rgba(245,241,234,0.84) 10%, rgba(245,241,234,0.50) 22%, rgba(245,241,234,0.14) 34%, transparent 47%)",
        }}
        aria-hidden
      />

      {/* ── Room rail ──────────────────────────────────────────────────── */}
      <div
        className={`absolute z-20 top-1/2 -translate-y-1/2 flex flex-col gap-3 ${
          isRtl ? "left-3 sm:left-7" : "right-3 sm:right-7"
        }`}
      >
        {rooms.map((r, ri) => (
          <button
            key={r.id}
            type="button"
            onClick={() => jumpRoom(ri)}
            aria-label={pick(locale, r.label_ar, r.label_fr, r.label_en)}
            aria-current={ri === roomIndex && shot.kind !== "house"}
            className="group grid place-items-center w-6 h-6 focus:outline-none"
          >
            <span
              className={`block rounded-full transition-all duration-500 ${
                ri === roomIndex && shot.kind !== "house"
                  ? "w-2.5 h-7 bg-[#B8956A]"
                  : "w-2.5 h-2.5 bg-[#2A2620]/25 group-hover:bg-[#B8956A]/60"
              }`}
            />
          </button>
        ))}
      </div>

      {/* ── Type ───────────────────────────────────────────────────────── */}
      <div
        className={`absolute bottom-0 z-30 w-full max-w-md px-6 sm:px-14 pb-6 sm:pb-12 ${
          isRtl ? "right-0 text-right" : "left-0 text-left"
        }`}
      >
        <p className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-[#9A7644] sm:text-[#B8956A] mb-2 font-mono">
          {pick(locale, "بيت واحد · كل قطعة من متجرنا", "Une maison · chaque pièce est à nous", "One home · every piece is ours")}
        </p>

        <h1
          className="text-[clamp(1.8rem,5.5vw,3.2rem)] leading-[1.05] tracking-tight text-[#2A2620] mb-3"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 300, fontStyle: "italic" }}
        >
          {shot.kind === "house"
            ? pick(locale, "بيتٌ كامل", "Une maison entière", "A whole home")
            : roomName}
        </h1>

        {/* NO PROSE IN THE HERO AT ALL — no product name, no PR_ code, and since
            2026-09-03 no description line either, for the rooms or for the house.
            Khaled: "people can get access to it directly" — the room name is the
            promise, the catalogue is one tap away, and the reference belongs in
            the WhatsApp message where the team actually needs it. What is left is
            a name, a progress line and two buttons over a photograph. */}

        {/* One dash per product in this room. */}
        <div className="flex gap-1.5 mb-4 min-h-[1rem]">
          {shot.kind !== "house" &&
            spots.map((p, pi) => (
              <button
                key={`p-${p.code}-${p.x}`}
                type="button"
                onClick={() => jumpProduct(roomIndex, pi)}
                aria-label={pick(locale, p.name_ar, p.name_fr, p.name_en)}
                className="h-4 flex-1 max-w-[3rem] grid items-center focus:outline-none"
              >
                <span
                  className={`block h-[3px] w-full rounded-full transition-colors duration-300 ${
                    shot.kind === "product" && pi === shot.product ? "bg-[#B8956A]" : "bg-[#2A2620]/20"
                  }`}
                />
              </button>
            ))}
        </div>

        <div className="flex flex-row gap-2.5">
          <Link
            href={product ? `/products/${product.slug}` : shot.kind === "house" ? "/products" : room.href}
            className="inline-flex flex-1 sm:flex-none items-center justify-center bg-[#2A2620] text-white font-semibold px-5 sm:px-7 py-3 rounded-full hover:bg-[#1A1814] transition-colors duration-300 shadow-md text-[13px] sm:text-sm whitespace-nowrap"
          >
            {product
              ? pick(locale, "عرض المنتج", "Voir le produit", "View product")
              : shot.kind === "house"
                ? pick(locale, "تصفّح المنتجات", "Voir le catalogue", "Browse the catalogue")
                : pick(locale, `تصفّح ${room.label_ar}`, `Voir ${room.label_fr.toLowerCase()}`, `Browse ${room.label_en.toLowerCase()}`)}
          </Link>
          <a
            href={whatsAppUrl(
              product
                ? productWhatsAppMessage({
                    locale,
                    name: pick(locale, product.name_ar, product.name_fr, product.name_en),
                    code: product.code,
                    slug: product.slug,
                  })
                : pick(
                    locale,
                    "مرحبا، شفت البيت في موقعكم وأريد الاستفسار 👋",
                    "Bonjour, j'ai vu votre maison sur le site et je souhaite des informations 👋",
                    "Hello, I saw your house tour on the site and I'd like some information 👋",
                  ),
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 border border-[#B8956A] bg-white/40 text-[#2A2620] font-semibold px-5 sm:px-7 py-3 rounded-full hover:bg-[#B8956A] hover:text-white transition-colors duration-300 text-[13px] sm:text-sm whitespace-nowrap"
          >
            <WaIcon />
            {pick(locale, "واتساب", "WhatsApp", "WhatsApp")}
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}

/** One full-bleed frame, art-directed by orientation. */
function Shot({
  src,
  srcTall,
  alt,
  eager = false,
  fit = "cover",
}: {
  src: string;
  srcTall: string;
  alt: string;
  eager?: boolean;
  fit?: "cover" | "contain";
}) {
  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={srcSet(srcTall, WIDTHS_TALL)} sizes="100vw" />
      <source srcSet={srcSet(src, WIDTHS_WIDE)} sizes="100vw" />
      <img
        src={roomUrl(src, 1600)}
        alt={alt}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className={`absolute inset-0 w-full h-full object-center select-none [-webkit-touch-callout:none] [-webkit-user-drag:none] ${
          fit === "contain" ? "object-contain" : "object-cover"
        }`}
      />
    </picture>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
