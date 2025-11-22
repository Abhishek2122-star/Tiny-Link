# How to View Your Data in Neon Console

## 🔗 Step-by-Step Guide

### **Step 1: Go to Neon Console**
Open this URL in your browser:
```
https://console.neon.tech
```

---

### **Step 2: Login**
- Use your email or GitHub account
- Enter your password if prompted
- You'll see your dashboard

---

### **Step 3: Select Your Project**
Look for **"tinylink"** in the projects list on the left sidebar.

If you see multiple projects:
- Click on **"tinylink"** 
- (This is the project you created)

---

### **Step 4: Click "SQL Editor"**

In the left sidebar, you'll see several options:
```
tinylink (project name)
├── Overview
├── Branches
├── SQL Editor  ← CLICK HERE
├── Tables
├── Roles
└── Settings
```

Click **"SQL Editor"**

---

### **Step 5: Run the Query**

In the SQL Editor, you'll see a white text box. Copy and paste this:

```sql
SELECT * FROM links;
```

Then click the **"Execute"** button (green play button).

---

### **Step 6: View Results**

You'll see a table with your data:

```
┌────┬──────────┬─────────────────────────────────┬──────────────────────┬──────────────┬──────────────────────┐
│ id │short_code│ original_url                    │ created_at           │ total_clicks │ last_clicked_at      │
├────┼──────────┼─────────────────────────────────┼──────────────────────┼──────────────┼──────────────────────┤
│ 1  │ abc123   │ https://www.google.com          │ 2025-11-22 10:30:45  │ 5            │ 2025-11-22 15:45:30  │
│ 2  │ xyz789   │ https://github.com/user/repo    │ 2025-11-22 11:00:00  │ 0            │ NULL                 │
│ 3  │ qwe456   │ https://www.youtube.com/watch...│ 2025-11-22 12:15:30  │ 12           │ 2025-11-22 14:20:00  │
└────┴──────────┴─────────────────────────────────┴──────────────────────┴──────────────┴──────────────────────┘
```

---

## 📍 Visual Guide

### **Neon Console Layout**

```
┌─────────────────────────────────────────────────────────────┐
│  Neon Console (https://console.neon.tech)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ LEFT SIDEBAR              │  MAIN AREA                      │
│ ─────────────────────     │  ───────────────────────────   │
│                           │                                 │
│ 🏠 Home                   │  SQL EDITOR                     │
│                           │  ─────────────────────────     │
│ 📁 tinylink (your project)│                                 │
│    ├── Overview           │  [Dropdown: Select Database]   │
│    ├── Branches           │  [Dropdown: Public]            │
│    ├── SQL Editor ← HERE  │                                 │
│    ├── Tables             │  SELECT * FROM links;          │
│    ├── Roles              │  __________ (text area)        │
│    └── Settings           │  [Execute Button] [Clear]      │
│                           │                                 │
│                           │  RESULTS:                       │
│ 🔐 Account Settings      │  ─────────────────────────     │
│ 🎨 Appearance             │                                 │
│                           │  ┌──────────┬─────────┬─────┐  │
│                           │  │ id       │ code    │ url │  │
│                           │  ├──────────┼─────────┼─────┤  │
│                           │  │ 1        │ abc123  │ ... │  │
│                           │  │ 2        │ xyz789  │ ... │  │
│                           │  └──────────┴─────────┴─────┘  │
│                           │                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Other Ways to View Data in Neon

### **Option 1: Tables View (Easiest)**

Instead of SQL Editor, you can also:

1. Click **"Tables"** in the left sidebar
2. Click on the **"links"** table
3. You'll see a UI showing all records without writing SQL

```
Tables
├── links ← Click here
    ├── View data in table format
    ├── No SQL needed
    ├── Can filter and sort
    └── Can see column details
```

---

### **Option 2: View Connection String**

To verify your database connection:

1. Click **"Connection"** (top of page)
2. Select **"Node.js"** from dropdown
3. You'll see your DATABASE_URL
4. This is what you put in `.env.local`

---

## 📊 Useful SQL Queries for Neon

### **See All Links**
```sql
SELECT * FROM links;
```

### **See Links Ordered by Most Clicks**
```sql
SELECT * FROM links ORDER BY total_clicks DESC;
```

### **See Recently Created Links**
```sql
SELECT * FROM links ORDER BY created_at DESC;
```

### **Count Total Links**
```sql
SELECT COUNT(*) as total_links FROM links;
```

### **See Average Clicks**
```sql
SELECT AVG(total_clicks) as avg_clicks FROM links;
```

### **See Link with Most Clicks**
```sql
SELECT * FROM links ORDER BY total_clicks DESC LIMIT 1;
```

### **Delete a Link**
```sql
DELETE FROM links WHERE short_code = 'abc123';
```

---

## ✅ What You Should See

After creating a few links and clicking them, you should see:

**In Neon SQL Editor Results:**
```
Row 1:
├── id: 1
├── short_code: abc123
├── original_url: https://google.com
├── created_at: 2025-11-22 10:30:45.123456
├── total_clicks: 5
└── last_clicked_at: 2025-11-22 15:45:30.654321

Row 2:
├── id: 2
├── short_code: xyz789
├── original_url: https://github.com
├── created_at: 2025-11-22 11:00:00.000000
├── total_clicks: 0
└── last_clicked_at: NULL (not clicked yet)
```

---

## 🚀 Quick Summary

| Step | Action |
|------|--------|
| 1 | Go to https://console.neon.tech |
| 2 | Login with your credentials |
| 3 | Select "tinylink" project |
| 4 | Click "SQL Editor" on the left |
| 5 | Paste: `SELECT * FROM links;` |
| 6 | Click "Execute" button |
| 7 | See your data in the results table! |

---

## 🎯 Test It Now!

1. **Your app is running** at http://localhost:3000
2. **Create 2-3 short links** using the dashboard
3. **Click one of the links** to increase its click count
4. **Go to Neon console** and run `SELECT * FROM links;`
5. **You should see** all your links with updated click counts!

This confirms everything is working! ✅
