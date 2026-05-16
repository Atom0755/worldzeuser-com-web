-- Run this in Supabase SQL Editor
-- Creates wallet tables for real Stripe top-up payments

CREATE TABLE IF NOT EXISTS wallet_balances (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_slug text NOT NULL,
  balance numeric(10,2) NOT NULL DEFAULT 0,
  monthly_fee numeric(10,2) NOT NULL DEFAULT 50,
  anchor_day integer,                    -- day-of-month billing anchor (set on first top-up)
  status text NOT NULL DEFAULT 'active', -- active | suspended
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tenant_slug)
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_slug text NOT NULL,
  type text NOT NULL,                    -- recharge | monthly_fee
  amount numeric(10,2) NOT NULL,         -- positive = credit, negative = debit
  stripe_payment_intent_id text,
  note text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_wallet_balances_user_tenant ON wallet_balances(user_id, tenant_slug);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_tenant ON wallet_transactions(user_id, tenant_slug);

-- RLS: users can only read their own rows
ALTER TABLE wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wallet_balances_select_own" ON wallet_balances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "wallet_transactions_select_own" ON wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);
