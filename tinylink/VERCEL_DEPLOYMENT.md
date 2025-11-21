# Deploy TinyLink to Vercel with Neon PostgreSQL

This guide walks through deploying your TinyLink application to Vercel with a free Neon PostgreSQL database.

## Prerequisites

- GitHub account (with TinyLink repository pushed)
- Vercel account (free tier available)
- Neon account (free tier with generous limits)

---

## Step 1: Set Up Neon Database

### 1.1 Create Neon Account

1. Go to https://console.neon.tech
2. Click "Sign Up"
3. Sign in with GitHub (recommended) or email
4. Verify your email

### 1.2 Create Neon Project

1. Click "Create a new project"
2. Choose name: `tinylink-prod`
3. Select region closest to you (or `us-east-1`)
4. Click "Create"

### 1.3 Get Connection String

1. In Neon console, click the project
2. Click "Connection strings" (top right area)
3. In the dropdown, select "Node.js"
4. Copy the full connection string

**Example format:**
```
postgresql://neon_user:neon_password@ep-xxxxx-xxxxx.us-east-1.aws.neon.tech/neon_db?sslmode=require
```

### 1.4 Initialize Database Schema

You have two options:

**Option A: Using Vercel Environment Variables**
1. Skip to Step 2, set DATABASE_URL in Vercel
2. After deployment, run the init script via Vercel CLI or SSH

**Option B: Using SQL Editor (Recommended)**
1. In Neon console, click "SQL Editor" (left sidebar)
2. Paste this SQL and execute:
```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  short_code VARCHAR(8) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_clicks INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP
);

CREATE INDEX idx_short_code ON links(short_code);
CREATE INDEX idx_created_at ON links(created_at DESC);
```

---

## Step 2: Set Up Vercel Project

### 2.1 Connect GitHub Repository

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Search for `Tiny-Link` repository
5. Click "Import"

### 2.2 Configure Environment Variables

1. In the import dialog, scroll to "Environment Variables"
2. Add new variable:
   - **Name:** `DATABASE_URL`
   - **Value:** (paste your Neon connection string from Step 1.3)
   - **Environments:** Select all (Production, Preview, Development)
3. Click "Add"
4. Click "Deploy"

**Vercel will now build and deploy your project!**

---

## Step 3: Verify Deployment

### 3.1 Check Deployment Status

1. After clicking "Deploy", Vercel will show build logs
2. Wait for "✅ Production deployment completed"
3. Click "Visit" to view your deployed site

### 3.2 Test Your Application

1. Open https://tiny-link.vercel.app (or your custom domain)
2. You should see the TinyLink dashboard
3. Try creating a link:
   - Enter: `https://github.com`
   - Custom code: `github`
   - Click "Create Short Link"
4. Verify link appears in the table
5. Click the link to test redirection

### 3.3 Check Logs for Errors

If something goes wrong:
1. In Vercel dashboard, click your project
2. Click "Deployments"
3. Click the latest deployment
4. Click "Runtime logs" to see errors
5. Common error: `DATABASE_URL not found` → add it to Environment Variables
6. Common error: `ECONNREFUSED` → check Neon connection string is correct

---

## Step 4: Set Up Custom Domain (Optional)

1. In Vercel project settings, click "Domains"
2. Enter your custom domain (e.g., `tiny-link.com`)
3. Follow DNS setup instructions from your domain registrar
4. Wait for DNS propagation (can take up to 48 hours)

---

## Step 5: Monitor and Maintain

### View Application Logs
```bash
# If using Vercel CLI
vercel logs --tail
```

### Update Code and Redeploy
```bash
git push origin main
# Vercel automatically redeploys on push
```

### Check Database Usage
1. Go to https://console.neon.tech
2. View connection statistics
3. Neon free tier includes:
   - 3 projects
   - 10 branches per project
   - 5 GB storage per project
   - Unlimited API calls

### Backup Your Data
1. Use Neon's backup features
2. Or export via SQL:
   ```sql
   SELECT * FROM links;
   ```

---

## Troubleshooting Deployment

### Build Failed

**Error:** `npm ERR! code ENOENT`
- Solution: Check `package.json` has all dependencies

**Error:** `Cannot find module 'pg'`
- Solution: Run `npm install` locally, then push to GitHub

### Database Connection Issues

**Error:** `ECONNREFUSED`
- Solution: DATABASE_URL not set in Vercel → Add to Environment Variables

**Error:** `SSL: CERTIFICATE_VERIFY_FAILED`
- Solution: Neon connection strings include `?sslmode=require` - keep it!

**Error:** `password authentication failed`
- Solution: Check DATABASE_URL is copied exactly from Neon console

### API Returns 500 Error

1. Check Vercel logs: Deployments → Runtime logs
2. Common causes:
   - Missing DATABASE_URL environment variable
   - Database schema not created (run init-db)
   - PostgreSQL connection string format error

### Slow Performance

1. Check Neon database region matches Vercel region
2. Monitor database connections in Neon console
3. Optimize queries in `lib/db.ts`

---

## Useful Commands

```bash
# Test locally with production config
DATABASE_URL='your_neon_string' npm run dev

# Build for production
npm run build

# Start production server
npm start

# Initialize database from command line
DATABASE_URL='your_neon_string' node scripts/init-db.js
```

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend + API)         │
│  https://tiny-link.vercel.app           │
│                                         │
│  ├─ Next.js App Router                  │
│  ├─ React Components                    │
│  └─ API Routes (/api/links/*)           │
└────────────────┬────────────────────────┘
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────┐
│    Neon PostgreSQL (Database)           │
│  ep-xxxxx-xxxxx.us-east-1.aws.neon.tech │
│                                         │
│  ├─ links table                         │
│  ├─ short_code index                    │
│  └─ created_at index                    │
└─────────────────────────────────────────┘
```

---

## Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | ✅ Yes (with limits) | $0-20/month |
| Neon | ✅ Yes (3 projects, 5GB) | $0-50/month |
| **Total** | **$0** | **$0-70/month** |

Both services offer generous free tiers suitable for most use cases!

---

## Next Steps

1. ✅ Create Neon account and project
2. ✅ Get DATABASE_URL connection string
3. ✅ Create Vercel account and import repository
4. ✅ Add DATABASE_URL to Vercel environment variables
5. ✅ Deploy and test
6. ✅ Share your deployed app!

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Next.js Docs:** https://nextjs.org/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

Your TinyLink application is now live! 🚀
