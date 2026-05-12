import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export interface ScraperHealthRow {
  id: string;
  source: string;
  query: string;
  result_count: number;
  duration_ms: number | null;
  error: string | null;
  created_at: string;
}

export interface ScraperAlert {
  source: string;
  consecutive_zeros: number;
}

export interface ScraperHealthResponse {
  rows: ScraperHealthRow[];
  alerts: ScraperAlert[];
}

/**
 * GET /api/admin/scraper-health
 * Returns the last 24 h of scraper_health rows plus an alerts array
 * listing any source that has 3+ consecutive zero-result runs.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { adminSupabase, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: rows, error } = await adminSupabase
    .from("scraper_health")
    .select("id, source, query, result_count, duration_ms, error, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load scraper health data" }, { status: 500 });
  }

  // Compute alert status: check last 3 rows per source (regardless of time window)
  const sources = ["jobbank", "adzuna"];
  const alerts: ScraperAlert[] = [];

  for (const source of sources) {
    const { data: recent } = await adminSupabase
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

  return NextResponse.json({ rows: rows ?? [], alerts } satisfies ScraperHealthResponse);
}
