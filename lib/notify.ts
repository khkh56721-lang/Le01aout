// Server-only helpers shared by the API routes: worker secrets, Odoo JSON-RPC, and the
// Twilio WhatsApp template sender (to Khaled + his mother, and the shop's reception phone for
// purchase to-dos — never clients).
import { getCloudflareContext } from "@opennextjs/cloudflare";

export type Env = Record<string, string | undefined>;

export function env(): Env {
  try {
    return getCloudflareContext().env as unknown as Env;
  } catch {
    return process.env as Env;
  }
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export async function odoo(e: Env, model: string, method: string, args: unknown[], kwargs: object = {}) {
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

// Wraps a phone, amount or code for an Arabic (RTL) message: LRI + LRM … PDI keeps it
// left-to-right, so "+222 46 12 34 56" is not shown as "56 34 12 46 +222".
// The LRM covers WhatsApp clients that ignore isolates. Never wrap URLs or Arabic dates.
export function ltr(s: string) {
  return `⁦‎${s}⁩`;
}

// Sends one approved Twilio Content template to every number in `recipients` (default WA_NOTIFY_TO).
// Returns how many Twilio accepted. Template variables may not be empty.
export async function sendTemplate(
  e: Env,
  contentSid: string | undefined,
  vars: Record<number, string>,
  recipients = e.WA_NOTIFY_TO,
): Promise<number> {
  const to = (recipients ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  if (!e.TWILIO_ACCOUNT_SID || !e.TWILIO_AUTH_TOKEN || !e.TWILIO_WA_FROM || !contentSid || !to.length) return 0;
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
            ContentSid: contentSid,
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
