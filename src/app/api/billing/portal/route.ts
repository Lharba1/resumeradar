import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";
import { checkAndIncrement } from "@/lib/rate-limit";
import { getStripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  // Rate limit: max 10 portal sessions per day (atomic increment)
  const limit = await checkAndIncrement(user.id, "/api/billing/portal", supabase);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many portal requests. Try again tomorrow." }, { status: 429 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const adminSupabase = createServiceRoleClient();
  const { data: sub } = await adminSupabase
    .from("user_subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!sub?.stripe_customer_id)
    return NextResponse.json({ error: "No Stripe customer found — please upgrade first" }, { status: 404 });

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer:   sub.stripe_customer_id,
    return_url: `${origin}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
