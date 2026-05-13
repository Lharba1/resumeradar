import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Canadian Resume vs US Resume — Key Differences (2026)",
  description:
    "How Canadian resumes differ from American resumes: format, length, privacy rules, bilingual requirements, and ATS expectations. Essential reading if you're relocating from the US or applying across borders.",
  alternates: { canonical: "https://resumeradar.io/resources/blog/canadian-resume-vs-us-resume" },
  openGraph: {
    url: "https://resumeradar.io/resources/blog/canadian-resume-vs-us-resume",
    title: "Canadian Resume vs US Resume — Key Differences (2026)",
    description: "Moving from the US to Canada? Or applying to both markets? Here's what changes and what stays the same.",
  },
};

const article = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Canadian Resume vs US Resume — Key Differences (2026)",
  datePublished: "2026-05-10",
  dateModified: "2026-05-10",
  author: { "@type": "Person", name: "ResumeRadar Editorial Team", url: "https://resumeradar.io/about" },
  publisher: { "@type": "Organization", name: "ResumeRadar", url: "https://resumeradar.io", logo: { "@type": "ImageObject", url: "https://resumeradar.io/logo.png" } },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://resumeradar.io/resources/blog" },
    { "@type": "ListItem", position: 3, name: "Canadian vs US Resume", item: "https://resumeradar.io/resources/blog/canadian-resume-vs-us-resume" },
  ],
};

const DIFFERENCES = [
  {
    topic: "Length",
    canada: "1–2 pages maximum. Senior roles: 2 pages. Entry level: 1 page.",
    us: "Similar — 1–2 pages. US tolerance for 2-page entry-level is slightly higher.",
    impact: "Low",
  },
  {
    topic: "Photo",
    canada: "Never include a photo. PIPEDA and human rights codes discourage them.",
    us: "Never include a photo. Same rule — both markets treat photos as a liability.",
    impact: "Low",
  },
  {
    topic: "Language",
    canada: "English in most provinces. French required in Quebec. Federal roles often require both. English-only resumes are risky for bilingual roles.",
    us: "English only in most cases. Spanish is useful in some markets but rarely required.",
    impact: "High",
  },
  {
    topic: "Date format",
    canada: "Month YYYY (e.g., May 2023 – March 2026). Avoid numerical dates — MM/DD/YYYY vs DD/MM/YYYY confusion.",
    us: "Same standard. Month YYYY preferred.",
    impact: "Low",
  },
  {
    topic: "Currency and units",
    canada: "Use CAD ($) for budget figures, kilometres for distances. Include province, not just city.",
    us: "Use USD ($). Include state abbreviation.",
    impact: "Medium",
  },
  {
    topic: "Work authorization",
    canada: "Do not include citizenship or work permit status on your resume — human rights codes prohibit employers from considering this. Disclose in the cover letter or when asked.",
    us: "Some applications ask for work authorization. Never put it on the resume unprompted.",
    impact: "High",
  },
  {
    topic: "Education section",
    canada: "Institution name, degree, city, graduation year. Add WES equivalency reference for non-Canadian degrees.",
    us: "Institution name, degree, city, graduation year. No equivalency needed — US degrees are widely recognized.",
    impact: "Medium",
  },
  {
    topic: "Certifications",
    canada: "Regulated professions require Canadian body membership: P.Eng. (PEO/APEGA), CPA, RN (provincial college). US equivalents are not automatically recognized.",
    us: "US certifications (PE, CPA, RN, PMP) recognized nationally.",
    impact: "High",
  },
  {
    topic: "Skills section",
    canada: "Listed as individual keywords — optimized for ATS parsing. French language proficiency is a significant asset listed here.",
    us: "Same structure. French proficiency is less common and less expected.",
    impact: "Medium",
  },
  {
    topic: "References",
    canada: "Never list references on resume. Write 'Available upon request' only if space allows.",
    us: "Same — references removed from resumes in both markets.",
    impact: "Low",
  },
];

export default function CanadianVsUSResumePage() {
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
          <span className="text-[#131f2f]">Canadian vs US Resume</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Blog</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          Canadian resume vs US resume — key differences
        </h1>
        <p className="mt-2 text-sm text-[#77838F]">Published May 2026 · 5 min read</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          Canadian and American resumes are similar in structure — but the differences matter, especially around language requirements, professional licensing, work authorization disclosure, and currency/unit conventions.
        </p>

        {/* Citable block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-5">
          <p className="text-sm leading-relaxed text-[#3B4959]">
            Canadian and US resumes follow the same general format: reverse-chronological, 1–2 pages, achievement-focused bullets, no photo. The critical differences are in three areas. First, language: Canada&apos;s official bilingualism means French proficiency is a significant hiring advantage in many roles, and a requirement in Quebec and federal positions. Second, professional licensing: credentials from the US are rarely recognized automatically in regulated Canadian professions — engineering, nursing, and accounting all require separate Canadian body membership. Third, work authorization: Canadian human rights codes actively discourage employers from considering immigration status during screening, so the rules around disclosure are stricter. Understanding these differences prevents the most common mistakes applicants moving between the two markets make.
          </p>
        </div>

        {/* Comparison table */}
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Side-by-side comparison</h2>
          <div className="space-y-4">
            {DIFFERENCES.map((row) => (
              <div key={row.topic} className="overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">
                <div className="flex items-center justify-between border-b border-[#dcdce3] bg-[#F5F9FC] px-5 py-2.5">
                  <span className="font-semibold text-[#131f2f]">{row.topic}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    row.impact === "High" ? "bg-red-100 text-red-600"
                    : row.impact === "Medium" ? "bg-amber-100 text-amber-600"
                    : "bg-[#F5F9FC] text-[#77838F]"
                  }`}>{row.impact} impact</span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-[#dcdce3]">
                  <div className="p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#006EDC]">Canada 🇨🇦</p>
                    <p className="text-sm leading-relaxed text-[#3B4959]">{row.canada}</p>
                  </div>
                  <div className="p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#77838F]">United States 🇺🇸</p>
                    <p className="text-sm leading-relaxed text-[#3B4959]">{row.us}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-7 text-white">
          <h2 className="text-xl font-bold">Optimize your resume for the Canadian market</h2>
          <p className="mt-2 text-sm text-white/80">ResumeRadar automatically applies Canadian formatting standards and adds the right keywords for any Canadian job posting.</p>
          <Link href="/login" className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#006EDC] hover:bg-white/90">
            Try it free →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-[#131f2f]">Keep reading</h2>
          <div className="space-y-3">
            {[
              { href: "/resources/guides/canadian-resume-guide", label: "Canadian Resume Format Guide 2026" },
              { href: "/resources/blog/resume-tips-immigrants-canada", label: "10 Resume Tips for Immigrants in Canada" },
              { href: "/solutions/immigrants-canada", label: "Job Search Tools for Immigrants in Canada" },
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
