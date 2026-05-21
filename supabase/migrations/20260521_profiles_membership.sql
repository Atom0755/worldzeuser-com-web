-- ============================================================
-- 1. profiles 表（用户个人资料）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        UNIQUE NOT NULL,
  tenant_slug text        NOT NULL DEFAULT 'uscgcc',
  full_name   text,
  company     text,
  phone       text,
  position    text,
  bio         text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles: user select own" ON public.profiles;
CREATE POLICY "profiles: user select own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles: user insert own" ON public.profiles;
CREATE POLICY "profiles: user insert own" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles: user update own" ON public.profiles;
CREATE POLICY "profiles: user update own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 2. membership_applications 表（会员申请）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.membership_applications (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        NOT NULL,
  tenant_slug text        NOT NULL DEFAULT 'uscgcc',
  full_name   text,
  company     text,
  phone       text,
  position    text,
  purpose     text,
  status      text        NOT NULL DEFAULT 'pending'
              CHECK (status IN ('draft','pending','approved','rejected')),
  admin_notes text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "membership: user select own" ON public.membership_applications;
CREATE POLICY "membership: user select own" ON public.membership_applications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "membership: user insert" ON public.membership_applications;
CREATE POLICY "membership: user insert" ON public.membership_applications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "membership: auth read all" ON public.membership_applications;
CREATE POLICY "membership: auth read all" ON public.membership_applications
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "membership: auth update all" ON public.membership_applications;
CREATE POLICY "membership: auth update all" ON public.membership_applications
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
