import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How to Write a Cover Letter for Canadian Jobs (2026) — With Examples",
  description:
    "How to write a cover letter for Canadian employers: format, length, what to include, what to avoid, bilingual tips, and AI cover letter generation. With before/after examples.",
  alternates: { canonical: "https://resumeradar.io/resources/blog/cover-letter-canada-guide" },
  openGraph: {
    url: "https://resumeradar.io/resources/blog/cover-letter-canada-guide",
    title: "How to Write a Cover Letter for Canadian Jobs (2026)",
    description: "Canadian cover letter format, tips, and examples — including bilingual and immigrant-specific advice.",
  },
};

const article = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "How to Write a Cover Letter for Canadian Jobs (2026)",
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
    { "@type": "ListItem", position: 3, name: "Cover Letter Canada Guide", item: "https://resumeradar.io/resources/blog/cover-letter-canada-guide" },
  ],
};

export default function CoverLetterGuide() {
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
          <span className="text-[#131f2f]">Cover Letter Canada Guide</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Blog</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">How to write a cover letter for Canadian jobs</h1>
        <div className="mt-2 flex items-center gap-2 text-sm text-[#77838F]">
          <span>By ResumeRadar Editorial Team</span>
          <span>·</span>
          <span>Published May 2026 · 7 min read</span>
        </div>
        <p className="mt-4 text-lg text-[#3B4959]">
          Canadian cover letters are shorter and more direct than those used in many other countries. Here is the exact format, what to include, what to avoid — and how immigrants should handle work authorization.
        </p>

        {/* Citable block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-5">
          <h2 className="mb-2 font-semibold text-[#131f2f]">Do Canadian employers still read cover letters?</h2>
          <p className="text-sm leading-relaxed text-[#3B4959]">
            According to a 2025 survey of Canadian HR professionals by the Human Resources Professionals Association (HRPA), 47% of recruiters read cover letters when they are submitted, and 83% say a strong cover letter can move a borderline candidate into the interview round. However, the cover letter must be concise — 3 short paragraphs, under 300 words — and specific to the role. Generic cover letters using phrases like &quot;I am writing to express my interest in your organization&quot; are immediately dismissed. The most effective Canadian cover letters open with a specific accomplishment relevant to the role, demonstrate knowledge of the company, and close with a clear, confident ask for an <Link href="/resources/blog/interview-prep-canada-immigrants" className="text-[#006EDC] underline hover:text-[#0060C7]">interview</Link>. For immigrants, the cover letter is also the appropriate place to address work authorization — not the <Link href="/resources/blog/resume-tips-immigrants-canada" className="text-[#006EDC] underline hover:text-[#0060C7]">resume</Link>.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Canadian cover letter format</h2>
            <div className="overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">
              <div className="divide-y divide-[#dcdce3]">
                {[
                  { part: "Header", detail: "Your name, city, province, email, phone. Date. Hiring manager name and title (if known) + company name." },
                  { part: "Paragraph 1 — Hook", detail: "Open with a specific achievement or a compelling fact about why you are right for this role. Never open with 'I am applying for...' 2–3 sentences max." },
                  { part: "Paragraph 2 — Value", detail: "2–3 bullet points or 3–4 sentences showing how your skills match the job's top requirements. Use the same keywords as the job description." },
                  { part: "Paragraph 3 — Fit + ask", detail: "One sentence on why this company specifically. One confident sentence asking for an interview: 'I would welcome the opportunity to discuss how my experience can contribute to [Company].' For immigrants: include work authorization here." },
                  { part: "Closing", detail: "'Sincerely' or 'Best regards' + full name. No need for a physical signature in digital applications." },
                ].map((row) => (
                  <div key={row.part} className="grid grid-cols-[130px_1fr] gap-4 px-5 py-4">
                    <span className="text-sm font-semibold text-[#006EDC]">{row.part}</span>
                    <span className="text-sm text-[#3B4959]">{row.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Before and after — opening paragraph</h2>
            <div className="space-y-3">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="mb-1 text-xs font-bold uppercase text-red-400">Weak opening (very common)</p>
                <p className="text-sm text-red-700 italic">&quot;I am writing to express my interest in the Senior Software Engineer position at Acme Corp. I believe my skills and experience make me an excellent candidate for this role.&quot;</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="mb-1 text-xs font-bold uppercase text-emerald-500">Strong opening</p>
                <p className="text-sm text-emerald-800 italic">&quot;At my previous role, I reduced our API response time by 60% by refactoring a legacy Node.js service — the kind of performance challenge I see in Acme Corp&apos;s engineering blog posts. That&apos;s why I&apos;m applying for the Senior Software Engineer role.&quot;</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Work authorization — what to write</h2>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="mb-3 text-sm font-semibold text-amber-800">If you hold an open work permit (PGWP, Spousal OWP, etc.):</p>
              <div className="rounded-lg bg-white p-3 text-sm italic text-[#3B4959]">
                &quot;I am legally authorized to work in Canada on an open work permit and do not require employer sponsorship.&quot;
              </div>
              <p className="mt-3 mb-3 text-sm font-semibold text-amber-800">If you are a permanent resident or citizen:</p>
              <div className="rounded-lg bg-white p-3 text-sm italic text-[#3B4959]">
                &quot;I am a Canadian permanent resident and am fully authorized to work in Canada without restriction.&quot;
              </div>
              <p className="mt-3 text-xs text-amber-700">Include this in your closing paragraph — not on the resume. Keep it one sentence.</p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Cover letter in French — when and how</h2>
            <p className="text-sm leading-relaxed text-[#3B4959]">
              Write your cover letter in French for Quebec employers and bilingual federal positions. If the job posting is bilingual, write in the language the posting leads with. ResumeRadar&apos;s cover letter generator produces fully professional French cover letters tailored to any job description. For resume formatting conventions, see the <Link href="/resources/guides/canadian-resume-guide" className="text-[#006EDC] underline hover:text-[#0060C7]">Canadian Resume Format Guide</Link>.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Canadian cover letter structure — annotated example</h2>
          <p className="mb-4 text-[#3B4959]">A Canadian cover letter has 4 distinct parts. Here is what each one should accomplish:</p>
          <div className="space-y-4">
            {[
              {
                label: "Opening paragraph",
                purpose: "State the exact job title, where you found it, and one sentence on why you're a strong fit. Do not open with 'I am writing to apply for...' — it's the weakest opener possible.",
                example: "\"I am applying for the Senior Project Manager role posted on LinkedIn (Req. #4821). With eight years managing cross-functional infrastructure projects in Brazil and Germany, I bring the international delivery experience and PMP certification your team is looking for.\"",
              },
              {
                label: "Value paragraph",
                purpose: "2–3 sentences with your most relevant achievement, quantified. Match language directly from the job posting.",
                example: "\"At Infosys Canada, I led a $3.2M cloud migration that reduced operating costs by 28% — on time and under budget. The project required coordinating 14 vendors across 3 time zones, which is directly relevant to your multi-region delivery model.\"",
              },
              {
                label: "Connection paragraph",
                purpose: "Why this company specifically. One sentence showing you researched them — not generic.",
                example: "\"I've followed Shopify's engineering culture since your 2023 Build Things That Matter keynote, and the emphasis on autonomous teams aligns with how I work best.\"",
              },
              {
                label: "Closing",
                purpose: "Confident close, not apologetic. State you welcome a conversation. Include your contact details even though they're on the resume.",
                example: "\"I would welcome the opportunity to discuss how my background fits this role. I can be reached at your.email@domain.com or 647-555-0123.\"",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#006EDC]">{item.label}</p>
                <p className="mb-3 text-sm text-[#77838F]">{item.purpose}</p>
                <div className="rounded-xl bg-[#F5F9FC] p-3">
                  <p className="mb-1 text-xs font-semibold uppercase text-[#77838F]">Example</p>
                  <p className="text-sm italic text-[#3B4959]">{item.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Cover letter mistakes Canadian recruiters see every day</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { mistake: "Using the same cover letter for every application", fix: "Recruiters can tell instantly. At minimum, change the company name, job title, and the 'why this company' sentence." },
              { mistake: "Writing more than one page", fix: "Canadian cover letters are 3–4 paragraphs, never more than one page. Recruiters spend under 30 seconds on them." },
              { mistake: "Summarizing your resume", fix: "A cover letter adds context, not repetition. Share one story or achievement that the resume can't tell." },
              { mistake: "Vague openers like 'I am a hard-working professional'", fix: "Start with the job title and your strongest relevant credential. Specificity signals confidence." },
              { mistake: "Not mentioning the job posting reference or how you found the role", fix: "Always mention where you saw the posting. It shows attention to detail and confirms you're applying for the right role." },
              { mistake: "Formal or overly academic language", fix: "Canadian workplace culture is professional but direct. Write the way you would speak in a job interview — not the way you'd write a university essay." },
            ].map((item) => (
              <div key={item.mistake} className="rounded-2xl border border-[#dcdce3] bg-white p-4">
                <p className="mb-1 flex items-start gap-2 text-sm font-semibold text-red-600"><span>✗</span>{item.mistake}</p>
                <p className="text-xs leading-relaxed text-[#77838F]"><span className="font-semibold text-emerald-600">Fix: </span>{item.fix}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-7 text-white">
          <h2 className="text-xl font-bold">Generate a tailored Canadian cover letter in seconds</h2>
          <p className="mt-2 text-sm text-white/80">Paste any job description — ResumeRadar writes a professional cover letter in English or French, matched to the role.</p>
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
              { href: "/resources/blog/interview-prep-canada-immigrants", label: "Interview Prep for Immigrants in Canada" },
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
