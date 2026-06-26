"use client";

import { useLocale } from "next-intl";
import type { ProductReview } from "@/lib/productContent";
import { reviewAuthor } from "@/lib/productContent";

interface ProductReviewsProps {
  reviews: ProductReview[];
  purchaseCount: number;
  rating: number;
}

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex ${className}`} dir="ltr" aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="w-4 h-4"
          fill={i <= Math.round(value) ? "#B8956A" : "#E8E2D5"}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export default function ProductReviews({ reviews, purchaseCount, rating }: ProductReviewsProps) {
  const locale = useLocale();

  const L = (ar: string, fr: string, en: string) =>
    locale === "ar" ? ar : locale === "fr" ? fr : en;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(
      locale === "ar" ? "ar" : locale === "fr" ? "fr-FR" : "en-US",
      { year: "numeric", month: "long" }
    );

  if (!reviews.length && !purchaseCount) return null;

  return (
    <section className="mt-16 border-t border-[#E8E2D5] pt-12">
      {/* Summary header */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-10">
        {rating > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-4xl font-black text-[#2A2620]">{rating.toFixed(1)}</span>
            <div className="flex flex-col">
              <Stars value={rating} />
              <span className="text-xs text-[#6B6358] mt-1">
                {reviews.length}{" "}
                {L("تقييم", "avis", reviews.length === 1 ? "review" : "reviews")}
              </span>
            </div>
          </div>
        )}

        {purchaseCount > 0 && (
          <div className="flex items-center gap-2.5 bg-[#F5F1EA] border border-[#E8E2D5] rounded-full px-4 py-2">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#B8956A]">
              <path
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-bold text-[#2A2620]">
              <span dir="ltr" className="inline-block">
                {purchaseCount}
              </span>{" "}
              {L(
                "عائلة اختارت هذا المنتج",
                "familles ont choisi ce produit",
                "families chose this product"
              )}
            </span>
          </div>
        )}
      </div>

      {/* Reviews list */}
      {reviews.length > 0 && (
        <>
          <h2
            className="text-2xl text-[#2A2620] mb-8"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontStyle: "italic" }}
          >
            {L("آراء عملائنا", "Avis de nos clients", "What our clients say")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-white border border-[#E8E2D5] rounded-2xl p-6 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#B8956A]/15 text-[#B8956A] flex items-center justify-center font-bold text-sm">
                      {reviewAuthor(r, locale).charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2A2620] leading-tight">
                        {reviewAuthor(r, locale)}
                      </p>
                      <p className="text-xs text-[#6B6358]">{formatDate(r.date)}</p>
                    </div>
                  </div>
                  <Stars value={r.rating} />
                </div>
                <p className="text-[#6B6358] leading-relaxed text-sm">
                  {locale === "ar" ? r.text.ar : locale === "fr" ? r.text.fr : r.text.en}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
