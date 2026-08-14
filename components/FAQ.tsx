"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Reveal from "./Reveal";

interface QA {
  q_ar: string; q_fr: string; q_en: string;
  a_ar: string; a_fr: string; a_en: string;
}

const FAQS: QA[] = [
  {
    q_ar: "كيف أطلب منتجًا؟",
    q_fr: "Comment passer commande ?",
    q_en: "How do I place an order?",
    a_ar: "اختر المنتج الذي يعجبك وتواصل معنا مباشرة عبر واتساب. يرافقك فريقنا من الاختيار حتى التسليم.",
    a_fr: "Choisissez le produit qui vous plaît et contactez-nous directement via WhatsApp. Notre équipe vous accompagne du choix à la livraison.",
    a_en: "Pick the product you like and contact us directly on WhatsApp. Our team guides you from selection to delivery.",
  },
  {
    q_ar: "ما هي طرق الدفع؟",
    q_fr: "Quels sont les modes de paiement ?",
    q_en: "What payment methods do you accept?",
    a_ar: "يتم الاتفاق على الدفع مباشرة مع فريقنا عبر واتساب أو عند زيارة المعرض. لا يوجد دفع إلكتروني على الموقع.",
    a_fr: "Le paiement se convient directement avec notre équipe via WhatsApp ou lors de votre visite au showroom. Aucun paiement en ligne sur le site.",
    a_en: "Payment is arranged directly with our team via WhatsApp or during your showroom visit. There is no online payment on the site.",
  },
  {
    q_ar: "هل توصلون داخل نواكشوط؟",
    q_fr: "Livrez-vous à Nouakchott ?",
    q_en: "Do you deliver within Nouakchott?",
    a_ar: "نعم، نوفّر التوصيل داخل نواكشوط. تواصل معنا لتحديد التفاصيل والتكلفة حسب موقعك.",
    a_fr: "Oui, nous livrons dans Nouakchott. Contactez-nous pour les détails et le coût selon votre adresse.",
    a_en: "Yes, we deliver within Nouakchott. Contact us for details and cost based on your location.",
  },
  {
    q_ar: "هل يمكن تصنيع قطع حسب الطلب؟",
    q_fr: "Proposez-vous du sur-mesure ?",
    q_en: "Can pieces be made to order?",
    a_ar: "نعم، نوفّر التصنيع حسب الطلب لعدد من القطع، مع إمكانية اختيار المقاسات والألوان والخامات.",
    a_fr: "Oui, plusieurs pièces sont disponibles sur-mesure, avec choix des dimensions, couleurs et matériaux.",
    a_en: "Yes, many pieces are available made-to-order, with a choice of dimensions, colours and materials.",
  },
  {
    q_ar: "ما هي خدمة التصميم الهندسي ثلاثي الأبعاد؟",
    q_fr: "Qu'est-ce que le service de design 3D ?",
    q_en: "What is the 3D engineering design service?",
    a_ar: "نصمّم مساحتك بالكامل بنموذج ثلاثي الأبعاد واقعي تشاهده قبل التنفيذ، ثم ننفّذه بإشراف هندسي كامل من الفكرة حتى التسليم.",
    a_fr: "Nous concevons votre espace en rendu 3D réaliste que vous validez avant les travaux, puis nous le réalisons sous supervision d'ingénierie, de l'idée à la livraison.",
    a_en: "We design your full space as a realistic 3D model you approve before any work, then build it under full engineering supervision — from idea to handover.",
  },
  {
    q_ar: "أين يقع معرضكم؟",
    q_fr: "Où se trouve votre showroom ?",
    q_en: "Where is your showroom?",
    a_ar: "معرضنا في طريق صكوك، نواكشوط، موريتانيا. نرحّب بزيارتكم.",
    a_fr: "Notre showroom se situe Route Sukuk, Nouakchott, Mauritanie. Vous êtes les bienvenus.",
    a_en: "Our showroom is on Route Sukuk, Nouakchott, Mauritania. You're welcome to visit.",
  },
];

export default function FAQ() {
  const locale = useLocale();
  const [open, setOpen] = useState<number | null>(0);
  const tr = (ar: string, fr: string, en: string) =>
    locale === "ar" ? ar : locale === "fr" ? fr : en;

  return (
    <section className="bg-[#F5F1EA] py-12 sm:py-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <Reveal className="text-center mb-8 sm:mb-12">
          <p className="text-[10px] tracking-[0.45em] uppercase font-mono text-[#B8956A] mb-3">
            {tr("أسئلة شائعة", "Questions fréquentes", "FAQ")}
          </p>
          <h2
            className="text-3xl sm:text-4xl text-[#2A2620]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 300, fontStyle: "italic" }}
          >
            {tr("كل ما تودّ معرفته", "Tout ce que vous voulez savoir", "Everything you'd like to know")}
          </h2>
        </Reveal>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal
                key={i}
                delay={i * 0.05}
                className={`bg-white rounded-xl overflow-hidden border transition-all duration-300 ${
                  isOpen ? "border-[#B8956A]/40 shadow-[0_6px_30px_rgba(184,149,106,0.12)]" : "border-[#B8956A]/12 shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-start"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-semibold text-[#2A2620]">
                    {tr(item.q_ar, item.q_fr, item.q_en)}
                  </span>
                  <span
                    className={`text-[#B8956A] text-xl shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-[#6B6358] leading-relaxed">
                      {tr(item.a_ar, item.a_fr, item.a_en)}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
