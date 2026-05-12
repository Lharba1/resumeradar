import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "ResumeRadar vs Jobscan — Which ATS Tool Is Better for Canada? (2026)",
  description:
    "In-depth comparison of ResumeRadar vs Jobscan: features, pricing, bilingual support, Canada focus, and AI capabilities. Which one should you choose for Canadian job applications?",
  alternates: { canonical: "https://resumeradar.io/compare/jobradar-vs-jobscan" },
  openGraph: {
    url: "https://resumeradar.io/compare/jobradar-vs-jobscan",
    title: "ResumeRadar vs Jobscan (2026) — Which Is Better for Canada?",
    description: "Full comparison: features, pricing, French support, and Canada-specific capabilities. Honest breakdown.",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://resumeradar.io/compare" },
    { "@type": "ListItem", position: 3, name: "ResumeRadar vs Jobscan", item: "https://resumeradar.io/compare/jobradar-vs-jobscan" },
  ],
};

export default function ResumeRadarVsJobscanPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-3xl">

        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <span>Compare</span>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">ResumeRadar vs Jobscan</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Comparison</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">ResumeRadar vs Jobscan — which is better for Canada?</h1>
        <p className="mt-2 text-sm text-[#77838F]">Last updated: May 2026</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          Both tools help you optimize your resume for ATS — but they take very different approaches, and their strengths are aimed at different markets. Here is an honest, detailed breakdown.
        </p>

        {/* Summary verdict */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#006EDC] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F2FD] text-xs font-black text-[#006EDC]">JR</div>
              <p className="font-bold text-[#131f2f]">ResumeRadar</p>
              <span className="ml-auto rounded-full bg-[#E6F2FD] px-2.5 py-0.5 text-[11px] font-semibold text-[#006EDC]">Best for Canada</span>
            </div>
            <ul className="space-y-1.5 text-sm text-[#3B4959]">
              {["AI rewrites your resume automatically", "English + French bilingual output", "Free plan — $0 to start", "Built for Canadian job market", "Cover letters + interview prep included", "LinkedIn import"].map((f) => (
                <li key={f} className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span>{f}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F9FC] text-xs font-bold text-[#77838F]">JS</div>
              <p className="font-bold text-[#131f2f]">Jobscan</p>
              <span className="ml-auto rounded-full bg-[#F5F9FC] px-2.5 py-0.5 text-[11px] font-semibold text-[#77838F]">Best for US market</span>
            </div>
            <ul className="space-y-1.5 text-sm text-[#3B4959]">
              {[
                { text: "ATS scoring — strong analysis", good: true },
                { text: "No AI resume rewriting", good: false },
                { text: "$49.95/month — no free plan", good: false },
                { text: "US market focus — limited Canada data", good: false },
                { text: "No French language support", good: false },
                { text: "LinkedIn import available", good: true },
              ].map((f) => (
                <li key={f.text} className="flex gap-2">
                  <span className={`font-bold ${f.good ? "text-emerald-500" : "text-red-400"}`}>{f.good ? "✓" : "✗"}</span>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed breakdown */}
        <div className="mt-12 space-y-8">
          {[
            {
              topic: "ATS Scoring",
              verdict: "Tie",
              verdictColor: "text-amber-600 bg-amber-50 border-amber-200",
              content: "Both tools calculate an ATS compatibility score by comparing your resume against the job description. Jobscan has been doing this longer and has extensive data. ResumeRadar calculates a before-and-after score, making the improvement measurable and motivating.",
            },
            {
              topic: "Resume Rewriting",
              verdict: "ResumeRadar wins",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "This is the biggest functional difference. Jobscan identifies what keywords are missing and tells you to add them — manually. ResumeRadar's AI rewrites the entire resume for you: restructuring bullets, adding keywords in context, reformatting to Canadian standards. For immigrants and job seekers without writing expertise, this difference is enormous.",
            },
            {
              topic: "French Language Support",
              verdict: "ResumeRadar wins",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "Jobscan has no French language support. ResumeRadar generates fully bilingual CVs — complete French resumes with proper Canadian French terminology, not machine-translated text. Institution names are preserved. This is critical for Quebec roles, federal bilingual positions, and francophone immigrants.",
            },
            {
              topic: "Canadian Market Focus",
              verdict: "ResumeRadar wins",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "Jobscan was built for the US market and works globally but without Canada-specific optimization. ResumeRadar understands Canadian job title conventions, regulated profession designations (P.Eng., CPA, RN), Canadian ATS systems (Workday, Taleo as used by Canadian employers), and immigration-specific job search needs.",
            },
            {
              topic: "Pricing",
              verdict: "ResumeRadar wins",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "Jobscan starts at $49.95/month with no free plan. ResumeRadar offers a free plan with 10 optimizations/month — enough for an active job search. Pro is $19/month. Enterprise $49/month. For a job seeker on a budget (a common immigrant reality), this difference is significant.",
            },
            {
              topic: "Additional Tools",
              verdict: "ResumeRadar wins",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "Jobscan is primarily an ATS scoring tool with some LinkedIn optimization features. ResumeRadar includes a full career suite: CV builder, cover letter generator, interview prep, job feed with visa scoring, job tracker, and a CV library. One platform for the entire job search process.",
            },
          ].map((row) => (
            <div key={row.topic} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-bold text-[#131f2f]">{row.topic}</h2>
                <span className={`rounded-full border px-3 py-0.5 text-[11px] font-semibold ${row.verdictColor}`}>{row.verdict}</span>
              </div>
              <p className="text-sm leading-relaxed text-[#77838F]">{row.content}</p>
            </div>
          ))}
        </div>

        {/* When to use each */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">When to use each tool</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#006EDC] bg-[#F5F9FC] p-5">
              <p className="mb-3 font-semibold text-[#006EDC]">Use ResumeRadar if:</p>
              <ul className="space-y-2 text-sm text-[#3B4959]">
                {["You are applying to Canadian jobs", "You need French CV support", "You want your resume actually rewritten, not just scored", "You are an immigrant or newcomer", "You want a full career platform, not just an ATS tool", "Budget matters — free plan needed"].map((i) => (
                  <li key={i} className="flex gap-2"><span className="text-[#006EDC]">→</span>{i}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
              <p className="mb-3 font-semibold text-[#77838F]">Jobscan may suit you if:</p>
              <ul className="space-y-2 text-sm text-[#3B4959]">
                {["You are applying primarily to US jobs", "You prefer to rewrite your own resume and just want scoring feedback", "You already pay for Jobscan and are familiar with it"].map((i) => (
                  <li key={i} className="flex gap-2"><span className="text-[#77838F]">→</span>{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-[#b0b8c1]">* Jobscan feature information based on publicly available documentation. Verify current features at jobscan.co.</p>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Try ResumeRadar free — no credit card needed</h2>
          <p className="mt-2 text-white/80">10 optimizations/month on the free plan. Built for Canada.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] hover:bg-white/90">
            Get started free →
          </Link>
        </div>
      </div>
    </>
  );
}
