"use client";

import { motion, type Variants } from "framer-motion";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name_ar: string;
  name_fr: string;
  category: string;
  subcategory?: string;
  price_mru: number | null;
  images: string[];
  made_to_order: boolean;
  in_stock: boolean;
}

const EASE_SPRING = [0.22, 1, 0.36, 1] as [number, number, number, number];

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariant: Variants = {
  hidden:  { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: EASE_SPRING },
  },
};

const headingVariant: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function FeaturedProductsSection({ products }: { products: Product[] }) {
  const locale = useLocale();

  const sectionTitle =
    locale === "ar" ? "منتجاتنا المميزة" :
    locale === "fr" ? "Sélection du moment" :
    "Our Collection";

  const viewAll =
    locale === "ar" ? "مشاهدة جميع المنتجات" :
    locale === "fr" ? "Voir tous les produits" :
    "View all products";

  const featuredLabel =
    locale === "ar" ? "اختيارات مميزة" :
    locale === "fr" ? "Sélection du moment" :
    "Featured Collection";

  if (!products.length) return null;

  return (
    <section className="bg-[#0D0D1A] border-t border-white/5 px-6 py-20">
    <div className="container mx-auto">
      {/* Heading */}
      <motion.div
        className="text-center mb-14"
        variants={headingVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-semibold mb-3">
          {featuredLabel}
        </p>
        <h2
          className="text-5xl sm:text-6xl text-white leading-tight"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 300, fontStyle: "italic" }}
        >{sectionTitle}</h2>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]/60" />
          <span className="text-[#C9A84C]/60 text-sm">✦</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]/60" />
        </div>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={cardVariant}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* Boca do Lobo text-link CTA */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" as const }}
      >
        <Link
          href="/products"
          className="group inline-flex items-center gap-4 text-[11px] tracking-[0.5em] uppercase font-mono text-white hover:text-[#C9A84C] transition-colors duration-300"
        >
          <span className="w-10 h-px bg-current transition-all duration-500 group-hover:w-20" />
          {viewAll}
          <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
        </Link>
      </motion.div>
    </div>
    </section>
  );
}
