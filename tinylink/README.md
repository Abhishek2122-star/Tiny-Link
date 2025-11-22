# TinyLink - URL Shortener

A modern, full-stack URL shortener application built with Next.js 16, TypeScript, and Neon PostgreSQL.

## 🚀 Features

- ✅ **Create Short Links** - Generate unique 6-8 character codes for long URLs
- ✅ **Click Tracking** - Automatically track how many times each link is clicked
- ✅ **Statistics Dashboard** - View all your links with click metrics
- ✅ **Redirect Management** - Automatic redirects from short codes to original URLs
- ✅ **Cloud Database** - Data persisted in Neon PostgreSQL (free tier included)
- ✅ **Production Ready** - Deployable to Vercel with one click

## 📋 Tech Stack

- **Frontend:** Next.js 16.0.3 with App Router, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (serverless functions)
- **Database:** Neon PostgreSQL (cloud-hosted, free tier: 3GB storage)
- **Deployment:** Vercel (automatic GitHub integration)
- **Build Tool:** Turbopack (Next.js bundler)

## 🎯 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Abhishek2122-star/Tiny-Link.git
cd Tiny-Link
npm install
```

### 2. Setup Environment Variables
Copy your Neon PostgreSQL connection string to `.env.local`:
```env
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-polished-band-...aws.neon.tech/neondb?sslmode=require
```

### 3. Initialize Database
```bash
npm run init:db
```

### 4. Start Development Server
```bash
npm run dev
```

Visit **http://localhost:3000**

---

## 📚 Documentation

Comprehensive guides are included in this project:

- **[DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md)** - Complete database schema and data operations
- **[NEON_DATA_FLOW.md](./NEON_DATA_FLOW.md)** - Visual diagrams of data flow and lifecycle
- **[NEON_CONSOLE_GUIDE.md](./NEON_CONSOLE_GUIDE.md)** - How to view your data in Neon console
- **[DATA_STORAGE_LOCATION.md](./DATA_STORAGE_LOCATION.md)** - Where data is stored and security details
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Setup guides for local PostgreSQL, Neon, and Vercel
- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Step-by-step production deployment guide

---

## 🔗 Database Schema

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

---

## 📊 API Endpoints

### Get All Links
```bash
GET /api/links
```

### Create Short Link
```bash
POST /api/links
Content-Type: application/json

{
  "originalUrl": "https://www.example.com/very-long-url",
  "customCode": "optional"
}
```

### Get Link Statistics
```bash
GET /api/links/[short_code]
```

### Delete Link
```bash
DELETE /api/links/[short_code]
```

### Redirect to Original URL
```bash
GET /[short_code]
```
Returns 302 redirect to original URL and increments click counter.

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Add environment variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon connection string
6. Click "Deploy"

Your app is now live! 🎉

---

## 💾 Data Stored

Each link record contains:
- **id** - Unique identifier (auto-increment)
- **short_code** - Unique 6-8 character code
- **original_url** - The full URL being shortened
- **created_at** - Timestamp when link was created
- **total_clicks** - Number of times link was clicked
- **last_clicked_at** - Timestamp of most recent click

---

## 🔒 Environment Variables

### Required for Production
```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### Development (Optional)
```env
NODE_ENV=development
```

---

## 📦 Project Structure

```
tinylink/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── code/[code]/page.tsx  # Statistics page
│   ├── [code]/route.ts       # Redirect endpoint
│   ├── api/
│   │   └── links/
│   │       ├── route.ts      # Create/list links
│   │       └── [code]/route.ts # Get/delete specific link
│   └── globals.css           # Global styles
├── lib/
│   ├── db.ts                 # Database connection
│   └── validation.ts         # URL/code validation
├── scripts/
│   └── init-db.js           # Database initialization
├── public/                   # Static assets
├── .env.local               # Environment variables (local only)
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Vercel deployment config
└── package.json             # Dependencies
```

---

## 🧪 Testing

### Test Locally
1. Start dev server: `npm run dev`
2. Create a link via dashboard
3. Click the link to test redirect
4. Check statistics page for click counter
5. View data in Neon console: https://console.neon.tech

### Monitor Logs
```bash
# Development logs
npm run dev

# Build logs
npm run build
```

---

## 🔐 Security Features

✅ **SSL/TLS Encryption** - All database connections encrypted  
✅ **URL Validation** - Invalid URLs rejected  
✅ **Code Uniqueness** - Prevents duplicate short codes  
✅ **Rate Limiting** - Built-in protection against abuse  
✅ **Input Sanitization** - Prevents SQL injection  

---

## 💰 Costs

### Free Tier Included
- **Neon PostgreSQL:** 3GB storage, unlimited reads/writes
- **Vercel Hosting:** 100 function invocations/day free
- **GitHub:** Unlimited public repos

### Upgrade When Needed
- Neon: $0.16/GB for additional storage
- Vercel: Pay-as-you-go for extra compute

---

## 🐛 Troubleshooting

### Database Connection Error
1. Check `.env.local` has correct DATABASE_URL
2. Verify Neon project is active at https://console.neon.tech
3. Run `npm run init:db` to reinitialize schema

### Port Already in Use
```bash
npm run dev -- -p 3001  # Use different port
```

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📖 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Basics](https://www.postgresql.org/docs/)
- [Neon Getting Started](https://neon.tech/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

## 👤 Author

[Abhishek2122-star](https://github.com/Abhishek2122-star)

---

## 📄 License

MIT License - feel free to use this project for personal or commercial use.

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit pull requests.

---

## 📞 Support

- **Issues:** GitHub Issues
- **Email:** Contact via GitHub profile
- **Docs:** See documentation files in project root

---

**Last Updated:** November 22, 2025  
**Status:** ✅ Production Ready
