import type { Metadata } from "next";
import { Cairo, Cormorant_Garamond } from "next/font/google";
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

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Le Premier Aout Decor — نواكشوط",
  description:
    "ديكور وأثاث فاخر في نواكشوط، موريتانيا | Mobilier et décoration de luxe à Nouakchott",
};

import Footer from "@/components/Footer";

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
      className={`${cairo.variable} ${cormorant.variable}`}
    >
      <body className="bg-[#FAF9F6] text-[#1A1A2E] font-sans antialiased flex flex-col min-h-screen">
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
