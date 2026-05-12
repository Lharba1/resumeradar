# ResumeRadar — SEO + GEO Implementation Roadmap

---

## Phase 1 — Technical Foundation (Week 1–2)

**Goal:** Make the site crawlable, indexable, and AI-readable.

### Next.js Metadata (1–2 days)
- [ ] Add `generateMetadata()` to `app/layout.tsx` with default title template: `"%s | ResumeRadar"`
- [ ] Add page-level metadata to `/` (landing), `/pricing`, all feature pages
- [ ] Open Graph tags: `og:title`, `og:description`, `og:image` (1200×630px)
- [ ] Twitter card meta tags
- [ ] Canonical URLs on all pages

### Robots & Crawlers (2 hours)
- [ ] Create `/public/robots.txt` — allow GPTBot, PerplexityBot, ClaudeBot, OAI-SearchBot
- [ ] Block CCBot (training harvester) if desired
- [ ] Point `Sitemap:` to `https://resumeradar.io/sitemap.xml`

### Sitemap (half day)
- [ ] Create `/app/sitemap.ts` — dynamic Next.js sitemap
- [ ] Include all public pages (landing, pricing, features/*, solutions/*, compare/*, resources/*)
- [ ] Exclude app pages (/optimize, /build-resume, /jobs, /tracker, /library, /dashboard)
- [ ] Submit to Google Search Console + Bing Webmaster Tools

### llms.txt (1 hour)
- [ ] Create `/public/llms.txt` — see GEO-ANALYSIS.md for content
- [ ] Describes all tools, key resources, pricing tiers, contact

### Server-Side Rendering Audit (1 day)
- [ ] Convert landing page `/` to SSR (remove `"use client"`, use `generateMetadata`)
- [ ] Ensure `/pricing`, `/features/*`, `/solutions/*` are SSR
- [ ] App pages can stay client-only (behind auth)

---

## Phase 2 — Core Pages & Schema (Week 3–6)

**Goal:** Build the pages that capture high-intent search traffic.

### Core Pages to Build
- [ ] `/pricing` — SoftwareApplication + Offer schema
- [ ] `/features/ats-optimizer` — feature page with schema
- [ ] `/solutions/immigrants-canada` — primary audience landing page
- [ ] `/compare/jobscan-alternative` — comparison page (highest-converting content type)
- [ ] `/resources/guides/canadian-resume-guide` — cornerstone SEO content
- [ ] `/resources/guides/ats-optimization-guide` — cornerstone SEO content

### Schema Implementation
- [ ] `Organization` schema on every page (name, url, logo, sameAs links)
- [ ] `WebSite` schema with `SearchAction` on homepage
- [ ] `SoftwareApplication` schema on homepage and feature pages
- [ ] `Article` + `Person` (author) schema on all blog posts
- [ ] `BreadcrumbList` on all inner pages

### Analytics Setup
- [ ] Google Search Console — verify domain, submit sitemap
- [ ] Google Analytics 4 — pageviews, organic channel, conversion events
- [ ] Bing Webmaster Tools — submit sitemap, enable IndexNow
- [ ] Set up conversion goal: "Signed up from organic"

---

## Phase 3 — Content & GEO Off-Site (Month 2–3)

**Goal:** Build authority and get cited by AI systems.

### Content Production
- [ ] Publish 8 blog posts (see CONTENT-CALENDAR.md Month 1–2)
- [ ] Build 4 solution pages
- [ ] Launch French content hub `/fr/`
- [ ] Create free resume templates page (link magnet)

### Off-Site Brand Mentions (GEO priority)
- [ ] **Product Hunt launch** — generates Reddit discussions, backlinks, early users
- [ ] **List on G2, Capterra, AlternativeTo** — free, high DA, AI training sources
- [ ] **Reddit posts:** r/ImmigrationCanada, r/cscareerquestions, r/Resume, r/PersonalFinanceCanada
- [ ] **LinkedIn company page** — posts about ATS tips, Canadian job market
- [ ] **YouTube:** 2-3 short demos (screen recordings) — "How to optimize your resume for ATS in 3 minutes"

### E-E-A-T Building
- [ ] Add author bio page with credentials for blog posts
- [ ] Add "Last updated" date to all guides
- [ ] Add statistics/data citations from Statistics Canada, IRCC, LinkedIn Workforce Report
- [ ] Add 3 testimonials with full name + job title + company

---

## Phase 4 — Scale & Authority (Month 4–12)

**Goal:** Compound growth — content → rankings → citations → signups.

### Content Scale
- [ ] 2 blog posts/week (1 EN + 1 FR)
- [ ] 1 original data piece/month ("We analyzed X Canadian job postings")
- [ ] Expand comparison pages (vs Resume.io, vs Rezi, vs Enhancv)
- [ ] Programmatic pages: `/resources/templates/[industry]-resume-template`

### Link Building
- [ ] Guest posts on immigration blogs (Settlement.org, CIC News, Moving2Canada)
- [ ] HARO/Qwoted responses for HR/resume/career journalists
- [ ] Partner with immigration consultants for resource mentions
- [ ] Apply for "Best Tools for Newcomers" listicles

### Advanced GEO
- [ ] Publish original survey: "500 Canadian HR managers on ATS usage" — highly citable
- [ ] Create an ATS Score Calculator (free, linkable, citable tool)
- [ ] Monitor AI citations: search "best ats resume tool canada" in ChatGPT, Perplexity monthly
- [ ] Add `sameAs` entity links (LinkedIn, Crunchbase, Product Hunt, GitHub) to Organization schema

---

## Quick Wins Checklist (Do This Week)

- [ ] `robots.txt` — 30 minutes
- [ ] `llms.txt` — 1 hour
- [ ] `sitemap.xml` (Next.js dynamic) — 2 hours
- [ ] Landing page `<title>` and `<meta description>` — 1 hour
- [ ] Open Graph image for homepage — 2 hours (design)
- [ ] Google Search Console verification — 20 minutes
- [ ] LinkedIn company page — 1 hour
