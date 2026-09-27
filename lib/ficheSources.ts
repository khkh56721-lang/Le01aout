// « Comment nous a-t-il connus ? » — the utm.source ids live in Odoo (read 2026-09-25).
// Keep in sync with odoo/client_source_setup.py; the id is what gets written.
export const FICHE_SOURCES = [
  { id: 15, fr: "TikTok", ar: "تيك توك" },
  { id: 13, fr: "Instagram", ar: "إنستغرام" },
  { id: 10, fr: "Facebook", ar: "فيسبوك" },
  { id: 16, fr: "Snapchat", ar: "سناب شات" },
  { id: 17, fr: "WhatsApp", ar: "واتساب" },
  { id: 1, fr: "Google", ar: "غوغل" },
  { id: 18, fr: "Site le01aout.com", ar: "الموقع" },
  { id: 19, fr: "Recommandation d'un ami", ar: "توصية صديق" },
  { id: 25, fr: "Membre de la famille", ar: "أحد أفراد العائلة" },
  { id: 20, fr: "Passé devant la boutique", ar: "المرور أمام المحل" },
  { id: 21, fr: "Déjà client", ar: "زبون سابق" },
  { id: 22, fr: "Publicité payante", ar: "إعلان مدفوع" },
  { id: 23, fr: "Autre", ar: "أخرى" },
] as const;

export const FICHE_SOURCE_IDS: number[] = FICHE_SOURCES.map((s) => s.id);
