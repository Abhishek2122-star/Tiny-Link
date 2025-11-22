# TinyLink Database Structure - Neon PostgreSQL

## 📊 Database Overview

Your Neon PostgreSQL database stores all the data for the TinyLink URL shortener application. Here's exactly what gets saved:

---

## 📋 Database Table: `links`

### Table Schema

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

### Column Details

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| **id** | SERIAL (Integer) | Auto-incrementing primary key | `1`, `2`, `3` |
| **short_code** | VARCHAR(8) | Unique 6-8 character code (case-sensitive) | `abc123`, `xyz789` |
| **original_url** | TEXT | The full URL being shortened | `https://www.google.com/search?q=hello` |
| **created_at** | TIMESTAMP | When the link was created (auto-set) | `2025-11-22 10:30:45.123456` |
| **total_clicks** | INTEGER | Number of times this link was clicked | `42`, `0`, `1000` |
| **last_clicked_at** | TIMESTAMP | When the link was last accessed | `2025-11-22 15:45:30.654321` |

---

## 💾 Data Flow & Operations

### 1️⃣ **Creating a Short Link** (POST `/api/links`)

**Input Data:**
```json
{
  "originalUrl": "https://www.example.com/very-long-url-here",
  "customCode": "optional" // optional, auto-generated if not provided
}
```

**Saved in Neon:**
```sql
INSERT INTO links (short_code, original_url) 
VALUES ('abc123', 'https://www.example.com/very-long-url-here');
```

**Database Record Created:**
```
id:               1
short_code:       abc123
original_url:     https://www.example.com/very-long-url-here
created_at:       2025-11-22 10:30:45.123456
total_clicks:     0 (initially)
last_clicked_at:  NULL (no clicks yet)
```

**Response to Frontend:**
```json
{
  "id": 1,
  "short_code": "abc123",
  "original_url": "https://www.example.com/very-long-url-here",
  "created_at": "2025-11-22T10:30:45.123456Z",
  "total_clicks": 0,
  "last_clicked_at": null
}
```

---

### 2️⃣ **Clicking a Short Link** (GET `/:code`)

**Action:** User visits `http://tinylink.app/abc123`

**What Happens in Neon:**
```sql
UPDATE links 
SET total_clicks = total_clicks + 1, 
    last_clicked_at = CURRENT_TIMESTAMP 
WHERE short_code = 'abc123';
```

**Before Click:**
```
id:               1
short_code:       abc123
original_url:     https://www.example.com/very-long-url-here
created_at:       2025-11-22 10:30:45.123456
total_clicks:     5
last_clicked_at:  2025-11-22 14:20:00.123456
```

**After Click:**
```
id:               1
short_code:       abc123
original_url:     https://www.example.com/very-long-url-here
created_at:       2025-11-22 10:30:45.123456
total_clicks:     6 ← incremented
last_clicked_at:  2025-11-22 15:45:30.654321 ← updated
```

**Then Redirects to:** `https://www.example.com/very-long-url-here` (HTTP 302)

---

### 3️⃣ **Fetching All Links** (GET `/api/links`)

**Database Query:**
```sql
SELECT id, short_code, original_url, created_at, total_clicks, last_clicked_at 
FROM links 
ORDER BY created_at DESC;
```

**Response Example:**
```json
[
  {
    "id": 2,
    "short_code": "xyz789",
    "original_url": "https://github.com/Abhishek2122-star/Tiny-Link",
    "created_at": "2025-11-22T11:00:00.000000Z",
    "total_clicks": 23,
    "last_clicked_at": "2025-11-22T15:40:00.000000Z"
  },
  {
    "id": 1,
    "short_code": "abc123",
    "original_url": "https://www.example.com/very-long-url-here",
    "created_at": "2025-11-22T10:30:45.123456Z",
    "total_clicks": 6,
    "last_clicked_at": "2025-11-22T15:45:30.654321Z"
  }
]
```

---

### 4️⃣ **Getting Link Stats** (GET `/api/links/[code]`)

**Database Query:**
```sql
SELECT * FROM links WHERE short_code = 'abc123';
```

**Response:**
```json
{
  "id": 1,
  "short_code": "abc123",
  "original_url": "https://www.example.com/very-long-url-here",
  "created_at": "2025-11-22T10:30:45.123456Z",
  "total_clicks": 6,
  "last_clicked_at": "2025-11-22T15:45:30.654321Z"
}
```

---

### 5️⃣ **Deleting a Link** (DELETE `/api/links/[code]`)

**Database Query:**
```sql
DELETE FROM links WHERE short_code = 'abc123';
```

**Before:** Record with id=1 exists
**After:** Record with id=1 is removed completely

---

## 🔒 Data Safety & Constraints

### Unique Constraint
```sql
CONSTRAINT: short_code UNIQUE NOT NULL
```
- Each `short_code` must be unique
- Cannot have two links with the same short code
- Prevents: `abc123` from being used twice

### Primary Key
```sql
CONSTRAINT: id PRIMARY KEY
```
- Each record has a unique ID
- Auto-increments: 1, 2, 3, 4...
- Used internally for relationships

### Indexes (for Performance)
```sql
CREATE INDEX idx_short_code ON links(short_code);
CREATE INDEX idx_created_at ON links(created_at DESC);
```
- Speeds up lookups by `short_code`
- Speeds up sorting by `created_at`

---

## 📊 Example Database State

After creating 3 links and clicking them:

```
┌────┬──────────┬─────────────────────────────────┬──────────────────────┬──────────────┬──────────────────────┐
│ id │ short_code│ original_url                    │ created_at           │ total_clicks │ last_clicked_at      │
├────┼──────────┼─────────────────────────────────┼──────────────────────┼──────────────┼──────────────────────┤
│ 1  │ abc123   │ https://google.com/search...    │ 2025-11-22 10:30:45  │ 6            │ 2025-11-22 15:45:30  │
│ 2  │ xyz789   │ https://github.com/user/repo    │ 2025-11-22 11:00:00  │ 23           │ 2025-11-22 15:40:00  │
│ 3  │ qwe456   │ https://www.youtube.com/watch...│ 2025-11-22 12:15:30  │ 0            │ NULL                 │
└────┴──────────┴─────────────────────────────────┴──────────────────────┴──────────────┴──────────────────────┘
```

---

## 🔍 How to View Data in Neon Console

1. Go to **https://console.neon.tech**
2. Select your project: **tinylink**
3. Click **"SQL Editor"** (left sidebar)
4. Run this query:

```sql
SELECT * FROM links;
```

5. You'll see all your links with their stats!

---

## 📈 Data Growth Over Time

| Scenario | Records Stored | Storage Size |
|----------|-----------------|--------------|
| 10 links | ~10 rows | ~2 KB |
| 100 links | ~100 rows | ~20 KB |
| 1,000 links | ~1,000 rows | ~200 KB |
| 10,000 links | ~10,000 rows | ~2 MB |

**Neon Free Tier Includes:**
- 3 GB storage (plenty for millions of links)
- Unlimited read/write operations
- Automatic backups

---

## 🛡️ Data Privacy

✅ **What's stored:**
- URLs you create links for (public links you share)
- Click statistics
- Creation timestamps

❌ **What's NOT stored:**
- User credentials (no login system in basic version)
- IP addresses of who clicked
- User identities
- Cookies or session data

---

## 🚀 Production Considerations

When deploying to production:

1. **Database Backups** - Neon handles automatic daily backups
2. **Scalability** - Neon auto-scales read replicas
3. **Security** - All connections use SSL/TLS encryption
4. **Monitoring** - Check Neon console for query performance

---

## 📝 Summary

**In your Neon database, you're storing:**
- 📝 Original URLs (the links you shorten)
- 🔗 Short codes (the unique 6-8 character codes)
- 📊 Click statistics (total clicks & last click time)
- 🕐 Timestamps (when links were created)

**That's it!** Clean, simple, and efficient.
