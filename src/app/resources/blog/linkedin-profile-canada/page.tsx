import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How to Optimize Your LinkedIn Profile for Canadian Jobs (2026)",
  description:
    "Step-by-step LinkedIn optimization guide for immigrants and newcomers job hunting in Canada: headline, about section, experience, skills, and visibility tips.",
  alternates: { canonical: "https://resumeradar.io/resources/blog/linkedin-profile-canada" },
  openGraph: {
    url: "https://resumeradar.io/resources/blog/linkedin-profile-canada",
    title: "How to Optimize Your LinkedIn Profile for Canadian Jobs (2026)",
    description: "A complete LinkedIn checklist for immigrants in Canada — from headline to recommendations.",
  },
};

const article = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "How to Optimize Your LinkedIn Profile for Canadian Jobs (2026)",
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
    { "@type": "ListItem", position: 3, name: "LinkedIn Profile Canada", item: "https://resumeradar.io/resources/blog/linkedin-profile-canada" },
  ],
};

const CHECKLIST = [
  { section: "Profile photo", tip: "Professional headshot on a plain background. Smiling, forward-facing. Canadian hiring culture: photos are expected on LinkedIn (unlike resumes)." },
  { section: "Headline", tip: "Don't just list your title. Use: [Role] | [Key skill] | [Value proposition]. E.g., 'Software Engineer | Cloud & DevOps | Open to opportunities in Canada'." },
  { section: "Location", tip: "Set to your Canadian city (or 'Greater Toronto Area', 'Greater Vancouver'). Recruiters filter by location — foreign locations filter you out." },
  { section: "Open to Work", tip: "Enable 'Open to Work' (visible to recruiters only option is less stigmatized in Canada than in some other markets). Specify 'Canada' and the roles you want." },
  { section: "About section", tip: "3–5 sentences. What you do, your specialty, your Canadian context (newly arrived, PGWP, etc.), and a call to action. End with your email or 'Open to connect'." },
  { section: "Experience section", tip: "Use the same bullet format as your resume — action verb + task + result. Quantify everything. Include company descriptions for international employers." },
  { section: "Skills section", tip: "Add 15–20 skills prioritizing Canadian ATS-relevant keywords for your industry. Skills with endorsements rank higher in recruiter searches." },
  { section: "Education", tip: "Include all degrees. For non-Canadian institutions, add a note: 'Canadian equivalent: Bachelor's degree (confirmed by WES, 2024)'." },
  { section: "Recommendations", tip: "Aim for 3+ recommendations from direct managers or senior colleagues. Even international recommendations are valuable — they demonstrate credibility." },
  { section: "Languages", tip: "Add all languages you speak. French proficiency is prominently valued by Canadian recruiters — list it even if not bilingual at a professional level." },
];

export default function LinkedInProfilePage() {
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
          <span className="text-[#131f2f]">LinkedIn Profile Canada</span>
        </nav>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Blog</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">How to optimize your LinkedIn profile for Canadian jobs</h1>
        <div className="mt-2 flex items-center gap-2 text-sm text-[#77838F]">
          <span>By ResumeRadar Editorial Team</span>
          <span>·</span>
          <span>Published May 2026 · 6 min read</span>
        </div>
        <p className="mt-4 text-lg text-[#3B4959]">
          LinkedIn is the primary professional network for Canadian hiring. Over 70% of Canadian jobs are filled through it — either through direct applications or recruiter outreach. Here is how to optimize your profile for the Canadian market. For the underlying application materials, see our <Link href="/resources/blog/resume-tips-immigrants-canada" className="text-[#006EDC] underline hover:text-[#0060C7]">resume tips for immigrants</Link> and <Link href="/resources/blog/ats-keywords-canada" className="text-[#006EDC] underline hover:text-[#0060C7]">ATS keywords guide</Link>.
        </p>

        {/* Citable block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-5">
          <p className="text-sm leading-relaxed text-[#3B4959]">
            LinkedIn has 22 million users in Canada — one of the highest adoption rates per capita globally. According to LinkedIn&apos;s 2025 Canadian Workforce Report, 87% of Canadian recruiters use LinkedIn as their primary sourcing tool, and 64% reach out to candidates who match their criteria proactively — meaning you can be found without applying. A complete LinkedIn profile with Canadian location, relevant keywords, and active engagement receives an average of 21× more profile views and 36× more messages than an incomplete one. For immigrants, LinkedIn is particularly valuable because it provides the social proof and context that a resume cannot — international companies become recognizable when accompanied by a description and follower count, and recommendations from managers carry significant weight with Canadian employers who cannot easily verify foreign references.
          </p>
        </div>

        {/* Checklist */}
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Complete LinkedIn optimization checklist</h2>
          <div className="space-y-3">
            {CHECKLIST.map((item) => (
              <div key={item.section} className="rounded-xl border border-[#dcdce3] bg-white p-4">
                <p className="mb-1 text-sm font-semibold text-[#006EDC]">{item.section}</p>
                <p className="text-sm leading-relaxed text-[#3B4959]">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How recruiters use LinkedIn */}
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">How Canadian recruiters actually search LinkedIn</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#3B4959]">
            Understanding how recruiters search helps you optimize for the fields they filter on — not just the ones that look good visually.
          </p>
          <div className="space-y-3">
            {[
              {
                title: "Boolean keyword search",
                desc: "Recruiters search with operators like: (\"Software Engineer\" OR \"Developer\") AND (\"React\" OR \"TypeScript\") AND \"Toronto\". Your headline, job titles, skills, and about section are all indexed. This is why keyword placement matters — not just having skills listed, but having them in the sections LinkedIn indexes for search.",
              },
              {
                title: "\"Open to Work\" filter",
                desc: "Recruiters can filter exclusively for candidates who have enabled Open to Work. If your search is confidential, use the recruiter-only option (the green banner is not shown). If you are actively looking, the public banner signals availability and typically doubles inbound recruiter messages.",
              },
              {
                title: "Location-based filtering",
                desc: "Location is one of the most-used recruiter filters. If your profile says a foreign city, you will be excluded from most Canadian searches. Update your location to your Canadian city (or \"Greater Toronto Area\", \"Greater Vancouver\") immediately — even before you arrive, if you have a confirmed move date.",
              },
              {
                title: "Skills endorsement weighting",
                desc: "LinkedIn's algorithm weights skills with 5+ endorsements higher in recruiter search results. Ask former colleagues, managers, or classmates to endorse your top 3–5 skills. Even 3–4 endorsements on a skill moves it ahead of unendorsed skills in recruiter-facing results.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-[#dcdce3] bg-white p-4">
                <p className="font-semibold text-[#131f2f]">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#77838F]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">LinkedIn import — skip manual data entry</h2>
          <p className="text-sm leading-relaxed text-[#3B4959]">
            ResumeRadar can import your LinkedIn profile directly — paste your LinkedIn URL and we pull your experience, education, and skills automatically. This populates your ResumeRadar profile without re-entering everything manually, so you can start optimizing resumes immediately. For a broader overview of finding work in Canada, see the <Link href="/resources/guides/job-search-immigrants-canada" className="text-[#006EDC] underline hover:text-[#0060C7]">complete job search guide for immigrants</Link>.
          </p>
          <Link href="/login" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#006EDC] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0060C7]">
            Import from LinkedIn →
          </Link>
        </section>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-7 text-white">
          <h2 className="text-xl font-bold">Import your LinkedIn profile and optimize your resume</h2>
          <p className="mt-2 text-sm text-white/80">Paste your LinkedIn URL — ResumeRadar builds your profile and starts tailoring your resume to Canadian jobs.</p>
          <Link href="/login" className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#006EDC] hover:bg-white/90">
            Try it free →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-[#131f2f]">Keep reading</h2>
          <div className="space-y-3">
            {[
              { href: "/resources/guides/job-search-immigrants-canada", label: "Complete Job Search Guide for Immigrants in Canada" },
              { href: "/resources/blog/resume-tips-immigrants-canada", label: "10 Resume Tips for Immigrants in Canada" },
              { href: "/resources/blog/cover-letter-canada-guide", label: "How to Write a Cover Letter for Canadian Jobs" },
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
