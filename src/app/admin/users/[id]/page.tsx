"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface UserDetail {
  user: { id: string; email: string; created_at: string; last_sign_in_at: string | null };
  sub:  { plan_id: string; status: string; stripe_subscription_id?: string | null };
  status: { status: string; suspended_reason?: string | null };
  overrides: { route: string; daily_limit: number }[];
  usage: { route: string; count: number; window_start: string }[];
}

const ROUTES = [
  "/api/cv/parse", "/api/cv/generate", "/api/cv/optimize",
  "/api/cover-letter", "/api/jobs/fetch", "/api/jobs/score",
  "/api/interview-prep/questions", "/api/interview-prep/feedback",
];

const PLANS = ["free", "pro", "enterprise"];

export default function AdminUserDetailPage() {
  const { id }    = useParams<{ id: string }>();
  const router    = useRouter();
  const [data,    setData]    = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/users/${id}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function patch(body: object) {
    setSaving(true);
    setMsg(null);
    const res = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) { setMsg("Saved."); await load(); }
    else { const d = await res.json(); setMsg(`Error: ${d.error}`); }
  }

  if (loading) return <div className="py-20 text-center text-sm text-[#77838F]">Loading…</div>;
  if (!data)   return <div className="py-20 text-center text-sm text-red-500">User not found.</div>;

  const overrideMap = Object.fromEntries(data.overrides.map((o) => [o.route, o.daily_limit]));
  const todayUsage  = data.usage
    .filter((u) => u.window_start >= new Date().toISOString().split("T")[0])
    .reduce<Record<string, number>>((acc, u) => { acc[u.route] = (acc[u.route] ?? 0) + u.count; return acc; }, {});

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-sm text-[#77838F] hover:text-[#131f2f]">← Users</button>
        <h1 className="text-xl font-bold text-[#131f2f]">{data.user.email}</h1>
      </div>

      {msg && <div className={`rounded-xl px-4 py-2.5 text-sm ${msg.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>{msg}</div>}

      {/* Plan */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-[#131f2f]">Subscription Plan</h2>
        <div className="flex items-center gap-3">
          <select
            defaultValue={data.sub.plan_id}
            onChange={(e) => patch({ plan_id: e.target.value })}
            className="rounded-xl border border-[#dcdce3] px-3 py-2 text-sm focus:border-[#006EDC] focus:outline-none"
          >
            {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <span className="text-xs text-[#77838F]">Current: <strong>{data.sub.plan_id}</strong> · {data.sub.status}</span>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-[#131f2f]">Account Status</h2>
        <div className="flex items-center gap-4">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${data.status.status === "suspended" ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
            {data.status.status}
          </span>
          {data.status.status === "active" ? (
            <button disabled={saving} onClick={() => patch({ suspended: true, suspended_reason: "Admin action" })}
              className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
              Suspend user
            </button>
          ) : (
            <button disabled={saving} onClick={() => patch({ suspended: false })}
              className="rounded-xl border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50">
              Unsuspend user
            </button>
          )}
        </div>
      </div>

      {/* Per-route overrides */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <h2 className="mb-1 text-sm font-semibold text-[#131f2f]">Daily Limit Overrides</h2>
        <p className="mb-4 text-xs text-[#77838F]">Leave blank to use plan defaults. Set a value to override.</p>
        <div className="space-y-2">
          {ROUTES.map((route) => (
            <div key={route} className="flex items-center gap-3">
              <span className="w-64 shrink-0 font-mono text-xs text-[#3B4959]">{route}</span>
              <span className="text-xs text-[#77838F]">today: {todayUsage[route] ?? 0}</span>
              <input
                type="number"
                min={0}
                defaultValue={overrideMap[route] ?? ""}
                placeholder="plan default"
                className="w-28 rounded-lg border border-[#dcdce3] px-2 py-1 text-xs focus:border-[#006EDC] focus:outline-none"
                onBlur={(e) => {
                  const val = e.target.value === "" ? null : parseInt(e.target.value, 10);
                  patch({ override: { route, daily_limit: val } });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
