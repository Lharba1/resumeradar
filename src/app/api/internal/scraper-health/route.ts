import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { scrapeJobBank } from "@/lib/jobbank";
import { fetchAdzuna } from "@/lib/adzuna";

export const runtime = "nodejs";
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET;
const HEALTH_QUERY = "software developer Toronto";

interface ProbeResult {
  source: string;
  result_count: number;
  duration_ms: number;
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.headers.get("x-cron-secret");
  if (!CRON_SECRET || secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const results: ProbeResult[] = [];

  // Probe JobBank
  {
    const start = Date.now();
    try {
      const jobs = await scrapeJobBank(HEALTH_QUERY, false, 5);
      results.push({ source: "jobbank", result_count: jobs.length, duration_ms: Date.now() - start });
    } catch (err) {
      results.push({
        source: "jobbank",
        result_count: 0,
        duration_ms: Date.now() - start,
        error: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  // Probe Adzuna
  {
    const start = Date.now();
    try {
      const jobs = await fetchAdzuna(HEALTH_QUERY, false, 5);
      results.push({ source: "adzuna", result_count: jobs.length, duration_ms: Date.now() - start });
    } catch (err) {
      results.push({
        source: "adzuna",
        result_count: 0,
        duration_ms: Date.now() - start,
        error: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  // Persist probe results
  await supabase.from("scraper_health").insert(
    results.map((r) => ({
      source: r.source,
      query: HEALTH_QUERY,
      result_count: r.result_count,
      duration_ms: r.duration_ms,
      error: r.error ?? null,
    }))
  );

  // Alert logic: if a source just returned 0, check if the last 3 runs are all zeros
  for (const result of results) {
    if (result.result_count === 0) {
      const { data: recent } = await supabase
        .from("scraper_health")
        .select("result_count")
        .eq("source", result.source)
        .order("created_at", { ascending: false })
        .limit(3);

      const rows = recent ?? [];
      const allZero = rows.length >= 3 && rows.every((r) => r.result_count === 0);

      if (allZero) {
        // Non-fatal: alert logging should never break the health check response
      supabase
        .from("admin_actions")
        .insert({
          action: "scraper_alert",
          payload: {
            source: result.source,
            consecutive_zeros: 3,
            alert: `${result.source} scraper has returned 0 results for 3 consecutive runs`,
          },
        })
        .then(() => {}, () => {});
      }
    }
  }

  return NextResponse.json({ ok: true, results });
}
