import type { MetadataRoute } from "next";
import products from "../data/products.json";
import { routing } from "@/i18n/routing";

const BASE = "https://le01aout.com";
const locales = routing.locales; // ["ar", "fr", "en"]

// Static routes (relative to the locale prefix). "" = home.
const staticPaths = ["", "about", "contact", "design", "products"] as const;

function localizedUrl(locale: string, path: string) {
  return path ? `${BASE}/${locale}/${path}` : `${BASE}/${locale}`;
}

// hreflang alternates so Google links the ar/fr/en versions of each page
function alternates(path: string) {
  return {
    languages: Object.fromEntries(
      locales.map((l) => [l, localizedUrl(l, path)]),
    ),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    for (const locale of locales) {
      entries.push({
        url: localizedUrl(locale, path),
        lastModified: now,
        changeFrequency: path === "" || path === "products" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path === "products" ? 0.9 : 0.7,
        alternates: alternates(path),
      });
    }
  }

  for (const product of products) {
    const path = `products/${product.id}`;
    for (const locale of locales) {
      entries.push({
        url: localizedUrl(locale, path),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: alternates(path),
      });
    }
  }

  return entries;
}
