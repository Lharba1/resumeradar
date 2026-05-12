import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Canadian Resume Templates 2026 — ATS-Ready",
  description:
    "Free ATS-friendly Canadian resume templates for immigrants, newcomers, engineers, students, and bilingual job seekers. Download or use directly in ResumeRadar.",
  alternates: { canonical: "https://resumeradar.io/resources/templates" },
  openGraph: {
    url: "https://resumeradar.io/resources/templates",
    title: "Free Canadian Resume Templates 2026 — ATS-Ready",
    description: "Free ATS-optimized Canadian resume templates — no design skills needed.",
  },
};

const TEMPLATES = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    tag: "Most popular",
    tagColor: "bg-[#E6F2FD] text-[#006EDC]",
    best: "All industries — engineers, IT, finance, management",
    features: ["Single column", "Section borders", "Two-column skills", "ATS-optimized"],
    ats: "98%",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    tag: "Clean & simple",
    tagColor: "bg-[#F5F9FC] text-[#77838F]",
    best: "Tech, startups, design, creative roles",
    features: ["Blue accents", "Dash bullets", "Clean typography", "ATS-optimized"],
    ats: "97%",
  },
];

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">Free Canadian resume templates</h1>
        <p className="mt-3 text-lg text-[#3B4959]">
          ATS-ready templates designed for the Canadian job market. All templates pass the most common Canadian ATS systems — Workday, Taleo, Greenhouse, and iCIMS.
        </p>
      </div>

      {/* Templates */}
      <div className="grid gap-6 sm:grid-cols-2">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="rounded-2xl border border-[#dcdce3] bg-white overflow-hidden">
            {/* Preview placeholder */}
            <div className="h-48 bg-gradient-to-br from-[#F5F9FC] to-[#E6F2FD] flex items-center justify-center border-b border-[#dcdce3]">
              <div className="text-center">
                <div className="mx-auto h-16 w-12 rounded border border-[#dcdce3] bg-white shadow-sm flex flex-col p-1.5 gap-1">
                  <div className="h-2 w-full rounded bg-[#006EDC]/30" />
                  <div className="h-1 w-3/4 rounded bg-[#dcdce3]" />
                  <div className="mt-0.5 space-y-0.5">
                    {[1,2,3].map(i => <div key={i} className="h-0.5 w-full rounded bg-[#e8e9eb]" />)}
                  </div>
                </div>
                <p className="mt-2 text-xs text-[#77838F]">{t.name}</p>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <p className="font-semibold text-[#131f2f]">{t.name}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${t.tagColor}`}>{t.tag}</span>
                <span className="ml-auto text-[11px] font-semibold text-emerald-600">{t.ats} ATS pass rate</span>
              </div>
              <p className="text-xs text-[#77838F] mb-3">Best for: {t.best}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {t.features.map((f) => (
                  <span key={f} className="rounded-full border border-[#dcdce3] bg-[#F5F9FC] px-2.5 py-0.5 text-[11px] text-[#3B4959]">{f}</span>
                ))}
              </div>
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006EDC] py-2.5 text-sm font-semibold text-white hover:bg-[#0060C7]"
              >
                Use this template →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Why ATS-ready matters */}
      <div className="mt-12 rounded-2xl border border-[#dcdce3] bg-white p-6">
        <h2 className="mb-3 text-xl font-bold text-[#131f2f]">Why ATS compatibility matters for Canadian templates</h2>
        <p className="leading-relaxed text-[#3B4959] text-sm">
          Many beautiful resume templates — especially those from popular design sites like Canva or Pinterest — fail ATS parsing completely. They use multi-column layouts, text boxes, tables, and graphics that ATS software cannot read. Your experience and skills become invisible to the screening system, and your application is rejected automatically. All ResumeRadar templates are single-column, use standard section headings, and have been tested against Workday, Taleo, Greenhouse, BambooHR, and iCIMS — the five ATS systems used by over 80% of Canadian employers with 50+ employees.
        </p>
      </div>

      {/* How to use */}
      <div className="mt-8 rounded-2xl border border-[#dcdce3] bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-[#131f2f]">How to use these templates</h2>
        <div className="space-y-3">
          {[
            { num: "1", text: "Sign in to ResumeRadar (free — no credit card required)." },
            { num: "2", text: "Upload your existing resume or build from scratch in the Resume Builder." },
            { num: "3", text: "Paste a job description and click Optimize — ResumeRadar tailors your content to the role." },
            { num: "4", text: "Select your preferred template in the results panel." },
            { num: "5", text: "Download as a professionally formatted PDF, ready to submit." },
          ].map((s) => (
            <div key={s.num} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E6F2FD] text-xs font-bold text-[#006EDC]">{s.num}</div>
              <p className="text-sm leading-relaxed text-[#3B4959]">{s.text}</p>
            </div>
          ))}
        </div>
        <Link href="/login" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#006EDC] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0060C7]">
          Build my resume →
        </Link>
      </div>

      {/* Related */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-[#131f2f]">Related resources</h2>
        <div className="space-y-3">
          {[
            { href: "/resources/guides/canadian-resume-guide", label: "Canadian Resume Format Guide 2026" },
            { href: "/resources/guides/ats-optimization-guide", label: "ATS Optimization Guide — How to Pass Resume Screening" },
            { href: "/resources/blog/resume-tips-immigrants-canada", label: "10 Resume Tips for Immigrants in Canada" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="flex items-center justify-between rounded-xl border border-[#dcdce3] bg-white px-5 py-3 transition hover:border-[#006EDC]">
              <span className="text-sm font-medium text-[#131f2f]">{l.label}</span>
              <span className="text-[#006EDC]">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
