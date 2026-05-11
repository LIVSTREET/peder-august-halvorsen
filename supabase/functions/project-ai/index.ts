import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Action = "translate_en" | "improve_no" | "seo_case" | "fill_missing";

const ALLOWED_ACTIONS: Action[] = [
  "translate_en",
  "improve_no",
  "seo_case",
  "fill_missing",
];

// Allowlist of fields the AI is permitted to set. Anything else is dropped.
const ALLOWED_FIELDS = new Set([
  "title",
  "title_en",
  "subtitle",
  "subtitle_en",
  "description",
  "description_en",
  "problem_text",
  "problem_text_en",
  "solution_text",
  "solution_text_en",
  "result_text",
  "result_text_en",
  "role",
  "role_en",
]);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildPrompt(action: Action, project: Record<string, string>): {
  system: string;
  user: string;
} {
  const projectJson = JSON.stringify(project, null, 2);

  const baseRules = [
    "You are an editorial assistant for a portfolio of digital projects.",
    "Strict rules:",
    "- Use ONLY the facts present in the provided project fields.",
    "- Never invent metrics, numbers, percentages, dates, client names, or outcomes.",
    "- Never add testimonials or quotes.",
    "- Keep the tone calm, editorial, professional. No marketing fluff.",
    "- Norwegian (Bokmål) is the default voice. English is concise, native, plain.",
    "- Return ONLY the requested fields via the return_suggestions tool.",
    "- If a field cannot be produced from given facts, omit it.",
  ].join("\n");

  switch (action) {
    case "translate_en":
      return {
        system: baseRules,
        user: [
          "Task: produce English translations for every Norwegian field that has content but no English counterpart.",
          "Fill: title_en, subtitle_en, description_en, problem_text_en, solution_text_en, result_text_en, role_en — only when the matching NO field has content.",
          "Do not modify Norwegian fields.",
          "Project (JSON):",
          projectJson,
        ].join("\n"),
      };
    case "improve_no":
      return {
        system: baseRules,
        user: [
          "Task: lightly improve clarity and rhythm of the existing Norwegian fields.",
          "Allowed fields to rewrite: title, subtitle, description, problem_text, solution_text, result_text, role.",
          "Keep meaning and facts identical. Shorten where it helps. Do not invent details.",
          "Only return fields that actually had content and were genuinely improved.",
          "Project (JSON):",
          projectJson,
        ].join("\n"),
      };
    case "seo_case":
      return {
        system: baseRules,
        user: [
          "Task: produce a short editorial case study in Norwegian based ONLY on title, subtitle, description, role, tech and url.",
          "Fill ONLY: problem_text, solution_text, result_text.",
          "Each field should be 2–4 plain sentences. No headings, no bullets, no fabricated numbers.",
          "If facts are too sparse to produce a section honestly, omit that field.",
          "Project (JSON):",
          projectJson,
        ].join("\n"),
      };
    case "fill_missing":
      return {
        system: baseRules,
        user: [
          "Task: fill ONLY fields that are currently empty, using existing fields as the source of truth.",
          "Allowed fields: title_en, subtitle_en, description_en, problem_text_en, solution_text_en, result_text_en, role_en, problem_text, solution_text, result_text.",
          "Never overwrite a field that already has content.",
          "Skip any field that cannot be produced honestly from the existing facts.",
          "Project (JSON):",
          projectJson,
        ].join("\n"),
      };
  }
}

const JSON_INSTRUCTION = [
  "",
  "Return ONLY a JSON object with this exact shape (no prose, no markdown, no code fences):",
  '{ "fields": { "<field_name>": "<suggested string value>", ... } }',
  "Allowed field keys: title, title_en, subtitle, subtitle_en, description, description_en, problem_text, problem_text_en, solution_text, solution_text_en, result_text, result_text_en, role, role_en.",
  "Omit any field you cannot fill honestly. If you cannot suggest anything, return { \"fields\": {} }.",
].join("\n");

function extractJsonObject(text: string): unknown {
  if (!text) return null;
  const trimmed = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    // --- Auth check ----------------------------------------------------------
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return jsonResponse({ error: "unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse({ error: "server_misconfigured" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return jsonResponse({ error: "unauthorized" }, 401);
    }

    // Owner / admin check via existing SQL function.
    const { data: ownerCheck, error: ownerError } = await supabase.rpc("is_owner");
    if (ownerError) {
      console.error("is_owner rpc error:", ownerError);
      return jsonResponse({ error: "forbidden" }, 403);
    }
    if (!ownerCheck) {
      return jsonResponse({ error: "forbidden" }, 403);
    }

    // --- Parse body ----------------------------------------------------------
    const body = await req.json().catch(() => null) as
      | { action?: string; project?: Record<string, unknown> }
      | null;
    if (!body || typeof body !== "object") {
      return jsonResponse({ error: "bad_request" }, 400);
    }

    const action = body.action as Action;
    if (!ALLOWED_ACTIONS.includes(action)) {
      return jsonResponse({ error: "invalid_action" }, 400);
    }

    const rawProject = body.project ?? {};
    const project: Record<string, string> = {};
    for (const key of Object.keys(rawProject)) {
      const v = (rawProject as Record<string, unknown>)[key];
      if (typeof v === "string") project[key] = v;
    }

    // --- AI call -------------------------------------------------------------
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableKey) {
      return jsonResponse({ error: "ai_not_configured" }, 503);
    }

    const { system, user } = buildPrompt(action, project);
    const fullSystem = system + "\n" + JSON_INSTRUCTION;

    console.log("project-ai action:", action);

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: fullSystem },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (aiResp.status === 429) {
      return jsonResponse({ error: "rate_limited" }, 429);
    }
    if (aiResp.status === 402) {
      return jsonResponse({ error: "ai_credits_exhausted" }, 402);
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      return jsonResponse({ error: "ai_error" }, 502);
    }

    const aiJson = await aiResp.json();
    const message = aiJson?.choices?.[0]?.message;
    const content: string | undefined =
      typeof message?.content === "string"
        ? message.content
        : Array.isArray(message?.content)
          ? message.content.map((p: any) => (typeof p?.text === "string" ? p.text : "")).join("")
          : undefined;
    console.log("project-ai ai message present:", !!message, "content length:", content?.length ?? 0);
    const parsed = extractJsonObject(content ?? "");
    if (!parsed || typeof parsed !== "object") {
      console.error("Failed to parse AI JSON. Raw content:", content);
      return jsonResponse({ error: "ai_invalid_response" }, 502);
    }
    const parsedArgs = parsed as { fields?: Record<string, unknown> };

    const cleanFields: Record<string, string> = {};
    const rawFields = parsedArgs.fields ?? {};
    for (const [k, v] of Object.entries(rawFields)) {
      if (!ALLOWED_FIELDS.has(k)) continue;
      if (typeof v !== "string") continue;
      const trimmed = v.trim();
      if (!trimmed) continue;
      cleanFields[k] = trimmed;
    }

    return jsonResponse({ action, fields: cleanFields });
  } catch (e) {
    console.error("project-ai error:", e);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});