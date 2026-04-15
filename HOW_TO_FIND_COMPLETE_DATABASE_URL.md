# 🔍 How to Find the COMPLETE Database URL

## ❌ Your Current URL is Incomplete

You provided:
```
postgresql://admin:1pxS8notulIQ7WTbXaEtnesimxJQwYnO@dpg-d634p8coud1c73cjsai0-a/psci_platform
```

This is **missing the domain suffix**: `.oregon-postgres.render.com`

---

## ✅ How to Get the COMPLETE URL

### Method 1: Look More Carefully at the Dashboard

The Render dashboard might be **truncating** the URL in the display. Here's how to get the full URL:

#### Step 1: Go to Database Dashboard
```
https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
```

#### Step 2: Find the "Connections" Section

Look for a section that shows connection details. You might see:
- **Hostname** (separate field)
- **Port** (separate field)
- **Database** (separate field)
- **Username** (separate field)

#### Step 3: The Hostname Should Show

The hostname field should show something like:
```
dpg-d634p8coud1c73cjsai0-a.oregon-postgres.render.com
```

NOT just:
```
dpg-d634p8coud1c73cjsai0-a
```

---

### Method 2: Click "Connect" Button

1. Go to: https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
2. Click the **"Connect"** button (usually at the top)
3. A popup/panel will appear with connection strings
4. Look for **"Internal Connection String"** or **"Connection String"**
5. **Select and copy the ENTIRE text** - don't rely on what you see, select it all!

The popup might show it in a copyable text box where you can select all.

---

### Method 3: Use the "Copy" Button

Some Render dashboards have a **copy icon** 📋 next to the connection string.

1. Find the Internal Database URL
2. Click the copy icon
3. Paste it somewhere to verify it's complete

---

### Method 4: Build It Manually

If you can see the individual connection details, build the URL manually:

**Format:**
```
postgresql://[USERNAME]:[PASSWORD]@[HOSTNAME]/[DATABASE]
```

**Your values (based on what you showed):**
- Username: `admin`
- Password: `1pxS8notulIQ7WTbXaEtnesimxJQwYnO`
- Hostname: `dpg-d634p8coud1c73cjsai0-a.oregon-postgres.render.com` ← **Add this suffix!**
- Database: `psci_platform`

**Complete URL:**
```
postgresql://admin:1pxS8notulIQ7WTbXaEtnesimxJQwYnO@dpg-d634p8coud1c73cjsai0-a.oregon-postgres.render.com/psci_platform
```

---

## 🎯 Try This Complete URL

Based on your partial URL, the complete one should be:

```
postgresql://admin:1pxS8notulIQ7WTbXaEtnesimxJQwYnO@dpg-d634p8coud1c73cjsai0-a.oregon-postgres.render.com/psci_platform
```

### Run These Commands:

```powershell
# Go to API directory
cd C:\Users\trite\Documents\test\results_final\apps\api

# Set the COMPLETE database URL
$env:DATABASE_URL="postgresql://admin:1pxS8notulIQ7WTbXaEtnesimxJQwYnO@dpg-d634p8coud1c73cjsai0-a.oregon-postgres.render.com/psci_platform"

# Run migrations
npm run migrate:sql
```

---

## 🔍 How to Verify Your URL is Complete

A complete PostgreSQL URL must have:

1. ✅ Protocol: `postgresql://`
2. ✅ Username: `admin`
3. ✅ Colon: `:`
4. ✅ Password: `1pxS8notulIQ7WTbXaEtnesimxJQwYnO`
5. ✅ At symbol: `@`
6. ✅ **Full hostname**: `dpg-d634p8coud1c73cjsai0-a.oregon-postgres.render.com`
   - Must end with `.oregon-postgres.render.com`
   - Or `.frankfurt-postgres.render.com`
   - Or `.singapore-postgres.render.com`
   - Depends on your region (yours is Oregon)
7. ✅ Slash: `/`
8. ✅ Database name: `psci_platform`

**Your URL was missing #6 - the full hostname domain!**

---

## 📸 What to Look For in Render Dashboard

When you're on the database page, look for:

### Option A: "Info" Tab
- Should show connection details
- Look for "Hostname" field
- It should show the FULL domain

### Option B: "Connect" Button
- Click it
- Look for "Internal Connection String"
- Copy the entire string

### Option C: Connection Details Section
Individual fields like:
```
Hostname: dpg-d634p8coud1c73cjsai0-a.oregon-postgres.render.com
Port: 5432
Database: psci_platform
Username: admin
```

---

## 🆘 Still Can't Find It?

### Alternative: Use External URL

If you absolutely can't find the internal URL, try the External URL:

1. Go to database dashboard
2. Look for "External Database URL" or "External Connection String"
3. It will include a port number (`:5432`)
4. That's fine! Use it.

External URL format:
```
postgresql://admin:PASSWORD@dpg-XXXXX-a.oregon-postgres.render.com:5432/psci_platform
```

The difference:
- Internal: No port number
- External: Has `:5432` at the end of hostname

Both will work for migrations!

---

## 💡 Pro Tip: Check Your Browser

Sometimes the Render dashboard truncates long text in the UI, but if you:

1. **Right-click** on the connection string
2. **Inspect Element** (if you know how)
3. You might see the full value in the HTML

Or just try the complete URL I provided above - it should work!

---

## ✅ Next Steps

Once you have the complete URL:

1. Run the migration commands
2. Wait for success
3. Restart Render service
4. Test the API

---

**Try the complete URL I provided above - it should work!** 🚀

```
postgresql://admin:1pxS8notulIQ7WTbXaEtnesimxJQwYnO@dpg-d634p8coud1c73cjsai0-a.oregon-postgres.render.com/psci_platform
```

---

_Last Updated: February 6, 2026_
