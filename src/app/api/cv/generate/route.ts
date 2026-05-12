import { NextRequest, NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { requireUser } from "@/lib/auth-guard";
import { checkAndIncrement } from "@/lib/rate-limit";
import { validateGeneratedCV } from "@/lib/cv-validator";
import { trackAISpend } from "@/lib/ai-spend";
import type { CVProfile, Job } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

// ── Types ─────────────────────────────────────────────────────

export interface CVData {
  header: {
    name: string;
    title: string;
    phone?: string;
    email?: string;
    location?: string;
    linkedin?: string;
  };
  summary: string;
  experience: {
    date: string;
    location?: string;
    title: string;
    company: string;
    bullets: string[];
  }[];
  skills: string[];
  education: {
    date: string;
    degree: string;
    institution: string;
    location?: string;
  }[];
  languages?: { name: string; level: string }[];
  certifications?: string[];
}

// ── Language detection ────────────────────────────────────────

function detectLanguageNeeds(jobs: Job[]): "english" | "french" | "both" {
  const frRe = /\bquébec\b|\bquebec\b|\bQC\b|montréal|montreal|\bfrançais\b|french.*required|required.*french|bilingual|bilingue/i;
  let hasFr = false, hasEn = false;
  for (const j of jobs) {
    const t = `${j.location ?? ""} ${j.job_description ?? ""} ${j.job_title ?? ""}`;
    if (frRe.test(t)) hasFr = true; else hasEn = true;
  }
  if (hasFr && hasEn) return "both";
  if (hasFr) return "french";
  return "english";
}

// ── System prompt ─────────────────────────────────────────────

function buildPrompt(lang: "english" | "french" | "both"): string {
  const langNote =
    lang === "english" ? "Generate ONLY the English version. Set cv_fr to null."
    : lang === "french" ? "Generate ONLY the French (Quebec Canadian) version. Set cv_en to null."
    : "Generate BOTH English and French (Quebec Canadian) versions.";

  return `You are an expert Canadian resume writer specialized in ATS-optimized CVs for the Canadian job market.

TASK: Generate a professional, realistic, ATS-optimized Canadian CV from the candidate's profile and target job descriptions.

LANGUAGE: ${langNote}
- French version must be natural Quebec/Canadian professional French — NOT a word-for-word translation.
- Do NOT mention Arabic or any non-professional language in the CV.
- Only include languages that are professionally relevant to the Canadian market (English, French, etc.).

========================
STRICT RULES
========================
- Use ONLY real information from the candidate profile. Do NOT invent experience, dates, companies, or skills.
- No personal pronouns (no "I", "me", "my") anywhere in the CV.
- No photo, no age, no gender, no marital status, no nationality.
- Use reverse chronological order for experience and education.
- Use standard Canadian job titles.
- Maximum 2 pages of content. Be concise but impactful.
- Extract keywords from the job descriptions and weave them in truthfully.
- Pull contact info (phone, email, LinkedIn, location) from the raw CV text.

========================
SUMMARY RULES
========================
- Write a 2–3 sentence professional summary.
- No personal pronouns.
- Focus on years of experience, key domain, and top impact.
- Use keywords from the target job descriptions.

========================
EXPERIENCE RULES (CRITICAL — NO EXCEPTIONS)
========================
- Every job MUST have exactly 4–6 bullet points, even for short tenures or thin profiles.
- If the raw CV only lists 1–2 duties for a role, split them into multiple focused bullets by impact area:
  safety | quality | efficiency | team management | output/volume | cost | reporting | training
- Each bullet must:
  • Start with a strong past-tense action verb (Led, Reduced, Implemented, Managed, Optimized…)
  • Be under 20 words
  • Include a measurable result whenever the profile provides numbers
- Transform responsibilities into achievements:
  BAD:  "Responsible for managing inventory"
  GOOD: "Managed 5,000+ item inventory, reducing stock errors by 20%"
- Do NOT copy job description bullets verbatim — rewrite them for the candidate.
- Do NOT invent specific numbers or percentages not present in the source profile.
- LOCATION FORMAT: Use "City, Country" only (e.g., "Casablanca, Morocco"). Never repeat the city in both company and location.

========================
OUTPUT FORMAT (STRICT JSON ONLY — no markdown, no extra text)
========================
{
  "cv_en": { ... } | null,
  "cv_fr": { ... } | null,
  "keywords_targeted": ["string (max 8)"],
  "missing_skills": ["string (max 5)"],
  "ats_tips": ["string (max 4)"]
}`;
}

// ── Route ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const limit = await checkAndIncrement(user.id, "/api/cv/generate", supabase);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Daily CV generation limit reached (10/day). Resets at midnight UTC.", resetAt: limit.resetAt },
      { status: 429, headers: { "Retry-After": Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000).toString() } }
    );
  }

  let body: { cvId: string; jobIds: string[]; forceLang?: "english" | "french" | "both" };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { cvId, jobIds, forceLang } = body;
  if (!cvId) return NextResponse.json({ error: "cvId is required" }, { status: 400 });
  if (!jobIds?.length) return NextResponse.json({ error: "Select at least one job" }, { status: 400 });
  if (jobIds.length > 10) return NextResponse.json({ error: "Maximum 10 jobs at once" }, { status: 400 });

  const { data: cvData, error: cvErr } = await supabase
    .from("cv_profiles").select("*").eq("id", cvId).eq("user_id", user.id).single();
  if (cvErr || !cvData) return NextResponse.json({ error: "CV not found — upload your CV first" }, { status: 404 });
  const cv = cvData as CVProfile;

  const { data: jobsData, error: jobsErr } = await supabase
    .from("jobs").select("*").in("id", jobIds).eq("user_id", user.id);
  if (jobsErr || !jobsData?.length) return NextResponse.json({ error: "Selected jobs not found" }, { status: 404 });
  const jobs = jobsData as Job[];

  const langMode = forceLang ?? detectLanguageNeeds(jobs);

  const enrichmentBlock = cv.enrichment_context
    ? `\n\nPROJECT & PORTFOLIO CONTEXT (extract concrete achievements, metrics, project names, and technical details from here to write stronger, evidence-backed bullets — use specifics that align with the candidate's experience timeline):\n${cv.enrichment_context.slice(0, 6000)}`
    : "";

  const candidateBlock = `CANDIDATE PROFILE:\nName: ${cv.full_name ?? ""}\nCurrent Title: ${cv.current_job_title ?? ""}\nYears of Experience: ${cv.years_of_experience ?? ""}\nSeniority: ${cv.seniority_level ?? ""}\nIndustries: ${cv.industries?.join(", ") ?? ""}\nSkills: ${cv.technical_skills?.join(", ") ?? ""}\nSummary: ${cv.summary ?? ""}\n\nFULL CV TEXT (extract contact info and all experience/education from here):\n${(cv.raw_text ?? "").slice(0, 9000)}${enrichmentBlock}`.trim();

  const jobsBlock = jobs
    .map((j, i) => `JOB ${i + 1}: ${j.job_title} | ${j.company_name ?? ""} | ${j.location ?? ""}\n${(j.job_description ?? "").slice(0, 1500)}`)
    .join("\n\n---\n\n");

  let result: { cv_en: CVData | null; cv_fr: CVData | null; keywords_targeted: string[]; missing_skills: string[]; ats_tips: string[] };

  try {
    result = await chatJSON(buildPrompt(langMode), `${candidateBlock}\n\nJOB DESCRIPTIONS:\n${jobsBlock}`, 0.25);
  } catch (err) {
    return NextResponse.json({ error: `AI error: ${err instanceof Error ? err.message : "unknown"}` }, { status: 502 });
  }

  // Phase 4: validate generated CVs
  const validationEn = result.cv_en ? validateGeneratedCV(result.cv_en, cv) : null;
  const validationFr = result.cv_fr ? validateGeneratedCV(result.cv_fr, cv) : null;

  // Retry once if English CV failed validation
  if (result.cv_en && validationEn && !validationEn.valid) {
    const retryHint = validationEn.missingRoles.length
      ? `\n\nIMPORTANT: The previous generation was missing required information. Make sure to include ALL work experience entries from the profile. Missing: ${validationEn.missingRoles.join("; ")}`
      : "";
    try {
      const retried = await chatJSON<typeof result>(buildPrompt(langMode), `${candidateBlock}${retryHint}\n\nJOB DESCRIPTIONS:\n${jobsBlock}`, 0.15);
      if (retried.cv_en) result.cv_en = retried.cv_en;
      if (retried.cv_fr) result.cv_fr = retried.cv_fr;
    } catch { /* use original result */ }
  }

  const warnings: string[] = [
    ...(validationEn?.missingRoles ?? []),
    ...(validationEn?.suspiciousBullets ?? []),
    ...(validationFr?.missingRoles ?? []),
    ...(validationFr?.suspiciousBullets ?? []),
  ];

  trackAISpend(user.id, "cv_generate");

  return NextResponse.json({
    cv_en: result.cv_en ?? null,
    cv_fr: result.cv_fr ?? null,
    keywords_targeted: result.keywords_targeted ?? [],
    missing_skills: result.missing_skills ?? [],
    ats_tips: result.ats_tips ?? [],
    required_language: langMode,
    validation: { valid: warnings.length === 0, warnings },
    meta: { candidate: cv.full_name, jobs_count: jobs.length, job_titles: jobs.map((j) => j.job_title) },
  });
}
