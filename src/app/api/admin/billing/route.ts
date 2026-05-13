import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";
import { getStripe, PLAN_FROM_PRICE } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET() {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const supabase = createServiceRoleClient();
  const { data: profile } = await supabase
    .from("user_subscriptions")
    .select("plan_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profile?.plan_id !== "enterprise") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ configured: false });
  }

  try {
    const stripe = getStripe();
    const isLive = process.env.STRIPE_SECRET_KEY.startsWith("sk_live_");

    const [activeSubs, trialSubs, events, dbSubsRes] = await Promise.all([
      stripe.subscriptions.list({ status: "active",   limit: 100 }),
      stripe.subscriptions.list({ status: "trialing", limit: 100 }),
      stripe.events.list({ limit: 15 }),
      supabase.from("user_subscriptions").select("plan_id"),
    ]);

    let mrr = 0;
    for (const sub of activeSubs.data) {
      mrr += (sub.items.data[0]?.price?.unit_amount ?? 0) / 100;
    }

    const dbCounts: Record<string, number> = {};
    for (const s of dbSubsRes.data ?? []) {
      dbCounts[s.plan_id] = (dbCounts[s.plan_id] ?? 0) + 1;
    }

    const recentEvents = events.data.map((e) => {
      const obj = e.data.object as { items?: { data?: { price?: { id?: string } }[] } } | null;
      const priceId = obj?.items?.data?.[0]?.price?.id ?? "";
      return {
        id:      e.id,
        type:    e.type,
        created: e.created,
        plan:    PLAN_FROM_PRICE[priceId] ?? null,
      };
    });

    return NextResponse.json({
      configured:  true,
      mode:        isLive ? "live" : "test",
      mrr:         Math.round(mrr),
      trialing:    trialSubs.data.length,
      activePaid:  activeSubs.data.length,
      planCounts:  dbCounts,
      recentEvents,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export async function POST(req: Request) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const supabase = createServiceRoleClient();
  const { data: profile } = await supabase
    .from("user_subscriptions")
    .select("plan_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profile?.plan_id !== "enterprise") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { email: string; plan_id: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { email, plan_id } = body;
  if (!email?.trim()) return NextResponse.json({ error: "email is required" }, { status: 400 });
  if (!["free", "starter", "pro", "enterprise"].includes(plan_id)) {
    return NextResponse.json({ error: "Invalid plan_id" }, { status: 400 });
  }

  const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const target = users.find((u) => u.email === email.trim().toLowerCase());
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await supabase.from("user_subscriptions").upsert(
    { user_id: target.id, plan_id, status: "active" },
    { onConflict: "user_id" },
  );

  void supabase.from("admin_actions").insert({
    action:  "manual_plan_override",
    details: { target_email: email, plan_id, overridden_by: user.id },
  });

  return NextResponse.json({ ok: true, user_id: target.id, plan_id });
}
