-- tseboIQ Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Candidates Table
CREATE TABLE candidates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Employers Table
CREATE TABLE employers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs Table
CREATE TABLE jobs (
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

-- Indexes for better query performance
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_skills ON candidates USING GIN(skills);
CREATE INDEX idx_employers_email ON employers(contact_email);
CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_jobs_skills ON jobs USING GIN(required_skills);
CREATE INDEX idx_jobs_status ON jobs(status);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Public read access for candidates (for matching)
CREATE POLICY "Candidates are viewable by everyone" 
  ON candidates FOR SELECT 
  USING (true);

-- Candidates can insert their own profile
CREATE POLICY "Anyone can create a candidate profile" 
  ON candidates FOR INSERT 
  WITH CHECK (true);

-- Employers can view all jobs
CREATE POLICY "Jobs are viewable by everyone" 
  ON jobs FOR SELECT 
  USING (true);

-- Employers can create jobs
CREATE POLICY "Anyone can create jobs" 
  ON jobs FOR INSERT 
  WITH CHECK (true);

-- Employers are viewable by everyone
CREATE POLICY "Employers are viewable by everyone" 
  ON employers FOR SELECT 
  USING (true);

-- Anyone can create employer profile
CREATE POLICY "Anyone can create employer profile" 
  ON employers FOR INSERT 
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
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

-- Insert sample data (optional - for testing)
INSERT INTO candidates (name, email, phone, skills, experience, education) VALUES
  ('Thabo Molefe', 'thabo.molefe@example.com', '+27 82 123 4567', 
   ARRAY['JavaScript', 'React', 'Node.js', 'TailwindCSS', 'MongoDB'], 
   5, 'BSc Computer Science - University of Cape Town'),
  ('Lerato Nkosi', 'lerato.nkosi@example.com', '+27 83 234 5678', 
   ARRAY['Python', 'Django', 'PostgreSQL', 'React', 'AWS'], 
   4, 'BSc Information Technology - University of Pretoria');

-- Comments for documentation
COMMENT ON TABLE candidates IS 'Job seeker profiles with skills and experience';
COMMENT ON TABLE employers IS 'Company profiles for job posting';
COMMENT ON TABLE jobs IS 'Job postings with required skills and experience';
