import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Vercel: disable body parser so Stripe can verify raw body
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  if (!sig) return res.status(400).json({ error: 'Missing stripe-signature' });

  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).json({ error: `Signature verification failed: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Only handle wallet top-up (one-time payments)
    if (session.mode !== 'payment') {
      return res.status(200).json({ received: true });
    }

    const userId     = (session.metadata?.supabase_user_id || '').trim();
    const tenantSlug = (session.metadata?.tenant_slug || '').trim();
    const amountUsd  = Number(session.metadata?.amount_usd || 0);
    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent?.id ?? '');

    if (userId && tenantSlug && amountUsd >= 1) {
      // Read current balance
      const { data: existing } = await supabase
        .from('wallet_balances')
        .select('balance, anchor_day')
        .eq('user_id', userId)
        .eq('tenant_slug', tenantSlug)
        .maybeSingle();

      const newBalance = Number(existing?.balance || 0) + amountUsd;
      const anchorDay  = existing?.anchor_day ?? new Date().getDate();

      // Update balance
      await supabase.from('wallet_balances').upsert({
        user_id: userId,
        tenant_slug: tenantSlug,
        balance: newBalance,
        monthly_fee: 50,
        anchor_day: anchorDay,
        status: 'active',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,tenant_slug' });

      // Record transaction
      await supabase.from('wallet_transactions').insert({
        user_id: userId,
        tenant_slug: tenantSlug,
        type: 'recharge',
        amount: amountUsd,
        stripe_payment_intent_id: paymentIntentId,
        note: `Stripe 充值 $${amountUsd}`,
      });

      console.log(`✅ Wallet topped up: user=${userId} tenant=${tenantSlug} +$${amountUsd}`);
    }
  }

  return res.status(200).json({ received: true });
}
