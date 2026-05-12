-- Migration 001: Add user_id to all tables for per-user data isolation
--
-- BEFORE RUNNING: truncate existing dev data to avoid null user_id rows.
-- Run this in the Supabase SQL editor first:
--   TRUNCATE cv_profiles, jobs, tracker CASCADE;
--
-- Then run this migration.

ALTER TABLE cv_profiles ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE jobs        ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE tracker     ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_cv_profiles_user_id ON cv_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id        ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_tracker_user_id     ON tracker(user_id);
