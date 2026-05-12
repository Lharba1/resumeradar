"use client";

import { useEffect, useRef, useState } from "react";

interface Plan {
  id: string;
  name: string;
  price_cents: number;
  description: string;
  is_active: boolean;
  sort_order: number;
}

interface PlanLimit {
  plan_id: string;
  route: string;
  daily_limit: number;
}

interface PlanDraft {
  name: string;
  price_cents: number;
  description: string;
  dirty: boolean;
}

const PLAN_COLOR: Record<string, string> = {
  free: "text-[#77838F]",
  pro: "text-emerald-700",
  enterprise: "text-purple-700",
};

function useFlash() {
  const [msg, setMsg] = useState<{ text: string; type: "ok" | "err" } | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  function flash(text: string, type: "ok" | "err" = "ok") {
    if (t.current) clearTimeout(t.current);
    setMsg({ text, type });
    t.current = setTimeout(() => setMsg(null), 3000);
  }
  return { msg, flash };
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [limits, setLimits] = useState<PlanLimit[]>([]);
  const [subscriberCounts, setSubscriberCounts] = useState<Record<string, number>>({});
  const [drafts, setDrafts] = useState<Record<string, PlanDraft>>({});
  const [savingCell, setSavingCell] = useState<string | null>(null);
  const [savingPlan, setSavingPlan] = useState<string | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<string | null>(null);
  const [deletingRoute, setDeletingRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [planError, setPlanError] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);
  const { msg: flash, flash: showFlash } = useFlash();

  // New plan form
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({ id: "", name: "", price: "", description: "" });
  const [newPlanError, setNewPlanError] = useState<string | null>(null);
  const [savingNewPlan, setSavingNewPlan] = useState(false);

  // Add route form
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [newRoute, setNewRoute] = useState("");
  const [newRouteLimits, setNewRouteLimits] = useState<Record<string, string>>({});
  const [newRouteError, setNewRouteError] = useState<string | null>(null);
  const [savingRoute, setSavingRoute] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/plans");
    const data = await res.json();
    const loadedPlans: Plan[] = data.plans ?? [];
    setPlans(loadedPlans);
    setLimits(data.limits ?? []);
    setSubscriberCounts(data.subscriberCounts ?? {});
    // Initialise drafts from loaded plans
    const d: Record<string, PlanDraft> = {};
    for (const p of loadedPlans) {
      d[p.id] = { name: p.name, price_cents: p.price_cents, description: p.description ?? "", dirty: false };
    }
    setDrafts(d);
    // Reset new route limits to match plan ids
    const rl: Record<string, string> = {};
    for (const p of loadedPlans) rl[p.id] = "10";
    setNewRouteLimits(rl);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Limit cell update ──────────────────────────────────────────────────────
  async function updateLimit(plan_id: string, route: string, daily_limit: number) {
    const key = `${plan_id}:${route}`;
    setSavingCell(key);
    const res = await fetch("/api/admin/plans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id, route, daily_limit }),
    });
    setSavingCell(null);
    if (!res.ok) { const d = await res.json(); setTableError(d.error); return; }
    setTableError(null);
    setLimits((prev) => {
      const exists = prev.find((l) => l.plan_id === plan_id && l.route === route);
      if (exists) return prev.map((l) => l.plan_id === plan_id && l.route === route ? { ...l, daily_limit } : l);
      return [...prev, { plan_id, route, daily_limit }];
    });
  }

  // ── Plan card draft editing ────────────────────────────────────────────────
  function updateDraft(id: string, field: keyof Omit<PlanDraft, "dirty">, value: string | number) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value, dirty: true } }));
  }

  async function savePlan(id: string) {
    const d = drafts[id];
    if (!d) return;
    setSavingPlan(id);
    setPlanError(null);
    const res = await fetch("/api/admin/plans", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: d.name, price_cents: d.price_cents, description: d.description }),
    });
    setSavingPlan(null);
    if (!res.ok) { const data = await res.json(); setPlanError(data.error); return; }
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], dirty: false } }));
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, name: d.name, price_cents: d.price_cents, description: d.description } : p));
    showFlash("Plan saved.");
  }

  async function deletePlan(id: string) {
    const subs = subscriberCounts[id] ?? 0;
    if (subs > 0) return;
    if (!confirm(`Delete plan "${plans.find((p) => p.id === id)?.name}"? This cannot be undone.`)) return;
    setDeletingPlan(id);
    setPlanError(null);
    const res = await fetch(`/api/admin/plans?plan_id=${id}`, { method: "DELETE" });
    setDeletingPlan(null);
    if (!res.ok) { const data = await res.json(); setPlanError(data.error); return; }
    showFlash("Plan deleted.");
    load();
  }

  // ── Create new plan ────────────────────────────────────────────────────────
  async function createPlan() {
    setNewPlanError(null);
    if (!newPlan.id.trim()) { setNewPlanError("Plan ID is required"); return; }
    if (!/^[a-z0-9-]+$/.test(newPlan.id)) { setNewPlanError("ID must be lowercase letters, numbers, and dashes only"); return; }
    if (!newPlan.name.trim()) { setNewPlanError("Name is required"); return; }
    const price = parseFloat(newPlan.price);
    if (isNaN(price) || price < 0) { setNewPlanError("Enter a valid price (0 for free)"); return; }
    setSavingNewPlan(true);
    const res = await fetch("/api/admin/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_plan",
        id: newPlan.id,
        name: newPlan.name,
        price_cents: Math.round(price * 100),
        description: newPlan.description,
      }),
    });
    setSavingNewPlan(false);
    if (!res.ok) { const data = await res.json(); setNewPlanError(data.error); return; }
    setShowNewPlan(false);
    setNewPlan({ id: "", name: "", price: "", description: "" });
    showFlash("Plan created.");
    load();
  }

  // ── Add route ─────────────────────────────────────────────────────────────
  async function addRoute() {
    setNewRouteError(null);
    if (!newRoute.trim().startsWith("/api/")) { setNewRouteError("Route must start with /api/"); return; }
    setSavingRoute(true);
    const limits: Record<string, number> = {};
    for (const pid of plans.map((p) => p.id)) {
      limits[pid] = parseInt(newRouteLimits[pid] ?? "10", 10) || 10;
    }
    const res = await fetch("/api/admin/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_route", route: newRoute.trim(), limits }),
    });
    setSavingRoute(false);
    if (!res.ok) { const data = await res.json(); setNewRouteError(data.error); return; }
    setShowAddRoute(false);
    setNewRoute("");
    const rl: Record<string, string> = {};
    for (const p of plans) rl[p.id] = "10";
    setNewRouteLimits(rl);
    showFlash("Route added.");
    load();
  }

  async function deleteRoute(route: string) {
    if (!confirm(`Remove route "${route}" from all plans?`)) return;
    setDeletingRoute(route);
    setTableError(null);
    const res = await fetch(`/api/admin/plans?route=${encodeURIComponent(route)}`, { method: "DELETE" });
    setDeletingRoute(null);
    if (!res.ok) { const data = await res.json(); setTableError(data.error); return; }
    showFlash("Route removed.");
    load();
  }

  const routes = [...new Set(limits.map((l) => l.route))].sort();
  const getLimit = (plan_id: string, route: string) =>
    limits.find((l) => l.plan_id === plan_id && l.route === route)?.daily_limit ?? 0;

  if (loading) return <div className="py-20 text-center text-sm text-[#77838F]">Loading…</div>;

  return (
    <div className="space-y-6">
      {/* Flash message */}
      {flash && (
        <div className={`fixed right-6 top-6 z-50 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-lg ${
          flash.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-600"
        }`}>
          {flash.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#131f2f]">Plans &amp; Limits</h1>
          <p className="mt-1 text-sm text-[#77838F]">Manage plans, routes, and daily limits.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => { setShowNewPlan((v) => !v); setNewPlanError(null); }}
            className="rounded-xl border border-[#006EDC] bg-[#E6F2FD] px-4 py-2 text-sm font-medium text-[#006EDC] hover:bg-[#d4e8fb] transition"
          >
            + New Plan
          </button>
          <button
            onClick={() => { setShowAddRoute((v) => !v); setNewRouteError(null); }}
            className="rounded-xl bg-[#006EDC] px-4 py-2 text-sm font-medium text-white hover:bg-[#0060c0] transition"
          >
            + Add Route
          </button>
        </div>
      </div>

      {/* New plan form */}
      {showNewPlan && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-[#131f2f]">Create new plan</h2>
          {newPlanError && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{newPlanError}</p>}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#77838F]">Plan ID (slug)</label>
              <input
                value={newPlan.id}
                onChange={(e) => setNewPlan((p) => ({ ...p, id: e.target.value.toLowerCase() }))}
                placeholder="e.g. business"
                className="w-full rounded-lg border border-[#dcdce3] px-3 py-1.5 text-sm focus:border-[#006EDC] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#77838F]">Name</label>
              <input
                value={newPlan.name}
                onChange={(e) => setNewPlan((p) => ({ ...p, name: e.target.value }))}
                placeholder="Business"
                className="w-full rounded-lg border border-[#dcdce3] px-3 py-1.5 text-sm focus:border-[#006EDC] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#77838F]">Price ($/mo)</label>
              <input
                type="number"
                min={0}
                value={newPlan.price}
                onChange={(e) => setNewPlan((p) => ({ ...p, price: e.target.value }))}
                placeholder="29"
                className="w-full rounded-lg border border-[#dcdce3] px-3 py-1.5 text-sm focus:border-[#006EDC] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#77838F]">Description</label>
              <input
                value={newPlan.description}
                onChange={(e) => setNewPlan((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description"
                className="w-full rounded-lg border border-[#dcdce3] px-3 py-1.5 text-sm focus:border-[#006EDC] focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={createPlan}
              disabled={savingNewPlan}
              className="rounded-xl bg-[#006EDC] px-4 py-2 text-sm font-medium text-white hover:bg-[#0060c0] disabled:opacity-50 transition"
            >
              {savingNewPlan ? "Creating…" : "Create Plan"}
            </button>
            <button
              onClick={() => { setShowNewPlan(false); setNewPlanError(null); }}
              className="rounded-xl border border-[#dcdce3] px-4 py-2 text-sm font-medium text-[#3B4959] hover:bg-[#F5F7FA] transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Plan cards */}
      {planError && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{planError}</p>}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(plans.length, 4)}, minmax(0, 1fr))` }}>
        {plans.map((plan) => {
          const draft = drafts[plan.id] ?? { name: plan.name, price_cents: plan.price_cents, description: plan.description ?? "", dirty: false };
          const subs = subscriberCounts[plan.id] ?? 0;
          return (
            <div key={plan.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 flex flex-col gap-3">
              {/* Plan ID badge */}
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs font-bold uppercase tracking-widest ${PLAN_COLOR[plan.id] ?? "text-[#131f2f]"}`}>
                  {plan.id}
                </span>
                <span className="rounded-full bg-[#F5F7FA] px-2 py-0.5 text-[11px] text-[#77838F]">
                  {subs} user{subs !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Name */}
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[#77838F]">Name</label>
                <input
                  value={draft.name}
                  onChange={(e) => updateDraft(plan.id, "name", e.target.value)}
                  className="w-full rounded-lg border border-[#dcdce3] px-2.5 py-1.5 text-sm font-medium text-[#131f2f] focus:border-[#006EDC] focus:outline-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[#77838F]">Price ($/mo)</label>
                <input
                  type="number"
                  min={0}
                  value={(draft.price_cents / 100).toFixed(0)}
                  onChange={(e) => updateDraft(plan.id, "price_cents", Math.round(parseFloat(e.target.value || "0") * 100))}
                  className="w-full rounded-lg border border-[#dcdce3] px-2.5 py-1.5 text-sm text-[#131f2f] focus:border-[#006EDC] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[#77838F]">Description</label>
                <input
                  value={draft.description}
                  onChange={(e) => updateDraft(plan.id, "description", e.target.value)}
                  className="w-full rounded-lg border border-[#dcdce3] px-2.5 py-1.5 text-sm text-[#3B4959] focus:border-[#006EDC] focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="mt-auto flex gap-2 pt-1">
                {draft.dirty && (
                  <button
                    onClick={() => savePlan(plan.id)}
                    disabled={savingPlan === plan.id}
                    className="flex-1 rounded-xl bg-[#006EDC] py-1.5 text-xs font-semibold text-white hover:bg-[#0060c0] disabled:opacity-50 transition"
                  >
                    {savingPlan === plan.id ? "Saving…" : "Save"}
                  </button>
                )}
                <button
                  onClick={() => deletePlan(plan.id)}
                  disabled={subs > 0 || deletingPlan === plan.id}
                  title={subs > 0 ? `Cannot delete: ${subs} active subscriber(s)` : "Delete plan"}
                  className="rounded-xl border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 transition"
                >
                  {deletingPlan === plan.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Routes table */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden">
        {tableError && <p className="border-b border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">{tableError}</p>}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#77838F]">Route</th>
              {plans.map((p) => (
                <th key={p.id} className={`px-4 py-3 text-center text-xs font-semibold capitalize ${PLAN_COLOR[p.id] ?? ""}`}>
                  {drafts[p.id]?.name ?? p.name}
                  <span className="block font-normal text-[#77838F]">
                    {p.price_cents === 0 ? "Free" : `$${((drafts[p.id]?.price_cents ?? p.price_cents) / 100).toFixed(0)}/mo`}
                  </span>
                </th>
              ))}
              <th className="w-10 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route} className="border-b border-[#F5F7FA] hover:bg-[#FAFBFC]">
                <td className="px-4 py-3 font-mono text-xs text-[#3B4959]">{route}</td>
                {plans.map((p) => {
                  const key = `${p.id}:${route}`;
                  const val = getLimit(p.id, route);
                  return (
                    <td key={p.id} className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min={0}
                        defaultValue={val}
                        key={val}
                        onBlur={(e) => {
                          const n = parseInt(e.target.value, 10);
                          if (!isNaN(n) && n !== val) updateLimit(p.id, route, n);
                        }}
                        className={`w-20 rounded-lg border text-center text-sm font-medium transition focus:outline-none focus:border-[#006EDC] ${
                          savingCell === key ? "border-amber-300 bg-amber-50" : "border-[#dcdce3] bg-white"
                        }`}
                      />
                    </td>
                  );
                })}
                <td className="px-2 py-3 text-right">
                  <button
                    onClick={() => deleteRoute(route)}
                    disabled={deletingRoute === route}
                    className="rounded-lg border border-[#dcdce3] px-2 py-1 text-xs text-[#77838F] hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-40 transition"
                    title="Remove route from all plans"
                  >
                    {deletingRoute === route ? "…" : "×"}
                  </button>
                </td>
              </tr>
            ))}

            {/* Add route inline form */}
            {showAddRoute && (
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <td className="px-4 py-3">
                  <input
                    value={newRoute}
                    onChange={(e) => setNewRoute(e.target.value)}
                    placeholder="/api/new-feature"
                    className="w-full rounded-lg border border-[#dcdce3] px-2.5 py-1.5 font-mono text-xs focus:border-[#006EDC] focus:outline-none"
                  />
                  {newRouteError && <p className="mt-1 text-[11px] text-red-500">{newRouteError}</p>}
                </td>
                {plans.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      value={newRouteLimits[p.id] ?? "10"}
                      onChange={(e) => setNewRouteLimits((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      className="w-20 rounded-lg border border-[#dcdce3] bg-white text-center text-sm focus:border-[#006EDC] focus:outline-none"
                    />
                  </td>
                ))}
                <td className="px-2 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={addRoute}
                      disabled={savingRoute}
                      className="rounded-lg bg-[#006EDC] px-2 py-1 text-[11px] font-semibold text-white hover:bg-[#0060c0] disabled:opacity-50"
                    >
                      {savingRoute ? "…" : "Save"}
                    </button>
                    <button
                      onClick={() => { setShowAddRoute(false); setNewRouteError(null); setNewRoute(""); }}
                      className="rounded-lg border border-[#dcdce3] px-2 py-1 text-[11px] text-[#77838F] hover:bg-[#F5F7FA]"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
