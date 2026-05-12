import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product Status & Roadmap — Internal",
  robots: { index: false, follow: false },
};

// ── Status badges ──────────────────────────────────────────────────────────
const BADGE = {
  live:     { label: "Live",        bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  beta:     { label: "Beta",        bg: "bg-blue-50 text-blue-700 border-blue-200" },
  soon:     { label: "Coming soon", bg: "bg-amber-50 text-amber-700 border-amber-200" },
  planned:  { label: "Planned",     bg: "bg-[#F5F9FC] text-[#77838F] border-[#dcdce3]" },
  no:       { label: "Out of scope",bg: "bg-red-50 text-red-500 border-red-100" },
} as const;
type StatusKey = keyof typeof BADGE;

function Badge({ s }: { s: StatusKey }) {
  const { label, bg } = BADGE[s];
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${bg}`}>
      {label}
    </span>
  );
}

function Row({ label, href, status, note }: { label: string; href?: string; status: StatusKey; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#dcdce3] py-3 last:border-0">
      <div>
        {href ? (
          <Link href={href} className="text-sm font-medium text-[#006EDC] hover:underline">{label}</Link>
        ) : (
          <span className="text-sm font-medium text-[#131f2f]">{label}</span>
        )}
        {note && <p className="mt-0.5 text-xs text-[#77838F]">{note}</p>}
      </div>
      <Badge s={status} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#dcdce3] bg-white">
      <div className="border-b border-[#dcdce3] px-5 py-3">
        <h2 className="font-bold text-[#131f2f]">{title}</h2>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────

const CORE_FEATURES = [
  { label: "ATS Resume Optimizer — paste a job, rewrite CV, before/after score", href: "/features/ats-optimizer", status: "live" as StatusKey, note: "Multi-provider AI (OpenAI, Anthropic, Google)" },
  { label: "ATS Score (before & after)", href: "/features/ats-optimizer", status: "live" as StatusKey },
  { label: "PDF Download — ATS-ready Canadian format", status: "live" as StatusKey },
  { label: "CV / Resume Builder", href: "/build-resume", status: "live" as StatusKey, note: "Build from scratch or from LinkedIn import" },
  { label: "CV Library — all optimizations saved automatically", href: "/library", status: "live" as StatusKey, note: "Free: 10 CVs (90d), Starter: 25 (180d), Pro: 50 (365d), Enterprise: 200 (365d)" },
  { label: "Cover Letter Generator", href: "/cover-letter", status: "live" as StatusKey, note: "Job-specific, EN + FR output" },
  { label: "Interview Prep — AI behavioural questions", href: "/interview", status: "live" as StatusKey, note: "STAR method, role-specific, Canadian context" },
  { label: "Job Feed with visa scoring", href: "/jobs", status: "live" as StatusKey, note: "Indeed + Adzuna scraping, AI scoring, visa likelihood" },
  { label: "Job Tracker (Kanban-style)", href: "/tracker", status: "live" as StatusKey, note: "saved → applied → screening → interview → offer → rejected" },
  { label: "LinkedIn Import", status: "live" as StatusKey, note: "Paste LinkedIn URL — Apify scraper builds profile automatically" },
  { label: "Bilingual output — English + French (Canadian)", status: "live" as StatusKey, note: "Full FR-CA resumes, not translation" },
  { label: "Multi-provider AI router", status: "live" as StatusKey, note: "OpenAI / Anthropic / Google — configurable per feature in admin" },
  { label: "Dashboard — usage stats + programmatic insight (zero AI cost)", href: "/dashboard", status: "live" as StatusKey, note: "Rule-engine replaced chatJSON call" },
  { label: "Job application auto-fill", status: "no" as StatusKey, note: "Would require a browser extension" },
  { label: "AI resume chat (ask questions about your CV)", status: "planned" as StatusKey },
  { label: "Resume version comparison (A/B)", status: "planned" as StatusKey },
  { label: "Real-time salary insights per job", status: "soon" as StatusKey },
  { label: "Email notifications (job matches, score alerts)", status: "planned" as StatusKey },
];

const AUTH_BILLING = [
  { label: "Supabase Auth (email + password)", status: "live" as StatusKey },
  { label: "Google OAuth", status: "soon" as StatusKey, note: "Google Cloud Console setup required" },
  { label: "Stripe billing — Free / Starter / Pro / Enterprise plans", status: "live" as StatusKey, note: "Checkout, portal, webhook, subscription sync. Starter=$9/mo (migration 011)" },
  { label: "3-day free trial on Pro plan", status: "live" as StatusKey, note: "payment_method_collection: always; trial abuse guard (stripe_subscription_id check); trial_end stored from webhook; migration 010" },
  { label: "Usage-based rate limiting per plan", status: "live" as StatusKey },
  { label: "Account deletion with Stripe cancellation", status: "live" as StatusKey },
  { label: "User suspension by admin", status: "live" as StatusKey },
  { label: "2FA / MFA", status: "planned" as StatusKey },
];

const ADMIN = [
  { label: "Admin dashboard", href: "/admin", status: "live" as StatusKey },
  { label: "User management — search, view, suspend", href: "/admin/users", status: "live" as StatusKey },
  { label: "Subscription management — plan + status per user", href: "/admin/billing", status: "live" as StatusKey },
  { label: "AI provider config — per-feature model routing", href: "/admin/ai-config", status: "live" as StatusKey },
  { label: "AI prompt customization — custom prompt per feature + restore default", href: "/admin/ai-config", status: "live" as StatusKey, note: "custom_prompt column in ai_feature_config; migration 008 applied" },
  { label: "Plan management — create, edit, delete plans + add/remove routes", href: "/admin/plans", status: "live" as StatusKey, note: "Full CRUD: POST/PUT/DELETE on /api/admin/plans; subscriber guard on delete" },
  { label: "AI Spend dashboard — monthly cost by user + feature, flagged users", href: "/admin/ai-spend", status: "live" as StatusKey, note: "user_ai_spend table; increment_ai_spend RPC; model_pricing table; migration 009 applied" },
  { label: "Revenue / MRR tracking", status: "planned" as StatusKey },
];

const SECURITY = [
  { label: "Auth guard on all API routes (requireUser)", status: "live" as StatusKey },
  { label: "Dashboard crash fix — res.ok checked before setData", status: "live" as StatusKey },
  { label: "Login auth error display — /login?error= param read and shown", status: "live" as StatusKey },
  { label: "Pricing → checkout intent preserved — pro/enterprise link to /login?next=/settings", status: "live" as StatusKey },
  { label: "Admin guard (requireAdmin) on /admin routes", status: "live" as StatusKey },
  { label: "Rate limiter fails closed on DB error", status: "live" as StatusKey },
  { label: "Stripe open redirect fixed (env var only)", status: "live" as StatusKey },
  { label: "SSRF protection on job URL fetch (HTTPS + IP block)", status: "live" as StatusKey },
  { label: "Apify key in Authorization header (not URL)", status: "live" as StatusKey },
  { label: "Tracker PATCH field allowlist", status: "live" as StatusKey },
  { label: "Security headers (CSP, X-Frame-Options, etc.)", status: "live" as StatusKey },
  { label: "Supabase error messages not leaked to clients", status: "live" as StatusKey },
  { label: "Language param runtime-validated before prompt injection", status: "live" as StatusKey },
  { label: "jobIds capped at 20 + UUID format check", status: "live" as StatusKey },
  { label: "Anthropic retry sends broken output, not user input", status: "live" as StatusKey },
  { label: "DOMPurify on innerHTML CV rendering", status: "live" as StatusKey, note: "All 5 innerHTML sites sanitized: build-resume, optimize, cover-letter, jobs, library" },
  { label: "Prompt injection prevention — wrapUserContent() + PROMPT_INJECTION_GUARD on all 6 AI routes", status: "live" as StatusKey, note: "XML tag delimiters isolate user data; central helper in src/lib/promptUtils.ts; covers toEnglishTitle too" },
  { label: "Env var validation at startup (src/lib/env.ts)", status: "live" as StatusKey, note: "prod throws on missing vars; dev/preview warns only to avoid preview build crashes" },
  { label: "Open redirect blocked in auth callback", status: "live" as StatusKey, note: "next param validated: must start with / and not //" },
  { label: "getUserContext fails closed on DB error", status: "live" as StatusKey, note: "Suspended users blocked even on DB timeout (was fail-open before)" },
  { label: "api_usage → usage_quotas table name fix", status: "live" as StatusKey, note: "Admin dashboard, account usage, admin/users — all 4 code paths corrected" },
  { label: "Email verification gate on all AI routes", status: "live" as StatusKey, note: "requireUser() returns 403 if email_confirmed_at is null" },
  { label: "Scan mode restricted to Pro+ (explicit allowlist)", status: "live" as StatusKey, note: "Gate uses ['pro','enterprise'].includes() — Starter can't access scan mode" },
  { label: "Rate limit fixes — dashboard/feedback/jobs/fetch", status: "live" as StatusKey, note: "Free dashboard 100→5, free feedback 30→10, free jobs/fetch 5→3; migration 009" },
  { label: "cv_optimize + cv_parse + interview_feedback restored to gpt-4o", status: "live" as StatusKey, note: "Were incorrectly on gpt-4o-mini; fixed via migration 009 per premortem" },
  { label: "Pricing page — trial CTA, payment badge strip, FAQ (5 items)", status: "live" as StatusKey, note: "Visa/MC/Amex/Stripe badge; Apple/Google Pay noted as conditional; TRIAL_DAYS=3 constant; 4-col grid at lg breakpoint" },
  { label: "Starter plan library cap + expiry", status: "live" as StatusKey, note: "cv/optimize: starter=25 CVs (was defaulting to free=10); 180-day retention (not 365)" },
  { label: "Starter → Pro upgrade button in settings", status: "live" as StatusKey, note: "Starter users see Upgrade to Pro + Manage subscription buttons; previously only saw manage" },
  { label: "AI spend flagging covers Starter ($6/mo threshold)", status: "live" as StatusKey, note: "admin/ai-spend: FLAG_THRESHOLD map — free=$3, starter=$6; was free-only" },
  { label: "Trial indicator in settings — banner + Pro Trial badge", status: "live" as StatusKey, note: "Shows trial_end date; upgrade buttons hidden during trial" },
  { label: "Webhook trial bugs fixed", status: "live" as StatusKey, note: "checkout.session.completed retrieves subscription object for real status; subscription.updated treats trialing as active for plan_id" },
  { label: "cv_generate + job_classify + job_score → gpt-4o-mini", status: "live" as StatusKey, note: "63% cost reduction on heavy users; quality-safe per premortem analysis" },
  { label: "Rate limiting on billing/checkout, portal, linkedin/import", status: "live" as StatusKey, note: "5/day checkout, 10/day portal, 5/day LinkedIn" },
  { label: "Tracker DELETE handler", status: "live" as StatusKey, note: "Users can now remove tracker entries" },
  { label: "plan_id validated in admin PATCH", status: "live" as StatusKey },
  { label: "primary_model length capped in ai-config PATCH", status: "live" as StatusKey },
  { label: "applied_at validated as ISO date in tracker PATCH", status: "live" as StatusKey },
  { label: "Webhook idempotency — processed_at column prevents double-processing on retry", status: "live" as StatusKey, note: "Insert-first pattern keeps idempotency; processed_at set only after handler succeeds; migration 012" },
  { label: "Stripe webhook trial_will_end — unused userId + PII log removed", status: "live" as StatusKey },
  { label: "LinkedIn import atomic rate-limit (checkAndIncrement — no TOCTOU)", status: "live" as StatusKey },
  { label: "Account delete — Stripe failure logs to admin_actions instead of blocking user", status: "live" as StatusKey, note: "Stripe outage no longer orphans users; admin_actions row queued for manual follow-up" },
  { label: "Middleware /api/ auth safety net — 401 on missing session for all routes except webhook", status: "live" as StatusKey, note: "API_PUBLIC = ['/api/billing/webhook'] exact-path bypass list" },
  { label: "JsonLd script injection — safeJsonSerialize() replaces JSON.stringify (JSON.stringify replacer, not regex)", status: "live" as StatusKey },
  { label: "Library cap trigger — Postgres BEFORE INSERT trigger (SECURITY DEFINER + SET search_path) atomically enforces plan caps", status: "live" as StatusKey, note: "migration 013; grandfathers existing rows; free=10, starter=25, pro=50, enterprise=200" },
  { label: "AI router 10s TTL cache + invalidateFeatureConfig called from admin PATCH", status: "live" as StatusKey, note: "Module-level Map; cache-aside on miss; immediate invalidation on config change" },
  { label: "Job classify concurrency limiter — batches of max 10 concurrent AI calls", status: "live" as StatusKey, note: "for-loop over allRaw in CLASSIFY_BATCH=10 slices; replaces unbounded Promise.allSettled" },
  { label: "CSP Report-Only header — stricter policy monitored 7 days before enforcement", status: "live" as StatusKey, note: "Report-Only lacks unsafe-inline; current enforced CSP unchanged; promote after 7 days" },
  { label: "SSRF fix — IPv4-mapped IPv6 (::ffff:) added to BLOCKED_HOSTS in jobUrl.ts", status: "live" as StatusKey },
  { label: "Admin user search — full-set fetch (up to 1000) when q present, then filter+paginate", status: "live" as StatusKey, note: "Was page-scoped: searched only within current page; users on page 2+ were invisible" },
  { label: "dangerouslySetInnerHTML removed from Canadian resume guide — decoded entity + plain text node", status: "live" as StatusKey },
  { label: "callAI.ts success log guarded by NODE_ENV !== production — no AI call logs in prod", status: "live" as StatusKey },
  { label: "Generic 500 responses — error.message removed from tracker, library, dashboard, cv/parse, jobs/fetch", status: "live" as StatusKey },
  { label: "increment_usage RPC — SET search_path = public guards against schema injection", status: "live" as StatusKey, note: "migration 014" },
  { label: "Penetration test", status: "planned" as StatusKey },
];

const SEO_PAGES: { section: string; pages: { label: string; href: string; status: StatusKey }[] }[] = [
  {
    section: "Core",
    pages: [
      { label: "Homepage (/)", href: "/", status: "live" },
      { label: "Pricing (/pricing)", href: "/pricing", status: "live" },
      { label: "About (/about)", href: "/about", status: "live" },
      { label: "Privacy & Terms", href: "/privacy", status: "live" },
    ],
  },
  {
    section: "Features",
    pages: [
      { label: "ATS Optimizer feature page", href: "/features/ats-optimizer", status: "live" },
      { label: "Resume Builder feature page", href: "/features/resume-builder", status: "soon" },
      { label: "Cover Letter feature page", href: "/features/cover-letter", status: "soon" },
      { label: "Interview Prep feature page", href: "/features/interview-prep", status: "soon" },
      { label: "Job Tracker feature page", href: "/features/job-tracker", status: "soon" },
    ],
  },
  {
    section: "Solutions",
    pages: [
      { label: "Immigrants in Canada", href: "/solutions/immigrants-canada", status: "live" },
      { label: "International Students", href: "/solutions/international-students", status: "live" },
      { label: "Engineers in Canada", href: "/solutions/engineers-canada", status: "live" },
      { label: "French Speakers", href: "/solutions/french-speakers", status: "live" },
      { label: "Healthcare Workers", href: "/solutions/healthcare-workers-canada", status: "planned" },
      { label: "Newcomers (refugees, PRs)", href: "/solutions/newcomers-canada", status: "planned" },
    ],
  },
  {
    section: "Comparisons",
    pages: [
      { label: "Jobscan Alternative", href: "/compare/jobscan-alternative", status: "live" },
      { label: "ResumeRadar vs Jobscan", href: "/compare/jobradar-vs-jobscan", status: "live" },
      { label: "ResumeRadar vs Resume.io", href: "/compare/jobradar-vs-resumeio", status: "live" },
      { label: "ResumeRadar vs Rezi", href: "/compare/jobradar-vs-rezi", status: "live" },
      { label: "Best ATS Tools Canada", href: "/compare/best-ats-resume-tools-canada", status: "live" },
      { label: "ResumeRadar vs Zety", href: "/compare/jobradar-vs-zety", status: "planned" },
      { label: "ResumeRadar vs Kickresume", href: "/compare/jobradar-vs-kickresume", status: "planned" },
    ],
  },
  {
    section: "Guides",
    pages: [
      { label: "Canadian Resume Guide 2026", href: "/resources/guides/canadian-resume-guide", status: "live" },
      { label: "ATS Optimization Guide", href: "/resources/guides/ats-optimization-guide", status: "live" },
      { label: "Job Search Guide — Immigrants", href: "/resources/guides/job-search-immigrants-canada", status: "live" },
      { label: "Work Permit Job Search Guide", href: "/resources/guides/work-permit-job-search", status: "planned" },
    ],
  },
  {
    section: "Blog",
    pages: [
      { label: "Blog index", href: "/resources/blog", status: "live" },
      { label: "10 Resume Tips for Immigrants", href: "/resources/blog/resume-tips-immigrants-canada", status: "live" },
      { label: "ATS Keywords by Industry", href: "/resources/blog/ats-keywords-canada", status: "live" },
      { label: "Canadian vs US Resume", href: "/resources/blog/canadian-resume-vs-us-resume", status: "live" },
      { label: "Cover Letter Guide Canada", href: "/resources/blog/cover-letter-canada-guide", status: "live" },
      { label: "Interview Prep — Immigrants", href: "/resources/blog/interview-prep-canada-immigrants", status: "live" },
      { label: "LinkedIn Profile Canada", href: "/resources/blog/linkedin-profile-canada", status: "live" },
      { label: "Salary Negotiation Canada", href: "/resources/blog/salary-negotiation-canada", status: "live" },
      { label: "Work Permit Types Canada", href: "/resources/blog/work-permit-types-canada", status: "planned" },
      { label: "PGWP Guide 2026", href: "/resources/blog/pgwp-guide-canada", status: "planned" },
      { label: "Regulated Professions Canada", href: "/resources/blog/regulated-professions-canada", status: "planned" },
    ],
  },
  {
    section: "French (FR-CA)",
    pages: [
      { label: "French Hub (/fr)", href: "/fr", status: "live" },
      { label: "Optimiseur CV ATS", href: "/fr/optimiseur-cv-ats", status: "live" },
      { label: "Guide CV canadien (blog)", href: "/fr/ressources/blogue/guide-cv-canadien", status: "live" },
      { label: "Guide recherche d'emploi", href: "/fr/ressources/guides/recherche-emploi-canada", status: "live" },
      { label: "Lettre de motivation Canada", href: "/fr/ressources/blogue/lettre-motivation-canada", status: "planned" },
      { label: "Guide entretien Canada (FR)", href: "/fr/ressources/blogue/entretien-canada", status: "planned" },
    ],
  },
  {
    section: "Templates & Resources",
    pages: [
      { label: "Resume Templates", href: "/resources/templates", status: "live" },
      { label: "Resume Templates (more styles)", href: "/resources/templates", status: "planned" },
    ],
  },
];

const TECH_FOUNDATION = [
  { label: "Next.js 16 App Router (SSR + SSG)", status: "live" as StatusKey },
  { label: "TypeScript throughout", status: "live" as StatusKey },
  { label: "Tailwind CSS v4", status: "live" as StatusKey },
  { label: "Supabase (Postgres + Auth + Storage)", status: "live" as StatusKey },
  { label: "Supabase RLS on all tables", status: "live" as StatusKey },
  { label: "PublicNav — sticky top nav for all marketing/SEO pages", status: "live" as StatusKey, note: "Logo, Features, Pricing, Resources, Compare, Sign in, CTA — FR link removed (locale detection planned)" },
  { label: "AppShell 3-way routing — app sidebar / no nav / public nav", status: "live" as StatusKey, note: "Public visitors never see the authenticated app sidebar" },
  { label: "robots.txt — AI crawlers allowed, auth routes blocked", status: "live" as StatusKey },
  { label: "llms.txt — LLM/GEO guidance file", status: "live" as StatusKey },
  { label: "XML Sitemap (45+ URLs, auto-generated)", status: "live" as StatusKey },
  { label: "JSON-LD schema on all content pages", status: "live" as StatusKey },
  { label: "hreflang EN-CA ↔ FR-CA on bilingual pages", status: "live" as StatusKey },
  { label: "og:image (1200×630)", status: "soon" as StatusKey, note: "Referenced in metadata but file not yet created" },
  { label: "Google Search Console submission", status: "soon" as StatusKey },
  { label: "Bing Webmaster Tools submission", status: "planned" as StatusKey },
  { label: "Core Web Vitals measurement", status: "planned" as StatusKey },
  { label: "Error monitoring (Sentry)", status: "planned" as StatusKey },
  { label: "Analytics (Plausible or PostHog)", status: "planned" as StatusKey },
  { label: "CI/CD pipeline", status: "planned" as StatusKey },
];

const LIVE_COUNT =
  CORE_FEATURES.filter(f => f.status === "live").length +
  AUTH_BILLING.filter(f => f.status === "live").length +
  ADMIN.filter(f => f.status === "live").length +
  SECURITY.filter(f => f.status === "live").length +
  TECH_FOUNDATION.filter(f => f.status === "live").length;

const SEO_LIVE_COUNT = SEO_PAGES.flatMap(s => s.pages).filter(p => p.status === "live").length;

export default function ProductPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">

      {/* Header */}
      <div className="mb-10">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Internal</div>
        <h1 className="text-4xl font-black tracking-tight text-[#131f2f]">Product status & roadmap</h1>
        <p className="mt-3 text-lg text-[#3B4959]">
          Everything built, in progress, and planned. Updated as we ship.
        </p>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: LIVE_COUNT, label: "Live features & infra" },
            { value: SEO_LIVE_COUNT, label: "Live content pages" },
            { value: "3", label: "AI providers wired" },
            { value: "EN + FR", label: "Languages supported" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-[#dcdce3] bg-white p-4 text-center shadow-sm">
              <p className="text-2xl font-black text-[#006EDC]">{s.value}</p>
              <p className="mt-0.5 text-xs text-[#77838F]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(BADGE) as StatusKey[]).map(k => (
            <Badge key={k} s={k} />
          ))}
        </div>
      </div>

      <div className="space-y-6">

        {/* Core product features */}
        <Section title="Core product features">
          {CORE_FEATURES.map(f => <Row key={f.label} {...f} />)}
        </Section>

        {/* Auth & billing */}
        <Section title="Auth & billing">
          {AUTH_BILLING.map(f => <Row key={f.label} {...f} />)}
        </Section>

        {/* Admin */}
        <Section title="Admin dashboard">
          {ADMIN.map(f => <Row key={f.label} {...f} />)}
        </Section>

        {/* Security */}
        <Section title="Security">
          {SECURITY.map(f => <Row key={f.label} {...f} />)}
        </Section>

        {/* SEO / Content pages */}
        <div className="rounded-2xl border border-[#dcdce3] bg-white">
          <div className="border-b border-[#dcdce3] px-5 py-3">
            <h2 className="font-bold text-[#131f2f]">SEO & content pages</h2>
          </div>
          <div className="divide-y divide-[#dcdce3]">
            {SEO_PAGES.map(section => (
              <div key={section.section} className="px-5 py-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#77838F]">{section.section}</p>
                {section.pages.map(p => <Row key={p.label} {...p} />)}
              </div>
            ))}
          </div>
        </div>

        {/* Technical foundation */}
        <Section title="Technical foundation & SEO infrastructure">
          {TECH_FOUNDATION.map(f => <Row key={f.label} {...f} />)}
        </Section>

        {/* Roadmap phases */}
        <div className="rounded-2xl border border-[#006EDC] bg-[#F5F9FC]">
          <div className="border-b border-[#006EDC]/20 px-5 py-3">
            <h2 className="font-bold text-[#006EDC]">Roadmap — what's next</h2>
          </div>
          <div className="divide-y divide-[#dcdce3]">
            {[
              {
                phase: "Immediate (before deploy)",
                items: [
                  "⚠️ ROTATE all API keys using dual-key window — OpenAI, Anthropic, Google, Apify, Supabase service role",
                  "Set NEXT_PUBLIC_APP_URL in Vercel (currently localhost fallback in checkout/portal routes)",
                  "Set STRIPE_STARTER_PRICE_ID env var (create $9/mo recurring price in Stripe dashboard first)",
                  "Apply migrations 012, 013, 014 to production Supabase",
                  "Create /public/og-image.png (1200×630) for social sharing",
                  "Promote CSP Report-Only to enforced after 7 days of monitoring",
                ],
              },
              {
                phase: "Short term (2–3 weeks)",
                items: [
                  "Google OAuth setup (Supabase + Google Cloud Console)",
                  "Submit sitemap to Google Search Console and Bing",
                  "Build 3 remaining feature pages (/features/cover-letter, /features/interview-prep, /features/job-tracker)",
                  "Build /solutions/healthcare-workers-canada",
                  "Add email notifications for job match alerts",
                  "LinkedIn import end-to-end QA",
                  "Usage analytics dashboard in admin",
                ],
              },
              {
                phase: "Medium term (1–2 months)",
                items: [
                  "2 more comparison pages (vs Zety, vs Kickresume)",
                  "4 more French content pages (lettre de motivation, entretien, etc.)",
                  "3 more blog posts (work permit types, PGWP guide, regulated professions)",
                  "Off-site GEO: Product Hunt launch, Reddit posts, G2/Capterra listings",
                  "Real salary insights per role (JobBank wage data integration)",
                  "Resume version comparison (A/B between optimizations)",
                  "Core Web Vitals measurement and improvement pass",
                  "Error monitoring (Sentry)",
                  "Analytics (Plausible or PostHog)",
                ],
              },
              {
                phase: "Later (3+ months)",
                items: [
                  "AI resume chat (ask questions about your CV, get coaching)",
                  "Locale detection — auto-detect country/browser language, switch UI accordingly (FR removed from nav until this ships)",
                  "Penetration test",
                  "CI/CD pipeline",
                  "Revenue / MRR analytics in admin",
                  "Team/enterprise collaboration (shared CV library, manager review)",
                  "Mobile-optimised UI pass",
                ],
              },
            ].map(phase => (
              <div key={phase.phase} className="px-5 py-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">{phase.phase}</p>
                <ul className="space-y-1.5">
                  {phase.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#3B4959]">
                      <span className="mt-0.5 shrink-0 text-[#006EDC]">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Out of scope */}
        <div className="rounded-2xl border border-red-100 bg-red-50">
          <div className="border-b border-red-100 px-5 py-3">
            <h2 className="font-bold text-red-600">Out of scope — we won&apos;t build these</h2>
          </div>
          <div className="px-5 py-4">
            <ul className="space-y-2">
              {[
                "Native mobile app (iOS / Android) — web-first, responsive is sufficient",
                "Browser extension — too much maintenance overhead for v1",
                "Job application auto-fill — requires browser extension",
                "ATS simulation sandbox — not worth the infrastructure cost",
                "Resume printing / physical mail service",
                "Headhunting / recruiter-facing marketplace",
                "Job board (we aggregate; we don't host listings)",
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#3B4959]">
                  <span className="mt-0.5 shrink-0 font-bold text-red-400">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
