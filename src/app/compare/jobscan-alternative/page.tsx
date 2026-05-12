import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Best Jobscan Alternative for Canada — ResumeRadar",
  description:
    "Looking for a Jobscan alternative? ResumeRadar offers ATS resume optimization built for Canada, with bilingual English/French output, a free plan, and tools for immigrants. Compare features and pricing.",
  alternates: { canonical: "https://resumeradar.io/compare/jobscan-alternative" },
  openGraph: {
    url: "https://resumeradar.io/compare/jobscan-alternative",
    title: "Best Jobscan Alternative for Canada — ResumeRadar",
    description: "ResumeRadar vs Jobscan: Canadian market focus, bilingual support, free plan, and immigration-friendly tools.",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://resumeradar.io/compare" },
    { "@type": "ListItem", position: 3, name: "Jobscan Alternative", item: "https://resumeradar.io/compare/jobscan-alternative" },
  ],
};

const COMPARISON = [
  { feature: "ATS score analysis", jobradar: true, jobscan: true },
  { feature: "Keyword matching", jobradar: true, jobscan: true },
  { feature: "AI resume rewriting", jobradar: true, jobscan: false },
  { feature: "French CV output", jobradar: true, jobscan: false },
  { feature: "Canadian market focus", jobradar: true, jobscan: false },
  { feature: "LinkedIn profile import", jobradar: true, jobscan: true },
  { feature: "Cover letter generator", jobradar: true, jobscan: false },
  { feature: "Interview prep", jobradar: true, jobscan: false },
  { feature: "Job tracker", jobradar: true, jobscan: false },
  { feature: "Immigration job scoring", jobradar: true, jobscan: false },
  { feature: "Build resume from scratch", jobradar: true, jobscan: false },
  { feature: "Free plan available", jobradar: true, jobscan: false },
  { feature: "Starting price", jobradar: "$0/mo", jobscan: "$49.95/mo" },
];

export default function JobscanAlternativePage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-3xl">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <span>Compare</span>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">Jobscan Alternative</span>
        </nav>

        {/* Hero */}
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          The best Jobscan alternative for Canada
        </h1>
        <p className="mt-4 text-lg text-[#3B4959]">
          Jobscan is a solid ATS tool — but it was built for the US market, charges $50/month, and has no bilingual or immigration features. ResumeRadar was built specifically for Canada, is free to start, and includes tools Jobscan doesn&apos;t have.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="rounded-xl bg-[#006EDC] px-6 py-3 font-semibold text-white shadow-lg shadow-[#006EDC]/20 hover:bg-[#0060C7]">
            Try ResumeRadar free →
          </Link>
          <Link href="/pricing" className="rounded-xl border border-[#dcdce3] px-6 py-3 font-semibold text-[#3B4959] hover:border-[#CCD0D5]">
            See pricing
          </Link>
        </div>

        {/* Comparison table */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">ResumeRadar vs Jobscan — feature comparison</h2>
          <div className="overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#dcdce3] bg-[#F5F9FC]">
                  <th className="px-5 py-3 text-left font-semibold text-[#131f2f]">Feature</th>
                  <th className="px-5 py-3 text-center font-semibold text-[#006EDC]">ResumeRadar</th>
                  <th className="px-5 py-3 text-center font-semibold text-[#77838F]">Jobscan</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-[#dcdce3] last:border-0 ${i % 2 === 0 ? "" : "bg-[#fafbfc]"}`}>
                    <td className="px-5 py-3 text-[#3B4959]">{row.feature}</td>
                    <td className="px-5 py-3 text-center">
                      {typeof row.jobradar === "boolean"
                        ? <span className={row.jobradar ? "text-emerald-500 font-bold" : "text-red-400"}>
                            {row.jobradar ? "✓" : "✗"}
                          </span>
                        : <span className="font-semibold text-[#006EDC]">{row.jobradar}</span>
                      }
                    </td>
                    <td className="px-5 py-3 text-center">
                      {typeof row.jobscan === "boolean"
                        ? <span className={row.jobscan ? "text-emerald-500 font-bold" : "text-red-400"}>
                            {row.jobscan ? "✓" : "✗"}
                          </span>
                        : <span className="text-[#77838F]">{row.jobscan}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-[#b0b8c1]">
            * Jobscan feature information based on publicly available documentation. Verify current features at jobscan.co.
          </p>
        </div>

        {/* Key differences */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">Why Canadian job seekers choose ResumeRadar</h2>
          <div className="space-y-4">
            {[
              {
                title: "Actually rewrites your resume (not just scores it)",
                desc: "Jobscan shows you a score and tells you what to fix — then leaves you to do it manually. ResumeRadar's AI rewrites your entire resume for you, adding keywords, restructuring bullets, and formatting to Canadian standards automatically.",
              },
              {
                title: "Built for Canada's bilingual job market",
                desc: "Jobscan has no French language support. ResumeRadar generates fully bilingual CVs — English and French — with a single click. Critical for jobs in Quebec, federal positions, and bilingual roles across Canada.",
              },
              {
                title: "Free plan included",
                desc: "Jobscan's cheapest plan starts at $49.95/month. ResumeRadar offers 10 ATS optimizations per month for free, with no credit card required. Upgrade to Pro at $19/month if you need more.",
              },
              {
                title: "Built for immigrants and newcomers",
                desc: "ResumeRadar maps international credentials and experience into Canadian job market language, scores job postings for visa sponsorship likelihood, and understands the specific challenges newcomers face in Canadian hiring.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <h3 className="mb-2 font-semibold text-[#131f2f]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#77838F]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">Common questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Is ResumeRadar really free?",
                a: "Yes. The free plan includes 10 ATS optimizations per month, 5 CV uploads, cover letter generation, interview prep, and more — with no credit card required.",
              },
              {
                q: "Can I import my resume from Jobscan?",
                a: "Yes. Export your resume as a PDF from Jobscan (or anywhere) and upload it to ResumeRadar. ResumeRadar will parse it and let you start optimizing immediately.",
              },
              {
                q: "Does ResumeRadar work for US jobs too?",
                a: "ResumeRadar is currently focused on Canada. USA support is coming soon. If you are applying to Canadian jobs, ResumeRadar is the more specialized and effective tool.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <h3 className="mb-2 font-semibold text-[#131f2f]">{item.q}</h3>
                <p className="text-sm leading-relaxed text-[#77838F]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Switch to ResumeRadar — free forever plan</h2>
          <p className="mt-2 text-white/80">No credit card. No commitment. Built for Canada.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] hover:bg-white/90">
            Get started free →
          </Link>
        </div>
      </div>
    </>
  );
}
