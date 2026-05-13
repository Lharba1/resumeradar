"use client";

import { useEffect, useState } from "react";

interface BillingData {
  configured: boolean;
  mode?: "live" | "test";
  mrr?: number;
  trialing?: number;
  activePaid?: number;
  planCounts?: Record<string, number>;
  recentEvents?: { id: string; type: string; created: number; plan: string | null }[];
  error?: string;
}

const EVENT_LABELS: Record<string, string> = {
  "customer.subscription.created":        "New subscription",
  "customer.subscription.updated":        "Subscription updated",
  "customer.subscription.deleted":        "Subscription cancelled",
  "invoice.payment_failed":               "Payment failed",
  "invoice.payment_succeeded":            "Payment succeeded",
  "customer.subscription.trial_will_end": "Trial ending soon",
  "checkout.session.completed":           "Checkout completed",
};

const PLAN_COLOR: Record<string, string> = {
  free:       "bg-[#F5F7FA] text-[#77838F]",
  starter:    "bg-blue-50 text-blue-700",
  pro:        "bg-emerald-50 text-emerald-700",
  enterprise: "bg-purple-50 text-purple-700",
};

export default function AdminBillingPage() {
  const [data, setData]       = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  const [email,       setEmail]       = useState("");
  const [plan,        setPlan]        = useState("pro");
  const [saving,      setSaving]      = useState(false);
  const [overrideMsg, setOverrideMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/admin/billing")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleOverride(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSaving(true);
    setOverrideMsg(null);
    const res = await fetch("/api/admin/billing", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email: email.trim(), plan_id: plan }),
    });
    const json = await res.json();
    setSaving(false);
    if (res.ok) {
      setOverrideMsg({ text: `Plan set to "${plan}" for ${email}`, ok: true });
      setEmail("");
    } else {
      setOverrideMsg({ text: json.error ?? "Failed", ok: false });
    }
  }

  if (loading) return <div className="py-20 text-center text-sm text-[#77838F]">Loading…</div>;

  if (!data?.configured) {
    return (
      <div className="max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-semibold text-amber-800">Stripe is not configured.</p>
        <p className="mt-1 text-sm text-amber-700">Add <code>STRIPE_SECRET_KEY</code> to Vercel environment variables.</p>
      </div>
    );
  }

  const planCounts = data.planCounts ?? {};
  const total = Object.values(planCounts).reduce((s, n) => s + n, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[#131f2f]">Billing</h1>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${
          data.mode === "live"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-amber-50 border-amber-200 text-amber-700"
        }`}>
          {data.mode === "live" ? "● Live" : "⚠ Test mode"}
        </span>
      </div>

      {data.mode === "test" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          You are in Stripe <strong>test mode</strong>. Switch to live keys in Vercel when ready to accept real payments.
        </div>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "MRR",         value: `$${(data.mrr ?? 0).toLocaleString()}`, sub: "Monthly recurring revenue" },
          { label: "Active paid", value: String(data.activePaid ?? 0),           sub: "Paid subscriptions" },
          { label: "In trial",    value: String(data.trialing ?? 0),             sub: "3-day free trial" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center">
            <div className="text-3xl font-black text-[#131f2f]">{s.value}</div>
            <div className="mt-0.5 text-xs font-medium text-[#77838F]">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Plan distribution */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-[#131f2f]">User Plan Distribution</h2>
        {total === 0 ? (
          <p className="text-sm text-[#77838F]">No users yet.</p>
        ) : (
          <div className="space-y-3">
            {["free", "starter", "pro", "enterprise"].map((p) => {
              const count = planCounts[p] ?? 0;
              const pct   = Math.round((count / total) * 100);
              const bar   = p === "free" ? "bg-[#E2E8F0]" : p === "starter" ? "bg-blue-400" : p === "pro" ? "bg-emerald-400" : "bg-purple-400";
              return (
                <div key={p} className="flex items-center gap-3">
                  <span className={`w-20 shrink-0 rounded-full px-2 py-0.5 text-center text-[11px] font-semibold capitalize ${PLAN_COLOR[p]}`}>{p}</span>
                  <div className="flex-1 h-2 rounded-full bg-[#F5F7FA] overflow-hidden">
                    <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs text-[#77838F]">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual plan override */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <h2 className="mb-1 text-sm font-semibold text-[#131f2f]">Manual Plan Override</h2>
        <p className="mb-4 text-xs text-[#77838F]">Assign any plan to a user by email — bypasses Stripe billing. Logged to admin_actions.</p>
        <form onSubmit={handleOverride} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-48">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#77838F]">User email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="w-full rounded-xl border border-[#dcdce3] px-3 py-2 text-sm focus:border-[#006EDC] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#77838F]">Plan</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="rounded-xl border border-[#dcdce3] px-3 py-2 text-sm focus:border-[#006EDC] focus:outline-none"
            >
              {["free", "starter", "pro", "enterprise"].map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#006EDC] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0060c0] disabled:opacity-50 transition"
          >
            {saving ? "Saving…" : "Apply"}
          </button>
        </form>
        {overrideMsg && (
          <p className={`mt-3 text-sm font-medium ${overrideMsg.ok ? "text-emerald-700" : "text-red-600"}`}>
            {overrideMsg.text}
          </p>
        )}
      </div>

      {/* Recent Stripe events */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden">
        <div className="border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="text-sm font-semibold text-[#131f2f]">Recent Stripe Events</h2>
        </div>
        {(data.recentEvents ?? []).length === 0 ? (
          <p className="px-6 py-4 text-sm text-[#77838F]">No events yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-left text-xs text-[#77838F]">
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {(data.recentEvents ?? []).map((ev) => (
                <tr key={ev.id} className="border-b border-[#F5F7FA] hover:bg-[#FAFBFC]">
                  <td className="px-5 py-3 text-[#131f2f]">{EVENT_LABELS[ev.type] ?? ev.type}</td>
                  <td className="px-5 py-3">
                    {ev.plan ? (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${PLAN_COLOR[ev.plan] ?? ""}`}>
                        {ev.plan}
                      </span>
                    ) : <span className="text-[#77838F]">—</span>}
                  </td>
                  <td className="px-5 py-3 text-right text-xs text-[#77838F]">
                    {new Date(ev.created * 1000).toLocaleString("en-CA", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
