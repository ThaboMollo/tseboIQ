# tseboIQ - Smarter Hiring, Powered by Insight

![tseboIQ Banner](https://img.shields.io/badge/tseboIQ-AI%20Recruitment-2F4858?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)

An AI-powered recruitment platform with a clean, guided onboarding experience. tseboIQ connects job seekers with employers through intelligent CV parsing and AI-powered matching, delivering the top 2 most relevant matches for each user.

## 🎯 New User Journey

tseboIQ now features a completely rebuilt user experience with a streamlined, intent-driven flow:

1. **Role Selection** - Users choose their path: "Looking for a Job" or "Posting a Job"
2. **Smart Registration** - CV parsing for candidates, job posting for employers
3. **Unified Authentication** - Seamless signup/login experience
4. **Role-Based Dashboards** - Personalized views with AI-powered top 2 matches

📖 **See the complete flow:** `docs/NEW_USER_FLOW_GUIDE.md`

## 🎯 Features

### For Job Seekers
- **Easy Onboarding**: Multi-step profile creation with personal and professional details
- **AI-Powered CV Parsing**: Upload your CV and let AI extract your information automatically
- **Smart Fallback**: Automatic fallback to local parser if AI parsing fails
- **Skills Showcase**: Tag-based skill input for better matching
- **Instant Visibility**: Profile becomes immediately searchable by employers

### For Employers
- **Smart Job Posting**: Create detailed job specifications with required skills
- **AI-Powered Matching**: Automatic candidate shortlisting using our matching algorithm
- **Top 2 Selection**: Get the best 2 candidates instantly ranked by match score
- **Direct Contact**: Email candidates and download CVs directly from the dashboard
- **Match Insights**: See match scores, quality ratings, and matched skills

### Matching Algorithm
Our MVP uses a weighted scoring system:
- **70% Skills Match**: Keyword-based matching between required and candidate skills
- **30% Experience Match**: Years of experience vs. minimum requirements
- **Smart Ranking**: Candidates sorted by overall match score (0-100%)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and Yarn
- Modern web browser
- **Supabase account** (for authentication)
- **Backend API** (for profile management)

### Installation

1. **Clone or navigate to the project directory**
```bash
cd tseboIQ
```

2. **Install dependencies**
```bash
yarn install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_AFFINDA_API_KEY=your_affinda_api_key
```

**⚠️ IMPORTANT**: The application now requires actual backend configuration. Mock data has been removed.

See `docs/PRODUCTION_SETUP.md` for detailed setup instructions.

4. **Start the development server**
```bash
yarn dev
```

5. **Open your browser**
The app will automatically open at `http://localhost:5187`

## 📁 Project Structure

```
tseboIQ/
├── src/
│   ├── pages/               # Main page components
│   │   ├── RoleSelection.jsx        # Entry screen
│   │   ├── CandidateForm.jsx        # Candidate registration
│   │   ├── EmployerForm.jsx         # Employer registration
│   │   ├── AuthModal.jsx            # Login/Signup
│   │   ├── CandidateDashboard.jsx   # Candidate dashboard
│   │   ├── EmployerDashboard.jsx    # Employer dashboard
│   │   ├── PrivacyPolicy.jsx
│   │   └── NotFound.jsx
│   ├── components/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── AuthProvider.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── [other components]
│   ├── services/            # API and external services
│   │   ├── api.js           # Backend API service layer
│   │   ├── affindaParser.js # Affinda CV parsing
│   │   └── cvParser.js      # Local fallback parser
│   ├── lib/                 # External service configs
│   │   ├── supabase.js      # Supabase client
│   │   └── auth.js
│   ├── hooks/               # Custom React hooks
│   │   └── useFormHandler.js
│   ├── utils/               # Utility functions
│   │   └── cn.js
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── docs/                    # Documentation
│   ├── NEW_USER_FLOW_GUIDE.md
│   ├── API_SERVICE_GUIDE.md
│   ├── AFFINDA_INTEGRATION_GUIDE.md
│   └── [other guides]
├── public/                  # Static assets
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Design System

### Brand Colors
- **Primary**: `#2F4858` - Deep blue-gray for headers and primary actions
- **Secondary**: `#00A896` - Teal for accents and highlights
- **Accent**: `#02C39A` - Bright teal for success states
- **Light**: `#F0F3F5` - Soft gray for backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

## 🔧 Tech Stack

### Frontend
- **React 18.2** - UI library
- **Vite 5.0** - Build tool and dev server
- **React Router 6** - Client-side routing
- **TailwindCSS 3.3** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend & APIs
- **Supabase** - PostgreSQL database and authentication
- **.NET Web API** - Profile and CV management
- **Affinda API** - AI-powered CV parsing with automatic fallback
- **Axios** - HTTP client for API calls
- **PDF.js** - PDF parsing (local fallback)
- **Mammoth** - DOCX parsing (local fallback)
- **SQL Schema** - Included in documentation

## 🤖 AI-Powered CV Parsing

tseboIQ integrates with **Affinda Resume Parser API** to provide intelligent CV parsing with automatic fallback to local parsing.

### Features
- ✅ **AI Extraction**: Automatically extracts personal info, skills, experience, education, and certifications
- ✅ **Multi-Format Support**: Handles PDF and DOCX files up to 10MB
- ✅ **Smart Fallback**: Automatically falls back to local parser if Affinda fails or returns low confidence
- ✅ **Confidence Scoring**: Calculates confidence scores (0-100%) for parsed data
- ✅ **Real-time Progress**: Shows upload and parsing progress with status updates
- ✅ **Data Validation**: Validates extracted data and provides warnings for missing fields

### How It Works
```
User uploads CV → Affinda API parses → Confidence check → 
If high confidence → Use Affinda result
If low confidence → Fall back to local parser → 
Return parsed data with source indicator
```

### Documentation
- **Quick Start**: See `docs/AFFINDA_QUICK_START.md`
- **Full Guide**: See `docs/AFFINDA_INTEGRATION_GUIDE.md`
- **Troubleshooting**: See `docs/CV_PARSER_TROUBLESHOOTING.md`

## 📊 Data Flow

### Candidate Flow
1. User lands on **Role Selection** page (`/`)
2. Clicks "Looking for a Job"
3. Redirected to **Candidate Registration** (`/register/candidate`)
4. **Step 1:** Upload CV (PDF/DOCX) or skip
5. **Step 2:** AI parses CV using Affinda API
   - Automatic fallback to local parser if needed
   - Confidence scoring and validation
6. **Step 3:** Review and edit auto-filled profile
   - Personal info, skills, summary
   - All fields editable
7. Redirected to **Authentication** (`/auth`)
8. Sign up with email and password
9. Profile and candidate data saved to Supabase
10. Redirected to **Candidate Dashboard** (`/dashboard/candidate`)
11. View profile and **Top 2 Job Matches** with AI-powered recommendations

### Employer Flow
1. User lands on **Role Selection** page (`/`)
2. Clicks "Posting a Job"
3. Redirected to **Employer Registration** (`/register/employer`)
4. Fill job posting form:
   - Job details (title, company, location, type)
   - Requirements (experience level, skills)
   - Description, responsibilities, benefits
5. Redirected to **Authentication** (`/auth`)
6. Sign up with email and password
7. Profile and job data saved to Supabase
8. Redirected to **Employer Dashboard** (`/dashboard/employer`)
9. View job listings and **Top 2 Candidate Matches** with AI-powered recommendations

## 🔧 Production Setup

### Required Configuration

1. **Supabase Setup**
   - Create project at [supabase.com](https://supabase.com)
   - Run database migrations
   - Configure authentication providers
   - Set up Row Level Security (RLS)

2. **Backend API Setup**
   - Implement .NET Web API endpoints
   - Configure CORS for your domain
   - Set up file storage (Azure Blob/AWS S3)
   - Deploy backend API

3. **Environment Variables**
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Complete Setup Guide

See **`docs/PRODUCTION_SETUP.md`** for:
- Detailed configuration steps
- Database schema and migrations
- API endpoint specifications
- Security best practices
- Troubleshooting guide

### Backend Reference

See **`docs/ProfileController.cs`** for:
- Complete .NET controller implementation
- All required endpoints
- DTOs and interfaces
- Error handling examples

## 🚀 Deployment

### Build for Production
```bash
yarn build
```

### Preview Production Build
```bash
yarn preview
```

### Deploy to Netlify/Vercel
1. Push code to GitHub
2. Connect repository to Netlify or Vercel
3. Set build command: `yarn build`
4. Set publish directory: `dist`
5. Add environment variables (Supabase credentials)

## 📈 Future Enhancements

### Phase 2
- [x] User authentication (job seeker and employer accounts)
- [x] AI-powered CV parsing with Affinda API
- [x] Automatic fallback to local parser
- [ ] Email notifications for matches
- [ ] Advanced search and filtering
- [ ] Candidate profile pages
- [ ] Application tracking system

### Phase 3
- [ ] GPT-4 integration for enhanced parsing
- [ ] Machine learning match scoring
- [ ] Video interview integration
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

### Phase 4
- [ ] Multi-language support
- [ ] Payment integration for premium features
- [ ] API for third-party integrations
- [ ] Advanced reporting and insights

## 🧑‍💻 Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use TailwindCSS utility classes
- Keep components modular and reusable
- Add comments for complex logic

## 🐛 Troubleshooting

### Port already in use
If port 3000 is occupied, Vite will automatically use the next available port.

### Dependencies not installing
Try clearing Yarn cache:
```bash
yarn cache clean
yarn install
```

### Build errors
Ensure you're using Node.js 16 or higher:
```bash
node --version
```

## 📝 License

This project is built as an MVP demonstration. For production use, please add appropriate licensing.

## 🤝 Contributing

This is an MVP project. For contributions or suggestions, please reach out to the development team.

## 📧 Support

For questions or support, contact: support@tseboiq.co.za (placeholder)

---

**Built with ❤️ for South African businesses**

*tseboIQ - Smarter Hiring, Powered by Insight*
