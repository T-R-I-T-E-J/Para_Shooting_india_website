# 🆓 Database Migrations for Free Tier Users

## ℹ️ Free Tier Limitation

Render free tier doesn't have Shell access. **No problem!** We'll run migrations from your local machine.

---

## 🎯 Get the CORRECT Database URL

### Step 1: Open Database Dashboard

**Go to:**
```
https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
```

### Step 2: Find Connection Info

Look for the **"Info"** section on the page. You'll see:

- **Internal Database URL** - This is what you need!
- External Database URL - Don't use this

### Step 3: Copy the COMPLETE URL

The URL should look like this:
```
postgresql://psci_database_user:PASSWORD@dpg-cu9v4h8gph6c73aodqog-a.oregon-postgres.render.com/psci_database
```

**Important parts:**
- Host must end with: `.oregon-postgres.render.com`
- Database name: `psci_database`
- Username: `psci_database_user`

---

## 🚀 Run Migrations Locally

### Method 1: Quick Command (Easiest)

Open PowerShell and run these commands **one by one**:

```powershell
# Step 1: Set the database URL (replace with YOUR complete URL)
$env:DATABASE_URL="postgresql://psci_database_user:PASSWORD@dpg-cu9v4h8gph6c73aodqog-a.oregon-postgres.render.com/psci_database"

# Step 2: Go to API directory
cd C:\Users\trite\Documents\test\results_final\apps\api

# Step 3: Run migrations
npm run migrate:sql
```

**Wait for success messages!**

---

### Method 2: Using the Script

Run the script again with the CORRECT URL:

```powershell
cd C:\Users\trite\Documents\test\results_final
.\QUICK_FIX_MIGRATIONS.ps1
```

When prompted, paste the **COMPLETE** Internal Database URL including `.oregon-postgres.render.com`

---

## 📋 Checklist: Is Your Database URL Correct?

Your database URL must have ALL of these:

- [ ] Starts with `postgresql://`
- [ ] Has username (e.g., `psci_database_user`)
- [ ] Has password (long random string)
- [ ] Has `@` symbol
- [ ] Has hostname ending with `.oregon-postgres.render.com`
- [ ] Has `/` followed by database name

**Example of CORRECT URL:**
```
postgresql://psci_database_user:abc123xyz@dpg-cu9v4h8gph6c73aodqog-a.oregon-postgres.render.com/psci_database
          ^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^
          username             password  hostname (MUST include full domain!)                    database
```

**Example of WRONG URL (what you used before):**
```
postgresql://admin:abc123xyz@dpg-d634p8coud1c73cjsai0-a/psci_platform
                                                      ↑
                              MISSING: .oregon-postgres.render.com
```

---

## 🆘 If You Can't Find the Internal Database URL

### Alternative: Use External URL with Correct Format

1. Go to: https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
2. Click "Connect" button
3. Look for "External Database URL"
4. Copy it - it should look like:
   ```
   postgresql://psci_database_user:PASSWORD@dpg-cu9v4h8gph6c73aodqog-a.oregon-postgres.render.com:5432/psci_database
   ```

**Note:** External URL includes `:5432` port number. That's fine!

---

## ✅ After Migrations Complete

### Step 1: Verify Success

Run this in PowerShell:
```powershell
Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/categories"
```

**Expected:** `[]` (empty array, not an error!)

### Step 2: Restart Render Service

1. Go to: https://dashboard.render.com/web/final-production-q1yw
2. Click "Manual Deploy" (top right)
3. Click "Deploy latest commit"
4. Wait 2-3 minutes

### Step 3: Test Again

```powershell
Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/categories"
```

**Expected:** `[]` (success!)

---

## 🎯 Complete Step-by-Step

### Copy and paste these commands ONE BY ONE:

```powershell
# 1. Get to the right directory
cd C:\Users\trite\Documents\test\results_final\apps\api

# 2. Set database URL (GET THE CORRECT ONE FROM RENDER FIRST!)
# Go to: https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
# Copy the Internal Database URL, then paste it here:
$env:DATABASE_URL="PASTE_YOUR_COMPLETE_URL_HERE"

# 3. Run migrations
npm run migrate:sql

# 4. Test it worked
Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/categories"
```

---

## 🔍 How to Know It Worked

### Success Looks Like:
```
🔌 Connecting to database...
✅ Database connection successful
📋 Running migrations...
✅ Created table: users
✅ Created table: categories
✅ Created table: downloads
✅ Created table: results
✅ Created table: galleries
✅ Created table: athletes
✅ Created table: news
✅ All migrations completed successfully!
```

### Failure Looks Like:
```
💥 Migration script failed: Error: getaddrinfo ENOTFOUND
```
**This means:** Database URL is still wrong. Check the hostname!

---

## 💡 Pro Tips

1. **Copy the ENTIRE URL** - Don't type it manually
2. **Check for the full domain** - Must end with `.oregon-postgres.render.com`
3. **Use Internal URL** - Not External (unless External is all you can find)
4. **Restart service after** - Migrations need a restart to take effect

---

## 📞 Quick Reference

### Database Dashboard:
```
https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
```

### Service Dashboard:
```
https://dashboard.render.com/web/final-production-q1yw
```

### Test Endpoint:
```
https://final-production-q1yw.onrender.com/api/v1/categories
```

---

**Get the correct database URL from Render and try again!** 🚀

---

_Last Updated: February 6, 2026_
