import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { adminSupabase, user: admin, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

  const [
    { data: authUser, error: authErr },
    { data: sub },
    { data: status },
    { data: overrides },
    { data: usage },
  ] = await Promise.all([
    adminSupabase.auth.admin.getUserById(id),
    adminSupabase.from("user_subscriptions").select("*").eq("user_id", id).maybeSingle(),
    adminSupabase.from("user_status").select("*").eq("user_id", id).maybeSingle(),
    adminSupabase.from("user_limit_overrides").select("*").eq("user_id", id),
    adminSupabase.from("usage_quotas").select("route, count, day").eq("user_id", id).order("day", { ascending: false }).limit(100),
  ]);

  if (authErr || !authUser.user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    user:      authUser.user,
    sub:       sub ?? { plan_id: "free", status: "active" },
    status:    status ?? { status: "active" },
    overrides: overrides ?? [],
    usage:     usage ?? [],
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { adminSupabase, user: admin, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

  let body: {
    plan_id?: string;
    suspended?: boolean;
    suspended_reason?: string;
    override?: { route: string; daily_limit: number | null };
  };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const auditPayload: Record<string, unknown> = {};

  const VALID_PLANS = ["free", "starter", "pro", "enterprise"] as const;
  if (body.plan_id !== undefined) {
    if (!VALID_PLANS.includes(body.plan_id as typeof VALID_PLANS[number]))
      return NextResponse.json({ error: `plan_id must be one of: ${VALID_PLANS.join(", ")}` }, { status: 400 });
    auditPayload.plan_id = body.plan_id;
    await adminSupabase
      .from("user_subscriptions")
      .upsert({ user_id: id, plan_id: body.plan_id, status: "active", updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  }

  if (body.suspended !== undefined) {
    auditPayload.suspended = body.suspended;
    const newStatus = body.suspended ? "suspended" : "active";
    await adminSupabase
      .from("user_status")
      .upsert({ user_id: id, status: newStatus, suspended_reason: body.suspended_reason ?? null, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  }

  if (body.override !== undefined) {
    const { route, daily_limit } = body.override;
    if (!route.startsWith("/api/") || route.length > 100) {
      return NextResponse.json({ error: "override.route must start with /api/ and be ≤ 100 characters" }, { status: 400 });
    }
    if (daily_limit !== null && (!Number.isInteger(daily_limit) || daily_limit < 0 || daily_limit > 10_000)) {
      return NextResponse.json({ error: "override.daily_limit must be a positive integer ≤ 10,000 or null to remove" }, { status: 400 });
    }
    auditPayload.override = body.override;
    if (daily_limit === null) {
      await adminSupabase.from("user_limit_overrides").delete().eq("user_id", id).eq("route", route);
    } else {
      await adminSupabase
        .from("user_limit_overrides")
        .upsert({ user_id: id, route, daily_limit, created_by: admin!.id }, { onConflict: "user_id,route" });
    }
  }

  // Audit log
  await adminSupabase.from("admin_actions").insert({
    admin_id: admin!.id,
    action: "update_user",
    target_user_id: id,
    payload: auditPayload,
  });

  return NextResponse.json({ ok: true });
}
