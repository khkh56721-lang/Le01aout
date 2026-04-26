import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");

  const waUrl = `https://wa.me/22233322232?text=${encodeURIComponent(
    "مرحبا، أريد الاستفسار عن مشروع ديكور"
  )}`;

  const values = [
    { icon: "✦", title: t("value1_title"), text: t("value1_text") },
    { icon: "✧", title: t("value2_title"), text: t("value2_text") },
    { icon: "✶", title: t("value3_title"), text: t("value3_text") },
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1A1A2E] via-[#2d2d50] to-[#1A1A2E] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 start-10 w-64 h-64 rounded-full bg-[#C9A84C] blur-3xl" />
          <div className="absolute bottom-10 end-10 w-72 h-72 rounded-full bg-[#C9A84C] blur-3xl" />
        </div>
        <div className="relative container mx-auto px-6 text-center max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold mb-4">
            Le Premier Aout Decor
          </p>
          <div className="w-16 h-0.5 bg-[#C9A84C] mx-auto mb-8" />
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">{t("intro")}</p>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-6 py-20 max-w-3xl">
        <h2 className="text-3xl font-black text-[#1A1A2E] mb-6 leading-tight">
          {t("story_title")}
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          {t("story_text")}
        </p>
      </section>

      {/* Stats strip */}
      <section className="bg-[#FAF9F6] border-y border-gray-100 py-12">
        <div className="container mx-auto px-6 grid grid-cols-3 gap-4 max-w-3xl text-center">
          <div>
            <div className="text-4xl font-black text-[#C9A84C]">5+</div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">
              Years · سنوات · ans
            </div>
          </div>
          <div>
            <div className="text-4xl font-black text-[#C9A84C]">230+</div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">
              Products · منتج · produits
            </div>
          </div>
          <div>
            <div className="text-4xl font-black text-[#C9A84C]">24/7</div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">
              WhatsApp
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-6 py-24 max-w-5xl">
        <h2 className="text-3xl font-black text-[#1A1A2E] text-center mb-14">
          {t("values_title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center text-2xl mb-5">
                {v.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-3">
                {v.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1A1A2E] text-white py-20">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            {t("cta_title")}
          </h2>
          <p className="text-white/70 mb-10 text-lg">{t("cta_text")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] text-[#1A1A2E] font-bold py-4 px-8 rounded-xl hover:bg-white transition-all duration-200 shadow-lg"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-[#1A1A2E] transition-all duration-200"
            >
              {tNav("products")} →
            </Link>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}
