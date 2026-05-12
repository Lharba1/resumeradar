"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";
import type { CVProfile } from "@/lib/types";
import type { InterviewQuestion, QuestionsResult } from "@/app/api/interview-prep/questions/route";
import type { StarFeedback } from "@/app/api/interview-prep/feedback/route";
import LinkedInImport from "@/components/LinkedInImport";

// ── Category meta ────────────────────────────────────────────────────────────
type Category = InterviewQuestion["category"];

const CAT: Record<Category, { label: string; icon: string; bg: string; border: string; text: string }> = {
  behavioral:          { label: "Behavioral",       icon: "💬", bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-700"  },
  technical:           { label: "Technical",         icon: "⚙️", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  situational:         { label: "Situational",       icon: "🎯", bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700"   },
  "canadian-specific": { label: "Canadian Culture", icon: "🍁", bg: "bg-red-50",     border: "border-red-200",     text: "text-red-600"     },
};

const STATUS_STYLE = {
  strong:  "bg-emerald-50 border-emerald-200 text-emerald-700",
  weak:    "bg-amber-50   border-amber-200   text-amber-700",
  missing: "bg-red-50     border-red-200     text-red-600",
};

// ── Sub-components ────────────────────────────────────────────────────────────
function CategoryBadge({ cat }: { cat: Category }) {
  const m = CAT[cat];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${m.bg} ${m.border} ${m.text}`}>
      {m.icon} {m.label}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color  = score >= 8 ? "#22c55e" : score >= 6 ? "#f59e0b" : "#ef4444";
  const label  = score >= 8 ? "Excellent" : score >= 6 ? "Good" : "Needs Work";
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2.5 w-44 overflow-hidden rounded-full bg-[#e5ecf2]">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score * 10}%`, background: color }} />
      </div>
      <span className="text-xl font-bold text-[#131f2f]">{score}</span>
      <span className="text-xs text-[#77838F]">/ 10 &middot; {label}</span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const CATEGORY_ORDER: Category[] = ["behavioral", "technical", "situational", "canadian-specific"];

export default function InterviewPage() {
  // ── Setup state ──
  const [cvs,           setCvs]           = useState<CVProfile[]>([]);
  const [selectedCvId,  setSelectedCvId]  = useState("");
  const [inputMode,     setInputMode]     = useState<"paste" | "url">("paste");
  const [jd,            setJd]            = useState("");
  const [jobUrl,        setJobUrl]        = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [result,        setResult]        = useState<QuestionsResult | null>(null);

  // ── Practice state ──
  const [practicingIdx,  setPracticingIdx]  = useState<number | null>(null);
  const [answers,        setAnswers]        = useState<Record<number, string>>({});
  const [feedbacks,      setFeedbacks]      = useState<Record<number, StarFeedback>>({});
  const [loadingFbIdx,   setLoadingFbIdx]   = useState<number | null>(null);
  const [fbError,        setFbError]        = useState<string | null>(null);
  const [showRewrites,   setShowRewrites]   = useState<Record<number, boolean>>({});

  // ── Load saved CVs ──
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

  // ── Generate questions ──
  async function generate() {
    const jobInput = inputMode === "url" ? jobUrl.trim() : jd.trim();
    if (!jobInput) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setPracticingIdx(null);
    setAnswers({});
    setFeedbacks({});
    try {
      const body: Record<string, string> = {};
      if (selectedCvId) body.cv_id = selectedCvId;
      if (inputMode === "url") body.job_url = jobInput;
      else body.job_description = jobInput;
      const res = await fetch("/api/interview-prep/questions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
      setResult(data as QuestionsResult);
    } catch { setError("Network error — please try again."); }
    finally { setLoading(false); }
  }

  // ── Get STAR feedback ──
  async function getFeedback(idx: number) {
    if (!result) return;
    const answer = answers[idx] ?? "";
    if (answer.trim().length < 30) {
      setFbError("Write at least 2–3 sentences before getting feedback.");
      return;
    }
    setLoadingFbIdx(idx);
    setFbError(null);
    try {
      const res = await fetch("/api/interview-prep/feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: result.questions[idx].question, answer, job_title: result.job_title }),
      });
      const data = await res.json();
      if (!res.ok) { setFbError(data.error ?? "Something went wrong"); return; }
      setFeedbacks((prev) => ({ ...prev, [idx]: data as StarFeedback }));
    } catch { setFbError("Network error — please try again."); }
    finally { setLoadingFbIdx(null); }
  }

  const jobInputFilled = inputMode === "url" ? jobUrl.trim().length > 0 : jd.trim().length > 30;

  // ── Left panel ─────────────────────────────────────────────────────────────
  const leftPanel = (
    <aside className="lg:sticky lg:top-24 space-y-3">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-[#131f2f]">Prepare for your interview</p>

        {/* LinkedIn import */}
        <div className="mb-4">
          <LinkedInImport onImported={(id, name) => {
            setSelectedCvId(id);
            setCvs((prev) => prev.find((c) => c.id === id) ? prev : [{ id, full_name: name, current_job_title: "", created_at: new Date().toISOString() } as CVProfile, ...prev]);
          }} />
        </div>

        {/* CV picker */}
        {cvs.length > 0 && (
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-[#77838F]">CV (optional — personalises questions)</label>
            <select
              value={selectedCvId}
              onChange={(e) => setSelectedCvId(e.target.value)}
              className="w-full rounded-xl border border-[#dcdce3] bg-[#F5F9FC] px-3 py-2 text-sm text-[#131f2f] outline-none focus:border-[#006EDC] focus:ring-1 focus:ring-[#006EDC]/20"
            >
              <option value="">No CV — generic questions</option>
              {cvs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name ?? "Unnamed CV"}{c.current_job_title ? ` · ${c.current_job_title}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* JD input mode toggle */}
        <div className="mb-3 flex rounded-xl border border-[#dcdce3] bg-[#F5F9FC] p-0.5">
          {(["paste", "url"] as const).map((m) => (
            <button key={m} onClick={() => setInputMode(m)}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all ${
                inputMode === m ? "bg-white text-[#006EDC] shadow-sm" : "text-[#77838F] hover:text-[#192838]"
              }`}
            >
              {m === "paste" ? "Paste JD" : "Job URL"}
            </button>
          ))}
        </div>

        {inputMode === "paste" ? (
          <textarea
            value={jd} onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here…"
            className="w-full resize-none rounded-xl border border-[#dcdce3] bg-white px-3 py-2.5 text-sm text-[#131f2f] placeholder-[#b0b9c4] outline-none focus:border-[#006EDC] focus:ring-1 focus:ring-[#006EDC]/20"
            rows={8}
          />
        ) : (
          <input
            type="url" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)}
            placeholder="https://ca.linkedin.com/jobs/view/…"
            className="w-full rounded-xl border border-[#dcdce3] bg-white px-3 py-2.5 text-sm text-[#131f2f] placeholder-[#b0b9c4] outline-none focus:border-[#006EDC] focus:ring-1 focus:ring-[#006EDC]/20"
          />
        )}

        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

        <button
          onClick={generate}
          disabled={loading || !jobInputFilled}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#006EDC] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0060c0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25" /><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
              Generating…
            </>
          ) : "Generate Questions →"}
        </button>
      </div>

      {/* STAR guide card */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#77838F]">STAR Method</p>
        {[
          { l: "S", title: "Situation",  desc: "Set the scene — specific time, team, stakes" },
          { l: "T", title: "Task",       desc: "Your specific responsibility or challenge" },
          { l: "A", title: "Action",     desc: "What YOU did — concrete steps, not 'we'" },
          { l: "R", title: "Result",     desc: "Measurable outcome or what you learned" },
        ].map(({ l, title, desc }) => (
          <div key={l} className="mb-2 flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#006EDC]/10 text-[10px] font-bold text-[#006EDC]">{l}</span>
            <div>
              <span className="text-xs font-semibold text-[#131f2f]">{title}:</span>
              <span className="ml-1 text-xs text-[#77838F]">{desc}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );

  // ── Welcome state ──────────────────────────────────────────────────────────
  const welcomeState = (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dcdce3] bg-white py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6F2FD] text-3xl">🎤</div>
      <h2 className="mb-2 text-lg font-semibold text-[#131f2f]">Ready to practise?</h2>
      <p className="mb-6 max-w-xs text-sm text-[#77838F]">Paste a job description on the left and generate 12 tailored interview questions in seconds.</p>
      <div className="grid max-w-xs grid-cols-2 gap-2 text-left text-xs text-[#3B4959]">
        {["4 Behavioral (STAR)", "4 Technical / role-specific", "2 Situational scenarios", "2 Canadian culture fit",
          "STAR answer coach", "5 Canadian culture tips"].map((t) => (
          <div key={t} className="flex items-center gap-1.5">
            <span className="text-emerald-500">✓</span>{t}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Questions display ─────────────────────────────────────────────────────
  function QuestionCard({ q, globalIdx }: { q: InterviewQuestion; globalIdx: number }) {
    const isPracticing = practicingIdx === globalIdx;
    const feedback     = feedbacks[globalIdx];
    const answer       = answers[globalIdx] ?? "";
    const isLoadingFb  = loadingFbIdx === globalIdx;
    const showRewrite  = showRewrites[globalIdx] ?? false;

    return (
      <div className={`rounded-xl border bg-white transition-all ${isPracticing ? "border-[#006EDC] shadow-md shadow-[#006EDC]/10" : "border-[#E2E8F0]"}`}>
        {/* Question header */}
        <div className="flex items-start justify-between gap-3 p-4">
          <div className="flex-1">
            <CategoryBadge cat={q.category} />
            <p className="mt-2 text-sm font-medium text-[#131f2f] leading-relaxed">{q.question}</p>
            <p className="mt-1 text-xs text-[#77838F] italic">{q.hint}</p>
          </div>
          <button
            onClick={() => {
              setPracticingIdx(isPracticing ? null : globalIdx);
              setFbError(null);
            }}
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              isPracticing
                ? "border-[#006EDC] bg-[#E6F2FD] text-[#006EDC]"
                : "border-[#dcdce3] bg-[#F5F9FC] text-[#3B4959] hover:border-[#006EDC] hover:text-[#006EDC]"
            }`}
          >
            {isPracticing ? "Close" : "Practice"}
          </button>
        </div>

        {/* Practice area */}
        {isPracticing && (
          <div className="border-t border-[#E2E8F0] px-4 pb-4 pt-3">
            <textarea
              value={answer}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [globalIdx]: e.target.value }))}
              placeholder="Walk through your answer using the STAR method — be specific about the situation, your personal actions, and the measurable result…"
              className="w-full resize-none rounded-xl border border-[#dcdce3] bg-[#F5F9FC] px-3 py-2.5 text-sm text-[#131f2f] placeholder-[#b0b9c4] outline-none focus:border-[#006EDC] focus:ring-1 focus:ring-[#006EDC]/20"
              rows={5}
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-[#b0b9c4]">{answer.split(/\s+/).filter(Boolean).length} words</span>
              <button
                onClick={() => getFeedback(globalIdx)}
                disabled={isLoadingFb || answer.trim().length < 30}
                className="flex items-center gap-1.5 rounded-lg bg-[#006EDC] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0060c0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoadingFb ? (
                  <><svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25" /><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>Analysing…</>
                ) : "Get Feedback →"}
              </button>
            </div>
            {fbError && <p className="mt-1.5 text-xs text-red-500">{fbError}</p>}

            {/* Feedback */}
            {feedback && (
              <div className="mt-4 space-y-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] p-4">
                {/* Score */}
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#77838F]">Score</p>
                  <ScoreBar score={feedback.score} />
                </div>

                {/* STAR breakdown */}
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#77838F]">STAR Breakdown</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(["situation", "task", "action", "result"] as const).map((k) => {
                      const status = feedback.star_breakdown[k];
                      return (
                        <span key={k} className={`rounded-full border px-3 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}>
                          {k.charAt(0).toUpperCase() + k.slice(1)} · {status}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Strengths */}
                {feedback.strengths?.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#77838F]">Strengths</p>
                    <ul className="space-y-1">
                      {feedback.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#3B4959]">
                          <span className="mt-0.5 text-emerald-500">✓</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {feedback.improvements?.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#77838F]">To Improve</p>
                    <ul className="space-y-1">
                      {feedback.improvements.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#3B4959]">
                          <span className="mt-0.5 text-amber-500">→</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested rewrite */}
                {feedback.suggested_rewrite && (
                  <div>
                    <button
                      onClick={() => setShowRewrites((prev) => ({ ...prev, [globalIdx]: !prev[globalIdx] }))}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#006EDC] hover:underline"
                    >
                      {showRewrite ? "▼" : "▶"} Model answer
                    </button>
                    {showRewrite && (
                      <blockquote className="mt-2 rounded-xl border-l-4 border-[#006EDC] bg-white px-4 py-3 text-xs text-[#3B4959] italic leading-relaxed">
                        {feedback.suggested_rewrite}
                      </blockquote>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const questionsPanel = result && (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#131f2f]">
              {result.job_title} <span className="font-normal text-[#77838F]">at</span> {result.company}
            </h2>
            <p className="mt-0.5 text-sm text-[#77838F]">{result.questions.length} questions · click <strong>Practice</strong> on any to get STAR feedback</p>
          </div>
          <button
            onClick={() => { setResult(null); setAnswers({}); setFeedbacks({}); }}
            className="shrink-0 rounded-lg border border-[#dcdce3] px-3 py-1.5 text-xs text-[#77838F] transition hover:text-red-500 hover:border-red-200"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Questions by category */}
      {CATEGORY_ORDER.map((cat) => {
        const qs = result.questions
          .map((q, i) => ({ q, i }))
          .filter(({ q }) => q.category === cat);
        if (!qs.length) return null;
        const m = CAT[cat];
        return (
          <div key={cat}>
            <div className={`mb-3 flex items-center gap-2 rounded-xl border px-4 py-2.5 ${m.bg} ${m.border}`}>
              <span>{m.icon}</span>
              <span className={`text-sm font-semibold ${m.text}`}>{m.label}</span>
              <span className={`ml-auto text-xs font-medium ${m.text} opacity-60`}>{qs.length} questions</span>
            </div>
            <div className="space-y-3">
              {qs.map(({ q, i }) => <QuestionCard key={i} q={q} globalIdx={i} />)}
            </div>
          </div>
        );
      })}

      {/* Culture tips */}
      {result.culture_tips?.length > 0 && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">🍁</span>
            <h3 className="text-sm font-semibold text-[#131f2f]">Canadian Workplace Culture Tips</h3>
          </div>
          <ul className="space-y-2">
            {result.culture_tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#3B4959]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E6F2FD] text-[10px] font-bold text-[#006EDC]">{i + 1}</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#131f2f]">Interview Prep Coach</h1>
          <p className="mt-1 text-sm text-[#77838F]">12 tailored questions + AI feedback on your STAR answers — for any role, in 10 seconds.</p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
          {leftPanel}
          <section>
            {loading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white py-20">
                <svg className="h-8 w-8 animate-spin text-[#006EDC]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".2" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="mt-4 text-sm text-[#77838F]">Generating your interview questions…</p>
              </div>
            ) : result ? questionsPanel : welcomeState}
          </section>
        </div>
      </div>
    </main>
  );
}
