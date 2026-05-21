-- 为 knowledge_base 表添加自动导入相关字段
ALTER TABLE public.knowledge_base
  ADD COLUMN IF NOT EXISTS auto_categorized boolean DEFAULT false;

-- 如果 source_type 列不存在（旧库可能没有），也一并加上
ALTER TABLE public.knowledge_base
  ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'manual';
