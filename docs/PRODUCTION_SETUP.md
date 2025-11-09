# Production Setup Guide

## Overview
This guide explains how to configure tseboIQ to work with actual backend APIs instead of mock data.

## ⚠️ Important Changes

All mock data and development-only features have been removed. The application now requires:
1. **Supabase** for authentication
2. **Backend API** for profile and CV management

## Environment Configuration

### Step 1: Create .env File

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit the `.env` file with your actual values:

```env
# Backend API Configuration (REQUIRED)
VITE_API_URL=http://localhost:5000/api
# Or for production:
# VITE_API_URL=https://api.tseboiq.co.za/api

# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site Configuration
VITE_SITE_URL=http://localhost:5187
```

## Backend API Requirements

### Required Endpoints

Your .NET backend must implement these endpoints:

#### Authentication (Handled by Supabase)
- User registration
- User login
- Password reset
- OAuth providers (Google, Apple, Microsoft)

#### Profile Management

**1. Upload and Parse CV**
```
POST /api/profile/upload
Content-Type: multipart/form-data
Body: file, userId
Response: { success, data: ParsedCVData, fileUrl }
```

**2. Create Profile**
```
POST /api/profile
Content-Type: application/json
Body: CandidateProfileDto
Response: CandidateProfile
```

**3. Get Profile by User ID**
```
GET /api/profile/user/{userId}
Response: CandidateProfile or 404
```

**4. Update Profile**
```
PUT /api/profile/{profileId}
Content-Type: application/json
Body: CandidateProfileDto
Response: CandidateProfile
```

**5. Delete Profile**
```
DELETE /api/profile/{profileId}
Response: { success: true }
```

**6. Upload CV File**
```
POST /api/profile/upload-file
Content-Type: multipart/form-data
Body: file, userId
Response: { fileUrl }
```

See `docs/ProfileController.cs` for complete .NET implementation reference.

## Database Setup

### Supabase Tables

**users table** (managed by Supabase Auth)
- Automatically created by Supabase
- Contains user authentication data

**candidates table**
```sql
CREATE TABLE candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    summary TEXT,
    skills JSONB, -- Array of strings
    experience_years INTEGER,
    experience JSONB, -- Array of experience objects
    education JSONB, -- Array of education objects
    certifications JSONB, -- Array of certification objects
    languages JSONB, -- Array of strings
    cv_file_url VARCHAR(500),
    cv_file_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_candidates_user_id ON candidates(user_id);
CREATE INDEX idx_candidates_email ON candidates(email);
```

**consents table** (for POPIA compliance)
```sql
CREATE TABLE consents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL,
    consent_given BOOLEAN NOT NULL DEFAULT true,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_consents_user_id ON consents(user_id);
```

## Supabase Configuration

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Enable Authentication Providers

In Supabase Dashboard:
- Go to Authentication > Providers
- Enable Email/Password
- Enable Google OAuth (optional)
- Enable Apple OAuth (optional)
- Enable Azure OAuth for Microsoft (optional)

### 3. Configure OAuth Redirect URLs

Add these redirect URLs in your OAuth provider settings:
```
http://localhost:5187/auth/callback
https://yourdomain.com/auth/callback
```

### 4. Set Up Row Level Security (RLS)

Enable RLS on the candidates table:

```sql
-- Enable RLS
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own profile
CREATE POLICY "Users can view own profile"
ON candidates FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON candidates FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON candidates FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete own profile"
ON candidates FOR DELETE
USING (auth.uid() = user_id);
```

## File Storage Setup

### Option 1: Supabase Storage

```sql
-- Create storage bucket for CVs
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', false);

-- Set up storage policies
CREATE POLICY "Users can upload their own CVs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cvs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own CVs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cvs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Option 2: Azure Blob Storage / AWS S3

Configure in your .NET backend:
- Set up storage account
- Configure connection strings
- Implement file upload/download in `IFileStorageService`

## Running the Application

### Development Mode

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

The app will run at `http://localhost:5187`

### Production Build

```bash
# Build for production
yarn build

# Preview production build
yarn preview
```

## Verification Checklist

Before deploying to production, verify:

- [ ] `.env` file is configured with actual values
- [ ] Supabase project is created and configured
- [ ] Backend API is running and accessible
- [ ] All required endpoints are implemented
- [ ] Database tables are created
- [ ] RLS policies are enabled
- [ ] OAuth providers are configured (if using)
- [ ] File storage is set up
- [ ] CORS is configured on backend
- [ ] SSL/HTTPS is enabled for production
- [ ] Environment variables are set in hosting platform

## Testing

### Test Authentication
1. Navigate to `/register`
2. Create a new account
3. Verify email (if enabled)
4. Log in at `/login`
5. Verify redirect to home page

### Test Profile Management
1. Log in as a user
2. Navigate to `/profile`
3. Upload a CV (PDF or DOCX)
4. Verify data extraction
5. Edit profile information
6. Save profile
7. Refresh page - verify data persists

### Test API Integration
1. Open browser DevTools > Network tab
2. Perform actions (login, upload CV, save profile)
3. Verify API calls are made to correct endpoints
4. Check for errors in console

## Troubleshooting

### "Supabase not configured" Error
- Check `.env` file exists
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after changing `.env`

### "API not configured" Error
- Check `VITE_API_URL` is set in `.env`
- Verify backend API is running
- Check CORS configuration on backend

### Authentication Not Working
- Verify Supabase project is active
- Check OAuth provider configuration
- Verify redirect URLs are correct
- Check browser console for errors

### CV Upload Fails
- Verify backend endpoint `/api/profile/upload` exists
- Check file size (max 10MB)
- Verify file type (PDF or DOCX only)
- Check backend logs for errors

### Profile Not Saving
- Verify backend endpoint `/api/profile` exists
- Check user is authenticated
- Verify database connection
- Check backend logs for errors

## Security Considerations

### Production Checklist
- [ ] Use HTTPS for all connections
- [ ] Enable CORS only for your domain
- [ ] Implement rate limiting on API
- [ ] Validate all user inputs on backend
- [ ] Sanitize file uploads
- [ ] Enable RLS on all Supabase tables
- [ ] Use environment variables for secrets
- [ ] Never commit `.env` file to git
- [ ] Implement proper error handling
- [ ] Add logging and monitoring
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Support

For issues or questions:
- Check this documentation
- Review `docs/CV_PARSER_GUIDE.md`
- Check backend logs
- Review Supabase logs
- Contact development team

## Migration from Mock Data

If you were previously using mock data:

1. **Clear localStorage:**
   ```javascript
   localStorage.clear()
   ```

2. **Remove mock data references:**
   - All mock mode code has been removed
   - No action needed from your side

3. **Set up backend:**
   - Follow this guide to configure backend
   - Implement required endpoints

4. **Test thoroughly:**
   - Create new accounts
   - Upload CVs
   - Verify data persistence

## Next Steps

1. Set up your .NET backend API
2. Configure Supabase project
3. Create `.env` file with actual values
4. Test all features
5. Deploy to production

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [.NET Web API Documentation](https://docs.microsoft.com/en-us/aspnet/core/web-api/)
- [React Router Documentation](https://reactrouter.com/)
