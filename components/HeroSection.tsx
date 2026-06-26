"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HeroSection() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // ── AERIAL DESCENT ──────────────────────────────────────────────────────
  // Simulates the camera dropping from ceiling height to eye level.
  // rotateX tilts the plane away at the start (aerial oblique view),
  // then flattens back to normal as the user scrolls down.
  const rotateX  = useTransform(scrollYProgress, [0, 0.55], [24, 0]);
  const scale    = useTransform(scrollYProgress, [0, 0.55], [1.38, 1.0]);

  // Dark scrim appears once the descent is mostly done — legibility for text
  const scrimOp  = useTransform(scrollYProgress, [0.38, 0.68], [0, 0.55]);

  // Scroll indicator: visible only at the very top
  const hintOp   = useTransform(scrollYProgress, [0, 0.14], [1, 0]);

  // Eyebrow + large title: appear mid-descent
  const titleOp  = useTransform(scrollYProgress, [0.12, 0.42], [0, 1]);
  const titleY   = useTransform(scrollYProgress, [0.12, 0.42], [18, 0]);

  // CTAs: appear after descent completes
  const ctaOp    = useTransform(scrollYProgress, [0.52, 0.72], [0, 1]);
  const ctaY     = useTransform(scrollYProgress, [0.52, 0.72], [22, 0]);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    const video = videoRef.current;
    if (!video) return;

    if (isTouch) {
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    // Desktop: hold at frame 0, scrub with scroll
    video.pause();
    const unsub = scrollYProgress.on("change", (p) => {
      if (video.duration) {
        video.currentTime = Math.min(p * video.duration * 1.4, video.duration - 0.05);
      }
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    // 220vh runway — gives the sticky panel room to animate through its full arc
    <div ref={containerRef} style={{ height: "220vh" }}>

      {/* Sticky viewport */}
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100svh" }}>

        {/* ── PERSPECTIVE CONTAINER ──────────────────────────────────────── */}
        {/* Applies the 3D vanishing-point; the child is the element that rotates */}
        <div className="absolute inset-0" style={{ perspective: "1400px", perspectiveOrigin: "50% 60%" }}>
          <motion.div
            className="absolute inset-0"
            style={{
              rotateX,
              scale,
              transformOrigin: "50% 100%",
            }}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover object-center"
              src="https://res.cloudinary.com/ddjmrcbdw/video/upload/q_auto/le01aout/hero-video-4k.mp4"
              poster="https://res.cloudinary.com/ddjmrcbdw/image/upload/v1782232787/le01aout/hero_staircase.jpg"
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          </motion.div>
        </div>

        {/* ── DARK SCRIM ─────────────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 bg-[#0D0B08] pointer-events-none z-10"
          style={{ opacity: scrimOp }}
        />

        {/* ── SCROLL HINT ────────────────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: hintOp }}
        >
          <p className="text-[9px] tracking-[0.38em] uppercase text-white/50 font-mono">
            {isRtl ? "اسحب للأسفل" : locale === "fr" ? "Défiler" : "Scroll"}
          </p>
          <motion.div
            className="w-px h-8 bg-[#B8956A] origin-top"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }}
          />
        </motion.div>

        {/* ── BRAND EYEBROW (top — visible from the start of the descent) ── */}
        <motion.div
          className="absolute top-20 sm:top-24 inset-x-0 flex flex-col items-center z-20 pointer-events-none"
          style={{ opacity: titleOp, y: titleY }}
        >
          <p className="text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-[#B8956A] font-mono mb-4">
            Nouakchott · Mauritanie · Luxury Decor
          </p>
          <div className="flex items-center gap-4">
            <div className="h-px w-10 sm:w-14 bg-[#B8956A]/60" />
            <span className="text-[#B8956A] text-sm">✦</span>
            <div className="h-px w-10 sm:w-14 bg-[#B8956A]/60" />
          </div>
        </motion.div>

        {/* ── MAIN CONTENT (bottom — CTAs appear after descent) ──────────── */}
        <motion.div
          className={`absolute bottom-0 z-20 px-6 sm:px-16 pb-12 sm:pb-20 max-w-2xl ${
            isRtl ? "right-0 text-right" : "left-0 text-left"
          }`}
          style={{ opacity: ctaOp, y: ctaY }}
        >
          <h1
            className="text-[clamp(2.8rem,11vw,7.5rem)] mb-5 leading-none tracking-tight text-white"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 300,
              fontStyle: "italic",
            }}
          >
            {t("home.hero_title")}
          </h1>

          <p className="text-sm sm:text-base text-white/75 mb-8 max-w-sm leading-relaxed">
            {t("home.hero_subtitle")}
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 ${isRtl ? "sm:flex-row-reverse" : ""}`}>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-[#B8956A] text-[#1A1814] font-bold w-full sm:w-auto px-8 py-3.5 rounded-full hover:bg-white hover:text-[#1A1814] transition-all duration-300 shadow-lg text-sm tracking-wide"
            >
              {t("home.hero_cta")}
            </Link>
            <a
              href="https://wa.me/22233322232"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold w-full sm:w-auto px-8 py-3.5 rounded-full hover:border-white hover:bg-white/10 transition-all duration-300 text-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("home.whatsapp_cta")}
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
