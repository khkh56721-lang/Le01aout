"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useState, useEffect } from "react";

const LOCALES = [
  { code: "ar", label: "ع", name: "العربية" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "en", label: "EN", name: "English" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const otherLocales = LOCALES.filter((l) => l.code !== locale);

  return (
    <nav
      className={`text-white sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "bg-[#0D0D1A]/80 backdrop-blur-xl border-[#C9A84C]/40 shadow-lg shadow-[#C9A84C]/5"
          : "bg-[#1A1A2E]/95 backdrop-blur-md border-[#C9A84C]/20"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-110 transition-all duration-300 ${
              scrolled ? "animate-glow" : ""
            }`}
          >
            01
          </div>
          <div className="block">
            <p className="text-[#C9A84C] font-bold text-sm tracking-widest leading-none transition-colors">
              LE PREMIER AOUT
            </p>
            <p className="text-gray-400 text-[10px] tracking-wider">DECOR · NOUAKCHOTT</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "/",         label: t("home")     },
            { href: "/products", label: t("products") },
            { href: "/about",    label: t("about")    },
            { href: "/contact",  label: t("contact")  },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-300 hover:text-[#C9A84C] transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A84C] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Language switcher + hamburger */}
        <div className="flex items-center gap-3">
          {otherLocales.map((l) => (
            <Link
              key={l.code}
              href={pathname}
              locale={l.code}
              className="text-xs font-bold text-[#C9A84C] border border-[#C9A84C]/50 px-2.5 py-1 rounded hover:bg-[#C9A84C] hover:text-[#1A1A2E] transition-all duration-200"
            >
              {l.label}
            </Link>
          ))}

          <button
            className="md:hidden ms-1 p-1 text-gray-300 hover:text-[#C9A84C] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0D0D1A]/95 backdrop-blur-xl border-t border-[#C9A84C]/20 px-6 py-4 flex flex-col gap-4">
          {[
            { href: "/",         label: t("home")     },
            { href: "/products", label: t("products") },
            { href: "/about",    label: t("about")    },
            { href: "/contact",  label: t("contact")  },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-300 hover:text-[#C9A84C] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
