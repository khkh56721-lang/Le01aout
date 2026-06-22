import { getLocale } from "next-intl/server";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroSection from "@/components/HeroSection";
import AnimatedCategories from "@/components/AnimatedCategories";
import EditorialRows from "@/components/EditorialRows";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import products from "../../../data/products.json";

const DESIGN_TEASER_IMG =
  "https://res.cloudinary.com/ddjmrcbdw/image/upload/v1781892949/le01aout/showroom/b6_dsc0913.jpg";

export default async function HomePage() {
  const locale = await getLocale();
  const featured = products.slice(0, 6);

  const showroomEyebrow =
    locale === "ar" ? "زوروا معرضنا" : locale === "fr" ? "Visitez notre showroom" : "Visit our showroom";
  const showroomTitle =
    locale === "ar" ? "نواكشوط، موريتانيا" : locale === "fr" ? "Nouakchott, Mauritanie" : "Nouakchott, Mauritania";
  const showroomAddress =
    locale === "ar" ? "طريق صكوك، تفرغ زينة" : locale === "fr" ? "Tevragh Zeina, Route Socogim" : "Tevragh Zeina, Socogim Road";
  const whatsappLabel =
    locale === "ar" ? "تواصل واتساب" : locale === "fr" ? "WhatsApp" : "WhatsApp";
  const contactLabel =
    locale === "ar" ? "اتصل بنا" : locale === "fr" ? "Nous contacter" : "Contact us";

  const isAr = locale === "ar";
  const designEyebrow =
    locale === "ar" ? "خدمة جديدة" : locale === "fr" ? "Nouveau service" : "New service";
  const designTitle =
    locale === "ar" ? "صمّمنا مساحتك ثلاثيّة الأبعاد قبل أن نبنيها"
    : locale === "fr" ? "Votre espace en 3D avant même de le construire"
    : "Your space in 3D before we build it";
  const designText =
    locale === "ar" ? "خدمة تصميم هندسي ثلاثي الأبعاد متكاملة — تُشاهد منزلك أو مشروعك كاملًا قبل التنفيذ، ثم ننفّذه بإشرافٍ هندسيٍّ كامل من الفكرة حتى التسليم."
    : locale === "fr" ? "Un service de design 3D intégral — visualisez votre maison ou votre projet en entier avant les travaux, puis nous le réalisons sous supervision d'ingénierie, de l'idée à la livraison."
    : "An integrated 3D engineering design service — see your home or project in full before any work, then we build it under complete engineering supervision, from idea to handover.";
  const designPoints =
    locale === "ar" ? ["شاهد قبل التنفيذ", "خبرة تقلّل الأخطاء", "تنفيذ متكامل ومضمون"]
    : locale === "fr" ? ["Visualisez avant les travaux", "Une expertise sans erreurs", "Exécution intégrale & garantie"]
    : ["See it before you build", "Expertise that prevents errors", "End-to-end, guaranteed execution"];
  const designCta =
    locale === "ar" ? "اكتشف التصميم ثلاثي الأبعاد" : locale === "fr" ? "Découvrir le design 3D" : "Discover 3D design";

  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── CATEGORIES ──────────────────────────────────────────────────── */}
      <AnimatedCategories />

      {/* ── EDITORIAL ROWS ──────────────────────────────────────────────── */}
      <EditorialRows />

      {/* ── FEATURED PRODUCTS ───────────────────────────────────────────── */}
      <FeaturedProductsSection products={featured} />

      {/* ── 3D DESIGN TEASER ────────────────────────────────────────────── */}
      {/* Smooth fade from cream into the dark feature band */}
      <div className="h-20 bg-gradient-to-b from-[#F5F1EA] to-[#1A1814]" aria-hidden />
      <section className="bg-[#1A1814] text-white">
        <div className="grid lg:grid-cols-2 items-stretch">
          <div className={`relative min-h-[320px] lg:min-h-[520px] ${isAr ? "lg:order-2" : ""}`}>
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
          <div className={`flex items-center px-6 sm:px-12 lg:px-16 py-16 lg:py-24 ${isAr ? "text-right" : ""}`}>
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
              <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-8">{designText}</p>
              <ul className={`space-y-3 mb-10 ${isAr ? "flex flex-col items-end" : ""}`}>
                {designPoints.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-white/90">
                    <span className="text-[#B8956A]">✦</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/design"
                className="inline-flex items-center justify-center gap-2 bg-[#B8956A] text-[#1A1814] font-bold py-4 px-8 hover:bg-white transition-all duration-300 text-sm"
              >
                {designCta}
                <span aria-hidden>{isAr ? "←" : "→"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Smooth fade from the dark band back into cream */}
      <div className="h-20 bg-gradient-to-b from-[#1A1814] to-[#F5F1EA]" aria-hidden />

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <Testimonials />

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <FAQ />

      {/* ── VISIT SHOWROOM CTA ──────────────────────────────────────────── */}
      <section className="bg-[#E8E2D5] py-16 sm:py-20 border-t border-[#B8956A]/20 text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <p className="text-[10px] tracking-[0.4em] uppercase font-mono text-[#B8956A] mb-4">
            {showroomEyebrow}
          </p>
          <h2
            className="text-4xl sm:text-5xl text-[#2A2620] mb-4"
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
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-[#B8956A] text-[#2A2620] font-semibold px-8 py-3.5 rounded-full hover:bg-[#B8956A] hover:text-white transition-all text-sm"
            >
              {contactLabel}
            </a>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}
