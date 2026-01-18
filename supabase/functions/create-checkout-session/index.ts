import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(
  Deno.env.get("STRIPE_SECRET_KEY")!,
  { apiVersion: "2023-10-16" }
);

serve(async (req) => {
  try {
    // 只允许 POST
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // 1️⃣ 取登录用户（Supabase 自动注入）
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

    // 2️⃣ 从前端接收 price_id
    const { price_id } = await req.json();
    if (!price_id) {
      return new Response("Missing price_id", { status: 400 });
    }

    // 3️⃣ 创建 Stripe Checkout Session（订阅）
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      success_url: "https://worldzeuser.com/?payment=success",
      cancel_url: "https://worldzeuser.com/?payment=cancel",
      metadata: {
        supabase_user_id: user.id,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
});
