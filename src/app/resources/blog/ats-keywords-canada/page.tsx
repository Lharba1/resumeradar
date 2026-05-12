import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Top ATS Keywords for Canadian Jobs 2026 — By Industry",
  description:
    "The most searched ATS keywords for Canadian jobs in 2026 — by industry: tech, finance, healthcare, engineering, and project management. With tips on how to add them to your resume.",
  alternates: { canonical: "https://resumeradar.io/resources/blog/ats-keywords-canada" },
  openGraph: {
    url: "https://resumeradar.io/resources/blog/ats-keywords-canada",
    title: "Top ATS Keywords for Canadian Jobs 2026 — By Industry",
    description: "Which keywords do Canadian ATS systems search for? A breakdown by industry with actionable tips.",
  },
};

const article = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Top ATS Keywords for Canadian Jobs 2026 — By Industry",
  datePublished: "2026-05-10",
  dateModified: "2026-05-10",
  author: { "@type": "Organization", name: "ResumeRadar" },
  publisher: { "@type": "Organization", name: "ResumeRadar", logo: { "@type": "ImageObject", url: "https://resumeradar.io/logo.png" } },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://resumeradar.io/resources/blog" },
    { "@type": "ListItem", position: 3, name: "ATS Keywords Canada", item: "https://resumeradar.io/resources/blog/ats-keywords-canada" },
  ],
};

const INDUSTRIES = [
  {
    name: "Software & Technology",
    keywords: ["Agile", "Scrum", "CI/CD", "Python", "React", "Node.js", "AWS", "Azure", "DevOps", "REST API", "TypeScript", "Docker", "Kubernetes", "Git", "SQL", "Machine Learning", "API integration", "Microservices"],
  },
  {
    name: "Finance & Accounting",
    keywords: ["CPA", "IFRS", "GAAP", "Financial modeling", "Excel", "Power BI", "SAP", "Accounts payable/receivable", "Variance analysis", "Audit", "Reconciliation", "Budgeting", "Forecasting", "QuickBooks", "Tax compliance"],
  },
  {
    name: "Engineering",
    keywords: ["P.Eng.", "AutoCAD", "Revit", "Civil 3D", "ETABS", "PMP", "CAD", "Project delivery", "QA/QC", "CSA standards", "NBC", "Design review", "Cost estimation", "Commissioning", "SolidWorks", "MATLAB"],
  },
  {
    name: "Healthcare",
    keywords: ["College of Nurses of Ontario (CNO)", "CRNE", "EMR", "Electronic Medical Records", "Patient care", "OHIP", "Clinical assessment", "Medication administration", "WHMIS", "ACLS", "BLS", "Discharge planning", "Wound care"],
  },
  {
    name: "Project Management",
    keywords: ["PMP", "Agile", "Scrum", "Waterfall", "Risk management", "Stakeholder management", "MS Project", "JIRA", "Budget management", "Resource allocation", "KPI", "Milestone tracking", "Change management", "PMO"],
  },
  {
    name: "Marketing & Communications",
    keywords: ["Google Analytics", "SEO", "SEM", "HubSpot", "Salesforce", "CRM", "Content strategy", "Social media management", "Brand strategy", "Email marketing", "Conversion optimization", "A/B testing", "Campaign management"],
  },
];

export default function ATSKeywordsPage() {
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
          <span className="text-[#131f2f]">ATS Keywords Canada</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Blog</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          Top ATS keywords for Canadian jobs 2026
        </h1>
        <p className="mt-2 text-sm text-[#77838F]">Published May 2026 · 5 min read</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          ATS keyword matching is how your resume gets past automated screening. Here are the most searched keywords for the top Canadian industries — and how to use them without keyword stuffing.
        </p>

        {/* Citable block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-5">
          <h2 className="mb-2 font-semibold text-[#131f2f]">How ATS keyword matching works in Canada</h2>
          <p className="text-sm leading-relaxed text-[#3B4959]">
            Canadian ATS systems score resumes by comparing the text of your resume against the text of the job description. The system searches for exact or near-exact keyword matches across your skills section, job titles, bullet points, and professional summary. Keywords that appear in the job description but not in your resume reduce your ATS score. The most important keywords to match are those that appear multiple times in the posting — repetition signals importance to both the ATS algorithm and the hiring manager. Hard skills (specific tools, certifications, standards) are weighted more heavily than soft skills. Industry-specific certifications (P.Eng., CPA, PMP) are critical filters — if the role requires them and they are not on your resume, your application will be rejected regardless of other qualifications.
          </p>
        </div>

        {/* How to add keywords */}
        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="mb-2 font-semibold text-amber-800">How to add keywords without keyword stuffing</h2>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex gap-2"><span>✓</span><span>Add keywords into your bullet points in context: <em>"Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 40%."</em></span></li>
            <li className="flex gap-2"><span>✓</span><span>Include a dedicated Skills section — ATS systems specifically parse this section for technical keywords.</span></li>
            <li className="flex gap-2"><span>✓</span><span>Add keywords to your professional summary — it is read first by both ATS and recruiters.</span></li>
            <li className="flex gap-2"><span>✗</span><span>Do not add a hidden white-text keyword block — ATS systems flag this as manipulation.</span></li>
          </ul>
        </div>

        {/* Industry keywords */}
        <div className="mt-10 space-y-8">
          <h2 className="text-2xl font-bold text-[#131f2f]">Keywords by industry</h2>
          {INDUSTRIES.map((ind) => (
            <section key={ind.name}>
              <h3 className="mb-3 text-lg font-bold text-[#131f2f]">{ind.name}</h3>
              <div className="flex flex-wrap gap-2">
                {ind.keywords.map((kw) => (
                  <span key={kw} className="rounded-full border border-[#dcdce3] bg-white px-3 py-1 text-sm text-[#3B4959]">
                    {kw}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-[#b3d4f5] bg-[#E6F2FD] p-4 text-sm text-[#006EDC]">
          <strong>Important:</strong> These are general keyword lists. The best keywords for your specific application come from the actual job description you are applying to. <Link href="/features/ats-optimizer" className="underline">ResumeRadar&apos;s ATS optimizer</Link> extracts the exact keywords from each posting and adds the missing ones to your resume automatically.
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-7 text-white">
          <h2 className="text-xl font-bold">Get the right keywords for your specific job</h2>
          <p className="mt-2 text-sm text-white/80">Paste any job description — ResumeRadar identifies every missing keyword and adds it to your resume.</p>
          <Link href="/login" className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#006EDC] hover:bg-white/90">
            Try it free →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-[#131f2f]">Keep reading</h2>
          <div className="space-y-3">
            {[
              { href: "/resources/guides/ats-optimization-guide", label: "ATS Optimization Guide — How to Pass Resume Screening" },
              { href: "/resources/blog/resume-tips-immigrants-canada", label: "10 Resume Tips for Immigrants in Canada" },
              { href: "/resources/guides/canadian-resume-guide", label: "Canadian Resume Format Guide 2026" },
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
