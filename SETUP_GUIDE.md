# SEFGH Application - Complete Setup Guide

This guide will walk you through setting up the entire SEFGH application from scratch.

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier is fine)
- Git installed

## Step 1: Clone the Repository

```bash
git clone https://github.com/Adeel0-0/sefgh-ui.git
cd sefgh-ui
```

## Step 2: Set Up Supabase Project

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project Name**: SEFGH
   - **Database Password**: (choose a strong password)
   - **Region**: (choose closest to you)
4. Click "Create new project"
5. Wait for project to be ready (1-2 minutes)

### 2.2 Get Your Supabase Credentials
1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Note down:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon / public key** (for client-side)
   - **service_role / secret key** (for server-side)

### 2.3 Run Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `/server/database/schema.sql` in your local repository
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`
7. Verify no errors occurred

## Step 3: Configure Server Environment

### 3.1 Install Server Dependencies
```bash
cd server
npm install
```

### 3.2 Create Server Environment File
```bash
cp .env.example .env
```

### 3.3 Edit `/server/.env`
Open `/server/.env` and update with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

**Important:**
- Replace `your-project-id` with your actual project ID
- Replace `your-anon-key-here` with your anon/public key
- Replace `your-service-role-key-here` with your service_role key

### 3.4 Test Server
```bash
npm run dev
```

You should see:
```
🚀 SEFGH API Server running on port 3001
📍 Health check: http://localhost:3001/api/health
```

Test the health endpoint:
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "SEFGH API Server is running",
  "timestamp": "2025-10-30T..."
}
```

Keep this terminal open with the server running.

## Step 4: Configure Client Environment

### 4.1 Install Client Dependencies
Open a **new terminal** and:

```bash
cd client
npm install
```

### 4.2 Create Client Environment File
```bash
cp .env.example .env.local
```

### 4.3 Edit `/client/.env.local`
Open `/client/.env.local` and add:

```env
# Supabase Configuration (use anon key ONLY)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# API Server URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Important:**
- Only use the **anon/public key** for the client
- Never use the service_role key in client-side code
- Make sure URLs have no trailing slashes

## Step 5: Run the Application

### 5.1 Start the Client
```bash
cd client
npm run dev
```

You should see:
```
▲ Next.js 15.5.6
- Local:        http://localhost:3000
- Environments: .env.local
```

### 5.2 Verify Setup
Open your browser and go to:
```
http://localhost:3000
```

You should see the SEFGH welcome screen.

## Step 6: Test Authentication

### 6.1 Create Test User
1. In Supabase dashboard, go to **Authentication**
2. Click **Add user** > **Create new user**
3. Fill in:
   - **Email**: test@example.com
   - **Password**: Test123456!
   - **Auto Confirm User**: ✓ (check this)
4. Click **Create user**

### 6.2 Test Login
In the application:
1. Click on any feature that requires auth
2. Sign in with your test credentials
3. Verify you can access protected features

## Step 7: Verify Database Integration

### 7.1 Check Tables
In Supabase **Table Editor**, you should see:
- user_profiles
- chat_sessions
- chat_messages
- shareable_links
- link_analytics
- link_permissions
- user_settings

### 7.2 Check RLS Policies
In **Database** > **Policies**, verify:
- All tables have RLS enabled (green shield icon)
- Multiple policies exist for each table

## Common Issues & Solutions

### Issue: "Failed to fetch"
**Solution:** Ensure the server is running on port 3001
```bash
# Check if server is running
curl http://localhost:3001/api/health
```

### Issue: "Unauthorized" or "No token provided"
**Solution:** 
1. Check you're signed in
2. Verify SUPABASE_ANON_KEY is correct in client `.env.local`
3. Check browser console for auth errors

### Issue: "relation does not exist"
**Solution:** 
1. Verify database schema was run successfully
2. Check you're connected to the correct Supabase project
3. Re-run the schema.sql if needed

### Issue: "CORS error"
**Solution:**
1. Check CLIENT_URL in server `.env` matches client URL
2. Verify server is running
3. Clear browser cache

### Issue: Build errors
**Solution:**
```bash
# Clear Next.js cache
cd client
rm -rf .next
npm run build
```

## Development Workflow

### Start Both Servers
You'll need 2 terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Making Changes
1. Edit files in `/client` for frontend changes
2. Edit files in `/server` for backend changes
3. Changes are auto-reloaded in development mode

### Testing API Endpoints
Use tools like:
- **curl** (command line)
- **Postman** (GUI application)
- **Thunder Client** (VS Code extension)

Example:
```bash
# Get auth token from browser dev tools (Application > Local Storage)
TOKEN="your-token-here"

# Test profile endpoint
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3001/api/profile
```

## Production Deployment

### Environment Variables for Production
Update environment variables:

**Server:**
- Use production Supabase project
- Set `NODE_ENV=production`
- Update `CLIENT_URL` to production domain

**Client:**
- Update `NEXT_PUBLIC_API_URL` to production API URL
- Update Supabase URLs to production project

### Build Commands
```bash
# Build frontend
cd client
npm run build
npm start

# Start backend
cd server
npm start
```

## Additional Resources

- [API Documentation](server/API_DOCUMENTATION.md)
- [Database Setup Guide](server/database/README.md)
- [Refactoring Blueprint](REFACTORING_BLUEPRINT.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Getting Help

If you encounter issues:
1. Check this guide thoroughly
2. Review error messages carefully
3. Check browser console for client errors
4. Check server terminal for backend errors
5. Verify all environment variables are correct
6. Ensure Supabase project is active

## Security Checklist

Before going to production:
- [ ] Change default passwords
- [ ] Use strong service_role key
- [ ] Enable rate limiting
- [ ] Set up proper CORS origins
- [ ] Review RLS policies
- [ ] Enable 2FA on Supabase account
- [ ] Set up monitoring and alerts
- [ ] Review and test all permissions

## Success Checklist

You're all set up when:
- [ ] Server running on http://localhost:3001
- [ ] Client running on http://localhost:3000
- [ ] Can access welcome page
- [ ] Can sign in with test user
- [ ] Database tables visible in Supabase
- [ ] RLS policies active
- [ ] No console errors
- [ ] API health check returns OK

---

**Congratulations!** 🎉 Your SEFGH application is now fully set up and ready for development.
