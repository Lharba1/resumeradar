import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";

export const runtime = "nodejs";

export async function GET() {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const today = new Date().toISOString().split("T")[0];

  const [{ data: sub }, { data: planLimits }, { data: usage }, { data: overrides }] = await Promise.all([
    supabase.from("user_subscriptions").select("plan_id, status, trial_end, current_period_end, cancel_at_period_end").eq("user_id", user.id).maybeSingle(),
    supabase.from("plan_limits").select("route, daily_limit"),
    supabase.from("usage_quotas").select("route, count").eq("user_id", user.id).gte("day", today),
    supabase.from("user_limit_overrides").select("route, daily_limit").eq("user_id", user.id),
  ]);

  const planId = sub?.plan_id ?? "free";
  const overrideMap = Object.fromEntries((overrides ?? []).map((o) => [o.route, o.daily_limit]));
  const planLimitMap = Object.fromEntries((planLimits ?? []).filter((l) => l.route.startsWith("/api")).map((l) => [`${planId}:${l.route}`, l.daily_limit]));
  const usageMap = Object.fromEntries((usage ?? []).map((u) => [u.route, u.count]));

  const ROUTES = [
    "/api/cv/parse", "/api/cv/generate", "/api/cv/optimize",
    "/api/cover-letter", "/api/jobs/fetch", "/api/jobs/score",
    "/api/interview-prep/questions", "/api/interview-prep/feedback",
  ];

  const routeUsage = ROUTES.map((route) => {
    const limit = overrideMap[route] ?? planLimitMap[`${planId}:${route}`] ?? 10;
    const used  = usageMap[route] ?? 0;
    return { route, limit, used, source: overrideMap[route] ? "override" : "plan" };
  });

  return NextResponse.json({
    plan_id:              planId,
    plan_status:          sub?.status ?? "active",
    trial_end:            sub?.trial_end ?? null,
    current_period_end:   sub?.current_period_end ?? null,
    cancel_at_period_end: sub?.cancel_at_period_end ?? false,
    routes: routeUsage,
  });
}
