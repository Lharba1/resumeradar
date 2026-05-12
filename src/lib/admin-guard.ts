import { NextResponse } from "next/server";
import { createServiceRoleClient } from "./supabase-server";
import { requireUser } from "./auth-guard";
import type { SupabaseClient, User } from "@supabase/supabase-js";

type AdminGuardResult =
  | { user: User; adminSupabase: SupabaseClient; forbidden: null }
  | { user: null; adminSupabase: null; forbidden: NextResponse };

export async function requireAdmin(): Promise<AdminGuardResult> {
  const { user, unauthorized } = await requireUser();
  if (unauthorized || !user) {
    return {
      user: null,
      adminSupabase: null,
      forbidden: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  // Service role bypasses RLS — required to query admins table server-side
  // IMPORTANT: only import createServiceRoleClient in server-only files (API routes, server components)
  const adminSupabase = createServiceRoleClient();

  const { data } = await adminSupabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) {
    return {
      user: null,
      adminSupabase: null,
      forbidden: NextResponse.json({ error: "Forbidden — admin access only" }, { status: 403 }),
    };
  }

  return { user, adminSupabase, forbidden: null };
}
