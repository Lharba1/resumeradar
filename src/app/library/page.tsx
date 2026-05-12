"use client";

import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { renderTemplate, TEMPLATES, type TemplateId } from "@/lib/cvTemplates";
import type { CVData } from "@/app/api/cv/generate/route";

interface LibraryItem {
  id: string;
  job_title: string | null;
  company: string | null;
  job_description_snippet: string | null;
  ats_score_before: number | null;
  ats_score_after: number | null;
  validation_warnings: string[];
  expires_at: string;
  created_at: string;
}

export default function LibraryPage() {
  const [items, setItems]             = useState<LibraryItem[]>([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [loading, setLoading]         = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [deleting, setDeleting]       = useState<string | null>(null);
  const [template, setTemplate]       = useState<TemplateId>("classic");
  const printRef = useRef<HTMLDivElement>(null);

  async function load(p = 1) {
    setLoading(true);
    const res  = await fetch(`/api/library/cvs?page=${p}`);
    const data = await res.json();
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
    setPage(p);
    setLoading(false);
  }

  useEffect(() => { load(1); }, []);

  async function handleDownload(id: string) {
    setDownloading(id);
    try {
      const res  = await fetch(`/api/library/cvs/${id}`);
      const data = await res.json();
      const html = renderTemplate(template, data.cv_data as CVData);

      if (!printRef.current) return;
      printRef.current.innerHTML = DOMPurify.sanitize(html);

      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `cv-${id.slice(0, 8)}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from((printRef.current.firstElementChild as HTMLElement) ?? printRef.current)
        .save();

      printRef.current.innerHTML = "";
    } finally {
      setDownloading(null);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/library/cvs/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    setTotal((t) => t - 1);
    setDeleting(null);
  }

  const totalPages = Math.ceil(total / 20);
  const daysUntilExpiry = (exp: string) =>
    Math.max(0, Math.round((new Date(exp).getTime() - Date.now()) / 86_400_000));

  return (
    <div className="max-w-3xl space-y-6">
      <div ref={printRef} className="fixed -left-[9999px] top-0" aria-hidden />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#131f2f]">My Library</h1>
          <p className="mt-1 text-sm text-[#77838F]">
            Your optimized CVs — saved automatically after each optimization.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <span className="rounded-full bg-[#EBF4FF] px-3 py-1 text-xs font-semibold text-[#006EDC]">
              {total} saved
            </span>
          )}
          <div className="flex gap-1.5">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                title={t.description}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  template === t.id
                    ? "border-[#006EDC] bg-[#EBF4FF] text-[#006EDC]"
                    : "border-[#E2E8F0] bg-white text-[#3B4959] hover:border-[#CCD0D5]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 flex items-start gap-3">
        <svg className="mt-0.5 shrink-0 text-[#77838F]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p className="text-xs text-[#3B4959]">
          CVs are stored securely and only visible to you. Free plan items expire after 90 days; paid plans after 1 year.
          You can turn off auto-save or delete all items in{" "}
          <a href="/settings" className="font-medium text-[#006EDC] underline">Settings</a>.
        </p>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#006EDC] border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-white px-8 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF4FF]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006EDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <p className="font-semibold text-[#131f2f]">No saved CVs yet</p>
          <p className="mt-1 text-sm text-[#77838F]">Optimize a CV for a job posting and it will appear here automatically.</p>
          <a href="/optimize" className="mt-4 inline-block rounded-xl bg-[#006EDC] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#005bb5]">
            Optimize a CV →
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const days     = daysUntilExpiry(item.expires_at);
            const expiring = days <= 14;
            const scoreUp  = item.ats_score_after !== null && item.ats_score_before !== null
              ? item.ats_score_after - item.ats_score_before : null;

            return (
              <div key={item.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    {/* Title */}
                    <p className="truncate font-semibold text-[#131f2f]">
                      {item.job_title ?? "Optimized CV"}
                      {item.company && <span className="font-normal text-[#77838F]"> · {item.company}</span>}
                    </p>

                    {/* JD snippet */}
                    {item.job_description_snippet && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-[#77838F]">{item.job_description_snippet}</p>
                    )}

                    {/* Meta row */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-[#77838F]">
                        {new Date(item.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                      </span>

                      {scoreUp !== null && (
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${scoreUp >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                          ATS {item.ats_score_before} → {item.ats_score_after} ({scoreUp >= 0 ? "+" : ""}{scoreUp})
                        </span>
                      )}

                      {expiring && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          Expires in {days}d
                        </span>
                      )}

                      {item.validation_warnings?.length > 0 && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                          {item.validation_warnings.length} warning{item.validation_warnings.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* Warnings */}
                    {item.validation_warnings?.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {item.validation_warnings.map((w, i) => (
                          <li key={i} className="text-[11px] text-red-600">⚠ {w}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => handleDownload(item.id)}
                      disabled={downloading === item.id}
                      className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#3B4959] transition hover:border-[#006EDC] hover:text-[#006EDC] disabled:opacity-50"
                    >
                      {downloading === item.id ? (
                        <span className="inline-block h-3 w-3 animate-spin rounded-full border border-[#006EDC] border-t-transparent" />
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      )}
                      Download
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#77838F] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === item.id ? (
                        <span className="inline-block h-3 w-3 animate-spin rounded-full border border-red-400 border-t-transparent" />
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => load(page - 1)}
            className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-sm text-[#3B4959] disabled:opacity-40 hover:bg-[#F5F9FC]">
            ← Prev
          </button>
          <span className="text-sm text-[#77838F]">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => load(page + 1)}
            className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-sm text-[#3B4959] disabled:opacity-40 hover:bg-[#F5F9FC]">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
