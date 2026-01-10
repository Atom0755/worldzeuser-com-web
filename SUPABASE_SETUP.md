# Supabase 设置检查清单

## ✅ 已完成的设置

根据你的截图，以下内容已经配置好：

1. **Edge Functions 已创建：**
   - `embed-backfill` - 用于生成 embedding
   - `swift-task` - 用于 RAG 问答（这就是前端调用的函数）

2. **数据库表已存在：**
   - `knowledge_base` - 知识库表（已有 4 条数据）
   - `conversations` - 对话记录表
   - `inquiries` - 询问表

3. **环境变量已配置：**
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## ⚠️ 需要检查的项目

### 1. `match_knowledge` RPC 函数

`swift-task` Edge Function 调用了 `match_knowledge` RPC 函数。需要在 Supabase 中创建这个函数：

```sql
-- 在 Supabase SQL Editor 中运行

-- 首先确保 pgvector 扩展已启用
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建 match_knowledge 函数
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(1536),  -- text-embedding-3-small 的维度
  match_threshold float DEFAULT 0.75,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  tenant_slug text,
  title text,
  content text,
  content_type varchar,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.tenant_slug,
    kb.title,
    kb.content,
    kb.content_type,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM knowledge_base kb
  WHERE 
    kb.embedding IS NOT NULL
    AND kb.tenant_slug = 'uscgcc'  -- 可以根据需要调整
    AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### 2. 确保 knowledge_base 表有 embedding 数据

运行 `embed-backfill` Edge Function 来为知识库生成 embedding：

```bash
# 在 Supabase Dashboard 的 Edge Functions 页面
# 或者使用 curl:

curl -L -X POST \
  'https://hrnedqrnzqseuuxmegsb.supabase.co/functions/v1/embed-backfill' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  --data '{"tenant_slug": "uscgcc", "limit": 50}'
```

### 3. 检查 knowledge_base 表的数据

确保 `knowledge_base` 表中有 `uscgcc` 租户的数据：

```sql
SELECT id, tenant_slug, title, content_type, 
       CASE WHEN embedding IS NULL THEN '需要生成' ELSE '已有' END as embedding_status
FROM knowledge_base 
WHERE tenant_slug = 'uscgcc';
```

## 🧪 测试步骤

1. **测试邮箱验证：**
   - 访问 `uscgcc.worldzeuser.com`
   - 输入邮箱并点击确认
   - 检查邮箱是否收到验证链接

2. **测试问答功能：**
   - 验证邮箱后，在对话框中输入问题
   - 例如："请介绍商会的基本信息"
   - 应该能收到 AI 回答

3. **测试菜单按钮：**
   - 点击"商会简介"、"总会长简介"等按钮
   - 应该能自动获取相关答案

## 🔧 前端代码已更新

前端代码已经修改为：
- 调用 `swift-task` Edge Function（而不是 `chat`）
- 参数格式：`{ tenant_slug: 'uscgcc', question: '...', match_threshold: 0.75, match_count: 5 }`
- 菜单按钮会自动构造问题

## 📝 注意事项

1. **Edge Function 名称：** 前端现在调用的是 `swift-task`，确保这个函数已部署
2. **RPC 函数：** 必须创建 `match_knowledge` RPC 函数，否则会报错
3. **Embedding：** 确保知识库数据已生成 embedding，否则无法进行向量搜索
4. **租户名称：** 确保数据库中的 `tenant_slug` 是 `uscgcc`（小写）
