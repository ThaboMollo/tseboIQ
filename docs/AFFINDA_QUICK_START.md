# Affinda CV Parser - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Configure API Key

Create a `.env` file in your project root (or copy from `.env.example`):

```bash
# Copy the example file
cp .env.example .env
```

The Affinda API key is already configured:
```bash
VITE_AFFINDA_API_KEY=aff_6dc4b8fe9d8e37f700cd93992be45489b66931b1
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### Step 3: Start Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

### Step 4: Test CV Upload

1. Navigate to `/register` in your browser
2. Create an account or skip to CV upload
3. Upload a test CV (PDF or DOCX)
4. Watch the AI parse your CV automatically!

## 📝 Usage Example

### In Your Component

```jsx
import CvUploadForm from '../components/CvUploadForm'

function MyPage() {
  const handleComplete = (result) => {
    console.log('Parsed data:', result.data)
    console.log('Confidence:', result.confidence)
    console.log('Source:', result.source) // 'affinda' or 'local'
  }

  return (
    <CvUploadForm 
      onParseComplete={handleComplete}
      onError={(err) => console.error(err)}
    />
  )
}
```

### Direct API Usage

```javascript
import { parseCV } from '../services/affindaParser'

async function handleUpload(file) {
  try {
    const result = await parseCV(file)
    
    // Access parsed data
    console.log('Name:', result.data.full_name)
    console.log('Email:', result.data.email)
    console.log('Skills:', result.data.skills)
    console.log('Experience:', result.data.employment_history)
    
  } catch (error) {
    console.error('Parse failed:', error)
  }
}
```

## 🎯 What Gets Extracted

The parser automatically extracts:

- ✅ **Personal Info**: Name, email, phone, address
- ✅ **Professional**: Summary, skills, years of experience
- ✅ **Employment**: Job history with dates and responsibilities
- ✅ **Education**: Degrees, institutions, graduation dates
- ✅ **Certifications**: Professional certifications and courses
- ✅ **Additional**: Languages, projects, references, LinkedIn

## 🔄 How It Works

```
1. User uploads CV (PDF/DOCX)
   ↓
2. File sent to Affinda API
   ↓
3. AI extracts structured data
   ↓
4. Data mapped to tseboIQ format
   ↓
5. Confidence score calculated
   ↓
6. If low confidence → Fallback to local parser
   ↓
7. Return parsed data to component
```

## ⚡ Key Features

### Automatic Fallback
If Affinda fails or returns low confidence, the system automatically falls back to the local parser. **No user intervention needed!**

### Confidence Scoring
Every parse gets a confidence score (0-100%):
- **80-100%**: Excellent - all critical fields extracted
- **60-79%**: Good - most fields extracted
- **40-59%**: Fair - some fields missing
- **0-39%**: Poor - many fields missing

### Real-time Progress
The component shows:
- Upload progress
- Parsing status ("Analyzing CV with AI...")
- Success/error messages
- Extracted data preview

## 🎨 Component Props

### CvUploadForm

```jsx
<CvUploadForm
  onParseComplete={(result) => {
    // Called when parsing succeeds
    // result: { success, data, source, confidence, validation }
  }}
  onError={(error) => {
    // Called when parsing fails
    // error: string error message
  }}
/>
```

## 📊 Parsed Data Structure

```javascript
{
  full_name: "John Doe",
  email: "john@example.com",
  phone_number: "+27 79 520 8970",
  skills: ["React", "Node.js", "Python"],
  employment_history: [{
    company_name: "Tech Corp",
    job_title: "Senior Developer",
    start_date: "2020-01-01",
    end_date: null, // null = current job
    responsibilities: "Led development team..."
  }],
  education: [{
    degree: "BSc Computer Science",
    institution: "University Name",
    graduation_date: "2019-12-01"
  }],
  // ... more fields
}
```

## 🐛 Common Issues

### "Affinda API failed"
**Solution**: Check your API key in `.env` file

### "File size exceeds limit"
**Solution**: Compress CV or use smaller file (max 10MB)

### "Invalid file type"
**Solution**: Only PDF and DOCX files are supported

### Low confidence score
**Solution**: System automatically uses fallback parser - no action needed!

## 📚 Next Steps

1. **Read Full Guide**: See `AFFINDA_INTEGRATION_GUIDE.md` for detailed documentation
2. **Customize**: Modify `affindaParser.js` to add custom field mappings
3. **Test**: Upload various CV formats to test parsing accuracy
4. **Monitor**: Track confidence scores and fallback rates

## 💡 Pro Tips

1. **Test with real CVs**: Use actual candidate CVs for testing
2. **Review extracted data**: Always let users review and edit parsed data
3. **Handle errors gracefully**: Show helpful error messages to users
4. **Log metrics**: Track parsing success rates and confidence scores
5. **Provide fallback**: Always offer manual form entry as alternative

## 🎉 That's It!

You're now ready to use AI-powered CV parsing in tseboIQ. The integration handles everything automatically:
- ✅ API calls
- ✅ Error handling
- ✅ Fallback logic
- ✅ Data validation
- ✅ Progress tracking

Just drop in the `CvUploadForm` component and you're good to go!

---

**Need Help?**
- 📖 Full Documentation: `AFFINDA_INTEGRATION_GUIDE.md`
- 🐛 Troubleshooting: See troubleshooting section in full guide
- 📧 Contact: mollo.t.mponya@gmail.com
