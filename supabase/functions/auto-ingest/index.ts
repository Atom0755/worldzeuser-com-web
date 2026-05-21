import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const EMBED_MODEL = "text-embedding-3-small";
const KNOWN_CATEGORIES = ["商会简介", "会员服务", "活动信息", "联系我们", "常见问题", "其他"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// 把长文本按段落切成 ~500 字的块，相邻块有 50 字 overlap
function chunkText(text: string, maxChars = 500, overlap = 50): string[] {
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 10);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if (!current) {
      current = para.slice(0, maxChars);
    } else if (current.length + para.length + 2 <= maxChars) {
      current += "\n\n" + para;
    } else {
      chunks.push(current.trim());
      const tail = current.length > overlap ? current.slice(-overlap) : current;
      current = (tail + "\n" + para).slice(0, maxChars);
    }
  }
  if (current.trim().length > 10) chunks.push(current.trim());
  return chunks;
}

async function generateTitleAndCategory(
  chunk: string
): Promise<{ title: string; category: string }> {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 60,
      messages: [
        {
          role: "user",
          content: `分析以下文本，只返回JSON，不要任何其他文字：{"title":"简短标题（8字以内）","category":"从这些选项选一个：${KNOWN_CATEGORIES.join("/")}"}

文本：${chunk.slice(0, 300)}`,
        },
      ],
    }),
  });

  try {
    const json = await r.json();
    const raw = (json.content?.[0]?.text ?? "").trim();
    const match = raw.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : {};
    return {
      title: String(parsed.title || chunk.slice(0, 20)).slice(0, 50),
      category: KNOWN_CATEGORIES.includes(parsed.category) ? parsed.category : "其他",
    };
  } catch {
    return { title: chunk.slice(0, 20), category: "其他" };
  }
}

async function getEmbedding(text: string): Promise<number[]> {
  const r = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: EMBED_MODEL, input: text.slice(0, 8000) }),
  });
  const json = await r.json();
  if (!json.data?.[0]?.embedding) throw new Error("No embedding returned");
  return json.data[0].embedding as number[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ ok: false, error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const { tenant_slug, content, source_ref = "批量导入" } = body;

    if (!tenant_slug || !content) {
      return jsonResponse({ ok: false, error: "tenant_slug and content required" }, 400);
    }
    if (typeof content !== "string" || content.length > 50000) {
      return jsonResponse({ ok: false, error: "内容超过 50,000 字限制" }, 400);
    }

    const chunks = chunkText(content);
    if (chunks.length === 0) {
      return jsonResponse({ ok: false, error: "内容无法分块，请检查格式" }, 400);
    }

    console.log(`auto-ingest: tenant=${tenant_slug} chunks=${chunks.length}`);

    const inserted: { id: string; title: string; chunk_index: number }[] = [];
    const errors: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const { title, category } = await generateTitleAndCategory(chunk);
        const embedding = await getEmbedding(`标题：${title}\n内容：${chunk}`);

        const r = await fetch(`${SUPABASE_URL}/rest/v1/knowledge_base`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            tenant_slug,
            title,
            content_type: category,
            category,
            content: chunk,
            source_type: "auto_ingest",
            source_url: source_ref,
            auto_categorized: true,
            embedding,
          }),
        });

        if (!r.ok) {
          const errText = await r.text();
          errors.push(`块${i + 1}: ${errText}`);
          console.error(`chunk ${i + 1} insert failed:`, errText);
        } else {
          const data = await r.json();
          inserted.push({ id: data[0]?.id, title, chunk_index: i });
          console.log(`chunk ${i + 1}/${chunks.length} inserted: ${title}`);
        }
      } catch (e) {
        errors.push(`块${i + 1}: ${String(e)}`);
        console.error(`chunk ${i + 1} error:`, e);
      }
    }

    return jsonResponse({
      ok: true,
      tenant_slug,
      total_chunks: chunks.length,
      inserted: inserted.length,
      errors: errors.length > 0 ? errors : undefined,
      items: inserted,
    });
  } catch (e) {
    console.error("auto-ingest error:", e);
    return jsonResponse({ ok: false, error: String(e) }, 500);
  }
});
