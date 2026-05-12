interface AdzunaJob {
  id: string;
  title: string;
  description: string;
  redirect_url: string;
  company: { display_name: string };
  location: { display_name: string; area: string[] };
  created: string;
}

interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
}

export interface RawJobAdzuna {
  job_title: string;
  company_name: string;
  location: string;
  job_description: string;
  linkedin_url: string;
  source: "adzuna";
}

export async function fetchAdzuna(
  query: string,
  _visaOnly: boolean,
  maxResults: number,
): Promise<RawJobAdzuna[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) return [];

  const url = new URL("https://api.adzuna.com/v1/api/jobs/ca/search/1");
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("results_per_page", String(Math.min(maxResults, 50)));
  url.searchParams.set("what", query);
  url.searchParams.set("content-type", "application/json");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) return [];

  const data = (await res.json()) as AdzunaResponse;

  return (data.results ?? []).map((j) => ({
    job_title: j.title,
    company_name: j.company?.display_name ?? "",
    location: j.location?.display_name ?? "",
    job_description: j.description ?? "",
    linkedin_url: j.redirect_url ?? "",
    source: "adzuna" as const,
  }));
}
