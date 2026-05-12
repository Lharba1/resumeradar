import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabase-server";
import type { ScraperHealthRow, ScraperAlert } from "@/app/api/admin/scraper-health/route";

async function fetchScraperHealth(): Promise<{ rows: ScraperHealthRow[]; alerts: ScraperAlert[] }> {
  const supabase = createServiceRoleClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: rows } = await supabase
    .from("scraper_health")
    .select("id, source, query, result_count, duration_ms, error, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  const sources = ["jobbank", "adzuna"];
  const alerts: ScraperAlert[] = [];

  for (const source of sources) {
    const { data: recent } = await supabase
      .from("scraper_health")
      .select("result_count")
      .eq("source", source)
      .order("created_at", { ascending: false })
      .limit(3);

    const recentRows = recent ?? [];
    if (
      recentRows.length >= 3 &&
      recentRows.every((r: { result_count: number }) => r.result_count === 0)
    ) {
      alerts.push({ source, consecutive_zeros: 3 });
    }
  }

  return { rows: rows ?? [], alerts };
}

export default async function AdminOverviewPage() {
  const supabase = createServiceRoleClient();
  const today    = new Date().toISOString().split("T")[0];

  const [{ data: users }, { data: subs }, { data: usage }, scraperHealth] = await Promise.all([
    supabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from("user_subscriptions").select("plan_id"),
    supabase.from("usage_quotas").select("count").gte("day", today),
    fetchScraperHealth(),
  ]);

  const totalUsers   = users?.users?.length ?? 0;
  const planCounts   = (subs ?? []).reduce<Record<string, number>>((acc, s) => { acc[s.plan_id] = (acc[s.plan_id] ?? 0) + 1; return acc; }, {});
  const todayCalls   = (usage ?? []).reduce((sum, u) => sum + (u.count ?? 0), 0);

  const stats = [
    { label: "Total Users",      value: totalUsers,                 color: "text-[#006EDC]" },
    { label: "Free Plan",        value: planCounts["free"]       ?? 0, color: "text-[#77838F]" },
    { label: "Pro Plan",         value: planCounts["pro"]        ?? 0, color: "text-emerald-600" },
    { label: "Enterprise",       value: planCounts["enterprise"] ?? 0, color: "text-purple-600" },
    { label: "API Calls Today",  value: todayCalls,                 color: "text-amber-600" },
  ];

  const { rows: healthRows, alerts } = scraperHealth;
  const hasAlerts = alerts.length > 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#131f2f]">Admin Overview</h1>
        <p className="mt-1 text-sm text-[#77838F]">Platform health at a glance.</p>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center">
            <div className={`text-3xl font-black ${s.color}`}>{s.value.toLocaleString()}</div>
            <div className="mt-1 text-xs font-medium text-[#77838F]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <Link href="/admin/product" className="inline-flex items-center gap-2 rounded-xl border border-[#006EDC] bg-[#E6F2FD] px-4 py-2 text-sm font-semibold text-[#006EDC] hover:bg-[#d0e8fb]">
          📋 Product status &amp; roadmap →
        </Link>
      </div>

      {/* Scraper Health */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#131f2f]">Scraper Health — last 24 h</h2>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${hasAlerts ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${hasAlerts ? "bg-red-500" : "bg-emerald-500"}`} />
            {hasAlerts ? `${alerts.length} alert${alerts.length > 1 ? "s" : ""}` : "All healthy"}
          </span>
        </div>

        {hasAlerts && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            {alerts.map((a) => (
              <p key={a.source} className="text-sm font-medium text-red-700">
                ⚠ <span className="font-bold capitalize">{a.source}</span> has returned 0 results for 3 consecutive runs.
              </p>
            ))}
          </div>
        )}

        {healthRows.length === 0 ? (
          <p className="text-sm text-[#77838F]">No health check data yet. Checks run every 6 hours via pg_cron.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-left text-[#77838F]">
                  <th className="pb-2 pr-4 font-medium">Time</th>
                  <th className="pb-2 pr-4 font-medium">Source</th>
                  <th className="pb-2 pr-4 font-medium text-right">Results</th>
                  <th className="pb-2 pr-4 font-medium text-right">Duration</th>
                  <th className="pb-2 font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {healthRows.map((row) => {
                  const isZero = row.result_count === 0;
                  return (
                    <tr key={row.id} className={`border-b border-[#F5F7FA] ${isZero ? "bg-red-50" : ""}`}>
                      <td className="py-2 pr-4 text-[#77838F] whitespace-nowrap">
                        {new Date(row.created_at).toLocaleString("en-CA", {
                          month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2 pr-4 font-medium capitalize text-[#3B4959]">{row.source}</td>
                      <td className={`py-2 pr-4 text-right font-mono font-semibold ${isZero ? "text-red-600" : "text-emerald-600"}`}>
                        {row.result_count}
                      </td>
                      <td className="py-2 pr-4 text-right text-[#77838F] font-mono">
                        {row.duration_ms != null ? `${row.duration_ms} ms` : "—"}
                      </td>
                      <td className="py-2 text-red-500 max-w-xs truncate">
                        {row.error ?? ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-[#131f2f]">Plan Distribution</h2>
        {Object.entries(planCounts).length === 0 ? (
          <p className="text-sm text-[#77838F]">No subscription data yet.</p>
        ) : (
          <div className="space-y-3">
            {["free", "pro", "enterprise"].map((plan) => {
              const count = planCounts[plan] ?? 0;
              const pct   = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
              const color = plan === "free" ? "bg-[#E2E8F0]" : plan === "pro" ? "bg-emerald-400" : "bg-purple-400";
              return (
                <div key={plan} className="flex items-center gap-3">
                  <span className="w-20 text-xs font-medium capitalize text-[#3B4959]">{plan}</span>
                  <div className="flex-1 h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-12 text-right text-xs text-[#77838F]">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
