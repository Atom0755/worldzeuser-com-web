-- 创建 match_knowledge RPC 函数
-- 用于向量相似度搜索

-- 首先确保 pgvector 扩展已启用（如果还没有）
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建 match_knowledge 函数
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(1536),  -- text-embedding-3-small 的维度是 1536
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
    AND kb.tenant_slug = 'uscgcc'  -- 可以根据需要调整或移除这个条件
    AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 验证函数是否创建成功
SELECT 
  proname as function_name,
  pg_get_function_arguments(oid) as arguments
FROM pg_proc 
WHERE proname = 'match_knowledge';
