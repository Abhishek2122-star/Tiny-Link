# TinyLink Deployment & Database Setup Guide

This guide covers three ways to set up your TinyLink application:
1. **Local PostgreSQL** (for development/testing)
2. **Neon PostgreSQL** (free cloud database)
3. **Vercel Deployment** (production)

---

## Option 1: Local PostgreSQL Setup

### Step 1: Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Run the installer and follow the setup wizard
- Default port: 5432
- Remember the password you set for the `postgres` user

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database and Schema

**Connect to PostgreSQL:**
```bash
# On Windows (in PowerShell)
$env:PGPASSWORD='your_postgres_password'
psql -U postgres

# On Mac/Linux
psql -U postgres
```

**Run these SQL commands:**
```sql
-- Create database
CREATE DATABASE tinylink;

-- Connect to the database
\c tinylink

-- Create links table
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  short_code VARCHAR(8) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_clicks INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_short_code ON links(short_code);
```

### Step 3: Configure Environment Variables

Create `.env.local` in the project root:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/tinylink
```

### Step 4: Start the Development Server

```bash
cd E:\OneDrive\Desktop\task\tinylink
npm run dev
```

Visit: http://localhost:3000

---

## Option 2: Neon PostgreSQL Setup (Recommended - Free & Easy)

Neon provides a free PostgreSQL database in the cloud with generous limits.

### Step 1: Create Neon Account

1. Go to https://console.neon.tech
2. Sign up with email or GitHub
3. Create a new project (choose "PostgreSQL")

### Step 2: Get Your Connection String

1. In Neon console, click "Connection string" (top right)
2. Select "Node.js" from the dropdown
3. Copy the full connection string

It will look like:
```
postgresql://neon_user:password@ep-xxxx-xxxx.us-east-1.aws.neon.tech/neon_db?sslmode=require
```

### Step 3: Configure Environment Variables

Create `.env.local`:
```env
DATABASE_URL=postgresql://neon_user:password@ep-xxxx-xxxx.us-east-1.aws.neon.tech/neon_db?sslmode=require
```

### Step 4: Initialize Database

Run this once to create the schema:
```bash
npm run init:db
```

Or manually:
```bash
PGPASSWORD=your_password psql -U neon_user -h ep-xxxx-xxxx.us-east-1.aws.neon.tech -d neon_db -f schema.sql
```

### Step 5: Test Locally

```bash
npm run dev
```

---

## Option 3: Deploy to Vercel with Neon PostgreSQL

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Import your TinyLink repository

### Step 2: Add Neon to Vercel

1. In Vercel dashboard, go to your project settings
2. Click "Integrations" → "Browse Marketplace"
3. Search for "Neon" and click "Add Integration"
4. Authorize and select your Neon project
5. Vercel will automatically create DATABASE_URL environment variable

**OR manually add DATABASE_URL:**

1. In Vercel project settings → "Environment Variables"
2. Add new variable:
   - **Name:** `DATABASE_URL`
   - **Value:** (paste your Neon connection string)
   - **Environments:** Production, Preview, Development
3. Click "Add"

### Step 3: Deploy

```bash
cd E:\OneDrive\Desktop\task\tinylink
git push origin main
```

Your app will automatically deploy to Vercel!

### Step 4: Verify Deployment

1. Go to https://tiny-link.vercel.app (or your custom domain)
2. Test creating a link
3. Check Vercel logs for any errors

---

## Database Schema

The application uses this table structure:

```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  short_code VARCHAR(8) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_clicks INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP
);
```

**Fields:**
- `id` - Auto-incrementing primary key
- `short_code` - Unique 6-8 character code (e.g., "abc123")
- `original_url` - The full URL being shortened
- `created_at` - When the link was created
- `total_clicks` - How many times the link was clicked
- `last_clicked_at` - Timestamp of the last click

---

## API Endpoints

### Health Check
```
GET /healthz
Response: { ok: true, version: "1.0" }
```

### Create Link
```
POST /api/links
Body: {
  "originalUrl": "https://example.com/very/long/url",
  "customCode": "mylink" // optional, 6-8 chars
}
Response: { id, short_code, original_url, created_at, total_clicks }
```

### Get All Links
```
GET /api/links
Response: [{ id, short_code, original_url, created_at, total_clicks, last_clicked_at }, ...]
```

### Get Link Stats
```
GET /api/links/:code
Response: { id, short_code, original_url, created_at, total_clicks, last_clicked_at }
```

### Delete Link
```
DELETE /api/links/:code
Response: { success: true }
```

### Redirect (Click Tracking)
```
GET /:code
Returns: 302 redirect to original_url + increments total_clicks
```

---

## Troubleshooting

### Database Connection Error: ECONNREFUSED

**Local PostgreSQL:**
- Make sure PostgreSQL is running
- Check the connection string in `.env.local`
- Verify password is correct

**Neon:**
- Copy the entire connection string from Neon console
- Make sure to include `?sslmode=require` at the end
- Check that IP is whitelisted (Neon allows all IPs by default)

### Port Already in Use

If port 3000 is in use:
```bash
# Windows
Get-Process | Where-Object {$_.Port -eq 3000}

# Kill the process
Stop-Process -Id <PID> -Force

# Or use different port
npm run dev -- -p 3001
```

### SSL Certificate Error

Add to `.env.local`:
```env
NODE_TLS_REJECT_UNAUTHORIZED=0
```

(Only for development, not production)

---

## Quick Reference

| Setup | Cost | Difficulty | Best For |
|-------|------|-----------|----------|
| Local PostgreSQL | Free | Medium | Development |
| Neon PostgreSQL | Free (generous limits) | Easy | Testing & Production |
| Vercel + Neon | Free tier available | Easy | Production |

---

## Next Steps

1. Choose your setup option above
2. Follow the steps for your chosen option
3. Create a `.env.local` file with DATABASE_URL
4. Test the application
5. (Optional) Deploy to Vercel for production

Need help? Check the error messages in the terminal or Vercel logs.
