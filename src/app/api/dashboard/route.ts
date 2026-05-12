import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";
import type { TrackerEntry } from "@/lib/types";

export async function GET() {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const [{ data: tracker, error }, { data: allJobs }] = await Promise.all([
    supabase.from("tracker").select("*, job:jobs(*)").eq("user_id", user.id),
    supabase.from("jobs").select("job_title, ats_score, relocation_score, visa_sponsorship_likelihood, decision, country").eq("user_id", user.id),
  ]);

  if (error) return NextResponse.json({ error: "Internal server error" }, { status: 500 });

  const entries = (tracker ?? []) as TrackerEntry[];
  const jobs    = allJobs ?? [];

  const total     = entries.length;
  const applied   = entries.filter((e) => e.status !== "saved").length;
  const responded = entries.filter((e) => ["screening", "interview", "offer"].includes(e.status)).length;

  const scoredJobs = jobs.filter((j) => j.ats_score != null);
  const avgAts        = scoredJobs.length > 0 ? Math.round(scoredJobs.reduce((s, j) => s + j.ats_score!, 0) / scoredJobs.length) : null;
  const avgRelocation = scoredJobs.length > 0 ? Math.round(scoredJobs.reduce((s, j) => s + (j.relocation_score ?? 0), 0) / scoredJobs.length) : null;

  const visaDist = { high: 0, medium: 0, low: 0 };
  for (const j of jobs) {
    const lvl = j.visa_sponsorship_likelihood as keyof typeof visaDist;
    if (lvl in visaDist) visaDist[lvl]++;
  }

  // ── Programmatic insight — zero AI cost ──────────────────────────────────
  let insight: { best_countries: string[]; best_job_types: string[]; improvement_tips: string[] } | null = null;

  if (applied > 0) {
    // Best countries: top countries from applied tracker entries
    const countryCounts: Record<string, number> = {};
    for (const e of entries.filter((x) => x.status !== "saved")) {
      const c = (e.job as { country?: string } | null)?.country;
      if (c) countryCounts[c] = (countryCounts[c] ?? 0) + 1;
    }
    const best_countries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c);

    // Best job types: titles with highest avg ATS score
    const titleScores: Record<string, number[]> = {};
    for (const j of scoredJobs) {
      const t = j.job_title;
      if (t) { if (!titleScores[t]) titleScores[t] = []; titleScores[t].push(j.ats_score!); }
    }
    const best_job_types = Object.entries(titleScores)
      .map(([t, scores]) => [t, scores.reduce((a, b) => a + b, 0) / scores.length] as [string, number])
      .sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);

    // Rule-based tips
    const responseRate = applied > 0 ? (responded / applied) * 100 : 0;
    const tips: string[] = [];

    if (applied < 5)
      tips.push("Apply to at least 5 jobs to build momentum and see meaningful response rate trends.");
    else if (responseRate < 10)
      tips.push("Low response rate — optimize your CV against each job description before applying.");
    else if (responseRate >= 25)
      tips.push(`Strong ${Math.round(responseRate)}% response rate — focus on converting screenings to interviews.`);

    if (avgAts !== null && avgAts < 50)
      tips.push(`Average ATS score is ${avgAts}/100 — use the CV Optimizer for each application to improve keyword matching.`);
    else if (avgAts !== null && avgAts >= 70)
      tips.push(`Solid ATS scores averaging ${avgAts}/100 — consider applying to more roles.`);

    if (visaDist.high === 0)
      tips.push("None of your target jobs explicitly offer visa sponsorship — search for LMIA-eligible or sponsored positions.");
    else
      tips.push(`${visaDist.high} job(s) with high visa sponsorship likelihood — prioritize these applications.`);

    const fallbacks = [
      "Tailor each cover letter to the specific company and role for higher response rates.",
      "Prepare STAR-format answers for your top 5 behavioral questions before interviews.",
      "Follow up with recruiters 5–7 business days after submitting your application.",
    ];
    let i = 0;
    while (tips.length < 3 && i < fallbacks.length) tips.push(fallbacks[i++]);

    insight = {
      best_countries: best_countries.length ? best_countries : ["Canada"],
      best_job_types,
      improvement_tips: tips.slice(0, 3),
    };
  }

  return NextResponse.json({
    metrics: {
      total_applications:  total,
      applied,
      response_rate:       applied > 0 ? Math.round((responded / applied) * 100) : 0,
      avg_ats_score:       avgAts,
      avg_relocation_score: avgRelocation,
    },
    visa_distribution: visaDist,
    insight,
  });
}
