"use client";

import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { getBrowserClient } from "@/lib/supabase-browser";
import { buildCoverLetterHTML } from "@/lib/coverLetterPdf";
import type { CVProfile } from "@/lib/types";
import type { CoverLetterResult } from "@/app/api/cover-letter/route";
import LinkedInImport from "@/components/LinkedInImport";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const EXT_BADGE: Record<string, { label: string; cls: string }> = {
  pdf:  { label: "PDF",  cls: "bg-red-50   border-red-200   text-red-600"    },
  docx: { label: "DOCX", cls: "bg-blue-50  border-blue-200  text-blue-600"   },
  pptx: { label: "PPTX", cls: "bg-amber-50 border-amber-200 text-amber-600"  },
  txt:  { label: "TXT",  cls: "bg-[#F5F9FC] border-[#dcdce3] text-[#3B4959]" },
};

type JobInputMode = "text" | "url";
type Step = "idle" | "parsing" | "generating";

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function CoverLetterPage() {
  // ── CV state ──
  const [cvs, setCvs]                   = useState<CVProfile[]>([]);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [cvFile,     setCvFile]         = useState<File | null>(null);
  const [extraFiles, setExtraFiles]     = useState<File[]>([]);
  const [cvDragging,  setCvDragging]    = useState(false);
  const [extDragging, setExtDragging]   = useState(false);
  const cvRef  = useRef<HTMLInputElement>(null);
  const extRef = useRef<HTMLInputElement>(null);

  // ── job input ──
  const [jobMode, setJobMode]   = useState<JobInputMode>("text");
  const [jobText, setJobText]   = useState("");
  const [jobUrl,  setJobUrl]    = useState("");

  // ── options ──
  const [language, setLanguage] = useState<"english" | "french">("english");

  // ── result ──
  const [step,     setStep]     = useState<Step>("idle");
  const [error,    setError]    = useState<string | null>(null);
  const [result,   setResult]   = useState<CoverLetterResult | null>(null);
  const [copying,  setCopying]  = useState(false);
  const [downloading, setDownloading] = useState(false);

  // ── load saved CVs ──
  useEffect(() => {
    const supabase = getBrowserClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("cv_profiles").select("id, full_name, current_job_title, created_at")
        .eq("user_id", user.id).order("created_at", { ascending: false });
      if (data?.length) {
        setCvs(data as CVProfile[]);
        const stored = localStorage.getItem("cv_id");
        const match  = (data as CVProfile[]).find((c) => c.id === stored);
        setSelectedCvId(match?.id ?? (data[0] as CVProfile).id ?? "");
      }
    });
  }, []);

  // ── file helpers ──
  function handleCvFile(f: File | null) {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf")) { setError("CV must be a PDF file."); return; }
    if (f.size > 2 * 1024 * 1024)               { setError("CV must be 2 MB or smaller."); return; }
    setError(null);
    setCvFile(f);
  }

  function addExtras(incoming: FileList | null) {
    if (!incoming) return;
    const allowed: File[] = [];
    const errors: string[] = [];
    for (const f of Array.from(incoming)) {
      const ext = f.name.toLowerCase().split(".").pop() ?? "";
      if (!["pdf","docx","pptx","txt"].includes(ext)) { errors.push(`${f.name}: unsupported`); continue; }
      if (f.size > 20 * 1024 * 1024)                  { errors.push(`${f.name}: exceeds 20 MB`); continue; }
      allowed.push(f);
    }
    if (errors.length) setError(errors.join(" · "));
    setExtraFiles((prev) => {
      const names = new Set(prev.map((p) => p.name));
      return [...prev, ...allowed.filter((f) => !names.has(f.name))].slice(0, 5);
    });
  }

  // ── generate ──
  async function handleGenerate() {
    const hasJob = jobMode === "text" ? jobText.trim().length >= 50 : jobUrl.trim().length > 0;
    if (!hasJob) {
      setError(jobMode === "text"
        ? "Paste the full job description (at least 50 characters)"
        : "Enter a valid job URL");
      return;
    }
    setError(null);
    setResult(null);

    let cvId = selectedCvId;

    // Parse uploaded CV first if provided
    if (cvFile) {
      setStep("parsing");
      try {
        const fd = new FormData();
        fd.append("cv", cvFile);
        for (const f of extraFiles) fd.append("extras", f);
        const res  = await fetch("/api/cv/parse", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "CV parsing failed"); setStep("idle"); return; }
        cvId = data.id;
        setCvs((prev) => [data as CVProfile, ...prev.filter((c) => c.id !== data.id)]);
        setSelectedCvId(cvId);
      } catch {
        setError("Network error while parsing CV");
        setStep("idle");
        return;
      }
    } else if (!cvId) {
      setError("Select a CV from your library or upload a new one");
      return;
    }

    setStep("generating");
    try {
      const res  = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv_id: cvId,
          job_description: jobMode === "text" ? jobText : undefined,
          job_url:         jobMode === "url"  ? jobUrl  : undefined,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Generation failed"); setStep("idle"); return; }
      setResult(data as CoverLetterResult);
    } catch {
      setError("Network error — please try again");
    } finally {
      setStep("idle");
    }
  }

  async function handleCopy() {
    if (!result) return;
    const text = [
      result.greeting,
      "",
      ...result.paragraphs,
      "",
      result.closing,
      result.candidate_name,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch { setError("Copy failed"); }
  }

  async function handleDownload() {
    if (!result) return;
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const html = buildCoverLetterHTML({
        candidate_name:     result.candidate_name,
        candidate_email:    result.candidate_contact.email,
        candidate_phone:    result.candidate_contact.phone,
        candidate_location: result.candidate_contact.location,
        candidate_linkedin: result.candidate_contact.linkedin,
        company_name: result.company_name,
        job_title:    result.job_title,
        greeting:     result.greeting,
        paragraphs:   result.paragraphs,
        closing:      result.closing,
      });
      const container = document.createElement("div");
      container.innerHTML = DOMPurify.sanitize(html);
      document.body.appendChild(container);
      await html2pdf()
        .set({
          margin: 0,
          filename: `Cover_Letter_${(result.job_title ?? "role").replace(/\s+/g, "_")}_${(result.candidate_name ?? "").replace(/\s+/g, "_")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(container).save();
      document.body.removeChild(container);
    } catch { setError("PDF download failed"); }
    finally  { setDownloading(false); }
  }

  const isLoading = step !== "idle";
  const canSubmit = !isLoading && (!!cvFile || !!selectedCvId);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#131f2f]">Cover Letter Generator</h1>
        <p className="mt-2 text-[#77838F]">
          AI writes a persuasive, personalised cover letter from your CV and any job description or URL.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[440px_1fr]">

        {/* ═══════════════════════════════════════════════
            Left panel
        ═══════════════════════════════════════════════ */}
        <div className="space-y-4">

          {/* ── LinkedIn import ── */}
          <LinkedInImport onImported={(id, name) => {
            setSelectedCvId(id);
            setCvFile(null);
            setCvs((prev) => prev.find((c) => c.id === id) ? prev : [{ id, full_name: name, current_job_title: "", created_at: new Date().toISOString() } as CVProfile, ...prev]);
          }} />

          {/* ── CV card ── */}
          <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
            <p className="mb-3 text-sm font-semibold text-[#131f2f]">Your CV</p>

            {cvs.length > 0 && (
              <div className="mb-3">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#77838F]">
                  From library
                  {cvFile && <span className="ml-2 rounded bg-[#e5ecf2] px-1.5 py-0.5 text-[9px] font-normal normal-case text-[#77838F]">overridden by upload below</span>}
                </label>
                <select
                  value={selectedCvId}
                  onChange={(e) => { setSelectedCvId(e.target.value); setCvFile(null); setError(null); }}
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm text-[#131f2f] focus:border-[#006EDC] focus:outline-none focus:ring-2 focus:ring-[#006EDC]/20 transition ${
                    cvFile ? "border-[#dcdce3] bg-[#f9fafb] opacity-50" : "border-[#dcdce3] bg-[#F5F9FC]"
                  }`}
                >
                  {cvs.map((cv) => (
                    <option key={cv.id} value={cv.id}>
                      {cv.full_name ?? "Unnamed"} — {cv.current_job_title ?? "No title"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-[#e8e9eb]" />
              <span className="text-[11px] text-[#b0b8c1]">{cvs.length > 0 ? "or upload a different one" : "upload your CV"}</span>
              <div className="h-px flex-1 bg-[#e8e9eb]" />
            </div>

            <div
              onClick={() => cvRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setCvDragging(true); }}
              onDragLeave={() => setCvDragging(false)}
              onDrop={(e) => { e.preventDefault(); setCvDragging(false); handleCvFile(e.dataTransfer.files[0]); }}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3.5 transition-all ${
                cvDragging ? "border-[#006EDC] bg-[#e6f2fe]"
                : cvFile   ? "border-emerald-400 bg-emerald-50"
                : "border-[#dcdce3] bg-[#F5F9FC] hover:border-[#CCD0D5] hover:bg-white"
              }`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cvFile ? "bg-emerald-100" : "bg-[#e5ecf2]"}`}>
                {cvFile ? <span className="text-sm">📄</span>
                  : <svg className="h-4 w-4 text-[#77838F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>}
              </div>
              {cvFile ? (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-emerald-700">{cvFile.name}</p>
                  <p className="text-xs text-[#77838F]">{(cvFile.size / 1024).toFixed(1)} KB ·{" "}
                    <button className="text-red-400 hover:underline" onClick={(e) => { e.stopPropagation(); setCvFile(null); }}>remove</button>
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[#3B4959]">Drop CV PDF or <span className="text-[#006EDC]">browse</span></p>
                  <p className="text-xs text-[#b0b8c1]">PDF only · max 2 MB</p>
                </div>
              )}
            </div>
            <input ref={cvRef} type="file" accept=".pdf,application/pdf" className="hidden"
              onChange={(e) => handleCvFile(e.target.files?.[0] ?? null)} />

            {/* Extras */}
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#77838F]">
                Project docs &amp; portfolio{" "}
                <span className="rounded bg-[#E6F2FD] px-1.5 py-0.5 text-[9px] font-bold text-[#006EDC] normal-case">optional</span>
              </label>
              <div
                onClick={() => extRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setExtDragging(true); }}
                onDragLeave={() => setExtDragging(false)}
                onDrop={(e) => { e.preventDefault(); setExtDragging(false); addExtras(e.dataTransfer.files); }}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 transition-all ${
                  extDragging ? "border-[#006EDC] bg-[#e6f2fe]" : "border-[#dcdce3] bg-[#F5F9FC] hover:border-[#CCD0D5] hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-1">
                  {["PPTX","DOCX","PDF","TXT"].map((t) => (
                    <span key={t} className="rounded border border-[#dcdce3] bg-white px-1 py-0.5 text-[9px] font-bold text-[#3B4959]">{t}</span>
                  ))}
                </div>
                <span className="text-sm text-[#3B4959]">Drop or <span className="text-[#006EDC]">browse</span></span>
              </div>
              <input ref={extRef} type="file" multiple
                accept=".pdf,.docx,.pptx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
                className="hidden" onChange={(e) => addExtras(e.target.files)} />
              {extraFiles.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {extraFiles.map((f) => {
                    const ext   = f.name.toLowerCase().split(".").pop() ?? "txt";
                    const badge = EXT_BADGE[ext] ?? EXT_BADGE.txt;
                    return (
                      <li key={f.name} className="flex items-center gap-2 rounded-lg border border-[#dcdce3] bg-[#F5F9FC] px-2.5 py-1.5">
                        <span className={`shrink-0 rounded border px-1 py-0.5 text-[9px] font-bold ${badge.cls}`}>{badge.label}</span>
                        <span className="min-w-0 flex-1 truncate text-xs text-[#3B4959]">{f.name}</span>
                        <span className="shrink-0 text-[10px] text-[#b0b8c1]">{(f.size / 1024).toFixed(0)} KB</span>
                        <button onClick={() => setExtraFiles((p) => p.filter((x) => x.name !== f.name))}
                          className="shrink-0 rounded p-0.5 text-[#77838F] hover:bg-red-50 hover:text-red-500">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* ── Job offer card ── */}
          <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#131f2f]">Job Offer</h2>
              <div className="flex overflow-hidden rounded-lg border border-[#dcdce3]">
                {(["text", "url"] as JobInputMode[]).map((m) => (
                  <button key={m} onClick={() => setJobMode(m)}
                    className={`px-3 py-1.5 text-xs font-medium transition ${
                      jobMode === m ? "bg-[#006EDC] text-white" : "bg-white text-[#77838F] hover:text-[#3B4959]"
                    }`}>
                    {m === "text" ? "Paste JD" : "Job URL"}
                  </button>
                ))}
              </div>
            </div>

            {jobMode === "text" ? (
              <>
                <p className="mb-2 text-xs text-[#77838F]">Paste the full job posting — requirements, responsibilities, qualifications.</p>
                <textarea
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Paste the full job description here…"
                  rows={10}
                  className="w-full resize-none rounded-xl border border-[#dcdce3] bg-[#F5F9FC] px-3 py-2.5 text-sm leading-relaxed text-[#131f2f] placeholder:text-[#b0b8c1] focus:border-[#006EDC] focus:outline-none focus:ring-2 focus:ring-[#006EDC]/20"
                />
                <p className="mt-1 text-right text-[11px] text-[#b0b8c1]">{jobText.length} characters</p>
              </>
            ) : (
              <>
                <p className="mb-2 text-xs text-[#77838F]">
                  Paste the link to the job posting. Works best with publicly accessible pages (Indeed, Glassdoor, company sites).
                  <span className="ml-1 text-amber-500">LinkedIn may require login — use "Paste JD" instead.</span>
                </p>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://www.indeed.com/viewjob?jk=..."
                  className="w-full rounded-xl border border-[#dcdce3] bg-[#F5F9FC] px-3 py-2.5 text-sm text-[#131f2f] placeholder:text-[#b0b8c1] focus:border-[#006EDC] focus:outline-none focus:ring-2 focus:ring-[#006EDC]/20"
                />
              </>
            )}
          </div>

          {/* ── Language card ── */}
          <div className="rounded-2xl border border-[#dcdce3] bg-white p-4">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-[#77838F]">Letter Language</p>
            <div className="flex gap-2">
              {(["english", "french"] as const).map((l) => (
                <button key={l} onClick={() => setLanguage(l)}
                  className={`flex-1 rounded-xl border py-2 text-sm font-medium transition ${
                    language === l
                      ? "border-[#006EDC] bg-[#E6F2FD] text-[#006EDC]"
                      : "border-[#dcdce3] bg-[#F5F9FC] text-[#77838F] hover:border-[#CCD0D5] hover:text-[#3B4959]"
                  }`}>
                  {l === "english" ? "🇨🇦 English" : "🇨🇦 Français"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <button onClick={handleGenerate} disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006EDC] py-3.5 font-semibold text-white shadow-lg shadow-[#006EDC]/15 transition hover:bg-[#0060C7] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {step === "parsing" ? "Step 1/2 — Parsing CV…" : "Step 2/2 — Writing Letter…"}
              </>
            ) : "Generate Cover Letter →"}
          </button>
        </div>

        {/* ═══════════════════════════════════════════════
            Right panel
        ═══════════════════════════════════════════════ */}
        <div>
          {/* Idle placeholder */}
          {!result && !isLoading && (
            <div className="flex h-full min-h-[480px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#dcdce3] bg-white p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F2FD]">
                <svg className="h-7 w-7 text-[#006EDC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#131f2f]">Your cover letter will appear here</p>
                <p className="mt-1 max-w-xs text-sm text-[#77838F]">
                  Select your CV, provide the job offer, choose a language, and click Generate.
                </p>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-3 text-left">
                {[
                  { icon: "✍️", title: "Personalised", desc: "Pulls real achievements from your CV — no generic filler" },
                  { icon: "🎯", title: "Job-tailored", desc: "Mirrors the JD language and company tone" },
                  { icon: "📄", title: "PDF & text", desc: "Download a print-ready PDF or copy as plain text" },
                ].map((f) => (
                  <div key={f.title} className="rounded-xl bg-[#F5F9FC] p-3">
                    <div className="text-xl">{f.icon}</div>
                    <p className="mt-1.5 text-xs font-semibold text-[#131f2f]">{f.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-[#77838F]">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex h-full min-h-[480px] flex-col items-center justify-center gap-5 rounded-2xl border border-[#dcdce3] bg-white p-10">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#006EDC]/20" />
                <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#006EDC] border-t-transparent" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-[#131f2f]">
                  {step === "parsing" ? "Parsing your CV and documents…" : "Writing your cover letter…"}
                </p>
                <p className="mt-1 text-sm text-[#77838F]">
                  {step === "parsing" ? "Extracting achievements and contact info" : "Crafting a personalised letter — about 20 seconds"}
                </p>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-4">
              {/* Action bar */}
              <div className="flex items-center justify-between rounded-2xl border border-[#dcdce3] bg-white px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#131f2f]">{result.job_title} · {result.company_name}</p>
                  <p className="text-xs text-[#77838F]">{result.language === "french" ? "Français" : "English"} · {result.paragraphs.length} paragraphs</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-xl border border-[#dcdce3] px-3 py-2 text-sm font-medium text-[#3B4959] transition hover:border-[#006EDC] hover:text-[#006EDC]">
                    {copying ? "✓ Copied!" : (
                      <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>Copy text</>
                    )}
                  </button>
                  <button onClick={handleDownload} disabled={downloading}
                    className="flex items-center gap-1.5 rounded-xl bg-[#006EDC] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0060C7] disabled:opacity-50">
                    {downloading ? (
                      <><span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />Generating…</>
                    ) : (
                      <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Download PDF</>
                    )}
                  </button>
                </div>
              </div>

              {/* Letter preview */}
              <div className="overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">
                <div className="border-b border-[#e8e9eb] px-5 py-3">
                  <p className="text-xs text-[#77838F]">{result.subject_line}</p>
                </div>
                <div className="p-8" style={{ fontFamily: "Georgia, serif", maxWidth: 640, margin: "0 auto" }}>
                  {/* Letterhead */}
                  <div style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: 12, marginBottom: 20 }}>
                    <p style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", fontFamily: "Arial, sans-serif" }}>{result.candidate_name}</p>
                    <p style={{ fontSize: 12, color: "#555", marginTop: 4, fontFamily: "Arial, sans-serif" }}>
                      {[
                        result.candidate_contact.email,
                        result.candidate_contact.phone,
                        result.candidate_contact.location,
                        result.candidate_contact.linkedin,
                      ].filter(Boolean).join("  |  ")}
                    </p>
                  </div>

                  {/* Date + recipient */}
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
                      {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{result.company_name}</p>
                    <p style={{ fontSize: 13, color: "#555", fontStyle: "italic" }}>{result.job_title}</p>
                  </div>

                  {/* Greeting */}
                  <p style={{ fontSize: 14, marginBottom: 16 }}>{result.greeting}</p>

                  {/* Body */}
                  {result.paragraphs.map((p, i) => (
                    <p key={i} style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 14, textAlign: "justify" as const }}>{p}</p>
                  ))}

                  {/* Closing */}
                  <div style={{ marginTop: 24 }}>
                    <p style={{ fontSize: 14, marginBottom: 28 }}>{result.closing}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, borderTop: "1px solid #ccc", paddingTop: 8, display: "inline-block" }}>{result.candidate_name}</p>
                  </div>
                </div>
              </div>

              {/* Regenerate */}
              <button onClick={handleGenerate} disabled={isLoading}
                className="w-full rounded-xl border border-[#dcdce3] py-2.5 text-sm font-medium text-[#77838F] transition hover:border-[#006EDC] hover:text-[#006EDC]">
                ↺ Regenerate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
