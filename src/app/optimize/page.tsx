"use client";

import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { getBrowserClient } from "@/lib/supabase-browser";
import { renderTemplate, TEMPLATES, type TemplateId } from "@/lib/cvTemplates";
import type { CVProfile } from "@/lib/types";
import type { OptimizeResult } from "@/app/api/cv/optimize/route";
import type { CVData } from "@/app/api/cv/generate/route";
import LinkedInImport from "@/components/LinkedInImport";

// ─────────────────────────────────────────────────────────────
// Shared UI atoms
// ─────────────────────────────────────────────────────────────

function ScoreRing({ value, label, size = 96 }: { value: number; label: string; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 70 ? "#22c55e" : value >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5ecf2" strokeWidth={10} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="700" fill="#131f2f">
          {value}%
        </text>
      </svg>
      <span className="text-xs font-medium text-[#77838F]">{label}</span>
    </div>
  );
}

function Chip({ label, type }: { label: string; type: "matched" | "missing" }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
      type === "matched"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-red-200 bg-red-50 text-red-600"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${type === "matched" ? "bg-emerald-400" : "bg-red-400"}`} />
      {label}
    </span>
  );
}

const EXT_BADGE: Record<string, { label: string; cls: string }> = {
  pdf:  { label: "PDF",  cls: "bg-red-50   border-red-200   text-red-600"   },
  docx: { label: "DOCX", cls: "bg-blue-50  border-blue-200  text-blue-600"  },
  pptx: { label: "PPTX", cls: "bg-amber-50 border-amber-200 text-amber-600" },
  txt:  { label: "TXT",  cls: "bg-[#F5F9FC] border-[#dcdce3] text-[#3B4959]" },
};

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────

type Step = "idle" | "parsing" | "optimizing";

export default function OptimizePage() {
  const [cvs, setCvs]                   = useState<CVProfile[]>([]);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [cvFile,     setCvFile]         = useState<File | null>(null);
  const [extraFiles, setExtraFiles]     = useState<File[]>([]);
  const [cvDragging,  setCvDragging]    = useState(false);
  const [extDragging, setExtDragging]   = useState(false);
  const cvRef  = useRef<HTMLInputElement>(null);
  const extRef = useRef<HTMLInputElement>(null);
  const [jd,       setJd]       = useState("");
  const [language, setLanguage] = useState<"english" | "french">("english");
  const [step,     setStep]     = useState<Step>("idle");
  const [error,    setError]    = useState<string | null>(null);
  const [result,   setResult]   = useState<OptimizeResult | null>(null);
  const [downloading,  setDownloading]  = useState(false);
  const [template,     setTemplate]     = useState<TemplateId>("classic");

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

  // ── main action ──
  async function handleOptimize() {
    if (!jd.trim() || jd.length < 50) { setError("Paste the full job description (at least 50 characters)"); return; }
    setError(null);
    setResult(null);

    let cvId = selectedCvId;

    // uploaded file takes priority over library selection
    if (cvFile) {
      setStep("parsing");
      try {
        const fd = new FormData();
        fd.append("cv", cvFile);
        for (const f of extraFiles) fd.append("extras", f);
        const parseRes  = await fetch("/api/cv/parse", { method: "POST", body: fd });
        const parseData = await parseRes.json();
        if (!parseRes.ok) { setError(parseData.error ?? "CV parsing failed"); setStep("idle"); return; }
        cvId = parseData.id;
        setCvs((prev) => [parseData as CVProfile, ...prev.filter((c) => c.id !== parseData.id)]);
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

    // ── optimize ──
    setStep("optimizing");
    try {
      const res  = await fetch("/api/cv/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_id: cvId, job_description: jd, language }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Optimization failed"); setStep("idle"); return; }
      setResult(data as OptimizeResult);
    } catch {
      setError("Network error — please try again");
    } finally {
      setStep("idle");
    }
  }

  async function handleDownload() {
    if (!result?.optimized_cv) return;
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const html      = renderTemplate(template, result.optimized_cv);
      const container = document.createElement("div");
      container.style.cssText = "position:absolute;left:-9999px;top:0;";
      container.innerHTML = DOMPurify.sanitize(html);
      document.body.appendChild(container);
      const root = container.firstElementChild as HTMLElement;
      await html2pdf()
        .set({
          margin: 0,
          filename: `CV_Optimized_${(result.optimized_cv.header.name ?? "resume").replace(/\s+/g, "_")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, width: 794 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(root).save();
      document.body.removeChild(container);
    } catch {
      setError("PDF download failed — try again");
    } finally {
      setDownloading(false);
    }
  }

  const isLoading = step !== "idle";
  const canSubmit = !isLoading && (!!cvFile || !!selectedCvId);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#131f2f]">ATS Resume Optimizer</h1>
        <p className="mt-2 text-[#77838F]">
          Tailor any CV to any job description — for yourself or anyone else. Upload fresh or pick from your library.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[440px_1fr]">
        {/* ═══════════════════════════════════════════════
            Left panel
        ═══════════════════════════════════════════════ */}
        <div className="space-y-4">

          {/* ── LinkedIn import + Language toggle ── */}
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <LinkedInImport onImported={(id, name) => {
                setSelectedCvId(id);
                setCvFile(null);
                setCvs((prev) => prev.find((c) => c.id === id) ? prev : [{ id, full_name: name, current_job_title: "", created_at: new Date().toISOString() } as CVProfile, ...prev]);
              }} />
            </div>
            <div className="flex shrink-0 overflow-hidden rounded-xl border border-[#dcdce3] bg-[#F5F9FC]">
              {(["english", "french"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  title={lang === "english" ? "English CV output" : "French CV output"}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition ${
                    language === lang
                      ? "bg-[#006EDC] text-white"
                      : "text-[#3B4959] hover:bg-[#E6F2FD]"
                  }`}
                >
                  <span>{lang === "english" ? "🇨🇦" : "🇫🇷"}</span>
                  <span>{lang === "english" ? "EN" : "FR"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── CV card (single panel, no tabs) ── */}
          <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
            <p className="mb-3 text-sm font-semibold text-[#131f2f]">Your CV</p>

            {/* Library selector */}
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

            {/* Divider */}
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-[#e8e9eb]" />
              <span className="text-[11px] text-[#b0b8c1]">{cvs.length > 0 ? "or upload a different one" : "upload your CV"}</span>
              <div className="h-px flex-1 bg-[#e8e9eb]" />
            </div>

            {/* CV drop zone */}
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
                {cvFile
                  ? <span className="text-sm">📄</span>
                  : <svg className="h-4 w-4 text-[#77838F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                }
              </div>
              {cvFile ? (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-emerald-700">{cvFile.name}</p>
                  <p className="text-xs text-[#77838F]">{(cvFile.size / 1024).toFixed(1)} KB · <button className="text-red-400 hover:underline" onClick={(e) => { e.stopPropagation(); setCvFile(null); }}>remove</button></p>
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
              <p className="mb-2 text-[11px] text-[#77838F]">PPTX, DOCX, PDF, TXT · up to 5 files · 20 MB each</p>
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

          {/* ── Job description card ── */}
          <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
            <h2 className="mb-1.5 text-sm font-semibold text-[#131f2f]">Job Description</h2>
            <p className="mb-3 text-xs text-[#77838F]">Paste the full posting — requirements, responsibilities, qualifications.</p>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here…"
              rows={13}
              className="w-full resize-none rounded-xl border border-[#dcdce3] bg-[#F5F9FC] px-3 py-2.5 text-sm leading-relaxed text-[#131f2f] placeholder:text-[#b0b8c1] focus:border-[#006EDC] focus:outline-none focus:ring-2 focus:ring-[#006EDC]/20"
            />
            <p className="mt-1 text-right text-[11px] text-[#b0b8c1]">{jd.length} characters</p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {/* ── Submit button ── */}
          <button
            onClick={handleOptimize}
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006EDC] py-3.5 font-semibold text-white shadow-lg shadow-[#006EDC]/15 transition hover:bg-[#0060C7] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {step === "parsing" ? "Step 1/2 — Parsing CV…" : "Step 2/2 — Optimizing…"}
              </>
            ) : "Analyze & Optimize →"}
          </button>
        </div>

        {/* ═══════════════════════════════════════════════
            Right panel: results / placeholder
        ═══════════════════════════════════════════════ */}
        <div>
          {/* Idle placeholder */}
          {!result && !isLoading && (
            <div className="rounded-2xl border border-dashed border-[#dcdce3] bg-white p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E6F2FD]">
                  <svg className="h-6 w-6 text-[#006EDC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#131f2f]">How it works</p>
                  <p className="text-sm text-[#77838F]">
                    Select a CV from your library or upload a new one, paste a job description, and hit Optimize.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🎯", title: "ATS Score", desc: "Before & after match percentage" },
                  { icon: "🔑", title: "Keywords", desc: "Matched and added JD terms" },
                  { icon: "📄", title: "Tailored PDF", desc: "Download ready-to-send resume" },
                ].map((f) => (
                  <div key={f.title} className="rounded-xl bg-[#F5F9FC] p-3">
                    <div className="text-xl">{f.icon}</div>
                    <p className="mt-1.5 text-xs font-semibold text-[#131f2f]">{f.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-[#77838F]">{f.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-[#b0b8c1] text-center">Works for any CV — yours, a friend&apos;s, or a client&apos;s.</p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-6 rounded-2xl border border-[#dcdce3] bg-white p-10">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#006EDC]/20" />
                <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#006EDC] border-t-transparent" />
              </div>
              <div className="space-y-3 text-center">
                <StepIndicator current={step} />
                <p className="text-sm text-[#77838F]">This takes about 20–40 seconds</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Score card */}
              <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="mb-2 text-sm font-semibold text-[#131f2f]">ATS Score Analysis</h2>
                    {/* Template picker */}
                    <div className="flex gap-2">
                      {TEMPLATES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTemplate(t.id)}
                          className={`rounded-lg border px-3 py-1.5 text-left transition ${
                            template === t.id
                              ? "border-[#006EDC] bg-[#EBF4FF]"
                              : "border-[#E2E8F0] bg-[#F5F9FC] hover:border-[#CCD0D5]"
                          }`}
                        >
                          <p className={`text-xs font-semibold ${template === t.id ? "text-[#006EDC]" : "text-[#131f2f]"}`}>{t.label}</p>
                          <p className="text-[10px] text-[#77838F]">{t.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-[#006EDC] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0060C7] disabled:opacity-50"
                  >
                    {downloading ? (
                      <><span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />Generating…</>
                    ) : (
                      <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Download PDF</>
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-around py-2">
                  <ScoreRing value={result.ats_score_before} label="Before" />
                  <div className="flex flex-col items-center gap-1">
                    <svg className="h-6 w-6 text-[#006EDC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    <span className="text-[10px] text-[#77838F]">optimized</span>
                  </div>
                  <ScoreRing value={result.ats_score_after} label="After" size={108} />
                </div>
              </div>

              {/* Keywords */}
              <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <h2 className="mb-3 text-sm font-semibold text-[#131f2f]">Keywords</h2>
                {result.keywords_matched.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[#77838F]">Already in your CV</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywords_matched.map((k) => <Chip key={k} label={k} type="matched" />)}
                    </div>
                  </div>
                )}
                {result.keywords_missing.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[#77838F]">Added by optimization</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywords_missing.map((k) => <Chip key={k} label={k} type="missing" />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Improvements + tips */}
              {(result.improvements.length > 0 || result.ats_tips.length > 0) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {result.improvements.length > 0 && (
                    <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                      <h2 className="mb-3 text-sm font-semibold text-[#131f2f]">Changes Made</h2>
                      <ul className="space-y-2">
                        {result.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#3B4959]">
                            <span className="mt-0.5 shrink-0 text-[#006EDC]">✓</span>{imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.ats_tips.length > 0 && (
                    <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                      <h2 className="mb-3 text-sm font-semibold text-[#131f2f]">ATS Tips</h2>
                      <ul className="space-y-2">
                        {result.ats_tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#3B4959]">
                            <span className="mt-0.5 shrink-0 text-amber-500">→</span>{tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* CV preview */}
              <div className="overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">
                <div className="flex items-center justify-between border-b border-[#e8e9eb] px-5 py-3">
                  <h2 className="text-sm font-semibold text-[#131f2f]">Optimized CV Preview</h2>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">ATS-Ready</span>
                </div>
                <div className="overflow-auto p-4" style={{ maxHeight: 700 }}>
                  <CVPreview cv={result.optimized_cv} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step indicator
// ─────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { key: "parsing",   label: "Parsing CV + docs" },
    { key: "optimizing", label: "AI optimization" },
  ];
  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => {
        const done    = current === "optimizing" && s.key === "parsing";
        const active  = current === s.key;
        return (
          <div key={s.key} className="flex items-center gap-2">
            {i > 0 && <div className={`h-px w-6 ${done ? "bg-[#006EDC]" : "bg-[#dcdce3]"}`} />}
            <div className="flex items-center gap-1.5">
              <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                done   ? "bg-[#006EDC] text-white"
                : active ? "border-2 border-[#006EDC] text-[#006EDC]"
                : "border border-[#dcdce3] text-[#b0b8c1]"
              }`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium ${active ? "text-[#131f2f]" : done ? "text-[#006EDC]" : "text-[#b0b8c1]"}`}>
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inline CV preview
// ─────────────────────────────────────────────────────────────

function esc(s?: string | null) {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function CVPreview({ cv }: { cv: CVData }) {
  if (!cv?.header) return null;
  const h = cv.header;
  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 10, color: "#333", lineHeight: 1.45, maxWidth: 680, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{h.name}</div>
        {h.title && <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{h.title}</div>}
        <div style={{ fontSize: 9, color: "#444", marginTop: 4, lineHeight: 1.6 }}>
          {[h.email, h.linkedin].filter(Boolean).join("  |  ")}
          {[h.location, h.phone].filter(Boolean).length > 0 && <div>{[h.location, h.phone].filter(Boolean).join("  |  ")}</div>}
        </div>
      </div>
      {cv.summary && <p style={{ fontSize: 9, color: "#333", lineHeight: 1.55, marginBottom: 6 }}>{cv.summary}</p>}
      {(cv.experience ?? []).length > 0 && (
        <CVSection title="Work Experience">
          {(cv.experience ?? []).map((e, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 9.5 }}>{e.title}</span>
                <span style={{ fontSize: 9, color: "#555" }}>{e.date}</span>
              </div>
              <div style={{ fontSize: 9, fontStyle: "italic", color: "#555", margin: "1px 0 4px" }}>
                {e.company}{e.location ? ` | ${e.location}` : ""}
              </div>
              <ul style={{ marginLeft: 14, marginTop: 2 }}>
                {(e.bullets ?? []).map((b, j) => <li key={j} style={{ fontSize: 9.5, color: "#333", marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </CVSection>
      )}
      {(cv.skills ?? []).length > 0 && (
        <CVSection title="Skills">
          <div style={{ columnCount: 2, columnGap: 16 }}>
            {(cv.skills ?? []).map((s, i) => <div key={i} style={{ fontSize: 9.5, marginBottom: 2, breakInside: "avoid" }}>• {s}</div>)}
          </div>
        </CVSection>
      )}
      {(cv.education ?? []).length > 0 && (
        <CVSection title="Education">
          {(cv.education ?? []).map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 9.5 }}>{e.institution}</span>
                <span style={{ fontSize: 9, color: "#555" }}>{e.date}</span>
              </div>
              <div style={{ fontSize: 9, fontStyle: "italic", color: "#555", marginTop: 2 }}>
                {e.degree}{e.location ? ` · ${e.location}` : ""}
              </div>
            </div>
          ))}
        </CVSection>
      )}
      {(cv.languages ?? []).length > 0 && (
        <CVSection title="Languages">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(cv.languages ?? []).map((l, i) => (
              <span key={i} style={{ fontSize: 9.5, background: "#F5F9FC", border: "1px solid #dcdce3", borderRadius: 6, padding: "2px 8px" }}>
                {l.name} — {l.level}
              </span>
            ))}
          </div>
        </CVSection>
      )}
      {(cv.certifications ?? []).length > 0 && (
        <CVSection title="Certifications">
          <ul style={{ marginLeft: 14 }}>
            {(cv.certifications ?? []).map((c, i) => <li key={i} style={{ fontSize: 9.5, marginBottom: 2 }}>{esc(c)}</li>)}
          </ul>
        </CVSection>
      )}
    </div>
  );
}

function CVSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1a1a", borderBottom: "1.5px solid #aaaaaa", paddingBottom: 2, marginBottom: 7 }}>
        {title}
      </div>
      {children}
    </div>
  );
}
