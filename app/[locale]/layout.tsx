import type { Metadata, Viewport } from "next";
import { SOCIAL_SAME_AS } from "@/lib/social";
import { GEO, MAPS_URL, PLUS_CODE } from "@/lib/location";
import { Cairo, Cormorant_Garamond, Manrope } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import "../globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// AI assistants (ChatGPT via Bing) summarise the business from this text, so it
// must name every kind of space we furnish, not only homes (Khaled, 2026-10-24).
const BUSINESS_DESCRIPTION: Record<string, string> = {
  ar: "معرض أثاث وديكور فاخر في نواكشوط. نؤثث ونزين كل أنواع المساحات: المنازل (صالونات، غرف نوم، غرف طعام، إنارة وديكور)، مكاتب الشركات والإدارات (مكاتب مدراء، طاولات اجتماعات، مكاتب عمل، كاونترات استقبال، كراسي مكتبية)، المحلات التجارية والمطاعم وكل المباني المهنية. وتصميم ثلاثي الأبعاد وتنفيذ ديكورات حسب الطلب في ورشتنا.",
  fr: "Showroom de meubles et de décoration de luxe à Nouakchott. Nous meublons et décorons tous les espaces : maisons (salons, chambres, salles à manger, luminaires, décoration), bureaux d'entreprises et d'administrations (bureaux de direction, tables de réunion, postes de travail, comptoirs d'accueil, fauteuils), boutiques, restaurants et tout local professionnel. Design 3D et agencement sur mesure par notre atelier.",
  en: "Luxury furniture and décor showroom in Nouakchott. We furnish and decorate every kind of space: homes (living rooms, bedrooms, dining rooms, lighting, décor), company and administration offices (executive desks, meeting tables, workstations, reception counters, office chairs), shops, restaurants and any professional building. 3D design and made-to-measure fit-out by our own workshop.",
};

// The showroom photo Khaled picked for listings and link previews (2026-10-24).
const SHOWROOM_IMAGE =
  "https://res.cloudinary.com/ddjmrcbdw/image/upload/f_jpg,q_auto,w_1600/v1781893012/le01aout/showroom/b6_dsc0964.jpg";
const SHOWROOM_OG_IMAGE =
  "https://res.cloudinary.com/ddjmrcbdw/image/upload/c_fill,w_1200,h_630,g_auto,f_jpg,q_auto/v1781893012/le01aout/showroom/b6_dsc0964.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = BUSINESS_DESCRIPTION[locale] ?? BUSINESS_DESCRIPTION.fr;
  return {
    metadataBase: new URL("https://le01aout.com"),
    title: "Le Premier Aout Decor — نواكشوط",
    description,
    openGraph: {
      type: "website",
      siteName: "Le 1er Août Déco",
      locale: locale === "ar" ? "ar_MR" : locale === "fr" ? "fr_FR" : "en_US",
      title: "Le 1er Août Déco — Nouakchott",
      description,
      images: [{ url: SHOWROOM_OG_IMAGE, width: 1200, height: 630, alt: "Le 1er Août Déco showroom" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Le 1er Août Déco — Nouakchott",
      description,
      images: [SHOWROOM_OG_IMAGE],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

const businessJsonLd = (locale: string) => ({
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "@id": "https://le01aout.com/#business",
  name: "Le Premier Aout Decor",
  alternateName: ["Le 1er Août Déco", "Le 01 aout", "Le 1er Août"],
  legalName: "1ER AOUT SARL",
  description: BUSINESS_DESCRIPTION[locale] ?? BUSINESS_DESCRIPTION.fr,
  url: "https://le01aout.com",
  logo: "https://le01aout.com/logo-google.png",
  image: [SHOWROOM_IMAGE, "https://le01aout.com/logo-google.png"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Le 1er Août Déco",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Mobilier de maison : salons, chambres, salles à manger, luminaires, décoration",
        url: `https://le01aout.com/${locale}/products`,
      },
      {
        "@type": "OfferCatalog",
        name: "Mobilier de bureau pour entreprises et administrations : bureaux de direction, tables de réunion, postes de travail, comptoirs d'accueil, fauteuils",
        url: `https://le01aout.com/${locale}/products?category=bureau`,
      },
      {
        "@type": "OfferCatalog",
        name: "Boutiques, restaurants et locaux professionnels : mobilier, décoration, design 3D et agencement sur mesure (atelier)",
        url: `https://le01aout.com/${locale}/design`,
      },
    ],
  },
  telephone: "+22233322232",
  email: "contact@le01aout.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: `Route Sukuk (طريق صكوك), ${PLUS_CODE}`,
    addressLocality: "Nouakchott",
    addressCountry: "MR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: GEO.latitude,
    longitude: GEO.longitude,
  },
  hasMap: MAPS_URL,
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "09:00",
    closes: "23:00",
  },
  areaServed: { "@type": "Country", name: "Mauritania" },
  sameAs: [...SOCIAL_SAME_AS, MAPS_URL],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      className={`${cairo.variable} ${cormorant.variable} ${manrope.variable}`}
    >
      <body className="bg-[#F5F1EA] text-[#2A2620] font-sans antialiased flex flex-col min-h-screen">
        <Analytics />
        {process.env.NEXT_PUBLIC_CF_BEACON_TOKEN ? (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_BEACON_TOKEN}"}`}
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(locale)) }}
        />
        <NextIntlClientProvider messages={messages}>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
