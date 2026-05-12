"use client";

import { useEffect, useState, useCallback } from "react";
import type { TrackerEntry, TrackerStatus } from "@/lib/types";
import { TRACKER_COLUMNS } from "@/lib/types";

const COL = {
  saved:     { label: "Saved",     color: "text-[#3B4959]",    dot: "bg-[#CCD0D5]" },
  applied:   { label: "Applied",   color: "text-blue-600",     dot: "bg-blue-400" },
  screening: { label: "Screening", color: "text-[#006EDC]",   dot: "bg-[#2aacea]" },
  interview: { label: "Interview", color: "text-amber-600",    dot: "bg-amber-400" },
  offer:     { label: "Offer 🎉",  color: "text-emerald-600",  dot: "bg-emerald-400" },
  rejected:  { label: "Rejected",  color: "text-red-500",      dot: "bg-red-400" },
};

const DECISION_COLOR: Record<string, string> = {
  apply: "text-emerald-600",
  maybe: "text-amber-600",
  skip: "text-red-500",
};

export default function TrackerPage() {
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<TrackerStatus | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tracker");
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function moveEntry(id: string, status: TrackerStatus) {
    const payload: Record<string, string> = { id, status };
    if (status === "applied") payload.applied_at = new Date().toISOString();
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    await fetch("/api/tracker", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#006EDC] border-t-transparent" />
    </div>
  );

  const byStatus = (s: TrackerStatus) => entries.filter((e) => e.status === s);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#131f2f]">Application Tracker</h1>
        <p className="mt-2 text-[#77838F]">Drag cards between columns to update status.</p>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dcdce3] py-28 text-center">
          <div className="text-5xl">📌</div>
          <p className="mt-4 font-semibold text-[#3B4959]">No applications tracked yet</p>
          <p className="mt-1 text-sm text-[#77838F]">Save jobs from the Job Feed to start tracking</p>
          <a href="/jobs" className="mt-4 rounded-xl bg-[#006EDC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0060C7] transition">
            Go to Job Feed →
          </a>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-6">
          {TRACKER_COLUMNS.map((col) => {
            const meta = COL[col];
            const cards = byStatus(col);
            return (
              <div
                key={col}
                onDragOver={(e) => { e.preventDefault(); setDragOver(col); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => { if (dragging) { moveEntry(dragging, col); setDragging(null); setDragOver(null); } }}
                className={`flex w-64 shrink-0 flex-col rounded-2xl border p-3 transition-all ${
                  dragOver === col
                    ? "border-[#006EDC]/30 bg-[#e6f2fe]"
                    : "border-[#dcdce3] bg-[#F5F9FC]"
                }`}
              >
                {/* Column header */}
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    <span className={`text-sm font-semibold ${meta.color}`}>{meta.label}</span>
                  </div>
                  <span className="rounded-full bg-[#dcdce3] px-2 py-0.5 text-xs text-[#3B4959]">
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {cards.map((entry) => (
                    <div
                      key={entry.id}
                      draggable
                      onDragStart={() => setDragging(entry.id)}
                      onDragEnd={() => setDragging(null)}
                      className={`cursor-grab rounded-xl border border-[#dcdce3] bg-white p-3.5 transition active:cursor-grabbing active:opacity-60 ${
                        dragging === entry.id ? "opacity-40" : ""
                      }`}
                    >
                      <p className="text-sm font-medium leading-snug text-[#131f2f] line-clamp-2">
                        {entry.job?.job_title ?? "Unknown Role"}
                      </p>
                      <p className="mt-1 text-xs text-[#77838F]">{entry.job?.company_name ?? "—"}</p>
                      {(entry.job?.ats_score != null || entry.job?.relocation_score != null) && (
                        <div className="mt-2.5 flex gap-3">
                          {entry.job.ats_score != null && (
                            <span className="text-[11px] text-[#77838F]">
                              ATS <span className="font-semibold text-[#3B4959]">{entry.job.ats_score}%</span>
                            </span>
                          )}
                          {entry.job.relocation_score != null && (
                            <span className="text-[11px] text-[#77838F]">
                              Reloc <span className="font-semibold text-[#3B4959]">{entry.job.relocation_score}%</span>
                            </span>
                          )}
                        </div>
                      )}
                      {entry.job?.decision && (
                        <p className={`mt-1.5 text-[11px] font-bold uppercase tracking-wide ${DECISION_COLOR[entry.job.decision] ?? "text-[#77838F]"}`}>
                          {entry.job.decision}
                        </p>
                      )}
                    </div>
                  ))}

                  {cards.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#dcdce3] py-6 text-center text-xs text-[#CCD0D5]">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
