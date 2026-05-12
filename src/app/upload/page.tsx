"use client";

import { useRef, useState } from "react";
import type { CVProfile } from "@/lib/types";

const EXTRA_EXTS = [".pdf", ".docx", ".pptx", ".txt"];
const MAX_EXTRA_MB = 20;

const EXT_BADGE: Record<string, { label: string; cls: string }> = {
  pdf:  { label: "PDF",  cls: "bg-red-50  border-red-200  text-red-600"   },
  docx: { label: "DOCX", cls: "bg-blue-50 border-blue-200 text-blue-600"  },
  pptx: { label: "PPTX", cls: "bg-amber-50 border-amber-200 text-amber-600" },
  txt:  { label: "TXT",  cls: "bg-[#F5F9FC] border-[#dcdce3] text-[#3B4959]" },
};

export default function UploadPage() {
  const cvRef   = useRef<HTMLInputElement>(null);
  const extRef  = useRef<HTMLInputElement>(null);

  const [cvFile,     setCvFile]     = useState<File | null>(null);
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [profile,    setProfile]    = useState<CVProfile | null>(null);
  const [extrasParsed, setExtrasParsed] = useState(0);
  const [cvDragging,  setCvDragging]  = useState(false);
  const [extDragging, setExtDragging] = useState(false);
  const [consented,  setConsented]  = useState(false);

  // ── CV file ──
  function handleCvFile(f: File | null) {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf")) { setError("Only PDF files are accepted for your CV."); return; }
    if (f.size > 2 * 1024 * 1024)               { setError("CV must be 2 MB or smaller.");             return; }
    setError(null);
    setCvFile(f);
    setProfile(null);
  }

  // ── Extra files ──
  function addExtras(incoming: FileList | null) {
    if (!incoming) return;
    const allowed: File[] = [];
    const errors: string[] = [];
    for (const f of Array.from(incoming)) {
      const ext = f.name.toLowerCase().split(".").pop() ?? "";
      if (!["pdf","docx","pptx","txt"].includes(ext)) { errors.push(`${f.name}: unsupported format`); continue; }
      if (f.size > MAX_EXTRA_MB * 1024 * 1024)         { errors.push(`${f.name}: exceeds ${MAX_EXTRA_MB} MB`); continue; }
      allowed.push(f);
    }
    if (errors.length) setError(errors.join(" · "));
    setExtraFiles((prev) => {
      const names = new Set(prev.map((p) => p.name));
      const fresh = allowed.filter((f) => !names.has(f.name));
      return [...prev, ...fresh].slice(0, 5);
    });
  }

  function removeExtra(name: string) {
    setExtraFiles((prev) => prev.filter((f) => f.name !== name));
  }

  // ── Upload ──
  async function handleUpload() {
    if (!cvFile) return;
    setLoading(true);
    setError(null);
    const fd = new FormData();
    fd.append("cv", cvFile);
    for (const f of extraFiles) fd.append("extras", f);
    try {
      const res  = await fetch("/api/cv/parse", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Upload failed"); }
      else {
        setProfile(data as CVProfile);
        setExtrasParsed(data.extras_parsed ?? 0);
        localStorage.setItem("cv_id", data.id);
      }
    } catch { setError("Network error"); }
    finally  { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[#131f2f]">Upload your CV</h1>
        <p className="mt-2 text-[#77838F]">
          Parse your CV with AI. Optionally add project docs to write stronger, evidence-backed bullets.
        </p>
      </div>

      {!profile ? (
        <div className="space-y-4">

          {/* ── CV drop zone ── */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#77838F]">Your CV <span className="text-red-400">*</span></p>
            <div
              onClick={() => cvRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setCvDragging(true); }}
              onDragLeave={() => setCvDragging(false)}
              onDrop={(e) => { e.preventDefault(); setCvDragging(false); handleCvFile(e.dataTransfer.files[0]); }}
              className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-8 py-12 text-center transition-all ${
                cvDragging   ? "border-[#006EDC] bg-[#e6f2fe]"
                : cvFile     ? "border-emerald-400 bg-emerald-50"
                : "border-[#dcdce3] bg-[#F5F9FC] hover:border-[#CCD0D5] hover:bg-white"
              }`}
            >
              {cvFile ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                    <span className="text-xl">📄</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#131f2f]">{cvFile.name}</p>
                    <p className="mt-0.5 text-sm text-[#77838F]">{(cvFile.size / 1024).toFixed(1)} KB · click to change</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5ecf2]">
                    <svg className="h-6 w-6 text-[#77838F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#3B4959]">Drop your CV or <span className="text-[#006EDC]">browse</span></p>
                    <p className="mt-0.5 text-sm text-[#77838F]">PDF only · max 2 MB</p>
                  </div>
                </>
              )}
            </div>
            <input ref={cvRef} type="file" accept=".pdf,application/pdf" className="hidden"
              onChange={(e) => handleCvFile(e.target.files?.[0] ?? null)} />
          </div>

          {/* ── Extras section ── */}
          <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg">✨</span>
              <div>
                <p className="text-sm font-semibold text-[#131f2f]">
                  Boost with project docs{" "}
                  <span className="ml-1 rounded-full bg-[#E6F2FD] px-2 py-0.5 text-[10px] font-bold text-[#006EDC]">OPTIONAL</span>
                </p>
                <p className="text-xs text-[#77838F]">
                  Add presentations, reports, or portfolios — AI extracts achievements and metrics for stronger bullets
                </p>
              </div>
            </div>

            {/* Extras drop zone */}
            <div
              onClick={() => extRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setExtDragging(true); }}
              onDragLeave={() => setExtDragging(false)}
              onDrop={(e) => { e.preventDefault(); setExtDragging(false); addExtras(e.dataTransfer.files); }}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-6 text-center transition-all ${
                extDragging ? "border-[#006EDC] bg-[#e6f2fe]" : "border-[#dcdce3] bg-[#F5F9FC] hover:border-[#CCD0D5] hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                {["PPTX", "DOCX", "PDF", "TXT"].map((t) => (
                  <span key={t} className="rounded-md border border-[#dcdce3] bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#3B4959]">{t}</span>
                ))}
              </div>
              <p className="text-sm text-[#3B4959]">Drop files or <span className="text-[#006EDC]">browse</span></p>
              <p className="text-xs text-[#b0b8c1]">Up to 5 files · max {MAX_EXTRA_MB} MB each</p>
            </div>
            <input ref={extRef} type="file" multiple
              accept=".pdf,.docx,.pptx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
              className="hidden"
              onChange={(e) => addExtras(e.target.files)} />

            {/* File list */}
            {extraFiles.length > 0 && (
              <ul className="mt-3 space-y-2">
                {extraFiles.map((f) => {
                  const ext  = f.name.toLowerCase().split(".").pop() ?? "txt";
                  const badge = EXT_BADGE[ext] ?? EXT_BADGE.txt;
                  return (
                    <li key={f.name} className="flex items-center gap-3 rounded-xl border border-[#dcdce3] bg-[#F5F9FC] px-3 py-2">
                      <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${badge.cls}`}>
                        {badge.label}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-[#3B4959]">{f.name}</span>
                      <span className="shrink-0 text-[11px] text-[#b0b8c1]">{(f.size / 1024).toFixed(0)} KB</span>
                      <button
                        onClick={() => removeExtra(f.name)}
                        className="shrink-0 rounded-lg p-1 text-[#77838F] transition hover:bg-red-50 hover:text-red-500"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {cvFile && (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#dcdce3] bg-white px-4 py-3">
              <input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-[#006EDC]" />
              <span className="text-xs leading-relaxed text-[#3B4959]">
                I agree that my CV and any uploaded documents will be processed by OpenAI to extract job-matching data.
                See our <a href="/privacy" className="text-[#006EDC] underline" target="_blank">Privacy Policy</a>.
              </span>
            </label>
          )}

          {cvFile && (
            <button onClick={handleUpload} disabled={loading || !consented}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006EDC] py-3.5 font-semibold text-white shadow-lg shadow-[#006EDC]/15 transition hover:bg-[#0060C7] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {extraFiles.length > 0 ? `Parsing CV + ${extraFiles.length} doc${extraFiles.length > 1 ? "s" : ""}…` : "Parsing with AI…"}
                </>
              ) : `Parse My CV${extraFiles.length > 0 ? ` + ${extraFiles.length} doc${extraFiles.length > 1 ? "s" : ""}` : ""} →`}
            </button>
          )}
        </div>
      ) : (
        /* ── Profile card ── */
        <div className="overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">
          <div className="h-1 w-full bg-gradient-to-r from-[#006EDC] via-[#0052A3] to-[#2aacea]" />
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E6F2FD] text-xl">👤</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-[#131f2f]">{profile.full_name ?? "—"}</h2>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">✓ Parsed</span>
                  {extrasParsed > 0 && (
                    <span className="rounded-full border border-[#006EDC]/30 bg-[#E6F2FD] px-2.5 py-0.5 text-xs font-semibold text-[#006EDC]">
                      ✨ +{extrasParsed} doc{extrasParsed > 1 ? "s" : ""} enriched
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-[#3B4959]">{profile.current_job_title ?? "—"}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Stat label="Experience" value={`${profile.years_of_experience ?? "—"} years`} />
              <Stat label="Seniority"  value={profile.seniority_level ?? "—"} />
              <Stat label="Industries" value={profile.industries?.join(", ") || "—"} />
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#77838F]">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.technical_skills?.map((s, i) => (
                  <span key={i} className="rounded-lg border border-[#dcdce3] bg-[#F5F9FC] px-2.5 py-1 text-xs text-[#3B4959]">{s}</span>
                ))}
              </div>
            </div>

            {profile.summary && (
              <p className="mt-4 rounded-xl bg-[#F5F9FC] px-4 py-3 text-sm leading-relaxed text-[#3B4959]">{profile.summary}</p>
            )}

            {extrasParsed > 0 && (
              <div className="mt-4 rounded-xl border border-[#006EDC]/20 bg-[#E6F2FD] px-4 py-3">
                <p className="text-xs font-semibold text-[#006EDC]">✨ Enriched with {extrasParsed} project doc{extrasParsed > 1 ? "s" : ""}</p>
                <p className="mt-0.5 text-xs text-[#3B4959]">
                  Achievements and metrics extracted — your generated CVs will include stronger, evidence-backed bullets.
                </p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs text-[#77838F]">CV saved · ready to match jobs</p>
              <div className="flex gap-2">
                <a href="/optimize" className="rounded-xl border border-[#006EDC] px-4 py-2 text-sm font-semibold text-[#006EDC] transition hover:bg-[#E6F2FD]">
                  Optimize →
                </a>
                <a href="/jobs" className="rounded-xl bg-[#006EDC] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0060C7]">
                  Find Jobs →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#F5F9FC] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#77838F]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#192838]">{value}</p>
    </div>
  );
}
