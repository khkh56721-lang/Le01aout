import { getLocale } from "next-intl/server";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroHouseTour from "@/components/HeroHouseTour";
import AnimatedCategories from "@/components/AnimatedCategories";
import EditorialRows from "@/components/EditorialRows";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import FAQ from "@/components/FAQ";
import { Link } from "@/i18n/navigation";
import products from "../../../data/products.json";
import { getTourRooms } from "@/lib/houseTour";

const DESIGN_TEASER_IMG =
  "https://res.cloudinary.com/ddjmrcbdw/image/upload/f_auto,q_auto,w_1600/v1782586573/le01aout/site/design_3d.png";

export default async function HomePage() {
  const locale = await getLocale();
  const featured = products.slice(0, 6);
  const tourRooms = getTourRooms();

  const showroomEyebrow =
    locale === "ar" ? "زوروا معرضنا" : locale === "fr" ? "Visitez notre showroom" : "Visit our showroom";
  const showroomTitle =
    locale === "ar" ? "نواكشوط، موريتانيا" : locale === "fr" ? "Nouakchott, Mauritanie" : "Nouakchott, Mauritania";
  const showroomAddress =
    locale === "ar" ? "طريق صكوك، نواكشوط" : locale === "fr" ? "Route Sukuk, Nouakchott" : "Route Sukuk, Nouakchott";
  const whatsappLabel =
    locale === "ar" ? "تواصل واتساب" : locale === "fr" ? "WhatsApp" : "WhatsApp";
  const contactLabel =
    locale === "ar" ? "اتصل بنا" : locale === "fr" ? "Nous contacter" : "Contact us";

  const isAr = locale === "ar";
  const designEyebrow =
    locale === "ar" ? "خدمة جديدة" : locale === "fr" ? "Nouveau service" : "New service";
  const designTitle =
    locale === "ar" ? "نصمّم، نصنّع، ونركّب — على ذوقك"
    : locale === "fr" ? "Nous concevons, fabriquons et installons — sur mesure"
    : "We design, manufacture and install — made to measure";
  const designText =
    locale === "ar" ? "من الجدران الخشبية ووحدات التلفزيون إلى الأثاث حسب الطلب — نصمّم مشروعك ثلاثي الأبعاد لتشاهده قبل التنفيذ، ثم نصنّعه في ورشتنا ونركّبه في بيتك بإشرافٍ هندسيٍّ كامل."
    : locale === "fr" ? "Murs en bois, meubles TV, mobilier sur mesure — nous concevons votre projet en 3D pour le voir avant les travaux, puis notre atelier le fabrique et l'installe chez vous, sous supervision d'ingénierie."
    : "Wood-panel walls, TV walls, custom furniture — we design your project in 3D so you see it first, then our own workshop manufactures and installs it under full engineering supervision.";
  const designPoints =
    locale === "ar" ? ["تصميم ثلاثي الأبعاد قبل التنفيذ", "تصنيع في ورشتنا الخاصة", "تركيب وتسليم مضمون"]
    : locale === "fr" ? ["Design 3D avant les travaux", "Fabrication dans notre atelier", "Pose & livraison garanties"]
    : ["3D design before any work", "Made in our own workshop", "Guaranteed installation & handover"];
  const designCta =
    locale === "ar" ? "اكتشف التصميم والتصنيع" : locale === "fr" ? "Découvrir l'atelier" : "Discover design & manufacturing";

  return (
    <>
      <Navbar />

      {/* ── HERO — scroll-driven walk through five real rooms ────────────── */}
      <HeroHouseTour rooms={tourRooms} />

      {/* ── CATEGORIES ──────────────────────────────────────────────────── */}
      <AnimatedCategories />

      {/* ── EDITORIAL ROWS ──────────────────────────────────────────────── */}
      <EditorialRows />

      {/* ── FEATURED PRODUCTS ───────────────────────────────────────────── */}
      <FeaturedProductsSection products={featured} />

      {/* ── 3D DESIGN TEASER ────────────────────────────────────────────── */}
      {/* Tall warm fade from cream into the dark feature band — the light dims
          through the palette's warm grey instead of cutting to black */}
      <div className="h-24 sm:h-40 bg-gradient-to-b from-[#F5F1EA] via-[#6B6358] to-[#1A1814]" aria-hidden />
      <section className="bg-[#1A1814] text-white">
        <div className="grid lg:grid-cols-2 items-stretch">
          <div className={`relative min-h-[200px] lg:min-h-[520px] ${isAr ? "lg:order-2" : ""}`}>
            <Image
              src={DESIGN_TEASER_IMG}
              alt={designTitle}
              fill
              quality={90}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1814]/60 via-transparent to-transparent lg:bg-gradient-to-r" />
          </div>
          <div className={`flex items-center px-6 sm:px-12 lg:px-16 py-10 sm:py-16 lg:py-24 ${isAr ? "text-right" : ""}`}>
            <div className="max-w-lg">
              <p className="text-[10px] tracking-[0.45em] uppercase font-mono text-[#B8956A] mb-5">
                {designEyebrow}
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 300, fontStyle: "italic" }}
              >
                {designTitle}
              </h2>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-5">{designText}</p>
              <ul className={`space-y-2.5 mb-6 ${isAr ? "flex flex-col items-end" : ""}`}>
                {designPoints.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-white/90">
                    <span className="text-[#B8956A]">✦</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/design"
                className="inline-flex items-center justify-center gap-2 bg-[#B8956A] text-[#1A1814] font-bold py-4 px-8 hover:bg-white transition-all duration-300 text-sm"
              >
                {designCta}
                <span aria-hidden>{isAr ? "←" : "→"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Tall warm fade from the dark band back into cream */}
      <div className="h-24 sm:h-40 bg-gradient-to-b from-[#1A1814] via-[#6B6358] to-[#F5F1EA]" aria-hidden />

      {/* Testimonials removed 2026-09-27: its three names were placeholders. Put it back only
          with real client reviews (components/Testimonials.tsx is kept for that). */}

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <FAQ />

      {/* ── VISIT SHOWROOM CTA ──────────────────────────────────────────── */}
      <section className="bg-[#E8E2D5] py-10 sm:py-20 border-t border-[#B8956A]/20 text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <p className="text-[10px] tracking-[0.4em] uppercase font-mono text-[#B8956A] mb-4">
            {showroomEyebrow}
          </p>
          <h2
            className="text-3xl sm:text-5xl text-[#2A2620] mb-4"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 300, fontStyle: "italic" }}
          >
            {showroomTitle}
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-[#B8956A]" />
            <span className="text-[#B8956A]">✦</span>
            <div className="h-px w-12 bg-[#B8956A]" />
          </div>
          <p className="text-sm text-[#6B6358] mb-2">{showroomAddress}</p>
          <p className="text-sm text-[#6B6358] mb-8" dir="ltr">+222 33 32 22 32</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/22233322232"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#2A2620] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#1A1814] transition-all text-sm"
            >
              {whatsappLabel}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-[#B8956A] text-[#2A2620] font-semibold px-8 py-3.5 rounded-full hover:bg-[#B8956A] hover:text-white transition-all text-sm"
            >
              {contactLabel}
            </Link>
          </div>
        </div>
      </section>
      {/* Ease the taupe showroom band into the dark footer — no hard cut */}
      <div className="h-16 sm:h-24 bg-gradient-to-b from-[#E8E2D5] via-[#6B6358] to-[#1A1814]" aria-hidden />

      <WhatsAppButton />
    </>
  );
}
