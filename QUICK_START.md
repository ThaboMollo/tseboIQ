# tseboIQ Quick Start Guide

Get up and running with tseboIQ in 5 minutes!

## 🚀 Prerequisites

- Node.js 16+ and Yarn installed
- Supabase account (free tier works)
- Modern web browser

## 📦 Installation

```bash
# Navigate to project
cd tseboIQ

# Install dependencies
yarn install

# Copy environment template
cp .env.example .env
```

## 🔑 Configure Environment

Edit `.env` file:

```env
# Supabase (required for auth)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Affinda CV Parser (already configured)
VITE_AFFINDA_API_KEY=aff_6dc4b8fe9d8e37f700cd93992be45489b66931b1
VITE_AFFINDA_WORKSPACE=AUjjpzAV

# Backend API (optional for now)
VITE_API_URL=http://localhost:5000/api
```

### Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (free)
3. Go to Settings → API
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 🗄️ Set Up Database

In your Supabase project, run this SQL:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  role TEXT CHECK (role IN ('candidate', 'employer')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create candidates table
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  "firstName" TEXT,
  "lastName" TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  summary TEXT,
  skills TEXT[],
  experience JSONB,
  education JSONB,
  certifications JSONB,
  languages TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES profiles(id),
  "jobTitle" TEXT,
  "companyName" TEXT,
  location TEXT,
  "jobType" TEXT,
  "experienceLevel" TEXT,
  "salaryRange" TEXT,
  description TEXT,
  responsibilities TEXT,
  requirements TEXT,
  skills TEXT[],
  benefits TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Candidates can view own data"
  ON candidates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Employers can view all candidates"
  ON candidates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'employer'
    )
  );

CREATE POLICY "Jobs are viewable by all"
  ON jobs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Employers can manage own jobs"
  ON jobs FOR ALL
  USING (auth.uid() = employer_id);
```

## ▶️ Start Development Server

```bash
yarn dev
```

Open browser at: **http://localhost:5187**

## 🎯 Test the Flow

### As a Candidate
1. Click "Looking for a Job"
2. Upload a CV (PDF/DOCX) or skip
3. Review auto-filled profile
4. Click "Continue to Sign Up"
5. Create account (email + password)
6. View your dashboard with top 2 job matches

### As an Employer
1. Click "Posting a Job"
2. Fill job posting form
3. Click "Continue to Sign Up"
4. Create account (email + password)
5. View your dashboard with top 2 candidate matches

## 📱 What You'll See

### Entry Screen
- Beautiful gradient background
- Two large cards for role selection
- Clean, modern UI

### Candidate Flow
- **Step 1:** CV upload with drag & drop
- **Step 2:** AI parsing progress (Affinda API)
- **Step 3:** Editable profile form with visual skill tags
- **Dashboard:** Profile + Top 2 job matches (mock data)

### Employer Flow
- **Step 1:** Comprehensive job posting form
- **Dashboard:** Job listings + Top 2 candidate matches (mock data)

## 🔧 Troubleshooting

### "Supabase client error"
- Check your `.env` file has correct Supabase credentials
- Ensure database tables are created

### "CV parsing failed"
- Affinda API key is pre-configured and should work
- App will automatically fall back to local parser
- Check file is PDF or DOCX under 10MB

### "Port 5187 already in use"
- Vite will automatically use next available port
- Check terminal output for actual port

### "Module not found"
- Run `yarn install` again
- Clear cache: `yarn cache clean`

## 📚 Next Steps

### For Development
1. **Read the docs:**
   - `docs/NEW_USER_FLOW_GUIDE.md` - Complete flow
   - `docs/API_SERVICE_GUIDE.md` - Backend API
   - `REBUILD_SUMMARY.md` - What was built

2. **Set up backend:**
   - Implement .NET Web API endpoints
   - See `docs/API_SERVICE_GUIDE.md` for specs

3. **Implement matching:**
   - Build AI matching algorithm
   - Return top 2 results via API

### For Production
1. **Deploy frontend:**
   - Build: `yarn build`
   - Deploy to Netlify/Vercel
   - Add environment variables

2. **Deploy backend:**
   - Host .NET API
   - Configure CORS
   - Set up file storage

3. **Configure domain:**
   - Point domain to frontend
   - Update Supabase allowed URLs
   - Update CORS settings

## 🆘 Need Help?

- **Documentation:** Check `docs/` folder
- **Code:** All components in `src/pages/`
- **API:** See `src/services/api.js`

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Dev server running
- [ ] Can navigate between pages
- [ ] Can upload CV (candidate flow)
- [ ] Can create job (employer flow)
- [ ] Can sign up/login
- [ ] Can view dashboard

---

**You're all set! 🎉**

Start exploring the app and building amazing features!
