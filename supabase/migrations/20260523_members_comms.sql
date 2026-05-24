-- ============================================================
-- 组织与成员 + 沟通中心 所需表和策略
-- ============================================================

-- ── 1. 让所有已认证用户可以读取同租户的所有 profiles（会员目录必需）────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles: all same tenant read'
  ) THEN
    CREATE POLICY "profiles: all same tenant read" ON public.profiles
      FOR SELECT TO authenticated USING (tenant_slug = 'uscgcc');
  END IF;
END $$;

-- ── 2. friendships 表（好友关系）────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.friendships (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status       text        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','accepted','rejected')),
  tenant_slug  text        NOT NULL DEFAULT 'uscgcc',
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now(),
  UNIQUE(sender_id, receiver_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'friendships' AND policyname = 'friendships: parties read'
  ) THEN
    CREATE POLICY "friendships: parties read" ON public.friendships
      FOR SELECT TO authenticated USING (sender_id = auth.uid() OR receiver_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'friendships' AND policyname = 'friendships: sender insert'
  ) THEN
    CREATE POLICY "friendships: sender insert" ON public.friendships
      FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'friendships' AND policyname = 'friendships: receiver update'
  ) THEN
    CREATE POLICY "friendships: receiver update" ON public.friendships
      FOR UPDATE TO authenticated
      USING (receiver_id = auth.uid() OR sender_id = auth.uid())
      WITH CHECK (receiver_id = auth.uid() OR sender_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'friendships' AND policyname = 'friendships: parties delete'
  ) THEN
    CREATE POLICY "friendships: parties delete" ON public.friendships
      FOR DELETE TO authenticated USING (sender_id = auth.uid() OR receiver_id = auth.uid());
  END IF;
END $$;

-- ── 3. uscgcc_inbox 表（收件箱）────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.uscgcc_inbox (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_id   uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  type        text        NOT NULL DEFAULT 'system'
              CHECK (type IN ('system','friend_request','friend_accepted','announcement','ai_reply')),
  subject     text,
  body        text,
  ref_id      uuid,        -- 关联的 friendship id 或 conversation id
  read_at     timestamptz,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS uscgcc_inbox_user_idx ON public.uscgcc_inbox(user_id);

ALTER TABLE public.uscgcc_inbox ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'uscgcc_inbox' AND policyname = 'inbox: own read'
  ) THEN
    CREATE POLICY "inbox: own read" ON public.uscgcc_inbox
      FOR SELECT TO authenticated USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'uscgcc_inbox' AND policyname = 'inbox: own update'
  ) THEN
    CREATE POLICY "inbox: own update" ON public.uscgcc_inbox
      FOR UPDATE TO authenticated USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'uscgcc_inbox' AND policyname = 'inbox: authenticated insert'
  ) THEN
    CREATE POLICY "inbox: authenticated insert" ON public.uscgcc_inbox
      FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

-- ── 4. tenant_settings 表（租户全局设置，含 AI 接管开关）─────────────────
CREATE TABLE IF NOT EXISTS public.tenant_settings (
  tenant_slug  text        PRIMARY KEY,
  settings     jsonb       NOT NULL DEFAULT '{}',
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tenant_settings' AND policyname = 'tenant_settings: all read'
  ) THEN
    CREATE POLICY "tenant_settings: all read" ON public.tenant_settings
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tenant_settings' AND policyname = 'tenant_settings: authenticated upsert'
  ) THEN
    CREATE POLICY "tenant_settings: authenticated upsert" ON public.tenant_settings
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 初始化 uscgcc 租户设置
INSERT INTO public.tenant_settings (tenant_slug, settings)
VALUES ('uscgcc', '{"ai_takeover": false}')
ON CONFLICT (tenant_slug) DO NOTHING;

-- ── 5. pending_ai_responses 表（AI 接管时暂存 AI 回复待管理员审核）────────
CREATE TABLE IF NOT EXISTS public.pending_ai_responses (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_slug  text        NOT NULL DEFAULT 'uscgcc',
  user_id      uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  question     text,
  ai_answer    text,
  admin_reply  text,
  status       text        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','approved','rejected')),
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.pending_ai_responses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'pending_ai_responses' AND policyname = 'pending_ai: authenticated read'
  ) THEN
    CREATE POLICY "pending_ai: authenticated read" ON public.pending_ai_responses
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'pending_ai_responses' AND policyname = 'pending_ai: authenticated write'
  ) THEN
    CREATE POLICY "pending_ai: authenticated write" ON public.pending_ai_responses
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;
