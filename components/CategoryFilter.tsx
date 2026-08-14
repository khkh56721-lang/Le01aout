"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

interface Category {
  id: string;
  name_ar: string;
  name_fr: string;
  name_en?: string;
}

export default function CategoryFilter({
  categories,
  active,
}: {
  categories: Category[];
  active?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("categories");
  const router = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const select = (id: string) => {
    router.push(id === "all" ? pathname : `${pathname}?category=${id}`);
  };

  const current = active || "all";

  const allCategories = [
    { id: "all", name_ar: "الكل", name_fr: "Tout", name_en: "All" },
    ...categories,
  ];

  // With 20+ categories the selected one is usually off-screen on a phone —
  // pull it into view so you can always see where you are in the row. Move the
  // strip's own scrollLeft rather than calling scrollIntoView: that walks up the
  // ancestors and in RTL it drags the whole page sideways.
  useEffect(() => {
    const box = scrollRef.current;
    const chip = activeRef.current;
    if (!box || !chip) return;
    const boxRect = box.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    box.scrollLeft +=
      chipRect.left - boxRect.left - (boxRect.width - chipRect.width) / 2;
  }, [current]);

  // RTL scrolls the other way, so the arrows have to follow the writing direction.
  const scrollBy = (dir: 1 | -1) => {
    const step = locale === "ar" ? -dir : dir;
    scrollRef.current?.scrollBy({ left: step * 260, behavior: "smooth" });
  };

  return (
    /* The lg gutter keeps chips from scrolling under the arrows: the arrows sit
       in the padding box, the scroll strip only owns the content box. */
    <div className="relative lg:px-12">
      {/* Desktop arrows — on touch screens you just swipe. */}
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Précédent"
        className="hidden lg:flex absolute start-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white border border-[#E8E2D5] text-[#2A2620] shadow-sm hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
      >
        <span className="rtl:rotate-180">‹</span>
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Suivant"
        className="hidden lg:flex absolute end-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white border border-[#E8E2D5] text-[#2A2620] shadow-sm hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
      >
        <span className="rtl:rotate-180">›</span>
      </button>

      {/* One horizontal row instead of 21 chips wrapping down the page. */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {allCategories.map((cat) => {
          const label =
            locale === "ar"
              ? cat.name_ar
              : locale === "en"
                ? cat.name_en || cat.name_fr
                : cat.name_fr;
          const isActive = current === cat.id;
          return (
            <button
              key={cat.id}
              ref={isActive ? activeRef : undefined}
              onClick={() => select(cat.id)}
              className={`shrink-0 snap-start whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                isActive
                  ? "bg-[#C9A84C] text-[#1A1A2E] border-[#C9A84C]"
                  : "bg-white text-[#1A1A2E] border-gray-200 hover:border-[#C9A84C] hover:text-[#C9A84C]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
