"use client";

import { useState } from "react";
import ProtectedImage from "@/components/ProtectedImage";
import ProductGallery from "@/components/ProductGallery";
import WhatsAppButton from "@/components/WhatsAppButton";
import { productWhatsAppMessage, whatsAppUrl } from "@/lib/whatsapp";
import { thumbImage } from "@/lib/watermark";

export interface VariantOption {
  code: string;
  name: string;
  description: string;
  images: string[];
}

interface ProductVariantsProps {
  variants: VariantOption[];
  locale: string;
  slug: string;
  icon: string;
  categoryLabel: string;
  inStock: boolean;
  colors: string[];
  materials: string[];
  dimensions: string | null;
  strings: {
    codeLabel: string;
    inStock: string;
    descriptionLabel: string;
    specsLabel: string;
    colorsLabel: string;
    materialsLabel: string;
    dimensionsLabel: string;
    requestWhatsApp: string;
  };
}

const variantsLabel = (locale: string) =>
  locale === "ar" ? "التصميم واللون" : locale === "fr" ? "Design & Couleur" : "Design & Color";

export default function ProductVariants({
  variants,
  locale,
  slug,
  icon,
  categoryLabel,
  inStock,
  colors,
  materials,
  dimensions,
  strings,
}: ProductVariantsProps) {
  const [active, setActive] = useState(0);
  const current = variants[Math.min(active, variants.length - 1)];

  const waMessage = productWhatsAppMessage({
    locale,
    name: current.name,
    code: current.code,
    slug,
    icon,
  });
  const waUrl = whatsAppUrl(waMessage);

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <ProductGallery images={current.images} name={current.name} icon={icon} code={current.code} />

        <div className="flex flex-col">
          <p className="text-xs text-[#C9A84C] uppercase tracking-[0.3em] font-bold mb-3">
            {categoryLabel}
          </p>
          <h1 className="text-3xl lg:text-4xl font-black text-[#1A1A2E] mb-2 leading-tight">
            {current.name}
          </h1>
          <p className="text-xs text-gray-400 font-mono mb-6 pb-6 border-b border-gray-100">
            {strings.codeLabel}: {current.code}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {inStock && (
              <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-100">
                ✓ {strings.inStock}
              </span>
            )}
          </div>

          {variants.length > 1 && (
            <div className="mb-8">
              <h2 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider mb-4">
                {variantsLabel(locale)}
              </h2>
              <div className="flex flex-wrap gap-3">
                {variants.map((v, i) => (
                  <button
                    key={v.code}
                    type="button"
                    onClick={() => setActive(i)}
                    title={v.name}
                    aria-label={v.name}
                    aria-pressed={i === active}
                    className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 bg-[#F5F1EA] transition-all ${
                      i === active
                        ? "border-[#B8956A] shadow-md ring-2 ring-[#B8956A]/30"
                        : "border-[#E8E2D5] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <ProtectedImage
                      src={thumbImage(v.images[0])}
                      alt={v.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {current.description && (
            <div className="mb-8">
              <h2 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider mb-3">
                {strings.descriptionLabel}
              </h2>
              <p className="text-gray-600 leading-relaxed">{current.description}</p>
            </div>
          )}

          {(colors.length > 0 || materials.length > 0 || dimensions) && (
            <div className="mb-8 bg-gray-50 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider mb-4">
                {strings.specsLabel}
              </h2>
              <dl className="space-y-3 text-sm">
                {colors.length > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">{strings.colorsLabel}</dt>
                    <dd className="font-semibold text-[#1A1A2E] text-end">{colors.join(" · ")}</dd>
                  </div>
                )}
                {materials.length > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">{strings.materialsLabel}</dt>
                    <dd className="font-semibold text-[#1A1A2E] text-end">{materials.join(" · ")}</dd>
                  </div>
                )}
                {dimensions && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">{strings.dimensionsLabel}</dt>
                    <dd className="font-semibold text-[#1A1A2E] text-end">{dimensions}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#1A1A2E] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#C9A84C] hover:text-[#1A1A2E] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {strings.requestWhatsApp}
          </a>
        </div>
      </div>

      <WhatsAppButton message={waMessage} locale={locale} />
    </>
  );
}
