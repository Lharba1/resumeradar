import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";
import { checkAndIncrement } from "@/lib/rate-limit";

export async function GET() {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { data, error } = await supabase
    .from("tracker")
    .select("*, job:jobs(*)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const limit = await checkAndIncrement(user.id, "/api/tracker", supabase);
  if (!limit.allowed) return NextResponse.json({ error: "Daily limit reached" }, { status: 429 });

  let body: { job_id: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.job_id) return NextResponse.json({ error: "job_id required" }, { status: 400 });

  const { data: existing } = await supabase
    .from("tracker").select("id").eq("job_id", body.job_id).eq("user_id", user.id).single();
  if (existing) return NextResponse.json({ error: "Job already in tracker" }, { status: 409 });

  const { data, error } = await supabase
    .from("tracker")
    .insert({ job_id: body.job_id, status: "saved", user_id: user.id })
    .select("*, job:jobs(*)")
    .single();

  if (error) return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase
    .from("tracker")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  return NextResponse.json({ deleted: true });
}

const VALID_STATUSES = ["saved", "applied", "screening", "interview", "offer", "rejected"] as const;
type TrackerStatus = typeof VALID_STATUSES[number];

export async function PATCH(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  let body: { id: string; status?: string; notes?: string; applied_at?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { id } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  if (body.status !== undefined && !VALID_STATUSES.includes(body.status as TrackerStatus)) {
    return NextResponse.json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  // Explicit allowlist — never spread the whole body into an update
  const updates: Record<string, unknown> = {};
  if (body.status !== undefined) updates.status = body.status;
  if (body.notes !== undefined) updates.notes = body.notes;
  if (body.applied_at !== undefined) {
    const parsed = new Date(body.applied_at);
    if (isNaN(parsed.getTime())) return NextResponse.json({ error: "applied_at must be a valid ISO date" }, { status: 400 });
    updates.applied_at = parsed.toISOString();
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tracker")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*, job:jobs(*)")
    .single();

  if (error) return NextResponse.json({ error: "Failed to update tracker entry" }, { status: 500 });
  return NextResponse.json(data);
}
