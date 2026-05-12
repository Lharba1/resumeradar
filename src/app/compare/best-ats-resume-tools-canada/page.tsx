import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Best ATS Resume Tools for Canada 2026 — Compared",
  description:
    "Comparing the best ATS resume optimization tools for Canadian job seekers: ResumeRadar, Jobscan, Resume.io, Rezi, and Enhancv. Features, pricing, bilingual support, and Canada-specific capabilities.",
  alternates: { canonical: "https://resumeradar.io/compare/best-ats-resume-tools-canada" },
  openGraph: {
    url: "https://resumeradar.io/compare/best-ats-resume-tools-canada",
    title: "Best ATS Resume Tools for Canada 2026",
    description: "Which ATS resume tool is best for Canadian job seekers? Detailed comparison of the top 5 options.",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://resumeradar.io/compare" },
    { "@type": "ListItem", position: 3, name: "Best ATS Resume Tools Canada", item: "https://resumeradar.io/compare/best-ats-resume-tools-canada" },
  ],
};

const TOOLS = [
  {
    rank: 1,
    name: "ResumeRadar",
    tag: "Best for Canada",
    tagColor: "bg-[#E6F2FD] text-[#006EDC]",
    price: "Free — $49/mo",
    canadaFocus: true,
    frenchSupport: true,
    aiRewrite: true,
    coverLetter: true,
    freeplan: true,
    summary: "The only ATS optimizer built specifically for the Canadian market, with bilingual support, immigration job scoring, and a full career suite. Best choice for immigrants and newcomers.",
  },
  {
    rank: 2,
    name: "Jobscan",
    tag: "Best established",
    tagColor: "bg-[#F5F9FC] text-[#77838F]",
    price: "$49.95/mo",
    canadaFocus: false,
    frenchSupport: false,
    aiRewrite: false,
    coverLetter: false,
    freeplan: false,
    summary: "The most established ATS tool — strong scoring and keyword analysis, but built for the US market. No French support, no AI rewriting, no free plan. Expensive for what it offers Canadian users.",
  },
  {
    rank: 3,
    name: "Rezi.ai",
    tag: "Best AI writing",
    tagColor: "bg-[#F5F9FC] text-[#77838F]",
    price: "$29/mo",
    canadaFocus: false,
    frenchSupport: false,
    aiRewrite: true,
    coverLetter: true,
    freeplan: false,
    summary: "Good AI resume writing, but US-focused and no Canadian job market context. No French support, limited free tier, no immigration features.",
  },
  {
    rank: 4,
    name: "Resume.io",
    tag: "Best templates",
    tagColor: "bg-[#F5F9FC] text-[#77838F]",
    price: "$24.95/mo",
    canadaFocus: false,
    frenchSupport: false,
    aiRewrite: false,
    coverLetter: true,
    freeplan: false,
    summary: "Beautiful resume templates and clean UX, but no ATS optimization, no keyword analysis, and no Canadian-specific features. More of a design tool than an ATS optimizer.",
  },
  {
    rank: 5,
    name: "Enhancv",
    tag: "Good design",
    tagColor: "bg-[#F5F9FC] text-[#77838F]",
    price: "$24.99/mo",
    canadaFocus: false,
    frenchSupport: false,
    aiRewrite: false,
    coverLetter: false,
    freeplan: false,
    summary: "Good-looking resumes with some AI content suggestions, but no ATS scoring, no bilingual support, and no Canada focus. Not the right tool for ATS optimization.",
  },
];

export default function BestATSToolsPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-3xl">

        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <span>Compare</span>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">Best ATS Resume Tools Canada</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Comparison</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          Best ATS resume tools for Canada 2026
        </h1>
        <p className="mt-2 text-sm text-[#77838F]">Last updated: May 2026 · 5 min read</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          Most ATS tools were built for the US market. If you&apos;re applying to Canadian jobs — especially in French, as an immigrant, or in a regulated profession — the tool you choose matters a lot. Here&apos;s how the top options compare.
        </p>

        {/* Quick verdict */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-white p-6">
          <h2 className="mb-3 text-lg font-bold text-[#131f2f]">Quick verdict</h2>
          <p className="leading-relaxed text-[#3B4959]">
            For Canadian job seekers — especially immigrants, newcomers, and bilingual applicants — <strong>ResumeRadar is the only tool built specifically for the Canadian market</strong>. It combines ATS scoring, AI resume rewriting, French output, immigration job scoring, and a full career suite (cover letters, interview prep, job tracker) with a free plan. Jobscan is the strongest alternative for pure ATS analysis if you are applying to US roles. Rezi.ai is worth considering for AI writing quality. Resume.io and Enhancv are design tools, not ATS optimizers.
          </p>
        </div>

        {/* Tool cards */}
        <div className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold text-[#131f2f]">The tools, ranked</h2>
          {TOOLS.map((tool) => (
            <div key={tool.name} className={`rounded-2xl border p-5 ${tool.rank === 1 ? "border-[#006EDC]" : "border-[#dcdce3]"} bg-white`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#77838F]">#{tool.rank}</span>
                    <span className="text-lg font-bold text-[#131f2f]">{tool.name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tool.tagColor}`}>{tool.tag}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#77838F]">{tool.price}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#3B4959]">{tool.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: "Canada focus", val: tool.canadaFocus },
                  { label: "French support", val: tool.frenchSupport },
                  { label: "AI rewriting", val: tool.aiRewrite },
                  { label: "Cover letters", val: tool.coverLetter },
                  { label: "Free plan", val: tool.freeplan },
                ].map((f) => (
                  <span key={f.label} className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${f.val ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#dcdce3] bg-[#F5F9FC] text-[#77838F] line-through"}`}>
                    {f.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Full feature comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#dcdce3] bg-[#F5F9FC]">
                  <th className="px-4 py-3 text-left font-semibold text-[#131f2f]">Feature</th>
                  {TOOLS.map((t) => (
                    <th key={t.name} className={`px-3 py-3 text-center font-semibold ${t.rank === 1 ? "text-[#006EDC]" : "text-[#77838F]"}`}>{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "ATS score", vals: [true, true, true, false, false] },
                  { feature: "AI resume rewriting", vals: [true, false, true, false, false] },
                  { feature: "French CV output", vals: [true, false, false, false, false] },
                  { feature: "Canada job market focus", vals: [true, false, false, false, false] },
                  { feature: "Cover letter generator", vals: [true, false, true, true, false] },
                  { feature: "Interview prep", vals: [true, false, false, false, false] },
                  { feature: "Job tracker", vals: [true, false, false, false, false] },
                  { feature: "Immigration job scoring", vals: [true, false, false, false, false] },
                  { feature: "LinkedIn import", vals: [true, true, false, false, false] },
                  { feature: "Free plan", vals: [true, false, false, false, false] },
                  { feature: "Starting price", vals: ["$0", "$49.95", "$29", "$24.95", "$24.99"] },
                ].map((row) => (
                  <tr key={row.feature} className="border-t border-[#dcdce3]">
                    <td className="px-4 py-2.5 font-medium text-[#3B4959]">{row.feature}</td>
                    {row.vals.map((v, i) => (
                      <td key={i} className="px-3 py-2.5 text-center">
                        {typeof v === "boolean"
                          ? <span className={v ? "font-bold text-emerald-500" : "text-red-400"}>{v ? "✓" : "✗"}</span>
                          : <span className={i === 0 ? "font-semibold text-[#006EDC]" : "text-[#77838F]"}>{v}</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-[#b0b8c1]">* Based on publicly available information. Verify current features on each tool&apos;s website.</p>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Try the best ATS tool for Canada — free</h2>
          <p className="mt-2 text-white/80">10 optimizations/month. No credit card. Built for Canadian job seekers.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] hover:bg-white/90">
            Get started free →
          </Link>
        </div>
      </div>
    </>
  );
}
