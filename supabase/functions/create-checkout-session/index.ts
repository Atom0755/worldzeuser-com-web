import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(
  Deno.env.get("STRIPE_SECRET_KEY")!,
  { apiVersion: "2023-10-16" }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Verify user is logged in
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const jwt = authHeader.replace("Bearer ", "");
    const supabaseRes = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/auth/v1/user`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          apikey: Deno.env.get("SUPABASE_ANON_KEY")!,
        },
      }
    );

    const user = await supabaseRes.json();
    if (!user?.id) {
      return new Response("Invalid user", { status: 401 });
    }

    // Get amount and tenant from request body
    const { amount_usd, tenant_slug } = await req.json();

    if (!amount_usd || Number(amount_usd) < 50) {
      return new Response(
        JSON.stringify({ error: "Minimum top-up is $50" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!tenant_slug) {
      return new Response(
        JSON.stringify({ error: "Missing tenant_slug" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const amountCents = Math.round(Number(amount_usd) * 100);

    // Create one-time Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: `${tenant_slug.toUpperCase()} 钱包充值`,
              description: `充值 $${amount_usd} 到 WorldZeuser 钱包`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `https://${tenant_slug}.worldzeuser.com/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://${tenant_slug}.worldzeuser.com/admin-simple.html`,
      metadata: {
        supabase_user_id: user.id,
        tenant_slug: tenant_slug,
        amount_usd: String(amount_usd),
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
