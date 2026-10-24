import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import Reveal from "@/components/Reveal";
import { MAPS_URL } from "@/lib/location";
import { generalWhatsAppMessage, whatsAppUrl } from "@/lib/whatsapp";
import products from "../../../../data/products.json";

// Every fact on this page was checked with Khaled on 2026-10-24: opened in 2019,
// SARL since July 2026, showroom open every day 9:00–23:00, humans answer WhatsApp.
// The catalogue count is read from products.json so it can never go stale.

const CLD = "https://res.cloudinary.com/ddjmrcbdw/image/upload";

// Real showroom shoot (data/showroom_photos.json). Every one of these files has the
// team's logo baked in top right and the phone pill bottom left; this crop keeps
// the room and drops both.
const UNBRANDED = "c_crop,g_north_west,x_0.07,y_0.16,w_0.79,h_0.72";
const PHOTOS = {
  hero: "v1781893012/le01aout/showroom/b6_dsc0964",
  story: "v1781892863/le01aout/showroom/b1_dsc1169",
  showroom: "v1781892809/le01aout/showroom/b1_dsc1075",
  home: "v1781892993/le01aout/showroom/b6_dsc0946",
  office: "v1781892829/le01aout/showroom/b1_dsc1090",
  meeting: "v1781892873/le01aout/showroom/b1_dsc1191",
};

// Stills from the team's own video of a dressing + coffee corner built for a client
// (SOCIAL_MEDIA/VIDEOS_A_MONTER/IMG_8141.MP4). The /design page's mfr_* images are
// AI renders, so they are not used here as « our work ».
const ATELIER = [
  "/about/atelier-dressing-led.jpg",
  "/about/atelier-miroir-bois.jpg",
  "/about/atelier-coin-cafe.jpg",
];

function photoUrl(path: string, transform: string) {
  return `${CLD}/${UNBRANDED}/${transform},f_auto,q_auto/${path}.jpg`;
}

function photoSrcSet(path: string, ar: string, widths: number[]) {
  return widths
    .map((w) => `${photoUrl(path, `c_fill,ar_${ar},g_auto,w_${w}`)} ${w}w`)
    .join(", ");
}

function Photo({
  path,
  ar,
  widths,
  sizes,
  alt,
  className,
}: {
  path: string;
  ar: string;
  widths: number[];
  sizes: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={photoUrl(path, `c_fill,ar_${ar},g_auto,w_${widths[widths.length - 1]}`)}
      srcSet={photoSrcSet(path, ar, widths)}
      sizes={sizes}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tr = (ar: string, fr: string, en: string) =>
    locale === "ar" ? ar : locale === "fr" ? fr : en;
  return {
    title: tr("من نحن — Le 1er Août Déco", "À propos — Le 1er Août Déco", "About — Le 1er Août Déco"),
    description: tr(
      "معرض أثاث وديكور وورشة تصنيع حسب الطلب في نواكشوط منذ 2019.",
      "Showroom de meubles et de décoration et atelier de fabrication sur mesure à Nouakchott depuis 2019.",
      "Furniture and décor showroom and made-to-measure workshop in Nouakchott since 2019."
    ),
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const tContact = await getTranslations("contact");
  const isAr = locale === "ar";
  const tr = (ar: string, fr: string, en: string) =>
    locale === "ar" ? ar : locale === "fr" ? fr : en;

  // Cormorant has no Arabic glyphs: Arabic headings use Cairo instead of a fallback serif.
  const display = isAr
    ? { fontFamily: "var(--font-cairo), sans-serif", fontWeight: 700 }
    : { fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 300, fontStyle: "italic" as const };

  // Letter-spacing pulls Arabic letters apart, so the small gold labels lose it in AR.
  const eyebrow = isAr
    ? "text-xs font-semibold text-[#B8956A]"
    : "text-[10px] tracking-[0.45em] uppercase font-mono text-[#B8956A]";

  const catalogFloor = Math.floor(products.length / 100) * 100;
  const waUrl = whatsAppUrl(generalWhatsAppMessage(locale));
  const arrow = isAr ? "←" : "→";

  const facts = [
    { value: "2019", label: tr("سنة افتتاح المعرض", "Ouverture du showroom", "Showroom opened") },
    { value: `${catalogFloor}+`, label: tr("قطعة في الكتالوج على الموقع", "Pièces au catalogue en ligne", "Pieces in the online catalogue") },
    { value: "7/7", label: tr("كل يوم من 9 صباحًا إلى 11 ليلًا", "Tous les jours, de 9h à 23h", "Every day, 9 am to 11 pm") },
  ];

  const spaces = [
    {
      path: PHOTOS.home,
      title: tr("المنازل والشقق", "Maisons & appartements", "Homes & apartments"),
      text: tr("صالونات، غرف نوم، غرف طعام، غرف أطفال", "Salons, chambres, salles à manger, chambres d'enfants", "Living rooms, bedrooms, dining rooms, kids' rooms"),
    },
    {
      path: PHOTOS.office,
      title: tr("مكاتب الشركات والإدارات", "Bureaux d'entreprises & administrations", "Company & government offices"),
      text: tr("مكاتب المدراء، مكاتب العمل، الكراسي المكتبية", "Bureaux de direction, postes de travail, fauteuils", "Executive desks, workstations, office chairs"),
    },
    {
      path: PHOTOS.meeting,
      title: tr("قاعات الاجتماعات والاستقبال", "Salles de réunion & accueil", "Meeting rooms & reception"),
      text: tr("طاولات اجتماعات وكاونترات استقبال", "Tables de réunion, comptoirs d'accueil", "Meeting tables, reception counters"),
    },
  ];

  const atelierAlts = [
    tr("خزانة بأبواب زجاجية وإضاءة LED", "Armoire à portes vitrées éclairée par LED", "Glass-door wardrobe with LED lighting"),
    tr("مرآة بإطار خشبي مضلّع وإضاءة LED", "Miroir à cadre en lattes de bois éclairé par LED", "Mirror in a slatted wood frame with LED lighting"),
    tr("ركن قهوة خشبي برفوف مضاءة", "Coin café en bois aux étagères éclairées", "Wooden coffee corner with lit shelves"),
  ];

  const steps = [
    {
      title: tr("اختاروا", "Choisissez", "Choose"),
      text: tr(
        "على هذا الموقع أو في المعرض، المفتوح كل يوم من 9 صباحًا إلى 11 ليلًا.",
        "Sur ce site ou au showroom, ouvert tous les jours de 9h à 23h.",
        "On this site or at the showroom, open every day from 9 am to 11 pm."
      ),
    },
    {
      title: tr("راسلونا على واتساب", "Écrivez-nous sur WhatsApp", "Message us on WhatsApp"),
      text: tr(
        "أرسلوا رمز القطعة، ويردّ عليكم أحد أفراد فريقنا بالسعر والتوفّر.",
        "Envoyez le code de la pièce : un membre de l'équipe vous répond avec le prix et la disponibilité.",
        "Send the piece's code: someone from our team replies with the price and availability."
      ),
    },
    {
      title: tr("التوصيل والتركيب", "Livraison & pose", "Delivery & installation"),
      text: tr(
        "نوصل طلبكم. وفي مشاريع التصنيع حسب الطلب، يركّب فريقنا كل شيء في المكان.",
        "Nous livrons votre commande. Pour le sur-mesure, notre équipe installe tout sur place.",
        "We deliver your order. For made-to-measure work, our team installs everything on site."
      ),
    },
  ];

  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[72svh] min-h-[480px] max-h-[780px] overflow-hidden bg-[#1A1814]">
        <picture>
          <source media="(orientation: portrait)" srcSet={photoSrcSet(PHOTOS.hero, "4:5", [600, 900, 1200])} />
          <img
            src={photoUrl(PHOTOS.hero, "c_fill,ar_16:9,g_auto,w_1920")}
            srcSet={photoSrcSet(PHOTOS.hero, "16:9", [960, 1440, 1920])}
            sizes="100vw"
            alt={tr("ركن جلوس ورفوف خشبية في معرض Le 1er Août Déco بنواكشوط", "Coin salon et étagères en bois dans le showroom Le 1er Août Déco à Nouakchott", "Seating corner and wooden shelving in the Le 1er Août Déco showroom, Nouakchott")}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1814] via-[#1A1814]/45 to-transparent" />
        <div className="relative z-10 h-full container mx-auto px-6 flex items-end pb-12 sm:pb-20">
          <div className="max-w-2xl text-start">
            <p className={`${eyebrow} mb-4`}>
              {tr("من نحن · نواكشوط", "À propos · Nouakchott", "About us · Nouakchott")}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-white leading-[1.15] mb-5" style={display}>
              {tr(
                "معرض للأثاث وورشة للتصنيع، في نواكشوط منذ 2019",
                "Un showroom et un atelier, à Nouakchott depuis 2019",
                "A showroom and a workshop, in Nouakchott since 2019"
              )}
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
              {tr(
                "أثاث وديكور راقٍ للمنازل والمكاتب والمحلات التجارية، وورشة تصمّم وتصنع حسب الطلب.",
                "Mobilier et décoration haut de gamme pour les maisons, les bureaux et les commerces, et un atelier qui conçoit et fabrique sur mesure.",
                "Premium furniture and décor for homes, offices and businesses, and a workshop that designs and builds to measure."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────────────────────── */}
      <section className="bg-[#F5F1EA] py-16 sm:py-24">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal>
            <p className={`${eyebrow} mb-4`}>
              {tr("قصتنا", "Notre histoire", "Our story")}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#2A2620] leading-tight mb-6" style={display}>
              {tr("نختار، نعرض، ونصنع", "Choisir, exposer, fabriquer", "We select, show and build")}
            </h2>
            <div className="space-y-4 text-[15px] sm:text-base text-[#6B6358] leading-relaxed">
              <p>
                {tr(
                  "افتتحنا معرضنا في نواكشوط سنة 2019. يأتي إليه زبائننا ليروا الصالونات وغرف النوم وغرف الطعام وأثاث المكاتب والإنارة والديكور، يلمسونها ويقارنون بينها قبل أن يختاروا.",
                  "Nous avons ouvert notre showroom à Nouakchott en 2019. On y vient voir, toucher et comparer salons, chambres, salles à manger, mobilier de bureau, luminaires et décoration avant de choisir.",
                  "We opened our showroom in Nouakchott in 2019. People come to see, touch and compare living rooms, bedrooms, dining rooms, office furniture, lighting and décor before they choose."
                )}
              </p>
              <p>
                {tr(
                  "وبجانب المعرض لدينا ورشتنا الخاصة: نرسم المشروع بتقنية ثلاثية الأبعاد، ثم نصنعه ونركّبه في المكان. ومنذ يوليو 2026 أصبحت الشركة شركة ذات مسؤولية محدودة (SARL).",
                  "À côté du showroom, nous avons notre propre atelier : nous dessinons le projet en 3D, puis nous le fabriquons et l'installons sur place. Depuis juillet 2026, l'entreprise est une SARL : 1ER AOUT SARL.",
                  "Next to the showroom we run our own workshop: we design the project in 3D, then build it and install it on site. Since July 2026 the company has been a limited liability company: 1ER AOUT SARL."
                )}
              </p>
              <p className="text-[#2A2620] font-medium">
                {tr(
                  "على واتساب، يردّ عليكم فريقنا بنفسه، وليس روبوتًا.",
                  "Sur WhatsApp, c'est notre équipe qui vous répond, pas un robot.",
                  "On WhatsApp, our own team answers you, not a bot."
                )}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Photo
              path={PHOTOS.story}
              ar="4:3"
              widths={[600, 900, 1200]}
              sizes="(max-width: 1024px) 100vw, 50vw"
              alt={tr("صالون تحت ثريا في المعرض", "Un salon sous un lustre dans le showroom", "A living room under a chandelier in the showroom")}
              className="w-full aspect-[4/3] object-cover"
            />
          </Reveal>
        </div>

        {/* Facts */}
        <div className="container mx-auto px-6 mt-14 sm:mt-20">
          <div className="grid grid-cols-3 border-y border-[#B8956A]/30 divide-x divide-[#B8956A]/20 rtl:divide-x-reverse">
            {facts.map((f) => (
              <div key={f.value} className="py-6 sm:py-8 px-2 text-center">
                <div
                  dir="ltr"
                  className="text-3xl sm:text-5xl text-[#B8956A] leading-none mb-2"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400 }}
                >
                  {f.value}
                </div>
                <div className="text-[11px] sm:text-xs text-[#6B6358] leading-snug">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DÉCO: THE SHOWROOM ───────────────────────────────────────────── */}
      <section className="bg-[#F5F1EA] pb-16 sm:pb-24">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-10 sm:mb-14">
            <p className={`${eyebrow} mb-3`}>
              {tr("ماذا نقدّم", "Ce que nous faisons", "What we do")}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#2A2620]" style={display}>
              {tr("نشاطان تحت سقف واحد", "Deux métiers, une seule maison", "Two trades, one house")}
            </h2>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <Reveal>
              <Photo
                path={PHOTOS.showroom}
                ar="3:2"
                widths={[600, 900, 1200]}
                sizes="(max-width: 1024px) 100vw, 50vw"
                alt={tr("قاعة العرض في المعرض", "L'espace d'exposition du showroom", "The showroom floor")}
                className="w-full aspect-[3/2] object-cover"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className={`${eyebrow} mb-3`}>
                {tr("ديكور", "Déco", "Décor")}
              </p>
              <h3 className="text-3xl sm:text-4xl text-[#2A2620] mb-5" style={display}>
                {tr("المعرض", "Le showroom", "The showroom")}
              </h3>
              <p className="text-[15px] sm:text-base text-[#6B6358] leading-relaxed mb-7">
                {tr(
                  "في معرضنا على طريق صكوك: صالونات، غرف نوم، غرف طعام، أثاث مكاتب، إنارة، لوحات، مرايا وإكسسوارات. والكتالوج كاملًا على هذا الموقع أيضًا، مع رمز كل قطعة لتسألونا عنها بسهولة.",
                  "Dans notre showroom de la route Sukuk : salons, chambres, salles à manger, mobilier de bureau, luminaires, tableaux, miroirs et accessoires. Tout le catalogue est aussi sur ce site, avec le code de chaque pièce pour nous la demander facilement.",
                  "In our showroom on Route Sukuk: living rooms, bedrooms, dining rooms, office furniture, lighting, artwork, mirrors and accessories. The whole catalogue is on this site too, with each piece's code so you can ask us about it easily."
                )}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#2A2620] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#B8956A] transition-colors text-sm"
              >
                {tr("تصفّح الكتالوج", "Voir le catalogue", "Browse the catalogue")}
                <span aria-hidden>{arrow}</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FABRICATION: THE WORKSHOP ────────────────────────────────────── */}
      <div className="h-12 sm:h-32 bg-gradient-to-b from-[#F5F1EA] via-[#6B6358] to-[#1A1814]" aria-hidden />
      <section className="bg-[#1A1814] text-white py-12 sm:py-20">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <Reveal className="lg:order-2">
            {/* One large still beside two stacked: readable on a phone, unlike three thumbnails */}
            <div className="grid grid-cols-3 grid-rows-2 gap-2 sm:gap-3">
              {ATELIER.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={atelierAlts[i]}
                  loading="lazy"
                  decoding="async"
                  className={
                    i === 0
                      ? "col-span-2 row-span-2 w-full aspect-[3/4] object-cover"
                      : "w-full h-full min-h-0 object-cover"
                  }
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-white/50">
              {tr(
                "غرفة ملابس وركن قهوة صنعناهما لأحد زبائننا",
                "Dressing et coin café réalisés pour un client",
                "A walk-in wardrobe and coffee corner we built for a client"
              )}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={`${eyebrow} mb-3`}>
              {tr("تصنيع", "Fabrication", "Manufacturing")}
            </p>
            <h3 className="text-3xl sm:text-4xl text-white mb-5" style={display}>
              {tr("الورشة", "L'atelier", "The workshop")}
            </h3>
            <p className="text-[15px] sm:text-base text-white/70 leading-relaxed mb-7">
              {tr(
                "تكسية الجدران بالخشب، وحدات التلفزيون مع إضاءة LED، جدران خلف السرير، غرف الملابس والأثاث المدمج. يرسم فريقنا مشروعكم بتقنية ثلاثية الأبعاد، وبعد موافقتكم نصنعه في ورشتنا ونركّبه عندكم.",
                "Habillages muraux en bois, meubles TV avec éclairage LED, têtes de lit murales, dressings et meubles intégrés. Notre équipe dessine votre projet en 3D ; une fois validé, nous le fabriquons dans notre atelier et l'installons chez vous.",
                "Wood wall cladding, TV walls with LED lighting, headboard walls, walk-in wardrobes and built-in furniture. Our team draws your project in 3D; once you approve it, we build it in our workshop and install it on site."
              )}
            </p>
            <Link
              href="/design"
              className="inline-flex items-center gap-2 bg-[#B8956A] text-[#1A1814] font-semibold px-7 py-3.5 rounded-full hover:bg-white transition-colors text-sm"
            >
              {tr("التصميم والتصنيع", "Design & fabrication", "Design & manufacturing")}
              <span aria-hidden>{arrow}</span>
            </Link>
          </Reveal>
        </div>
      </section>
      <div className="h-12 sm:h-32 bg-gradient-to-b from-[#1A1814] via-[#6B6358] to-[#F5F1EA]" aria-hidden />

      {/* ── WHO WE FURNISH ───────────────────────────────────────────────── */}
      <section className="bg-[#F5F1EA] py-12 sm:py-20">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-10 sm:mb-14">
            <p className={`${eyebrow} mb-3`}>
              {tr("لمن نعمل", "Pour qui", "Who we work for")}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#2A2620]" style={display}>
              {tr("نؤثث كل أنواع المساحات", "Nous meublons tous les espaces", "We furnish every kind of space")}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
            {spaces.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <figure className="bg-white border border-[#E8E2D5]">
                  <Photo
                    path={s.path}
                    ar="4:3"
                    widths={[500, 800]}
                    sizes="(max-width: 640px) 100vw, 33vw"
                    alt={s.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <figcaption className="p-5 sm:p-6">
                    <h3 className="text-base font-semibold text-[#2A2620] mb-1.5">{s.title}</h3>
                    <p className="text-sm text-[#6B6358] leading-relaxed">{s.text}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <p className="text-center text-sm text-[#6B6358] mt-8">
            {tr(
              "وأيضًا المحلات التجارية والمطاعم وكل المباني المهنية.",
              "Et aussi les boutiques, les restaurants et tout local professionnel.",
              "And shops, restaurants and any professional building."
            )}
          </p>
        </div>
      </section>

      {/* ── HOW ORDERING WORKS ───────────────────────────────────────────── */}
      <section className="bg-[#F5F1EA] pb-16 sm:pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <Reveal className="text-center mb-10 sm:mb-14">
            <p className={`${eyebrow} mb-3`}>
              {tr("كيف تطلب", "Commander", "Ordering")}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#2A2620]" style={display}>
              {tr("ثلاث خطوات بسيطة", "Simple, en trois étapes", "Three simple steps")}
            </h2>
          </Reveal>
          <ol className="grid sm:grid-cols-3 gap-8 sm:gap-10">
            {steps.map((s, i) => (
              <li key={s.title} className="text-start">
                <Reveal delay={i * 0.08}>
                  <div
                    className="text-5xl text-[#B8956A]/70 leading-none mb-4"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 300 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="h-px w-12 bg-[#B8956A] mb-4" />
                  <h3 className="text-base font-semibold text-[#2A2620] mb-2">{s.title}</h3>
                  <p className="text-sm text-[#6B6358] leading-relaxed">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── VISIT ────────────────────────────────────────────────────────── */}
      <section className="bg-[#E8E2D5] py-14 sm:py-20 border-t border-[#B8956A]/20 text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <p className={`${eyebrow} mb-4`}>
            {tr("زورونا", "Venez nous voir", "Visit us")}
          </p>
          <h2 className="text-3xl sm:text-5xl text-[#2A2620] mb-6" style={display}>
            {tr("المعرض في انتظاركم", "Le showroom vous attend", "Come and see the showroom")}
          </h2>
          <p className="text-sm text-[#6B6358] mb-1">{tContact("address_value")}</p>
          <p className="text-sm text-[#6B6358] mb-1">{tContact("hours_value")}</p>
          <p className="text-sm text-[#6B6358] mb-8">
            <span dir="ltr" className="inline-block">+222 33 32 22 32</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#2A2620] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#1A1814] transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[#B8956A] text-[#2A2620] font-semibold px-8 py-3.5 rounded-full hover:bg-[#B8956A] hover:text-white transition-colors text-sm"
            >
              {tr("الاتجاهات على خرائط Google", "Itinéraire sur Google Maps", "Directions on Google Maps")}
            </a>
          </div>
        </div>
      </section>
      <div className="h-12 sm:h-24 bg-gradient-to-b from-[#E8E2D5] via-[#6B6358] to-[#1A1814]" aria-hidden />

      <WhatsAppButton />
    </>
  );
}
