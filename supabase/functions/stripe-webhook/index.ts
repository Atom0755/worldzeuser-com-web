import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")!;
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function supabasePost(path: string, body: any) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
      "Prefer": "resolution=merge-duplicates",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Supabase POST ${path} failed: ${res.status} ${txt}`);
  }
  return res;
}

// Read current balance, then upsert with new balance
async function topUpWallet(
  userId: string,
  tenantSlug: string,
  amountUsd: number,
  paymentIntentId: string
) {
  // Get existing row
  const getRes = await fetch(
    `${supabaseUrl}/rest/v1/wallet_balances?user_id=eq.${userId}&tenant_slug=eq.${tenantSlug}&select=balance,anchor_day`,
    {
      headers: {
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
      },
    }
  );

  const rows = await getRes.json();
  const existing = rows?.[0];
  const currentBalance = Number(existing?.balance || 0);
  const newBalance = currentBalance + amountUsd;

  // anchor_day: set once on first top-up (day of month)
  const anchorDay = existing?.anchor_day ?? new Date().getDate();

  // Upsert wallet_balances
  await supabasePost("wallet_balances", {
    user_id: userId,
    tenant_slug: tenantSlug,
    balance: newBalance,
    monthly_fee: 50,
    anchor_day: anchorDay,
    status: "active",
    updated_at: new Date().toISOString(),
  });

  // Insert transaction record
  await supabasePost("wallet_transactions", {
    user_id: userId,
    tenant_slug: tenantSlug,
    type: "recharge",
    amount: amountUsd,
    stripe_payment_intent_id: paymentIntentId,
    note: `Stripe 充值 $${amountUsd}`,
    created_at: new Date().toISOString(),
  });
}

serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("OK", { status: 200 });

    const sig = req.headers.get("stripe-signature");
    if (!sig) return new Response("Missing stripe-signature", { status: 400 });

    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    // Handle one-time payment success
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Only handle payment mode (wallet top-up), not subscriptions
      if (session.mode !== "payment") {
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const userId = (session.metadata?.supabase_user_id || "").trim();
      const tenantSlug = (session.metadata?.tenant_slug || "").trim();
      const amountUsd = Number(session.metadata?.amount_usd || 0);
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? "";

      if (!userId || !tenantSlug || amountUsd < 1) {
        console.warn("Missing metadata in checkout session:", session.id);
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      await topUpWallet(userId, tenantSlug, amountUsd, paymentIntentId);
      console.log(`✅ Wallet topped up: user=${userId} tenant=${tenantSlug} amount=$${amountUsd}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
