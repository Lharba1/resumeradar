import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "ATS Optimization Guide 2026 — How to Pass Resume Screening in Canada",
  description:
    "How ATS systems work in Canada, why your resume gets filtered out, and how to optimize it to pass screening. Includes keyword strategy, formatting rules, and scoring tips. Updated 2026.",
  alternates: { canonical: "https://resumeradar.io/resources/guides/ats-optimization-guide" },
  openGraph: {
    url: "https://resumeradar.io/resources/guides/ats-optimization-guide",
    title: "ATS Optimization Guide 2026 — Pass Resume Screening in Canada",
    description: "Why 75% of resumes are rejected by ATS before any human reads them — and how to fix yours.",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "ATS Optimization Guide 2026 — How to Pass Resume Screening in Canada",
  description: "How to optimize your resume to pass Applicant Tracking System screening in Canada.",
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
    { "@type": "ListItem", position: 4, name: "ATS Optimization Guide", item: "https://resumeradar.io/resources/guides/ats-optimization-guide" },
  ],
};

export default function ATSOptimizationGuidePage() {
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
          <span className="text-[#131f2f]">ATS Optimization Guide</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Guide</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          ATS Optimization Guide 2026
        </h1>
        <p className="mt-2 text-sm text-[#77838F]">Last updated: May 2026 · 10 min read</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          75% of resumes are rejected by Applicant Tracking Systems before any human reads them. This guide explains exactly how ATS works in Canada, why resumes fail, and the specific steps to optimize yours.
        </p>

        {/* Citable definition block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-6">
          <h2 className="mb-3 text-lg font-bold text-[#131f2f]">What is an Applicant Tracking System (ATS)?</h2>
          <p className="leading-relaxed text-[#3B4959]">
            An Applicant Tracking System (ATS) is software used by employers to receive, sort, and filter job applications before a recruiter reviews them. In Canada, over 95% of companies with more than 50 employees use an ATS — including all major banks, government departments, tech companies, hospitals, and retailers. The ATS parses each resume into structured data, then scores it against the job description using keyword matching, section detection, and formatting compatibility checks. Resumes that score below the employer&apos;s threshold — typically 60–70% match — are automatically moved to a rejected folder. The recruiter never sees them. ATS systems commonly used in Canada include Workday, Taleo, Greenhouse, BambooHR, and iCIMS. Each has slightly different parsing behavior, which is why ATS optimization requires formatting rules that work across all systems, not just one.
          </p>
        </div>

        <div className="mt-10 space-y-10">

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Why do resumes fail ATS screening?</h2>
            <div className="space-y-3">
              {[
                { reason: "Missing keywords", detail: "The job posting contains specific terms the ATS searches for. If your resume uses synonyms or different phrasing, it scores lower — even if your experience is identical." },
                { reason: "Wrong section headings", detail: "ATS parsers look for standard headers like \"Work Experience\", \"Education\", and \"Skills\". Creative headings like \"My Journey\" or \"Where I've Been\" confuse parsers and cause data loss." },
                { reason: "Tables, columns, and text boxes", detail: "Many ATS systems cannot read text inside tables, two-column layouts, headers/footers, or text boxes. Content in these elements becomes invisible to the system." },
                { reason: "Non-standard file format", detail: "Always submit as a .docx or single-column PDF. Scanned PDFs, image-based PDFs, and heavily designed files often fail to parse correctly." },
                { reason: "Missing contact information", detail: "ATS systems try to extract name, email, phone, and location from your resume. If these are in a table, header, or unusual position, they may not be captured correctly." },
              ].map((item) => (
                <div key={item.reason} className="rounded-xl border border-[#dcdce3] bg-white p-4">
                  <p className="font-semibold text-[#131f2f]">{item.reason}</p>
                  <p className="mt-1 text-sm text-[#77838F]">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">How to find the right keywords for a job posting</h2>
            <p className="mb-4 leading-relaxed text-[#3B4959]">
              Keywords come directly from the job description. Here is a simple manual method:
            </p>
            <div className="space-y-3">
              {[
                { step: "1", text: "Read the job posting and highlight every skill, tool, technology, and qualification mentioned — especially in the requirements section." },
                { step: "2", text: "Identify which of these terms appear multiple times. Frequency indicates importance to the employer and the ATS." },
                { step: "3", text: "Check if your resume uses the exact same phrasing. If the posting says \"project management\" and your resume says \"managed projects\", add the exact phrase." },
                { step: "4", text: "Add missing keywords naturally into your work experience bullets, skills section, or professional summary." },
              ].map((s) => (
                <div key={s.step} className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E6F2FD] text-xs font-bold text-[#006EDC]">{s.step}</div>
                  <p className="text-sm leading-relaxed text-[#3B4959]">{s.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-[#b3d4f5] bg-[#E6F2FD] p-4 text-sm text-[#006EDC]">
              <strong>ResumeRadar does this automatically.</strong> Paste the job description and ResumeRadar identifies all missing keywords, adds them to your resume in context, and shows you exactly which ones were matched before and after.
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">ATS formatting rules for Canada</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { do: true, text: "Use a single-column layout" },
                { do: true, text: "Use standard section headers (Work Experience, Education, Skills)" },
                { do: true, text: "Submit as .docx or clean PDF" },
                { do: true, text: "Use standard fonts (Arial, Calibri, Times New Roman)" },
                { do: false, text: "Use tables or text boxes for content" },
                { do: false, text: "Use two-column or magazine-style layouts" },
                { do: false, text: "Put contact info in the document header" },
                { do: false, text: "Use creative section headings" },
              ].map((item) => (
                <div key={item.text} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${item.do ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-600"}`}>
                  <span className="font-bold">{item.do ? "✓" : "✗"}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">What ATS score should you aim for?</h2>
            <p className="leading-relaxed text-[#3B4959]">
              Most Canadian ATS systems use a threshold of <strong>60–70% match</strong> before a resume is forwarded to a recruiter. However, in competitive markets (tech, finance, government), recruiters may only review the top 10–15% of applications, meaning a score above 80% is needed to stand out. As a rule: never submit a resume with a score below 70%. Use <Link href="/features/ats-optimizer" className="text-[#006EDC] underline hover:no-underline">ResumeRadar&apos;s ATS optimizer</Link> to see your score before you apply.
            </p>
          </section>

        </div>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">How different ATS systems score resumes</h2>
            <p className="mb-4 leading-relaxed text-[#3B4959]">Not all ATS systems work the same way. Understanding the platform an employer uses helps you optimize correctly.</p>
            <div className="overflow-hidden rounded-xl border border-[#dcdce3] bg-white">
              <table className="w-full text-sm">
                <thead className="bg-[#F5F9FC]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-[#131f2f]">ATS System</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#131f2f]">Used by</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#131f2f]">Key optimization factor</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Workday", "RBC, TD, federal government, Shopify", "Section headers must match expected labels exactly"],
                    ["Taleo (Oracle)", "Air Canada, Bell, large manufacturers", "Keyword density + exact phrase matching"],
                    ["Greenhouse", "Tech companies, startups", "Skills section + job title matching"],
                    ["iCIMS", "Healthcare, universities, mid-size companies", "Education section formatting critical"],
                    ["SAP SuccessFactors", "Enterprise, mining, energy sector", "Structured data extraction from standard sections"],
                  ].map(([ats, users, factor]) => (
                    <tr key={ats} className="border-t border-[#dcdce3]">
                      <td className="px-4 py-3 font-medium text-[#131f2f]">{ats}</td>
                      <td className="px-4 py-3 text-[#77838F]">{users}</td>
                      <td className="px-4 py-3 text-[#3B4959]">{factor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">What hurts your ATS score — common mistakes</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { issue: "Two-column or table layouts", detail: "ATS parsers read linearly. Multi-column layouts merge content from different sections." },
                { issue: "Headers/footers with contact info", detail: "Many ATS systems ignore headers and footers entirely. Put contact info in the main body." },
                { issue: "Images, logos, or graphics", detail: "ATS cannot extract text from images. Any content in a graphic is invisible to the system." },
                { issue: "Non-standard section labels", detail: "Use 'Work Experience', not 'My Career'. ATS looks for expected labels." },
                { issue: "Saved .docx with tracked changes", detail: "Always submit clean files without revision marks. Track changes can confuse parsers." },
                { issue: "Text boxes (Word/Canva)", detail: "Text boxes are extracted separately or missed entirely. Use standard paragraph text only." },
              ].map((item) => (
                <div key={item.issue} className="rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="mb-1 font-semibold text-red-700">✗ {item.issue}</p>
                  <p className="text-xs leading-relaxed text-red-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-white">
          <h2 className="text-xl font-bold">Check your ATS score for free</h2>
          <p className="mt-2 text-sm text-white/80">
            Upload your resume, paste a job description, and see your ATS match score in under 60 seconds.
          </p>
          <Link href="/login" className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#006EDC] hover:bg-white/90">
            Try it free →
          </Link>
        </div>

        {/* Related */}
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-[#131f2f]">Related guides</h2>
          <div className="space-y-3">
            <Link href="/resources/guides/canadian-resume-guide" className="flex items-center justify-between rounded-xl border border-[#dcdce3] bg-white px-5 py-3 transition hover:border-[#006EDC]">
              <span className="text-sm font-medium text-[#131f2f]">Canadian Resume Format Guide 2026</span>
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
