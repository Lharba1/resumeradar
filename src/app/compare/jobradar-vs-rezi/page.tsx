import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "ResumeRadar vs Rezi — AI Resume Tools Compared for Canada (2026)",
  description:
    "ResumeRadar vs Rezi.ai: which AI resume tool is better for Canadian job seekers? Detailed comparison of ATS scoring, AI rewriting, bilingual support, Canada focus, and pricing.",
  alternates: { canonical: "https://resumeradar.io/compare/jobradar-vs-rezi" },
  openGraph: {
    url: "https://resumeradar.io/compare/jobradar-vs-rezi",
    title: "ResumeRadar vs Rezi (2026) — AI Resume Tools for Canada",
    description: "Both are AI resume tools — but one is built for Canada. Full feature and pricing comparison.",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://resumeradar.io/compare" },
    { "@type": "ListItem", position: 3, name: "ResumeRadar vs Rezi", item: "https://resumeradar.io/compare/jobradar-vs-rezi" },
  ],
};

export default function ResumeRadarVsReziPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-3xl">

        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <span>Compare</span>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">ResumeRadar vs Rezi</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Comparison</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">ResumeRadar vs Rezi — two AI resume tools, one built for Canada</h1>
        <p className="mt-2 text-sm text-[#77838F]">Last updated: May 2026</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          Both ResumeRadar and Rezi use AI to help job seekers write better resumes. The key difference: Rezi is a US-first tool with global coverage; ResumeRadar is purpose-built for Canada with bilingual output and immigration-specific features.
        </p>

        {/* Citable block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-5">
          <h2 className="mb-2 font-semibold text-[#131f2f]">How Rezi and ResumeRadar differ on AI</h2>
          <p className="text-sm leading-relaxed text-[#3B4959]">
            Rezi uses AI primarily to suggest improvements to your existing resume — it analyzes your content, flags weaknesses, and generates bullet point alternatives. It produces strong results but treats your resume as the source of truth. ResumeRadar takes a different approach: it reads the job description first, extracts what the employer is actually looking for, then rewrites your resume specifically for that role. The result is a job-specific resume rather than a polished general one. For a job seeker targeting multiple roles in the Canadian market, job-specific optimization produces significantly higher ATS scores than a general improvement pass. Rezi also lacks French language support — a critical gap for Quebec employers, federal bilingual positions, and the roughly 3 million French-speaking immigrants who have arrived in Canada since 2010.
          </p>
        </div>

        {/* Summary cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#006EDC] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F2FD] text-xs font-black text-[#006EDC]">JR</div>
              <p className="font-bold text-[#131f2f]">ResumeRadar</p>
              <span className="ml-auto rounded-full bg-[#E6F2FD] px-2.5 py-0.5 text-[11px] font-semibold text-[#006EDC]">Best for Canada</span>
            </div>
            <ul className="space-y-1.5 text-sm text-[#3B4959]">
              {[
                "AI rewrites resume per job posting",
                "ATS score before & after",
                "English + French bilingual output",
                "Canada-specific ATS systems",
                "Free plan — 10 optimizations/mo",
                "Full suite: cover letter, interview prep",
              ].map((f) => (
                <li key={f} className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span>{f}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F9FC] text-xs font-bold text-[#77838F]">Rz</div>
              <p className="font-bold text-[#131f2f]">Rezi</p>
              <span className="ml-auto rounded-full bg-[#F5F9FC] px-2.5 py-0.5 text-[11px] font-semibold text-[#77838F]">US-first, global</span>
            </div>
            <ul className="space-y-1.5 text-sm text-[#3B4959]">
              {[
                { text: "AI suggestions and bullet generation", good: true },
                { text: "ATS scoring available", good: true },
                { text: "No French language support", good: false },
                { text: "No Canada-specific optimization", good: false },
                { text: "$29/month — no meaningful free tier", good: false },
                { text: "No interview prep or job feed", good: false },
              ].map((f) => (
                <li key={f.text} className="flex gap-2">
                  <span className={`font-bold ${f.good ? "text-emerald-500" : "text-red-400"}`}>{f.good ? "✓" : "✗"}</span>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature table */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-[#dcdce3]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#dcdce3] bg-[#F5F9FC]">
                <th className="px-4 py-3 text-left font-semibold text-[#131f2f]">Feature</th>
                <th className="px-4 py-3 text-center font-semibold text-[#006EDC]">ResumeRadar</th>
                <th className="px-4 py-3 text-center font-semibold text-[#77838F]">Rezi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dcdce3]">
              {[
                ["Job-specific AI rewriting", "✓", "Partial"],
                ["ATS compatibility score", "✓", "✓"],
                ["Before/after score comparison", "✓", "✗"],
                ["French language output", "✓", "✗"],
                ["Canadian ATS systems", "✓", "✗"],
                ["LinkedIn import", "✓", "✗"],
                ["Cover letter generator", "✓", "✗"],
                ["Interview prep", "✓", "✗"],
                ["Free plan", "10 opt/mo", "Very limited"],
                ["Paid plan", "$19/mo", "$29/mo"],
                ["Immigration-specific features", "✓", "✗"],
              ].map(([feature, jr, rz]) => (
                <tr key={feature} className="hover:bg-[#fafbfc]">
                  <td className="px-4 py-3 text-[#3B4959]">{feature}</td>
                  <td className="px-4 py-3 text-center font-medium text-emerald-600">{jr}</td>
                  <td className={`px-4 py-3 text-center font-medium ${rz === "✗" ? "text-red-400" : "text-[#3B4959]"}`}>{rz}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed breakdown */}
        <div className="mt-12 space-y-6">
          {[
            {
              topic: "AI Rewriting Approach",
              verdict: "ResumeRadar wins for Canada",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "Rezi's AI improves your resume content generally — it flags weak verbs, suggests stronger bullets, and helps structure your experience. ResumeRadar's AI reads the specific job posting first, then rewrites your resume to match it: the keywords, the seniority language, the required qualifications. For every new application, ResumeRadar produces a purpose-built resume. Rezi produces a better general resume. For active job seekers applying to multiple roles, the per-application optimization produces meaningfully better ATS scores.",
            },
            {
              topic: "Pricing",
              verdict: "ResumeRadar wins",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "Rezi's pricing starts at $29/month with a very limited free tier. ResumeRadar offers a free plan with 10 full optimizations per month — enough for an active job search. Pro is $19/month. For immigrants who may be between jobs during their Canadian job search, spending $29/month on a single tool before receiving any Canadian income is a significant barrier.",
            },
            {
              topic: "French Language",
              verdict: "ResumeRadar wins",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "Rezi has no French language support. For the Quebec market, federal bilingual positions, and the large francophone immigrant population in Canada, French resume output is not optional — it is a requirement for many positions. ResumeRadar generates complete French resumes with proper Canadian French terminology.",
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

        <p className="mt-6 text-xs text-[#b0b8c1]">* Rezi feature information based on publicly available documentation. Verify current features at rezi.ai.</p>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Start optimizing for Canada — free</h2>
          <p className="mt-2 text-white/80">10 optimizations/month. English and French. No credit card.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] hover:bg-white/90">
            Get started free →
          </Link>
        </div>
      </div>
    </>
  );
}
