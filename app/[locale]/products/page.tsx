import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import products from "../../../../data/products.json";
import categories from "../../../../data/categories.json";
import { searchProducts } from "@/lib/search";
import { generalWhatsAppMessage, whatsAppUrl } from "@/lib/whatsapp";

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const t = await getTranslations();
  const locale = await getLocale();
  const { category, q } = await searchParams;
  const query = (q ?? "").trim().slice(0, 60);

  // A search covers the whole catalog, whichever family was open.
  const filtered = query
    ? searchProducts(products, query, categories.categories)
    : category && category !== "all"
      ? products.filter((p) => p.category === category)
      : products;

  // Long lists show 2 per row on phones instead of 1, so a big category stays
  // scannable. Derived from the count so new categories pick it up on their own.
  const DENSE_MOBILE_THRESHOLD = 30;
  const denseMobile = filtered.length > DENSE_MOBILE_THRESHOLD;

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-10">
          {t("nav.products")}
        </h1>

        {/* A plain GET form: it must work on a slow phone before any JavaScript runs.
            text-base keeps iOS from zooming the page on focus. */}
        <form action={`/${locale}/products`} method="get" role="search" className="relative mb-6 max-w-xl">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder={t("product.search_placeholder")}
            aria-label={t("product.search_placeholder")}
            autoComplete="off"
            enterKeyHint="search"
            maxLength={60}
            className="w-full h-12 rounded-full border border-[#E8E2D5] bg-white ps-5 pe-14 text-base text-[#2A2620] placeholder:text-[#6B6358] focus:outline-none focus:border-[#B8956A]"
          />
          <button
            type="submit"
            aria-label={t("product.search_button")}
            className="absolute end-1 top-1 w-10 h-10 rounded-full bg-[#2A2620] text-white flex items-center justify-center hover:bg-[#B8956A] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </form>

        <CategoryFilter categories={categories.categories} active={query ? undefined : category} />

        {query && filtered.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-[#6B6358]">
            <p>{t("product.search_results", { count: filtered.length, query })}</p>
            <Link href="/products" className="underline underline-offset-4 hover:text-[#B8956A]">
              {t("product.search_clear")}
            </Link>
          </div>
        )}

        {filtered.length > 0 ? (
          <div
            className={
              denseMobile
                ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mt-8"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
            }
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} compact={denseMobile} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-2">
            <p className="text-xl text-[#2A2620]">{t("product.search_none", { query })}</p>
            <p className="text-sm mt-3 text-[#6B6358] leading-relaxed">{t("product.search_none_hint")}</p>
            <a
              href={whatsAppUrl(`${generalWhatsAppMessage(locale)}: ${query}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 rounded-full bg-[#2A2620] text-white text-sm px-6 py-3 hover:bg-[#B8956A] transition-colors"
            >
              {t("product.search_ask")}
            </a>
            <div className="mt-5">
              <Link href="/products" className="text-sm text-[#6B6358] underline underline-offset-4 hover:text-[#B8956A]">
                {t("product.search_clear")}
              </Link>
            </div>
          </div>
        )}
      </div>

      <WhatsAppButton />
    </>
  );
}
