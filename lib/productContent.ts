import contentData from "../data/product_content.json";

export type Locale = "ar" | "fr" | "en";

export interface ProductReview {
  author_ar: string;
  author_latin: string;
  rating: number;
  date: string;
  text: { fr: string; ar: string; en: string };
}

export interface ProductContent {
  purchase_count: number;
  rating: number;
  description_long: { fr: string; ar: string; en: string };
  gallery_images: string[];
  reviews: ProductReview[];
}

// product_content.json holds a "_meta" key plus one entry per product id.
const content = contentData as Record<string, Partial<ProductContent>>;

/** Returns the marketing content layer for a product id, or null if none seeded yet. */
export function getProductContent(id: string): ProductContent | null {
  const c = content[id];
  if (!c || id === "_meta") return null;
  return {
    purchase_count: c.purchase_count ?? 0,
    rating: c.rating ?? 0,
    description_long: c.description_long ?? { fr: "", ar: "", en: "" },
    gallery_images: c.gallery_images ?? [],
    reviews: c.reviews ?? [],
  };
}

/** Localized author name (Arabic script for ar, Latin otherwise). */
export function reviewAuthor(r: ProductReview, locale: string): string {
  return locale === "ar" ? r.author_ar : r.author_latin;
}
