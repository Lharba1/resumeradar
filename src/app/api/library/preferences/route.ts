import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";

export const runtime = "nodejs";

export async function GET() {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { data } = await supabase
    .from("user_status")
    .select("library_save_enabled")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({ library_save_enabled: data?.library_save_enabled ?? true });
}

export async function PATCH(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  let body: { library_save_enabled: boolean };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (typeof body.library_save_enabled !== "boolean") {
    return NextResponse.json({ error: "library_save_enabled must be a boolean" }, { status: 400 });
  }

  await supabase
    .from("user_status")
    .upsert({ user_id: user.id, library_save_enabled: body.library_save_enabled, updated_at: new Date().toISOString() }, { onConflict: "user_id" });

  return NextResponse.json({ ok: true });
}
