"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase-browser";

interface RouteUsage { route: string; limit: number; used: number; source: string; }
interface UsageData {
  plan_id: string;
  plan_status: string;
  trial_end: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  routes: RouteUsage[];
}

const PLAN_BADGE: Record<string, string> = {
  free:       "bg-[#F5F7FA] text-[#77838F] border-[#E2E8F0]",
  starter:    "bg-[#EEF1F5] text-[#3B4959] border-[#CCD0D5]",
  pro:        "bg-emerald-50 text-emerald-700 border-emerald-200",
  enterprise: "bg-purple-50 text-purple-700 border-purple-200",
};

const ROUTE_LABEL: Record<string, string> = {
  "/api/cv/parse":                   "CV Uploads",
  "/api/cv/generate":                "CV Generations",
  "/api/cv/optimize":                "CV Optimizations",
  "/api/cover-letter":               "Cover Letters",
  "/api/jobs/fetch":                 "Job Searches",
  "/api/jobs/score":                 "Job Scorings",
  "/api/interview-prep/questions":   "Interview Questions",
  "/api/interview-prep/feedback":    "Interview Feedback",
};

function SettingsContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const upgraded     = searchParams.get("upgraded") === "1";

  const [usage,              setUsage]              = useState<UsageData | null>(null);
  const [deleteConfirm,      setDeleteConfirm]      = useState("");
  const [deleting,           setDeleting]           = useState(false);
  const [deleteError,        setDeleteError]        = useState<string | null>(null);
  const [exporting,          setExporting]          = useState(false);
  const [upgrading,          setUpgrading]          = useState(false);
  const [librarySave,        setLibrarySave]        = useState(true);
  const [clearingLibrary,    setClearingLibrary]    = useState(false);
  const [libraryClearedMsg,  setLibraryClearedMsg]  = useState(false);

  useEffect(() => {
    fetch("/api/account/usage").then((r) => r.json()).then(setUsage);
    fetch("/api/library/preferences").then((r) => r.json()).then((d) => setLibrarySave(d.library_save_enabled ?? true));
  }, []);

  async function toggleLibrarySave(enabled: boolean) {
    setLibrarySave(enabled);
    await fetch("/api/library/preferences", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ library_save_enabled: enabled }) });
  }

  async function handleClearLibrary() {
    setClearingLibrary(true);
    await fetch("/api/library/cvs", { method: "DELETE" });
    setClearingLibrary(false);
    setLibraryClearedMsg(true);
    setTimeout(() => setLibraryClearedMsg(false), 3000);
  }

  async function handleUpgrade(plan_id: string) {
    setUpgrading(true);
    const res  = await fetch("/api/billing/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan_id }) });
    const data = await res.json();
    setUpgrading(false);
    if (data.url) window.location.href = data.url;
  }

  async function handlePortal() {
    setUpgrading(true);
    const res  = await fetch("/api/billing/portal", { method: "POST" });
    const data = await res.json();
    setUpgrading(false);
    if (data.url) window.location.href = data.url;
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res  = await fetch("/api/account/export");
      if (!res.ok) { setExporting(false); return; }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = `resumeradar-data-${new Date().toISOString().split("T")[0]}.json`; a.click();
      URL.revokeObjectURL(url);
    } finally { setExporting(false); }
  }

  async function handleDelete() {
    if (deleteConfirm !== "DELETE MY ACCOUNT") return;
    setDeleting(true); setDeleteError(null);
    const res  = await fetch("/api/account/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirm: "DELETE MY ACCOUNT" }) });
    const data = await res.json();
    if (!res.ok) { setDeleteError(data.error ?? "Deletion failed"); setDeleting(false); return; }
    const supabase = getBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#131f2f]">Settings</h1>
        <p className="mt-1 text-sm text-[#77838F]">Manage your account and subscription</p>
      </div>

      {upgraded && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 font-medium">
          🎉 Your plan has been upgraded! It may take a few seconds to reflect below.
        </div>
      )}

      {usage?.plan_status === "trialing" && usage.trial_end && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
          <span className="font-semibold">⏳ Free trial active.</span>{" "}
          Your 3-day Pro trial ends on{" "}
          <span className="font-semibold">
            {new Date(usage.trial_end).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}
          </span>. You won&apos;t be charged until then — cancel anytime below.
        </div>
      )}

      {/* ── Plan & Usage ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#dcdce3] bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#131f2f]">Your Plan</h2>
          {usage && (
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              usage.plan_status === "trialing"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : (PLAN_BADGE[usage.plan_id] ?? PLAN_BADGE.free)
            }`}>
              {usage.plan_status === "trialing" ? "Pro Trial" : usage.plan_id}
            </span>
          )}
        </div>

        {usage?.cancel_at_period_end && (
          <p className="text-xs text-amber-600">
            Your plan will cancel on {new Date(usage.current_period_end!).toLocaleDateString()}. Manage below to renew.
          </p>
        )}

        {/* Daily usage bars */}
        {usage && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#77838F]">Today&apos;s Usage</p>
            {usage.routes.map((r) => {
              const pct = r.limit > 0 ? Math.min(100, Math.round((r.used / r.limit) * 100)) : 0;
              const barColor = pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-amber-400" : "bg-[#006EDC]";
              return (
                <div key={r.route} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 text-xs text-[#3B4959]">{ROUTE_LABEL[r.route] ?? r.route}</span>
                  <div className="flex-1 h-1.5 bg-[#F5F7FA] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-16 text-right text-xs text-[#77838F]">{r.used} / {r.limit}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Upgrade / manage */}
        {usage?.plan_id === "free" && usage?.plan_status !== "trialing" && (
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-2">
              <button disabled={upgrading} onClick={() => handleUpgrade("starter")}
                className="flex-1 rounded-xl bg-[#3B4959] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2e3a47] disabled:opacity-50">
                {upgrading ? "Redirecting…" : "Starter — $9/mo"}
              </button>
              <button disabled={upgrading} onClick={() => handleUpgrade("pro")}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">
                {upgrading ? "Redirecting…" : "Pro — $19/mo ✨ 3 days free"}
              </button>
            </div>
            <button disabled={upgrading} onClick={() => handleUpgrade("enterprise")}
              className="w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-50">
              {upgrading ? "Redirecting…" : "Enterprise — $49/mo"}
            </button>
          </div>
        )}

        {usage?.plan_id === "starter" && (
          <div className="flex flex-col gap-2 pt-2">
            <button disabled={upgrading} onClick={() => handleUpgrade("pro")}
              className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">
              {upgrading ? "Redirecting…" : "Upgrade to Pro — $19/mo ✨"}
            </button>
            <button disabled={upgrading} onClick={handlePortal}
              className="w-full rounded-xl border border-[#dcdce3] px-4 py-2 text-sm font-medium text-[#3B4959] hover:bg-[#F5F9FC] disabled:opacity-50">
              {upgrading ? "Redirecting…" : "Manage subscription →"}
            </button>
          </div>
        )}

        {usage && usage.plan_id !== "free" && usage.plan_id !== "starter" && (
          <button disabled={upgrading} onClick={handlePortal}
            className="w-full rounded-xl border border-[#dcdce3] px-4 py-2 text-sm font-medium text-[#3B4959] hover:bg-[#F5F9FC] disabled:opacity-50">
            {upgrading ? "Redirecting…" : "Manage subscription →"}
          </button>
        )}
      </div>

      {/* ── Library ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#dcdce3] bg-white p-6 space-y-4">
        <h2 className="font-semibold text-[#131f2f]">My Library</h2>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#3B4959]">Auto-save optimized CVs</p>
            <p className="text-xs text-[#77838F]">Saves each optimization to your Library automatically so you can re-download anytime.</p>
          </div>
          <button
            onClick={() => toggleLibrarySave(!librarySave)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${librarySave ? "bg-[#006EDC]" : "bg-[#E2E8F0]"}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${librarySave ? "translate-x-5" : "translate-x-1"}`} />
          </button>
        </div>

        <div className="border-t border-[#E2E8F0] pt-4">
          <p className="mb-2 text-sm text-[#3B4959]">Delete all saved CVs from your Library. This cannot be undone.</p>
          {libraryClearedMsg && (
            <p className="mb-2 text-xs text-emerald-600 font-medium">Library cleared.</p>
          )}
          <button
            onClick={handleClearLibrary}
            disabled={clearingLibrary}
            className="rounded-xl border border-[#dcdce3] px-4 py-2 text-sm font-medium text-red-500 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
          >
            {clearingLibrary ? "Clearing…" : "Clear my Library"}
          </button>
        </div>
      </div>

      {/* ── Export ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#dcdce3] bg-white p-6">
        <h2 className="mb-1 font-semibold text-[#131f2f]">Export my data</h2>
        <p className="mb-4 text-sm text-[#3B4959]">Download a JSON file of all your CV profiles, job searches, and tracker entries.</p>
        <button onClick={handleExport} disabled={exporting}
          className="rounded-xl border border-[#dcdce3] px-4 py-2 text-sm font-medium text-[#3B4959] transition hover:border-[#CCD0D5] hover:text-[#131f2f] disabled:opacity-50">
          {exporting ? "Exporting…" : "Download my data"}
        </button>
      </div>

      {/* ── Delete ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="mb-1 font-semibold text-red-600">Delete account</h2>
        <p className="mb-4 text-sm text-[#3B4959]">Permanently deletes your account and all associated data. This cannot be undone.</p>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#77838F]">
              Type <span className="text-red-500">DELETE MY ACCOUNT</span> to confirm
            </label>
            <input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="w-full rounded-xl border border-[#dcdce3] bg-white px-4 py-2.5 text-sm text-[#131f2f] placeholder:text-[#CCD0D5] focus:border-red-400 focus:outline-none transition" />
          </div>
          {deleteError && <p className="text-xs text-red-500">{deleteError}</p>}
          <button onClick={handleDelete} disabled={deleting || deleteConfirm !== "DELETE MY ACCOUNT"}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-40">
            {deleting ? "Deleting…" : "Delete my account permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl py-8 text-sm text-[#77838F]">Loading…</div>}>
      <SettingsContent />
    </Suspense>
  );
}
