# worldzeuser.com-web (Vite + React + Supabase, multi-tenant by subdomain)

This is a starter for **worldzeuser.com** as an "AI assistants directory" landing site, plus **tenant subdomain sites** (e.g. `uscgcc.worldzeuser.com`) with:
- public tenant home
- admin login (Supabase Auth)
- admin-only content publishing (Supabase DB + RLS)

## 1) Prereqs
- Node.js 18+
- A Supabase project

## 2) Configure environment variables
Create a `.env` file (or set in Vercel) using:

```
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

## 3) Install & run locally
```
npm install
npm run dev
```

Local multi-tenant testing:
- open http://localhost:5173 -> landing page
- open http://localhost:5173/?tenant=uscgcc -> simulates subdomain tenant

## 4) Deploy to Vercel (SPA)
- Import repo
- Set Env Vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Deploy
- Add domains:
  - `worldzeuser.com`, `www.worldzeuser.com`
  - `*.worldzeuser.com` (wildcard) so subdomains work

## 5) Supabase schema
Run SQL in Supabase SQL Editor: `supabase/schema.sql` (includes RLS policies).

After running schema:
1) Insert tenants (example included)
2) Create admin user(s) via Auth (email+password)
3) Add them to `tenant_admins` for the tenant

## Notes
- This starter focuses on the directory + basic admin publishing.
- The AI assistant chat + RAG can be added per-tenant later (API route / Edge function / server).
