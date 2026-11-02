// Catalog search for the products page. Runs on the server from ?q=, so it works on a
// slow phone with no JavaScript. Matches every language at once: a client types in
// Arabic, French or English, or pastes a PR_ code from a WhatsApp status or an ad.

interface Swatch {
  code?: string;
  name_ar?: string;
  name_fr?: string;
  name_en?: string;
}

interface Searchable extends Swatch {
  category: string;
  variants?: Swatch[];
}

interface Family {
  id: string;
  name_ar: string;
  name_fr: string;
  name_en?: string;
}

// Accents, Arabic vowel marks and the spellings people use interchangeably
// (أ إ آ, ى/ي, ة/ه) must not decide whether a product is found.
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ًͯ-ٕـ]/g, "")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

// « الصالون » finds « صالون », « كنبة » finds « كنب », « miroirs » finds « miroir ».
function stem(word: string): string {
  const bare = word.startsWith("ال") && word.length > 4 ? word.slice(2) : word;
  if (/^[\u0621-\u064a]{3,}ه$/.test(bare)) return bare.slice(0, -1);
  if (/^[a-z]{3,}s$/.test(bare)) return bare.slice(0, -1);
  return bare;
}

function codeNumber(query: string): string | null {
  return query.trim().match(/^(?:pr[\s_-]*)?(\d+)$/i)?.[1] ?? null;
}

export function searchProducts<T extends Searchable>(
  products: T[],
  query: string,
  families: Family[],
): T[] {
  const words = normalize(query).split(" ").filter(Boolean).map(stem);
  if (!words.length) return [];

  const number = codeNumber(query);
  const code = number ? `PR_${number}` : null;
  const familyNames = new Map(
    families.map((f) => [f.id, `${f.name_ar} ${f.name_fr} ${f.name_en ?? ""}`]),
  );

  const hasCode = (p: T) =>
    code !== null && (p.code === code || !!p.variants?.some((v) => v.code === code));

  const hits = products.filter((p) => {
    if (hasCode(p)) return true;
    const swatches = (p.variants ?? []).map((v) => `${v.name_ar} ${v.name_fr} ${v.name_en}`);
    const text = normalize(
      [p.name_ar, p.name_fr, p.name_en, familyNames.get(p.category), ...swatches].join(" "),
    );
    return words.every((w) => text.includes(w));
  });

  // Best match first: the exact code, then the family named, then a word in a product's
  // name. « miroirs » must open on mirrors, not on a bedroom sold with one.
  const inFamily = (p: T) => {
    const name = normalize(familyNames.get(p.category) ?? "");
    return words.every((w) => name.includes(w));
  };
  const rank = (p: T) => (hasCode(p) ? 0 : inFamily(p) ? 1 : 2);
  return hits
    .map((p, i) => ({ p, i, r: rank(p) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map(({ p }) => p);
}
