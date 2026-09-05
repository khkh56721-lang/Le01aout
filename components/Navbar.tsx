"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

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

  // ON THE HOMEPAGE THE HEADER FLOATS OVER THE HERO.
  // The hero is pulled up underneath it (see HeroHouseTour) so the house photo
  // runs to the very top of the page. A solid cream bar sitting on top of that
  // photo is exactly the "cut" Khaled kept pointing at — two surfaces that look
  // like different pages. Transparent until you scroll, then it becomes the
  // normal solid bar so the links stay readable over the rest of the page.
  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock background scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const otherLocales = LOCALES.filter((l) => l.code !== locale);

  const navItems = [
    { href: "/",         label: t("home")     },
    { href: "/products", label: t("products") },
    { href: "/design",   label: t("design")   },
    { href: "/about",    label: t("about")    },
    { href: "/contact",  label: t("contact")  },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "bg-[#F5F1EA]/95 backdrop-blur-xl border-[#B8956A]/30 shadow-[0_4px_20px_rgba(42,38,32,0.08)]"
          : overHero
            ? "bg-transparent border-transparent"
            : "bg-[#F5F1EA] border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-20 sm:h-24 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center group shrink-0" aria-label="Le 1er Août">
          <Image
            src="/logo.png"
            alt="Le 1er Août — Showroom de Meubles"
            width={2684}
            height={2344}
            priority
            className="h-14 sm:h-16 w-auto invert group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#6B6358] hover:text-[#B8956A] transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#B8956A] group-hover:w-full transition-all duration-300" />
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
              className="text-xs font-bold text-[#B8956A] border border-[#B8956A]/50 px-2.5 py-1 rounded hover:bg-[#B8956A] hover:text-white transition-all duration-200"
            >
              {l.label}
            </Link>
          ))}

          <button
            className="md:hidden ms-1 p-2 -me-2 text-[#6B6358] hover:text-[#B8956A] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
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
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-[rgba(245,241,234,0.98)] backdrop-blur-xl border-t border-[#B8956A]/20"
          >
            <div className="px-6 py-3 flex flex-col">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: locale === "ar" ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.3, ease: "easeOut" }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3.5 text-base font-medium text-[#2A2620] hover:text-[#B8956A] border-b border-[#B8956A]/10 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
