# ResumeRadar — Site Structure & URL Architecture

## URL Hierarchy

```
resumeradar.io/
│
├── /                          ← Landing page (SSR required)
├── /pricing                   ← Pricing tiers (SSR required)
├── /features                  ← Features overview
│   ├── /features/ats-optimizer
│   ├── /features/resume-builder
│   ├── /features/cover-letter
│   ├── /features/interview-prep
│   └── /features/job-tracker
│
├── /solutions                 ← Use-case pages
│   ├── /solutions/immigrants-canada
│   ├── /solutions/international-students
│   ├── /solutions/newcomers-canada
│   ├── /solutions/engineers-canada
│   └── /solutions/french-speakers
│
├── /compare                   ← Comparison pages (high-converting)
│   ├── /compare/jobscan-alternative
│   ├── /compare/jobradar-vs-jobscan
│   ├── /compare/jobradar-vs-resumeio
│   └── /compare/best-ats-resume-tools-canada
│
├── /resources                 ← Content hub
│   ├── /resources/blog
│   │   ├── /resources/blog/how-ats-works-canada
│   │   ├── /resources/blog/canadian-resume-format-guide
│   │   ├── /resources/blog/resume-tips-immigrants-canada
│   │   └── ...
│   ├── /resources/guides
│   │   ├── /resources/guides/ats-optimization-guide
│   │   ├── /resources/guides/canadian-resume-guide
│   │   └── /resources/guides/job-search-immigrants-canada
│   └── /resources/templates   ← Free CV templates (SEO magnet)
│
├── /fr                        ← French content hub
│   ├── /fr/optimiseur-cv-ats
│   ├── /fr/construire-cv
│   └── /fr/ressources/blogue
│
├── /about
├── /contact
├── /privacy
├── /terms
├── /sitemap.xml
├── /robots.txt
└── /llms.txt                  ← GEO: AI crawler guidance
```

---

## Priority Pages to Build First

### Tier 1 — Launch (Week 1-2)
1. `/` — Landing page with SSR metadata
2. `/pricing` — Pricing page with schema
3. `/features/ats-optimizer` — Core feature page
4. `/solutions/immigrants-canada` — Primary audience page
5. `/resources/guides/canadian-resume-guide` — SEO anchor content

### Tier 2 — Month 1
6. `/resources/guides/ats-optimization-guide`
7. `/compare/jobscan-alternative`
8. `/solutions/international-students`
9. `/resources/blog/how-ats-works-canada`
10. `/fr/optimiseur-cv-ats`

### Tier 3 — Month 2-3
11-20. Remaining features, solutions, comparison pages, blog posts

---

## Internal Linking Strategy

- Landing page → Features → Pricing (conversion funnel)
- Blog posts → relevant Features page (MOFU bridge)
- Guides → Solutions pages (audience matching)
- Comparison pages → Pricing (bottom-of-funnel)
- Every blog post → 1 guide + 1 feature page (link depth)
- French pages ↔ English pages via `hreflang` tags

---

## hreflang Implementation

All bilingual pages must have:
```html
<link rel="alternate" hreflang="en-ca" href="https://resumeradar.io/[page]" />
<link rel="alternate" hreflang="fr-ca" href="https://resumeradar.io/fr/[page]" />
<link rel="alternate" hreflang="x-default" href="https://resumeradar.io/[page]" />
```
