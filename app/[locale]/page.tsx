import { getLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroSection from "@/components/HeroSection";
import AnimatedCategories from "@/components/AnimatedCategories";
import EditorialRows from "@/components/EditorialRows";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import products from "../../../data/products.json";

export default async function HomePage() {
  const locale = await getLocale();
  const featured = products.slice(0, 6);

  const trustItems = [
    { icon: "🚚", label_ar: "توصيل نواكشوط",    label_fr: "Livraison Nouakchott", label_en: "Nouakchott delivery"    },
    { icon: "💰", label_ar: "دفع بالتقسيط",      label_fr: "Paiement échelonné",  label_en: "Installment payment"    },
    { icon: "📐", label_ar: "مقاسات حسب الطلب",  label_fr: "Sur mesure possible", label_en: "Custom sizes available" },
    { icon: "⭐", label_ar: "جودة مضمونة",       label_fr: "Qualité garantie",    label_en: "Quality guaranteed"     },
  ];

  const trustLabel = (item: typeof trustItems[0]) =>
    locale === "ar" ? item.label_ar : locale === "fr" ? item.label_fr : item.label_en;

  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── CATEGORIES ──────────────────────────────────────────────────── */}
      <AnimatedCategories />

      {/* ── EDITORIAL ROWS (Bugatti chapter style) ──────────────────────── */}
      <EditorialRows />

      {/* ── FEATURED PRODUCTS ───────────────────────────────────────────── */}
      <FeaturedProductsSection products={featured} />

      {/* ── TRUST STRIP ─────────────────────────────────────────────────── */}
      <section className="bg-[#1A1A2E] py-10 border-t border-[#C9A84C]/10">
        <div className="container mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {trustItems.map((item) => (
            <div key={item.icon} className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-sm text-gray-400 hover:text-[#C9A84C] transition-colors duration-300 group">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
              <span className="text-xs sm:text-sm leading-tight">{trustLabel(item)}</span>
            </div>
          ))}
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}
