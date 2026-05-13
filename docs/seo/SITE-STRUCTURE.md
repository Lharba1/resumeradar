# ResumeRadar — Site Structure & URL Architecture
**Last updated:** 2026-05-13

## Live URL Inventory (30 pages in sitemap)

```
resumeradar.io/
│
├── /                              ✅ Live — SSR, FAQPage schema, 4 offers
├── /pricing                       ✅ Live — SoftwareApplication + Offer + BreadcrumbList
├── /about                         ✅ Live
├── /privacy                       ✅ Live
├── /terms                         ✅ Live
├── /contact                       ❌ MISSING — add (trust signal for Google)
│
├── /features/
│   └── /features/ats-optimizer    ✅ Live — SoftwareApplication + FAQPage
│   NOTE: resume-builder, cover-letter, interview-prep, job-tracker
│         NOT BUILT — removed from sitemap (were ghost URLs)
│
├── /solutions/
│   ├── /solutions/immigrants-canada       ✅ Live
│   ├── /solutions/international-students  ✅ Live
│   ├── /solutions/engineers-canada        ✅ Live
│   └── /solutions/french-speakers         ✅ Live
│   NOTE: newcomers-canada NOT BUILT — removed from sitemap
│
├── /compare/
│   ├── /compare/jobscan-alternative           ✅ Live
│   ├── /compare/jobradar-vs-jobscan           ✅ Live
│   ├── /compare/jobradar-vs-resumeio          ✅ Live
│   ├── /compare/jobradar-vs-rezi              ✅ Live
│   └── /compare/best-ats-resume-tools-canada  ✅ Live
│
├── /resources/
│   ├── /resources/templates               ✅ Live
│   ├── /resources/blog                    ✅ Live (index)
│   │   ├── /resources/blog/resume-tips-immigrants-canada   ✅ Live (~950w, needs expansion)
│   │   ├── /resources/blog/ats-keywords-canada             ✅ Live (~900w, needs expansion)
│   │   ├── /resources/blog/canadian-resume-vs-us-resume    ✅ Live (~950w, needs expansion)
│   │   ├── /resources/blog/cover-letter-canada-guide       ✅ Live (~1,000w, needs expansion)
│   │   ├── /resources/blog/interview-prep-canada-immigrants ✅ Live (~1,100w, needs expansion)
│   │   ├── /resources/blog/linkedin-profile-canada         ✅ Live (~900w, needs expansion)
│   │   └── /resources/blog/salary-negotiation-canada       ✅ Live (~1,200w, needs expansion)
│   └── /resources/guides/
│       ├── /resources/guides/canadian-resume-guide         ✅ Live (⚠️ author fix needed + expansion)
│       ├── /resources/guides/ats-optimization-guide        ✅ Live (needs expansion)
│       └── /resources/guides/job-search-immigrants-canada  ✅ Live (needs expansion)
│
├── /fr/                                   ✅ Live
│   ├── /fr/optimiseur-cv-ats              ✅ Live
│   ├── /fr/ressources/blogue/guide-cv-canadien         ❌ In sitemap — NOT BUILT
│   └── /fr/ressources/guides/recherche-emploi-canada   ❌ In sitemap — NOT BUILT
│
├── /sitemap.xml                           ✅ Clean (30 URLs)
├── /robots.txt                            ✅ AI crawlers allowed
└── /llms.txt                              ✅ Live
```

---

## App Pages (auth-gated, excluded from sitemap)

```
/login          /optimize       /dashboard
/build-resume   /jobs           /tracker
/cover-letter   /interview      /library
/settings       /admin/*
```

---

## Action Items

| Page | Issue | Priority |
|------|-------|----------|
| /contact | Missing entirely — trust signal | HIGH |
| /fr/ressources/blogue/guide-cv-canadien | In sitemap but page doesn't exist — build or remove from sitemap | HIGH |
| /fr/ressources/guides/recherche-emploi-canada | Same — in sitemap but not built | MEDIUM |

---

## Internal Linking Strategy

**Current state:** Blog posts and guides only have "related links" at the bottom — no contextual inline links in the body.

**Target:** Every piece of content must have 2–4 inline contextual links:
- Blog posts → relevant feature page + related guide
- Guides → solutions pages + feature pages
- Solution pages → feature pages + pricing
- Comparison pages → /pricing (bottom-of-funnel)

---

## hreflang Status

| Page pair | Status |
|-----------|--------|
| / ↔ /fr | ✅ Done |
| /features/ats-optimizer ↔ /fr/optimiseur-cv-ats | ✅ Done |
| Blog posts ↔ French equivalents | ❌ Not done (FR pages not built yet) |
