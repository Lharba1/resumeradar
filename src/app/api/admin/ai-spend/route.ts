import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

const FLAG_THRESHOLD: Record<string, number> = { free: 300, starter: 600 }; // $3 free, $6 starter

export async function GET(req: NextRequest) {
  const { adminSupabase, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;

  const { searchParams } = new URL(req.url);
  const monthParam = searchParams.get("month"); // e.g. "2026-05"
  const month      = monthParam ? `${monthParam}-01` : new Date().toISOString().slice(0, 7) + "-01";

  // ── All spend rows for the month ──────────────────────────────────────────
  const { data: spendRows, error } = await adminSupabase
    .from("user_ai_spend")
    .select("user_id, feature, call_count, estimated_cost_cents")
    .eq("month", month);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = spendRows ?? [];

  // ── Feature breakdown ────────────────────────────────────────────────────
  const featureMap: Record<string, { calls: number; cost: number }> = {};
  for (const r of rows) {
    if (!featureMap[r.feature]) featureMap[r.feature] = { calls: 0, cost: 0 };
    featureMap[r.feature].calls += r.call_count;
    featureMap[r.feature].cost  += Number(r.estimated_cost_cents);
  }
  const by_feature = Object.entries(featureMap)
    .map(([feature, v]) => ({ feature, calls: v.calls, cost: v.cost }))
    .sort((a, b) => b.cost - a.cost);

  // ── Per-user totals ───────────────────────────────────────────────────────
  const userMap: Record<string, { calls: number; cost: number }> = {};
  for (const r of rows) {
    if (!userMap[r.user_id]) userMap[r.user_id] = { calls: 0, cost: 0 };
    userMap[r.user_id].calls += r.call_count;
    userMap[r.user_id].cost  += Number(r.estimated_cost_cents);
  }

  const topUserIds = Object.entries(userMap)
    .sort((a, b) => b[1].cost - a[1].cost)
    .slice(0, 20)
    .map(([id]) => id);

  // ── Fetch emails and plans for top users ──────────────────────────────────
  const [{ data: { users: authUsers } }, { data: subs }] = await Promise.all([
    adminSupabase.auth.admin.listUsers({ perPage: 1000 }),
    adminSupabase.from("user_subscriptions").select("user_id, plan_id").in("user_id", topUserIds),
  ]);

  const emailMap = Object.fromEntries((authUsers ?? []).map((u) => [u.id, u.email ?? ""]));
  const planMap  = Object.fromEntries((subs ?? []).map((s) => [s.user_id, s.plan_id]));

  const top_users = topUserIds.map((uid) => {
    const plan_id = planMap[uid] ?? "free";
    const cost    = userMap[uid].cost;
    return {
      user_id: uid,
      email:   emailMap[uid] ?? "unknown",
      plan_id,
      calls:   userMap[uid].calls,
      cost,
      flagged: cost >= (FLAG_THRESHOLD[plan_id] ?? Infinity),
    };
  });

  const total_cost  = rows.reduce((s, r) => s + Number(r.estimated_cost_cents), 0);
  const total_calls = rows.reduce((s, r) => s + r.call_count, 0);
  const flagged_count = top_users.filter((u) => u.flagged).length;

  return NextResponse.json({ total_cost, total_calls, top_users, by_feature, flagged_count });
}
