import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";

export const runtime = "nodejs";

const PLAN_CAPS: Record<string, number> = { free: 10, starter: 25, pro: 50, enterprise: 200 };

export async function GET(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = 20;
  const from  = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from("library_cvs")
    .select("id, job_title, company, job_description_snippet, ats_score_before, ats_score_after, validation_warnings, expires_at, created_at", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (error) return NextResponse.json({ error: "Internal server error" }, { status: 500 });

  return NextResponse.json({ items: data ?? [], total: count ?? 0, page, limit });
}

export async function DELETE() {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { error } = await supabase
    .from("library_cvs")
    .delete()
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  // Check save toggle
  const { data: statusRow } = await supabase
    .from("user_status")
    .select("library_save_enabled")
    .eq("user_id", user.id)
    .maybeSingle();

  if (statusRow?.library_save_enabled === false) {
    return NextResponse.json({ saved: false, reason: "library_disabled" });
  }

  // Get plan for cap + expiry
  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("plan_id")
    .eq("user_id", user.id)
    .maybeSingle();
  const planId = sub?.plan_id ?? "free";
  const cap    = PLAN_CAPS[planId] ?? PLAN_CAPS.free;

  // Check current count
  const { count } = await supabase
    .from("library_cvs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= cap) {
    return NextResponse.json({ saved: false, reason: "cap_reached", cap });
  }

  const expiryDays = planId === "free" ? 90 : planId === "starter" ? 180 : 365;
  const expiresAt  = new Date(Date.now() + expiryDays * 86_400_000).toISOString();

  let body: {
    source_cv_id?: string;
    job_title?: string;
    company?: string;
    job_description_snippet?: string;
    cv_data: object;
    ats_score_before?: number;
    ats_score_after?: number;
    validation_warnings?: string[];
  };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { data: row, error } = await supabase
    .from("library_cvs")
    .insert({
      user_id:                  user.id,
      source_cv_id:             body.source_cv_id ?? null,
      job_title:                body.job_title ?? null,
      company:                  body.company ?? null,
      job_description_snippet:  body.job_description_snippet ?? null,
      cv_data:                  body.cv_data,
      ats_score_before:         body.ats_score_before ?? null,
      ats_score_after:          body.ats_score_after ?? null,
      validation_warnings:      body.validation_warnings ?? [],
      expires_at:               expiresAt,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: "Internal server error" }, { status: 500 });

  return NextResponse.json({ saved: true, id: row.id, expires_at: expiresAt });
}
