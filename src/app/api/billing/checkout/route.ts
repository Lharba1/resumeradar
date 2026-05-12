import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";
import { checkAndIncrement } from "@/lib/rate-limit";
import { getStripe, STRIPE_PRICE_IDS, TRIAL_DAYS } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  // Rate limit: max 5 checkout attempts per day (atomic increment)
  const limit = await checkAndIncrement(user.id, "/api/billing/checkout", supabase);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many checkout attempts. Try again tomorrow." }, { status: 429 });
  }

  let body: { plan_id: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { plan_id } = body;
  const priceId = STRIPE_PRICE_IDS[plan_id];
  if (!priceId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const stripe      = getStripe();
  const origin      = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const adminSupabase = createServiceRoleClient();

  // Get or create Stripe customer
  const { data: sub } = await adminSupabase
    .from("user_subscriptions")
    .select("stripe_customer_id, stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let customerId = sub?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await adminSupabase
      .from("user_subscriptions")
      .upsert({ user_id: user.id, stripe_customer_id: customerId, plan_id: "free", status: "active" }, { onConflict: "user_id" });
  }

  // Trial eligibility: Pro only, and only if user has never had a subscription
  const hasHadSubscription = !!sub?.stripe_subscription_id;
  const isTrialEligible    = plan_id === "pro" && !hasHadSubscription;

  const session = await stripe.checkout.sessions.create({
    customer:                  customerId,
    mode:                      "subscription",
    line_items:                [{ price: priceId, quantity: 1 }],
    success_url:               `${origin}/settings?upgraded=1`,
    cancel_url:                `${origin}/settings`,
    metadata:                  { supabase_user_id: user.id, plan_id },
    payment_method_collection: "always",
    ...(isTrialEligible && {
      subscription_data: { trial_period_days: TRIAL_DAYS },
    }),
  });

  return NextResponse.json({ url: session.url });
}
