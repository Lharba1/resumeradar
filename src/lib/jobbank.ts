import * as cheerio from "cheerio";
import { JOBBANK_SELECTORS } from "@/lib/scrapers/selectors";

export interface JobBankListing {
  job_title: string;
  company_name: string | null;
  location: string | null;
  job_description: string | null;
  linkedin_url: string | null;
  source: string;
}

const BASE = "https://www.jobbank.gc.ca";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-CA,en;q=0.9",
};

async function fetchJobDetail(url: string): Promise<string> {
  try {
    // Strip jsessionid from URL — not needed for detail pages
    const cleanUrl = url.replace(/;jsessionid=[^?]+/, "");
    const res = await fetch(cleanUrl, { headers: HEADERS });
    if (!res.ok) return "";
    const html = await res.text();
    const $ = cheerio.load(html);
    const desc =
      $(JOBBANK_SELECTORS.detailBody).text() ||
      $(JOBBANK_SELECTORS.detailCommon).text() ||
      $(JOBBANK_SELECTORS.detailContent).text();
    return desc.replace(/\s+/g, " ").trim().slice(0, 4000);
  } catch {
    return "";
  }
}

export async function scrapeJobBank(
  query: string,
  visaOnly: boolean,
  maxResults = 15,
): Promise<JobBankListing[]> {
  const params = new URLSearchParams({
    searchstring: query,
    locationstring: "Canada",
    sort: "M",
    btn_search: "Search",
    fsrc: "16",
    fmwid: "1",
  });

  const url = `${BASE}/jobsearch/jobsearch?${params.toString()}`;

  let html: string;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`Job Bank returned HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    throw new Error(
      `Job Bank fetch failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const $ = cheerio.load(html);
  const results: JobBankListing[] = [];

  // Real structure: <article class="action-buttons"><a class="resultJobItem" href="...">
  $(JOBBANK_SELECTORS.jobCard).each((_, el) => {
    if (results.length >= maxResults) return false;

    const $el = $(el);
    const $link = $el.find(JOBBANK_SELECTORS.jobLink);

    const job_title = $link.find(JOBBANK_SELECTORS.title).text().trim();
    if (!job_title) return;

    const href = $link.attr("href") ?? "";
    // Strip jsessionid — keeps URL clean for detail fetches
    const cleanHref = href.replace(/;jsessionid=[^?]+/, "");
    const fullUrl = cleanHref.startsWith("http") ? cleanHref : `${BASE}${cleanHref}`;

    const company_name = $link.find(JOBBANK_SELECTORS.company).text().trim() || null;

    // Location li contains icon spans — get text directly
    const locationEl = $link.find(JOBBANK_SELECTORS.location);
    locationEl.find("span").remove();
    const location = locationEl.text().replace(/\s+/g, " ").trim() || null;

    results.push({
      job_title,
      company_name,
      location: location || "Canada",
      job_description: null,
      linkedin_url: fullUrl || null,
      source: "jobbank",
    });
  });

  if (results.length === 0) return results;

  // Fetch descriptions for top results in parallel
  const withDescriptions = await Promise.all(
    results.slice(0, maxResults).map(async (job) => {
      if (!job.linkedin_url) return job;
      const desc = await fetchJobDetail(job.linkedin_url);
      return { ...job, job_description: desc || null };
    }),
  );

  return withDescriptions;
}
