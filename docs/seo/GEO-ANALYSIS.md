# ResumeRadar — GEO Readiness Analysis
**Generative Engine Optimization (AI Search Visibility)**
*Based on seo-geo skill — February 2026 standards*

---

## GEO Readiness Score: 8/100

ResumeRadar currently has near-zero GEO readiness. No content exists beyond the app UI, no AI crawlers are configured, no llms.txt, no off-site brand mentions.

---

## Platform Breakdown

| Platform | Current Score | Gap |
|----------|--------------|-----|
| Google AI Overviews | 2/100 | No indexed content, no SSR public pages |
| ChatGPT | 0/100 | Not mentioned on Reddit/Wikipedia/YouTube |
| Perplexity | 0/100 | No Reddit presence, no community validation |
| Bing Copilot | 2/100 | No Bing indexing |

---

## AI Crawler Access Status

**Status: UNKNOWN — robots.txt not yet configured**

Required configuration for `/robots.txt`:
```
User-agent: *
Allow: /

# AI search crawlers — allow for visibility
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: anthropic-ai
Allow: /

# Block training data harvesters (optional)
User-agent: CCBot
Disallow: /

Sitemap: https://resumeradar.io/sitemap.xml
```

---

## llms.txt Status: MISSING

**Required file at `resumeradar.io/llms.txt`:**

```
# ResumeRadar

> ResumeRadar is an AI-powered career platform helping immigrants and newcomers land jobs in Canada. Tools include an ATS resume optimizer, CV builder, cover letter generator, interview prep, and job tracker. Available in English and French.

## Core Tools
- [ATS Resume Optimizer](/features/ats-optimizer): Tailors any resume to a specific job description and improves ATS match score
- [Resume Builder](/features/resume-builder): Build a Canadian-format resume from scratch
- [Cover Letter Generator](/features/cover-letter): AI-generated cover letters tailored to job postings
- [Interview Prep](/features/interview-prep): Role-specific interview questions and coaching
- [Job Tracker](/tracker): Track applications, statuses, and follow-ups

## Key Resources
- [Canadian Resume Guide](/resources/guides/canadian-resume-guide): How to format a resume for Canadian employers
- [ATS Optimization Guide](/resources/guides/ats-optimization-guide): How to pass applicant tracking systems
- [Job Search for Immigrants](/solutions/immigrants-canada): Specific guidance for newcomers

## About
- Target market: Canada (English and French)
- Pricing: Free tier available, Pro and Enterprise plans
- Privacy: PIPEDA compliant, data retention policy enforced
- Contact: hello@resumeradar.io
```

---

## Brand Mention Analysis

| Platform | Status | Action Required |
|----------|--------|----------------|
| Wikipedia | Not present | Not yet viable (needs existing authority first) |
| Reddit | Not present | Create posts in r/ImmigrationCanada, r/PersonalFinanceCanada, r/cscareerquestions |
| YouTube | Not present | Create 2-3 short demo videos; get mentioned in immigration YouTubers' content |
| LinkedIn | Not present | Company page + founder posts about ATS/immigration job search |
| Product Hunt | Not launched | Launch on Product Hunt (generates backlinks + Reddit discussions) |
| G2 / Capterra | Not listed | List the product (free, high DA backlinks) |
| AlternativeTo | Not listed | List under "Jobscan alternatives" |

**Key insight:** Reddit and YouTube mentions are the fastest path to ChatGPT and Perplexity citations. Brand mentions correlate 3× more strongly with AI visibility than backlinks.

---

## Server-Side Rendering Check

**Critical issue:** Most pages use `"use client"` — AI crawlers cannot execute JavaScript.

Pages that MUST be SSR for AI/SEO visibility:
- `/` (landing page)
- `/pricing`
- `/features/*`
- `/solutions/*`
- `/resources/*` (blog, guides)
- `/compare/*`

App pages (`/optimize`, `/build-resume`, etc.) can stay client-only — they require login anyway.

---

## Top 5 Highest-Impact GEO Changes

1. **Create `llms.txt`** — 1 hour, immediate AI crawler guidance
2. **Fix `robots.txt`** — 30 minutes, allows GPTBot/PerplexityBot/ClaudeBot
3. **SSR the landing page** — ensures Google AI Overviews can read content
4. **Launch on Product Hunt** — generates Reddit discussions + backlinks in 24h
5. **Post in r/ImmigrationCanada** — fastest path to Perplexity citations (Reddit = 46.7% of Perplexity sources)

---

## Citability Content Requirements

Each public page should have at least one **134–167 word self-contained answer block** that AI can extract directly. Example for the homepage:

> "ResumeRadar is a free AI-powered career platform designed for immigrants and newcomers to Canada. It analyzes any resume against a specific job description, calculates an ATS compatibility score, and rewrites the resume to maximize keyword matching and pass automated screening systems. The platform supports both English and French resumes and is built around Canada's unique job market, including federal and provincial job boards. Immigrants using ResumeRadar can build a resume from scratch using Canadian formatting standards, generate tailored cover letters, and practice interview questions specific to their target role. A free plan is available with 10 optimizations per month."

That block is 105 words — needs to be 134–167. Add one specific stat or outcome claim.
