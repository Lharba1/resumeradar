"use client";

import type { Job } from "@/lib/types";

interface Props {
  job: Job;
  onSave?: (job: Job) => void;
  onApply?: (job: Job) => void;
  saved?: boolean;
  selected?: boolean;
  onSelect?: (job: Job, checked: boolean) => void;
}

const VISA = {
  high: { dot: "bg-emerald-400", label: "Visa Likely", cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  medium: { dot: "bg-amber-400", label: "Visa Possible", cls: "text-amber-600 bg-amber-50 border-amber-200" },
  low: { dot: "bg-red-400", label: "Visa Unlikely", cls: "text-red-500 bg-red-50 border-red-200" },
};

const DECISION = {
  apply: { label: "Apply", cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  maybe: { label: "Maybe", cls: "text-amber-600 bg-amber-50 border-amber-200" },
  skip: { label: "Skip", cls: "text-red-500 bg-red-50 border-red-200" },
};

export default function JobCard({ job, onSave, onApply, saved, selected, onSelect }: Props) {
  const visa = VISA[job.visa_sponsorship_likelihood ?? "low"];
  const decision = job.decision ? DECISION[job.decision] : null;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border bg-white transition-all duration-200 ${
        selected
          ? "border-[#006EDC] shadow-lg shadow-[#E6F2FD]"
          : "border-[#dcdce3] hover:border-[#CCD0D5] hover:shadow-lg hover:shadow-[#dcdce3]/60"
      }`}
    >
      {/* Checkbox + header */}
      <div className="flex items-start gap-3 p-5">
        {onSelect && (
          <div className="mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={selected ?? false}
              onChange={(e) => onSelect(job, e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded accent-[#006EDC]"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-2">
            <h3 className="font-semibold leading-snug text-[#131f2f]">{job.job_title}</h3>
          </div>
          <p className="mt-1 text-sm text-[#3B4959]">
            {[job.company_name, job.location].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      {/* Description */}
      {job.job_description && (
        <p className="line-clamp-2 px-5 text-xs leading-relaxed text-[#77838F]">
          {job.job_description}
        </p>
      )}

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 px-5 pt-3">
        <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${visa.cls}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${visa.dot}`} />
          {visa.label}
        </span>

        {job.source === "jobbank" && (
          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600">
            🇨🇦 Job Bank
          </span>
        )}

        {decision && (
          <span className={`ml-auto rounded-full border px-2.5 py-1 text-[11px] font-semibold ${decision.cls}`}>
            {decision.label}
          </span>
        )}
      </div>

      {/* Scores */}
      {(job.ats_score !== null || job.relocation_score !== null) && (
        <div className="mt-3 grid grid-cols-2 gap-2 px-5">
          {job.ats_score !== null && (
            <ScoreBar label="ATS Match" value={job.ats_score} />
          )}
          {job.relocation_score !== null && (
            <ScoreBar label="Relocation" value={job.relocation_score} />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex items-center gap-2 border-t border-[#e8e9eb] p-4">
        {job.linkedin_url && (
          <a
            href={job.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onApply?.(job)}
            className="rounded-lg bg-[#e5ecf2] px-3 py-1.5 text-xs font-medium text-[#3B4959] transition hover:bg-[#dcdce3] hover:text-[#131f2f]"
          >
            View Job →
          </a>
        )}
        {onSave && (
          <button
            onClick={() => onSave(job)}
            disabled={saved}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#77838F] transition hover:text-[#192838] disabled:opacity-30"
          >
            {saved ? "✓ Saved" : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  const textColor = value >= 70 ? "text-emerald-600" : value >= 50 ? "text-amber-600" : "text-red-500";
  return (
    <div className="rounded-xl bg-[#F5F9FC] p-2.5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] text-[#77838F]">{label}</span>
        <span className={`text-xs font-bold tabular-nums ${textColor}`}>{value}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-[#dcdce3]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
