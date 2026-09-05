// Every catalogue photo the site serves carries the logo twice.
//
//   1. A solid black mark in the TOP-RIGHT corner. On a studio shot that corner is
//      empty background, so it brands the picture without covering the furniture.
//   2. A 12% mark DEAD CENTRE. It is barely visible, and it is what survives when
//      someone crops the corner off — which is the whole point of having it.
//
// Both are Cloudinary delivery transforms. Nothing is written to products.json, to
// the source PNGs under PHOTOS/, or to Odoo: strip the transform from the URL and
// the clean original comes back. That is deliberate — the print catalogue, Odoo and
// the social packs all still need unmarked photos.
//
// Because the layers are sized with fl_relative they scale with the image, and the
// mark lands in the same place on a 900x900 studio shot and a 2752x1536 room scene.
// Watch out when changing sizes: a layer bigger than the base image makes Cloudinary
// GROW THE CANVAS to fit it, which silently changes the photo's aspect ratio.

const LOGO = "le01aout:site:watermark_logo";

// Solid brand black. Sits on the empty corner of the frame.
const CORNER =
  `l_${LOGO}/e_colorize:100,co_rgb:1A1814/w_0.22,fl_relative,o_75` +
  `/fl_layer_apply,g_north_east,x_0.035,y_0.035,fl_relative`;

// White line-art with a dark outline. The outline is what keeps it readable both on
// a white background and on dark walnut — a single flat colour vanishes into one or
// the other.
const CENTRE =
  `l_${LOGO}/e_outline:outer:10:0,co_rgb:2A2620/w_0.42,fl_relative,o_12` +
  `/fl_layer_apply,g_center`;

const MARK = `${CENTRE}/${CORNER}`;

// The corner mark alone. Used on thumbnails, where the centre mark at 96px wide is
// just mud on the image and there is nothing worth stealing anyway.
const MARK_SMALL = CORNER;

const MARKER = "/image/upload/";

// Splits a Cloudinary URL into its delivery prefix and the version+path tail,
// dropping whatever delivery transform the stored URL already carried. Same
// approach as ogImageUrl() in ./whatsapp.
function split(src: string): { head: string; path: string } | null {
  const i = src.indexOf(MARKER);
  if (i === -1) return null;

  const head = src.slice(0, i + MARKER.length);
  const rest = src.slice(i + MARKER.length);
  const path = /^v\d+\//.test(rest) ? rest : rest.replace(/^[^/]+\//, "");

  return { head, path };
}

function build(src: string, transform: string, mark: string): string {
  const parts = split(src);
  if (!parts) return src; // not a Cloudinary URL — leave it alone
  return `${parts.head}${transform}/${mark}/${parts.path}`;
}

/** Full-size product photo, uncropped — the product page gallery. */
export function productImage(src: string): string {
  return build(src, "f_auto,q_auto,w_1600", MARK);
}

/**
 * Product grid card. The card renders 4:3 with object-cover, so the crop has to
 * happen HERE, before the logo is placed — otherwise the CSS crop slices the top
 * off a square photo and takes half the logo with it.
 */
export function cardImage(src: string): string {
  return build(src, "f_auto,q_auto,c_fill,ar_4:3,g_auto,w_800", MARK);
}

/** Gallery thumbnail / variant swatch — corner mark only. */
export function thumbImage(src: string): string {
  return build(src, "f_auto,q_auto,w_240", MARK_SMALL);
}

/**
 * Marks a URL whose delivery transform is already hand-tuned — the homepage
 * category tiles and editorial rows crop to ar_3:4 and run e_improve, and those
 * choices have to survive. Keeps the existing transform and inserts the logo
 * after it, so the mark lands inside the final crop rather than being cropped off.
 */
export function markTuned(src: string): string {
  const i = src.indexOf(MARKER);
  if (i === -1) return src;

  const head = src.slice(0, i + MARKER.length);
  const rest = src.slice(i + MARKER.length);

  // No transform at all — the version segment comes first.
  if (/^v\d+\//.test(rest)) return `${head}${MARK}/${rest}`;

  const cut = rest.indexOf("/");
  if (cut === -1) return src;
  return `${head}${rest.slice(0, cut)}/${MARK}/${rest.slice(cut + 1)}`;
}

/** The marked-up transform on its own, for URLs that are already hand-tuned. */
export const WATERMARK = MARK;
