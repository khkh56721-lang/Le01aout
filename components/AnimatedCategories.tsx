"use client";

import { motion, type Variants } from "framer-motion";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

interface CategoryDef {
  id: string;
  label_ar: string;
  label_fr: string;
  label_en: string;
  /* gradient shown when no photo available */
  gradient: string;
  /* large unicode / emoji mark */
  mark: string;
  image?: string;
}

const CATEGORIES: CategoryDef[] = [
  {
    id: "salon",
    label_ar: "صالون",
    label_fr: "Salon",
    label_en: "Living Room",
    gradient: "from-[#E8E2D5] via-[#D5CFC3] to-[#C8C0B0]",
    mark: "⬡",
    image: "https://res.cloudinary.com/ddjmrcbdw/image/upload/v1781892916/le01aout/showroom/b6_dsc0889.jpg",
  },
  {
    id: "chambre",
    label_ar: "غرفة نوم",
    label_fr: "Chambre",
    label_en: "Bedroom",
    gradient: "from-[#E8E2D5] via-[#D0C9BB] to-[#C8C0B0]",
    mark: "◈",
    image: "https://res.cloudinary.com/ddjmrcbdw/image/upload/v1781892949/le01aout/showroom/b6_dsc0913.jpg",
  },
  {
    id: "salle_a_manger",
    label_ar: "غرفة طعام",
    label_fr: "Salle à manger",
    label_en: "Dining Room",
    gradient: "from-[#E8E2D5] via-[#D5CFC3] to-[#C8BFB0]",
    mark: "◇",
    image: "https://res.cloudinary.com/ddjmrcbdw/image/upload/v1781893019/le01aout/showroom/b6_dsc0971.jpg",
  },
  {
    id: "luminaires",
    label_ar: "إضاءة",
    label_fr: "Luminaires",
    label_en: "Lighting",
    gradient: "from-[#E8E2D5] via-[#D8D1C5] to-[#CCc4B8]",
    mark: "✦",
    image: "https://res.cloudinary.com/ddjmrcbdw/image/upload/v1781892919/le01aout/showroom/b6_dsc0890.jpg",
  },
  {
    id: "accessoires",
    label_ar: "إكسسوارات",
    label_fr: "Accessoires",
    label_en: "Accessories",
    gradient: "from-[#E8E2D5] via-[#D5CFC3] to-[#C8C0B0]",
    mark: "⬟",
    image: "https://res.cloudinary.com/ddjmrcbdw/image/upload/v1781892927/le01aout/showroom/b6_dsc0896.jpg",
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const card: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const heading: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function AnimatedCategories() {
  const locale = useLocale();

  const label = (c: CategoryDef) =>
    locale === "ar" ? c.label_ar : locale === "fr" ? c.label_fr : c.label_en;

  return (
    <section className="bg-[#F5F1EA] py-16 sm:py-20 border-t border-[#B8956A]/10">
      <div className="container mx-auto px-6">

        {/* Bugatti-style section eyebrow */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          variants={heading}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.45em] uppercase font-mono text-[#B8956A] mb-3">
            {locale === "ar" ? "تصفح حسب الفئة" : locale === "fr" ? "Explorer par catégorie" : "Browse by Category"}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#2A2620] leading-tight">
            {locale === "ar" ? "مجموعاتنا" : locale === "fr" ? "Nos Collections" : "Our Collections"}
          </h2>
        </motion.div>

        {/* 5-card grid — Bugatti full-bleed chapter style */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.id} variants={card}>
              <Link
                href={`/products?category=${cat.id}`}
                className="group relative flex flex-col justify-end overflow-hidden rounded-none border border-[#B8956A]/15 hover:border-[#B8956A]/60 transition-all duration-500"
                style={{ aspectRatio: "3/4" }}
              >
                {/* Background — photo or gradient */}
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={label(cat)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    quality={90}
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-b ${cat.gradient}`} />
                )}

                {/* Large decorative mark — fades on hover */}
                <span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[5rem] text-[#B8956A]/15 group-hover:text-[#B8956A]/30 transition-colors duration-500 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {cat.mark}
                </span>

                {/* Dark vignette — Bugatti bottom-up overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Label block */}
                <div className="relative z-10 p-4 group-hover:pb-6 transition-all duration-300">
                  <p className="text-[9px] tracking-[0.4em] uppercase font-mono text-[#B8956A]/80 mb-1">
                    {cat.id.replace("_", " ")}
                  </p>
                  <p className="text-sm sm:text-base font-black uppercase tracking-wide text-white leading-tight">
                    {label(cat)}
                  </p>
                  {/* Pill CTA — always visible on touch, slides up on hover (desktop) */}
                  <span className="inline-block mt-2 text-[9px] tracking-[0.3em] uppercase font-mono text-[#B8956A] border border-[#B8956A]/40 rounded-full px-3 py-1 transition-all duration-300 opacity-100 translate-y-0 sm:opacity-0 sm:-translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
                    {locale === "ar" ? "اكتشف" : locale === "fr" ? "Explorer" : "Explore"}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
