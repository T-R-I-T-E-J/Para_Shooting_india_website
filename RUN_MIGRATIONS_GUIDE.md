# 🗄️ Database Migrations Guide

## 📋 Overview

Your backend is live but needs database tables created. This guide shows you how to run migrations.

---

## 🎯 Quick Start (5 Minutes)

### Method 1: Render Shell (Easiest)

1. **Open Render Dashboard:**
   ```
   https://dashboard.render.com/web/final-production-q1yw
   ```

2. **Click "Shell" Tab:**
   - Look for "Shell" in the left sidebar
   - Click it to open a terminal

3. **Wait for Connection:**
   - You'll see: "Connecting to shell..."
   - Wait until you see the command prompt: `$`

4. **Run Migration Command:**
   ```bash
   npm run migrate:sql
   ```

5. **Watch for Success:**
   ```
   ✓ Running migrations...
   ✓ Created table: users
   ✓ Created table: categories
   ✓ Created table: downloads
   ✓ Created table: results
   ✓ Created table: galleries
   ✓ Created table: athletes
   ✓ Created table: news
   ✓ Migrations completed successfully!
   ```

6. **Restart Service:**
   - Go to "Settings" tab
   - Scroll to "Manual Deploy"
   - Click "Manual Deploy" → "Deploy latest commit"

**Done!** Your database is ready.

---

## 🔧 Method 2: Local Connection (Alternative)

If Render Shell isn't working, run migrations from your local machine:

### Step 1: Get Database URL

1. **Go to Database Dashboard:**
   ```
   https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
   ```

2. **Click "Connect":**
   - Look for the "Connect" button at the top
   - Click it

3. **Copy External Database URL:**
   - Click "External Connection" tab
   - Copy the full URL that looks like:
   ```
   postgresql://psci_database_user:PASSWORD@dpg-cu9v4h8gph6c73aodqog-a.oregon-postgres.render.com/psci_database
   ```

### Step 2: Set Environment Variable

**In PowerShell:**
```powershell
$env:DATABASE_URL="postgresql://psci_database_user:YOUR_PASSWORD@dpg-cu9v4h8gph6c73aodqog-a.oregon-postgres.render.com/psci_database"
```

**Replace `YOUR_PASSWORD` with the actual password from the URL you copied.**

### Step 3: Navigate to API Directory

```powershell
cd C:\Users\trite\Documents\test\results_final\apps\api
```

### Step 4: Run Migrations

```powershell
npm run migrate:sql
```

### Step 5: Verify Success

You should see:
```
✓ Running migrations...
✓ Created table: users
✓ Created table: categories
✓ Created table: downloads
✓ Created table: results
✓ Created table: galleries
✓ Created table: athletes
✓ Created table: news
✓ Migrations completed successfully!
```

### Step 6: Restart Render Service

1. Go to: https://dashboard.render.com/web/final-production-q1yw
2. Click "Manual Deploy" → "Deploy latest commit"

---

## 📊 What Gets Created

### Database Tables:

1. **users** - User accounts and authentication
   - Columns: id, email, password, name, role, created_at, updated_at

2. **categories** - Content categories
   - Columns: id, name, slug, description, created_at, updated_at

3. **downloads** - Downloadable files
   - Columns: id, title, description, file_path, category_id, created_at, updated_at

4. **results** - Competition results
   - Columns: id, title, description, file_path, date, created_at, updated_at

5. **galleries** - Photo galleries
   - Columns: id, title, description, images, created_at, updated_at

6. **athletes** - Athlete profiles
   - Columns: id, name, bio, photo, achievements, created_at, updated_at

7. **news** - News articles
   - Columns: id, title, content, author, published_at, created_at, updated_at

---

## 🧪 Verify Migrations Worked

### Test 1: Check Health Endpoint

```powershell
Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/health"
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-06T21:00:00.000Z",
  "database": "connected"
}
```

### Test 2: Check Categories Endpoint

```powershell
Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/categories"
```

**Expected Response:**
```json
[]
```
(Empty array is good - means table exists!)

### Test 3: Check Logs

1. Go to: https://dashboard.render.com/web/final-production-q1yw/logs
2. Look for:
   ```
   LOG [Bootstrap] 🚀 Para Shooting Committee API is running
   ```
3. Should NOT see:
   ```
   WARN [DownloadsService] Skipping seeding: relation "downloads" does not exist
   ```

---

## 🆘 Troubleshooting

### Error: "npm: command not found"

**Problem:** Shell environment isn't ready.

**Solution:**
1. Wait a few seconds
2. Try the command again
3. If still fails, use Method 2 (Local Connection)

### Error: "Cannot connect to database"

**Problem:** Database URL is incorrect.

**Solution:**
1. Go to: https://dashboard.render.com/web/final-production-q1yw/env-vars
2. Verify `DATABASE_URL` is set correctly
3. Check database status: https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
4. Make sure database shows "Available"

### Error: "relation already exists"

**Problem:** Migrations were already run.

**Solution:** This is fine! Your database is already set up. Skip to creating admin user.

### Error: "Permission denied"

**Problem:** Database user doesn't have permissions.

**Solution:**
1. Go to: https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
2. Check "Roles" tab
3. Verify `psci_database_user` has full permissions
4. If not, recreate the database

### Warning: "Skipping seeding"

**Problem:** This warning appears if migrations haven't been run yet.

**Solution:** Run the migrations using Method 1 or Method 2 above.

---

## 📋 Migration Script Details

### What `npm run migrate:sql` Does:

1. **Connects to Database:**
   - Uses `DATABASE_URL` from environment
   - Establishes PostgreSQL connection

2. **Checks Existing Tables:**
   - Queries `information_schema`
   - Identifies what needs to be created

3. **Creates Tables:**
   - Runs SQL CREATE TABLE statements
   - Sets up primary keys and indexes
   - Creates foreign key relationships

4. **Seeds Initial Data (Optional):**
   - Adds default categories
   - Creates system users
   - Populates lookup tables

5. **Verifies Success:**
   - Checks all tables exist
   - Validates schema
   - Reports status

---

## 🎯 Next Steps After Migrations

### 1. Create Admin User

After migrations complete, create your admin account:

```powershell
$body = @{
    email = "admin@psci.in"
    password = "Admin@123"
    name = "Admin User"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### 2. Update Netlify

Update your frontend to use the backend:

1. Go to: https://app.netlify.com/sites/para-shooting-india-webf/settings/deploys#environment
2. Update: `NEXT_PUBLIC_API_URL` = `https://final-production-q1yw.onrender.com/api/v1`
3. Trigger redeploy

### 3. Test Login

1. Go to: https://para-shooting-india-webf.netlify.app/login
2. Login with:
   - Email: `admin@psci.in`
   - Password: `Admin@123`
3. Success! 🎉

---

## 📊 Migration Checklist

- [ ] Open Render Shell or prepare local environment
- [ ] Run `npm run migrate:sql`
- [ ] Verify success messages
- [ ] Check health endpoint
- [ ] Test API endpoints
- [ ] Create admin user
- [ ] Update Netlify environment variable
- [ ] Test login functionality

---

## 💡 Pro Tips

### 1. Always Check Logs
After running migrations, check the logs:
```
https://dashboard.render.com/web/final-production-q1yw/logs
```

### 2. Backup Before Major Changes
Render provides automatic backups, but you can also:
- Export data before migrations
- Take manual snapshots
- Keep migration scripts in version control

### 3. Test in Development First
Before running migrations in production:
- Test locally with Docker
- Verify all SQL statements
- Check for breaking changes

### 4. Monitor Database Performance
After migrations:
- Check database metrics
- Monitor connection counts
- Watch for slow queries

---

## 📞 Quick Reference

### Render Shell Access:
```
https://dashboard.render.com/web/final-production-q1yw
→ Click "Shell" tab
```

### Migration Command:
```bash
npm run migrate:sql
```

### Database Dashboard:
```
https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
```

### API Health Check:
```
https://final-production-q1yw.onrender.com/api/v1/health
```

---

**Run migrations and your database will be ready!** 🚀

---

_Last Updated: February 6, 2026_  
_Para Shooting Committee of India © 2026_
