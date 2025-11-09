# Migration Checklist: Mock Data to Production

## Overview
This checklist helps you transition from the previous mock data implementation to the production-ready configuration.

## ✅ Changes Made

### 1. Authentication Service (`src/lib/auth.js`)
- ✅ Removed all mock mode logic
- ✅ Removed mock user data
- ✅ Removed localStorage fallbacks
- ✅ All functions now require Supabase configuration
- ✅ Added proper error messages for missing configuration

### 2. Supabase Configuration (`src/lib/supabase.js`)
- ✅ Removed mock mode flag
- ✅ Removed fallback to mock values
- ✅ Now requires actual environment variables
- ✅ Added validation warnings

### 3. Profile API Service (`src/services/profileApi.js`)
- ✅ Removed all mock storage logic
- ✅ Removed localStorage persistence
- ✅ Removed mock delays
- ✅ All functions now require API_BASE_URL
- ✅ Added proper error messages

### 4. Mock Data Utilities (`src/utils/mockData.js`)
- ✅ Added production mode checks
- ✅ Mock data initialization skipped in production
- ✅ Added warning messages for development mode
- ✅ Preserved for backward compatibility only

### 5. Documentation
- ✅ Created `PRODUCTION_SETUP.md` with complete setup guide
- ✅ Created `ProfileController.cs` with .NET backend reference
- ✅ Updated `README.md` with production requirements
- ✅ Updated `.env.example` with required variables

## 🔧 Required Actions

### Immediate (Before Running App)

- [ ] **Create `.env` file**
  ```bash
  cp .env.example .env
  ```

- [ ] **Configure Supabase**
  - [ ] Create Supabase project
  - [ ] Get project URL and anon key
  - [ ] Add to `.env` file:
    ```env
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```

- [ ] **Configure Backend API**
  - [ ] Set up .NET Web API
  - [ ] Deploy or run locally
  - [ ] Add to `.env` file:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

### Database Setup

- [ ] **Create Supabase Tables**
  - [ ] Run SQL migrations for `candidates` table
  - [ ] Run SQL migrations for `consents` table
  - [ ] Set up Row Level Security (RLS) policies
  - [ ] Create storage bucket for CVs

- [ ] **Configure Authentication**
  - [ ] Enable Email/Password provider
  - [ ] Configure OAuth providers (optional):
    - [ ] Google
    - [ ] Apple
    - [ ] Microsoft (Azure)
  - [ ] Set redirect URLs

### Backend Implementation

- [ ] **Implement Required Endpoints**
  - [ ] `POST /api/profile/upload` - Upload and parse CV
  - [ ] `POST /api/profile` - Create profile
  - [ ] `GET /api/profile/user/{userId}` - Get profile
  - [ ] `PUT /api/profile/{profileId}` - Update profile
  - [ ] `DELETE /api/profile/{profileId}` - Delete profile
  - [ ] `POST /api/profile/upload-file` - Upload CV file

- [ ] **Set Up File Storage**
  - [ ] Configure Azure Blob Storage or AWS S3
  - [ ] Implement file upload service
  - [ ] Configure CORS

- [ ] **Configure CORS**
  - [ ] Allow requests from your frontend domain
  - [ ] Set appropriate headers

### Testing

- [ ] **Test Authentication**
  - [ ] Register new user
  - [ ] Login with email/password
  - [ ] Test OAuth providers (if configured)
  - [ ] Test password reset
  - [ ] Test logout

- [ ] **Test Profile Management**
  - [ ] Upload CV (PDF)
  - [ ] Upload CV (DOCX)
  - [ ] Verify data extraction
  - [ ] Edit profile
  - [ ] Save profile
  - [ ] Reload page - verify persistence
  - [ ] Delete profile

- [ ] **Test API Integration**
  - [ ] Check network tab for API calls
  - [ ] Verify correct endpoints are called
  - [ ] Check for errors in console
  - [ ] Verify data is saved to database

### Cleanup

- [ ] **Clear Old Data**
  - [ ] Clear browser localStorage:
    ```javascript
    localStorage.clear()
    ```
  - [ ] Clear browser cookies
  - [ ] Hard refresh (Ctrl+Shift+R)

- [ ] **Remove Development Data**
  - [ ] Remove any test accounts
  - [ ] Remove test profiles
  - [ ] Remove test CVs

## ⚠️ Breaking Changes

### What No Longer Works

1. **Mock Authentication**
   - No longer accepts any email/password in development
   - Requires actual Supabase authentication

2. **LocalStorage Persistence**
   - Profile data no longer stored in localStorage
   - All data must come from backend API

3. **Automatic Demo Data**
   - No pre-populated candidate profiles
   - Must create real profiles through the app

4. **Offline Mode**
   - App requires internet connection
   - Requires backend API to be running

### What Still Works

1. **UI Components**
   - All React components unchanged
   - Styling and layout intact

2. **Routing**
   - All routes still functional
   - Navigation unchanged

3. **Form Validation**
   - Client-side validation still works
   - Same user experience

4. **CV Parsing**
   - PDF and DOCX parsing still works
   - Same extraction logic

## 🚨 Common Issues

### "Supabase not configured" Error

**Cause**: Missing or incorrect Supabase environment variables

**Solution**:
1. Check `.env` file exists
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Restart dev server: `yarn dev`

### "API not configured" Error

**Cause**: Missing `VITE_API_URL` environment variable

**Solution**:
1. Add `VITE_API_URL` to `.env` file
2. Verify backend API is running
3. Restart dev server

### Authentication Fails

**Possible Causes**:
- Supabase project not set up
- Wrong credentials in `.env`
- Email provider not enabled
- OAuth provider not configured

**Solution**:
1. Verify Supabase project is active
2. Check authentication providers are enabled
3. Verify redirect URLs are correct
4. Check browser console for specific errors

### Profile Not Saving

**Possible Causes**:
- Backend API not running
- Wrong API URL
- Database not set up
- CORS issues

**Solution**:
1. Verify backend is running
2. Check API URL in `.env`
3. Verify database tables exist
4. Check backend CORS configuration
5. Check backend logs for errors

### CV Upload Fails

**Possible Causes**:
- Backend endpoint not implemented
- File too large (>10MB)
- Wrong file type
- Storage not configured

**Solution**:
1. Verify `/api/profile/upload` endpoint exists
2. Check file size and type
3. Verify file storage is configured
4. Check backend logs

## 📋 Verification Steps

### 1. Environment Check
```bash
# Check .env file exists
ls -la .env

# Verify environment variables are loaded
yarn dev
# Check console for configuration warnings
```

### 2. Backend Health Check
```bash
# Test backend is running
curl http://localhost:5000/api/health

# Or open in browser
http://localhost:5000/api/health
```

### 3. Supabase Connection
```javascript
// In browser console
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

### 4. Full Flow Test
1. Open app in browser
2. Register new account
3. Login
4. Navigate to `/profile`
5. Upload CV
6. Edit profile
7. Save
8. Refresh page
9. Verify data persists

## 📚 Additional Resources

- **Setup Guide**: `docs/PRODUCTION_SETUP.md`
- **Backend Reference**: `docs/ProfileController.cs`
- **CV Parser Guide**: `docs/CV_PARSER_GUIDE.md`
- **Main README**: `README.md`

## 🆘 Getting Help

If you encounter issues:

1. Check this checklist
2. Review `PRODUCTION_SETUP.md`
3. Check browser console for errors
4. Check backend logs
5. Verify all environment variables
6. Contact development team

## ✨ Success Criteria

Your migration is complete when:

- [ ] App starts without errors
- [ ] No "not configured" warnings in console
- [ ] Users can register and login
- [ ] Users can upload CVs
- [ ] Profile data persists across sessions
- [ ] All API calls succeed
- [ ] No localStorage dependencies

---

**Last Updated**: Migration completed - all mock data removed
