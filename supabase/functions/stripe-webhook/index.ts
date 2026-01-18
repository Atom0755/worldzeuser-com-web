import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function upsertSubscriptionRow(payload: any) {
  const res = await fetch(`${supabaseUrl}/rest/v1/user_subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
      "Prefer": "resolution=merge-duplicates",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Supabase upsert failed: ${res.status} ${txt}`);
  }
}

serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("OK", { status: 200 });

    const sig = req.headers.get("stripe-signature");
    if (!sig) return new Response("Missing stripe-signature", { status: 400 });

    // Stripe 需要“原始 body”
    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    // 我们只处理订阅相关
    if (event.type.startsWith("customer.subscription.")) {
      const sub = event.data.object as Stripe.Subscription;

      const customerId =
        typeof sub.customer === "string" ? sub.customer : sub.customer.id;

      // metadata 中保存 supabase_user_id（来自 create-checkout-session）
      const userId = (sub.metadata?.supabase_user_id || "").trim();

      // price id：取订阅第一条 item
      const priceId = sub.items.data[0]?.price?.id ?? null;

      // current_period_end 是秒，转成 timestamptz 用 ISO
      const currentPeriodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;

      // Stripe 状态映射（你表里用 text）
      const status = sub.status; // active / trialing / canceled / unpaid / past_due...

      // 没有 userId 时，不写（避免垃圾数据）
      if (userId) {
        await upsertSubscriptionRow({
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
          subscription_status: status,
          subscription_price_id: priceId,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString(),
        });
      } else {
        console.warn("No supabase_user_id in metadata; skip upsert", {
          subId: sub.id,
          customerId,
        });
      }
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
