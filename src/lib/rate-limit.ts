import type { SupabaseClient } from "@supabase/supabase-js";
import { getUserContext } from "./plans";

interface LimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  reason?: "rate_limited" | "suspended";
}

export async function checkAndIncrement(
  userId: string,
  route: string,
  supabase: SupabaseClient,
): Promise<LimitResult> {
  if (process.env.NODE_ENV === "development") {
    return { allowed: true, remaining: 999, resetAt: nextMidnightUTC() };
  }

  // Single RPC resolves: effective limit + suspension status
  const ctx = await getUserContext(userId, route, supabase);

  if (ctx.is_suspended) {
    return { allowed: false, remaining: 0, resetAt: nextMidnightUTC(), reason: "suspended" };
  }

  const { data, error } = await supabase.rpc("increment_usage", {
    p_user_id: userId,
    p_route: route,
    p_limit: ctx.effective_limit,
  });

  if (error) {
    console.error("Rate limit check failed:", error.message);
    // Fail closed — do not grant access when the rate limit store is unreachable.
    // A suspended account must never bypass suspension due to a DB error.
    return { allowed: false, remaining: 0, resetAt: nextMidnightUTC(), reason: "rate_limited" };
  }

  const row = Array.isArray(data) ? data[0] : data;
  const count: number = row?.current_count ?? 1;
  const allowed: boolean = row?.allowed ?? true;

  return {
    allowed,
    remaining: Math.max(0, ctx.effective_limit - count),
    resetAt: nextMidnightUTC(),
    reason: allowed ? undefined : "rate_limited",
  };
}

function nextMidnightUTC(): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
