import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Job Search Guide for Immigrants in Canada 2026 — Complete Playbook",
  description:
    "Step-by-step job search guide for immigrants and newcomers to Canada: resume, ATS, networking, regulated professions, job boards, and bilingual market tips. Updated 2026.",
  alternates: { canonical: "https://resumeradar.io/resources/guides/job-search-immigrants-canada" },
  openGraph: {
    url: "https://resumeradar.io/resources/guides/job-search-immigrants-canada",
    title: "Job Search Guide for Immigrants in Canada 2026",
    description: "The complete playbook for finding a job in Canada as an immigrant — from resume to offer.",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Job Search Guide for Immigrants in Canada 2026",
  description: "Step-by-step job search guide for immigrants and newcomers to Canada.",
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
    { "@type": "ListItem", position: 2, name: "Guides", item: "https://resumeradar.io/resources/guides" },
    { "@type": "ListItem", position: 3, name: "Job Search for Immigrants", item: "https://resumeradar.io/resources/guides/job-search-immigrants-canada" },
  ],
};

const STEPS = [
  {
    num: "1",
    title: "Understand the Canadian hiring process",
    content: [
      "The Canadian hiring process typically runs 3–6 weeks for mid-level roles and 6–12 weeks for senior positions. The stages are: ATS screening → recruiter phone screen (15–20 min) → hiring manager interview → panel interview → reference checks → offer.",
      "Canadian employers place heavy weight on behavioural interviews using the STAR method (Situation, Task, Action, Result). Prepare 6–8 strong STAR stories from your work history before applying anywhere.",
      "References are checked for virtually every offer. Have 2–3 professional references ready — ideally direct managers — who can speak to your work in Canadian-friendly terms.",
    ],
  },
  {
    num: "2",
    title: "Build a Canadian-format resume",
    content: [
      "Your resume is the most important document in your job search. In Canada: 1–2 pages, single column, no photo, achievement-based bullets starting with action verbs, and keywords matching each job posting exactly.",
      "Every role you apply to requires a tailored resume — not the same document sent everywhere. Use ResumeRadar's ATS optimizer to tailor your resume and check your score before each application. Never submit below 70%.",
    ],
    link: { href: "/resources/guides/canadian-resume-guide", label: "Read the full Canadian resume guide →" },
  },
  {
    num: "3",
    title: "Target the right job boards",
    content: [
      "Canada's top job boards in 2026: Job Bank (government — free, visa-friendly filter), LinkedIn, Indeed Canada, Workopolis, Glassdoor, and industry-specific boards (Hired for tech, Healthjobscanada for healthcare, Engineers Canada for engineering).",
      "Job Bank is particularly valuable for immigrants because it shows NOC codes, wage ranges, and employer visa sponsorship history. Search for roles tagged 'Willing to sponsor' or 'Open to International Candidates.'",
    ],
  },
  {
    num: "4",
    title: "Network — Canadian style",
    content: [
      "Over 70% of Canadian jobs are filled through networking before being publicly posted. LinkedIn is the primary professional network in Canada — a complete, active profile is not optional.",
      "Attend industry events, meetups, and settlement agency networking nights (ACCES Employment, MOSAIC, TRIEC). These programs exist specifically to connect immigrants with Canadian employers and are free.",
      "Informational interviews are widely practised and accepted in Canada. Reaching out on LinkedIn to ask for a 15-minute call is not unusual — most professionals will say yes.",
    ],
  },
  {
    num: "5",
    title: "Regulated professions — credential recognition",
    content: [
      "If you work in a regulated profession (engineering, nursing, medicine, accounting, law, teaching), your foreign credentials must be assessed by a Canadian regulatory body before you can practise. This process can take 6–18 months.",
      "Key bodies: PEO/APEGA/EGBC for engineers, provincial nursing colleges for nurses, CPA Canada for accountants, provincial law societies for lawyers. Start this process before you arrive in Canada if possible.",
      "World Education Services (WES) provides internationally recognized credential assessments used by employers and regulators. A WES assessment reference on your resume significantly increases credibility.",
    ],
  },
  {
    num: "6",
    title: "The bilingual advantage",
    content: [
      "If you speak both English and French, you have a meaningful competitive advantage in Canada. Federal government positions require bilingual candidates. Quebec employers often require French. Many national corporations with Montreal or Ottawa offices seek bilingual staff.",
      "List language proficiency clearly in your resume Skills section: 'French — Professional working proficiency (C1)'. Use ResumeRadar to generate your CV in French for Quebec applications.",
    ],
  },
  {
    num: "7",
    title: "Work authorization — what to say and when",
    content: [
      "Under Canadian human rights codes, employers cannot ask about your immigration status on a resume or in an interview. Do not include your visa type, citizenship status, or work permit number on your resume.",
      "In a cover letter, you may proactively state: 'I am legally authorized to work in Canada and do not require employer sponsorship.' This removes doubt without disclosing specifics. If you hold an open work permit (PGWP, Spousal OWP), this one sentence is highly effective.",
    ],
  },
];

const BOARDS = [
  { name: "Job Bank", url: "canada.ca/en/services/jobs/opportunities.html", note: "Government — best for visa-friendly filtering" },
  { name: "LinkedIn Jobs", url: "linkedin.com/jobs", note: "Best for networking + mid/senior roles" },
  { name: "Indeed Canada", url: "ca.indeed.com", note: "Highest volume — good for all levels" },
  { name: "Workopolis", url: "workopolis.com", note: "Canadian-owned, good mid-market coverage" },
  { name: "Glassdoor", url: "glassdoor.ca", note: "Good for salary research + company culture" },
  { name: "Hired.com", url: "hired.com", note: "Tech-focused — software engineers" },
];

export default function JobSearchGuide() {
  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-2xl">

        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/resources/guides" className="hover:text-[#006EDC]">Guides</Link>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">Job Search for Immigrants</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Guide</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">Job search guide for immigrants in Canada 2026</h1>
        <p className="mt-2 text-sm text-[#77838F]">Last updated: May 2026 · 12 min read</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          A complete, step-by-step playbook for immigrants and newcomers navigating the Canadian job market — from understanding ATS to networking, regulated professions, and bilingual applications.
        </p>

        {/* Citable block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-6">
          <h2 className="mb-3 text-lg font-bold text-[#131f2f]">How long does it take immigrants to find a job in Canada?</h2>
          <p className="leading-relaxed text-[#3B4959]">
            According to Statistics Canada and the Longitudinal Immigration Database (IMDB), the median time for a new permanent resident to find their first Canadian job is 3–6 months for professionals with post-secondary credentials and in-demand skills. However, this varies significantly by occupation, province, language proficiency, and credential recognition status. Engineers and healthcare workers in regulated professions report the longest search times due to licensing requirements. IT professionals and tradespeople in shortage occupations typically find work fastest. The single most controllable factor in reducing job search time is resume quality — specifically, how well each application is optimized for the ATS systems that screen 95%+ of Canadian job applications before any recruiter reads them.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-10 space-y-8">
          {STEPS.map((step) => (
            <section key={step.num} className="rounded-2xl border border-[#dcdce3] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E6F2FD] text-sm font-bold text-[#006EDC]">{step.num}</div>
                <h2 className="text-lg font-bold text-[#131f2f]">{step.title}</h2>
              </div>
              <div className="space-y-3">
                {step.content.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-[#3B4959]">{para}</p>
                ))}
              </div>
              {step.link && (
                <Link href={step.link.href} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#006EDC] hover:underline">
                  {step.link.label}
                </Link>
              )}
            </section>
          ))}
        </div>

        {/* Job boards table */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Top Canadian job boards</h2>
          <div className="overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F9FC]">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-[#131f2f]">Board</th>
                  <th className="px-5 py-3 text-left font-semibold text-[#131f2f]">Best for</th>
                </tr>
              </thead>
              <tbody>
                {BOARDS.map((b) => (
                  <tr key={b.name} className="border-t border-[#dcdce3]">
                    <td className="px-5 py-3 font-medium text-[#006EDC]">{b.name}</td>
                    <td className="px-5 py-3 text-[#3B4959]">{b.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-white">
          <h2 className="text-xl font-bold">Optimize every application before you submit</h2>
          <p className="mt-2 text-sm text-white/80">ResumeRadar tailors your resume to each job posting and checks your ATS score. Free plan — 10 optimizations/month.</p>
          <Link href="/login" className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#006EDC] hover:bg-white/90">
            Get started free →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-[#131f2f]">Related guides</h2>
          <div className="space-y-3">
            {[
              { href: "/resources/guides/canadian-resume-guide", label: "Canadian Resume Format Guide 2026" },
              { href: "/resources/guides/ats-optimization-guide", label: "ATS Optimization Guide" },
              { href: "/solutions/immigrants-canada", label: "ResumeRadar for Immigrants in Canada" },
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
