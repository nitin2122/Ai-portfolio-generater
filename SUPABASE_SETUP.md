# Supabase Setup Guide

## ✅ What's Been Implemented

Your portfolio generator now has full authentication support:
- User sign-up and sign-in functionality
- Protected download feature (users must authenticate to download)
- Auth state management with Supabase
- Beautiful auth modal component
- User email display in navbar
- Sign out functionality

---

## 🔧 Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (create account if needed)
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: e.g., "AI Portfolio Generator"
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose region closest to your users
4. Wait for project to initialize (2-3 minutes)

### Step 2: Get Your Credentials

1. Once project is created, go to **Project Settings** (gear icon)
2. Click **"API"** in the left sidebar
3. Copy these values:
   - **Project URL** → Copy this
   - **Anon (public) Key** → Copy this

### Step 3: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Enable Email Auth in Supabase

1. In your Supabase project, go to **Authentication** → **Providers**
2. Find **Email** and make sure it's enabled (it should be by default)
3. Go to **Authentication** → **Email Templates**
4. The default templates are fine for development

### Step 5: Configure Email Redirect (Optional but Recommended)

1. Go to **Authentication** → **URL Configuration**
2. Add your local development URL:
   - Site URL: `http://localhost:5173`
3. (In production, update to your deployment URL)

---

## 🚀 Features Available

### For Users:
- **Sign In Button**: Click "SIGN IN" in top-right navbar
- **Sign Up**: New users click "Sign Up" in the auth modal
- **Protected Download**: All download buttons (PDF, PNG, etc.) now require authentication
- **Sign Out**: Authenticated users see their email and a "SIGN OUT" button

### What Gets Authenticated:
- Download portfolio as PDF
- Download portfolio as PNG
- Any export functionality (requires login before download)

---

## 📝 How It Works

1. **User opens app** → Navbar shows "SIGN IN" button
2. **Click SIGN IN** → Auth modal opens
3. **User signs up/in** → Supabase authenticates them
4. **Navbar updates** → Shows user email and "SIGN OUT" button
5. **Generate & Download** → User can now download portfolios
6. **Download blocked** → If not authenticated, gets redirected to auth modal

---

## 🔐 Security Notes

- Your `VITE_SUPABASE_ANON_KEY` is safe to expose (it's public)
- Never commit `.env.local` to git (it's already in `.gitignore`)
- In production, update URL Configuration with your deployment domain
- Supabase automatically handles password hashing and security

---

## 🧪 Testing

1. Visit `http://localhost:5173`
2. Click the "SIGN IN" button
3. Create a test account or sign in
4. Generate a portfolio and try to download
5. Download should succeed (you're authenticated)
6. Click "SIGN OUT"
7. Try to download again → Should redirect to auth modal

---

## 📞 Troubleshooting

### Error: "Missing Supabase environment variables"
- Check `.env.local` has both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after updating `.env.local`

### Auth modal not appearing
- Make sure you're using the latest code
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh the page

### Can't sign up
- Check that Email provider is enabled in Supabase project
- Verify your `.env.local` values are correct and copied fully

### Still having issues?
- Check Supabase project is created and initialized
- Verify API credentials are correct
- Ensure `.env.local` is in the project root (not in src/)

---

## 📊 Database Structure

Supabase handles authentication for you! You don't need to create any tables manually. The `auth` schema in your database will automatically store:

- User accounts
- Email addresses
- Password hashes
- Session tokens
- Email verification status

---

## 🎉 You're All Set!

Your portfolio app now has enterprise-grade authentication. Users must authenticate to download their beautiful portfolios. Start testing and deploy when ready!

**Next steps:**
- Test sign in/sign up locally
- Generate test portfolios
- When deploying, update `.env` with production Supabase URL
