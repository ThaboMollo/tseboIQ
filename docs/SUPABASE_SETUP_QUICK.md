# Supabase Quick Setup Guide

## Issue: 404 After Signup

If you're getting a 404 error after signing up, it's likely because **email confirmation is enabled** in Supabase (default setting).

## Quick Fix: Disable Email Confirmation (Development Only)

### Step 1: Go to Supabase Dashboard

1. Open your Supabase project at [supabase.com](https://supabase.com)
2. Navigate to **Authentication** → **Providers** → **Email**

### Step 2: Disable Email Confirmation

1. Scroll down to **"Confirm email"**
2. **Toggle OFF** the "Confirm email" option
3. Click **Save**

### Step 3: Test Signup Again

1. Try signing up as an employer or candidate
2. You should now be redirected to the dashboard immediately
3. No email confirmation required

---

## Alternative: Handle Email Confirmation

If you want to keep email confirmation enabled (recommended for production):

### Update Your Flow

The app now handles this automatically:
- If email confirmation is required, you'll see: "Please check your email to confirm your account before logging in."
- After confirming your email, you can log in normally

### For Testing

Use a real email address or set up email forwarding in Supabase:
1. Go to **Authentication** → **Email Templates**
2. Configure SMTP settings for email delivery
3. Or use Supabase's built-in email service

---

## Database Tables Setup

Make sure you've created the required tables in Supabase:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT CHECK (role IN ('candidate', 'employer')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create candidates table
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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
  experience_years INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Candidates policies
CREATE POLICY "Candidates can view own data"
  ON candidates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Candidates can insert own data"
  ON candidates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employers can view all candidates"
  ON candidates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'employer'
    )
  );

-- Jobs policies
CREATE POLICY "Jobs are viewable by authenticated users"
  ON jobs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Employers can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Employers can update own jobs"
  ON jobs FOR UPDATE
  USING (auth.uid() = employer_id);

CREATE POLICY "Employers can delete own jobs"
  ON jobs FOR DELETE
  USING (auth.uid() = employer_id);
```

---

## Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

### How to Get Your Credentials

1. Go to your Supabase project
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## Troubleshooting

### Still Getting 404?

**Check Browser Console:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors related to:
   - Supabase authentication
   - Database permissions
   - Network requests

**Common Issues:**

1. **"JWT expired" or "Invalid token"**
   - Clear browser localStorage
   - Try signing up again

2. **"Permission denied" or "RLS policy"**
   - Check that RLS policies are set up correctly
   - Make sure you ran all the SQL commands above

3. **"User already exists"**
   - The email is already registered
   - Try logging in instead of signing up
   - Or use a different email

4. **Network errors**
   - Check your internet connection
   - Verify Supabase URL in `.env` is correct
   - Make sure Supabase project is active

### Check Authentication Status

Add this to your browser console to debug:

```javascript
// Check if user is logged in
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// Check user role
if (session) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  console.log('Profile:', profile)
}
```

### Clear Everything and Start Fresh

```javascript
// In browser console
localStorage.clear()
location.reload()
```

Then try signing up again.

---

## Production Setup

For production, you should:

1. ✅ **Enable email confirmation** (security)
2. ✅ **Set up custom SMTP** (branded emails)
3. ✅ **Configure email templates** (better UX)
4. ✅ **Add password requirements** (security)
5. ✅ **Enable MFA** (optional, extra security)

---

## Need More Help?

- Check Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Check browser console for errors
- Review `QUICK_START.md` for full setup guide
- Contact support if issues persist

---

**Quick Summary:**
1. Disable email confirmation in Supabase (Auth → Providers → Email)
2. Make sure database tables are created
3. Verify `.env` has correct credentials
4. Clear browser cache and try again

That should fix the 404 error! 🎉
