# CV Parser & Candidate Profile System

## Overview
The CV Parser and Candidate Profile system allows job seekers to upload their CVs (PDF or DOCX format), automatically extract key information, and manage their professional profiles. This feature is fully integrated with the authentication system and supports both mock mode (for development) and production API integration.

## Features

### ✅ Implemented Features
1. **File Upload Support**
   - Drag-and-drop interface
   - Click-to-browse file selection
   - Accepts `.pdf` and `.docx` formats
   - File size validation (max 10MB)
   - Real-time file validation

2. **Auto-Parsing Logic**
   - Extracts structured data from CVs:
     - Full Name
     - Email Address
     - Phone Number
     - Skills (array)
     - Years of Experience
     - Work Experience (position, company, dates, description)
     - Education (institution, degree, field of study, dates)
     - Certifications (optional)
   - PDF parsing using `pdfjs-dist`
   - DOCX parsing using `mammoth`
   - Intelligent text extraction with regex patterns

3. **Editable Profile Form**
   - Pre-filled with extracted CV data
   - Fully editable fields
   - Dynamic sections for experience, education, and certifications
   - Skills and languages tag input
   - Form validation
   - Real-time error feedback

4. **Authentication Integration**
   - Protected routes (requires login)
   - User-specific profile storage
   - Session persistence
   - Secure data access

5. **Mock Mode Support**
   - Works without backend API
   - LocalStorage-based persistence
   - Perfect for development and testing

## File Structure

```
src/
├── components/
│   ├── CVUpload.jsx           # Drag-and-drop CV upload component
│   ├── ProfileForm.jsx        # Editable profile form with all sections
│   └── TagInput.jsx           # Reusable tag input for skills/languages
├── pages/
│   └── CandidateProfile.jsx   # Main profile page (upload → review → edit)
├── services/
│   ├── cvParser.js            # CV parsing logic (PDF & DOCX)
│   └── profileApi.js          # API integration layer
├── types/
│   └── candidateProfile.js    # Type definitions and JSDoc comments
└── docs/
    └── CV_PARSER_GUIDE.md     # This file
```

## Usage Guide

### For Job Seekers

1. **Access Profile Page**
   - Navigate to `/profile` (requires login)
   - First-time users see the upload screen
   - Returning users see their existing profile

2. **Upload CV**
   - Drag and drop your CV or click to browse
   - Supported formats: PDF, DOCX (max 10MB)
   - Click "Parse CV" to extract information

3. **Review Extracted Data**
   - Verify the automatically extracted information
   - Check name, email, phone, skills, experience, and education
   - Click "Continue to Edit Profile" to proceed

4. **Edit Profile**
   - Update any incorrect or missing information
   - Add/remove experience entries
   - Add/remove education entries
   - Add/remove certifications
   - Update skills and languages
   - Click "Save Profile" to persist changes

5. **Update Profile Anytime**
   - Return to `/profile` to view or edit your profile
   - Changes are saved immediately

### For Developers

#### Component Usage

**CVUpload Component**
```jsx
import CVUpload from '../components/CVUpload'

<CVUpload
  onFileSelect={(file) => handleFileSelect(file)}
  disabled={loading}
/>
```

**ProfileForm Component**
```jsx
import ProfileForm from '../components/ProfileForm'

<ProfileForm
  initialData={profileData}
  onSave={(data) => handleSave(data)}
  loading={loading}
/>
```

#### API Integration

**Parse CV**
```javascript
import { parseCV } from '../services/cvParser'

const parsedData = await parseCV(file)
// Returns: { fullName, email, phone, skills, experience, education, ... }
```

**Save Profile**
```javascript
import { saveProfile } from '../services/profileApi'

const profile = await saveProfile({
  userId: user.id,
  fullName: 'John Doe',
  email: 'john@example.com',
  skills: ['React', 'Node.js'],
  // ... other fields
})
```

**Get Profile**
```javascript
import { getProfile } from '../services/profileApi'

const profile = await getProfile(userId)
```

**Update Profile**
```javascript
import { updateProfile } from '../services/profileApi'

const updated = await updateProfile(profileId, {
  fullName: 'Jane Doe',
  // ... fields to update
})
```

## Backend API Specification

### Endpoints Required

#### 1. Upload and Parse CV
```
POST /api/profile/upload
Content-Type: multipart/form-data

Body:
- file: File (PDF or DOCX)
- userId: string

Response:
{
  "success": true,
  "data": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+27 12 345 6789",
    "skills": ["React", "C#", "SQL"],
    "experienceYears": 5,
    "experience": [...],
    "education": [...],
    "certifications": [...]
  },
  "fileUrl": "https://storage.example.com/cvs/user123/cv.pdf"
}
```

#### 2. Create Profile
```
POST /api/profile
Content-Type: application/json

Body:
{
  "userId": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedinUrl": "string",
  "portfolioUrl": "string",
  "summary": "string",
  "skills": ["string"],
  "experienceYears": number,
  "experience": [...],
  "education": [...],
  "certifications": [...],
  "languages": ["string"],
  "cvFileUrl": "string",
  "cvFileName": "string"
}

Response:
{
  "id": "profile-123",
  "userId": "user-123",
  ...all profile fields,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### 3. Get Profile by User ID
```
GET /api/profile/user/:userId

Response:
{
  "id": "profile-123",
  "userId": "user-123",
  ...all profile fields
}

404 if not found
```

#### 4. Update Profile
```
PUT /api/profile/:profileId
Content-Type: application/json

Body: (same as create, all fields optional)

Response: (same as create)
```

#### 5. Delete Profile
```
DELETE /api/profile/:profileId

Response:
{
  "success": true,
  "message": "Profile deleted successfully"
}
```

### Database Schema

**Candidates Table**
```sql
CREATE TABLE candidates (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    summary TEXT,
    skills JSON, -- Array of strings
    experience_years INT,
    experience JSON, -- Array of experience objects
    education JSON, -- Array of education objects
    certifications JSON, -- Array of certification objects
    languages JSON, -- Array of strings
    cv_file_url VARCHAR(500),
    cv_file_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_candidates_user_id ON candidates(user_id);
CREATE INDEX idx_candidates_email ON candidates(email);
```

## CV Parsing Algorithm

### Extraction Patterns

**Email**
```javascript
/[\w.-]+@[\w.-]+\.\w+/gi
```

**Phone (South African)**
```javascript
/(?:\+27|0)[\s-]?(?:\d{2}[\s-]?\d{3}[\s-]?\d{4}|\d{3}[\s-]?\d{3}[\s-]?\d{3})/g
```

**Name**
- Looks for 2-4 capitalized words in first 5 lines
- Heuristic approach based on common CV formats

**Skills**
- Matches against predefined skill database
- Case-insensitive matching
- Includes technical and soft skills

**Experience Years**
```javascript
/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/gi
```

**Education**
- Matches degree patterns (Bachelor, Master, PhD, etc.)
- Identifies South African institutions
- Extracts nearby context for institution names

**Work Experience**
- Matches job title patterns
- Extracts company names from context
- Captures job descriptions

### Limitations & Improvements

**Current Limitations:**
1. Name extraction is heuristic-based (may fail on unconventional formats)
2. Skills limited to predefined database
3. Date extraction not fully implemented
4. No support for multiple languages in CV
5. Limited handling of complex CV layouts

**Planned Improvements:**
1. **AI Integration** (Phase 2)
   - Use OpenAI/Claude API for better extraction
   - Normalize job titles and skills
   - Extract dates more accurately
   - Handle multiple CV formats

2. **Enhanced Parsing**
   - Support for more file formats (RTF, TXT)
   - Better table extraction from PDFs
   - Image-based CV parsing (OCR)

3. **Data Enrichment**
   - LinkedIn profile scraping
   - Skill taxonomy mapping
   - Company information lookup

## POPIA Compliance

### Data Protection Measures

1. **Consent**
   - Clear consent notice before CV upload
   - User controls their data
   - Can delete profile anytime

2. **Data Minimization**
   - Only extract necessary information
   - No storage of sensitive data without consent

3. **Security**
   - Secure file upload (HTTPS)
   - Encrypted storage
   - Access control (user can only access their own data)

4. **Transparency**
   - Clear explanation of what data is extracted
   - Preview before saving
   - User can edit/remove any information

### Consent Text
```
By uploading your CV, you consent to:
- Automatic extraction of your professional information
- Storage of your profile data in our secure database
- Use of your data for job matching purposes
- Your data being shared with potential employers (with your explicit consent)

You can view, edit, or delete your profile at any time.
```

## Testing

### Manual Testing Checklist

- [ ] Upload PDF CV successfully
- [ ] Upload DOCX CV successfully
- [ ] File size validation (reject >10MB)
- [ ] File type validation (reject non-PDF/DOCX)
- [ ] Drag and drop functionality
- [ ] Name extraction accuracy
- [ ] Email extraction accuracy
- [ ] Phone extraction accuracy
- [ ] Skills extraction
- [ ] Experience extraction
- [ ] Education extraction
- [ ] Profile form pre-fill
- [ ] Edit and save profile
- [ ] Update existing profile
- [ ] Profile persistence across sessions
- [ ] Authentication protection
- [ ] Error handling

### Test CVs

Create test CVs with:
1. Standard format (chronological)
2. Skills-based format
3. Combination format
4. Multiple pages
5. Different fonts and layouts
6. South African phone numbers
7. Various education formats

## Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Leave empty for mock mode (development)
# VITE_API_URL=
```

## Troubleshooting

### Common Issues

**1. PDF parsing fails**
- Ensure PDF is not password-protected
- Check if PDF contains actual text (not scanned images)
- Try re-saving PDF from original source

**2. DOCX parsing fails**
- Ensure file is not corrupted
- Check file format (must be .docx, not .doc)
- Try opening and re-saving in Word

**3. No data extracted**
- CV format may be unconventional
- Try manual entry instead
- Report issue for algorithm improvement

**4. Skills not detected**
- Skills may not be in predefined database
- Add skills manually in profile form
- Suggest new skills for database

## Future Enhancements

### Phase 2 Features
1. **AI-Powered Parsing**
   - OpenAI/Claude integration
   - Better accuracy and normalization
   - Support for more languages

2. **LinkedIn Integration**
   - Import from LinkedIn profile
   - Merge CV and LinkedIn data
   - Keep profile synced

3. **Cloud Storage**
   - Azure Blob Storage / AWS S3
   - Store original CV files
   - Download CV anytime

4. **Advanced Features**
   - CV scoring and recommendations
   - Gap analysis
   - Skill suggestions
   - Career path recommendations

5. **Employer Features**
   - Search candidates by skills
   - View candidate profiles
   - Request additional information
   - Schedule interviews

## Support

For issues or questions:
- Check this documentation
- Review code comments
- Contact development team
- Submit GitHub issue

## License

Proprietary - tseboIQ Platform
