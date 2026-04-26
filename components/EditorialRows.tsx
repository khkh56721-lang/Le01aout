"use client";

import { motion, type Variants } from "framer-motion";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

interface EditorialRow {
  id: string;
  imageUrl?: string;
  gradient: string;
  eyebrow_ar: string;
  eyebrow_fr: string;
  eyebrow_en: string;
  title_ar: string;
  title_fr: string;
  title_en: string;
  sub_ar: string;
  sub_fr: string;
  sub_en: string;
  href: string;
}

const ROWS: EditorialRow[] = [
  {
    id: "salon",
    gradient: "from-[#1a1208] via-[#2a1c08] to-[#0D0D1A]",
    eyebrow_ar: "صالونات فاخرة",
    eyebrow_fr: "Salons de Prestige",
    eyebrow_en: "Prestige Living",
    title_ar: "فن الضيافة\nالفاخرة",
    title_fr: "L'Art de\nRecevoir",
    title_en: "The Art\nof Living",
    sub_ar: "قطع صالون تُعيد تعريف الأناقة — مصنوعة لأولئك الذين يرفضون المساومة على التفاصيل.",
    sub_fr: "Des pièces qui redéfinissent l'élégance — conçues pour ceux qui refusent de compromettre.",
    sub_en: "Pieces that redefine elegance — crafted for those who refuse to compromise on detail.",
    href: "/products?category=salon",
  },
  {
    id: "chambre",
    gradient: "from-[#0a0a12] via-[#12102a] to-[#0D0D1A]",
    eyebrow_ar: "غرف النوم",
    eyebrow_fr: "Chambres",
    eyebrow_en: "Bedrooms",
    title_ar: "ملاذ\nالراحة المطلقة",
    title_fr: "Sanctuaire\ndu Repos",
    title_en: "Sanctuary\nof Rest",
    sub_ar: "غرف نوم تتحول إلى ملاجئ خاصة — حيث تلتقي الراحة الملكية بالتصميم الرفيع.",
    sub_fr: "Des chambres qui deviennent des sanctuaires — où le confort royal rencontre le design raffiné.",
    sub_en: "Bedrooms that become private sanctuaries — where royal comfort meets refined design.",
    href: "/products?category=chambre",
  },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const imgVariant: Variants = {
  hidden:  { opacity: 0, scale: 1.06 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: EASE } },
};

const fadeIn: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export default function EditorialRows() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const pick = (row: EditorialRow, field: "eyebrow" | "title" | "sub") => {
    const key = `${field}_${locale}` as keyof EditorialRow;
    return (row[key] ?? row[`${field}_fr` as keyof EditorialRow]) as string;
  };

  return (
    <div className="bg-[#0D0D1A]">
      {/* ── Section header — Boca do Lobo style ──────────────────────── */}
      <motion.div
        className="text-center py-20 px-6 border-t border-[#C9A84C]/10"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <p className="text-[9px] tracking-[0.5em] uppercase font-mono text-[#C9A84C] mb-4">
          {isAr ? "مجموعاتنا المميزة" : locale === "fr" ? "Nos Collections Exclusives" : "Exclusive Collections"}
        </p>
        <h2
          className="text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.0] tracking-tight"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 300, fontStyle: "italic" }}
        >
          {isAr ? "اختيار استثنائي" : locale === "fr" ? "Un choix d'exception" : "An Exceptional Selection"}
        </h2>
      </motion.div>

      {/* ── Alternating editorial rows ────────────────────────────────── */}
      {ROWS.map((row, idx) => {
        const isEven = idx % 2 === 0;

        return (
          <div
            key={row.id}
            className="relative flex flex-col lg:flex-row min-h-[85vh] border-t border-white/5"
          >
            {/* ── Image panel ────────────────────────────────────────── */}
            <motion.div
              className={`relative w-full lg:w-[58%] overflow-hidden ${
                isEven ? "lg:order-1" : "lg:order-2"
              }`}
              style={{ minHeight: "55vw", maxHeight: "85vh" }}
              variants={imgVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {row.imageUrl ? (
                <Image
                  src={row.imageUrl}
                  alt={pick(row, "title")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              ) : (
                /* Dark luxury gradient placeholder */
                <div className={`absolute inset-0 bg-gradient-to-br ${row.gradient}`}>
                  {/* Subtle gold geometry inside the image area */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-48 h-48 opacity-[0.07]">
                      <div className="absolute inset-0 border border-[#C9A84C] rotate-45 animate-[ring-xy_25s_linear_infinite]" />
                      <div className="absolute inset-6 border border-[#C9A84C] rotate-12 animate-[ring-z_18s_linear_infinite]" />
                      <div className="absolute inset-12 border border-[#C9A84C] animate-[ring-x_20s_linear_infinite]" />
                    </div>
                  </div>
                  {/* Text hint that photo goes here */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[8px] tracking-[0.4em] uppercase font-mono text-[#C9A84C]/30">
                      {isAr ? "الصورة قريباً" : "Photo coming soon"}
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom-up vignette — Boca do Lobo technique */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D1A]/50 via-transparent to-transparent" />
            </motion.div>

            {/* ── Text panel ─────────────────────────────────────────── */}
            <motion.div
              className={`relative w-full lg:w-[42%] flex flex-col justify-center px-8 sm:px-14 lg:px-16 xl:px-20 py-16 lg:py-0 bg-[#0D0D1A] ${
                isEven ? "lg:order-2" : "lg:order-1"
              }`}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Eyebrow — ultra-small caps mono */}
              <p className="text-[9px] tracking-[0.5em] uppercase font-mono text-[#C9A84C] mb-8">
                {pick(row, "eyebrow")}
              </p>

              {/* ── SERIF headline — Cormorant Garamond signature ── */}
              <h2
                className="text-5xl sm:text-6xl lg:text-[clamp(3rem,4.5vw,5rem)] text-white leading-[1.02] mb-8 whitespace-pre-line"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontWeight: 300,
                  fontStyle: isEven ? "italic" : "normal",
                  letterSpacing: "-0.01em",
                }}
              >
                {pick(row, "title")}
              </h2>

              {/* Thin gold rule — Boca do Lobo signature divider */}
              <div className="w-10 h-px bg-[#C9A84C] mb-8" />

              {/* Body text */}
              <p className="text-sm sm:text-base text-gray-400 leading-[1.8] max-w-[360px] mb-12 font-light">
                {pick(row, "sub")}
              </p>

              {/* ── Text-link CTA — Boca do Lobo style (no pill button) ── */}
              <Link
                href={row.href}
                className="group self-start flex items-center gap-3 text-[11px] tracking-[0.45em] uppercase font-mono text-white hover:text-[#C9A84C] transition-colors duration-300"
              >
                <span className="w-8 h-px bg-current transition-all duration-500 group-hover:w-16" />
                {isAr ? "اكتشف المجموعة" : locale === "fr" ? "Découvrir" : "Discover"}
                <span className={`transition-transform duration-300 group-hover:translate-x-1 ${isAr ? "rotate-180" : ""}`}>
                  →
                </span>
              </Link>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
