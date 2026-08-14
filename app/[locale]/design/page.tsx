import { getLocale } from "next-intl/server";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import Reveal from "@/components/Reveal";

const SHOWROOM = "https://res.cloudinary.com/ddjmrcbdw/image/upload";
const HERO_IMG = `${SHOWROOM}/f_auto,q_auto,w_1920/v1782590438/le01aout/site/design_hero_ba.png`;
const PORTFOLIO = [
  `${SHOWROOM}/f_auto,q_auto,w_1200/v1783863903/le01aout/site/mfr_tvwall.png`,
  `${SHOWROOM}/f_auto,q_auto,w_1200/v1783863932/le01aout/site/mfr_bedroom.png`,
  `${SHOWROOM}/f_auto,q_auto,w_1200/v1783863981/le01aout/site/design_3d_render.png`,
  `${SHOWROOM}/f_auto,q_auto,w_1200/v1783864016/le01aout/site/design_result.png`,
  `${SHOWROOM}/f_auto,q_auto,w_1200/v1783864002/le01aout/site/design_engineer.png`,
  `${SHOWROOM}/f_auto,q_auto,w_1200/v1783863953/le01aout/site/mfr_workshop.png`,
];

export default async function DesignPage() {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const tr = (ar: string, fr: string, en: string) =>
    locale === "ar" ? ar : locale === "fr" ? fr : en;

  const waUrl = `https://wa.me/22233322232?text=${encodeURIComponent(
    tr(
      "مرحبا، أريد الاستفسار عن خدمة التصميم والتصنيع حسب الطلب",
      "Bonjour, je souhaite en savoir plus sur le service de design 3D et fabrication sur mesure",
      "Hello, I'd like to know more about your design and custom manufacturing service"
    )
  )}`;

  const benefits = [
    {
      icon: "◍",
      title: tr("شاهد مشروعك قبل التنفيذ", "Visualisez avant de construire", "See it before you build"),
      text: tr(
        "تُشاهد مشروعك كاملًا بتصميم ثلاثي الأبعاد قبل البدء على أرض الواقع.",
        "Visualisez l'intégralité de votre projet en 3D avant le moindre travaux.",
        "View your entire project in 3D before any work begins on site."
      ),
    },
    {
      icon: "✓",
      title: tr("خبرة تقلّل الأخطاء", "Une expertise sans erreurs", "Expertise that prevents errors"),
      text: tr(
        "خبرة هندسية تُقلّل نسبة الأخطاء وتجنّبك التكسير والتعديل بعد التركيب.",
        "Une expertise d'ingénierie qui réduit les erreurs et évite les démolitions après installation.",
        "Engineering expertise that cuts errors and avoids demolition or rework after installation."
      ),
    },
    {
      icon: "⬗",
      title: tr("نصنّع في ورشتنا", "Fabriqué dans notre atelier", "Made in our own workshop"),
      text: tr(
        "جدران خشبية، وحدات تلفزيون، أثاث حسب الطلب — نصنّعها بأيدينا في ورشتنا الخاصة، لا نبيع الجاهز فقط.",
        "Murs en bois, meubles TV, mobilier sur mesure — fabriqués de nos mains dans notre propre atelier.",
        "Wood-panel walls, TV walls, custom furniture — built by our own hands in our own workshop."
      ),
    },
    {
      icon: "❖",
      title: tr("تنفيذ مطابق ومضمون", "Conforme & garanti", "Matched & guaranteed"),
      text: tr(
        "نضمن لك تنفيذًا مطابقًا تمامًا للتصميم المتفق عليه.",
        "Nous garantissons une exécution parfaitement conforme au design validé.",
        "We guarantee execution that perfectly matches the approved design."
      ),
    },
  ];

  const steps = [
    {
      n: "01",
      title: tr("فكرتك", "Votre idée", "Your idea"),
      text: tr("نستمع لرؤيتك ومتطلبات مساحتك.", "Nous écoutons votre vision et vos besoins.", "We listen to your vision and your space."),
    },
    {
      n: "02",
      title: tr("تصميم ثلاثي الأبعاد", "Design 3D", "3D design"),
      text: tr("نحوّل فكرتك إلى نموذج ثلاثي الأبعاد واقعي.", "Nous transformons votre idée en rendu 3D réaliste.", "We turn your idea into a realistic 3D model."),
    },
    {
      n: "03",
      title: tr("المراجعة والاعتماد", "Validation", "Review & approval"),
      text: tr("تراجع كل تفصيل وتعتمد التصميم النهائي.", "Vous validez chaque détail du design final.", "You review every detail and approve the final design."),
    },
    {
      n: "04",
      title: tr("التصنيع في ورشتنا", "Fabrication en atelier", "Workshop fabrication"),
      text: tr("يصنع نجّارونا كل قطعة وجدار خشبي في ورشتنا الخاصة بدقة.", "Nos menuisiers fabriquent chaque pièce et panneau dans notre propre atelier.", "Our carpenters craft every piece and panel in our own workshop."),
    },
    {
      n: "05",
      title: tr("التركيب والتسليم", "Pose & livraison", "Installation & handover"),
      text: tr("نركّب كل شيء في بيتك ونسلّمك مساحتك كما رأيتها تمامًا.", "Nous installons tout chez vous et livrons votre espace tel que validé.", "We install everything and hand over your space exactly as approved."),
    },
  ];

  const audience = [
    tr("منازل وشقق", "Maisons & appartements", "Homes & apartments"),
    tr("شركات ومؤسسات", "Entreprises & institutions", "Companies & institutions"),
    tr("فنادق", "Hôtels", "Hotels"),
    tr("مساحات تجارية", "Espaces commerciaux", "Commercial spaces"),
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[78vh] flex items-end overflow-hidden">
        <Image
          src={HERO_IMG}
          alt={tr("التصميم الهندسي ثلاثي الأبعاد", "Design 3D", "3D engineering design")}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1814] via-[#1A1814]/55 to-[#1A1814]/15" />
        <div className="relative z-10 container mx-auto px-6 pb-20">
          <div className={`max-w-2xl ${isAr ? "ms-auto text-right" : ""}`}>
            <p className="text-[11px] tracking-[0.4em] uppercase font-mono text-[#B8956A] mb-5">
              {tr("المهندس إبراهيم والكادر الهندسي", "Ingénieur Ibrahim & l'équipe technique", "Engineer Ibrahim & the technical team")}
            </p>
            <h1 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl md:text-7xl italic font-light text-white leading-[1.05] mb-6">
              {tr("نصمّمها، نصنّعها، ونركّبها في بيتك", "Conçu en 3D, fabriqué en atelier, installé chez vous", "Designed in 3D, made in our workshop, installed in your home")}
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-9 max-w-xl">
              {tr(
                "جدران خشبية، وحدات تلفزيون، أثاث حسب الطلب — تشاهد مشروعك ثلاثي الأبعاد قبل التنفيذ، ثم يصنّعه فريقنا في ورشتنا ويركّبه بإشرافٍ هندسيٍّ كامل.",
                "Murs en bois, meubles TV, mobilier sur mesure — visualisez votre projet en 3D avant les travaux, puis notre atelier le fabrique et l'installe, sous supervision d'ingénierie.",
                "Wood-panel walls, TV walls, custom furniture — see your project in 3D before any work, then our workshop manufactures and installs it under full engineering supervision."
              )}
            </p>
            <div className={`flex flex-col sm:flex-row gap-3 ${isAr ? "sm:justify-end" : ""}`}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#B8956A] text-[#1A1814] font-bold py-4 px-8 hover:bg-white transition-all duration-300"
              >
                {tr("احجز استشارتك", "Réserver une consultation", "Book a consultation")}
              </a>
              <a
                href="tel:+22233322232"
                className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-medium py-4 px-8 hover:bg-white hover:text-[#1A1814] transition-all duration-300"
                dir="ltr"
              >
                +222 33 32 22 32
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#F5F1EA] py-24 border-t border-[#B8956A]/10">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-[10px] tracking-[0.45em] uppercase font-mono text-[#B8956A] mb-3">
              {tr("لماذا التصميم الهندسي", "Pourquoi le design d'ingénierie", "Why engineering design")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#2A2620]">
              {tr("نرسم مشروعك قبل أن نبنيه", "Nous dessinons avant de bâtir", "We design before we build")}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="h-full bg-white p-8 border border-[#B8956A]/15 hover:border-[#B8956A]/50 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 flex items-center justify-center text-2xl text-[#B8956A] border border-[#B8956A]/30 rounded-full mb-5">
                    {b.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#2A2620] mb-3 leading-snug">{b.title}</h3>
                  <p className="text-sm text-[#6B6358] leading-relaxed">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#1A1814] text-white py-24">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-16">
            <p className="text-[10px] tracking-[0.45em] uppercase font-mono text-[#B8956A] mb-3">
              {tr("كيف نعمل", "Comment ça marche", "How it works")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              {tr("خمس خطوات من الفكرة إلى التسليم", "Cinq étapes, de l'idée à la livraison", "Five steps, from idea to delivery")}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/10">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.07} className="h-full">
                <div className="h-full bg-[#1A1814] p-7 hover:bg-[#221f18] transition-colors duration-300">
                  <div className="font-[var(--font-cormorant)] text-5xl italic text-[#B8956A] mb-4">{s.n}</div>
                  <h3 className="text-base font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Audience strip */}
      <section className="bg-[#F5F1EA] py-16 border-y border-[#B8956A]/10">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-light italic font-[var(--font-cormorant)] text-[#2A2620]">
              {tr("سواء كان لديك…", "Que vous ayez…", "Whether you have…")}
            </h2>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {audience.map((a) => (
              <span
                key={a}
                className="px-6 py-3 border border-[#B8956A]/30 text-[#2A2620] text-sm font-medium tracking-wide hover:bg-[#B8956A] hover:text-white transition-all duration-300"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="bg-[#F5F1EA] pb-24">
        <div className="container mx-auto px-6">
          <Reveal className="text-center py-16">
            <p className="text-[10px] tracking-[0.45em] uppercase font-mono text-[#B8956A] mb-3">
              {tr("من أعمالنا", "Nos réalisations", "Our work")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#2A2620]">
              {tr("أعمالٌ تتحدث عن نفسها", "Des réalisations qui parlent", "Work that speaks for itself")}
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {PORTFOLIO.map((src, i) => (
              <Reveal key={src} delay={(i % 3) * 0.08}>
                <div className="relative aspect-[4/3] overflow-hidden group">
                  <Image
                    src={src}
                    alt={tr("مشروع", "Réalisation", "Project")}
                    fill
                    quality={90}
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — visit showroom */}
      <section className="bg-[#1A1814] text-white py-24">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl italic font-light mb-5">
            {tr("لنحوّل فكرتك إلى واقع", "Donnons vie à votre idée", "Let's bring your idea to life")}
          </h2>
          <p className="text-white/70 mb-4 leading-relaxed">
            {tr(
              "تفضّل بزيارتنا في معرضنا ودعنا نحوّل فكرتك من الورق والشاشة إلى واقعٍ ملموس بين يديك.",
              "Visitez notre showroom et transformons votre idée, du papier et de l'écran à une réalité tangible.",
              "Visit our showroom and let us turn your idea — from paper and screen — into a tangible reality."
            )}
          </p>
          <p className="text-[#B8956A] text-sm tracking-wider mb-10" dir="ltr">
            {tr("طريق صكوك، نواكشوط", "Route Sukuk, Nouakchott", "Route Sukuk, Nouakchott")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#B8956A] text-[#1A1814] font-bold py-4 px-8 hover:bg-white transition-all duration-300"
            >
              {tr("تواصل عبر واتساب", "Contacter via WhatsApp", "Message us on WhatsApp")}
            </a>
            <a
              href="tel:+22233322232"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-medium py-4 px-8 hover:bg-white hover:text-[#1A1814] transition-all duration-300"
              dir="ltr"
            >
              +222 33 32 22 32
            </a>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}
