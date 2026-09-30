// Evening client card → Odoo contact.
// The shop tablet posts {pin, name, phone, email?, source, note?}. We find the contact by
// sanitized phone (+222XXXXXXXX) or create it, set « Comment nous a-t-il connus ? » if empty,
// tag it « Fiche du soir — à vérifier » for Roughaye, and log the visit in its chatter.
// Then it sends a WhatsApp notice (Twilio template: visit or purchase) to WA_NOTIFY_TO.
// Secrets (wrangler secret put): FICHE_PIN, ODOO_URL, ODOO_DB, ODOO_UID, ODOO_API_KEY,
// TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WA_FROM, TWILIO_CT_VISITE, TWILIO_CT_ACHAT,
// WA_NOTIFY_TO (comma-separated). Missing Twilio config = no WhatsApp; the form still saves.
// The reception phone (WA_RECEPTION_TO) also gets a to-do: TWILIO_CT_RECEPTION for a purchase,
// TWILIO_CT_RECEPTION_VISITE for a visit (odoo/twilio_template_reception.py). Unset = nothing sent.
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { FICHE_SOURCES, FICHE_SOURCE_IDS } from "@/lib/ficheSources";
import { ltr, sendTemplate } from "@/lib/notify";

const TAG = "Fiche du soir — à vérifier";

type Env = Record<string, string | undefined>;

function env(): Env {
  try {
    return getCloudflareContext().env as unknown as Env;
  } catch {
    return process.env as Env;
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

// Every refused card leaves a line in Workers Logs (never the client's name or phone).
function fail(error: string, status: number) {
  console.warn(`fiche-client refused: ${error} (${status})`);
  return json({ error }, status);
}

// 8 local digits → "+222 XX XX XX XX"; accepts 222/00222/+222 prefixes.
function normalizePhone(raw: string): { display: string; e164: string } | null {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00222")) d = d.slice(5);
  else if (d.length === 11 && d.startsWith("222")) d = d.slice(3);
  if (!/^[2-4]\d{7}$/.test(d)) return null;
  return { display: `+222 ${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 6)} ${d.slice(6)}`, e164: `+222${d}` };
}

async function odoo(e: Env, model: string, method: string, args: unknown[], kwargs: object = {}) {
  const res = await fetch(`${e.ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [e.ODOO_DB, Number(e.ODOO_UID), e.ODOO_API_KEY, model, method, args, kwargs],
      },
    }),
  });
  const data = (await res.json()) as { result?: unknown; error?: { data?: { message?: string } } };
  if (data.error) throw new Error(data.error.data?.message || "odoo error");
  return data.result;
}

async function notifyWhatsApp(
  e: Env,
  v: { name: string; phone: string; source: number; bought: boolean; product: string; note: string },
): Promise<number> {
  const to = (e.WA_NOTIFY_TO ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const content = v.bought ? e.TWILIO_CT_ACHAT : e.TWILIO_CT_VISITE;
  if (!e.TWILIO_ACCOUNT_SID || !e.TWILIO_AUTH_TOKEN || !e.TWILIO_WA_FROM || !content || !to.length) return 0;
  const src = FICHE_SOURCES.find((s) => s.id === v.source)?.ar ?? "—";
  // Template variables may not be empty.
  const vars = v.bought
    ? { 1: v.name, 2: ltr(v.phone), 3: v.product, 4: src }
    : { 1: v.name, 2: ltr(v.phone), 3: src, 4: v.note || "—" };
  const auth = "Basic " + btoa(`${e.TWILIO_ACCOUNT_SID}:${e.TWILIO_AUTH_TOKEN}`);
  const sent = await Promise.all(
    to.map(async (num) => {
      try {
        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${e.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: "POST",
          headers: { authorization: auth, "content-type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            From: `whatsapp:${e.TWILIO_WA_FROM}`,
            To: `whatsapp:${num}`,
            ContentSid: content,
            ContentVariables: JSON.stringify(vars),
          }),
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) console.error(`twilio refused: ${res.status} ${((await res.json().catch(() => ({}))) as { code?: number }).code ?? ""}`);
        return res.ok;
      } catch {
        console.error("twilio: no response");
        return false;
      }
    }),
  );
  return sent.filter(Boolean).length;
}

export async function POST(req: Request) {
  const e = env();
  if (!e.FICHE_PIN || !e.ODOO_URL || !e.ODOO_API_KEY) return fail("config", 500);

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return fail("bad_request", 400);
  }
  if (String(b.pin ?? "") !== e.FICHE_PIN) return fail("pin", 401);

  const name = String(b.name ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
  const phone = normalizePhone(String(b.phone ?? ""));
  const email = String(b.email ?? "").trim().slice(0, 120);
  const note = String(b.note ?? "").trim().slice(0, 300);
  const source = Number(b.source);
  const bought = b.bought === true;
  const product = bought ? String(b.product ?? "").trim().replace(/\s+/g, " ").slice(0, 150) : "";
  if (name.length < 2) return fail("name", 400);
  if (!phone) return fail("phone", 400);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("email", 400);
  if (!FICHE_SOURCE_IDS.includes(source)) return fail("source", 400);
  if (typeof b.bought !== "boolean") return fail("bought", 400);
  if (bought && product.length < 2) return fail("product", 400);

  try {
    const tags = (await odoo(e, "res.partner.category", "search", [[["name", "=", TAG]]], { limit: 1 })) as number[];
    const tagId = tags[0] ?? ((await odoo(e, "res.partner.category", "create", [{ name: TAG }])) as number);

    const found = (await odoo(e, "res.partner", "search_read", [[["phone_sanitized", "=", phone.e164]]], {
      fields: ["id", "name", "email", "x_source_id"],
      limit: 1,
    })) as { id: number; name: string; email: string | false; x_source_id: [number, string] | false }[];

    let id: number;
    let existing = false;
    if (found.length) {
      existing = true;
      id = found[0].id;
      const vals: Record<string, unknown> = { category_id: [[4, tagId]] };
      if (!found[0].x_source_id) vals.x_source_id = source;
      if (email && !found[0].email) vals.email = email;
      await odoo(e, "res.partner", "write", [[id], vals]);
    } else {
      id = (await odoo(e, "res.partner", "create", [
        { name, phone: phone.display, email: email || false, x_source_id: source, category_id: [[6, 0, [tagId]]] },
      ])) as number;
    }

    const when = new Date().toISOString().slice(0, 16).replace("T", " ");
    const lines = [
      `Fiche du soir (${when} UTC) — à vérifier par Roughaye.`,
      existing && found[0].name !== name ? `Nom donné ce soir : ${name}` : "",
      bought ? `A acheté : ${product}` : "Visite, aucun achat.",
      note ? `Remarque : ${note}` : "",
    ].filter(Boolean);
    try {
      await odoo(e, "res.partner", "message_post", [[id]], { body: lines.join(" · "), message_type: "comment", subtype_xmlid: "mail.mt_note" });
    } catch (err) {
      // the contact is saved; a missing chatter line is not worth failing the form
      console.error(`fiche-client chatter note failed on partner #${id}:`, err instanceof Error ? err.message : err);
    }
    const wa = await notifyWhatsApp(e, { name, phone: phone.display, source, bought, product, note });
    // Reception phone (Roughaye): every card becomes a to-do. Purchase = quote in Odoo, then the invoice
    // to the client from the shop's WhatsApp; visit = thank-you + follow-up from the shop's WhatsApp.
    // French templates, number left unwrapped so it stays tappable.
    const waReception = bought
      ? await sendTemplate(e, e.TWILIO_CT_RECEPTION, { 1: name, 2: phone.display, 3: product }, e.WA_RECEPTION_TO)
      : await sendTemplate(
          e,
          e.TWILIO_CT_RECEPTION_VISITE,
          { 1: name, 2: phone.display, 3: note || "—", 4: existing ? "déjà dans Odoo" : "nouveau contact" },
          e.WA_RECEPTION_TO,
        );
    console.log(
      `fiche-client saved: partner #${id} ${existing ? "existing" : "new"} · ${bought ? "purchase" : "visit"} · WhatsApp accepted: notify ${wa}, reception ${waReception}`,
    );
    return json({ ok: true, existing, wa: wa + waReception });
  } catch (err) {
    console.error("fiche-client odoo error:", err instanceof Error ? err.message : err);
    return fail("odoo", 502);
  }
}
