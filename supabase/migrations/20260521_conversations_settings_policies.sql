-- ============================================================
-- 1. conversations 表（保存 AI 对话记录）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_slug text        NOT NULL DEFAULT 'uscgcc',
  user_id     uuid,
  title       text,
  messages    jsonb       DEFAULT '[]'::jsonb,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conversations: auth select" ON public.conversations;
CREATE POLICY "conversations: auth select" ON public.conversations
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "conversations: auth insert" ON public.conversations;
CREATE POLICY "conversations: auth insert" ON public.conversations
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "conversations: auth update" ON public.conversations;
CREATE POLICY "conversations: auth update" ON public.conversations
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "conversations: auth delete" ON public.conversations;
CREATE POLICY "conversations: auth delete" ON public.conversations
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 2. bot_settings 表（存头像 URL、机器人名字等）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bot_settings (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_slug text        UNIQUE NOT NULL,
  avatar_url  text,
  bot_name    text,
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE public.bot_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bot_settings: anon select" ON public.bot_settings;
CREATE POLICY "bot_settings: anon select" ON public.bot_settings
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "bot_settings: auth all" ON public.bot_settings;
CREATE POLICY "bot_settings: auth all" ON public.bot_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 插入 uscgcc 默认行
INSERT INTO public.bot_settings (tenant_slug) VALUES ('uscgcc')
  ON CONFLICT (tenant_slug) DO NOTHING;

-- ============================================================
-- 3. news 表补充 UPDATE / DELETE RLS（隐藏 & 删除功能）
-- ============================================================
DROP POLICY IF EXISTS "news: auth update" ON public.news;
CREATE POLICY "news: auth update" ON public.news
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "news: auth delete" ON public.news;
CREATE POLICY "news: auth delete" ON public.news
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 4. Storage bucket：bot-avatars（存 AI 助手头像）
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bot-avatars',
  'bot-avatars',
  true,
  2097152,
  ARRAY['image/jpeg','image/png','image/gif','image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "bot-avatars: public read" ON storage.objects;
CREATE POLICY "bot-avatars: public read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'bot-avatars');

DROP POLICY IF EXISTS "bot-avatars: auth upload" ON storage.objects;
CREATE POLICY "bot-avatars: auth upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'bot-avatars');

DROP POLICY IF EXISTS "bot-avatars: auth update" ON storage.objects;
CREATE POLICY "bot-avatars: auth update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'bot-avatars');

DROP POLICY IF EXISTS "bot-avatars: auth delete" ON storage.objects;
CREATE POLICY "bot-avatars: auth delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'bot-avatars');
