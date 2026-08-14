"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const EASE_SPRING = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_SPRING, delay: i * 0.15 },
  }),
};

export default function HeroSection() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <section className="relative min-h-[70svh] sm:min-h-screen overflow-hidden bg-[#F5F1EA]">
      {/* Full-bleed video */}
      <video
        className="absolute inset-0 w-full h-full object-cover object-center"
        src="/hero-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Vignette — side edge */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isRtl
            ? "linear-gradient(to left, rgba(245,241,234,0.72) 0%, rgba(245,241,234,0.15) 55%, transparent 100%)"
            : "linear-gradient(to right, rgba(245,241,234,0.72) 0%, rgba(245,241,234,0.15) 55%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Vignette — bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(245,241,234,1) 0%, rgba(245,241,234,0.55) 30%, rgba(245,241,234,0.15) 55%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* Content — bottom-left (or bottom-right for RTL) */}
      <div
        className={`absolute bottom-0 z-10 w-full px-6 sm:px-16 pb-12 sm:pb-20 max-w-2xl ${
          isRtl ? "right-0 text-right" : "left-0 text-left"
        }`}
      >
        <motion.p
          className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#B8956A] mb-4 font-mono"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Nouakchott · Mauritanie · Luxury Decor
        </motion.p>

        <motion.h1
          className="text-[clamp(2.5rem,11vw,7rem)] mb-6 leading-[1.0] tracking-tight text-[#2A2620]"
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
          {t("home.hero_title")}
        </motion.h1>

        <motion.div
          className={`flex items-center gap-4 mb-6 ${isRtl ? "flex-row-reverse" : ""}`}
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="h-px w-16 bg-[#B8956A]" />
          <span className="text-[#B8956A] text-base">✦</span>
        </motion.div>

        <motion.p
          className="text-sm sm:text-base text-[#6B6358] mb-8 max-w-sm leading-relaxed"
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {t("home.hero_subtitle")}
        </motion.p>

        <motion.div
          className={`flex flex-col sm:flex-row gap-3 ${isRtl ? "sm:flex-row-reverse" : ""}`}
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-[#2A2620] text-white font-semibold w-full sm:w-auto px-8 py-3.5 rounded-full hover:bg-[#1A1814] transition-all duration-300 shadow-md text-sm"
          >
            {t("home.hero_cta")}
          </Link>
          <a
            href="https://wa.me/22233322232"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-[#B8956A] text-[#2A2620] font-semibold w-full sm:w-auto px-8 py-3.5 rounded-full hover:bg-[#B8956A] hover:text-white transition-all duration-300 text-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t("home.whatsapp_cta")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
