# Candidate Registration with CV Upload - Implementation Guide

## Overview

The enhanced candidate registration system implements a seamless **Upload → Extract → Edit → Submit** flow that allows candidates to:
1. Create an account
2. Upload their CV (PDF or DOCX)
3. Auto-populate profile fields from CV data
4. Review and edit extracted information
5. Submit complete profile

## 🎯 Features Implemented

### ✅ Multi-Step Registration Flow
- **Step 1**: Account Creation (name, email, password)
- **Step 2**: CV Upload with drag-and-drop
- **Step 3**: Profile Completion (pre-filled from CV)
- **Step 4**: Success confirmation

### ✅ CV Parsing
- Supports PDF and DOCX formats
- Max file size: 10MB
- Extracts:
  - Full name
  - Email address
  - Phone number
  - Skills (array)
  - Work experience (years + details)
  - Education (institutions + degrees)
  - Certifications

### ✅ Smart Form Pre-filling
- All extracted data auto-populates form fields
- All fields remain editable
- Fallback to manual entry if parsing fails
- Option to skip CV upload entirely

### ✅ User Experience
- Visual step indicator
- Progress feedback during CV parsing
- Clear error messages
- Success confirmations
- Responsive design

## 📁 File Structure

```
src/
├── pages/
│   ├── CandidateRegistration.jsx    # NEW: Enhanced registration flow
│   ├── CandidateProfile.jsx         # Existing: Profile management
│   └── Register.jsx                 # Existing: Basic registration
├── components/
│   ├── CVUpload.jsx                 # Drag-and-drop CV upload
│   ├── ProfileForm.jsx              # Comprehensive profile form
│   └── TagInput.jsx                 # Skills/languages input
├── services/
│   ├── cvParser.js                  # CV parsing logic (PDF & DOCX)
│   └── profileApi.js                # API integration
└── types/
    └── candidateProfile.js          # Type definitions
```

## 🚀 Usage

### Route Configuration

Two registration options are now available:

1. **Basic Registration** (existing):
   ```
   /register
   ```
   - Quick account creation only
   - No CV upload
   - Profile completed later

2. **Enhanced Registration with CV** (new):
   ```
   /register/candidate
   ```
   - Full onboarding flow
   - CV upload and parsing
   - Complete profile in one session

### Integration Points

#### From Landing Page

Update your "I'm Looking for a Job" button:

```jsx
<button onClick={() => navigate('/register/candidate')}>
  Get Started as a Candidate
</button>
```

#### From Navigation

```jsx
<Link to="/register/candidate">
  Candidate Sign Up
</Link>
```

## 🔧 Technical Implementation

### Component: CandidateRegistration

**Location**: `src/pages/CandidateRegistration.jsx`

**Key Features**:
- Multi-step state management
- Integrated with AuthProvider
- CV parsing with error handling
- Profile API integration
- Responsive UI with step indicators

**Props**: None (standalone page)

**State Management**:
```javascript
const [currentStep, setCurrentStep] = useState(1)
const [accountData, setAccountData] = useState({...})
const [selectedFile, setSelectedFile] = useState(null)
const [profileData, setProfileData] = useState(null)
```

### CV Parsing Flow

```javascript
// 1. User selects file
handleFileSelect(file)

// 2. Parse CV
const parsed = await parseCV(file)

// 3. Prepare profile data
setProfileData({
  ...parsed,
  userId: user?.id,
  cvFileName: file.name,
  email: parsed.email || accountData.email,
  fullName: parsed.fullName || accountData.name
})

// 4. Move to profile completion
setCurrentStep(3)
```

### Profile Submission

```javascript
const handleProfileSave = async (formData) => {
  const profilePayload = {
    ...formData,
    userId: user?.id,
    cvFileName: selectedFile?.name
  }
  
  await saveProfile(profilePayload)
  setCurrentStep(4) // Success
}
```

## 🎨 UI/UX Details

### Step Indicator

Visual progress bar showing:
- ✅ Completed steps (green)
- 🔵 Current step (primary color)
- ⚪ Pending steps (gray)

### Loading States

- Account creation: "Creating Account..."
- CV parsing: "Parsing CV... X%"
- Profile saving: "Saving..."

### Error Handling

- **Account creation fails**: Show error, allow retry
- **CV parsing fails**: Show error, allow manual entry
- **Profile save fails**: Show error, allow retry

### Success Messages

- Account created
- CV parsed successfully
- Profile saved

## 📡 Backend Integration

### Required Endpoints

The system expects these backend endpoints:

#### 1. Parse CV (Optional - Frontend handles this)
```
POST /api/candidates/parse-cv
Content-Type: multipart/form-data

Body:
- file: File (PDF or DOCX)

Response:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+27 82 456 7890",
  "skills": ["React", "C#", "Azure"],
  "experienceYears": 4,
  "experience": [...],
  "education": [...],
  "certifications": [...]
}
```

**Note**: Currently, CV parsing happens on the frontend using `cvParser.js`. You can optionally move this to the backend for better performance and AI integration.

#### 2. Create Profile
```
POST /api/profile
Content-Type: application/json

Body: CandidateProfileDto (see ProfileController.cs)

Response: Created profile with ID
```

### .NET Backend Reference

See `docs/ProfileController.cs` for complete implementation.

## 🔐 Security & Compliance

### POPIA/GDPR Compliance

**Consent Notice** (add to Step 2):
```jsx
<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
  <h4 className="font-semibold text-blue-900 mb-2">Privacy Notice</h4>
  <p className="text-sm text-blue-800">
    By uploading your CV, you consent to tseboIQ processing your personal 
    information for job matching purposes. You can view, edit, or delete 
    your data at any time.
  </p>
  <label className="flex items-center gap-2 mt-3">
    <input type="checkbox" required />
    <span className="text-sm">I consent to data processing</span>
  </label>
</div>
```

### File Upload Security

- File type validation (PDF, DOCX only)
- File size limit (10MB)
- Sanitize extracted text
- Secure file storage
- Virus scanning (backend)

## 🧪 Testing

### Manual Testing Checklist

**Step 1: Account Creation**
- [ ] Valid email and password accepted
- [ ] Invalid email rejected
- [ ] Password mismatch detected
- [ ] Duplicate email handled
- [ ] Success message shown
- [ ] Progresses to Step 2

**Step 2: CV Upload**
- [ ] Drag-and-drop works
- [ ] Click to browse works
- [ ] PDF files accepted
- [ ] DOCX files accepted
- [ ] File size validation (>10MB rejected)
- [ ] File type validation (other types rejected)
- [ ] Parsing progress shown
- [ ] Success message on parse
- [ ] Skip option works

**Step 3: Profile Completion**
- [ ] Form pre-filled with CV data
- [ ] All fields editable
- [ ] Skills can be added/removed
- [ ] Experience entries can be added/removed
- [ ] Education entries can be added/removed
- [ ] Form validation works
- [ ] Save button functional

**Step 4: Success**
- [ ] Success message shown
- [ ] Navigation buttons work
- [ ] Profile accessible at /profile

### Test CVs

Create test CVs with:
1. Standard chronological format
2. Skills-based format
3. Multiple pages
4. Different fonts
5. Tables and columns
6. South African phone numbers
7. Various education formats

### Error Scenarios

Test these failure cases:
- [ ] Network error during account creation
- [ ] Invalid CV file (corrupted)
- [ ] CV with no extractable text
- [ ] Backend API unavailable
- [ ] Duplicate profile creation

## 🎯 Customization Options

### Modify Step Flow

To add/remove steps, update:

```javascript
const steps = [
  { num: 1, label: 'Account', icon: User },
  { num: 2, label: 'Upload CV', icon: UploadIcon },
  { num: 3, label: 'Complete Profile', icon: FileText },
  // Add more steps here
  { num: 4, label: 'Done', icon: CheckCircle }
]
```

### Change Parsing Behavior

Edit `src/services/cvParser.js`:

```javascript
// Add custom extraction logic
export async function parseCV(file) {
  // Your custom parsing logic
  // Can integrate AI APIs here
}
```

### Customize Form Fields

Edit `src/components/ProfileForm.jsx` to add/remove fields.

### Styling

All components use Tailwind CSS. Customize colors in `tailwind.config.js`:

```javascript
colors: {
  primary: '#2F4858',  // Change brand color
  secondary: '#00A896',
  // ...
}
```

## 📊 Analytics & Tracking

### Key Metrics to Track

1. **Registration Funnel**:
   - Started registration
   - Completed Step 1 (account)
   - Uploaded CV (Step 2)
   - Completed profile (Step 3)
   - Conversion rate

2. **CV Upload**:
   - Upload success rate
   - Parse success rate
   - Average parsing time
   - File types used

3. **Data Quality**:
   - Fields auto-filled vs manual
   - Edit rate per field
   - Completion rate

### Implementation

Add tracking calls:

```javascript
// Example with Google Analytics
gtag('event', 'registration_started', {
  event_category: 'registration',
  event_label: 'candidate'
})

gtag('event', 'cv_uploaded', {
  event_category: 'registration',
  file_type: file.type,
  file_size: file.size
})
```

## 🚀 Future Enhancements

### Phase 2 Features

1. **AI-Powered Parsing**
   - Integrate OpenAI/Claude for better extraction
   - Normalize job titles and skills
   - Extract dates more accurately

2. **LinkedIn Integration**
   - Import from LinkedIn profile
   - Merge CV and LinkedIn data
   - Auto-update profile

3. **Smart Suggestions**
   - Suggest missing skills
   - Recommend certifications
   - Career path guidance

4. **Multi-Language Support**
   - Parse CVs in multiple languages
   - Translate to English
   - Localized UI

5. **Advanced Validation**
   - Email verification
   - Phone verification (OTP)
   - LinkedIn profile verification

### Phase 3 Features

1. **Video Introduction**
   - Record video pitch
   - Auto-transcribe
   - Add to profile

2. **Portfolio Integration**
   - GitHub integration
   - Project showcase
   - Code samples

3. **Skill Assessment**
   - Online tests
   - Skill verification
   - Badges and certificates

## 🆘 Troubleshooting

### Common Issues

**1. CV parsing fails**
- Check file is not password-protected
- Verify file is actual PDF/DOCX (not renamed)
- Try re-saving file from original source

**2. Form not pre-filling**
- Check console for parsing errors
- Verify `profileData` state is set
- Check ProfileForm receives `initialData` prop

**3. Profile save fails**
- Verify backend API is running
- Check API URL in `.env`
- Verify user is authenticated
- Check backend logs

**4. Step indicator not updating**
- Check `currentStep` state
- Verify step transitions in code
- Check for JavaScript errors

## 📚 Related Documentation

- **CV Parser Guide**: `docs/CV_PARSER_GUIDE.md`
- **Production Setup**: `docs/PRODUCTION_SETUP.md`
- **Backend Reference**: `docs/ProfileController.cs`
- **Migration Guide**: `docs/MIGRATION_CHECKLIST.md`

## 🎓 Developer Notes

### Code Organization

- **Separation of Concerns**: Registration logic separate from profile management
- **Reusable Components**: CVUpload and ProfileForm can be used elsewhere
- **Error Boundaries**: Add React error boundaries for production
- **Loading States**: All async operations show loading feedback

### Best Practices

1. **Always validate on backend**: Frontend validation is UX, not security
2. **Sanitize extracted text**: CV content can contain malicious data
3. **Rate limit uploads**: Prevent abuse
4. **Log parsing failures**: Track issues for improvement
5. **Test with real CVs**: Use actual candidate CVs for testing

### Performance Considerations

- **Large files**: Show progress during upload
- **Parsing time**: PDF parsing can take 2-5 seconds
- **Memory usage**: Large PDFs can use significant memory
- **Optimize images**: Compress CV files if storing

## ✅ Success Criteria

Your implementation is successful when:

- [ ] Users can complete registration in <5 minutes
- [ ] CV parsing success rate >85%
- [ ] At least 70% of fields auto-filled from CV
- [ ] <5% error rate during registration
- [ ] Mobile-responsive on all devices
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Fast (<3s page load)
- [ ] Secure (no data leaks)

---

**Last Updated**: November 2025
**Version**: 1.0
**Maintainer**: tseboIQ Development Team
