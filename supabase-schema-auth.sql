-- tseboIQ Extended Database Schema with Authentication and Consent
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (for authentication and profiles)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'apple', 'azure', 'mock')),
  role TEXT NOT NULL CHECK (role IN ('job_seeker', 'employer', 'admin')) DEFAULT 'job_seeker',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Consents Table (POPIA compliance)
CREATE TABLE IF NOT EXISTS consents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL DEFAULT 'privacy_policy',
  consent_text TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  withdrawn_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, consent_type, timestamp)
);

-- Candidates Table (updated with user_id reference)
CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  skills TEXT[] NOT NULL,
  experience INTEGER NOT NULL CHECK (experience >= 0),
  education TEXT,
  cv_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employers Table (updated with user_id reference)
CREATE TABLE IF NOT EXISTS employers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs Table (unchanged)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[] NOT NULL,
  min_experience INTEGER NOT NULL CHECK (min_experience >= 0),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_consents_user ON consents(user_id);
CREATE INDEX IF NOT EXISTS idx_consents_type ON consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_candidates_user ON candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_skills ON candidates USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_employers_user ON employers(user_id);
CREATE INDEX IF NOT EXISTS idx_employers_email ON employers(contact_email);
CREATE INDEX IF NOT EXISTS idx_jobs_employer ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_skills ON jobs USING GIN(required_skills);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- RLS Policies for consents
CREATE POLICY "Users can view their own consents" 
  ON consents FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consents" 
  ON consents FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for candidates
CREATE POLICY "Candidates are viewable by everyone" 
  ON candidates FOR SELECT 
  USING (true);

CREATE POLICY "Users can create candidate profiles" 
  ON candidates FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own candidate profile" 
  ON candidates FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for employers
CREATE POLICY "Employers are viewable by everyone" 
  ON employers FOR SELECT 
  USING (true);

CREATE POLICY "Users can create employer profiles" 
  ON employers FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own employer profile" 
  ON employers FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for jobs
CREATE POLICY "Jobs are viewable by everyone" 
  ON jobs FOR SELECT 
  USING (true);

CREATE POLICY "Employers can create jobs" 
  ON jobs FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Employers can update their own jobs" 
  ON jobs FOR UPDATE 
  USING (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at 
  BEFORE UPDATE ON candidates 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employers_updated_at 
  BEFORE UPDATE ON employers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at 
  BEFORE UPDATE ON jobs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE users IS 'User accounts with OAuth authentication';
COMMENT ON TABLE consents IS 'POPIA consent records with timestamps';
COMMENT ON TABLE candidates IS 'Job seeker profiles with skills and experience';
COMMENT ON TABLE employers IS 'Company profiles for job posting';
COMMENT ON TABLE jobs IS 'Job postings with required skills and experience';
