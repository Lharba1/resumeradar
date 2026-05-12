import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "ResumeRadar — AI Resume Optimizer & Job Search for Immigrants in Canada",
  description:
    "Upload your resume, get an ATS score, and receive an AI-optimized version tailored to any job description. Built for immigrants and newcomers to Canada. Free to start.",
  alternates: { canonical: "https://resumeradar.io" },
  openGraph: {
    url: "https://resumeradar.io",
    title: "ResumeRadar — AI Resume Optimizer for Immigrants in Canada",
    description:
      "Upload your resume, get an ATS score, and receive an AI-optimized version tailored to any job description. Built for immigrants and newcomers to Canada.",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ResumeRadar",
  url: "https://resumeradar.io",
  logo: "https://resumeradar.io/logo.png",
  description: "AI-powered ATS resume optimizer and job search platform for immigrants and newcomers to Canada.",
  sameAs: [
    "https://www.linkedin.com/company/resumeradar",
    "https://twitter.com/resumeradar",
    "https://www.producthunt.com/products/resumeradar",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ResumeRadar",
  url: "https://resumeradar.io",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://resumeradar.io/jobs?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ResumeRadar",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "AI-powered ATS resume optimizer, CV builder, cover letter generator, interview prep, and job tracker for immigrants in Canada.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
  featureList: ["ATS resume optimization", "Bilingual CV builder (EN/FR)", "Cover letter generator", "Interview prep", "Job tracker", "LinkedIn import"],
};

const FAQS = [
  {
    q: "Is ResumeRadar free to use?",
    a: "Yes. Every account starts with 10 free resume optimizations, ATS scoring, and PDF downloads — no credit card required. Pro and Enterprise plans unlock unlimited optimizations, French CV generation, LinkedIn import, job tracker, and interview prep.",
  },
  {
    q: "Does it work for immigrants with international experience?",
    a: "That's exactly who it's built for. ResumeRadar understands international credentials, translates foreign job titles into Canadian equivalents, handles employment gaps from immigration, and reformats resumes from European, Asian, or Latin American standards into Canadian format — automatically.",
  },
  {
    q: "How does the ATS score work?",
    a: "ResumeRadar parses your resume and the job description, then scores keyword match, formatting compatibility, section completeness, and readability by ATS systems like Workday, Taleo, Greenhouse, and iCIMS. The score appears before and after optimization so you see the exact improvement.",
  },
  {
    q: "Can I generate a French resume for Quebec jobs?",
    a: "Yes. ResumeRadar generates complete bilingual output — English and French — in a single session. The French CV is written in proper Canadian French, not translated. This is critical for Quebec employers, federal bilingual positions, and francophone community organizations.",
  },
  {
    q: "Does it work for regulated professions like nursing or engineering?",
    a: "Yes. ResumeRadar includes credential recognition guidance, formats professional licenses and certifications according to Canadian standards, and highlights regulated profession credentials in the way Canadian employers and regulatory bodies expect to see them.",
  },
  {
    q: "Is my resume data private and secure?",
    a: "Your data is stored in Canada on servers that comply with PIPEDA (Canada's federal privacy law). We do not sell or share your resume data with employers, third-party recruiters, or any external parties. You can delete your account and all data at any time.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const FEATURES = [
  { icon: "🎯", title: "ATS score — before & after", desc: "See exactly how your resume scores against any posting, then watch it jump after optimization." },
  { icon: "🤖", title: "AI rewrites your resume", desc: "Not suggestions. A full rewrite — bullets, keywords, formatting — tailored to that specific job." },
  { icon: "🇨🇦 🇫🇷", title: "English + French output", desc: "Complete French CV for Quebec roles, federal bilingual positions, and francophone communities. Not translation — proper Canadian French." },
  { icon: "🔗", title: "LinkedIn import", desc: "Paste your LinkedIn URL. We pull your experience, education, and skills. No manual re-entry." },
  { icon: "📄", title: "ATS-ready PDF", desc: "Single-column, Canadian format. Tested against Workday, Taleo, Greenhouse, and iCIMS." },
  { icon: "💼", title: "Cover letter + interview prep", desc: "Generate a tailored cover letter and practice behavioural questions for the exact role." },
];

const AUDIENCE = [
  { icon: "✈️", label: "New immigrants", desc: "Just arrived. Navigating the Canadian job market for the first time.", href: "/solutions/immigrants-canada" },
  { icon: "🎓", label: "International students", desc: "PGWP holders transitioning from university to Canadian employment.", href: "/solutions/international-students" },
  { icon: "⚙️", label: "Regulated professionals", desc: "Engineers, nurses, and accountants getting credentials recognized while job searching.", href: "/solutions/engineers-canada" },
  { icon: "🇫🇷", label: "Francophone applicants", desc: "Applying to Quebec employers, federal bilingual positions, or francophone communities.", href: "/solutions/french-speakers" },
];

const TESTIMONIALS = [
  {
    quote: "60 applications, 2 responses. After ResumeRadar I got 4 interviews in the first week. I had no idea my CV was failing before a human even saw it.",
    name: "Priya M.",
    detail: "Software Engineer · Toronto, ON",
    flag: "🇮🇳",
  },
  {
    quote: "The French CV feature got me into a federal bilingual posting I'd ignored for months. I applied Monday. Called Tuesday.",
    name: "Ibrahima D.",
    detail: "Financial Analyst · Ottawa, ON",
    flag: "🇸🇳",
  },
  {
    quote: "My ATS score went from 38% to 91% on the same resume. Same experience, same words — just restructured so the system could actually read it.",
    name: "Ana C.",
    detail: "Project Manager · Vancouver, BC",
    flag: "🇧🇷",
  },
];

const TEMPLATES = [
  { name: "Executive", tag: "Senior roles", accent: "#006EDC", lines: [80, 60, 90, 55, 70, 45] },
  { name: "Modern", tag: "Tech & startup", accent: "#7c3aed", lines: [70, 85, 50, 75, 60, 90] },
  { name: "Classic", tag: "Finance & law", accent: "#0d9488", lines: [90, 65, 80, 55, 70, 50] },
  { name: "Bilingual", tag: "EN / FR", accent: "#dc2626", lines: [75, 55, 80, 65, 85, 45] },
  { name: "Technical", tag: "Engineering & IT", accent: "#ea580c", lines: [60, 90, 75, 85, 50, 70] },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["10 resume optimizations", "ATS score before & after", "PDF download", "Cover letter (3/month)"],
    cta: "Start free",
    href: "/login",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    features: ["Unlimited optimizations", "French CV generation", "LinkedIn import", "Interview prep", "Job tracker", "Priority support"],
    cta: "Start Pro",
    href: "/login",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    features: ["Everything in Pro", "Team accounts", "Bulk optimization", "API access", "Dedicated support"],
    cta: "Contact us",
    href: "/pricing",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <main>
      <JsonLd data={orgSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />

      {/* ── HERO ── */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[#006EDC]/7 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-24 sm:pt-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b3d4f5] bg-[#e6f2fe] px-4 py-1.5 text-sm font-medium text-[#006EDC]">
            <span aria-hidden="true">🇨🇦</span>
            <span>Built for immigrants in Canada · Free to start</span>
          </div>

          <h1 id="hero-heading" className="text-5xl font-black tracking-tight text-[#131f2f] sm:text-6xl">
            Your resume gets{" "}
            <span className="text-red-500">rejected</span>
            <br className="hidden sm:block" />
            {" "}before anyone reads it.
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg text-[#3B4959]">
            95% of Canadian employers use ATS software to filter applications automatically. ResumeRadar rewrites your resume to pass — and shows your score before and after.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="rounded-xl bg-[#006EDC] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#006EDC]/25 transition hover:bg-[#0060C7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006EDC]"
            >
              Fix my resume — free →
            </Link>
            <Link
              href="/features/ats-optimizer"
              className="rounded-xl border border-[#dcdce3] px-8 py-3.5 text-base font-semibold text-[#3B4959] transition hover:border-[#CCD0D5] hover:text-[#131f2f]"
            >
              See how it works
            </Link>
          </div>

          <p className="mt-3 text-sm text-[#77838F]">
            10 free optimizations · No credit card · Under 2 minutes
          </p>

          <div className="mt-7 flex items-center justify-center gap-3">
            <div className="flex -space-x-2" aria-hidden="true">
              {["🇮🇳", "🇧🇷", "🇸🇳", "🇵🇭", "🇳🇬"].map((flag, i) => (
                <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#E6F2FD] text-sm shadow-sm">
                  {flag}
                </div>
              ))}
            </div>
            <p className="text-sm text-[#3B4959]">
              <span className="font-semibold text-[#131f2f]">4.8 / 5</span>
              {" "}from 12,400+ immigrants
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section aria-label="Key statistics" className="border-y border-[#dcdce3] bg-white">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-2 gap-y-4 sm:grid-cols-4">
            {[
              { value: "12,400+", label: "Resumes optimized" },
              { value: "87%", label: "Average ATS improvement" },
              { value: "EN + FR", label: "Bilingual output" },
              { value: "$0", label: "To get started" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <dd className="text-2xl font-bold text-[#006EDC]">{s.value}</dd>
                <dt className="mt-0.5 text-xs text-[#77838F]">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section aria-labelledby="problem-heading" className="bg-[#F5F9FC] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">The problem</div>
          <h2 id="problem-heading" className="text-3xl font-bold tracking-tight text-[#131f2f] sm:text-4xl">
            Qualified. Experienced. Getting ignored.
          </h2>
          <p className="mt-3 max-w-xl text-[#3B4959]">
            It&apos;s not your experience. It&apos;s not your English. It&apos;s software — and it&apos;s filtering you out before any human makes a decision.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#dcdce3] bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-[#131f2f]">What ATS does to your application</h3>
              <p className="text-sm leading-relaxed text-[#3B4959]">
                An ATS (Applicant Tracking System) reads every resume before a recruiter does. It extracts keywords, scores your match against the job description, and auto-rejects anything below 60–70%. No email. No feedback. No human review.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#3B4959]">
                More than 95% of Canadian companies with 50+ employees use ATS — every bank, federal department, hospital, and major tech company. A resume built for a European or US market, or designed in Canva, often scores below 30%. Not because you&apos;re not qualified. Because the machine can&apos;t read it.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#3B4959]">
                ResumeRadar reads the job posting, identifies every missing keyword, and rewrites your resume around them — in English or French.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-red-500">Before ResumeRadar</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black leading-none text-red-500">34%</span>
                  <span className="mb-1 text-sm text-red-400">ATS score</span>
                </div>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-red-100">
                  <div className="h-full rounded-full bg-red-400" style={{ width: "34%" }} />
                </div>
                <p className="mt-3 text-xs font-medium text-red-500">✗ Auto-rejected. No callback. No explanation.</p>
                <ul className="mt-2 space-y-1 text-xs text-red-400">
                  {["Missing: 'Agile'", "Missing: 'cross-functional'", "Missing: 'stakeholder management'"].map((kw) => (
                    <li key={kw}>{kw}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-emerald-600">After ResumeRadar</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black leading-none text-emerald-600">91%</span>
                  <span className="mb-1 text-sm text-emerald-500">ATS score</span>
                </div>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-emerald-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: "91%" }} />
                </div>
                <p className="mt-3 text-xs font-medium text-emerald-600">✓ Passes ATS. Recruiter sees your resume.</p>
                <ul className="mt-2 space-y-1 text-xs text-emerald-600">
                  {["✓ Added: 'Agile methodology'", "✓ Added: 'cross-functional teams'", "✓ Added: 'stakeholder reporting'"].map((kw) => (
                    <li key={kw}>{kw}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section aria-labelledby="how-heading" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">How it works</div>
          <h2 id="how-heading" className="text-3xl font-bold tracking-tight text-[#131f2f] sm:text-4xl">Ready in under 2 minutes</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { step: "01", title: "Upload or import your resume", desc: "Upload a PDF, choose from your library, or paste your LinkedIn URL. We pull everything automatically." },
              { step: "02", title: "Paste the job description", desc: "Copy the full posting from Indeed, LinkedIn, Guichet-Emplois, or any Canadian job board." },
              { step: "03", title: "Download your optimized resume", desc: "Score before and after. Keywords added in context. Professional PDF in English or French — ready to send." },
            ].map((s) => (
              <article key={s.step} className="rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-6 shadow-sm">
                <p className="text-4xl font-black text-[#006EDC]/15" aria-hidden="true">{s.step}</p>
                <h3 className="mt-3 font-semibold text-[#131f2f]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#77838F]">{s.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#006EDC] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#006EDC]/20 transition hover:bg-[#0060C7]"
            >
              Try it free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section aria-labelledby="features-heading" className="bg-[#F5F9FC] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Everything included</div>
          <h2 id="features-heading" className="text-3xl font-bold tracking-tight text-[#131f2f] sm:text-4xl">One platform. Your whole job search.</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-[#dcdce3] bg-white p-5 shadow-sm">
                <div className="mb-3 text-2xl" aria-hidden="true">{f.icon}</div>
                <h3 className="font-semibold text-[#131f2f]">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#77838F]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATE GALLERY ── */}
      <section aria-labelledby="templates-heading" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Resume templates</div>
          <div className="flex items-end justify-between">
            <h2 id="templates-heading" className="text-3xl font-bold tracking-tight text-[#131f2f] sm:text-4xl">
              Canadian-format templates,<br className="hidden sm:block" /> ATS-tested and ready.
            </h2>
            <Link href="/build-resume" className="hidden shrink-0 text-sm font-semibold text-[#006EDC] hover:underline sm:block">
              Browse all →
            </Link>
          </div>
          <p className="mt-3 max-w-xl text-[#3B4959]">
            Every template follows Canadian resume standards: 1–2 pages, reverse-chronological, no photo, no date of birth — and passes ATS systems out of the box.
          </p>
        </div>

        <div className="mt-8 flex gap-4 overflow-x-auto px-4 pb-4 sm:px-6" style={{ scrollbarWidth: "none" }}>
          {TEMPLATES.map((t) => (
            <Link
              key={t.name}
              href="/build-resume"
              className="group flex-none w-44 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-4 transition hover:border-[#006EDC] hover:shadow-md"
              aria-label={`${t.name} resume template — ${t.tag}`}
            >
              {/* Resume thumbnail mockup */}
              <div className="relative h-56 w-full overflow-hidden rounded-xl bg-white shadow-sm">
                {/* Color accent bar */}
                <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl" style={{ backgroundColor: t.accent }} />
                {/* Name block */}
                <div className="ml-4 mt-4">
                  <div className="h-2.5 w-20 rounded-full" style={{ backgroundColor: t.accent, opacity: 0.9 }} />
                  <div className="mt-1.5 h-1.5 w-14 rounded-full bg-[#dcdce3]" />
                  <div className="mt-1 h-1.5 w-16 rounded-full bg-[#dcdce3]" />
                </div>
                {/* Divider */}
                <div className="mx-4 mt-3 h-px bg-[#dcdce3]" />
                {/* Content lines */}
                <div className="ml-4 mt-3 space-y-1.5">
                  {t.lines.map((w, i) => (
                    <div key={i} className="h-1.5 rounded-full bg-[#dcdce3]" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#131f2f] group-hover:text-[#006EDC]">{t.name}</p>
              <p className="mt-0.5 text-xs text-[#77838F]">{t.tag}</p>
            </Link>
          ))}
          {/* See all card */}
          <Link
            href="/build-resume"
            className="flex flex-none w-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#dcdce3] p-4 text-center transition hover:border-[#006EDC]"
          >
            <span className="text-2xl text-[#006EDC]">+</span>
            <p className="mt-2 text-sm font-semibold text-[#3B4959]">More templates</p>
            <p className="mt-0.5 text-xs text-[#77838F]">Browse all →</p>
          </Link>
        </div>
      </section>

      {/* ── FOR IMMIGRANTS (dark) ── */}
      <section aria-labelledby="immigrant-heading" className="bg-[#0a1628] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#4da3e8]">Why it matters</div>
          <h2 id="immigrant-heading" className="text-3xl font-bold text-white sm:text-4xl">
            The Canadian job market doesn&apos;t reward your past.<br className="hidden sm:block" />
            {" "}It rewards how your resume is written.
          </h2>
          <p className="mt-4 max-w-2xl text-[#94a3b8]">
            Canadian hiring is uniquely paperwork-first. Before a single conversation happens, your resume must pass software that was built to reject anything that doesn&apos;t look exactly right.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "📋",
                title: "Your credentials don't translate automatically",
                desc: "A degree from Mumbai, Lagos, or São Paulo means nothing to an ATS. ResumeRadar maps your credentials to Canadian equivalents.",
              },
              {
                icon: "📅",
                title: "Employment gaps get you filtered out",
                desc: "Immigration timelines create gaps. We reframe them — visa processing, settlement, professional exams — in language that ATS and recruiters accept.",
              },
              {
                icon: "🔤",
                title: "Your resume format is likely wrong",
                desc: "European, Asian, and Latin American resume formats differ significantly from Canadian standards. We rebuild yours from scratch, correctly.",
              },
              {
                icon: "🇫🇷",
                title: "Quebec requires French. Federal requires both.",
                desc: "A single English resume closes half the Canadian job market. ResumeRadar generates your French CV automatically — proper Quebec French, not Google Translate.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 text-2xl" aria-hidden="true">{item.icon}</div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
            <Link
              href="/login"
              className="rounded-xl bg-[#006EDC] px-7 py-3 font-semibold text-white transition hover:bg-[#0060C7]"
            >
              Start free — no credit card →
            </Link>
            <Link
              href="/solutions/immigrants-canada"
              className="rounded-xl border border-white/20 px-7 py-3 font-semibold text-white transition hover:border-white/40"
            >
              Read the immigrant job search guide
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section aria-labelledby="audience-heading" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Who it&apos;s for</div>
          <h2 id="audience-heading" className="text-3xl font-bold tracking-tight text-[#131f2f] sm:text-4xl">Built for every stage of your Canadian journey</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {AUDIENCE.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="group flex items-start gap-4 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-5 shadow-sm transition hover:border-[#006EDC] hover:shadow-md"
              >
                <span className="mt-0.5 text-2xl" aria-hidden="true">{a.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-[#131f2f] transition group-hover:text-[#006EDC]">{a.label}</p>
                  <p className="mt-1 text-sm text-[#77838F]">{a.desc}</p>
                </div>
                <span className="mt-0.5 shrink-0 text-[#006EDC] opacity-0 transition group-hover:opacity-100" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section aria-labelledby="testimonials-heading" className="bg-[#F5F9FC] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Real results</div>
          <h2 id="testimonials-heading" className="text-3xl font-bold tracking-tight text-[#131f2f] sm:text-4xl">They got the callback. You can too.</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <article key={t.name} className="flex flex-col rounded-2xl border border-[#dcdce3] bg-white p-5 shadow-sm">
                <div className="text-sm text-amber-400" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-[#3B4959]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <footer className="mt-4 flex items-center gap-3 border-t border-[#dcdce3] pt-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6F2FD] text-lg" aria-hidden="true">
                    {t.flag}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#131f2f]">{t.name}</p>
                    <p className="text-xs text-[#77838F]">{t.detail}</p>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section aria-labelledby="pricing-heading" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Pricing</div>
          <h2 id="pricing-heading" className="text-3xl font-bold tracking-tight text-[#131f2f] sm:text-4xl">Start free. Upgrade when you&apos;re ready.</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-5 shadow-sm ${p.highlight ? "border-2 border-[#006EDC] bg-[#F5F9FC]" : "border border-[#dcdce3] bg-white"}`}
              >
                {p.highlight && (
                  <div className="mb-3 inline-flex rounded-full bg-[#006EDC] px-3 py-0.5 text-[11px] font-bold text-white">
                    Most popular
                  </div>
                )}
                <h3 className="font-bold text-[#131f2f]">{p.name}</h3>
                <div className="mt-1 flex items-end gap-1">
                  <span className="text-3xl font-black text-[#131f2f]">{p.price}</span>
                  <span className="mb-0.5 text-sm text-[#77838F]">{p.period}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#3B4959]">
                      <span className="shrink-0 font-bold text-emerald-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`mt-5 flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition ${
                    p.highlight
                      ? "bg-[#006EDC] text-white hover:bg-[#0060C7]"
                      : "border border-[#dcdce3] text-[#3B4959] hover:border-[#CCD0D5]"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-[#77838F]">
            No credit card for the free plan · Cancel anytime · Data stored in Canada (PIPEDA compliant)
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section aria-labelledby="faq-heading" className="bg-[#F5F9FC] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">FAQ</div>
          <h2 id="faq-heading" className="text-3xl font-bold tracking-tight text-[#131f2f] sm:text-4xl">Common questions</h2>

          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-[#dcdce3] bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-[#131f2f] marker:hidden [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="shrink-0 text-[#006EDC] transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <div className="border-t border-[#dcdce3] px-5 pb-4 pt-3 text-sm leading-relaxed text-[#3B4959]">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section aria-label="Trust signals" className="border-y border-[#dcdce3] bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#77838F]">
            {[
              "🔒 PIPEDA compliant",
              "🇨🇦 Data stored in Canada",
              "✓ Tested: Workday · Taleo · Greenhouse · iCIMS",
              "🇫🇷 Full French language support",
              "⚡ Under 2 minutes",
            ].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section aria-labelledby="cta-heading" className="bg-[#006EDC] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 id="cta-heading" className="text-3xl font-black text-white sm:text-4xl">
            Stop getting filtered out.
            <br />
            Start getting interviews.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/80">
            Your qualifications are real. Your experience is real. Now let your resume reflect that — for Canadian employers, through their systems, in their language.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-white px-9 py-3.5 font-semibold text-[#006EDC] transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Fix my resume — free →
          </Link>
          <p className="mt-3 text-sm text-white/60">10 free optimizations · No credit card · Cancel anytime</p>
        </div>
      </section>
    </main>
  );
}
