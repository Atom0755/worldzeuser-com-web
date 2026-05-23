-- 确保 conversations 表和 RLS 策略存在（idempotent）
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
