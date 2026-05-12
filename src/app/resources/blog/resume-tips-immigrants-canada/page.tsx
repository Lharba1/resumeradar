import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "10 Resume Tips for Immigrants in Canada (2026) — ResumeRadar",
  description:
    "The most common resume mistakes immigrants make when applying for Canadian jobs — and exactly how to fix them. ATS formatting, Canadian bullet style, bilingual tips.",
  alternates: { canonical: "https://resumeradar.io/resources/blog/resume-tips-immigrants-canada" },
  openGraph: {
    url: "https://resumeradar.io/resources/blog/resume-tips-immigrants-canada",
    title: "10 Resume Tips for Immigrants in Canada (2026)",
    description: "Stop getting filtered out by ATS. These 10 fixes will transform your Canadian job search.",
  },
};

const article = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "10 Resume Tips for Immigrants in Canada (2026)",
  description: "The most common resume mistakes immigrants make when applying for Canadian jobs — and how to fix them.",
  datePublished: "2026-05-10",
  dateModified: "2026-05-10",
  author: { "@type": "Organization", name: "ResumeRadar" },
  publisher: { "@type": "Organization", name: "ResumeRadar", logo: { "@type": "ImageObject", url: "https://resumeradar.io/logo.png" } },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://resumeradar.io/resources/blog/resume-tips-immigrants-canada" },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://resumeradar.io/resources/blog" },
    { "@type": "ListItem", position: 3, name: "Resume Tips for Immigrants", item: "https://resumeradar.io/resources/blog/resume-tips-immigrants-canada" },
  ],
};

const TIPS = [
  {
    num: 1,
    title: "Remove your photo",
    desc: "Canadian resumes never include photos. Including one signals to ATS systems and recruiters that you may be unfamiliar with Canadian hiring conventions — and in some provinces it can create legal complications for the employer. Remove it immediately.",
  },
  {
    num: 2,
    title: "Use a single-column layout",
    desc: "Two-column, magazine-style, or heavily designed resumes are common in Europe and Latin America. In Canada, most ATS systems cannot parse multi-column layouts correctly — your skills end up merged with your job titles, and content disappears. Use a clean single-column format.",
  },
  {
    num: 3,
    title: "Lead every bullet with a past-tense action verb",
    desc: "Canadian resume bullets start with verbs: Led, Designed, Implemented, Reduced, Managed, Built. Never start with \"Responsible for\" or \"Worked on.\" Each bullet should follow this structure: Action verb + what you did + measurable result.",
  },
  {
    num: 4,
    title: "Quantify every achievement you can",
    desc: "Numbers make bullets credible and searchable. \"Managed a team\" becomes \"Led a team of 12 engineers.\" \"Improved efficiency\" becomes \"Reduced processing time by 35%.\" Canadian recruiters and ATS systems both respond to quantified claims.",
  },
  {
    num: 5,
    title: "Match keywords exactly from the job posting",
    desc: "ATS systems do exact or near-exact keyword matching. If the posting says \"Agile project management\" and your resume says \"worked in agile environments,\" you may score 0 for that keyword. Copy the exact phrasing from the job description.",
  },
  {
    num: 6,
    title: "Keep it to 2 pages maximum",
    desc: "Canadian resumes are 1–2 pages. Summarize roles older than 10–15 years in 1–2 lines. International candidates sometimes include 5–6 page CVs — this is appropriate in academic or European contexts, not Canadian hiring.",
  },
  {
    num: 7,
    title: "Add your Canadian contact details",
    desc: "Include your Canadian city and province, Canadian phone number, and a professional email. Listing a foreign phone number or address signals you may not be locally available. If you are already in Canada, use your Canadian details exclusively.",
  },
  {
    num: 8,
    title: "Translate your job titles to Canadian equivalents",
    desc: "Job titles vary significantly between countries. \"Head of IT\" may map to \"Director of Information Technology\" in Canadian hiring. Use the title conventions that Canadian ATS systems and recruiters search for — not your exact foreign title.",
  },
  {
    num: 9,
    title: "Include a professional summary",
    desc: "A 3–4 sentence professional summary at the top of your resume gives recruiters and AI systems a concise picture of your value. It is also prime keyword real estate for ATS optimization. Most internationally trained candidates skip this — don't.",
  },
  {
    num: 10,
    title: "Check your ATS score before every application",
    desc: "Never submit the same resume to multiple jobs. Each posting has different keywords and requirements. Use ResumeRadar's ATS optimizer to see your match score before you apply — and get a rewritten version if it's below 70%.",
  },
];

export default function ResumeTipsPage() {
  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-2xl">

        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/resources/blog" className="hover:text-[#006EDC]">Blog</Link>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">Resume Tips for Immigrants</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Blog</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          10 resume tips for immigrants in Canada
        </h1>
        <p className="mt-2 text-sm text-[#77838F]">Published May 2026 · 6 min read</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          Most immigrants applying to Canadian jobs make the same formatting and keyword mistakes. Here are the 10 most impactful fixes — and why each one matters for ATS screening.
        </p>

        {/* Citable block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-5">
          <p className="text-sm leading-relaxed text-[#3B4959]">
            <strong>The key insight:</strong> In Canada, your resume is read by software before it&apos;s read by a human. Over 95% of Canadian employers with 50+ employees use Applicant Tracking Systems (ATS) that automatically filter applications based on keyword matching, section detection, and formatting compatibility. A skilled candidate whose resume fails ATS screening will never receive a callback — regardless of their actual qualifications. The 10 tips below directly address the most common reasons immigrant resumes are filtered out of Canadian ATS systems.
          </p>
        </div>

        {/* Tips */}
        <div className="mt-10 space-y-5">
          {TIPS.map((tip) => (
            <div key={tip.num} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#E6F2FD] text-sm font-bold text-[#006EDC]">{tip.num}</div>
                <div>
                  <h2 className="font-semibold text-[#131f2f]">{tip.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#77838F]">{tip.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-7 text-white">
          <h2 className="text-xl font-bold">Apply all 10 tips automatically</h2>
          <p className="mt-2 text-sm text-white/80">ResumeRadar rewrites your resume with all of these rules applied — and tailored to the specific job you&apos;re applying to.</p>
          <Link href="/login" className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#006EDC] hover:bg-white/90">
            Try it free →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-[#131f2f]">Keep reading</h2>
          <div className="space-y-3">
            {[
              { href: "/resources/guides/canadian-resume-guide", label: "Canadian Resume Format Guide 2026" },
              { href: "/resources/guides/ats-optimization-guide", label: "ATS Optimization Guide — How to Pass Resume Screening" },
              { href: "/resources/blog/ats-keywords-canada", label: "Top ATS Keywords for Canadian Jobs in 2026" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center justify-between rounded-xl border border-[#dcdce3] bg-white px-5 py-3 transition hover:border-[#006EDC]">
                <span className="text-sm font-medium text-[#131f2f]">{l.label}</span>
                <span className="text-[#006EDC]">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
