import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Canadian Resume Format Guide 2026 — How to Write a Resume for Canada",
  description:
    "Complete guide to writing a Canadian-format resume: length, sections, bullet style, what to include and exclude, bilingual tips, and how to pass ATS screening. Updated 2026.",
  alternates: { canonical: "https://resumeradar.io/resources/guides/canadian-resume-guide" },
  openGraph: {
    url: "https://resumeradar.io/resources/guides/canadian-resume-guide",
    title: "Canadian Resume Format Guide 2026",
    description: "Everything you need to know about Canadian resume format — length, sections, ATS, bilingual tips.",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Canadian Resume Format Guide 2026",
  description: "Complete guide to writing a Canadian-format resume for immigrants and newcomers.",
  datePublished: "2026-05-01",
  dateModified: "2026-05-10",
  author: { "@type": "Organization", name: "ResumeRadar" },
  publisher: {
    "@type": "Organization",
    name: "ResumeRadar",
    logo: { "@type": "ImageObject", url: "https://resumeradar.io/logo.png" },
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Resources", item: "https://resumeradar.io/resources" },
    { "@type": "ListItem", position: 3, name: "Guides", item: "https://resumeradar.io/resources/guides" },
    { "@type": "ListItem", position: 4, name: "Canadian Resume Guide", item: "https://resumeradar.io/resources/guides/canadian-resume-guide" },
  ],
};

export default function CanadianResumeGuidePage() {
  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-2xl">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/resources/guides" className="hover:text-[#006EDC]">Guides</Link>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">Canadian Resume Guide</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Guide</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          Canadian Resume Format Guide 2026
        </h1>
        <p className="mt-2 text-sm text-[#77838F]">Last updated: May 2026 · 8 min read</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          Everything you need to write a resume that passes Canadian ATS systems and impresses Canadian recruiters — including format, length, section order, what to leave out, and bilingual tips.
        </p>

        {/* Citable definition block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-6">
          <h2 className="mb-3 text-lg font-bold text-[#131f2f]">What is a Canadian resume format?</h2>
          <p className="leading-relaxed text-[#3B4959]">
            A Canadian resume is a 1–2 page document following a reverse-chronological format that presents work experience, education, and skills in a style optimized for Canadian hiring practices and Applicant Tracking Systems (ATS). Canadian resumes differ from CVs used in Europe and many other countries — they are shorter, include no photo, no date of birth, no nationality, and no marital status. They use concise, achievement-focused bullet points starting with action verbs rather than paragraphs or duty lists. According to the Government of Canada&apos;s job market data, Canadian employers receive an average of 250+ applications per posting, making ATS filtering essential. A resume that does not conform to Canadian format standards is often screened out before any human sees it, regardless of the candidate&apos;s qualifications or experience level.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-10 space-y-10">

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">How long should a Canadian resume be?</h2>
            <p className="leading-relaxed text-[#3B4959]">
              A Canadian resume should be <strong>1 page for under 5 years of experience</strong> and <strong>2 pages maximum for 5+ years</strong>. Three-page resumes are almost never appropriate unless applying for academic or senior executive roles. Unlike European CVs that can run 4–5 pages, Canadian employers expect brevity and precision.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-[#dcdce3] bg-white">
              <table className="w-full text-sm">
                <thead className="bg-[#F5F9FC]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-[#131f2f]">Experience level</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#131f2f]">Recommended length</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Under 2 years / entry level", "1 page"],
                    ["2–5 years", "1–2 pages"],
                    ["5–15 years", "2 pages"],
                    ["15+ years / senior executive", "2 pages max (summarize older roles)"],
                  ].map(([exp, len]) => (
                    <tr key={exp} className="border-t border-[#dcdce3]">
                      <td className="px-4 py-2.5 text-[#3B4959]">{exp}</td>
                      <td className="px-4 py-2.5 font-medium text-[#131f2f]">{len}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">What sections does a Canadian resume include?</h2>
            <p className="mb-4 leading-relaxed text-[#3B4959]">
              A standard Canadian resume includes these sections in this order:
            </p>
            <div className="space-y-3">
              {[
                { num: "1", title: "Contact information", desc: "Full name, city and province (not full address), phone, email, LinkedIn URL. No photo, no date of birth, no SIN." },
                { num: "2", title: "Professional summary", desc: "2–4 sentences summarizing your value. Optional but strongly recommended — it&apos;s what recruiters read first." },
                { num: "3", title: "Work experience", desc: "Reverse chronological. Job title, company name, city, dates (month/year). 4–6 bullet points per role, each starting with an action verb." },
                { num: "4", title: "Education", desc: "Degree, institution, city, graduation year. For foreign degrees, include the Canadian equivalent or WES assessment reference." },
                { num: "5", title: "Skills", desc: "Technical and soft skills relevant to the role. Listed as keywords (ATS reads these)." },
                { num: "6", title: "Languages", desc: "Include if you are bilingual (English/French) — this is a significant advantage for many Canadian roles." },
                { num: "7", title: "Certifications", desc: "Professional certifications, licenses, and credentials. Important for regulated professions (engineering, nursing, accounting)." },
              ].map((s) => (
                <div key={s.num} className="flex gap-3 rounded-xl border border-[#dcdce3] bg-white p-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E6F2FD] text-xs font-bold text-[#006EDC]">{s.num}</div>
                  <div>
                    <p className="font-semibold text-[#131f2f]">{s.title}</p>
                    <p className="mt-0.5 text-sm text-[#77838F]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">What to leave out of a Canadian resume</h2>
            <p className="mb-4 text-[#3B4959]">Canadian resumes explicitly exclude information that is standard in many other countries:</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Photo",
                "Date of birth / age",
                "Nationality or citizenship status",
                "Marital status",
                "Social Insurance Number (SIN)",
                "Religion",
                "Gender",
                'References (say "available on request" only if asked)',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  <span className="font-bold">✗</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">How to write bullet points for a Canadian resume</h2>
            <p className="mb-4 leading-relaxed text-[#3B4959]">
              Canadian resume bullets follow a strict format: <strong>Action verb + task + result</strong>. Each bullet should be under 20 words, start with a past-tense action verb, and include a measurable outcome wherever possible.
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-red-400">Weak (avoid)</p>
                <p className="text-sm text-red-600">Responsible for managing a team of engineers and overseeing project delivery.</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-emerald-500">Strong (Canadian standard)</p>
                <p className="text-sm text-emerald-700">Led a team of 8 engineers to deliver a $2.4M infrastructure project 3 weeks ahead of schedule.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Should your Canadian resume be in English or French?</h2>
            <p className="leading-relaxed text-[#3B4959]">
              In most English-speaking provinces (Ontario, British Columbia, Alberta, etc.), submit your resume in English. In Quebec, submit in French — or bilingual if the job posting is bilingual. Federal government positions often require both languages. ResumeRadar generates your resume in English or French automatically based on your selection, and can produce both versions in one session.
            </p>
          </section>

        </div>

        {/* CTA box */}
        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-white">
          <h2 className="text-xl font-bold">Get your resume auto-formatted to Canadian standards</h2>
          <p className="mt-2 text-sm text-white/80">
            ResumeRadar rewrites your existing resume into proper Canadian format — and optimizes it for the specific job you&apos;re applying to.
          </p>
          <Link href="/login" className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#006EDC] hover:bg-white/90">
            Try it free →
          </Link>
        </div>

        {/* Related */}
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-[#131f2f]">Related guides</h2>
          <div className="space-y-3">
            <Link href="/resources/guides/ats-optimization-guide" className="flex items-center justify-between rounded-xl border border-[#dcdce3] bg-white px-5 py-3 transition hover:border-[#006EDC]">
              <span className="text-sm font-medium text-[#131f2f]">ATS Optimization Guide — How to Pass Resume Screening</span>
              <span className="text-[#006EDC]">→</span>
            </Link>
            <Link href="/solutions/immigrants-canada" className="flex items-center justify-between rounded-xl border border-[#dcdce3] bg-white px-5 py-3 transition hover:border-[#006EDC]">
              <span className="text-sm font-medium text-[#131f2f]">Job Search Guide for Immigrants in Canada</span>
              <span className="text-[#006EDC]">→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
