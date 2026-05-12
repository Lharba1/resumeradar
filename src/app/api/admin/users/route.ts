import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { adminSupabase, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;

  const { searchParams } = new URL(req.url);
  const q    = searchParams.get("q") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = 20;

  // When searching, fetch a wider set and filter; otherwise paginate normally
  const { data: authData, error: authErr } = await adminSupabase.auth.admin.listUsers(
    q ? { page: 1, perPage: 1000 } : { page, perPage },
  );
  if (authErr) return NextResponse.json({ error: "Failed to list users" }, { status: 500 });

  const allUsers = q
    ? authData.users.filter((u) => u.email?.toLowerCase().includes(q.toLowerCase()))
    : authData.users;

  const total = q ? allUsers.length : (authData.total ?? authData.users.length);
  const users = q ? allUsers.slice((page - 1) * perPage, page * perPage) : allUsers;

  const userIds = users.map((u) => u.id);

  // Fetch subscriptions + status for these users
  const [{ data: subs }, { data: statuses }, { data: usages }] = await Promise.all([
    adminSupabase.from("user_subscriptions").select("user_id, plan_id, status, current_period_end, stripe_subscription_id").in("user_id", userIds),
    adminSupabase.from("user_status").select("user_id, status, suspended_reason").in("user_id", userIds),
    adminSupabase.from("usage_quotas").select("user_id, route, count").in("user_id", userIds).gte("day", new Date().toISOString().split("T")[0]),
  ]);

  const subMap    = Object.fromEntries((subs    ?? []).map((s) => [s.user_id, s]));
  const statusMap = Object.fromEntries((statuses ?? []).map((s) => [s.user_id, s]));
  const usageMap  = (usages ?? []).reduce<Record<string, number>>((acc, u) => {
    acc[u.user_id] = (acc[u.user_id] ?? 0) + u.count;
    return acc;
  }, {});

  const enriched = users.map((u) => ({
    id:            u.id,
    email:         u.email,
    created_at:    u.created_at,
    last_sign_in:  u.last_sign_in_at,
    plan:          subMap[u.id]?.plan_id ?? "free",
    sub_status:    subMap[u.id]?.status  ?? "active",
    suspended:     statusMap[u.id]?.status === "suspended",
    today_calls:   usageMap[u.id] ?? 0,
    stripe_sub_id: subMap[u.id]?.stripe_subscription_id ?? null,
  }));

  return NextResponse.json({
    users: enriched,
    total,
    page,
    per_page: perPage,
  });
}
