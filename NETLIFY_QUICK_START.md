# Netlify Forms - Quick Start Guide

## 🚀 3-Step Setup

### 1. Deploy to Netlify
```bash
# Push your code
git add .
git commit -m "Add Netlify Forms"
git push origin main

# Then on Netlify:
# - Import your repository
# - Click "Deploy site"
```

### 2. Configure Email Notifications
```
1. Go to Site Settings → Forms
2. Click "Add notification" → "Email notification"
3. Enter: iq.tsebo@gmail.com
4. Select form: contact
5. Save and verify email
```

### 3. Test It
```
1. Visit your-site.netlify.app/contact
2. Fill out the form
3. Check iq.tsebo@gmail.com for the submission
```

---

## ✅ What's Already Done

- ✅ Contact form configured with Netlify attributes
- ✅ Spam protection (honeypot field)
- ✅ Static HTML template for build detection
- ✅ Netlify config file (`netlify.toml`)
- ✅ Error handling and user feedback

---

## 📧 Email Format

You'll receive emails like this:

```
From: Netlify Forms
To: iq.tsebo@gmail.com
Subject: New contact form submission

Name: John Doe
Email: john@example.com
Subject: Inquiry about platform
Message: I'm interested in learning more...
```

---

## 🔍 View Submissions

**In Netlify Dashboard:**
- Go to Forms → contact
- See all submissions with timestamps
- Export to CSV

---

## 💡 Free Tier Limits

- ✅ 100 submissions/month
- ✅ Unlimited forms
- ✅ Email notifications included

---

## 🆘 Troubleshooting

**Not receiving emails?**
1. Check Netlify dashboard → Forms → contact
2. Verify email in Site Settings → Forms
3. Check spam folder

**Form not working?**
1. Make sure site is deployed
2. Check browser console for errors
3. Verify form appears in Netlify dashboard

---

## 📚 Full Documentation

See `NETLIFY_FORMS_SETUP.md` for complete details.

---

**That's it! Your contact form will now send all messages to iq.tsebo@gmail.com** 🎉
