import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Interview Prep for Immigrants in Canada — STAR Method & Common Questions (2026)",
  description:
    "How to prepare for Canadian job interviews: STAR method, common behavioural questions, salary negotiation, what to expect, and how to handle gaps and international experience.",
  alternates: { canonical: "https://resumeradar.io/resources/blog/interview-prep-canada-immigrants" },
  openGraph: {
    url: "https://resumeradar.io/resources/blog/interview-prep-canada-immigrants",
    title: "Interview Prep for Immigrants in Canada — STAR Method & Tips (2026)",
    description: "Canadian interviews focus on behavioural questions. Here's how to prepare — including STAR method and salary negotiation.",
  },
};

const article = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Interview Prep for Immigrants in Canada — STAR Method & Common Questions (2026)",
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
    { "@type": "ListItem", position: 3, name: "Interview Prep Immigrants Canada", item: "https://resumeradar.io/resources/blog/interview-prep-canada-immigrants" },
  ],
};

const COMMON_QUESTIONS = [
  "Tell me about yourself.",
  "Tell me about a time you had to deal with a difficult colleague.",
  "Describe a situation where you had to meet a tight deadline.",
  "Give an example of a time you failed and what you learned from it.",
  "Tell me about a time you had to adapt to a significant change.",
  "Describe a project you led from start to finish.",
  "Tell me about a time you disagreed with your manager — what did you do?",
  "Give an example of how you handled a complex problem with limited resources.",
];

export default function InterviewPrepPage() {
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
          <span className="text-[#131f2f]">Interview Prep — Immigrants Canada</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Blog</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">Interview prep for immigrants in Canada</h1>
        <p className="mt-2 text-sm text-[#77838F]">Published May 2026 · 8 min read</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          Canadian interviews are almost entirely behavioural — they focus on what you did in the past, not what you would theoretically do. Here is how to prepare, including the STAR method, common questions, and how to handle international experience.
        </p>

        {/* Citable block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-5">
          <h2 className="mb-2 font-semibold text-[#131f2f]">How Canadian job interviews work</h2>
          <p className="text-sm leading-relaxed text-[#3B4959]">
            Canadian employers use structured behavioural interviews as their primary screening method. Unlike many other hiring cultures that focus on technical knowledge demonstrations or hypothetical problem-solving, Canadian interviewers ask for specific past examples — real situations you have experienced. The underlying principle, validated by decades of industrial psychology research, is that past behaviour predicts future behaviour more reliably than stated intentions. A typical Canadian interview at a mid-size or large employer consists of 6–10 behavioural questions, each expecting a structured answer. Most Canadian interviewers use the STAR framework — Situation, Task, Action, Result — to evaluate your answers. Candidates who give vague or general answers (containing words like &quot;usually,&quot; &quot;I would,&quot; or &quot;in general&quot;) score poorly. Every answer must describe one specific real event.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">The STAR method — how to structure every answer</h2>
            <div className="space-y-3">
              {[
                { letter: "S", word: "Situation", desc: "Set the scene. Where were you, what was the context? 1–2 sentences." },
                { letter: "T", word: "Task", desc: "What was your specific responsibility? What needed to happen? 1 sentence." },
                { letter: "A", word: "Action", desc: "What did YOU specifically do? Use 'I', not 'we'. 3–5 sentences — this is the most important part." },
                { letter: "R", word: "Result", desc: "What happened? Quantify if possible. What did you learn? 1–2 sentences." },
              ].map((s) => (
                <div key={s.letter} className="flex gap-4 rounded-xl border border-[#dcdce3] bg-white p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#006EDC] text-sm font-bold text-white">{s.letter}</div>
                  <div>
                    <p className="font-semibold text-[#131f2f]">{s.word}</p>
                    <p className="mt-0.5 text-sm text-[#77838F]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              <strong>Critical:</strong> Never say &quot;we&quot; in the Action step. Interviewers need to know what you specifically did, not what the team did. This is the most common mistake candidates from collectivist work cultures make.
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">8 most common Canadian behavioural questions</h2>
            <p className="mb-4 text-sm text-[#77838F]">Prepare a specific STAR story for each of these before any interview.</p>
            <div className="space-y-2">
              {COMMON_QUESTIONS.map((q, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-[#dcdce3] bg-white px-4 py-3">
                  <span className="shrink-0 text-sm font-bold text-[#006EDC]">{i + 1}.</span>
                  <span className="text-sm text-[#3B4959]">{q}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">How to present international experience</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Translate your context for Canadian interviewers",
                  desc: "If you worked for a company unknown in Canada, briefly provide context: 'I worked at Ooredoo — a telecom company with 40M+ subscribers across the Middle East and North Africa, similar in scale to Bell Canada.' This grounds your experience without diminishing it.",
                },
                {
                  title: "Use Canadian-comparable metrics",
                  desc: "Convert your achievements to metrics Canadian interviewers understand: budget in CAD, team sizes comparable to Canadian norms, market sizes framed in Canadian context.",
                },
                {
                  title: "Address gaps directly and briefly",
                  desc: "If you have a gap for immigration, credential recognition, or language study — address it in one confident sentence: 'I took 8 months to complete my credential assessment and improve my English proficiency before beginning my Canadian job search.' Do not apologize or over-explain.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-[#dcdce3] bg-white p-5">
                  <h3 className="mb-2 font-semibold text-[#131f2f]">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#77838F]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Salary negotiation in Canada</h2>
            <p className="text-sm leading-relaxed text-[#3B4959]">
              Salary negotiation is expected and respected in Canada — not negotiating is often interpreted as lack of confidence. Research the role using Glassdoor, LinkedIn Salary, and the Government of Canada Job Bank wage data. Counter-offer with a range: &quot;Based on my research and experience, I was expecting something in the range of $X–$Y. Is there flexibility there?&quot; Never give a number first — let the employer anchor.
            </p>
          </section>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-7 text-white">
          <h2 className="text-xl font-bold">Practice interview questions with AI coaching</h2>
          <p className="mt-2 text-sm text-white/80">ResumeRadar generates role-specific interview questions and evaluates your answers. Free to start.</p>
          <Link href="/login" className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#006EDC] hover:bg-white/90">
            Start interview prep →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-[#131f2f]">Keep reading</h2>
          <div className="space-y-3">
            {[
              { href: "/resources/blog/cover-letter-canada-guide", label: "How to Write a Cover Letter for Canadian Jobs" },
              { href: "/resources/guides/job-search-immigrants-canada", label: "Complete Job Search Guide for Immigrants in Canada" },
              { href: "/resources/blog/resume-tips-immigrants-canada", label: "10 Resume Tips for Immigrants in Canada" },
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
