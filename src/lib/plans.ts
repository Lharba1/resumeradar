import type { SupabaseClient } from "@supabase/supabase-js";

export interface UserContext {
  effective_limit: number;
  plan_id: string;
  limit_source: "override" | "plan" | "default";
  is_suspended: boolean;
}

const DEFAULT_LIMIT = 10;

export async function getUserContext(
  userId: string,
  route: string,
  supabase: SupabaseClient,
): Promise<UserContext> {
  // Single query via RPC — resolves limit + suspension in one round-trip
  const { data, error } = await supabase.rpc("get_user_context", {
    p_user_id: userId,
    p_route: route,
  });

  if (error || !data?.[0]) {
    // Fail closed — on DB error, block the request rather than granting access.
    // A suspended user must never bypass suspension due to a transient DB failure.
    console.error("get_user_context failed:", error?.message);
    return { effective_limit: 0, plan_id: "free", limit_source: "default", is_suspended: true };
  }

  const row = data[0] as UserContext;
  return row;
}
