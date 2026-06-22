"use client";

import { motion, type Variants } from "framer-motion";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRef } from "react";
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

const headingVariant: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function FeaturedProductsSection({ products }: { products: Product[] }) {
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <section className="bg-[#F5F1EA] py-16 sm:py-20">
      <div className="container mx-auto px-6">
        {/* Heading row with scroll arrows */}
        <motion.div
          className="flex items-end justify-between mb-8 sm:mb-10"
          variants={headingVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div>
            <p className="text-[#B8956A] text-xs tracking-[0.3em] uppercase font-semibold mb-2">
              {featuredLabel}
            </p>
            <h2
              className="text-4xl sm:text-5xl text-[#2A2620] leading-tight"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 300, fontStyle: "italic" }}
            >
              {sectionTitle}
            </h2>
          </div>

          {/* Arrow controls */}
          <div className="hidden sm:flex items-center gap-2 pb-1">
            <button
              onClick={() => scrollBy(-1)}
              className="w-9 h-9 rounded-full border border-[#B8956A]/50 text-[#B8956A] flex items-center justify-center hover:bg-[#B8956A] hover:text-white transition-all duration-200"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="w-9 h-9 rounded-full border border-[#B8956A]/50 text-[#B8956A] flex items-center justify-center hover:bg-[#B8956A] hover:text-white transition-all duration-200"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Horizontal scroll carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="snap-start flex-none w-72 sm:w-80"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" as const }}
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-4 text-[11px] tracking-[0.5em] uppercase font-mono text-[#2A2620] hover:text-[#B8956A] transition-colors duration-300"
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
