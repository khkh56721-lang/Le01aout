import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import BackLink from "@/components/BackLink";
import ProductCard from "@/components/ProductCard";
import ProductVariants, { type VariantOption } from "@/components/ProductVariants";
import ProductReviews from "@/components/ProductReviews";
import { getProductContent } from "@/lib/productContent";
import { ogImageUrl, productPageUrl } from "@/lib/whatsapp";
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

type Product = (typeof products)[number];

const localizedName = (p: Product, locale: string) =>
  locale === "ar" ? p.name_ar : locale === "en" ? p.name_en || p.name_fr : p.name_fr;

const localizedShortDesc = (p: Product, locale: string) =>
  locale === "ar"
    ? p.description_ar
    : locale === "en"
      ? p.description_en || p.description_fr
      : p.description_fr;

const pick = (locale: string, ar: string, fr: string, en: string) =>
  locale === "ar" ? ar : locale === "en" ? en || fr : fr;

// Open Graph is what makes the WhatsApp order flow readable: the prefilled message
// carries the product URL, and these tags are what WhatsApp turns into a preview
// card with the product photo, so the team sees which item the client tapped.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) return {};

  const name = localizedName(product, locale);
  const description = localizedShortDesc(product, locale);
  const url = productPageUrl(locale, slug);
  const image = ogImageUrl(product.images[0]);

  return {
    title: `${name} — Le 1er Août Déco`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: "Le 1er Août Déco",
      locale: locale === "ar" ? "ar_MR" : locale === "fr" ? "fr_FR" : "en_US",
      title: `${name} · ${product.code}`,
      description,
      url,
      images: [{ url: image, width: 1200, height: 1200, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} · ${product.code}`,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations();

  const product = products.find((p) => p.id === slug);
  if (!product) notFound();

  const content = getProductContent(slug);

  const name = localizedName(product, locale);

  // Prefer the richer long description from the content layer; fall back to the short catalog one.
  const longDesc = content?.description_long;
  const localizedLong = longDesc
    ? locale === "ar"
      ? longDesc.ar
      : locale === "fr"
        ? longDesc.fr
        : longDesc.en
    : "";
  const description = localizedLong || localizedShortDesc(product, locale);

  // The catalog code (PR_600) — the same key the team searches in Odoo. It used to
  // be derived from the slug, which produced a reference that matched nothing.
  const code = product.code;
  const icon = CATEGORY_ICONS[product.subcategory ?? ""] ?? "🏠";

  // Multi-item gallery: dedicated gallery_images if curated, else the main product images.
  const galleryImages =
    content?.gallery_images && content.gallery_images.length > 0
      ? content.gallery_images
      : (product.images ?? []);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Some products (e.g. a set of same-size wall art) fold several catalog codes into
  // one page as swatch options instead of separate listings — see product.variants.
  const rawVariants = (product as Product & {
    variants?: {
      code: string;
      name_ar: string;
      name_fr: string;
      name_en: string;
      image: string;
      description_ar: string;
      description_fr: string;
      description_en: string;
    }[];
  }).variants;

  const variantOptions: VariantOption[] = rawVariants && rawVariants.length > 0
    ? rawVariants.map((v) =>
        v.code === code
          ? { code, name, description, images: galleryImages }
          : {
              code: v.code,
              name: pick(locale, v.name_ar, v.name_fr, v.name_en),
              description: pick(locale, v.description_ar, v.description_fr, v.description_en),
              images: [v.image],
            }
      )
    : [{ code, name, description, images: galleryImages }];

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <BackLink
          fallbackHref={`/products?category=${product.category}`}
          label={t("product.back_to_products")}
          className="inline-block text-sm text-gray-500 hover:text-[#C9A84C] mb-6 transition-colors cursor-pointer"
        />

        <ProductVariants
          variants={variantOptions}
          locale={locale}
          slug={product.id}
          icon={icon}
          categoryLabel={t(`categories.${product.category}`)}
          inStock={product.in_stock}
          colors={product.colors ?? []}
          materials={product.materials ?? []}
          dimensions={product.dimensions ?? null}
          strings={{
            codeLabel: t("product.code"),
            inStock: t("product.in_stock"),
            descriptionLabel: t("product.description"),
            specsLabel: t("product.specs"),
            colorsLabel: t("product.colors"),
            materialsLabel: t("product.materials"),
            dimensionsLabel: t("product.dimensions"),
            requestWhatsApp: t("product.request_whatsapp"),
          }}
        />

        {/* Social proof — purchase count + customer reviews */}
        {content && (
          <ProductReviews
            reviews={content.reviews}
            purchaseCount={content.purchase_count}
            rating={content.rating}
          />
        )}

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
    </>
  );
}
