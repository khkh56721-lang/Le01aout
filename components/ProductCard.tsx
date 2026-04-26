"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRef } from "react";

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

const CATEGORY_ICONS: Record<string, string> = {
  salon_complet: "🛋️", chambre_complete: "🛏️", chambre_enfant: "🧸",
  lit: "🛏️", table_manger: "🍽️", table_basse: "☕",
  chariot: "🛒", console_entree: "🪞", meuble_tv: "📺",
  lampadaire: "🕯️", veilleuse: "💡", tableau: "🖼️",
  khaima: "⛺", jalsat: "🛋️",
};

export default function ProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useTranslations("product");
  const cardRef = useRef<HTMLDivElement>(null);

  const name = locale === "ar" ? product.name_ar : product.name_fr;
  const image = product.images?.[0];
  const icon = CATEGORY_ICONS[product.subcategory ?? ""] ?? "🏠";

  const waMessage = `مرحبا، أريد الاستفسار عن: ${product.name_ar}`;
  const waUrl = `https://wa.me/22233322232?text=${encodeURIComponent(waMessage)}`;

  /* 3D tilt — only on non-touch devices */
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(hover: none)").matches) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateY =  ((x - cx) / cx) * 8;
    const rotateX = -((y - cy) / cy) * 6;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-[#0f0f0f] overflow-hidden shadow-md hover:shadow-2xl hover:shadow-[#C9A84C]/10 transition-[box-shadow,transform] duration-200 flex flex-col border border-white/5 hover:border-[#C9A84C]/30"
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* Image area */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden block"
        style={{ transform: "translateZ(8px)" }}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="text-5xl opacity-30">{icon}</span>
            <span className="text-xs text-gray-300 font-mono">{product.id}</span>
          </div>
        )}

        {/* Gold shimmer overlay — follows tilt direction */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#C9A84C]/0 to-[#C9A84C]/0 group-hover:from-[#C9A84C]/8 group-hover:to-transparent transition-all duration-300" />

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1" style={{ transform: "translateZ(4px)" }}>
          {product.made_to_order && (
            <span className="bg-[#C9A84C] text-[#1A1A2E] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {t("made_to_order")}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1" style={{ transform: "translateZ(4px)" }}>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1 font-mono">
          {product.id}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3
            className="text-white text-lg leading-snug mb-3 line-clamp-2 hover:text-[#C9A84C] transition-colors"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400 }}
          >
            {name}
          </h3>
        </Link>

        {product.price_mru ? (
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-2xl font-black text-[#C9A84C]">
              {product.price_mru.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 font-medium">MRU</span>
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-4 italic">{t("inquire")}</p>
        )}

        {/* Boca do Lobo text-link CTA */}
        <Link
          href={`/products/${product.id}`}
          className="mt-auto flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase font-mono text-gray-400 hover:text-[#C9A84C] transition-colors duration-300 group/link pt-3 border-t border-white/5"
        >
          <span className="w-5 h-px bg-current transition-all duration-300 group-hover/link:w-8" />
          {locale === "ar" ? "اكتشف" : locale === "fr" ? "Découvrir" : "Discover"}
        </Link>
      </div>
    </div>
  );
}
