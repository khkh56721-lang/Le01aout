// Odoo « invoice posted » → WhatsApp notice (Twilio template le01_facture_notif) to WA_NOTIFY_TO
// (Khaled + his mother; never the client — clients get invoices manually from the company number).
//
// Called by the Odoo automation built by odoo/twilio_facture_setup.py. Odoo webhooks cannot add
// Basic auth, so the shared secret travels as ?key=WA_HOOK_KEY. The payload is only trusted for
// `_id`: the invoice itself is re-read from Odoo before anything is sent.
// Secrets: WA_HOOK_KEY, TWILIO_CT_FACTURE + the Odoo/Twilio ones already used by /api/fiche-client.
import { env, json, ltr, odoo, sendTemplate } from "@/lib/notify";

type Move = {
  id: number;
  name: string;
  state: string;
  move_type: string;
  invoice_date: string | false;
  amount_total: number;
  partner_id: [number, string] | false;
  access_token: string | false;
};

// 1234567.4 → "1,234,567". Commas, not spaces: a spaced number gets reversed inside Arabic text.
function mru(v: number) {
  return Math.round(v || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export async function POST(req: Request) {
  const e = env();
  if (!e.WA_HOOK_KEY || !e.ODOO_URL || !e.ODOO_API_KEY) return json({ error: "config" }, 500);
  if (new URL(req.url).searchParams.get("key") !== e.WA_HOOK_KEY) return json({ error: "key" }, 401);

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  const id = Number(b._id);
  if (b._model !== "account.move" || !Number.isInteger(id) || id <= 0) return json({ error: "bad_request" }, 400);

  let m: Move | undefined;
  try {
    const rows = (await odoo(e, "account.move", "read", [[id]], {
      fields: ["name", "state", "move_type", "invoice_date", "amount_total", "partner_id", "access_token"],
    })) as Move[];
    m = rows[0];
  } catch {
    return json({ error: "odoo" }, 502);
  }
  if (!m || m.state !== "posted" || m.move_type !== "out_invoice") return json({ ok: true, skipped: "not_posted_invoice" });

  // Paper-book imports and backdated invoices never notify.
  const limit = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
  if (m.invoice_date && m.invoice_date < limit) return json({ ok: true, skipped: "backdated" });
  if (!m.access_token) return json({ error: "no_token" }, 409);

  const pdf = `${e.ODOO_URL}/my/invoices/${m.id}?access_token=${m.access_token}&report_type=pdf&download=true`;
  const client = (m.partner_id ? m.partner_id[1] : "") || "—";
  const wa = await sendTemplate(e, e.TWILIO_CT_FACTURE, { 1: ltr(m.name), 2: client, 3: ltr(mru(m.amount_total)), 4: pdf });

  try {
    await odoo(e, "account.move", "message_post", [[m.id]], {
      body: wa
        ? `📲 WhatsApp : avis de facture envoyé à ${wa} numéro(s) (Khaled / maman).`
        : "📲 WhatsApp : avis de facture NON envoyé (Twilio a refusé ou n'est pas configuré).",
      message_type: "comment",
      subtype_xmlid: "mail.mt_note",
    });
  } catch {
    // the notice went out; a missing chatter line is not worth an error
  }
  return json({ ok: true, wa });
}
