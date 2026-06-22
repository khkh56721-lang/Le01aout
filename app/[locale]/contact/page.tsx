import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const PHONE = "+222 33 32 22 32";
  const PHONE_RAW = "22233322232";
  const EMAIL = "contact@le01aout.com";
  const waMessage = "مرحبا، أريد الاستفسار";
  const waUrl = `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(waMessage)}`;
  const mapsUrl = `https://www.google.com/maps/place/Le+01+aout/@18.1256621,-15.9658079,17z`;
  const mapsEmbed = `https://www.google.com/maps?q=18.1256621,-15.9658079&z=17&output=embed`;

  const cards = [
    {
      label: t("whatsapp"),
      value: PHONE,
      href: waUrl,
      cta: t("whatsapp_cta"),
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      highlight: true,
    },
    {
      label: t("phone"),
      value: PHONE,
      href: `tel:${PHONE_RAW}`,
      cta: t("phone"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
    },
    {
      label: t("email"),
      value: EMAIL,
      href: `mailto:${EMAIL}`,
      cta: t("email"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#F5F1EA] border-b border-[#B8956A]/20 py-20">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#B8956A] font-mono mb-4">
            Nouakchott · Mauritania
          </p>
          <div className="w-16 h-0.5 bg-[#B8956A] mx-auto mb-6" />
          <h1
            className="text-4xl md:text-5xl text-[#2A2620] mb-4"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 300, fontStyle: "italic" }}
          >{t("title")}</h1>
          <p className="text-lg text-[#6B6358]">{t("subtitle")}</p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="container mx-auto px-6 -mt-12 mb-20">
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {cards.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border ${
                c.highlight
                  ? "bg-[#2A2620] text-white border-[#2A2620]"
                  : "bg-white text-[#2A2620] border-[#E8E2D5]"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  c.highlight ? "bg-[#B8956A] text-white" : "bg-[#F5F1EA] text-[#B8956A]"
                }`}
              >
                {c.icon}
              </div>
              <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">
                {c.label}
              </p>
              <p dir="ltr" className="text-base font-bold break-all inline-block">{c.value}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Address + hours + map */}
      <section className="container mx-auto px-6 pb-20 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          {/* Info column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-7 border border-[#E8E2D5] shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#B8956A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#6B6358]">
                  {t("address")}
                </h3>
              </div>
              <p className="text-lg font-bold text-[#2A2620] mb-4">
                {t("address_value")}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#B8956A] hover:text-[#2A2620] transition-colors"
              >
                {t("directions")} →
              </a>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-[#E8E2D5] shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#B8956A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#6B6358]">
                  {t("hours")}
                </h3>
              </div>
              <p className="text-lg font-bold text-[#2A2620]">
                {t("hours_value")}
              </p>
            </div>

            <div className="bg-[#1A1814] rounded-2xl p-7 text-white shadow-sm">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#B8956A] mb-3">
                {t("social")}
              </h3>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/le01_aout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-white/10 hover:bg-[#B8956A] hover:text-white py-3 rounded-xl text-sm font-bold transition-all"
                >
                  Instagram
                </a>
                <a
                  href="https://tiktok.com/@le_01_aout_deco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-white/10 hover:bg-[#B8956A] hover:text-white py-3 rounded-xl text-sm font-bold transition-all"
                >
                  TikTok
                </a>
                <a
                  href="https://snapchat.com/add/le01_aoutdeco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-white/10 hover:bg-[#B8956A] hover:text-white py-3 rounded-xl text-sm font-bold transition-all"
                >
                  Snapchat
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-sm min-h-[400px]">
            <iframe
              src={mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "500px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Le Premier Aout Decor — Nouakchott"
            />
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}
