import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "ResumeRadar vs Resume.io — ATS Optimization vs Resume Builder (2026)",
  description:
    "ResumeRadar vs Resume.io compared: ATS scoring, resume rewriting, Canada focus, pricing, and bilingual support. Which tool is right for your Canadian job search?",
  alternates: { canonical: "https://resumeradar.io/compare/jobradar-vs-resumeio" },
  openGraph: {
    url: "https://resumeradar.io/compare/jobradar-vs-resumeio",
    title: "ResumeRadar vs Resume.io (2026) — Which Is Better for Canada?",
    description: "Full comparison: ATS optimization vs visual resume builder. Which serves Canadian job seekers better?",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://resumeradar.io/compare" },
    { "@type": "ListItem", position: 3, name: "ResumeRadar vs Resume.io", item: "https://resumeradar.io/compare/jobradar-vs-resumeio" },
  ],
};

export default function ResumeRadarVsResumeIoPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-3xl">

        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <span>Compare</span>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">ResumeRadar vs Resume.io</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Comparison</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">ResumeRadar vs Resume.io — ATS optimization vs resume builder</h1>
        <p className="mt-2 text-sm text-[#77838F]">Last updated: May 2026</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          Resume.io is a popular resume builder known for polished templates. ResumeRadar is an AI-powered ATS optimizer built for the Canadian market. They solve different problems — here is which one you actually need.
        </p>

        {/* Citable block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-5">
          <h2 className="mb-2 font-semibold text-[#131f2f]">The core difference: beautiful vs ATS-optimized</h2>
          <p className="text-sm leading-relaxed text-[#3B4959]">
            Resume.io produces visually attractive resumes using polished templates — but many of those templates use multi-column layouts, text boxes, and design elements that Canadian ATS systems cannot parse. A Resume.io resume submitted to Workday, Taleo, or Greenhouse may score near zero on ATS compatibility despite looking professional. ResumeRadar takes the opposite approach: it prioritizes machine-readability and keyword optimization over visual design, producing single-column resumes that pass ATS systems used by over 80% of Canadian employers with 50+ employees. For immigrants applying to Canadian companies, ATS compatibility matters more than visual design — hiring managers rarely see a resume that fails ATS screening.
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
                "AI rewrites resume for each job",
                "ATS score before & after",
                "Built for Canadian employers",
                "English + French bilingual output",
                "Free plan — $0 to start",
                "Cover letter + interview prep",
              ].map((f) => (
                <li key={f} className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span>{f}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F9FC] text-xs font-bold text-[#77838F]">RI</div>
              <p className="font-bold text-[#131f2f]">Resume.io</p>
              <span className="ml-auto rounded-full bg-[#F5F9FC] px-2.5 py-0.5 text-[11px] font-semibold text-[#77838F]">Best for visual design</span>
            </div>
            <ul className="space-y-1.5 text-sm text-[#3B4959]">
              {[
                { text: "Polished visual templates", good: true },
                { text: "Multi-column layouts fail ATS", good: false },
                { text: "No ATS compatibility scoring", good: false },
                { text: "No job-specific AI rewriting", good: false },
                { text: "$2.95/week (billed quarterly)", good: false },
                { text: "No French language support", good: false },
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
        <div className="mt-12 space-y-6">
          {[
            {
              topic: "ATS Compatibility",
              verdict: "ResumeRadar wins",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "Resume.io templates are designed for human readers — they look great on screen but many fail ATS parsing. Multi-column layouts, headers in text boxes, and skill bars formatted as graphics are invisible to ATS software. ResumeRadar's output is single-column, plain-text compatible, and uses standard section headings that every major Canadian ATS can parse.",
            },
            {
              topic: "Job-Specific Optimization",
              verdict: "ResumeRadar wins",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "Resume.io gives you a static resume. You then manually edit it for each application. ResumeRadar reads the job description, identifies the keywords and qualifications the employer is looking for, and rewrites your bullets to match — automatically. For an active job search with 20+ applications, this time saving is significant.",
            },
            {
              topic: "Visual Design",
              verdict: "Resume.io wins",
              verdictColor: "text-amber-600 bg-amber-50 border-amber-200",
              content: "Resume.io has more visual template variety and produces more polished-looking PDFs. If you are applying to design, creative, or portfolio-based roles where a human will see the resume before any ATS screening — or using your resume for networking events — Resume.io's visual quality is stronger. ResumeRadar prioritizes machine-readability; its templates are clean and professional but not design-forward.",
            },
            {
              topic: "Canadian Market Focus",
              verdict: "ResumeRadar wins",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "Resume.io is a general-purpose global tool with no Canada-specific features. ResumeRadar is built for Canada: it understands Canadian ATS systems, Canadian job title conventions, regulated profession designations (P.Eng., CPA, RN), and the specific challenges of immigrants navigating the Canadian job market.",
            },
            {
              topic: "Pricing",
              verdict: "ResumeRadar wins",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "Resume.io charges $2.95/week billed quarterly ($38/quarter) after a 14-day trial. There is no free tier for downloads. ResumeRadar offers a free plan with 10 optimizations per month — enough to run an active job search. Pro is $19/month. For someone in the middle of a job search (a common situation for immigrants), the cost difference matters.",
            },
            {
              topic: "Bilingual Support",
              verdict: "ResumeRadar wins",
              verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              content: "Resume.io has no French language support beyond UI translation. ResumeRadar generates complete French-language resumes with proper Canadian French terminology — critical for Quebec roles, federal bilingual positions, and francophones entering the Canadian job market.",
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
                {["Applying to Canadian employers", "Applying online (ATS is in the way)", "You need French CV output", "You are an immigrant or newcomer", "You want AI to rewrite for each job", "Budget matters"].map((i) => (
                  <li key={i} className="flex gap-2"><span className="text-[#006EDC]">→</span>{i}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#dcdce3] bg-white p-5">
              <p className="mb-3 font-semibold text-[#77838F]">Resume.io may suit you if:</p>
              <ul className="space-y-2 text-sm text-[#3B4959]">
                {["You need a portfolio/design resume for creative roles", "Your resume will be handed to someone directly (not uploaded)", "You prioritize visual design over ATS pass rates"].map((i) => (
                  <li key={i} className="flex gap-2"><span className="text-[#77838F]">→</span>{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-[#b0b8c1]">* Resume.io feature information based on publicly available documentation. Verify current features at resume.io.</p>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Try ResumeRadar free — no credit card</h2>
          <p className="mt-2 text-white/80">10 optimizations/month free. ATS-optimized for Canada.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] hover:bg-white/90">
            Get started free →
          </Link>
        </div>
      </div>
    </>
  );
}
