import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";
import { checkAndIncrement } from "@/lib/rate-limit";
import { chatJSON } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const LINKEDIN_RE = /linkedin\.com\/in\/[^/?#\s]+/i;

// Maps Apify scraped profile → our CVProfile insert shape
function mapApifyProfile(p: Record<string, unknown>, url: string) {
  const exp = (p.experience as Record<string, unknown>[] | undefined) ?? [];
  const edu = (p.education  as Record<string, unknown>[] | undefined) ?? [];
  const skills    = (p.skills    as string[] | undefined) ?? [];
  const languages = (p.languages as Record<string, unknown>[] | undefined) ?? [];
  const certs     = (p.certifications as Record<string, unknown>[] | undefined) ?? [];

  const rawText = buildRawText(p, exp, edu, skills, languages, certs);

  return {
    full_name:          String(p.fullName ?? (`${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || "")),
    current_job_title:  String(p.headline ?? p.jobTitle ?? ""),
    years_of_experience: estimateYears(exp),
    technical_skills:   skills.slice(0, 30),
    industries:         (p.industries as string[] | undefined) ?? [],
    seniority_level:    guessSeniority(exp),
    summary:            String(p.summary ?? p.about ?? ""),
    raw_text:           rawText,
    enrichment_context: url,
  };
}

function buildRawText(
  p: Record<string, unknown>,
  exp: Record<string, unknown>[],
  edu: Record<string, unknown>[],
  skills: string[],
  languages: Record<string, unknown>[],
  certs: Record<string, unknown>[],
): string {
  const lines: string[] = [];

  lines.push(`Name: ${p.fullName ?? `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim()}`);
  if (p.headline)  lines.push(`Title: ${p.headline}`);
  if (p.location)  lines.push(`Location: ${p.location}`);
  if (p.email)     lines.push(`Email: ${p.email}`);
  if (p.phone)     lines.push(`Phone: ${p.phone}`);
  if (p.summary || p.about) lines.push(`\nSummary:\n${p.summary ?? p.about}`);

  if (exp.length) {
    lines.push("\nExperience:");
    for (const e of exp) {
      const title   = String(e.title ?? e.jobTitle ?? "");
      const company = String(e.company ?? e.companyName ?? "");
      const loc     = String(e.location ?? "");
      const start   = formatDate(e.startDate ?? e.start);
      const end     = e.current || e.isCurrent ? "Present" : formatDate(e.endDate ?? e.end);
      const desc    = String(e.description ?? "");
      lines.push(`${title} at ${company}${loc ? ` | ${loc}` : ""} (${start} - ${end})`);
      if (desc) lines.push(desc);
    }
  }

  if (edu.length) {
    lines.push("\nEducation:");
    for (const e of edu) {
      const school = String(e.school ?? e.schoolName ?? e.institution ?? "");
      const degree = String(e.degree ?? e.degreeName ?? "");
      const field  = String(e.field  ?? e.fieldOfStudy ?? "");
      const start  = formatDate(e.startDate ?? e.start);
      const end    = formatDate(e.endDate   ?? e.end);
      lines.push(`${school} — ${degree}${field ? `, ${field}` : ""} (${start}${end ? ` - ${end}` : ""})`);
    }
  }

  if (skills.length) lines.push(`\nSkills: ${skills.join(", ")}`);

  if (languages.length) {
    lines.push("\nLanguages:");
    for (const l of languages) {
      lines.push(`${l.name ?? l.language} — ${l.proficiency ?? l.level ?? ""}`);
    }
  }

  if (certs.length) {
    lines.push("\nCertifications:");
    for (const c of certs) {
      lines.push(String(c.name ?? c.title ?? c));
    }
  }

  return lines.join("\n");
}

function formatDate(d: unknown): string {
  if (!d) return "";
  if (typeof d === "string") return d;
  if (typeof d === "object" && d !== null) {
    const o = d as Record<string, unknown>;
    const m = o.month ?? o.Month;
    const y = o.year  ?? o.Year;
    if (y) return m ? `${m}/${y}` : String(y);
  }
  return String(d);
}

function estimateYears(exp: Record<string, unknown>[]): number {
  if (!exp.length) return 0;
  let total = 0;
  for (const e of exp) {
    const dur = Number((e as Record<string, unknown>).durationInDays ?? 0);
    if (dur) { total += dur / 365; continue; }
    const start = new Date(formatDate(e.startDate ?? e.start)).getTime();
    const end   = e.current || e.isCurrent
      ? Date.now()
      : new Date(formatDate(e.endDate ?? e.end)).getTime();
    if (start && end && end > start) total += (end - start) / (365 * 86_400_000);
  }
  return Math.round(total);
}

function guessSeniority(exp: Record<string, unknown>[]): string {
  const years = estimateYears(exp);
  if (years >= 10) return "senior";
  if (years >= 5)  return "mid";
  if (years >= 2)  return "junior";
  return "entry";
}

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  // Rate limit: max 5 LinkedIn imports per day (paid Apify calls) — atomic to prevent TOCTOU race
  const limit = await checkAndIncrement(user.id, "/api/linkedin/import", supabase);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Daily LinkedIn import limit reached (5/day). Try again tomorrow.", resetAt: limit.resetAt },
      { status: 429, headers: { "Retry-After": Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000).toString() } },
    );
  }

  let body: { url: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { url } = body;
  if (!url?.trim()) return NextResponse.json({ error: "LinkedIn URL is required" }, { status: 400 });
  if (!LINKEDIN_RE.test(url)) return NextResponse.json({ error: "Please enter a valid LinkedIn profile URL (linkedin.com/in/...)" }, { status: 400 });

  const apiKey = process.env.APIFY_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "LinkedIn import not configured" }, { status: 500 });

  // Use Apify's LinkedIn Profile Scraper (bebity/linkedin-profile-scraper)
  let profileData: Record<string, unknown> | null = null;

  try {
    const runRes = await fetch(
      "https://api.apify.com/v2/acts/bebity~linkedin-profile-scraper/run-sync-get-dataset-items?timeout=50",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ profileUrls: [url.trim()] }),
      }
    );

    if (runRes.ok) {
      const items = await runRes.json() as unknown[];
      if (Array.isArray(items) && items.length > 0) {
        profileData = items[0] as Record<string, unknown>;
      }
    }
  } catch {
    // Apify unavailable — fall through to AI extraction
  }

  // Fallback: ask AI to extract what it can from the URL alone (name from URL slug)
  if (!profileData) {
    const slug = (url.match(/linkedin\.com\/in\/([^/?#\s]+)/i)?.[1] ?? "").replace(/-/g, " ");
    return NextResponse.json({
      error: `Could not fetch LinkedIn profile. Make sure the profile is public, or upload your LinkedIn PDF export instead. (detected slug: "${slug}")`,
    }, { status: 422 });
  }

  const mapped = mapApifyProfile(profileData, url);

  // Upsert into cv_profiles
  const { data: cv, error: cvErr } = await supabase
    .from("cv_profiles")
    .insert({
      user_id:            user.id,
      full_name:          mapped.full_name          || null,
      current_job_title:  mapped.current_job_title  || null,
      years_of_experience: mapped.years_of_experience || null,
      technical_skills:   mapped.technical_skills,
      industries:         mapped.industries,
      seniority_level:    mapped.seniority_level     || null,
      summary:            mapped.summary             || null,
      raw_text:           mapped.raw_text            || null,
      enrichment_context: null,
    })
    .select("id, full_name, current_job_title, created_at")
    .single();

  if (cvErr || !cv) {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }

  return NextResponse.json({ id: cv.id, full_name: mapped.full_name, current_job_title: mapped.current_job_title });
}
