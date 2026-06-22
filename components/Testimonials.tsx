"use client";

import { useLocale } from "next-intl";
import Reveal from "./Reveal";

/**
 * ⚠️ PLACEHOLDER TESTIMONIALS — replace `name`, `quote`, `rating` with REAL
 * client reviews before launch. Names below are examples only.
 * To add a client photo, give the testimonial a `photo` URL (Cloudinary).
 */
interface Testimonial {
  name: string;
  photo?: string;
  rating: number; // 1–5
  quote_ar: string;
  quote_fr: string;
  quote_en: string;
  role_ar: string;
  role_fr: string;
  role_en: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aïcha M.",
    rating: 5,
    quote_ar: "جودة استثنائية وذوق رفيع. حوّلوا صالوننا إلى تحفة فنية تليق بضيوفنا.",
    quote_fr: "Une qualité exceptionnelle et un goût raffiné. Ils ont transformé notre salon en une véritable œuvre d'art.",
    quote_en: "Exceptional quality and refined taste. They turned our living room into a true work of art.",
    role_ar: "عميلة، نواكشوط",
    role_fr: "Cliente, Nouakchott",
    role_en: "Client, Nouakchott",
  },
  {
    name: "Mohamed O.",
    rating: 5,
    quote_ar: "رأيت تصميم منزلي بالكامل قبل التنفيذ. النتيجة النهائية مطابقة تمامًا لما رأيته.",
    quote_fr: "J'ai vu le design complet de ma maison avant les travaux. Le résultat final est parfaitement conforme.",
    quote_en: "I saw the full design of my home before any work began. The final result matched it exactly.",
    role_ar: "مشروع تصميم ثلاثي الأبعاد",
    role_fr: "Projet design 3D",
    role_en: "3D design project",
  },
  {
    name: "Fatimetou B.",
    rating: 5,
    quote_ar: "تعامل راقٍ من البداية حتى التسليم، والقطع تفوق التوقعات.",
    quote_fr: "Un accompagnement haut de gamme du début à la livraison, et des pièces au-delà de nos attentes.",
    quote_en: "A premium experience from start to delivery, with pieces that exceeded our expectations.",
    role_ar: "عميلة، نواكشوط",
    role_fr: "Cliente, Nouakchott",
    role_en: "Client, Nouakchott",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 20 20"
          className={`w-4 h-4 ${n <= rating ? "text-[#B8956A]" : "text-[#B8956A]/25"}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const tr = (ar: string, fr: string, en: string) =>
    locale === "ar" ? ar : locale === "fr" ? fr : en;

  return (
    <section className="bg-[#F5F1EA] py-20 sm:py-24">
      <div className="container mx-auto px-6">
        {/* Header + trust summary */}
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-[10px] tracking-[0.45em] uppercase font-mono text-[#B8956A] mb-3">
            {tr("آراء عملائنا", "Témoignages", "Testimonials")}
          </p>
          <h2
            className="text-3xl sm:text-4xl text-[#2A2620] mb-5"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 300, fontStyle: "italic" }}
          >
            {tr("ثقةٌ تُبنى بالتفاصيل", "Une confiance bâtie sur les détails", "Trust built on detail")}
          </h2>
          <div className="inline-flex items-center gap-3">
            <Stars rating={5} />
            <span className="text-sm font-semibold text-[#2A2620]">5.0</span>
            <span className="text-sm text-[#6B6358]">
              {tr("تقييم عملائنا", "Avis de nos clients", "Rated by our clients")}
            </span>
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.1} className="h-full">
              <figure
                className={`relative h-full bg-white rounded-2xl p-7 sm:p-8 shadow-[0_2px_24px_rgba(42,38,32,0.06)] border border-[#B8956A]/10 hover:shadow-[0_8px_40px_rgba(184,149,106,0.18)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col ${
                  isAr ? "text-right" : ""
                }`}
              >
                {/* Big decorative quote mark */}
                <span
                  className={`absolute top-5 ${isAr ? "left-6" : "right-6"} text-6xl leading-none text-[#B8956A]/12 font-serif select-none pointer-events-none`}
                  aria-hidden="true"
                >
                  ”
                </span>

                <Stars rating={t.rating} />

                <blockquote className="text-[#2A2620] text-[15px] leading-relaxed mt-5 flex-grow">
                  {tr(t.quote_ar, t.quote_fr, t.quote_en)}
                </blockquote>

                <figcaption className={`mt-7 pt-5 border-t border-[#B8956A]/12 flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C9A86A] to-[#7A5C2E] text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                    {initials(t.name)}
                  </div>
                  <div className={isAr ? "text-right" : ""}>
                    <div className="text-sm font-bold text-[#2A2620]">{t.name}</div>
                    <div className="text-xs text-[#6B6358] mt-0.5">
                      {tr(t.role_ar, t.role_fr, t.role_en)}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
