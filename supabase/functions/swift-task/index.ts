import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const OPENAI_EMBED_MODEL = "text-embedding-3-small";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

async function createEmbedding(text: string) {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_EMBED_MODEL,
      input: text,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI embedding error: ${res.status} ${errorText}`);
  }

  const json = await res.json();
  return json.data[0].embedding;
}

async function askClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "prompt-caching-2024-07-31",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 500,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Claude API error: ${res.status} ${errorText}`);
  }

  const json = await res.json();
  return json.content[0].text;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const {
      tenant_slug,
      question,
      match_threshold = 0.75,
      match_count = 5,
    } = body;

    console.log("Received:", { tenant_slug, question });

    if (!tenant_slug || !question) {
      return jsonResponse(
        { ok: false, error: "tenant_slug and question required" },
        400
      );
    }

    // 1️⃣ 生成问题 embedding
    console.log("Creating embedding...");
    const queryEmbedding = await createEmbedding(question);
    console.log("Embedding created");

    // 2️⃣ 调用 match_knowledge_base（修复：添加错误处理）
    console.log("Calling match_knowledge_base...");
    const rpcRes = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/match_knowledge_base`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query_embedding: queryEmbedding,
          match_threshold,
          match_count,
          p_tenant_slug: tenant_slug,
        }),
      }
    );

    // ✅ 添加错误处理
    if (!rpcRes.ok) {
      const errorText = await rpcRes.text();
      console.error("RPC error:", errorText);
      return jsonResponse(
        { ok: false, error: `Database error: ${errorText}` },
        500
      );
    }

    const matches = await rpcRes.json();
    console.log("Matches found:", matches?.length || 0);

    // ✅ 确保 matches 是数组
    if (!Array.isArray(matches)) {
      console.error("Matches is not an array:", matches);
      return jsonResponse(
        { ok: false, error: "Invalid response from database" },
        500
      );
    }

    // 3️⃣ 拼上下文
    const context =
      matches.length > 0
        ? matches
            .map(
              (m: any, i: number) =>
                `【资料 ${i + 1}｜相似度 ${(m.similarity || 0).toFixed(3)}】\n标题：${m.title || '无标题'}\n内容：${
                  m.content || ''
                }`
            )
            .join("\n\n---\n\n")
        : "（数据库中未找到相关资料）";

    console.log("Context prepared, length:", context.length);

    // 4️⃣ 构造 Prompt
    const systemPrompt = `
你是 USCGCC 商会 AI 助手。
你只能基于【提供的资料】回答。
如果资料不足，请明确说明，并给出建议。
重要：请用与用户提问相同的语言回答。用户用英文提问就用英文回答，用中文提问就用中文回答，双语混合则以中文为主。
回答结构清晰、专业。
`;

    const userPrompt = `
【用户问题】
${question}

【资料来源（仅限使用）】
${context}

【回答要求】
1. 仅基于资料回答，不要编造
2. 如信息不足，请说明
3. 可用条列方式
`.trim();

    // 5️⃣ 调用 Claude
    console.log("Calling Claude...");
    const answer = await askClaude(systemPrompt, userPrompt);
    console.log("Answer received");

    return jsonResponse({
      ok: true,
      tenant_slug,
      question,
      used_model: ANTHROPIC_MODEL,
      matches: matches.map((m: any) => ({
        id: m.id,
        title: m.title ?? null,
        similarity: m.similarity ?? 0,
        preview: (m.content || '').slice(0, 200),
      })),
      answer,
    });
  } catch (e) {
    console.error("RAG error", e);
    return jsonResponse(
      { ok: false, error: "Internal error", detail: String(e) },
      500
    );
  }
});
