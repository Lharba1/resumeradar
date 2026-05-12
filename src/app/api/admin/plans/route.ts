import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET() {
  const { adminSupabase, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;

  const [{ data: plans }, { data: limits }, { data: subs }] = await Promise.all([
    adminSupabase.from("plans").select("*").order("sort_order"),
    adminSupabase.from("plan_limits").select("*").order("plan_id"),
    adminSupabase.from("user_subscriptions").select("plan_id"),
  ]);

  const subscriberCounts = (subs ?? []).reduce<Record<string, number>>((acc, s) => {
    acc[s.plan_id] = (acc[s.plan_id] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({ plans: plans ?? [], limits: limits ?? [], subscriberCounts });
}

// PATCH — update a single plan_limit cell (existing behaviour)
export async function PATCH(req: NextRequest) {
  const { adminSupabase, user: admin, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;

  let body: { plan_id: string; route: string; daily_limit: number };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { plan_id, route, daily_limit } = body;
  if (!plan_id || !route || daily_limit == null)
    return NextResponse.json({ error: "plan_id, route, and daily_limit are required" }, { status: 400 });

  const { error } = await adminSupabase
    .from("plan_limits")
    .upsert({ plan_id, route, daily_limit }, { onConflict: "plan_id,route" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await adminSupabase.from("admin_actions").insert({
    admin_id: admin!.id,
    action: "update_plan_limit",
    payload: { plan_id, route, daily_limit },
  });

  return NextResponse.json({ ok: true });
}

// POST — create plan OR add a new route row across all plans
export async function POST(req: NextRequest) {
  const { adminSupabase, user: admin, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;

  let body: {
    action: "create_plan" | "add_route";
    // create_plan
    id?: string;
    name?: string;
    price_cents?: number;
    description?: string;
    // add_route
    route?: string;
    limits?: Record<string, number>;
  };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (body.action === "create_plan") {
    const { id, name, price_cents = 0, description = "" } = body;
    if (!id || !name)
      return NextResponse.json({ error: "id and name are required" }, { status: 400 });
    if (!/^[a-z0-9-]+$/.test(id))
      return NextResponse.json({ error: "id must be lowercase alphanumeric with dashes only" }, { status: 400 });

    // Get max sort_order
    const { data: existing } = await adminSupabase.from("plans").select("sort_order").order("sort_order", { ascending: false }).limit(1);
    const nextOrder = ((existing?.[0]?.sort_order ?? 0) as number) + 1;

    const { error } = await adminSupabase.from("plans").insert({
      id, name, description, price_cents, is_active: true, sort_order: nextOrder,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await adminSupabase.from("admin_actions").insert({
      admin_id: admin!.id, action: "create_plan", payload: { id, name, price_cents },
    });

    return NextResponse.json({ ok: true });
  }

  if (body.action === "add_route") {
    const { route, limits = {} } = body;
    if (!route?.startsWith("/api/"))
      return NextResponse.json({ error: "route must start with /api/" }, { status: 400 });

    // Get all plan IDs
    const { data: plans } = await adminSupabase.from("plans").select("id");
    const inserts = (plans ?? []).map((p: { id: string }) => ({
      plan_id: p.id,
      route,
      daily_limit: limits[p.id] ?? 10,
    }));

    const { error } = await adminSupabase
      .from("plan_limits")
      .upsert(inserts, { onConflict: "plan_id,route" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await adminSupabase.from("admin_actions").insert({
      admin_id: admin!.id, action: "add_route", payload: { route, limits },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// PUT — update plan metadata (name, price, description)
export async function PUT(req: NextRequest) {
  const { adminSupabase, user: admin, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;

  let body: { id: string; name?: string; price_cents?: number; description?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const allowed: Record<string, unknown> = {};
  if (updates.name !== undefined) allowed.name = updates.name;
  if (updates.price_cents !== undefined) allowed.price_cents = updates.price_cents;
  if (updates.description !== undefined) allowed.description = updates.description;

  if (!Object.keys(allowed).length)
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });

  const { error } = await adminSupabase.from("plans").update(allowed).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await adminSupabase.from("admin_actions").insert({
    admin_id: admin!.id, action: "update_plan_meta", payload: { id, ...allowed },
  });

  return NextResponse.json({ ok: true });
}

// DELETE — delete a plan (blocked if active subscribers) OR remove a route from all plans
export async function DELETE(req: NextRequest) {
  const { adminSupabase, user: admin, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;

  const { searchParams } = new URL(req.url);
  const planId = searchParams.get("plan_id");
  const route  = searchParams.get("route");

  if (planId) {
    // Guard: block delete if there are subscribers
    const { count } = await adminSupabase
      .from("user_subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("plan_id", planId);

    if ((count ?? 0) > 0)
      return NextResponse.json(
        { error: `Cannot delete: ${count} active subscriber(s) on this plan. Migrate them first.` },
        { status: 409 },
      );

    const { error } = await adminSupabase.from("plans").delete().eq("id", planId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await adminSupabase.from("admin_actions").insert({
      admin_id: admin!.id, action: "delete_plan", payload: { plan_id: planId },
    });

    return NextResponse.json({ ok: true });
  }

  if (route) {
    const { error } = await adminSupabase.from("plan_limits").delete().eq("route", route);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await adminSupabase.from("admin_actions").insert({
      admin_id: admin!.id, action: "delete_route", payload: { route },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "plan_id or route query param required" }, { status: 400 });
}
