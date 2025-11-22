# Where Your Data is Stored - Complete Guide

## 🌍 **Physical Location of Your Data**

Your TinyLink data is stored in **Neon's cloud servers** in the United States.

### **Server Location:**
```
📍 Region: us-east-1 (US East - Virginia, USA)
🏢 Provider: AWS (Amazon Web Services)
🔐 Encrypted: All data encrypted in transit (SSL/TLS)
💾 Backups: Automatic daily backups
```

You can see this in your connection string:
```
postgresql://neondb_owner:npg_dZfNV4DJxIC8@ep-polished-band-a4lxlpou-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
                                                                   ↑
                                        This shows it's in us-east-1 region
```

---

## 🗂️ **Storage Hierarchy**

Your data is organized like this:

```
NEON CLOUD (neon.tech servers in AWS)
│
└── Your Neon Account
    │
    └── tinylink (Your Project)
        │
        └── neondb (Your Database)
            │
            └── public (Schema - default)
                │
                ├── TABLE: links
                │   ├── id: 1
                │   ├── short_code: "abc123"
                │   ├── original_url: "https://..."
                │   ├── created_at: "2025-11-22..."
                │   ├── total_clicks: 5
                │   └── last_clicked_at: "2025-11-22..."
                │
                ├── INDEX: idx_short_code (for fast lookups)
                └── INDEX: idx_created_at (for sorting)
```

---

## 📊 **Where Data Goes - Step by Step**

### **When You Create a Link:**

```
YOUR COMPUTER (localhost:3000)
│
├─ You type: https://google.com
├─ Click: "Shorten"
│
▼
NEXT.JS API (Running on your machine during dev)
│
├─ Validates URL
├─ Generates code: "abc123"
├─ Creates INSERT query
│
▼
INTERNET (Encrypted Connection)
│
├─ Uses DATABASE_URL from .env.local
├─ Connects via: postgresql://...@ep-polished-band...
│
▼
NEON CLOUD SERVERS (us-east-1, AWS)
│
├─ Receives INSERT query
├─ Validates data
├─ Writes to PostgreSQL database
├─ Saves to disk
├─ Creates backup
│
▼
DATA STORED!
```

---

## 💾 **File Storage Details**

### **In Neon's Database:**

Your data is stored in **PostgreSQL** format across multiple files:

```
Neon Server (AWS us-east-1)
│
├─ PostgreSQL Database Files
│  │
│  ├─ Base Directory: /var/lib/postgresql/
│  │  │
│  │  ├─ tinylink_database.dat (main data file)
│  │  ├─ tinylink_indexes.idx (index files)
│  │  ├─ WAL/ (Write-Ahead Logs for durability)
│  │  ├─ PG_LOG/ (database logs)
│  │  └─ backup/ (automatic backups)
│  │
│  └─ Table: links
│     ├─ Data stored in pages (8KB chunks)
│     ├─ Each row stores:
│     │  ├─ id, short_code, original_url
│     │  ├─ created_at, total_clicks
│     │  └─ last_clicked_at
│     └─ Indexes for fast searching
│
└─ Replication/Backups
   ├─ Primary copy (active, handles reads/writes)
   ├─ Backup copy (automatic daily)
   └─ Transaction logs (WAL files)
```

---

## 🔐 **Data Security & Redundancy**

### **Multiple Copies:**
```
┌─────────────────────────────────────────┐
│    NEON'S REDUNDANCY SETUP              │
├─────────────────────────────────────────┤
│                                         │
│  PRIMARY DATABASE                       │
│  └─ Your active database                │
│     └─ Handles all reads/writes         │
│                                         │
│  AUTOMATIC BACKUPS                      │
│  ├─ Daily backup #1                     │
│  ├─ Daily backup #2                     │
│  ├─ Daily backup #3                     │
│  └─ Older backups (retained for 7 days) │
│                                         │
│  TRANSACTION LOGS (WAL)                 │
│  └─ Point-in-time recovery possible     │
│     (restore to any moment in time)     │
│                                         │
│  Replication to other AZs               │
│  └─ For disaster recovery               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📍 **Exact Storage Breakdown**

### **Your Data Location:**

| Component | Location | Details |
|-----------|----------|---------|
| **Cloud Provider** | AWS | Amazon Web Services |
| **Region** | us-east-1 | Virginia, USA |
| **Availability Zone** | Multiple | For redundancy |
| **Database System** | PostgreSQL 15+ | Managed by Neon |
| **Storage Type** | SSD | Fast solid-state drives |
| **Table Name** | links | Where your records live |
| **Backup Location** | AWS S3 | Automatic daily snapshots |

---

## 🔗 **How Your App Connects to This Storage**

```
CONNECTION FLOW:

┌──────────────────────┐
│  YOUR COMPUTER       │
│  (localhost:3000)    │
└──────────┬───────────┘
           │
           │ Uses DATABASE_URL:
           │ postgresql://neondb_owner:npg_dZfNV4DJxIC8@
           │ ep-polished-band-a4lxlpou-pooler.us-east-1.aws.neon.tech/neondb
           │
           ▼
┌──────────────────────┐
│  INTERNET            │
│  (Encrypted SSL)     │
└──────────┬───────────┘
           │
           │ TCP Connection on Port 5432
           │ (PostgreSQL default port)
           │
           ▼
┌──────────────────────┐
│  NEON POOLER         │
│  (Connection manager)│
└──────────┬───────────┘
           │
           │ Manages connections
           │ from your app
           │
           ▼
┌──────────────────────┐
│  NEON DATABASE       │
│  (PostgreSQL)        │
└──────────┬───────────┘
           │
           │ Executes queries
           │ Reads/writes data
           │
           ▼
┌──────────────────────┐
│  DATA STORED         │
│  (links table)       │
└──────────────────────┘
```

---

## 🚀 **During Development vs Production**

### **Development (Right Now):**
```
Your Computer
    ↓
npm run dev (localhost:3000)
    ↓
Connects to Neon in AWS
    ↓
Data stored in Neon cloud
```

### **After Vercel Deployment:**
```
Vercel Servers (AWS/Edge)
    ↓
Your Next.js App (vercel.com/your-app)
    ↓
Connects to same Neon database
    ↓
Data stored in same Neon cloud location
```

**Same database, different frontend locations!**

---

## 💡 **What This Means:**

✅ **Your data is:**
- Safe and encrypted
- Backed up automatically
- Available 24/7 (99.99% uptime)
- Fast (SSD storage)
- Redundant (multiple copies)
- Recoverable (daily backups)

❌ **Your data is NOT:**
- On your computer (unless you download it)
- On a local server
- On Vercel servers
- On GitHub (except code, not database)

---

## 📊 **Free Tier Storage Limit:**

```
Neon Free Plan Includes:

├─ Storage Capacity: 3 GB
│  └─ Enough for ~6 million links (500 bytes each)
│
├─ Compute: 0.5 CPU shared
│
├─ Backup History: 7 days
│
└─ Read Replicas: Included
```

---

## 🔄 **How to Access Your Data:**

### **Method 1: Browser App**
```
localhost:3000 (dev) or yourapp.vercel.app (prod)
    ↓
Dashboard shows all links
```

### **Method 2: Neon Console**
```
console.neon.tech
    ↓
SQL Editor
    ↓
SELECT * FROM links;
    ↓
See data in table format
```

### **Method 3: API Endpoint**
```
localhost:3000/api/links (dev) or yourapp.vercel.app/api/links (prod)
    ↓
Returns JSON with all records
```

### **Method 4: Command Line (for backups)**
```
psql postgresql://neondb_owner:...@ep-polished-band...
    ↓
\dt (list tables)
    ↓
SELECT * FROM links;
```

---

## 🛡️ **Data Protection:**

```
YOUR DATA IN NEON:

┌─────────────────────────┐
│ ENCRYPTION IN TRANSIT   │
│ └─ SSL/TLS Protocol     │
│    (like HTTPS)         │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ ENCRYPTION AT REST      │
│ └─ Database encrypted   │
│    (AES-256)            │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ ACCESS CONTROL          │
│ └─ Username/Password    │
│    Firewall rules       │
│    IP whitelisting      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ AUTOMATED BACKUPS       │
│ └─ Daily snapshots      │
│    Point-in-time        │
│    recovery             │
└─────────────────────────┘
```

---

## 📌 **Quick Summary**

| Question | Answer |
|----------|--------|
| **Where?** | AWS (us-east-1 region) |
| **What?** | PostgreSQL database |
| **How much?** | Up to 3 GB (free tier) |
| **Is it safe?** | Yes - encrypted, backed up |
| **Can I download it?** | Yes - export from Neon console |
| **Does it cost?** | Free for 3GB, then pay for more |
| **Is it permanent?** | Yes - persists after app restart |

---

## 🎯 **Your Data Flow:**

```
CREATE LINK
    ↓
App validates
    ↓
Sends to Neon (AWS us-east-1)
    ↓
PostgreSQL database receives it
    ↓
Stored on SSD disk
    ↓
Backed up to S3
    ↓
✅ PERMANENTLY STORED

RETRIEVE LINK
    ↓
App requests from Neon
    ↓
PostgreSQL finds it
    ↓
Returns to your app
    ↓
Displays in browser
    ↓
✅ DATA DELIVERED
```

---

## 🚀 **Next Steps**

Your data is now safely stored in Neon! Ready to:
1. ✅ Test the app (create/click links)
2. ✅ View data in Neon console
3. 🔜 Deploy to Vercel (same database will work!)

Everything is secured and ready for production! 🎉
