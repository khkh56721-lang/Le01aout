"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
interface Product {
  id: string;
  name_ar: string;
  name_fr: string;
  name_en?: string;
  category: string;
  subcategory?: string;
  price_mru: number | null;
  images: string[];
  made_to_order: boolean;
  in_stock: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  salon_complet: "🛋️", chambre_complete: "🛏️", chambre_enfant: "🧸",
  lit: "🛏️", table_manger: "🍽️", table_basse: "☕",
  chariot: "🛒", console_entree: "🪞", meuble_tv: "📺",
  lampadaire: "🕯️", veilleuse: "💡", tableau: "🖼️",
  khaima: "⛺", jalsat: "🛋️",
};

export default function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("product");
  const name =
    locale === "ar"
      ? product.name_ar
      : locale === "en"
        ? product.name_en || product.name_fr
        : product.name_fr;
  const image = product.images?.[0];
  const icon = CATEGORY_ICONS[product.subcategory ?? ""] ?? "🏠";

  return (
    <div
      className="group relative bg-white overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col border border-[#E8E2D5] hover:border-[#B8956A]/40"
    >
      {/* Image area */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-[4/3] bg-[#E8E2D5] overflow-hidden block"
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes={
              compact
                ? "(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            quality={90}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="text-5xl opacity-20">{icon}</span>
            <span className="text-xs text-[#6B6358] font-mono">{product.id}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1">
          {product.in_stock !== false && (
            <span className="bg-[#5A7D4F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {t("in_stock")}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className={`${compact ? "p-3 sm:p-5" : "p-5"} flex flex-col flex-1`}>
        <p className="text-[10px] text-[#6B6358] uppercase tracking-widest mb-1 font-mono">
          {product.category.replace("_", " ")}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3
            className={`text-[#2A2620] ${compact ? "text-sm sm:text-lg mb-2 sm:mb-3" : "text-lg mb-3"} leading-snug line-clamp-2 hover:text-[#B8956A] transition-colors`}
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontStyle: "italic" }}
          >
            {name}
          </h3>
        </Link>

        {/* Text-link CTA with animated gold line */}
        <Link
          href={`/products/${product.id}`}
          className="mt-auto flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase font-mono text-[#6B6358] hover:text-[#B8956A] transition-colors duration-300 group/link pt-3 border-t border-[#E8E2D5]"
        >
          <span className="w-5 h-px bg-[#B8956A] transition-all duration-300 group-hover/link:w-8" />
          {locale === "ar" ? "اكتشف" : locale === "fr" ? "Découvrir" : "Discover"}
        </Link>
      </div>
    </div>
  );
}
