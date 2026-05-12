"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  metrics: {
    total_applications: number;
    applied: number;
    response_rate: number;
    avg_ats_score: number | null;
    avg_relocation_score: number | null;
  };
  visa_distribution: { high: number; medium: number; low: number };
  insight: { best_countries: string[]; best_job_types: string[]; improvement_tips: string[] } | null;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("dashboard_error");
        return r.json();
      })
      .then((d) => setData(d as DashboardData))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#006EDC] border-t-transparent" />
    </div>
  );

  if (!data) return (
    <div className="flex flex-col items-center justify-center py-40 text-center">
      <p className="text-sm text-[#77838F]">Could not load dashboard data. Please refresh the page.</p>
    </div>
  );

  const { metrics, visa_distribution, insight } = data;
  const total = visa_distribution.high + visa_distribution.medium + visa_distribution.low;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#131f2f]">Dashboard</h1>
        <p className="mt-2 text-[#77838F]">Your job search at a glance.</p>
      </div>

      {/* Metrics */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Tracked" value={metrics.total_applications} />
        <MetricCard label="Applied" value={metrics.applied} accent="blue" />
        <MetricCard
          label="Response Rate"
          value={`${metrics.response_rate}%`}
          accent={metrics.response_rate >= 20 ? "green" : "amber"}
        />
        <MetricCard
          label="Avg ATS Score"
          value={metrics.avg_ats_score !== null ? `${metrics.avg_ats_score}%` : "—"}
          accent="violet"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Visa Distribution */}
        <div className="rounded-2xl border border-[#dcdce3] bg-white p-6">
          <h2 className="mb-5 font-semibold text-[#131f2f]">Visa-Friendly Distribution</h2>
          {total === 0 ? (
            <p className="text-sm text-[#77838F]">No jobs fetched yet.</p>
          ) : (
            <div className="space-y-4">
              <VisaBar label="Likely" count={visa_distribution.high} total={total} color="bg-emerald-500" textColor="text-emerald-600" />
              <VisaBar label="Possible" count={visa_distribution.medium} total={total} color="bg-amber-500" textColor="text-amber-600" />
              <VisaBar label="Unlikely" count={visa_distribution.low} total={total} color="bg-red-500" textColor="text-red-500" />
            </div>
          )}
        </div>

        {/* Avg scores */}
        <div className="rounded-2xl border border-[#dcdce3] bg-white p-6">
          <h2 className="mb-5 font-semibold text-[#131f2f]">Average Scores</h2>
          <div className="space-y-4">
            <ScoreRow label="ATS Match" value={metrics.avg_ats_score} color="bg-[#006EDC]" />
            <ScoreRow label="Relocation" value={metrics.avg_relocation_score} color="bg-blue-500" />
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-6">
        {insight ? (
          <div className="rounded-2xl border border-[#dcdce3] bg-white p-6">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E6F2FD]">
                <span className="text-sm">✨</span>
              </div>
              <h2 className="font-semibold text-[#131f2f]">AI Recommendations</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <InsightBlock title="Best Countries" items={insight.best_countries} color="text-emerald-600" />
              <InsightBlock title="Best Job Types" items={insight.best_job_types} color="text-blue-600" />
              <InsightBlock title="Improvement Tips" items={insight.improvement_tips} color="text-[#006EDC]" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dcdce3] py-16 text-center">
            <p className="text-[#77838F] text-sm">Apply to jobs to unlock AI recommendations</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, accent = "default" }: { label: string; value: string | number; accent?: string }) {
  const colors: Record<string, string> = {
    default: "text-[#131f2f]",
    blue: "text-blue-600",
    green: "text-emerald-600",
    amber: "text-amber-600",
    violet: "text-[#006EDC]",
  };
  return (
    <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#77838F]">{label}</p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${colors[accent] ?? "text-[#131f2f]"}`}>{value}</p>
    </div>
  );
}

function VisaBar({ label, count, total, color, textColor }: { label: string; count: number; total: number; color: string; textColor: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className={`font-medium ${textColor}`}>{label}</span>
        <span className="text-[#77838F]">{count} · {pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5ecf2]">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ScoreRow({ label, value, color }: { label: string; value: number | null; color: string }) {
  const pct = value ?? 0;
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-[#3B4959]">{label}</span>
        <span className="font-semibold text-[#131f2f]">{value !== null ? `${value}%` : "—"}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5ecf2]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function InsightBlock({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div className="rounded-xl bg-[#F5F9FC] p-4">
      <p className={`mb-3 text-xs font-semibold uppercase tracking-widest ${color}`}>{title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#3B4959]">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#CCD0D5]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
