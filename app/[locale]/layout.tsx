import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://le01aout.com"),
  title: "Le Premier Aout Decor — نواكشوط",
  description:
    "ديكور وأثاث فاخر في نواكشوط، موريتانيا | Mobilier et décoration de luxe à Nouakchott",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "@id": "https://le01aout.com/#business",
  name: "Le Premier Aout Decor",
  description:
    "Showroom de meubles et décoration de luxe à Nouakchott. Salons, chambres, salle à manger — pièces uniques sur commande.",
  url: "https://le01aout.com",
  logo: "https://le01aout.com/logo-google.png",
  image: "https://le01aout.com/logo-google.png",
  telephone: "+22233322232",
  email: "contact@le01aout.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "طريق صكوك",
    addressLocality: "Nouakchott",
    addressCountry: "MR",
  },
  sameAs: [
    "https://www.instagram.com/le01_aout",
    "https://www.tiktok.com/@le_01_aout_deco",
    "https://www.facebook.com/profile.php?id=61578655620948",
  ],
};

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
