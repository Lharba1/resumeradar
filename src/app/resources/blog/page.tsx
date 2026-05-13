import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Resume & Job Search Tips for Immigrants in Canada",
  description:
    "Practical guides, tips, and resources for immigrants and newcomers navigating the Canadian job market. ATS optimization, resume format, keywords, interview prep, and more.",
  alternates: { canonical: "https://resumeradar.io/resources/blog" },
};

const POSTS = [
  {
    href: "/resources/blog/resume-tips-immigrants-canada",
    category: "Resume Tips",
    title: "10 resume tips for immigrants in Canada",
    desc: "The most common mistakes immigrants make on Canadian resumes — and exactly how to fix them.",
    date: "May 2026",
    readTime: "6 min",
  },
  {
    href: "/resources/blog/ats-keywords-canada",
    category: "ATS",
    title: "Top ATS keywords for Canadian jobs 2026 — by industry",
    desc: "The most searched keywords for tech, finance, engineering, healthcare, and project management roles in Canada.",
    date: "May 2026",
    readTime: "5 min",
  },
  {
    href: "/resources/blog/canadian-resume-vs-us-resume",
    category: "Resume Format",
    title: "Canadian resume vs US resume — key differences",
    desc: "Language requirements, licensing, work authorization rules, and formatting differences between Canadian and American resumes.",
    date: "May 2026",
    readTime: "5 min",
  },
  {
    href: "/resources/blog/cover-letter-canada-guide",
    category: "Cover Letter",
    title: "How to write a cover letter for Canadian jobs",
    desc: "Canadian cover letter format, length, what to include, work authorization wording, and before/after examples.",
    date: "May 2026",
    readTime: "7 min",
  },
  {
    href: "/resources/blog/interview-prep-canada-immigrants",
    category: "Interview Prep",
    title: "Interview prep for immigrants in Canada",
    desc: "STAR method, the 8 most common behavioural questions, how to present international experience, and salary negotiation.",
    date: "May 2026",
    readTime: "8 min",
  },
  {
    href: "/resources/blog/linkedin-profile-canada",
    category: "LinkedIn",
    title: "How to optimize your LinkedIn profile for Canadian jobs",
    desc: "Complete LinkedIn checklist for immigrants: headline, about section, skills, location, and recruiter visibility.",
    date: "May 2026",
    readTime: "6 min",
  },
  {
    href: "/resources/blog/salary-negotiation-canada",
    category: "Salary",
    title: "Salary negotiation in Canada — a practical guide for immigrants",
    desc: "When to bring up salary, research tools, counter-offer scripts, and what else to negotiate beyond base pay.",
    date: "May 2026",
    readTime: "7 min",
  },
];

const GUIDES = [
  {
    href: "/resources/guides/canadian-resume-guide",
    title: "Canadian Resume Format Guide 2026",
    desc: "Complete guide: sections, length, bullet style, what to exclude.",
  },
  {
    href: "/resources/guides/ats-optimization-guide",
    title: "ATS Optimization Guide 2026",
    desc: "How ATS works in Canada and how to pass automated screening.",
  },
  {
    href: "/resources/guides/job-search-immigrants-canada",
    title: "Complete Job Search Guide for Immigrants in Canada",
    desc: "End-to-end guide: resume, LinkedIn, networking, applications, interviews, and offers.",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">Resources</h1>
        <p className="mt-3 text-lg text-[#3B4959]">
          Practical guides and tips for immigrants navigating the Canadian job market.
        </p>
      </div>

      {/* Guides */}
      <section className="mb-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#77838F]">Guides</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link key={g.href} href={g.href} className="group rounded-2xl border border-[#dcdce3] bg-white p-5 transition hover:border-[#006EDC]">
              <p className="font-semibold text-[#131f2f] group-hover:text-[#006EDC]">{g.title}</p>
              <p className="mt-1 text-sm text-[#77838F]">{g.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Blog posts */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#77838F]">Latest Articles</h2>
        <div className="space-y-4">
          {POSTS.map((post) => (
            <Link key={post.href} href={post.href} className="group flex gap-4 rounded-2xl border border-[#dcdce3] bg-white p-5 transition hover:border-[#006EDC]">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full border border-[#dcdce3] px-2.5 py-0.5 text-[11px] font-medium text-[#77838F]">{post.category}</span>
                  <span className="text-[11px] text-[#b0b8c1]">{post.date} · {post.readTime} read</span>
                </div>
                <p className="font-semibold text-[#131f2f] group-hover:text-[#006EDC]">{post.title}</p>
                <p className="mt-1 text-sm text-[#77838F]">{post.desc}</p>
              </div>
              <span className="mt-1 shrink-0 text-[#006EDC]">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
