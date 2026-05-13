# ResumeRadar — SEO + GEO Implementation Roadmap
**Last updated:** 2026-05-13

---

## Phase 1 — Technical Foundation ✅ COMPLETE

| Task | Status |
|------|--------|
| robots.txt with AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Bytespider; CCBot blocked) | ✅ Done |
| llms.txt at /public/llms.txt | ✅ Done |
| sitemap.ts — 30 clean pages, no ghost URLs | ✅ Done |
| All public pages as Next.js SSR server components | ✅ Done |
| Title + meta description on all pages | ✅ Done |
| Open Graph image (/public/og-image.png) | ✅ Done |
| hreflang EN ↔ FR on homepage and key pages | ✅ Done |
| Canonical URLs on all pages | ✅ Done |

---

## Phase 2 — Core Pages & Schema ✅ COMPLETE

| Task | Status |
|------|--------|
| Homepage with FAQPage schema + 4 pricing tiers | ✅ Done |
| /pricing page with BreadcrumbList + secure checkout strip | ✅ Done |
| /features/ats-optimizer feature page | ✅ Done |
| /solutions/immigrants-canada, /international-students, /engineers-canada, /french-speakers | ✅ Done |
| 5 comparison pages (/compare/*) | ✅ Done |
| 3 guides (/resources/guides/*) | ✅ Done |
| 7 blog posts (/resources/blog/*) | ✅ Done |
| /resources/templates | ✅ Done |
| /fr + /fr/optimiseur-cv-ats | ✅ Done |
| /about page | ✅ Done |
| Organization schema with logo (/public/logo.png) | ✅ Done |
| BlogPosting + Person author schema on all blog posts | ✅ Done |
| BreadcrumbList on all inner pages | ✅ Done |
| SoftwareApplication with 4 offers (USD) | ✅ Done |
| priceCurrency = USD across all schemas | ✅ Done |
| Ghost URLs removed from sitemap (5 pages) | ✅ Done |
| Admin billing dashboard (MRR, plan stats, manual override) | ✅ Done |
| CSP Report-Only header + /api/csp-report endpoint | ✅ Done |
| Next.js upgraded to 16.2.6 (HIGH CVE patch) | ✅ Done |

---

## Phase 3 — E-E-A-T & Content Quality 🔄 IN PROGRESS

### Code fixes (this sprint)

| Task | Priority | Status |
|------|----------|--------|
| Remove dead sameAs URLs from Organization schema (page.tsx:28-32) | CRITICAL | 🔄 In progress |
| Fix canadian-resume-guide Article author: Organization → Person | HIGH | 🔄 In progress |
| Add source links to Stats Canada + ATS statistics across pages | HIGH | 🔄 In progress |
| Create /contact page | HIGH | 🔄 In progress |
| Add visible author bylines to all blog posts | MEDIUM | 🔄 In progress |
| Add contextual inline internal links in blog/guide body content | MEDIUM | 🔄 In progress |
| Expand all 7 blog posts to 1,500+ words | HIGH | 🔄 In progress |
| Expand guides to 2,000+ words | HIGH | 🔄 In progress |
| Fix /fr sitemap ghost pages (build or remove) | MEDIUM | ❌ Pending |

### Off-site brand signals (user action required)

| Task | Priority | Status |
|------|----------|--------|
| Product Hunt launch | HIGH | ❌ Pending |
| Reddit posts (r/ImmigrationCanada, r/PersonalFinanceCanada, r/cscareerquestions) | HIGH | ❌ Pending |
| LinkedIn company page | HIGH | ❌ Pending |
| G2 / Capterra / AlternativeTo listing | HIGH | ❌ Pending |
| Resend DNS email verification | MEDIUM | ⏳ Awaiting DNS propagation |

### Operations

| Task | Priority | Status |
|------|----------|--------|
| Stripe live key — replace 7-day expiring key with permanent restricted key | URGENT | ❌ Action needed |
| CSP: promote Report-Only → Enforced (after 7 days monitoring admin_actions) | MEDIUM | ⏳ Monitor |
| Google Search Console — verify domain + submit sitemap | HIGH | ❌ Pending |
| Bing Webmaster Tools — submit sitemap + enable IndexNow | MEDIUM | ❌ Pending |

---

## Phase 4 — Scale & Authority (Month 4–12)

### Content scale
- [ ] 2 blog posts/week (1 EN + 1 FR)
- [ ] 1 original data piece/month ("We analyzed 500 Canadian job postings — top ATS keywords")
- [ ] Programmatic pages: /resources/templates/[industry]-resume-template
- [ ] New feature pages as product grows

### Link building
- [ ] Guest posts: Settlement.org, CIC News, Moving2Canada
- [ ] HARO/Qwoted for HR/resume/career journalists
- [ ] Partner with immigration consultants for resource mentions
- [ ] Apply for "Best Tools for Newcomers" listicles

### Advanced GEO
- [ ] Publish original survey: "500 Canadian HR managers on ATS usage"
- [ ] Free ATS Score Calculator (linkable, citable)
- [ ] Monitor AI citations monthly in ChatGPT + Perplexity
- [ ] Add sameAs once social accounts are live

---

## Urgent This Week

1. **Replace Stripe live key** before 7-day expiry
2. **Google Search Console** — verify domain, submit sitemap
3. **LinkedIn company page** — highest-impact 1-hour brand signal
