import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import products from "../../../../data/products.json";
import categories from "../../../../data/categories.json";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const t = await getTranslations();
  const { category } = await searchParams;

  const filtered =
    category && category !== "all"
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

        <CategoryFilter categories={categories.categories} active={category} />

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
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">Aucun produit dans cette catégorie</p>
            <p className="text-sm mt-2">لا توجد منتجات في هذه الفئة</p>
          </div>
        )}
      </div>

      <WhatsAppButton />
    </>
  );
}
