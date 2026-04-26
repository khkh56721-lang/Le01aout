"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

interface Category {
  id: string;
  name_ar: string;
  name_fr: string;
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

  const select = (id: string) => {
    router.push(id === "all" ? pathname : `${pathname}?category=${id}`);
  };

  const current = active || "all";

  const allCategories = [{ id: "all", name_ar: "الكل", name_fr: "Tout" }, ...categories];

  return (
    <div className="flex flex-wrap gap-3">
      {allCategories.map((cat) => {
        const label = locale === "ar" ? cat.name_ar : cat.name_fr;
        const isActive = current === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => select(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
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
  );
}
