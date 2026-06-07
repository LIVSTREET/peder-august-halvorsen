import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SOURCE_APP = "pah-studios";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type FcEntry = {
  id: string;
  entry_type: "income" | "expense";
  entry_date: string;
  description?: string | null;
  counterparty?: string | null;
  category?: string | null;
  category_group?: string | null;
  amount_gross: number;
  amount_net?: number | null;
  vat_rate?: number | null;
  payment_status?: string | null;
  invoice_status?: string | null;
  voucher_number?: string | null;
  source_app?: string | null;
  source_type?: string | null;
  source_ref?: string | null;
  external_url?: string | null;
  attachment_count?: number | null;
  has_attachment?: boolean | null;
  notes?: string | null;
  created_at?: string | null;
};

async function fcRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const baseUrl = Deno.env.get("FINANCE_CORE_BASE_URL");
  const apiKey = Deno.env.get("FINANCE_CORE_API_KEY");
  const orgId = Deno.env.get("FINANCE_CORE_ORGANIZATION_ID");
  if (!baseUrl || !apiKey || !orgId) {
    throw new Error("finance_core_not_configured");
  }
  const headers = new Headers(init.headers ?? {});
  headers.set("Authorization", `Bearer ${apiKey}`);
  headers.set("X-Organization-Id", orgId);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  return fetch(`${baseUrl}${path}`, { ...init, headers });
}

async function fcJson(path: string, init: RequestInit = {}) {
  const resp = await fcRequest(path, init);
  const text = await resp.text();
  let parsed: unknown = null;
  if (text) {
    try { parsed = JSON.parse(text); } catch { parsed = text; }
  }
  return { ok: resp.ok, status: resp.status, body: parsed as any };
}

function round(n: number) {
  return Math.round(n);
}

function buildInvoiceBasis(input: {
  partnerName: string;
  eventName: string;
  eventSlug: string;
  date: string;
  total: number;
  partnerPercent: number;
  invoiceText?: string | null;
  notes?: string | null;
}, voucher?: string | null) {
  const partnerAmount = round(input.total * input.partnerPercent / 100);
  const ourAmount = input.total - partnerAmount;
  const ourPercent = 100 - input.partnerPercent;
  return {
    partnerName: input.partnerName,
    eventName: input.eventName,
    eventSlug: input.eventSlug,
    date: input.date,
    total: input.total,
    partnerPercent: input.partnerPercent,
    partnerAmount,
    ourPercent,
    ourAmount,
    invoiceText: input.invoiceText ?? null,
    notes: input.notes ?? null,
    voucher: voucher ?? null,
  };
}

function aggregateStatus(entries: FcEntry[], summary: any, year: number) {
  const yearStart = new Date(`${year}-01-01T00:00:00Z`).getTime();
  const yearEnd = new Date(`${year + 1}-01-01T00:00:00Z`).getTime();

  let income = 0;
  let expense = 0;
  let unpaidCount = 0;
  let missingAttachmentCount = 0;

  for (const e of entries) {
    const t = e.entry_date ? new Date(e.entry_date).getTime() : 0;
    const inYear = t >= yearStart && t < yearEnd;
    const amt = Number(e.amount_gross ?? 0);
    if (inYear && e.entry_type === "income") income += amt;
    if (inYear && e.entry_type === "expense") expense += amt;
    if (e.payment_status === "unpaid") unpaidCount += 1;
    const hasAtt = e.has_attachment === true || (e.attachment_count ?? 0) > 0;
    if (e.entry_type === "expense" && !hasAtt) missingAttachmentCount += 1;
  }

  // Prefer summary from server if it provides totals
  const s = summary && typeof summary === "object" ? summary : null;
  const sIncome = Number(s?.total_income ?? s?.income ?? NaN);
  const sExpense = Number(s?.total_expense ?? s?.expense ?? NaN);

  const finalIncome = Number.isFinite(sIncome) ? sIncome : income;
  const finalExpense = Number.isFinite(sExpense) ? sExpense : expense;

  return {
    year,
    income: finalIncome,
    expense: finalExpense,
    result: finalIncome - finalExpense,
    unpaidCount,
    missingAttachmentCount,
    entryCount: entries.length,
  };
}

function base64ToUint8(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) return json({ error: "server_misconfigured" }, 500);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) return json({ error: "unauthorized" }, 401);

    const { data: ownerCheck, error: ownerError } = await supabase.rpc("is_owner");
    if (ownerError || !ownerCheck) return json({ error: "forbidden" }, 403);

    const body = await req.json().catch(() => null) as { action?: string; payload?: any } | null;
    if (!body || typeof body !== "object" || !body.action) {
      return json({ error: "bad_request" }, 400);
    }

    const action = body.action;
    const payload = body.payload ?? {};

    switch (action) {
      case "getAccountingStatus": {
        const year = Number(payload.year) || new Date().getUTCFullYear();
        const limit = Math.min(Number(payload.limit) || 200, 500);
        const [entriesRes, summaryRes] = await Promise.all([
          fcJson(`/api/public/v1/entries?limit=${limit}`),
          fcJson(`/api/public/v1/reports/summary?year=${year}`),
        ]);
        if (!entriesRes.ok) return json({ error: "fc_entries_failed", status: entriesRes.status, detail: entriesRes.body }, 502);
        const entries: FcEntry[] = entriesRes.body?.data ?? [];
        const summary = summaryRes.ok ? (summaryRes.body?.data ?? null) : null;
        const kpis = aggregateStatus(entries, summary, year);
        return json({ entries, summary, kpis });
      }

      case "createEntry": {
        const entry = payload?.entry;
        if (!entry || typeof entry !== "object") return json({ error: "bad_request" }, 400);
        const withSource = {
          ...entry,
          source_app: entry.source_app ?? SOURCE_APP,
        };
        const res = await fcJson(`/api/public/v1/entries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(withSource),
        });
        if (!res.ok) return json({ error: "fc_create_failed", status: res.status, detail: res.body }, res.status === 400 ? 400 : 502);
        return json({ entry: res.body?.data ?? res.body });
      }

      case "deleteEntry": {
        const id = String(payload.id ?? "");
        if (!id) return json({ error: "bad_request" }, 400);
        const res = await fcJson(`/api/public/v1/entries/${id}`, { method: "DELETE" });
        if (!res.ok) return json({ error: "fc_delete_failed", status: res.status, detail: res.body }, 502);
        return json({ ok: true });
      }

      case "listAttachments": {
        const id = String(payload.id ?? "");
        if (!id) return json({ error: "bad_request" }, 400);
        const res = await fcJson(`/api/public/v1/entries/${id}/attachments`);
        if (!res.ok) return json({ error: "fc_list_attachments_failed", status: res.status, detail: res.body }, 502);
        return json({ attachments: res.body?.data ?? [] });
      }

      case "uploadAttachment": {
        const { fileName, mimeType, fileBase64, entryId } = payload ?? {};
        if (!fileName || !mimeType || !fileBase64) return json({ error: "bad_request" }, 400);
        const bytes = base64ToUint8(String(fileBase64));
        const form = new FormData();
        const blob = new Blob([bytes], { type: String(mimeType) });
        form.append("file", blob, String(fileName));
        if (entryId) form.append("entry_id", String(entryId));
        const res = await fcRequest(`/api/public/v1/attachments`, { method: "POST", body: form });
        const text = await res.text();
        let parsed: any = null;
        if (text) { try { parsed = JSON.parse(text); } catch { parsed = text; } }
        if (!res.ok) return json({ error: "fc_upload_failed", status: res.status, detail: parsed }, 502);
        return json({ attachment: parsed?.data ?? parsed });
      }

      case "deleteAttachment": {
        const id = String(payload.id ?? "");
        if (!id) return json({ error: "bad_request" }, 400);
        const res = await fcJson(`/api/public/v1/attachments/${id}`, { method: "DELETE" });
        if (!res.ok) return json({ error: "fc_delete_attachment_failed", status: res.status, detail: res.body }, 502);
        return json({ ok: true });
      }

      case "sendPartnerSettlement": {
        const p = payload ?? {};
        const partnerName = String(p.partnerName ?? "").trim();
        const eventName = String(p.eventName ?? "").trim();
        const eventSlug = String(p.eventSlug ?? "").trim();
        const date = String(p.date ?? "").trim();
        const total = Number(p.total);
        const partnerPercent = Number(p.partnerPercent);
        const invoiceText = p.invoiceText ? String(p.invoiceText) : null;
        const notes = p.notes ? String(p.notes) : null;
        const externalUrl = p.reportUrl ? String(p.reportUrl) : null;

        if (!partnerName || !eventName || !eventSlug || !date) return json({ error: "bad_request" }, 400);
        if (!Number.isFinite(total) || total <= 0) return json({ error: "invalid_total" }, 400);
        if (!Number.isFinite(partnerPercent) || partnerPercent < 0 || partnerPercent > 100) return json({ error: "invalid_percent" }, 400);
        if (externalUrl && !/^https:\/\//i.test(externalUrl)) return json({ error: "invalid_url" }, 400);

        const partnerAmount = round(total * partnerPercent / 100);
        const ourAmount = total - partnerAmount;

        const combinedNotes = [notes, invoiceText ? `Fakturatekst: ${invoiceText}` : null]
          .filter(Boolean)
          .join("\n\n") || null;

        const entry = {
          entry_type: "income",
          entry_date: date,
          description: `Andel av omsetning fra ${partnerName} – ${eventName}`,
          counterparty: partnerName,
          category: "Popup-salg",
          category_group: "Inntekter",
          amount_gross: ourAmount,
          amount_net: ourAmount,
          vat_rate: 0,
          payment_status: "unpaid",
          invoice_status: "draft",
          source_app: SOURCE_APP,
          source_type: "partner_settlement",
          source_ref: eventSlug,
          external_url: externalUrl,
          notes: combinedNotes,
        };

        const res = await fcJson(`/api/public/v1/entries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });

        const invoiceBasis = buildInvoiceBasis(
          { partnerName, eventName, eventSlug, date, total, partnerPercent, invoiceText, notes },
          res.ok ? (res.body?.data?.voucher_number ?? null) : null,
        );

        if (!res.ok) {
          // Treat 400/409 as idempotency conflict
          if (res.status === 400 || res.status === 409) {
            return json({ duplicate: true, invoiceBasis, detail: res.body });
          }
          return json({ error: "fc_create_failed", status: res.status, detail: res.body }, 502);
        }
        return json({ entry: res.body?.data ?? res.body, invoiceBasis });
      }

      default:
        return json({ error: "invalid_action" }, 400);
    }
  } catch (e) {
    console.error("finance-core error:", e);
    const msg = e instanceof Error ? e.message : "internal_error";
    return json({ error: msg }, 500);
  }
});