-- WorldZeuser multi-tenant starter schema
-- Run in Supabase SQL editor

create extension if not exists pgcrypto;

-- Tenant registry (optional; currently frontend has a static list too)
create table if not exists tenants (
  slug text primary key,
  display_name text not null,
  created_at timestamptz not null default now()
);

-- Admin mapping: who can manage which tenant
create table if not exists tenant_admins (
  tenant_slug text references tenants(slug) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tenant_slug, user_id)
);

-- Public posts per tenant (news/announcements)
create table if not exists tenant_posts (
  id uuid primary key default gen_random_uuid(),
  tenant_slug text not null references tenants(slug) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table tenants enable row level security;
alter table tenant_admins enable row level security;
alter table tenant_posts enable row level security;

-- Policies

-- Tenants table: readable by anyone (so public pages can show tenant metadata if desired)
drop policy if exists "tenants read" on tenants;
create policy "tenants read" on tenants
for select using (true);

-- tenant_admins: only admins can see their own mapping (optional)
drop policy if exists "tenant_admins read own" on tenant_admins;
create policy "tenant_admins read own" on tenant_admins
for select using (auth.uid() = user_id);

-- tenant_posts: public read
drop policy if exists "tenant_posts public read" on tenant_posts;
create policy "tenant_posts public read" on tenant_posts
for select using (true);

-- tenant_posts: insert only if user is admin of that tenant
drop policy if exists "tenant_posts insert by tenant admin" on tenant_posts;
create policy "tenant_posts insert by tenant admin" on tenant_posts
for insert with check (
  exists (
    select 1 from tenant_admins a
    where a.tenant_slug = tenant_posts.tenant_slug
      and a.user_id = auth.uid()
  )
);

-- tenant_posts: delete only if user is admin of that tenant
drop policy if exists "tenant_posts delete by tenant admin" on tenant_posts;
create policy "tenant_posts delete by tenant admin" on tenant_posts
for delete using (
  exists (
    select 1 from tenant_admins a
    where a.tenant_slug = tenant_posts.tenant_slug
      and a.user_id = auth.uid()
  )
);

-- Seed tenants (edit as you like)
insert into tenants (slug, display_name) values
  ('uscgcc', 'USCGCC 美国粤商会 / 美中广东总商会'),
  ('usclgcc', 'USCLGCC 美中物流总商会'),
  ('ilausa', 'ILAUSA 美国国际物流协会'),
  ('uzlea', 'UZLEA 美国浙江物流电商协会'),
  ('gbi', 'GBI 环球创新建材中心')
on conflict (slug) do nothing;

-- After creating admin users in Supabase Auth, add them here:
-- insert into tenant_admins (tenant_slug, user_id) values ('uscgcc', '00000000-0000-0000-0000-000000000000');
