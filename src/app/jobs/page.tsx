"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import JobCard from "@/components/JobCard";
import { buildCVPrintHTML } from "@/lib/cvPdf";
import type { CVData } from "@/app/api/cv/generate/route";
import type { CVProfile, Job } from "@/lib/types";
import { SUPPORTED_COUNTRIES, COMING_SOON_COUNTRIES } from "@/lib/types";
import { getBrowserClient } from "@/lib/supabase-browser";

type Filter = "all" | "apply" | "maybe";

interface GenerateResult {
  cv_en: CVData | null;
  cv_fr: CVData | null;
  keywords_targeted: string[];
  missing_skills: string[];
  ats_tips: string[];
  required_language: "english" | "french" | "both";
  validation?: { valid: boolean; warnings: string[] };
  meta: { candidate: string; jobs_count: number; job_titles: string[] };
}

type Stage = "idle" | "scanning" | "scoring" | "done";

export default function JobFeedPage() {
  const [cv, setCv] = useState<CVProfile | null>(null);
  const [cvLoading, setCvLoading] = useState(true);

  const [jobTitle, setJobTitle] = useState("");
  const [country, setCountry] = useState<string>("Canada");
  const [visaOnly, setVisaOnly] = useState(false);
  const [filter, setFilter] = useState<Filter>("apply");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [queries, setQueries] = useState<string[]>([]);
  const [visaFilteredBanner, setVisaFilteredBanner] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<GenerateResult | null>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"english" | "french">("english");
  const [copied, setCopied] = useState<"english" | "french" | null>(null);
  const [chosenLang, setChosenLang] = useState<"english" | "french" | "both">("english");

  const [showManual, setShowManual] = useState(false);

  // Restore jobs from sessionStorage on mount (survives tab navigation)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("jobradar_jobs");
      if (saved) {
        const parsed = JSON.parse(saved) as { jobs: Job[]; queries: string[] };
        if (parsed.jobs?.length) {
          setJobs(parsed.jobs);
          setQueries(parsed.queries ?? []);
          setStage("done");
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const cvId = localStorage.getItem("cv_id");
    if (!cvId) { setCvLoading(false); return; }
    getBrowserClient()
      .from("cv_profiles").select("*").eq("id", cvId).single()
      .then(({ data }) => {
        if (data) setCv(data as CVProfile);
        setCvLoading(false);
      });
  }, []);

  async function runFetch(scanMode: boolean) {
    if (scanMode && !cv) { setError("Upload your CV first to use scan mode"); return; }
    if (!scanMode && !cv && !jobTitle.trim()) { setError("Enter a job title or upload your CV"); return; }

    setError(null);
    setJobs([]);
    setQueries([]);
    setSelectedIds(new Set());
    setGenResult(null);
    setStage("scanning");

    const cvId = localStorage.getItem("cv_id");
    try {
      const res = await fetch("/api/jobs/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: jobTitle.trim(),
          country,
          visaOnly,
          cvId,
          scanMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to fetch jobs"); setStage("idle"); return; }

      const fetched: Job[] = data.jobs ?? [];
      const fetchedQueries: string[] = data.queries ?? [];
      setQueries(fetchedQueries);
      setJobs(fetched);
      setVisaFilteredBanner(!!data.visaFilteredBanner);
      sessionStorage.setItem("jobradar_jobs", JSON.stringify({ jobs: fetched, queries: fetchedQueries }));
      setStage("scoring");

      if (cvId && fetched.length > 0) {
        try {
          const scoreRes = await fetch("/api/jobs/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cvId, jobIds: fetched.map((j) => j.id) }),
          });
          const scoreData = await scoreRes.json();
          if (scoreRes.ok) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const scoreMap = new Map((scoreData.scored ?? []).map((s: any) => [s.id, s]));
            setJobs((prev) => {
              const updated = prev.map((j) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const s = scoreMap.get(j.id) as any;
                return s ? { ...j, ats_score: s.ats_score, relocation_score: s.relocation_score, decision: s.decision, score_reasoning: s.reasoning } : j;
              });
              // Persist scored jobs so navigation doesn't lose them
              sessionStorage.setItem("jobradar_jobs", JSON.stringify({ jobs: updated, queries }));
              return updated;
            });
          }
        } catch { /* scoring failure is non-fatal */ }
      }
    } catch {
      setError("Network error");
    } finally {
      setStage("done");
    }
  }

  function detectLang(ids: Set<string>): "english" | "french" | "both" {
    const selected = jobs.filter((j) => ids.has(j.id));
    const frenchRe = /\bquébec\b|\bquebec\b|\bQC\b|montréal|montreal|\bfrançais\b|french.*required|required.*french|bilingual|bilingue/i;
    let hasFr = false, hasEn = false;
    for (const j of selected) {
      const text = `${j.location ?? ""} ${j.job_description ?? ""} ${j.job_title ?? ""}`;
      if (frenchRe.test(text)) hasFr = true; else hasEn = true;
    }
    if (hasFr && hasEn) return "both";
    if (hasFr) return "french";
    return "english";
  }

  function toggleSelect(job: Job, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(job.id) : next.delete(job.id);
      setChosenLang(detectLang(next));
      return next;
    });
  }

  const displayed_sorted = [...jobs].sort((a, b) => {
    const ORDER = { apply: 0, maybe: 1, skip: 2 };
    const da = ORDER[a.decision ?? "skip"] ?? 2;
    const db = ORDER[b.decision ?? "skip"] ?? 2;
    return da !== db ? da - db : (b.ats_score ?? 0) - (a.ats_score ?? 0);
  });

  const displayed = displayed_sorted.filter((j) => {
    if (visaOnly && j.visa_sponsorship_likelihood === "low") return false;
    if (filter === "apply") return j.decision === "apply" || j.decision === null;
    if (filter === "maybe") return j.decision === "apply" || j.decision === "maybe";
    return true;
  });

  const applyCount = jobs.filter((j) => j.decision === "apply").length;
  const maybeCount = jobs.filter((j) => j.decision === "maybe").length;
  const skipCount = jobs.filter((j) => j.decision === "skip").length;

  async function generateCV() {
    const cvId = localStorage.getItem("cv_id");
    if (!cvId) { setGenError("Upload your CV first"); return; }
    if (!selectedIds.size) { setGenError("Select at least one job"); return; }
    setGenerating(true); setGenResult(null); setGenError(null);
    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId, jobIds: [...selectedIds], forceLang: chosenLang }),
      });
      const data = await res.json();
      if (!res.ok) { setGenError(data.error ?? "Generation failed"); return; }
      const result = data as GenerateResult;
      setGenResult(result);
      // Auto-select the primary language tab
      setActiveTab(result.required_language === "french" ? "french" : "english");
      setTimeout(() => document.getElementById("cv-result")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setGenError("Network error"); }
    finally { setGenerating(false); }
  }

  async function copyCV(lang: "english" | "french") {
    const data = lang === "english" ? genResult?.cv_en : genResult?.cv_fr;
    if (!data) return;
    // Build a readable plain text from structured data for clipboard
    const lines = [
      data.header.name, data.header.title,
      [data.header.phone, data.header.email, data.header.location, data.header.linkedin].filter(Boolean).join(" | "),
      "",
      "PROFESSIONAL SUMMARY", data.summary, "",
      "WORK EXPERIENCE",
      ...(data.experience ?? []).flatMap((e) => [
        `${e.date}${e.location ? " | " + e.location : ""}`,
        e.title, e.company,
        ...(e.bullets ?? []).map((b) => `• ${b}`), "",
      ]),
      "SKILLS", (data.skills ?? []).join(", "), "",
      "EDUCATION",
      ...(data.education ?? []).flatMap((e) => [`${e.date} | ${e.degree}`, e.institution, ""]),
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(lang);
    setTimeout(() => setCopied(null), 2000);
  }

  async function downloadPDF(lang: "english" | "french") {
    const data = lang === "english" ? genResult?.cv_en : genResult?.cv_fr;
    if (!data) return;

    const filename = `${(data.header.name ?? "CV").replace(/\s+/g, "_")}_${lang === "french" ? "FR" : "EN"}.pdf`;
    const html = buildCVPrintHTML(data);

    const wrapper = document.createElement("div");
    wrapper.style.cssText = "position:absolute;left:-9999px;top:0;";
    wrapper.innerHTML = DOMPurify.sanitize(html);
    document.body.appendChild(wrapper);
    const root = wrapper.firstElementChild as HTMLElement;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf = (await import("html2pdf.js" as any)).default;
      await html2pdf()
        .set({
          margin: 0,
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, width: 794 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(root)
        .save();
    } finally {
      document.body.removeChild(wrapper);
    }
  }

  async function saveJob(job: Job) {
    try {
      const res = await fetch("/api/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: job.id }),
      });
      if (res.ok || res.status === 409) setSavedIds((prev) => new Set([...prev, job.id]));
    } catch { /* silent */ }
  }

  const isLoading = stage === "scanning" || stage === "scoring";

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#131f2f]">Job Feed</h1>
        <p className="mt-2 text-[#77838F]">Scan Job Bank, match against your CV, and generate a bilingual Canadian CV.</p>
      </div>

      {/* CV banner */}
      {!cvLoading && (
        cv ? (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#dcdce3] bg-white px-4 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm">✓</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#131f2f]">{cv.full_name}</p>
              <p className="truncate text-xs text-[#77838F]">{cv.current_job_title} · {cv.years_of_experience}y exp · {cv.technical_skills?.slice(0, 3).join(", ")}</p>
            </div>
            <span className="ml-auto shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">CV Ready</span>
          </div>
        ) : (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5">
            <span className="text-amber-500">⚠</span>
            <span className="text-sm text-amber-600">No CV uploaded — AI matching won&apos;t work without it</span>
            <a href="/upload" className="ml-auto shrink-0 text-sm font-semibold text-amber-600 underline underline-offset-2 hover:text-amber-700">Upload now →</a>
          </div>
        )
      )}

      {/* Main action panel */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">

        {/* Scan mode — primary action */}
        {cv && (
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-[#131f2f]">Scan Job Bank for your profile</p>
                <p className="mt-1 text-sm text-[#77838F]">
                  AI generates search queries from your CV, scans Job Bank, scores every result, and shows matches.
                </p>
              </div>
              <button
                onClick={() => runFetch(true)}
                disabled={isLoading}
                className="shrink-0 rounded-xl bg-[#006EDC] px-6 py-3 font-semibold text-white shadow-lg shadow-[#006EDC]/15 transition hover:bg-[#0060C7] disabled:opacity-50"
              >
                {stage === "scanning" ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Scanning…
                  </span>
                ) : stage === "scoring" ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Scoring…
                  </span>
                ) : "Scan Job Bank"}
              </button>
            </div>

            {/* Options row */}
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#e8e9eb] pt-4">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[#77838F]">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="rounded-lg border border-[#dcdce3] bg-white px-3 py-1.5 text-sm text-[#131f2f] focus:border-[#006EDC] focus:outline-none"
                >
                  {SUPPORTED_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  {COMING_SOON_COUNTRIES.map((c) => <option key={c} value={c} disabled>{c} (Coming soon)</option>)}
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-2 pt-4">
                <input type="checkbox" checked={visaOnly} onChange={(e) => setVisaOnly(e.target.checked)} className="h-4 w-4 rounded accent-[#006EDC]" />
                <span className="text-sm text-[#3B4959]">Visa sponsorship only</span>
              </label>
              <button
                onClick={() => setShowManual((v) => !v)}
                className="ml-auto pt-4 text-xs text-[#77838F] underline underline-offset-2 hover:text-[#192838] transition"
              >
                {showManual ? "Hide manual search" : "Search manually instead"}
              </button>
            </div>
          </div>
        )}

        {/* Manual search — shown when no CV or toggled */}
        {(!cv || showManual) && (
          <div className={`p-6 ${cv ? "border-t border-[#e8e9eb]" : ""}`}>
            {cv && <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#77838F]">Manual search</p>}
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-48 flex-1">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#77838F]">Job Title</label>
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runFetch(false)}
                  placeholder={cv?.current_job_title ?? "e.g. Production Manager"}
                  className="w-full rounded-xl border border-[#dcdce3] bg-white px-4 py-2.5 text-sm text-[#131f2f] placeholder:text-[#77838F] focus:border-[#006EDC] focus:outline-none transition"
                />
              </div>
              {!cv && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#77838F]">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="rounded-xl border border-[#dcdce3] bg-white px-4 py-2.5 text-sm text-[#131f2f] focus:border-[#006EDC] focus:outline-none"
                  >
                    {SUPPORTED_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  {COMING_SOON_COUNTRIES.map((c) => <option key={c} value={c} disabled>{c} (Coming soon)</option>)}
                  </select>
                </div>
              )}
              <button
                onClick={() => runFetch(false)}
                disabled={isLoading}
                className="rounded-xl border border-[#dcdce3] px-5 py-2.5 text-sm font-semibold text-[#3B4959] transition hover:border-[#CCD0D5] hover:text-[#131f2f] disabled:opacity-50"
              >
                {isLoading ? "Searching…" : "Search"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Queries used */}
      {queries.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#77838F]">Searched:</span>
          {queries.map((q) => (
            <span key={q} className="rounded-full border border-[#dcdce3] bg-[#e5ecf2] px-2.5 py-0.5 text-xs text-[#3B4959]">
              {q}
            </span>
          ))}
        </div>
      )}

      {/* Progress states */}
      {stage === "scanning" && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#b3d4f5] bg-[#e6f2fe] px-4 py-3.5">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#006EDC] border-t-transparent" />
          <div>
            <p className="text-sm font-medium text-[#00366B]">Scanning Job Bank…</p>
            <p className="text-xs text-[#77838F]">Generating search queries from your CV and fetching listings</p>
          </div>
        </div>
      )}
      {stage === "scoring" && jobs.length > 0 && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <div>
            <p className="text-sm font-medium text-blue-700">Scoring {jobs.length} jobs against your CV…</p>
            <p className="text-xs text-[#77838F]">Calculating ATS match and relocation likelihood</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Filter bar */}
      {jobs.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5">
            <FilterBtn label={`Apply (${applyCount})`} active={filter === "apply"} onClick={() => setFilter("apply")} color="emerald" />
            <FilterBtn label={`Maybe (${maybeCount})`} active={filter === "maybe"} onClick={() => setFilter("maybe")} color="amber" />
            <FilterBtn label={`All (${jobs.length})`} active={filter === "all"} onClick={() => setFilter("all")} color="slate" />
          </div>
          <div className="flex items-center gap-3">
            {skipCount > 0 && <span className="text-xs text-[#77838F]">{skipCount} poor match{skipCount !== 1 ? "es" : ""} hidden</span>}
            <button onClick={() => setSelectedIds(new Set(displayed.map((j) => j.id)))} className="text-xs text-[#77838F] underline underline-offset-2 hover:text-[#192838] transition">Select all</button>
            {selectedIds.size > 0 && <button onClick={() => setSelectedIds(new Set())} className="text-xs text-[#77838F] underline underline-offset-2 hover:text-[#192838] transition">Clear</button>}
          </div>
        </div>
      )}

      {/* Empty state */}
      {stage === "idle" && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dcdce3] py-28 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5ecf2] text-3xl">🎯</div>
          <p className="mt-5 font-semibold text-[#3B4959]">
            {cv ? "Ready to scan Job Bank" : "Upload your CV to get started"}
          </p>
          <p className="mt-1.5 text-sm text-[#77838F]">
            {cv
              ? `Will auto-search based on your profile: "${cv.current_job_title}"`
              : "AI needs your CV to find and score matching jobs"}
          </p>
          {cv && (
            <button
              onClick={() => runFetch(true)}
              className="mt-6 rounded-xl bg-[#006EDC] px-6 py-3 font-semibold text-white shadow-lg shadow-[#006EDC]/15 transition hover:bg-[#0060C7]"
            >
              Scan Job Bank →
            </button>
          )}
        </div>
      )}

      {stage === "done" && jobs.length > 0 && displayed.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dcdce3] py-20 text-center">
          <p className="font-semibold text-[#77838F]">No jobs match the current filter</p>
          <button onClick={() => setFilter("all")} className="mt-2 text-sm text-[#006EDC] underline underline-offset-2 hover:text-[#00366B] transition">
            Show all {jobs.length} jobs
          </button>
        </div>
      )}

      {/* Visa filter banner — shown when >80% of Adzuna results were removed by the visa filter */}
      {visaFilteredBanner && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Filtering for visa-friendly roles only — fewer results available. Try unchecking &quot;Visa filter&quot; to see all jobs.
        </div>
      )}

      {/* Job grid */}
      {displayed.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSave={saveJob}
              saved={savedIds.has(job.id)}
              selected={selectedIds.has(job.id)}
              onSelect={toggleSelect}
            />
          ))}
        </div>
      )}

      {/* Floating action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-4">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#dcdce3] bg-white/95 px-5 py-3.5 shadow-2xl shadow-[#CCD0D5]/60 backdrop-blur-md">

            {/* Job count */}
            <div className="text-sm">
              <span className="font-bold tabular-nums text-[#006EDC]">{selectedIds.size}</span>
              <span className="ml-1 text-[#3B4959]">job{selectedIds.size !== 1 ? "s" : ""} selected</span>
            </div>

            <div className="h-4 w-px bg-[#dcdce3]" />

            {/* Language picker */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-[#77838F]">Language:</span>
              {(["french", "english", "both"] as const).map((l) => {
                const flag = l === "french" ? "🇫🇷" : l === "english" ? "🇬🇧" : "🌐";
                const label = l === "french" ? "French" : l === "english" ? "English" : "Both";
                const isAuto = l === detectLang(selectedIds);
                return (
                  <button
                    key={l}
                    onClick={() => setChosenLang(l)}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      chosenLang === l
                        ? "bg-[#E6F2FD] text-[#00366B] ring-1 ring-[#006EDC]/30"
                        : "text-[#77838F] hover:bg-[#e5ecf2] hover:text-[#192838]"
                    }`}
                  >
                    {flag} {label}
                    {isAuto && chosenLang !== l && (
                      <span className="ml-0.5 text-[9px] text-emerald-600">rec.</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-[#dcdce3]" />

            {/* Generate button */}
            <button
              onClick={generateCV}
              disabled={generating}
              className="rounded-xl bg-[#006EDC] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#006EDC]/25 transition hover:bg-[#0060C7] disabled:opacity-50"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating…
                </span>
              ) : (
                <>Generate CV</>
              )}
            </button>

            {/* Dismiss */}
            <button onClick={() => setSelectedIds(new Set())} className="text-[#CCD0D5] transition hover:text-[#3B4959]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {genError && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{genError}</div>}

      {/* CV Generation Result */}
      {genResult && (
        <div id="cv-result" className="mt-10 space-y-5">
          {/* Validation warning banner */}
          {genResult.validation && !genResult.validation.valid && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <strong className="font-semibold">Review carefully before submitting:</strong> The AI may have missed some details from your profile.
              <ul className="mt-1.5 list-disc pl-4 text-xs text-amber-600 space-y-0.5">
                {genResult.validation.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">
            <div className="h-1 w-full bg-gradient-to-r from-[#006EDC] via-[#0052A3] to-[#2aacea]" />
            <div className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6F2FD] text-xl">🇨🇦</div>
              <div>
                <h2 className="font-bold text-[#131f2f]">Canadian ATS CV Generated</h2>
                <p className="mt-0.5 text-sm text-[#77838F]">Optimized for: {genResult.meta.job_titles.join(" · ")}</p>
              </div>
              <span className="ml-auto rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                {genResult.meta.jobs_count} job{genResult.meta.jobs_count !== 1 ? "s" : ""} analyzed
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <InfoBox title="Keywords Targeted" items={genResult.keywords_targeted} color="violet" />
            <InfoBox title="Missing Skills" items={genResult.missing_skills} color="amber" />
            <InfoBox title="ATS Tips" items={genResult.ats_tips} color="blue" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">
            <div className="flex items-center border-b border-[#e8e9eb]">
              {genResult.cv_en && <TabBtn label="English" flag="🇬🇧" active={activeTab === "english"} onClick={() => setActiveTab("english")} badge={genResult.required_language === "english" ? "primary" : undefined} />}
              {genResult.cv_fr && <TabBtn label="French" flag="🇫🇷" active={activeTab === "french"} onClick={() => setActiveTab("french")} badge={genResult.required_language === "french" ? "primary" : undefined} />}
              <div className="ml-auto flex items-center gap-2 px-4">
                {genResult.required_language === "french" && <span className="text-[11px] text-blue-600">🇫🇷 French required</span>}
                {genResult.required_language === "both"   && <span className="text-[11px] text-[#006EDC]">Both detected</span>}
                <button onClick={() => copyCV(activeTab)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${copied === activeTab ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-[#dcdce3] text-[#3B4959] hover:border-[#CCD0D5] hover:text-[#192838]"}`}>
                  {copied === activeTab ? "✓ Copied" : "Copy text"}
                </button>
                <button onClick={() => downloadPDF(activeTab)} className="flex items-center gap-1.5 rounded-lg border border-[#b3d4f5] bg-[#e6f2fe] px-3 py-1.5 text-xs font-medium text-[#006EDC] transition hover:bg-[#E6F2FD]">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
            <CVPreview data={activeTab === "english" ? genResult.cv_en : genResult.cv_fr} />
          </div>
        </div>
      )}
    </div>
  );
}

function CVPreview({ data }: { data: CVData | null | undefined }) {
  if (!data || !data.header) return <div className="p-8 text-center text-sm text-[#77838F]">No data for this language.</div>;
  const h = data.header;

  const contactLine1 = [h.email, h.linkedin].filter(Boolean).join(" | ");
  const contactLine2 = [h.location, h.phone].filter(Boolean).join(" | ");

  return (
    <div className="max-h-[72vh] overflow-auto px-8 py-6 text-[#333] font-sans">
      {/* Header — centered */}
      <div className="mb-4 text-center">
        <p className="text-xl font-bold text-[#1a1a1a] leading-tight">{h.name}</p>
        {h.title && <p className="mt-1 text-sm text-[#555]">{h.title}</p>}
        <div className="mt-2 text-xs text-[#444] leading-relaxed">
          {contactLine1 && <div>{contactLine1}</div>}
          {contactLine2 && <div>{contactLine2}</div>}
        </div>
      </div>

      {/* Summary — no heading */}
      {data.summary && (
        <p className="mb-4 text-xs leading-relaxed text-[#333]">{data.summary}</p>
      )}

      {/* Experience */}
      {data.experience?.length ? (
        <PreviewSection title="Work Experience">
          {data.experience.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-bold text-[#1a1a1a]">{e.title}</p>
                <p className="shrink-0 text-[11px] text-[#555]">{e.date}</p>
              </div>
              <p className="text-[11px] italic text-[#555] mb-1.5">{e.company}{e.location ? ` | ${e.location}` : ""}</p>
              <ul className="ml-4 space-y-0.5 list-disc">
                {e.bullets.map((b, j) => <li key={j} className="text-[11px] text-[#333]">{b}</li>)}
              </ul>
            </div>
          ))}
        </PreviewSection>
      ) : null}

      {/* Skills */}
      {data.skills?.length ? (
        <PreviewSection title="Skills">
          <ul className="ml-4 columns-2 gap-4 list-disc">
            {data.skills.map((s, i) => <li key={i} className="text-[11px] text-[#333] mb-0.5 break-inside-avoid">{s}</li>)}
          </ul>
        </PreviewSection>
      ) : null}

      {/* Education */}
      {data.education?.length ? (
        <PreviewSection title="Education">
          {data.education.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-bold text-[#1a1a1a]">{e.institution}</p>
                <p className="shrink-0 text-[11px] text-[#555]">{e.date}</p>
              </div>
              <p className="text-[11px] text-[#444] mt-0.5">
                <span className="font-semibold">Degree</span> &nbsp;{e.degree}{e.location ? ` · ${e.location}` : ""}
              </p>
            </div>
          ))}
        </PreviewSection>
      ) : null}

      {/* Languages */}
      {data.languages?.length ? (
        <PreviewSection title="Languages">
          <div className="space-y-2">
            {data.languages.map((l, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-[#1a1a1a]">{l.name}</span>
                  <span className="text-[11px] text-[#555]">{l.level}</span>
                </div>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[#e0e0e0]">
                  <div className="h-full rounded-full bg-[#006EDC]" style={{ width: `${levelToPct(l.level)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </PreviewSection>
      ) : null}

      {/* Certifications */}
      {data.certifications?.length ? (
        <PreviewSection title="Certifications">
          <ul className="ml-4 space-y-0.5 list-disc">
            {data.certifications.map((c, i) => <li key={i} className="text-[11px] text-[#333]">{c}</li>)}
          </ul>
        </PreviewSection>
      ) : null}
    </div>
  );
}

function levelToPct(level: string): number {
  const l = level.toLowerCase();
  if (/native|matern|bilingue|courant/.test(l)) return 100;
  if (/advanc|avancé|professional|professionnel/.test(l)) return 80;
  if (/intermediate|interméd/.test(l)) return 55;
  if (/basic|débutant|notion/.test(l)) return 30;
  const num = l.match(/(\d)\/5/);
  if (num) return (parseInt(num[1]) / 5) * 100;
  return 50;
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="mb-1.5 border-b border-[#aaaaaa] pb-0.5 text-xs font-bold text-[#1a1a1a]">{title}</h3>
      {children}
    </div>
  );
}

function FilterBtn({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color: "emerald" | "amber" | "slate" }) {
  const activeClass = { emerald: "border-emerald-200 bg-emerald-50 text-emerald-600", amber: "border-amber-200 bg-amber-50 text-amber-600", slate: "border-[#CCD0D5] bg-[#e5ecf2] text-[#131f2f]" }[color];
  return (
    <button onClick={onClick} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${active ? activeClass : "border-[#dcdce3] text-[#77838F] hover:border-[#CCD0D5] hover:text-[#3B4959]"}`}>
      {label}
    </button>
  );
}

function TabBtn({ label, flag, active, onClick, badge }: { label: string; flag: string; active: boolean; onClick: () => void; badge?: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition border-b-2 ${active ? "border-[#006EDC] text-[#131f2f]" : "border-transparent text-[#77838F] hover:text-[#192838]"}`}>
      <span>{flag}</span>
      <span>{label}</span>
      {badge === "primary" && (
        <span className="rounded-full bg-[#E6F2FD] px-1.5 py-0.5 text-[10px] font-bold text-[#006EDC]">Required</span>
      )}
    </button>
  );
}

function InfoBox({ title, items, color }: { title: string; items: string[]; color: "violet" | "amber" | "blue" }) {
  const headerCls = { violet: "text-[#006EDC]", amber: "text-amber-600", blue: "text-blue-600" }[color];
  return (
    <div className="rounded-xl bg-[#F5F9FC] p-4">
      <p className={`mb-3 text-xs font-semibold uppercase tracking-widest ${headerCls}`}>{title}</p>
      {items?.length ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#3B4959]">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#CCD0D5]" />
              {item}
            </li>
          ))}
        </ul>
      ) : <p className="text-xs text-[#77838F]">None</p>}
    </div>
  );
}
