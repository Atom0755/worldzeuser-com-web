import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount_usd, tenant_slug, user_id } = req.body;

    if (!amount_usd || Number(amount_usd) < 30) {
      return res.status(400).json({ error: '最低充值金额为 $30' });
    }

    const amountCents = Math.round(Number(amount_usd) * 100);
    const slug = tenant_slug || 'uscgcc';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: amountCents,
          product_data: {
            name: `${slug.toUpperCase()} 钱包充值`,
            description: `充值 $${amount_usd} 到 WorldZeuser 钱包`,
          },
        },
        quantity: 1,
      }],
      success_url: `https://${slug}.worldzeuser.com/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://${slug}.worldzeuser.com${req.headers.referer?.includes('profile') ? '/profile.html' : '/admin-simple.html'}`,
      metadata: {
        supabase_user_id: user_id || '',
        tenant_slug: slug,
        amount_usd: String(amount_usd),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message });
  }
}
