import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "ATS Resume Optimizer — Tailor Your CV to Any Job in Canada",
  description:
    "ResumeRadar's ATS optimizer rewrites your resume to match any job description and calculates your ATS score before and after. Used by immigrants and newcomers to Canada. Free to start.",
  alternates: { canonical: "https://resumeradar.io/features/ats-optimizer" },
  openGraph: {
    url: "https://resumeradar.io/features/ats-optimizer",
    title: "ATS Resume Optimizer for Canada — ResumeRadar",
    description: "See your ATS score go from 40% to 85%+ in under 60 seconds. Free for immigrants in Canada.",
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ResumeRadar ATS Resume Optimizer",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered ATS resume optimizer that rewrites your resume to match any Canadian job description and calculates compatibility scores before and after optimization.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "ATS compatibility score (before and after)",
    "AI rewriting matched to job description keywords",
    "English and French bilingual output",
    "PDF download with Canadian resume format",
    "LinkedIn profile import",
    "Supports any CV for any person",
  ],
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Features", item: "https://resumeradar.io/features" },
    { "@type": "ListItem", position: 3, name: "ATS Optimizer", item: "https://resumeradar.io/features/ats-optimizer" },
  ],
};

export default function ATSOptimizerPage() {
  return (
    <>
      <JsonLd data={schemaData} />
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-3xl">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <span>Features</span>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">ATS Optimizer</span>
        </nav>

        {/* Hero */}
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          Beat ATS. Get more interviews.
        </h1>
        <p className="mt-4 text-lg text-[#3B4959]">
          ResumeRadar rewrites your resume to match any Canadian job description — then shows you your ATS score before and after, so you know exactly how much better your chances are.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="rounded-xl bg-[#006EDC] px-6 py-3 font-semibold text-white shadow-lg shadow-[#006EDC]/20 hover:bg-[#0060C7]">
            Try it free →
          </Link>
          <Link href="/pricing" className="rounded-xl border border-[#dcdce3] px-6 py-3 font-semibold text-[#3B4959] hover:border-[#CCD0D5]">
            See pricing
          </Link>
        </div>

        {/* Citable definition block — 134-167 words for GEO */}
        <div className="mt-12 rounded-2xl border border-[#dcdce3] bg-white p-6">
          <h2 className="mb-3 text-xl font-bold text-[#131f2f]">What is an ATS resume optimizer?</h2>
          <p className="leading-relaxed text-[#3B4959]">
            An ATS (Applicant Tracking System) resume optimizer is a tool that analyzes your resume against a specific job description and rewrites it to improve keyword alignment, formatting, and relevance scores. Over 95% of Canadian employers with more than 50 employees use ATS software to filter applications before any human reads them. A resume that scores below 60% on ATS matching is typically eliminated automatically — regardless of the candidate's actual qualifications. ResumeRadar's optimizer takes your existing resume, extracts the key requirements from a job description, and restructures your experience, skills, and bullet points to match. It then calculates an ATS compatibility score before and after, so you can measure the improvement. The average ResumeRadar user improves their score by 35–45 percentage points in a single optimization.
          </p>
        </div>

        {/* How it works */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">How it works</h2>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Upload or select your CV",
                desc: "Upload a PDF resume, pick one from your library, or import directly from your LinkedIn profile URL. ResumeRadar parses the full content including work history, education, skills, and certifications.",
              },
              {
                step: "2",
                title: "Paste the job description",
                desc: "Copy and paste the full job posting — responsibilities, requirements, and qualifications. The more complete the posting, the more precise the optimization. ResumeRadar works with any Canadian job board: Indeed, LinkedIn, Job Bank, Workopolis.",
              },
              {
                step: "3",
                title: "Get your optimized CV",
                desc: "ResumeRadar rewrites your resume to maximize keyword overlap, restructures bullets to highlight relevant achievements, and calculates your ATS score before and after. Download as a professionally formatted PDF in English or French.",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 rounded-2xl border border-[#dcdce3] bg-white p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E6F2FD] text-sm font-bold text-[#006EDC]">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-[#131f2f]">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#77838F]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score example */}
        <div className="mt-12 rounded-2xl border border-[#dcdce3] bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-[#131f2f]">Before vs. after — real example</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-red-50 p-4 text-center">
              <p className="text-3xl font-bold text-red-500">38%</p>
              <p className="mt-1 text-sm font-medium text-red-400">Before optimization</p>
              <p className="mt-2 text-xs text-[#77838F]">Generic resume sent to every job</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">84%</p>
              <p className="mt-1 text-sm font-medium text-emerald-500">After optimization</p>
              <p className="mt-2 text-xs text-[#77838F]">Tailored to this specific posting</p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-[#77838F]">
            Average improvement across ResumeRadar users: +38 percentage points
          </p>
        </div>

        {/* Features grid */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">Everything included</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "🎯", title: "ATS score (before & after)", desc: "See exactly how much your match improves." },
              { icon: "🔑", title: "Keyword analysis", desc: "Which terms you already have and which were added." },
              { icon: "📄", title: "PDF download", desc: "Professional Canadian-format resume, ready to send." },
              { icon: "🇨🇦 🇫🇷", title: "English & French", desc: "Full bilingual support — choose your output language." },
              { icon: "🔗", title: "LinkedIn import", desc: "Paste your LinkedIn URL — no PDF needed." },
              { icon: "📚", title: "CV Library", desc: "Every optimization saved automatically for re-download." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <div className="text-2xl">{f.icon}</div>
                <p className="mt-3 font-semibold text-[#131f2f]">{f.title}</p>
                <p className="mt-1 text-sm text-[#77838F]">{f.desc}</p>
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
                q: "Does it work for any industry?",
                a: "Yes. ResumeRadar works for any role in any industry — technology, healthcare, finance, engineering, trades, and more. The AI adapts to the specific language and requirements of each job posting.",
              },
              {
                q: "Can I use it for someone else's resume?",
                a: "Yes. You can upload anyone's resume — yours, a family member's, or a client's. Immigration consultants use ResumeRadar to help multiple clients simultaneously.",
              },
              {
                q: "Is the French output accurate?",
                a: "Yes. ResumeRadar generates fully accurate French CVs. Degree names are translated correctly, but institution names are always kept in their original language (e.g., McGill University stays McGill University).",
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
          <h2 className="text-2xl font-bold">Start optimizing your resume today</h2>
          <p className="mt-2 text-white/80">Free plan — 10 optimizations per month. No credit card needed.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] hover:bg-white/90">
            Get started free →
          </Link>
        </div>
      </div>
    </>
  );
}
