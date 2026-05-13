import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getStripe, PLAN_FROM_PRICE } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET() {
  const { adminSupabase, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;

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
      adminSupabase.from("user_subscriptions").select("plan_id"),
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
  const { user, adminSupabase, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;

  let body: { email: string; plan_id: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { email, plan_id } = body;
  if (!email?.trim()) return NextResponse.json({ error: "email is required" }, { status: 400 });
  if (!["free", "starter", "pro", "enterprise"].includes(plan_id)) {
    return NextResponse.json({ error: "Invalid plan_id" }, { status: 400 });
  }

  const { data: { users } } = await adminSupabase.auth.admin.listUsers({ perPage: 1000 });
  const target = users.find((u) => u.email === email.trim().toLowerCase());
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await adminSupabase.from("user_subscriptions").upsert(
    { user_id: target.id, plan_id, status: "active" },
    { onConflict: "user_id" },
  );

  void adminSupabase.from("admin_actions").insert({
    action:  "manual_plan_override",
    details: { target_email: email, plan_id, overridden_by: user!.id },
  });

  return NextResponse.json({ ok: true, user_id: target.id, plan_id });
}
