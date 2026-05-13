import type { MetadataRoute } from "next";

const BASE = "https://resumeradar.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Feature pages — only include built pages (add others as they go live)
  const featurePages: MetadataRoute.Sitemap = [
    "/features/ats-optimizer",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Solution pages — only built pages
  const solutionPages: MetadataRoute.Sitemap = [
    "/solutions/immigrants-canada",
    "/solutions/international-students",
    "/solutions/engineers-canada",
    "/solutions/french-speakers",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Comparison pages
  const comparePages: MetadataRoute.Sitemap = [
    "/compare/jobscan-alternative",
    "/compare/jobradar-vs-jobscan",
    "/compare/jobradar-vs-resumeio",
    "/compare/jobradar-vs-rezi",
    "/compare/best-ats-resume-tools-canada",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Resource guides
  const guidePages: MetadataRoute.Sitemap = [
    "/resources/guides/canadian-resume-guide",
    "/resources/guides/ats-optimization-guide",
    "/resources/guides/job-search-immigrants-canada",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = [
    "/resources/blog",
    "/resources/blog/resume-tips-immigrants-canada",
    "/resources/blog/ats-keywords-canada",
    "/resources/blog/canadian-resume-vs-us-resume",
    "/resources/blog/cover-letter-canada-guide",
    "/resources/blog/interview-prep-canada-immigrants",
    "/resources/blog/linkedin-profile-canada",
    "/resources/blog/salary-negotiation-canada",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Templates page
  const templatePages: MetadataRoute.Sitemap = [
    { url: `${BASE}/resources/templates`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  // French pages
  const frenchPages: MetadataRoute.Sitemap = [
    "/fr",
    "/fr/optimiseur-cv-ats",
    "/fr/ressources/blogue/guide-cv-canadien",
    "/fr/ressources/guides/recherche-emploi-canada",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));


  // About page
  const aboutPage: MetadataRoute.Sitemap = [
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 },
  ];

  return [
    ...staticPages,
    ...featurePages,
    ...solutionPages,
    ...comparePages,
    ...guidePages,
    ...blogPages,
    ...templatePages,
    ...frenchPages,
    ...aboutPage,
  ];
}
