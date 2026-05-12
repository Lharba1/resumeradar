export interface CVProfile {
  id: string;
  full_name: string | null;
  current_job_title: string | null;
  years_of_experience: number | null;
  technical_skills: string[];
  industries: string[];
  seniority_level: string | null;
  summary: string | null;
  raw_text: string | null;
  enrichment_context: string | null;
  created_at: string;
}

export interface Job {
  id: string;
  job_title: string;
  company_name: string | null;
  location: string | null;
  country: string | null;
  job_description: string | null;
  linkedin_url: string | null;
  visa_sponsorship_likelihood: "high" | "medium" | "low" | null;
  international_friendly: boolean | null;
  relocation_support: boolean | null;
  visa_reasoning: string | null;
  ats_score: number | null;
  relocation_score: number | null;
  decision: "apply" | "maybe" | "skip" | null;
  score_reasoning: string | null;
  source: string | null;
  created_at: string;
}

export interface TrackerEntry {
  id: string;
  job_id: string;
  status: TrackerStatus;
  notes: string | null;
  applied_at: string | null;
  updated_at: string;
  job?: Job;
}

export type TrackerStatus =
  | "saved"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected";

export const TRACKER_COLUMNS: TrackerStatus[] = [
  "saved",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
];

export const SUPPORTED_COUNTRIES = ["Canada"] as const;
export const COMING_SOON_COUNTRIES = ["USA", "New Zealand", "Australia"] as const;
export const COUNTRIES = [...SUPPORTED_COUNTRIES, ...COMING_SOON_COUNTRIES] as const;
export type Country = (typeof SUPPORTED_COUNTRIES)[number];
