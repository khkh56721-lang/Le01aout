import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import products from "../../../../../data/products.json";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return products.flatMap((p) =>
    ["ar", "fr", "en"].map((locale) => ({ locale, slug: p.id }))
  );
}

const CATEGORY_ICONS: Record<string, string> = {
  salon_complet: "🛋️", chambre_complete: "🛏️", chambre_enfant: "🧸",
  lit: "🛏️", table_manger: "🍽️", table_basse: "☕",
  chariot: "🛒", console_entree: "🪞", meuble_tv: "📺",
  lampadaire: "🕯️", veilleuse: "💡", tableau: "🖼️",
  khaima: "⛺", jalsat: "🛋️",
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations();

  const product = products.find((p) => p.id === slug);
  if (!product) notFound();

  const name = locale === "ar" ? product.name_ar : product.name_fr;
  const description =
    locale === "ar"
      ? product.description_ar
      : product.description_fr;

  const code = product.id.toUpperCase().replace(/-/g, "_");
  const image = product.images?.[0];
  const icon = CATEGORY_ICONS[product.subcategory ?? ""] ?? "🏠";

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const waMessage = `مرحبا، أريد الاستفسار عن: ${product.name_ar} (${code})`;
  const waUrl = `https://wa.me/22233322232?text=${encodeURIComponent(waMessage)}`;

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <Link
          href="/products"
          className="inline-block text-sm text-gray-500 hover:text-[#C9A84C] mb-6 transition-colors"
        >
          {t("product.back_to_products")}
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 shadow-sm">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="text-8xl opacity-30">{icon}</span>
                <span className="text-sm text-gray-300 font-mono tracking-widest">{code}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs text-[#C9A84C] uppercase tracking-[0.3em] font-bold mb-3">
              {t(`categories.${product.category}`)}
            </p>
            <h1 className="text-3xl lg:text-4xl font-black text-[#1A1A2E] mb-2 leading-tight">
              {name}
            </h1>
            <p className="text-xs text-gray-400 font-mono mb-6">
              {t("product.code")}: {code}
            </p>

            {/* Price */}
            {product.price_mru ? (
              <div className="flex items-baseline gap-2 mb-8 pb-8 border-b border-gray-100">
                <span className="text-5xl font-black text-[#C9A84C]">
                  {product.price_mru.toLocaleString()}
                </span>
                <span className="text-base text-gray-400 font-medium">MRU</span>
              </div>
            ) : (
              <p className="text-lg text-gray-400 italic mb-8 pb-8 border-b border-gray-100">
                {t("product.inquire")}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.in_stock && (
                <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-100">
                  ✓ {t("product.in_stock")}
                </span>
              )}
              {product.made_to_order && (
                <span className="bg-[#C9A84C]/10 text-[#8a6f20] text-xs font-bold px-3 py-1.5 rounded-full border border-[#C9A84C]/30">
                  ★ {t("product.made_to_order")}
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider mb-3">
                  {t("product.description")}
                </h2>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Specs */}
            {(product.colors?.length > 0 ||
              product.materials?.length > 0 ||
              product.dimensions) && (
              <div className="mb-8 bg-gray-50 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider mb-4">
                  {t("product.specs")}
                </h2>
                <dl className="space-y-3 text-sm">
                  {product.colors?.length > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">{t("product.colors")}</dt>
                      <dd className="font-semibold text-[#1A1A2E] text-end">
                        {product.colors.join(" · ")}
                      </dd>
                    </div>
                  )}
                  {product.materials?.length > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">{t("product.materials")}</dt>
                      <dd className="font-semibold text-[#1A1A2E] text-end">
                        {product.materials.join(" · ")}
                      </dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">{t("product.dimensions")}</dt>
                      <dd className="font-semibold text-[#1A1A2E] text-end">
                        {product.dimensions}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#1A1A2E] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#C9A84C] hover:text-[#1A1A2E] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("product.request_whatsapp")}
            </a>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-8">
              {t("product.related")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <WhatsAppButton />
    </>
  );
}
