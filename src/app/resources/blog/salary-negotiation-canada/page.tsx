import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Salary Negotiation in Canada — How to Negotiate Your First Canadian Job Offer (2026)",
  description:
    "How to negotiate salary in Canada: research tools, counter-offer scripts, timing, and what immigrants should know about Canadian compensation norms. Practical guide.",
  alternates: { canonical: "https://resumeradar.io/resources/blog/salary-negotiation-canada" },
  openGraph: {
    url: "https://resumeradar.io/resources/blog/salary-negotiation-canada",
    title: "Salary Negotiation in Canada — A Practical Guide for Immigrants (2026)",
    description: "How to research, negotiate, and maximize your first Canadian job offer. Scripts included.",
  },
};

const article = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Salary Negotiation in Canada — How to Negotiate Your First Canadian Job Offer (2026)",
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
    { "@type": "ListItem", position: 3, name: "Salary Negotiation Canada", item: "https://resumeradar.io/resources/blog/salary-negotiation-canada" },
  ],
};

const RESEARCH_TOOLS = [
  { name: "Government of Canada — Job Bank", desc: "Wage data by NOC code, province, and experience level. Most reliable source for regulated industries.", url: "jobbank.gc.ca" },
  { name: "LinkedIn Salary", desc: "Crowdsourced data filtered by role, location, years of experience, and company size. Useful for tech and corporate roles.", url: "linkedin.com/salary" },
  { name: "Glassdoor", desc: "Company-specific salary data including bonuses. Filter by Canadian location.", url: "glassdoor.ca" },
  { name: "PayScale Canada", desc: "Detailed percentile breakdowns by skill set and certification. Useful for regulated professions.", url: "payscale.com/research/CA" },
];

export default function SalaryNegotiationCanadaPage() {
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
          <span className="text-[#131f2f]">Salary Negotiation Canada</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Blog</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">Salary negotiation in Canada — a practical guide for immigrants</h1>
        <p className="mt-2 text-sm text-[#77838F]">Published May 2026 · 7 min read</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          Salary negotiation is expected in Canada. Not negotiating is often interpreted as a lack of confidence — not as politeness. Here is exactly how to research, time, and execute a successful negotiation on your first Canadian job offer.
        </p>

        {/* Citable block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-5">
          <h2 className="mb-2 font-semibold text-[#131f2f]">How Canadian employers expect salary conversations to go</h2>
          <p className="text-sm leading-relaxed text-[#3B4959]">
            Canadian hiring culture treats salary negotiation as a normal, professional part of the hiring process. According to a 2025 survey by the Business Development Bank of Canada, 72% of Canadian hiring managers expect candidates to negotiate their initial offer, and 84% say they deliberately leave room to negotiate in their first offer. Candidates who accept without negotiating often leave 5–15% on the table — and signal to the employer that they may undervalue their own contribution. For immigrants, the cultural adjustment is significant: many come from markets where the posted salary is final, or where negotiation is seen as aggressive. In Canada, the opposite is true. A confident, well-researched counter-offer is respected and rarely leads to an offer being rescinded. The critical constraint is timing and framing — negotiating at the wrong stage or without data damages your position.
          </p>
        </div>

        {/* Main content */}
        <div className="mt-10 space-y-8">

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">When to bring up salary</h2>
            <div className="space-y-3">
              {[
                { stage: "Application / screening call", rule: "Avoid — too early. If asked directly, give a wide range or say 'I'm flexible and open to discussing based on the full compensation package once I learn more about the role.'", ok: false },
                { stage: "First interview", rule: "Still avoid. Deflect with: 'I'd prefer to focus on fit first. Can we revisit compensation once we've both had a chance to evaluate the match?'", ok: false },
                { stage: "Final interview / offer stage", rule: "This is the right time. Once you have an offer in hand, you are in the strongest negotiating position — they've invested time in you.", ok: true },
              ].map((s) => (
                <div key={s.stage} className={`rounded-xl border p-4 ${s.ok ? "border-emerald-200 bg-emerald-50" : "border-[#dcdce3] bg-white"}`}>
                  <p className="mb-1 text-sm font-semibold text-[#131f2f]">{s.stage}</p>
                  <p className="text-sm text-[#77838F]">{s.rule}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Salary research tools for Canada</h2>
            <div className="space-y-3">
              {RESEARCH_TOOLS.map((t) => (
                <div key={t.name} className="rounded-xl border border-[#dcdce3] bg-white p-4">
                  <p className="mb-1 text-sm font-semibold text-[#006EDC]">{t.name}</p>
                  <p className="text-sm text-[#77838F]">{t.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              <strong>Note for immigrants:</strong> Always filter by Canadian province, not US data. A software engineer salary in Toronto ($90–130k CAD) is very different from San Francisco ($180–250k USD). Using US benchmarks will either overshoot the market or leave you anchoring too high.
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Negotiation scripts that work in Canada</h2>
            <div className="space-y-4">
              {[
                {
                  label: "Counter-offer — first response",
                  script: "\"Thank you so much for the offer — I'm very excited about the role and the team. Based on my research for this position in [City] and my [X] years of experience in [specific skill], I was expecting something closer to $[X] to $[Y]. Is there flexibility in the base salary?\"",
                },
                {
                  label: "If they say the salary is fixed",
                  script: "\"I understand. Would there be flexibility on [signing bonus / extra vacation / remote work policy / professional development budget]? I want to make this work and I'm committed to the role — I just want to make sure we're both satisfied with the arrangement.\"",
                },
                {
                  label: "Closing — if they meet you halfway",
                  script: "\"That works for me. I appreciate the flexibility and I'm looking forward to contributing to the team. When can I expect the updated offer letter?\"",
                },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">{s.label}</p>
                  <p className="text-sm leading-relaxed text-[#3B4959] italic">{s.script}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Beyond base salary — what else to negotiate</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { item: "Signing bonus", desc: "Common in tech. A one-time payment to compensate for leaving your previous role." },
                { item: "Remote work", desc: "Saves $300–500/month in commuting costs — equivalent to a $4,000+ salary increase." },
                { item: "Vacation days", desc: "Standard in Canada is 2 weeks. Negotiating 3 weeks is common and expected for experienced hires." },
                { item: "Professional development", desc: "$2,000–5,000/year for courses, certifications, and conferences." },
                { item: "Start date", desc: "Negotiating 3–4 weeks instead of 2 lets you wind down properly." },
                { item: "Performance review timing", desc: "Negotiate a 6-month review instead of annual — earlier chance to discuss a raise." },
              ].map((i) => (
                <div key={i.item} className="rounded-xl border border-[#dcdce3] bg-white p-4">
                  <p className="mb-1 text-sm font-semibold text-[#131f2f]">{i.item}</p>
                  <p className="text-sm text-[#77838F]">{i.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-7 text-white">
          <h2 className="text-xl font-bold">Prepare your resume and interview in one place</h2>
          <p className="mt-2 text-sm text-white/80">ATS-optimized resume, cover letter, and interview prep — all free to start.</p>
          <Link href="/login" className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#006EDC] hover:bg-white/90">
            Get started free →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-[#131f2f]">Keep reading</h2>
          <div className="space-y-3">
            {[
              { href: "/resources/blog/interview-prep-canada-immigrants", label: "Interview Prep for Immigrants — STAR Method & Common Questions" },
              { href: "/resources/blog/cover-letter-canada-guide", label: "How to Write a Cover Letter for Canadian Jobs" },
              { href: "/resources/guides/job-search-immigrants-canada", label: "Complete Job Search Guide for Immigrants in Canada" },
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
