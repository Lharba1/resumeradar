import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";

export async function GET() {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const [cvRes, jobsRes, trackerRes, libraryRes] = await Promise.all([
    supabase.from("cv_profiles").select("*").eq("user_id", user.id),
    supabase.from("jobs").select("*").eq("user_id", user.id),
    supabase.from("tracker").select("*").eq("user_id", user.id),
    supabase.from("library_cvs").select("*").eq("user_id", user.id),
  ]);

  return NextResponse.json({
    exported_at: new Date().toISOString(),
    user_id: user.id,
    cv_profiles: cvRes.data ?? [],
    jobs: jobsRes.data ?? [],
    tracker: trackerRes.data ?? [],
    library_cvs: libraryRes.data ?? [],
  });
}
