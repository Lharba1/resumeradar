import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  let body: { confirm: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (body.confirm !== "DELETE MY ACCOUNT") {
    return NextResponse.json({ error: 'Send { "confirm": "DELETE MY ACCOUNT" } to confirm deletion' }, { status: 400 });
  }

  const adminClient = createServiceRoleClient();

  // Cancel any active Stripe subscription before deleting the auth user
  const { data: sub } = await adminClient
    .from("user_subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (sub?.stripe_subscription_id) {
    try {
      const stripe = getStripe();
      await stripe.subscriptions.cancel(sub.stripe_subscription_id);
    } catch (stripeErr) {
      // Non-fatal — log for admin manual follow-up, then proceed with account deletion
      // so the user is never blocked from deleting their account by a Stripe outage
      try {
        await adminClient.from("admin_actions").insert({
          admin_id:       user.id,
          action:         "stripe_cancellation_failed",
          target_user_id: user.id,
          payload: {
            stripe_subscription_id: sub.stripe_subscription_id,
            error: stripeErr instanceof Error ? stripeErr.message : "unknown",
          },
        });
      } catch { /* log failure is non-fatal */ }
    }
  }

  const { error } = await adminClient.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
