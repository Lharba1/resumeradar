import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "./supabase-server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

type GuardResult =
  | { user: User; supabase: SupabaseClient; unauthorized: null }
  | { user: null; supabase: SupabaseClient; unauthorized: NextResponse };

export async function requireUser(): Promise<GuardResult> {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      supabase,
      unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!user.email_confirmed_at) {
    return {
      user: null,
      supabase,
      unauthorized: NextResponse.json(
        { error: "Please verify your email before using this feature.", code: "EMAIL_NOT_VERIFIED" },
        { status: 403 },
      ),
    };
  }

  return { user, supabase, unauthorized: null };
}
