// Standalone shop-tablet page (outside [locale]: no navbar, no footer, not in the sitemap).
import type { Metadata, Viewport } from "next";
import { Cairo, Manrope } from "next/font/google";
import "../globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: "Fiche client — Le 1er Août Déco",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function FicheLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${cairo.variable} ${manrope.variable} bg-[#F5F1EA] text-[#2A2620] antialiased`}>
        {children}
      </body>
    </html>
  );
}
