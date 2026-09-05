// The homepage hero: a scroll-driven walk through five rooms.
//
// THE WHOLE POINT IS THAT NOTHING HERE IS INVENTED. The hero used to be a
// generated video of a room the company does not sell, watermarked by the tool
// that made it. Every room below is a scene composed from products that are in
// data/products.json, and every hotspot resolves to one of those codes at build
// time — getTourRooms() throws if a code has gone missing, so a product deleted
// by odoo/delete_product.py breaks the build instead of leaving a dot on the
// homepage that links nowhere.
//
// Coordinates are percentages of the 2752x1536 render, measured off the image.
// If a room render is ever regenerated, the dots MUST be re-measured — they are
// pinned to pixels, not to anything the code can recompute.

import products from "../data/products.json";

/**
 * THE HOUSE.
 *
 * A single architectural cutaway holding all five rooms at once — the shot the
 * hero opens on, and the thing it returns to between rooms. Khaled's brief:
 * "first you can see the architecture of the home… then like a cameraman moving
 * really fast, only showing the bedroom." Five unrelated photographs cross-fading
 * never read as one home; one house you dive into does.
 *
 * `region` is the centre of that room INSIDE the house render, in percent — the
 * point the camera flies to before cutting to the room's own detailed photo.
 * Measured off these exact renders, so regenerating the house means re-measuring.
 */
export const HOUSE = {
  wide: "v1788430308/le01aout/site/tour_house.png",
  tall: "v1788432295/le01aout/site/tour_house_tall.png",
};

export interface TourHotspot {
  code: string;
  /** % from the left edge of the image */
  x: number;
  /** % from the top edge of the image */
  y: number;
}

export interface TourRoomDef {
  id: string;
  /** 16:9 render — desktop and any landscape viewport. Cloudinary path, no transform. */
  image: string;
  /** 9:16 render of the SAME room, composed for portrait. Cloudinary path, no transform. */
  imageTall: string;
  label_ar: string;
  label_fr: string;
  label_en: string;
  line_ar: string;
  line_fr: string;
  line_en: string;
  href: string;
  /** Where this room sits inside the HOUSE render, per orientation. */
  region: { x: number; y: number };
  regionTall: { x: number; y: number };
  /** Measured on the 16:9 render. */
  hotspots: TourHotspot[];
  /** Measured on the 9:16 render — a different composition, different numbers. */
  hotspotsTall: TourHotspot[];
}

const CLD_BASE = "https://res.cloudinary.com/ddjmrcbdw/image/upload";

/**
 * A room render at one delivery width.
 *
 * THE WIDTH MATTERS MORE THAN IT LOOKS. These are 2752px renders and a single
 * fixed `w_2400` costs 850 KB for a portrait room — on a phone that only ever
 * needs ~228 KB, on Mauritanian mobile data, for the ~99% of visitors who are on
 * a phone. The hero must therefore ship a real srcSet and let the browser pick;
 * never hard-code one width back into these URLs.
 */
export function roomUrl(path: string, w: number): string {
  return `${CLD_BASE}/f_auto,q_auto,w_${w}/${path}`;
}

/** Delivery widths offered for each framing. */
export const WIDTHS_TALL = [640, 828, 1080, 1400];
export const WIDTHS_WIDE = [1280, 1600, 2048, 2560];

export function srcSet(path: string, widths: number[]): string {
  return widths.map((w) => `${roomUrl(path, w)} ${w}w`).join(", ");
}

export const TOUR_ROOMS: TourRoomDef[] = [
  {
    id: "salon",
    region: { x: 23, y: 74 },
    regionTall: { x: 27, y: 63 },
    image: "v1788347612/le01aout/site/tour_salon.png",
    imageTall: "v1788361074/le01aout/site/tour_salon_tall.png",
    label_ar: "الصالون",
    label_fr: "Le salon",
    label_en: "The living room",
    line_ar: "طقم صالون مخمل بنّي بتفاصيل ذهبية، عربة تقديم، مرآة شمسية ومزهريات.",
    line_fr: "Salon velours brun et laiton, chariot de bar, miroir soleil et vases.",
    line_en: "Brown velvet and gold salon set, bar cart, sunburst mirror and vases.",
    href: "/products?category=salon",
    hotspots: [
      { code: "PR_22", x: 49.5, y: 57 },
      { code: "PR_135", x: 50, y: 33 },
      { code: "PR_285", x: 65.5, y: 43 },
      { code: "PR_317", x: 32, y: 62 },
      { code: "PR_257", x: 93, y: 56 },
    ],
    hotspotsTall: [
      { code: "PR_22", x: 30, y: 52 },
      { code: "PR_135", x: 49, y: 25 },
      { code: "PR_285", x: 70, y: 41 },
      { code: "PR_317", x: 18, y: 75 },
      { code: "PR_257", x: 87, y: 54 },
    ],
  },
  {
    id: "salle_a_manger",
    region: { x: 76, y: 74 },
    regionTall: { x: 78, y: 63 },
    image: "v1788347628/le01aout/site/tour_salle_a_manger.png",
    imageTall: "v1788361077/le01aout/site/tour_salle_a_manger_tall.png",
    label_ar: "غرفة الطعام",
    label_fr: "La salle à manger",
    label_en: "The dining room",
    line_ar: "طاولة رخام أسود بستة كراسي، عربة بار ذهبية، مزهريات ذهبية وشجرة زينة.",
    line_fr: "Table marbre noir six couverts, chariot de bar doré, vases et ficus.",
    line_en: "Black marble table for six, gold bar cart, vases and a ficus tree.",
    href: "/products?category=salle_a_manger",
    hotspots: [
      { code: "PR_31", x: 48, y: 63 },
      { code: "PR_336", x: 49.5, y: 51 },
      { code: "PR_374", x: 15, y: 65 },
      { code: "PR_291", x: 75, y: 43 },
    ],
    hotspotsTall: [
      { code: "PR_31", x: 50, y: 62 },
      { code: "PR_336", x: 53, y: 53 },
      { code: "PR_374", x: 23, y: 54 },
      { code: "PR_291", x: 77, y: 41 },
    ],
  },
  {
    id: "chambre",
    region: { x: 24, y: 32 },
    regionTall: { x: 31, y: 37 },
    image: "v1788347636/le01aout/site/tour_chambre.png",
    imageTall: "v1788361079/le01aout/site/tour_chambre_tall.png",
    label_ar: "غرفة النوم",
    label_fr: "La chambre",
    label_en: "The bedroom",
    line_ar: "غرفة نوم كاملة بخشب الجوز والذهبي، غطاء سرير مبطّن، مرآة ذهبية وأباجورة.",
    line_fr: "Chambre complète noyer et or, couvre-lit matelassé, miroir et lampadaire.",
    line_en: "Full walnut and gold bedroom, quilted bedspread, mirror and floor lamp.",
    href: "/products?category=chambre",
    hotspots: [
      { code: "PR_751", x: 22.5, y: 45 },
      { code: "PR_619", x: 57.5, y: 72 },
      { code: "PR_128", x: 75, y: 22 },
      { code: "PR_353", x: 47.5, y: 42 },
    ],
    hotspotsTall: [
      { code: "PR_751", x: 18, y: 40 },
      { code: "PR_619", x: 52, y: 74 },
      { code: "PR_128", x: 84, y: 24 },
      { code: "PR_353", x: 45, y: 41 },
    ],
  },
  {
    id: "chambre_enfant",
    region: { x: 76, y: 31 },
    regionTall: { x: 77, y: 37 },
    image: "v1788347645/le01aout/site/tour_chambre_enfant.png",
    imageTall: "v1788361082/le01aout/site/tour_chambre_enfant_tall.png",
    label_ar: "غرفة الأطفال",
    label_fr: "La chambre d'enfant",
    label_en: "The children's room",
    line_ar: "سرير طابقين كلاسيكي بلون كريمي وخشبي، سجادة وثيرة ونبتة زينة.",
    line_fr: "Lit superposé crème et bois, tapis moelleux et plante décorative.",
    line_en: "Cream and wood bunk bed, soft shaggy rug and a decorative plant.",
    href: "/products?category=chambre_enfant",
    hotspots: [
      { code: "PR_20", x: 50, y: 36 },
      { code: "PR_874", x: 31, y: 88 },
      { code: "PR_292", x: 21, y: 54 },
    ],
    hotspotsTall: [
      { code: "PR_20", x: 44, y: 47 },
      { code: "PR_874", x: 56, y: 84 },
      { code: "PR_292", x: 88, y: 61 },
    ],
  },
  {
    id: "entree",
    region: { x: 50, y: 72 },
    regionTall: { x: 53, y: 62 },
    image: "v1788347653/le01aout/site/tour_entree.png",
    imageTall: "v1788361084/le01aout/site/tour_entree_tall.png",
    label_ar: "المدخل",
    label_fr: "L'entrée",
    label_en: "The entrance",
    line_ar: "كونصول ومرآة مقوّسة، عربة ذهبية بعجلات، مزهريات ذهبية ونبتة أغاف.",
    line_fr: "Console et miroir arche, chariot doré à roues, vases dorés et agave.",
    line_en: "Console and arched mirror, gold wheeled cart, gold vases and an agave.",
    href: "/products?category=consoles",
    hotspots: [
      { code: "PR_52", x: 49.5, y: 63 },
      { code: "PR_82", x: 18, y: 66 },
      { code: "PR_336", x: 43, y: 55 },
      { code: "PR_290", x: 78, y: 56 },
    ],
    hotspotsTall: [
      { code: "PR_52", x: 40, y: 62 },
      { code: "PR_82", x: 79, y: 65 },
      { code: "PR_336", x: 29, y: 55 },
      { code: "PR_290", x: 16, y: 68 },
    ],
  },
];

export interface TourProduct {
  code: string;
  slug: string;
  thumb: string;
  name_ar: string;
  name_fr: string;
  name_en: string;
  x: number;
  y: number;
}

export interface TourRoom extends Omit<TourRoomDef, "hotspots" | "hotspotsTall"> {
  hotspots: TourProduct[];
  hotspotsTall: TourProduct[];
}

/**
 * Resolves every hotspot code against products.json at build time.
 *
 * Throws rather than skipping: a silently-dropped dot is how the homepage would
 * end up quietly showing four products where it promises five, and a wrong code
 * is exactly the bug that shipped a slug-derived reference into WhatsApp once
 * before. Loud failure at build time is the cheap version of that lesson.
 */
export function getTourRooms(): TourRoom[] {
  const byCode = new Map(products.map((p) => [p.code, p]));

  const resolve = (roomId: string, list: TourHotspot[]): TourProduct[] =>
    list.map((h) => {
      const p = byCode.get(h.code);
      if (!p) {
        throw new Error(
          `House tour: room "${roomId}" points at ${h.code}, which is not in products.json. ` +
            `Either the product was deleted (odoo/delete_product.py) or the code is wrong. ` +
            `Fix website/lib/houseTour.ts — do not leave a dead hotspot on the homepage.`,
        );
      }
      return {
        code: p.code,
        slug: p.id,
        thumb: p.images[0],
        name_ar: p.name_ar,
        name_fr: p.name_fr,
        name_en: p.name_en,
        x: h.x,
        y: h.y,
      };
    });

  return TOUR_ROOMS.map((room) => {
    // The two framings must offer the same products — a phone visitor seeing a
    // different set from a desktop visitor is a content bug, and it would be
    // silent.
    const a = room.hotspots.map((h) => h.code).join(",");
    const b = room.hotspotsTall.map((h) => h.code).join(",");
    if (a !== b) {
      throw new Error(
        `House tour: room "${room.id}" lists different products for its landscape ` +
          `(${a}) and portrait (${b}) framings. They must match.`,
      );
    }
    return {
      ...room,
      hotspots: resolve(room.id, room.hotspots),
      hotspotsTall: resolve(room.id, room.hotspotsTall),
    };
  });
}
