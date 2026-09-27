"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FICHE_SOURCES } from "@/lib/ficheSources";

const PIN_KEY = "le01-fiche-pin";

const ERRORS: Record<string, [string, string]> = {
  pin: ["Code boutique incorrect.", "رمز المحل غير صحيح."],
  name: ["Écrivez le nom du client.", "اكتبوا اسم الزبون."],
  phone: ["Numéro invalide : 8 chiffres (ex. 33 32 22 32).", "رقم غير صحيح: 8 أرقام (مثال 33 32 22 32)."],
  email: ["E-mail invalide (ou laissez vide).", "البريد غير صحيح (أو اتركوه فارغًا)."],
  source: ["Choisissez comment il nous a connus.", "اختاروا كيف عرفنا."],
  bought: ["A-t-il acheté ? Choisissez Oui ou Non.", "هل اشترى؟ اختاروا نعم أو لا."],
  product: ["Écrivez ce qu'il a acheté.", "اكتبوا ما اشتراه."],
  odoo: ["Pas de connexion à Odoo. Réessayez, ou notez-le sur la fiche papier.", "لا اتصال بأودو. أعيدوا المحاولة أو اكتبوه في الورقة."],
  network: ["Pas d'internet. Notez le client sur la fiche papier.", "لا يوجد إنترنت. اكتبوا الزبون في الورقة."],
};

function Bi({ fr, ar, className = "" }: { fr: string; ar: string; className?: string }) {
  return (
    <span className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 ${className}`}>
      <span>{fr}</span>
      <span dir="rtl" className="font-[family-name:var(--font-cairo)]">{ar}</span>
    </span>
  );
}

export default function FicheClientForm() {
  const [pin, setPin] = useState("");
  const [pinOk, setPinOk] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [source, setSource] = useState<number | null>(null);
  const [bought, setBought] = useState<boolean | null>(null);
  const [product, setProduct] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<null | { existing: boolean; name: string }>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PIN_KEY);
      if (saved) {
        setPin(saved);
        setPinOk(true);
      }
    } catch {}
  }, []);

  function reset() {
    setName("");
    setPhone("");
    setEmail("");
    setNote("");
    setSource(null);
    setBought(null);
    setProduct("");
    setErr(null);
    setDone(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!source) return setErr("source");
    if (bought === null) return setErr("bought");
    if (bought && product.trim().length < 2) return setErr("product");
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/fiche-client", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pin, name, phone, email, note, source, bought, product: bought ? product : "" }),
      });
      const data = (await res.json()) as { ok?: boolean; existing?: boolean; error?: string };
      if (data.ok) {
        try {
          localStorage.setItem(PIN_KEY, pin);
        } catch {}
        setDone({ existing: !!data.existing, name });
      } else {
        if (data.error === "pin") {
          setPinOk(false);
          try {
            localStorage.removeItem(PIN_KEY);
          } catch {}
        }
        setErr(data.error && ERRORS[data.error] ? data.error : "odoo");
      }
    } catch {
      setErr("network");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-xl border border-[#E8E2D5] bg-white px-4 py-3.5 text-lg outline-none focus:border-[#B8956A] focus:ring-2 focus:ring-[#B8956A]/30";
  const label = "mb-2 block text-[15px] font-semibold text-[#2A2620]";

  return (
    <main className="mx-auto flex min-h-[100svh] max-w-2xl flex-col gap-6 px-4 py-6 font-[family-name:var(--font-manrope)] sm:px-6">
      <header className="flex items-center gap-4 border-b-2 border-[#B8956A] pb-4">
        <Image src="/logo.png" alt="Le 1er Août Déco" width={72} height={63} className="invert" priority />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Fiche client{" "}
            <span dir="rtl" className="font-[family-name:var(--font-cairo)] text-[#B8956A]">بطاقة الزبون</span>
          </h1>
          <p className="text-sm text-[#6B6358]">Le 1er Août Déco · Nouakchott</p>
        </div>
      </header>

      {done ? (
        <section className="flex flex-col items-center gap-5 rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#2C7550] text-3xl text-white">✓</div>
          <Bi
            className="w-full text-xl font-semibold"
            fr={done.existing ? `${done.name} : déjà dans Odoo, fiche mise à jour.` : `${done.name} est enregistré(e).`}
            ar={done.existing ? "الزبون موجود في أودو، تم تحديث بطاقته." : "تم تسجيل الزبون."}
          />
          <Bi className="w-full text-[#6B6358]" fr="Merci ! Roughaye vérifiera demain matin." ar="شكرًا! رقية ستراجع صباح الغد." />
          <button
            type="button"
            onClick={reset}
            className="w-full rounded-xl bg-[#2A2620] px-6 py-4 text-lg font-semibold text-white"
          >
            <Bi fr="Nouveau client" ar="زبون جديد" />
          </button>
        </section>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-5">
          {!pinOk && (
            <div className="rounded-2xl border border-[#E8E2D5] bg-white p-4">
              <label htmlFor="pin" className={label}>
                <Bi fr="Code de la boutique" ar="رمز المحل" />
              </label>
              <input id="pin" inputMode="numeric" autoComplete="off" value={pin} onChange={(e) => setPin(e.target.value.trim())} className={field} required />
            </div>
          )}

          <div>
            <label htmlFor="name" className={label}>
              <Bi fr="Nom et prénom *" ar="الاسم الكامل *" />
            </label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" className={field} required minLength={2} />
          </div>

          <div>
            <label htmlFor="phone" className={label}>
              <Bi fr="Téléphone WhatsApp *" ar="رقم الهاتف (واتساب) *" />
            </label>
            <div className="flex items-stretch gap-2" dir="ltr">
              <span className="grid place-items-center rounded-xl border border-[#E8E2D5] bg-[#E8E2D5] px-3 text-lg">+222</span>
              <input id="phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="33 32 22 32" autoComplete="off" className={field} required />
            </div>
            <p className="mt-1.5 text-sm text-[#6B6358]">
              <Bi fr="Sert à envoyer la facture sur WhatsApp." ar="يُستعمل لإرسال الفاتورة على واتساب." />
            </p>
          </div>

          <div>
            <label htmlFor="email" className={label}>
              <Bi fr="E-mail (facultatif)" ar="البريد الإلكتروني (اختياري)" />
            </label>
            <input id="email" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" className={field} />
          </div>

          <fieldset>
            <legend className={`${label} w-full`}>
              <Bi fr="Comment nous avez-vous connus ? *" ar="كيف عرفتمونا؟ *" />
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FICHE_SOURCES.map((s) => {
                const on = source === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSource(s.id)}
                    className={`flex min-h-[64px] flex-col items-start justify-center gap-0.5 rounded-xl border px-3 py-2 text-left transition ${
                      on ? "border-[#2A2620] bg-[#2A2620] text-white" : "border-[#E8E2D5] bg-white hover:border-[#B8956A]"
                    }`}
                  >
                    <span className="text-[15px] font-semibold leading-tight">{s.fr}</span>
                    <span dir="rtl" className={`w-full text-right font-[family-name:var(--font-cairo)] text-[15px] ${on ? "text-white/80" : "text-[#6B6358]"}`}>
                      {s.ar}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className={`${label} w-full`}>
              <Bi fr="A-t-il acheté quelque chose ? *" ar="هل اشترى شيئًا؟ *" />
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {([
                [true, "Oui, il a acheté", "نعم، اشترى"],
                [false, "Non, juste une visite", "لا، زيارة فقط"],
              ] as const).map(([v, fr, ar]) => {
                const on = bought === v;
                return (
                  <button
                    key={String(v)}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setBought(v)}
                    className={`flex min-h-[64px] flex-col items-start justify-center gap-0.5 rounded-xl border px-3 py-2 text-left transition ${
                      on ? "border-[#2A2620] bg-[#2A2620] text-white" : "border-[#E8E2D5] bg-white hover:border-[#B8956A]"
                    }`}
                  >
                    <span className="text-[15px] font-semibold leading-tight">{fr}</span>
                    <span dir="rtl" className={`w-full text-right font-[family-name:var(--font-cairo)] text-[15px] ${on ? "text-white/80" : "text-[#6B6358]"}`}>
                      {ar}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {bought && (
            <div>
              <label htmlFor="product" className={label}>
                <Bi fr="Produit acheté *" ar="المنتج الذي اشتراه *" />
              </label>
              <input id="product" value={product} onChange={(e) => setProduct(e.target.value)} autoComplete="off" className={field} required />
            </div>
          )}

          <div>
            <label htmlFor="note" className={label}>
              <Bi fr="Remarque (facultatif)" ar="ملاحظة (اختياري)" />
            </label>
            <input id="note" value={note} onChange={(e) => setNote(e.target.value)} autoComplete="off" className={field} />
          </div>

          {err && (
            <p role="alert" className="rounded-xl bg-[#F7E4DD] px-4 py-3 text-[#A3412B]">
              <Bi fr={ERRORS[err][0]} ar={ERRORS[err][1]} />
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-[#B8956A] px-6 py-4 text-lg font-semibold text-white disabled:opacity-60"
          >
            <Bi fr={busy ? "Enregistrement…" : "Enregistrer le client"} ar={busy ? "جارٍ الحفظ…" : "حفظ الزبون"} />
          </button>
        </form>
      )}
    </main>
  );
}
