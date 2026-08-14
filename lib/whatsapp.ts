// Every WhatsApp deep link on the site is built here.
//
// WhatsApp IS the order flow — there is no cart and no checkout — so the prefilled
// text has to be enough for the team to identify the product without a follow-up
// question. Three things do that: the localized name, the real PR_ code (the key
// they look up in Odoo), and the product URL, which WhatsApp expands into a preview
// card showing the product photo. The photo comes from the Open Graph tags in
// app/[locale]/products/[slug]/page.tsx — the link and those tags are one feature.

export const WHATSAPP_NUMBER = "22233322232";
export const SITE_URL = "https://le01aout.com";

export function whatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productPageUrl(locale: string, slug: string): string {
  return `${SITE_URL}/${locale}/products/${slug}`;
}

export function productWhatsAppMessage({
  locale,
  name,
  code,
  slug,
  icon = "🏠",
}: {
  locale: string;
  name: string;
  code: string;
  slug: string;
  icon?: string;
}): string {
  const intro =
    locale === "ar"
      ? "مرحبا، أريد الاستفسار عن هذا المنتج 👇"
      : locale === "fr"
        ? "Bonjour, je souhaite des informations sur ce produit 👇"
        : "Hello, I'd like more information about this product 👇";

  const ref = locale === "ar" ? "المرجع" : locale === "fr" ? "Réf" : "Ref";

  // URL last and on its own line — WhatsApp previews the first link it finds and
  // renders the card below the text.
  return `${intro}\n\n${icon} ${name}\n🔖 ${ref}: ${code}\n\n${productPageUrl(locale, slug)}`;
}

export function generalWhatsAppMessage(locale = "ar"): string {
  return locale === "fr"
    ? "Bonjour, je souhaite des informations sur vos produits"
    : locale === "en"
      ? "Hello, I'd like more information about your products"
      : "مرحبا، أريد الاستفسار عن منتجاتكم";
}

// Cloudinary serves the catalog as f_auto (usually WebP) at w_1600. WhatsApp and
// Facebook only render a plain JPEG in a link preview, and drop images that are too
// large, so og:image gets its own transform: a padded 1200² JPEG on white.
const OG_TRANSFORM = "f_jpg,q_auto:good,w_1200,h_1200,c_pad,b_white";

export function ogImageUrl(src: string): string {
  const marker = "/image/upload/";
  const i = src.indexOf(marker);
  if (i === -1) return src;

  const head = src.slice(0, i + marker.length);
  const rest = src.slice(i + marker.length);
  // Anything before the /v<version>/ segment is an existing delivery transform.
  const path = /^v\d+\//.test(rest) ? rest : rest.replace(/^[^/]+\//, "");

  return `${head}${OG_TRANSFORM}/${path}`;
}
