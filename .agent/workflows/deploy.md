---
description: Steps to deploy the Peluqueria Canina app to Vercel
---

# Deploying to Vercel

### 1. Push to GitHub
If you haven't already, push your local code to a GitHub repository.

### 2. Connect to Vercel
1. Go to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.

### 3. Configure Environment Variables
In the Vercel project settings, go to **Environment Variables** and add:
- `NEXT_PUBLIC_SUPABASE_URL`: (Your Supabase URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)

### 4. Supabase URL Configuration
After deployment, Vercel will give you a production URL (e.g., `https://peluqueria-canina.vercel.app`).
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **Authentication** -> **URL Configuration**.
3. Set **Site URL** to your Vercel URL.
4. Add the same URL to **Redirect URLs** (e.g., `https://peluqueria-canina.vercel.app/**`).

### 5. Deploy
Click **Deploy**! Vercel will build and host your application.
