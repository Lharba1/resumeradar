"use client";

import { useEffect, useState } from "react";

interface UserSpendRow {
  user_id:  string;
  email:    string;
  plan_id:  string;
  calls:    number;
  cost:     number;
  flagged:  boolean;
}

interface FeatureRow {
  feature: string;
  calls:   number;
  cost:    number;
}

interface SpendData {
  total_cost:    number;
  total_calls:   number;
  top_users:     UserSpendRow[];
  by_feature:    FeatureRow[];
  flagged_count: number;
}

const PLAN_BADGE: Record<string, string> = {
  free:       "bg-[#F5F9FC] text-[#77838F] border-[#dcdce3]",
  pro:        "bg-emerald-50 text-emerald-700 border-emerald-200",
  enterprise: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function AdminAISpendPage() {
  const [data,    setData]    = useState<SpendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [month,   setMonth]   = useState(() => new Date().toISOString().slice(0, 7));

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/ai-spend?month=${month}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [month]);

  if (loading) return <div className="py-20 text-center text-sm text-[#77838F]">Loading…</div>;
  if (!data)   return <div className="py-20 text-center text-sm text-red-500">Failed to load spend data.</div>;

  const maxCost = Math.max(...(data.by_feature.map((f) => f.cost)), 0.01);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#131f2f]">AI Spend</h1>
          <p className="mt-1 text-sm text-[#77838F]">Monthly AI cost by user and feature.</p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-xl border border-[#dcdce3] px-3 py-2 text-sm focus:border-[#006EDC] focus:outline-none"
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total AI Cost",   value: `$${(data.total_cost / 100).toFixed(2)}`,  color: "text-[#006EDC]" },
          { label: "Total AI Calls",  value: data.total_calls.toLocaleString(),           color: "text-[#131f2f]" },
          { label: "Flagged Users",   value: data.flagged_count,                          color: data.flagged_count > 0 ? "text-red-500" : "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center">
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="mt-1 text-xs font-medium text-[#77838F]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Feature breakdown */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-[#131f2f]">Cost by Feature</h2>
          <div className="space-y-3">
            {data.by_feature.length === 0 && (
              <p className="text-xs text-[#77838F]">No AI calls this month.</p>
            )}
            {data.by_feature.map((f) => (
              <div key={f.feature} className="flex items-center gap-3">
                <span className="w-36 truncate font-mono text-xs text-[#3B4959]">{f.feature}</span>
                <div className="flex-1 h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#006EDC]"
                    style={{ width: `${(f.cost / maxCost) * 100}%` }}
                  />
                </div>
                <span className="w-14 text-right text-xs text-[#77838F]">${(f.cost / 100).toFixed(3)}</span>
                <span className="w-12 text-right text-xs text-[#77838F]">{f.calls.toLocaleString()}×</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top users */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-[#131f2f]">Top Users by Cost</h2>
          <div className="space-y-2">
            {data.top_users.length === 0 && (
              <p className="text-xs text-[#77838F]">No spend recorded yet.</p>
            )}
            {data.top_users.map((u) => (
              <div key={u.user_id} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${u.flagged ? "bg-red-50 border border-red-100" : "bg-[#F5F9FC]"}`}>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium text-[#131f2f]">{u.email}</p>
                  <p className="text-[11px] text-[#77838F]">{u.calls} calls</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${PLAN_BADGE[u.plan_id] ?? PLAN_BADGE.free}`}>
                  {u.plan_id}
                </span>
                <span className={`text-xs font-semibold ${u.flagged ? "text-red-500" : "text-[#131f2f]"}`}>
                  ${(u.cost / 100).toFixed(2)}
                </span>
                {u.flagged && (
                  <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600">⚠ FLAG</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
