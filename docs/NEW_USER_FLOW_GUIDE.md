# tseboIQ - New User Flow Guide

## Overview
This document describes the rebuilt user journey for tseboIQ, an AI-powered recruitment platform that provides a clean, guided onboarding experience.

## User Journey Flow

### 1. Entry Point - Role Selection (`/`)
**Component:** `RoleSelection.jsx`

Users are greeted with a simple choice:
- **Looking for a Job** → Navigate to `/register/candidate`
- **Posting a Job** → Navigate to `/register/employer`

The selection is stored in `localStorage` as `userRole` for later use.

**Features:**
- Beautiful gradient background
- Two large, interactive cards with hover effects
- Clear call-to-action buttons
- Link to sign in for existing users

---

### 2A. Candidate Registration Flow (`/register/candidate`)
**Component:** `CandidateForm.jsx`

#### Step 1: Upload CV
- Users can upload PDF or DOCX files
- File validation (type and size)
- Option to skip and fill manually

#### Step 2: Parse CV with Affinda API
- Automatic CV parsing using Affinda Resume Parser
- Real-time progress indicator
- Fallback to local parser if Affinda fails
- Confidence scoring for parsed data

#### Step 3: Review & Edit Profile
Auto-filled form with:
- **Personal Info:** First name, last name, email, phone, location
- **Professional Summary:** Brief career overview
- **Skills:** Comma-separated list with visual tags
- All fields are editable

#### Step 4: Continue to Authentication
- Form data stored in `localStorage` as `candidateData`
- Redirect to `/auth` for signup/login

**API Integration:**
- Uses `parseCV()` from `src/services/affindaParser.js`
- Affinda API Key: `aff_6dc4b8fe9d8e37f700cd93992be45489b66931b1`
- Automatic fallback to local parser

---

### 2B. Employer Registration Flow (`/register/employer`)
**Component:** `EmployerForm.jsx`

Single-step form with:
- **Job Details:** Title, company name, location, job type
- **Requirements:** Experience level, salary range
- **Description:** Job overview, responsibilities, requirements
- **Skills:** Required skills (comma-separated)
- **Benefits:** Optional perks and benefits

**Features:**
- Clean form layout with icons
- Dropdown selectors for job type and experience level
- Visual skill tags
- Form data stored in `localStorage` as `jobData`
- Redirect to `/auth` for signup/login

---

### 3. Authentication (`/auth`)
**Component:** `AuthModal.jsx`

Shared authentication modal with:
- **Login Mode:** Email and password
- **Signup Mode:** Full name, email, and password
- Toggle between login and signup
- Password visibility toggle
- Error handling and validation

**Flow:**
1. User signs up or logs in
2. Profile created in Supabase `profiles` table
3. If candidate: data from `candidateData` saved to `candidates` table
4. If employer: data from `jobData` saved to `jobs` table
5. Redirect based on role:
   - Candidate → `/dashboard/candidate`
   - Employer → `/dashboard/employer`

**Supabase Integration:**
- Uses `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()`
- Stores user role in profile metadata
- Creates related records in candidates/jobs tables

---

### 4A. Candidate Dashboard (`/dashboard/candidate`)
**Component:** `CandidateDashboard.jsx`

**Left Panel - Profile:**
- Avatar with initials
- Personal information (email, phone, location)
- Professional summary
- Skills with visual tags
- Edit button (future feature)

**Right Panel - Top 2 Job Matches:**
- AI-powered job recommendations from real Supabase data
- Match score calculated using weighted algorithm (70% skills, 30% experience)
- Job details (title, company, location, salary)
- Required skills
- "View Details & Apply" button

**Features:**
- Real-time data loading from Supabase
- Fallback to localStorage if DB data not available
- Intelligent matching algorithm with skill and experience weighting
- Automatic sorting by match score
- Logout functionality

---

### 4B. Employer Dashboard (`/dashboard/employer`)
**Component:** `EmployerDashboard.jsx`

**Left Panel - Job Listings:**
- List of posted jobs
- Job count badge
- Click to select job for viewing matches
- "Post New Job" button

**Right Panel - Top 2 Candidate Matches:**
- AI-powered candidate recommendations from real Supabase data
- Match score calculated using weighted algorithm (70% skills, 30% experience)
- Candidate details (name, experience, contact info)
- Skills with visual tags
- Professional summary
- "View Full Profile & Contact" button

**Features:**
- Real-time data loading from Supabase
- Fallback to localStorage if DB data not available
- Intelligent matching algorithm with skill and experience weighting
- Automatic sorting by match score
- Post new job functionality
- Logout functionality

---

## Component Structure

```
src/
├── pages/
│   ├── RoleSelection.jsx          # Entry screen
│   ├── CandidateForm.jsx          # Candidate registration
│   ├── EmployerForm.jsx           # Employer registration
│   ├── AuthModal.jsx              # Login/Signup
│   ├── CandidateDashboard.jsx     # Candidate dashboard
│   └── EmployerDashboard.jsx      # Employer dashboard
├── services/
│   ├── affindaParser.js           # Affinda CV parsing
│   ├── cvParser.js                # Local fallback parser
│   └── api.js                     # Backend API service layer
└── lib/
    └── supabase.js                # Supabase client
```

---

## Backend API Endpoints

The following endpoints need to be implemented in the .NET Web API:

### CV Parsing
- `POST /api/cv/parse` - Parse CV file (uses Affinda)

### Candidate Management
- `POST /api/candidate` - Create candidate profile
- `GET /api/candidate/:id` - Get candidate profile
- `PUT /api/candidate/:id` - Update candidate profile

### Job Management
- `POST /api/job` - Create job posting
- `GET /api/job/:id` - Get job posting
- `PUT /api/job/:id` - Update job posting
- `GET /api/job/employer/:employerId` - Get all jobs for employer

### Matching
- `GET /api/match/top2/:id?type=candidate` - Get top 2 job matches for candidate
- `GET /api/match/top2/:id?type=job` - Get top 2 candidate matches for job
- `GET /api/match/:id?type=candidate` - Get all matches for candidate/job

---

## Environment Configuration

Required environment variables in `.env`:

```env
# Backend API
VITE_API_URL=http://localhost:5000/api

# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Affinda Resume Parser
VITE_AFFINDA_API_KEY=aff_6dc4b8fe9d8e37f700cd93992be45489b66931b1
VITE_AFFINDA_WORKSPACE=AUjjpzAV
```

---

## Database Schema

### profiles
```sql
- id (uuid, primary key)
- email (text)
- full_name (text)
- role (text) -- 'candidate' or 'employer'
- created_at (timestamp)
```

### candidates
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → profiles.id)
- firstName (text)
- lastName (text)
- email (text)
- phone (text)
- location (text)
- summary (text)
- skills (text[])
- experience (jsonb)
- education (jsonb)
- certifications (jsonb)
- languages (text[])
- created_at (timestamp)
```

### jobs
```sql
- id (uuid, primary key)
- employer_id (uuid, foreign key → profiles.id)
- jobTitle (text)
- companyName (text)
- location (text)
- jobType (text)
- experienceLevel (text)
- salaryRange (text)
- description (text)
- responsibilities (text)
- requirements (text)
- skills (text[])
- benefits (text)
- created_at (timestamp)
```

---

## Key Features

### 1. Intelligent CV Parsing
- **Affinda API Integration:** High-accuracy AI parsing
- **Automatic Fallback:** Local parser if Affinda fails
- **Confidence Scoring:** Quality assessment of parsed data
- **Data Validation:** Ensures critical fields are extracted

### 2. Clean User Experience
- **Progressive Disclosure:** Step-by-step guided flow
- **Visual Feedback:** Loading states, progress indicators
- **Error Handling:** Graceful fallbacks and clear error messages
- **Responsive Design:** Works on all device sizes

### 3. Role-Based Routing
- **Protected Routes:** Dashboard access requires authentication
- **Role Detection:** Automatic redirect based on user role
- **Persistent State:** LocalStorage for temporary data storage

### 4. AI-Powered Matching
- **Top 2 Recommendations:** Focused, high-quality matches
- **Match Scoring:** Percentage-based compatibility
- **Skill Matching:** Visual skill comparison
- **Real-time Updates:** Dynamic match refresh

---

## Styling

- **Framework:** Tailwind CSS
- **Icons:** Lucide React
- **Color Scheme:**
  - Candidate: Blue (`blue-600`, `blue-100`)
  - Employer: Purple (`purple-600`, `purple-100`)
- **Gradients:** Soft, professional backgrounds
- **Animations:** Smooth transitions and hover effects

---

## Next Steps

1. **Backend Implementation:**
   - Implement all API endpoints
   - Set up matching algorithm
   - Configure Affinda API integration

2. **Database Setup:**
   - Create Supabase tables
   - Set up Row Level Security (RLS)
   - Configure authentication policies

3. **Enhanced Features:**
   - Profile editing functionality
   - Application tracking
   - Messaging system
   - Advanced filtering and search

4. **Testing:**
   - Unit tests for components
   - Integration tests for API
   - E2E tests for user flows

---

## Running the Application

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Support

For questions or issues, please refer to:
- `AFFINDA_INTEGRATION_GUIDE.md` - CV parsing details
- `CV_PARSER_GUIDE.md` - Local parser documentation
- `README.md` - General project information
