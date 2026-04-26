"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRef, Suspense } from "react";
import dynamic from "next/dynamic";

/* Load Three.js scene client-side only (no SSR) */
const LuxuryScene = dynamic(() => import("./LuxuryScene"), { ssr: false });

/* Fixed gold particle positions — no Math.random() to avoid hydration mismatch */
const PARTICLES = [
  { left: "8%",  top: "15%", size: 3, delay: "0s",    dur: "4s"   },
  { left: "18%", top: "72%", size: 2, delay: "0.7s",  dur: "5.2s" },
  { left: "27%", top: "38%", size: 4, delay: "1.4s",  dur: "3.8s" },
  { left: "42%", top: "88%", size: 2, delay: "0.3s",  dur: "6s"   },
  { left: "55%", top: "22%", size: 3, delay: "2.1s",  dur: "4.5s" },
  { left: "63%", top: "61%", size: 2, delay: "0.9s",  dur: "5.7s" },
  { left: "75%", top: "10%", size: 4, delay: "1.8s",  dur: "3.5s" },
  { left: "82%", top: "45%", size: 2, delay: "0.5s",  dur: "6.2s" },
  { left: "90%", top: "80%", size: 3, delay: "2.5s",  dur: "4.1s" },
  { left: "12%", top: "52%", size: 2, delay: "1.2s",  dur: "5.9s" },
  { left: "35%", top: "5%",  size: 3, delay: "3s",    dur: "4.8s" },
  { left: "70%", top: "92%", size: 2, delay: "0.2s",  dur: "5.4s" },
  { left: "48%", top: "55%", size: 4, delay: "1.6s",  dur: "3.9s" },
  { left: "92%", top: "28%", size: 2, delay: "2.8s",  dur: "6.5s" },
  { left: "5%",  top: "83%", size: 3, delay: "0.8s",  dur: "4.3s" },
];

/* Fallback shown while Three.js loads */
function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-end pe-20 pointer-events-none" aria-hidden="true">
      <div className="w-96 h-96 rounded-full bg-[#C9A84C]/5 blur-3xl animate-pulse" />
    </div>
  );
}

const EASE_SPRING = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* Entrance animation variants */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_SPRING, delay: i * 0.12 },
  }),
};

const statsVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.9 + i * 0.1 },
  }),
};

export default function HeroSection() {
  const t = useTranslations();
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* Parallax: text drifts up on scroll, orb drifts slower */
  const textY  = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const orbY   = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const STATS = [
    { value: "230+", label_ar: "منتج متوفر", label_fr: "produits",          label_en: "products"          },
    { value: "5+",   label_ar: "سنوات خبرة", label_fr: "ans d'expérience",  label_en: "years experience"  },
    { value: "24/7", label_ar: "واتساب",     label_fr: "WhatsApp",          label_en: "WhatsApp"          },
  ];

  const statLabel = (s: typeof STATS[0]) =>
    locale === "ar" ? s.label_ar : locale === "fr" ? s.label_fr : s.label_en;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0D0D1A]"
    >
      {/* ── Perspective grid ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(800px) rotateX(25deg)",
          transformOrigin: "bottom center",
        }}
        aria-hidden="true"
      />

      {/* ── Floating gold particles ────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#C9A84C] animate-float"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.dur,
            }}
          />
        ))}
      </div>

      {/* ── Drifting background orbs ──────────────────────────────────── */}
      <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-[#C9A84C]/8 rounded-full blur-3xl animate-orb pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 end-1/3 w-64 h-64 bg-[#C9A84C]/6 rounded-full blur-2xl animate-orb pointer-events-none" aria-hidden="true"
        style={{ animationDelay: "-6s", animationDuration: "15s" }} />

      {/* ── Real 3D WebGL scene (parallax on scroll) ──────────────────── */}
      {/* Hidden on very small phones (<480px) for perf, visible sm+ */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-70 sm:opacity-100"
        style={{ y: orbY }}
        aria-hidden="true"
      >
        <Suspense fallback={<SceneFallback />}>
          <LuxuryScene />
        </Suspense>
      </motion.div>

      {/* ── Main content (parallax + fade on scroll) ──────────────────── */}
      <motion.div
        className="relative z-10 container mx-auto px-6 py-16 sm:py-20 text-center text-white"
        style={{ y: textY, opacity }}
      >
        {/* Eyebrow — Bugatti-style CAPS mono label */}
        <motion.p
          className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#C9A84C] mb-4 font-mono"
          custom={0.5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Nouakchott · Mauritanie · Luxury Decor
        </motion.p>

        {/* Title — Boca do Lobo style: Cormorant Garamond serif, italic, monumental */}
        <motion.h1
          className="text-[clamp(3.5rem,11vw,8.5rem)] mb-8 leading-[1.0] tracking-tight"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontWeight: 300,
            fontStyle: "italic",
          }}
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <span className="text-shimmer">{t("home.hero_title")}</span>
        </motion.h1>

        {/* Gold divider */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#C9A84C]" />
          <span className="text-[#C9A84C] text-xl">✦</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-xl mx-auto leading-relaxed"
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {t("home.hero_subtitle")}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 bg-[#C9A84C] text-[#0D0D1A] font-bold px-9 py-4 rounded-lg hover:bg-white transition-all shadow-lg shadow-[#C9A84C]/30 hover:shadow-[#C9A84C]/50 animate-glow"
          >
            {t("home.hero_cta")}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="https://wa.me/22233322232"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#C9A84C]/50 text-[#C9A84C] font-bold px-9 py-4 rounded-lg hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all backdrop-blur-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t("home.whatsapp_cta")}
          </a>
        </motion.div>

        {/* Stats */}
        <div className="flex justify-center gap-6 sm:gap-12 mt-10 sm:mt-16 pt-8 sm:pt-12 border-t border-white/10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              className="text-center"
              custom={i}
              variants={statsVariant}
              initial="hidden"
              animate="visible"
            >
              <p className="text-2xl sm:text-3xl font-black text-[#C9A84C]">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{statLabel(s)}</p>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-scroll" aria-hidden="true">
          <span className="text-[#C9A84C]/60 text-[10px] tracking-widest uppercase">scroll</span>
          <svg className="w-4 h-4 text-[#C9A84C]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
