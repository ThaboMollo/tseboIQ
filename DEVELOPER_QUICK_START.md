# 🚀 Developer Quick Start - tseboIQ Bug Fixes

## Quick Setup (5 minutes)

### 1. Environment Configuration
Copy `.env.example` to `.env` and configure:

```bash
# Required for authentication
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional - for AI CV parsing (falls back to local parser)
VITE_AFFINDA_API_KEY=your-affinda-key
VITE_AFFINDA_WORKSPACE=your-workspace-id
```

### 2. Install Dependencies
```bash
yarn install
# or
npm install
```

### 3. Run Development Server
```bash
yarn dev
# or
npm run dev
```

---

## 🔍 Testing the Fixes

### Test BUG 1: Authentication
1. Navigate to `/auth`
2. Try to register with email/password
3. **Expected:** Smooth registration without null errors
4. **Check console:** Should see "✅ Supabase client initialized successfully"

### Test BUG 2: CV Parser
1. Navigate to `/register/candidate`
2. Upload a PDF or DOCX CV
3. **Expected:** Form auto-fills with parsed data
4. **Check console:** Should see parsing logs and mapped data

### Test BUG 3: Skills Input
1. On candidate form, go to Skills field
2. Type "Reac" → Should see autocomplete suggestions
3. Press Enter → Skill tag appears with gradient background
4. Click × on tag → Skill removes
5. **Expected:** Smooth tag-based input with autocomplete

---

## 📁 Files Modified

### Core Fixes
- `src/lib/supabase.js` - Enhanced client initialization
- `src/lib/auth.js` - Added null checks to all auth functions
- `src/pages/AuthModal.jsx` - Added configuration validation
- `src/services/affindaParser.js` - Fixed API integration
- `src/pages/CandidateForm.jsx` - Fixed data mapping

### New Components
- `src/components/SkillsInput.jsx` - Tag-based skills input

### Documentation
- `BUG_FIXES_SUMMARY.md` - Comprehensive fix documentation
- `DEVELOPER_QUICK_START.md` - This file

---

## 🐛 Common Issues & Solutions

### Issue: "Supabase not configured" error
**Solution:** Check `.env` file has valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Issue: CV parser not working
**Solution:** 
- Check if `VITE_AFFINDA_API_KEY` is set (optional)
- If not set, local parser will be used automatically
- Verify file is PDF or DOCX format

### Issue: Skills not saving
**Solution:** 
- Ensure at least one skill is added
- Check browser console for validation errors

---

## 🔧 Architecture Overview

```
tseboIQ/
├── src/
│   ├── lib/
│   │   ├── supabase.js          # ✅ Fixed: Robust initialization
│   │   └── auth.js              # ✅ Fixed: Null checks added
│   ├── services/
│   │   ├── affindaParser.js     # ✅ Fixed: API integration
│   │   └── cvParser.js          # Local fallback parser
│   ├── components/
│   │   └── SkillsInput.jsx      # ✅ New: Tag-based input
│   └── pages/
│       ├── AuthModal.jsx        # ✅ Fixed: Error handling
│       └── CandidateForm.jsx    # ✅ Fixed: Data mapping
```

---

## 🎨 Component Usage

### SkillsInput Component
```jsx
import SkillsInput from '../components/SkillsInput'

function MyForm() {
  const [skills, setSkills] = useState([])
  
  return (
    <SkillsInput
      skills={skills}
      onChange={setSkills}
      placeholder="Add your skills..."
    />
  )
}
```

**Features:**
- Autocomplete with 30+ common tech skills
- Keyboard shortcuts (Enter, Comma, Backspace)
- Duplicate prevention
- Themed with tseboIQ brand colors

---

## 📊 Code Quality Checks

Before committing:
```bash
# Lint check
yarn lint

# Build check
yarn build

# Type check (if using TypeScript)
yarn type-check
```

---

## 🚢 Deployment

### Production Checklist
- [ ] Set production environment variables
- [ ] Test authentication flow
- [ ] Test CV upload with sample files
- [ ] Verify skills input on mobile
- [ ] Check all console logs removed/minimized
- [ ] Run build without errors

### Build for Production
```bash
yarn build
```

### Preview Production Build
```bash
yarn preview
```

---

## 📞 Need Help?

1. Check `BUG_FIXES_SUMMARY.md` for detailed explanations
2. Review console logs for debugging info
3. Check browser DevTools Network tab for API calls
4. Verify `.env` configuration

---

## ✅ Success Indicators

You'll know everything is working when:
- ✅ No console errors on page load
- ✅ Registration completes without "null" errors
- ✅ CV upload populates form fields
- ✅ Skills input shows autocomplete suggestions
- ✅ Form submits successfully

---

**Happy Coding! 🎉**
