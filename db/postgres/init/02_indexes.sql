-- ============================================================================
-- PathFinder System — Database Indexes
-- Advanced DBMS: GIN Inverted Full-Text Search + B-Tree Foreign Key Optimizations
-- ============================================================================

-- 1. Full-Text Search Index (GIN on tsvector)
CREATE INDEX IF NOT EXISTS idx_profiles_fts ON profiles 
USING GIN (to_tsvector('english', full_name || ' ' || COALESCE(headline, '') || ' ' || COALESCE(bio, '')));

-- 2. Foreign Key & Query Performance Indexes (B-Tree)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_company_id ON experiences(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_industry_id ON companies(industry_id);
CREATE INDEX IF NOT EXISTS idx_conn_sender_status ON connection_requests(sender_id, status);
CREATE INDEX IF NOT EXISTS idx_conn_receiver_status ON connection_requests(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_activity_user_created ON activity_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON user_skills(skill_id);
