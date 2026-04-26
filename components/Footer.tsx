"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const locale = useLocale();

  const text = {
    ar: {
      desc: "ديكور وأثاث فاخر في نواكشوط، موريتانيا.",
      links: "روابط سريعة",
      contact: "اتصل بنا",
      featured: "تصاميم مميزة",
      home: "الرئيسية",
      products: "المنتجات",
      about: "من نحن",
      contact_us: "اتصل بنا",
      address: "تفرغ زينة، خلف المركزية",
      rights: "جميع الحقوق محفوظة."
    },
    fr: {
      desc: "Mobilier et décoration de luxe à Nouakchott, Mauritanie.",
      links: "Liens Rapides",
      contact: "Contactez-nous",
      featured: "Sélection Décor",
      home: "Accueil",
      products: "Produits",
      about: "À propos",
      contact_us: "Contact",
      address: "Tevragh Zeina, Derrière la centrale",
      rights: "Tous droits réservés."
    },
    en: {
      desc: "Luxury furniture and decor in Nouakchott, Mauritania.",
      links: "Quick Links",
      contact: "Contact Us",
      featured: "Featured Decor",
      home: "Home",
      products: "Products",
      about: "About",
      contact_us: "Contact",
      address: "Tevragh Zeina, Behind Central",
      rights: "All rights reserved."
    }
  };

  const t = text[locale as keyof typeof text] || text.en;
  const featuredDecor = [
    "/images/products/cutouts/page13_04_web_cutout.png",
    "/images/products/cutouts/page13_07_web_cutout.png",
    "/images/products/cutouts/page14_01_web_cutout.png",
    "/images/products/cutouts/page17_01_web_cutout.png",
    "/images/products/cutouts/page17_02_web_cutout.png"
  ];

  return (
    <footer className="bg-[#0D0D1A] text-gray-400 py-12 border-t border-[#C9A84C]/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Info */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
                01
              </div>
              <div>
                <p className="text-[#C9A84C] font-bold text-sm tracking-widest leading-none">LE PREMIER AOUT</p>
                <p className="text-gray-500 text-[10px] tracking-wider">DECOR · NOUAKCHOTT</p>
              </div>
            </Link>
            <p className="text-sm max-w-sm">
              {t.desc}
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com/le01_aout" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A84C] transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://tiktok.com/@le_01_aout_deco" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A84C] transition-colors" aria-label="TikTok">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2-1.74 2.89 2.89 0 0 1 2.89-2.89 2.88 2.88 0 0 1 1.54.44v-3.6a6.3 6.3 0 0 0-1.54-.19 6.34 6.34 0 0 0 0 12.67 6.3 6.3 0 0 0 6.34-6.34V8.56a8.28 8.28 0 0 0 5.48 2.05V7.16a4.9 4.9 0 0 1-2.29-.47z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">{t.links}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#C9A84C] transition-colors">{t.home}</Link></li>
              <li><Link href="/products" className="hover:text-[#C9A84C] transition-colors">{t.products}</Link></li>
              <li><Link href="/about" className="hover:text-[#C9A84C] transition-colors">{t.about}</Link></li>
              <li><Link href="/contact" className="hover:text-[#C9A84C] transition-colors">{t.contact_us}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">{t.contact}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#C9A84C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{t.address}<br/>Nouakchott, Mauritanie</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#C9A84C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {/* RTL Fix for Phone Number */}
                <span dir="ltr" className="inline-block text-left">+222 33 32 22 32</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#C9A84C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@le01aout.com" className="hover:text-[#C9A84C] transition-colors">
                  contact@le01aout.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12">
          <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">{t.featured}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {featuredDecor.map((src) => (
              <div key={src} className="h-28 rounded-md border border-[#C9A84C]/20 bg-black/20 p-2">
                <Image
                  src={src}
                  alt="Le Premier Aout decor product"
                  width={260}
                  height={180}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#C9A84C]/10 mt-12 pt-6 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Le Premier Aout Decor. {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
