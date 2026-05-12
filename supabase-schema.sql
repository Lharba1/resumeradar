-- Run this in your Supabase SQL editor

-- CV Profiles (one per session for MVP)
create table if not exists cv_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  current_job_title text,
  years_of_experience integer,
  technical_skills text[],
  industries text[],
  seniority_level text,
  summary text,
  raw_text text,
  created_at timestamptz default now()
);

-- Jobs fetched from LinkedIn via Apify
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  job_title text not null,
  company_name text,
  location text,
  country text,
  job_description text,
  linkedin_url text,
  -- AI visa classification
  visa_sponsorship_likelihood text check (visa_sponsorship_likelihood in ('high','medium','low')),
  international_friendly boolean,
  relocation_support boolean,
  visa_reasoning text,
  -- AI scoring (needs CV)
  ats_score integer,
  relocation_score integer,
  decision text check (decision in ('apply','maybe','skip')),
  score_reasoning text,
  created_at timestamptz default now()
);

-- Application tracker
create table if not exists tracker (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  status text not null default 'saved'
    check (status in ('saved','applied','screening','interview','offer','rejected')),
  notes text,
  applied_at timestamptz,
  updated_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_jobs_country on jobs(country);
create index if not exists idx_jobs_visa on jobs(visa_sponsorship_likelihood);
create index if not exists idx_tracker_status on tracker(status);
