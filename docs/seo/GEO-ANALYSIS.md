# ResumeRadar — GEO Readiness Analysis
**Generative Engine Optimization (AI Search Visibility)**
*Based on seo-geo skill — February 2026 standards*
*Last updated: 2026-05-13*

---

## GEO Readiness Score: 52/100
*(was 8/100 — +44 points from technical infrastructure work)*

Technical GEO foundation is complete. Score is now blocked by off-site brand signals — the only remaining gap is community presence (Reddit, Product Hunt, LinkedIn, G2).

---

## Platform Breakdown

| Platform | Score | Status |
|----------|-------|--------|
| Google AI Overviews | 55/100 | SSR ✅, schema ✅, sitemap ✅ — needs indexed content to age |
| ChatGPT | 35/100 | Not on Reddit/Wikipedia — strong once brand mentions land |
| Perplexity | 30/100 | No Reddit presence yet — highest-leverage gap |
| Bing Copilot | 48/100 | SSR ✅, sitemap ✅, hreflang ✅ |

---

## AI Crawler Access Status: ✅ DONE

`/public/robots.txt` is configured and live:

| Crawler | Status |
|---------|--------|
| GPTBot (OpenAI) | ✅ Allowed |
| OAI-SearchBot (OpenAI) | ✅ Allowed |
| ChatGPT-User (OpenAI) | ✅ Allowed |
| ClaudeBot (Anthropic) | ✅ Allowed |
| PerplexityBot (Perplexity) | ✅ Allowed |
| anthropic-ai (Anthropic) | ✅ Allowed |
| Bytespider (ByteDance) | ✅ Allowed |
| CCBot (Common Crawl — training harvester) | ✅ Blocked |

App routes (`/admin`, `/api`, `/dashboard`, `/optimize`, etc.) are correctly disallowed.

---

## llms.txt Status: ✅ DONE

`/public/llms.txt` exists and is served at `https://resumeradar.io/llms.txt`.

Includes: product description, core tools with URLs, key resources, product details (pricing, PIPEDA, bilingual), contact.

---

## Server-Side Rendering: ✅ DONE

All public-facing SEO pages are Next.js App Router server components (no `"use client"`):

| Page | SSR |
|------|-----|
| `/` (homepage) | ✅ |
| `/pricing` | ✅ |
| `/features/ats-optimizer` | ✅ |
| `/solutions/*` (4 pages) | ✅ |
| `/compare/*` (5 pages) | ✅ |
| `/resources/guides/*` (3 pages) | ✅ |
| `/resources/blog/*` (7 posts + index) | ✅ |
| `/resources/templates` | ✅ |
| `/fr` and `/fr/optimiseur-cv-ats` | ✅ |

App pages (`/optimize`, `/build-resume`, `/jobs`, etc.) are client-only — correct, as they require login.

---

## Schema Markup: ✅ DONE

| Schema | Pages | Status |
|--------|-------|--------|
| Organization (sitewide) | layout.tsx | ✅ logo.png live |
| WebSite + SearchAction | layout.tsx | ✅ |
| SoftwareApplication | homepage, features | ✅ All 4 offers (USD) |
| BreadcrumbList | pricing, features, solutions, guides, blog | ✅ |
| BlogPosting + Person author | all 7 blog posts | ✅ |
| FAQPage | features/ats-optimizer | ✅ (citability benefit) |

`priceCurrency` is consistently `"USD"` across all offer schemas.

---

## Hreflang (EN ↔ FR): ✅ DONE

`alternates.languages` set on homepage (`/` ↔ `/fr`) and features page.
French pages (`/fr`, `/fr/optimiseur-cv-ats`) exist and are server-rendered.

---

## Sitemap: ✅ CLEAN

Ghost URLs removed (5 pages that didn't exist):
- `/features/resume-builder`, `/features/cover-letter`, `/features/interview-prep`, `/features/job-tracker`
- `/solutions/newcomers-canada`

Duplicate entries removed (`extraSolutionPages` array deleted).

Current sitemap coverage: 30 URLs — all live pages.

---

## Brand Mention Analysis: ❌ NOT DONE

This is the entire remaining gap. Brand mentions correlate **3× more strongly** with AI citations than backlinks.

| Platform | Status | Impact |
|----------|--------|--------|
| Reddit | ❌ Not present | **CRITICAL** — Reddit = 46.7% of Perplexity sources, 11.3% of ChatGPT |
| Product Hunt | ❌ Not launched | **HIGH** — generates Reddit discussions + backlinks in 24h |
| LinkedIn company page | ❌ Not created | HIGH — LinkedIn = moderate ChatGPT citation signal |
| G2 / Capterra | ❌ Not listed | HIGH — high DA backlinks + review signals |
| AlternativeTo | ❌ Not listed | MEDIUM — "Jobscan alternative" query traffic |
| YouTube | ❌ No videos | MEDIUM — YouTube mentions = strongest AI citation signal (r=0.737) |
| Wikipedia | ❌ Not viable yet | LOW — needs existing authority first |

---

## Passage-Level Citability

Homepage has a 134–167 word citable block. No changes needed — block is present and well-formed.

---

## Pending Actions (by priority)

### 1. Product Hunt Launch (1 day effort → HIGH impact)
- Generates Reddit discussions organically
- Backlinks from high-DA pages
- Community validation signal for ChatGPT/Perplexity

### 2. Reddit Posts
Post in:
- `r/ImmigrationCanada` — "Built a free ATS resume optimizer for newcomers to Canada"
- `r/PersonalFinanceCanada` — job search angle
- `r/cscareerquestions` — bilingual/ATS angle

Each post gets ResumeRadar mentioned → Perplexity starts citing it within weeks.

### 3. LinkedIn Company Page
- Create page, publish 3-5 posts about ATS/Canada job search
- Founder posts with personal brand (higher engagement)

### 4. G2 / Capterra / AlternativeTo
- Free listings, high DA backlinks
- AlternativeTo under "Jobscan alternatives" captures comparison traffic

### 5. CSP: Promote from Report-Only to Enforced
After monitoring `admin_actions` (action = `csp_violation`) for 7 days with no violations, change `Content-Security-Policy-Report-Only` to `Content-Security-Policy` in `next.config.ts`.

### 6. Stripe Live Key
Replace the 7-day expiring key with a permanent restricted Stripe key before it expires.

### 7. Resend DNS
Complete email verification once DNS propagates (was pending, could take 4h).

---

## Score Projection

| Milestone | Estimated Score |
|-----------|----------------|
| Current (technical complete) | 52/100 |
| After Product Hunt + Reddit (2 weeks) | ~68/100 |
| After G2/Capterra + LinkedIn (1 month) | ~78/100 |
| After YouTube + aging content (3 months) | ~88/100 |
