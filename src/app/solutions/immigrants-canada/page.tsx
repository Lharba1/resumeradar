import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Job Search Tools for Immigrants in Canada — ResumeRadar",
  description:
    "ResumeRadar helps immigrants and newcomers to Canada pass ATS screening, build Canadian-format resumes in English and French, and find visa-friendly jobs. Free to start.",
  alternates: { canonical: "https://resumeradar.io/solutions/immigrants-canada" },
  openGraph: {
    url: "https://resumeradar.io/solutions/immigrants-canada",
    title: "Job Search Tools for Immigrants in Canada — ResumeRadar",
    description: "Built specifically for newcomers to Canada. ATS optimizer, bilingual CV builder, and job tracker — free.",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Solutions", item: "https://resumeradar.io/solutions" },
    { "@type": "ListItem", position: 3, name: "Immigrants in Canada", item: "https://resumeradar.io/solutions/immigrants-canada" },
  ],
};

export default function ImmigrantsCanadaPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-3xl">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <span>Solutions</span>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">Immigrants in Canada</span>
        </nav>

        {/* Hero */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b3d4f5] bg-[#e6f2fe] px-4 py-1.5 text-sm font-medium text-[#006EDC]">
          Built for newcomers to Canada
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          The job search platform built for immigrants in Canada
        </h1>
        <p className="mt-4 text-lg text-[#3B4959]">
          Canadian hiring works differently — ATS screening, bilingual requirements, Canadian resume formats. ResumeRadar is the only AI career platform built around this reality.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="rounded-xl bg-[#006EDC] px-6 py-3 font-semibold text-white shadow-lg shadow-[#006EDC]/20 hover:bg-[#0060C7]">
            Get started free →
          </Link>
          <Link href="/features/ats-optimizer" className="rounded-xl border border-[#dcdce3] px-6 py-3 font-semibold text-[#3B4959] hover:border-[#CCD0D5]">
            See how it works
          </Link>
        </div>

        {/* Citable block */}
        <div className="mt-12 rounded-2xl border border-[#dcdce3] bg-white p-6">
          <h2 className="mb-3 text-xl font-bold text-[#131f2f]">Why immigrants in Canada struggle to get callbacks</h2>
          <p className="leading-relaxed text-[#3B4959]">
            According to Statistics Canada, immigrants with foreign credentials are 3× more likely to be overqualified for their first Canadian job than Canadian-born workers. A significant part of this gap is not qualification-related — it is resume formatting. Over 95% of Canadian employers with 50+ employees use Applicant Tracking Systems (ATS) that automatically screen resumes before any human reads them. Resumes not formatted to Canadian standards, missing Canadian job title conventions, or lacking the exact keywords from the posting are eliminated silently. Immigrants face an additional barrier: their education and experience are described in terminology that Canadian ATS systems do not recognize. ResumeRadar's AI understands both sides — it maps international credentials and experience into Canadian job market language, rebuilds bullets to pass ATS filters, and outputs professionally formatted English or French CVs.
          </p>
        </div>

        {/* Pain points → solutions */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">Common challenges — and how ResumeRadar solves them</h2>
          <div className="space-y-4">
            {[
              {
                problem: "\"My resume worked back home but gets no response in Canada\"",
                solution: "ResumeRadar reformats your resume to match Canadian standards — structure, length, bullet style, and job title conventions that Canadian ATS systems and recruiters expect.",
              },
              {
                problem: "\"I don't know which keywords to add for Canadian jobs\"",
                solution: "ResumeRadar reads the job posting and automatically adds the right keywords, industry terms, and skills that Canadian employers search for in ATS filtering.",
              },
              {
                problem: "\"I need to apply in French and English\"",
                solution: "ResumeRadar generates your optimized CV in English or French in one click. Institution names and proper nouns are preserved exactly as written — never mistranslated.",
              },
              {
                problem: "\"I don't know which jobs will sponsor my visa\"",
                solution: "ResumeRadar's job feed scores every listing for visa sponsorship likelihood and international friendliness, so you focus only on roles that are actually open to newcomers.",
              },
            ].map((item) => (
              <div key={item.problem} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <p className="mb-2 font-medium italic text-[#77838F]">{item.problem}</p>
                <p className="text-sm leading-relaxed text-[#131f2f]">
                  <span className="font-semibold text-[#006EDC]">ResumeRadar: </span>{item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          {[
            { stat: "+38pts", label: "Average ATS score improvement" },
            { stat: "EN + FR", label: "Bilingual CV output" },
            { stat: "Free", label: "No credit card to start" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#dcdce3] bg-white p-5 text-center">
              <p className="text-2xl font-bold text-[#006EDC]">{s.stat}</p>
              <p className="mt-1 text-xs text-[#77838F]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tools overview */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">Every tool you need, in one platform</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "🎯", title: "ATS Resume Optimizer", href: "/features/ats-optimizer", desc: "Tailor any resume to any job description and see your score improve." },
              { icon: "📝", title: "CV Builder", href: "/build-resume", desc: "Build a Canadian-format resume from scratch, with LinkedIn import." },
              { icon: "✉️", title: "Cover Letter Generator", href: "/cover-letter", desc: "AI-written cover letters tailored to each posting, in English or French." },
              { icon: "🎤", title: "Interview Prep", href: "/interview", desc: "Practice with role-specific interview questions before your real interview." },
              { icon: "🔍", title: "Job Feed", href: "/jobs", desc: "Canadian job listings scored for visa sponsorship and international friendliness." },
              { icon: "📊", title: "Job Tracker", href: "/tracker", desc: "Track every application, follow-up, and status in one place." },
            ].map((tool) => (
              <Link key={tool.title} href={tool.href} className="group rounded-2xl border border-[#dcdce3] bg-white p-5 transition hover:border-[#006EDC]">
                <div className="text-2xl">{tool.icon}</div>
                <p className="mt-3 font-semibold text-[#131f2f] group-hover:text-[#006EDC]">{tool.title}</p>
                <p className="mt-1 text-sm text-[#77838F]">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Start your Canadian job search today</h2>
          <p className="mt-2 text-white/80">Free plan — no credit card required. Built for newcomers to Canada.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] hover:bg-white/90">
            Get started free →
          </Link>
        </div>
      </div>
    </>
  );
}
