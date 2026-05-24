import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type Json = Record<string, any>;

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Json, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function openaiEmbed(apiKey: string, model: string, input: string) {
  const r = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input,
    }),
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error(`OpenAI embeddings error: ${r.status} ${t}`);
  }

  const j = await r.json();
  const embedding = j?.data?.[0]?.embedding;
  if (!embedding) throw new Error("No embedding returned from OpenAI");
  return embedding as number[];
}

async function supabaseRpcOrRestUpdate(
  supabaseUrl: string,
  serviceRoleKey: string,
  id: string,
  embedding: number[]
) {
  // REST update: PATCH /rest/v1/knowledge_base?id=eq.<uuid>
  const r = await fetch(
    `${supabaseUrl}/rest/v1/knowledge_base?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({ embedding }),
    }
  );

  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Supabase update error: ${r.status} ${t}`);
  }
  return await r.json();
}

async function supabaseSelectNullEmbeddings(
  supabaseUrl: string,
  serviceRoleKey: string,
  tenant_slug: string,
  limit: number
) {
  // REST select: GET /rest/v1/knowledge_base?tenant_slug=eq.xxx&embedding=is.null&select=...
  const url =
    `${supabaseUrl}/rest/v1/knowledge_base` +
    `?tenant_slug=eq.${encodeURIComponent(tenant_slug)}` +
    `&embedding=is.null` +
    `&select=id,title,content,content_type,source_url,metadata,updated_at` +
    `&limit=${limit}`;

  const r = await fetch(url, {
    method: "GET",
    headers: {
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
    },
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Supabase select error: ${r.status} ${t}`);
  }

  return (await r.json()) as Array<any>;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    // 你说“用small”
    const OPENAI_EMBED_MODEL = "text-embedding-3-small";

    if (!OPENAI_API_KEY) return jsonResponse({ ok: false, error: "Missing OPENAI_API_KEY" }, 500);
    if (!SUPABASE_URL) return jsonResponse({ ok: false, error: "Missing SUPABASE_URL" }, 500);
    if (!SUPABASE_SERVICE_ROLE_KEY) return jsonResponse({ ok: false, error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, 500);

    const raw = await req.text();
    const body = raw ? JSON.parse(raw) : {};

    const tenant_slug = (body.tenant_slug ?? "").toString().trim();
    const limit = Number(body.limit ?? 50);

    if (!tenant_slug) return jsonResponse({ ok: false, error: "Missing tenant_slug" }, 400);
    if (!Number.isFinite(limit) || limit <= 0) return jsonResponse({ ok: false, error: "Invalid limit" }, 400);

    // 1) 找出 embedding is null 的记录
    const rows = await supabaseSelectNullEmbeddings(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      tenant_slug,
      limit
    );

    if (rows.length === 0) {
      return jsonResponse({
        ok: true,
        tenant_slug,
        embedded: 0,
        message: "No rows with NULL embedding found (nothing to backfill).",
      });
    }

    // 2) 逐条生成 embedding 并回写（单条出错不影响其余条）
    const results: any[] = [];
    const errors: any[] = [];
    for (const r of rows) {
      const id = r.id;
      const title = (r.title ?? "").toString();
      const content = (r.content ?? "").toString();

      // text-embedding-3-small 最大 8192 tokens；中文约 1 char/token，保守取 6000 字符
      const input = `标题：${title}\n内容：${content}`.slice(0, 6000);

      try {
        const embedding = await openaiEmbed(OPENAI_API_KEY, OPENAI_EMBED_MODEL, input);
        await supabaseRpcOrRestUpdate(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, id, embedding);
        results.push({ id, title, content_preview: content.slice(0, 80) });
      } catch (itemErr) {
        errors.push({ id, title: title.slice(0, 40), error: String((itemErr as any)?.message ?? itemErr) });
      }
    }

    return jsonResponse({
      ok: true,
      tenant_slug,
      embed_model: OPENAI_EMBED_MODEL,
      embedded: results.length,
      failed: errors.length,
      rows: results,
      errors,
    });
  } catch (e) {
    return jsonResponse({ ok: false, error: String((e as any)?.message ?? e) }, 500);
  }
});
