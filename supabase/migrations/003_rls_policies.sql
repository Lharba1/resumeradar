-- Migration 003: Row-Level Security — users can only access their own data

-- cv_profiles
ALTER TABLE cv_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cv_profiles: user owns rows"
  ON cv_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs: user owns rows"
  ON jobs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- tracker
ALTER TABLE tracker ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tracker: user owns rows"
  ON tracker FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- usage_quotas
ALTER TABLE usage_quotas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usage_quotas: user owns rows"
  ON usage_quotas FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
