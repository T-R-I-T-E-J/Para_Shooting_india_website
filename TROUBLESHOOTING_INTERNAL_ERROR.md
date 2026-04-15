# 🔧 Troubleshooting Internal Server Error

## 🔍 Diagnosing the Issue

You're seeing "Internal server error" - let's figure out what's happening.

---

## 📊 Quick Diagnostic Steps

### Step 1: Check Render Logs (Most Important)

**Go to:**
```
https://dashboard.render.com/web/final-production-q1yw/logs
```

**Look for:**
- Red error messages
- Stack traces
- Database connection errors
- Missing environment variables

**Common errors you might see:**
1. `DATABASE_URL is not defined`
2. `Cannot connect to database`
3. `Missing JWT_SECRET`
4. `Port already in use`
5. `Module not found`

---

### Step 2: Check Health Endpoint

Open PowerShell and run:

```powershell
try {
    Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/health"
} catch {
    Write-Host "Error:" $_.Exception.Message -ForegroundColor Red
    Write-Host "Status Code:" $_.Exception.Response.StatusCode.value__ -ForegroundColor Yellow
}
```

**Expected if working:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

**If you get 500 error:** Backend has an issue (check logs)
**If you get 404 error:** Wrong URL or service not running
**If you get timeout:** Service is starting up (wait 2-3 minutes)

---

### Step 3: Check Service Status

**Go to:**
```
https://dashboard.render.com/web/final-production-q1yw
```

**Check:**
- Status should be: "Live" (green)
- If "Deploying" (yellow): Wait for it to finish
- If "Failed" (red): Click to see error details

---

## 🐛 Common Issues and Fixes

### Issue 1: Database Connection Error

**Symptoms:**
- "Cannot connect to database"
- "relation does not exist"
- "password authentication failed"

**Fix:**
1. Go to: https://dashboard.render.com/web/final-production-q1yw/env-vars
2. Check `DATABASE_URL` is set correctly
3. Get the correct URL from: https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
4. Click "Connect" → "Internal Database URL"
5. Copy the URL and update the env var
6. Redeploy the service

---

### Issue 2: Missing Environment Variables

**Symptoms:**
- "JWT_SECRET is not defined"
- "ENCRYPTION_KEY is required"
- Configuration errors

**Fix:**
1. Go to: https://dashboard.render.com/web/final-production-q1yw/env-vars
2. Verify ALL these variables are set:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=<from database dashboard>
JWT_SECRET=b9c93cc1e69ae2d0d6718bcbffc0023e5bd9f991251e0ea7dbe41ff4e7f1a47f
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=a43f28a93936fe2052dd7415607f16964f1fb3c14600651b436240c0cb352442
REFRESH_TOKEN_EXPIRES_IN=30d
ENCRYPTION_KEY=d2b025d19df4e942ac8472d3450a0ff0e6c79e7bdde123da4c5bdcafa28f7257
CORS_ORIGIN=https://para-shooting-india-webf.netlify.app
MAX_FILE_SIZE=5242880
THROTTLE_TTL=60
THROTTLE_LIMIT=10
LOG_LEVEL=info
```

3. If any are missing, add them
4. Redeploy the service

---

### Issue 3: Build Failed

**Symptoms:**
- Service shows "Failed" status
- Build logs show errors
- "npm install" errors

**Fix:**
1. Go to: https://dashboard.render.com/web/final-production-q1yw/events
2. Click on the failed deploy
3. Read the error message
4. Common fixes:
   - **"Cannot find module"**: Check package.json dependencies
   - **"Build command failed"**: Check build command in settings
   - **"Out of memory"**: Upgrade to paid plan or optimize build

---

### Issue 4: Service Starting Up

**Symptoms:**
- "Service Unavailable"
- Timeout errors
- 503 errors

**Fix:**
This is normal! Render free tier can take 2-3 minutes to start.

**Wait and retry:**
```powershell
# Wait 3 minutes, then test again
Start-Sleep -Seconds 180
Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/health"
```

---

### Issue 5: Database Tables Don't Exist

**Symptoms:**
- "relation does not exist"
- "table not found"
- Seeding warnings

**Fix:**
Run migrations! See `RUN_MIGRATIONS_GUIDE.md`

**Quick fix:**
1. Go to: https://dashboard.render.com/web/final-production-q1yw
2. Click "Shell" tab
3. Run: `npm run migrate:sql`
4. Restart service

---

## 🧪 Detailed Diagnostics

### Test 1: Check if Service is Running

```powershell
$response = try {
    Invoke-WebRequest -Uri "https://final-production-q1yw.onrender.com/api/v1/health" -UseBasicParsing
    "Success: Service is running"
} catch {
    "Error: $($_.Exception.Message)"
}
Write-Host $response
```

---

### Test 2: Check Database Connection

```powershell
# This will show if database is the issue
$response = try {
    Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/categories"
    "Success: Database connected"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 500) {
        "Database connection issue - check logs"
    } else {
        "Error: $($_.Exception.Message)"
    }
}
Write-Host $response
```

---

### Test 3: Check Environment

```powershell
# Check if CORS is the issue
$headers = @{
    "Origin" = "https://para-shooting-india-webf.netlify.app"
}
try {
    Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/health" -Headers $headers
    "CORS is configured correctly"
} catch {
    "CORS issue detected"
}
```

---

## 📋 Diagnostic Checklist

Run through this checklist:

- [ ] Check Render logs for errors
- [ ] Verify service status is "Live"
- [ ] Test health endpoint
- [ ] Verify all environment variables are set
- [ ] Check database status is "Available"
- [ ] Verify DATABASE_URL is correct
- [ ] Check if migrations have been run
- [ ] Wait 2-3 minutes if service just deployed
- [ ] Check build logs for errors
- [ ] Verify CORS_ORIGIN is correct

---

## 🆘 Get Specific Error Details

Run this comprehensive diagnostic:

```powershell
Write-Host "`n=== DIAGNOSTIC REPORT ===" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/health"
    Write-Host "   ✅ Health check passed" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor White
    Write-Host "   Database: $($health.database)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Health check failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "   Status Code: $statusCode" -ForegroundColor Yellow
}

# Test 2: Categories Endpoint
Write-Host "`n2. Testing Categories Endpoint..." -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/categories"
    Write-Host "   ✅ Categories endpoint working" -ForegroundColor Green
    Write-Host "   Count: $($categories.Count)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Categories endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Root URL
Write-Host "`n3. Testing Root URL..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://final-production-q1yw.onrender.com" -UseBasicParsing | Out-Null
    Write-Host "   ✅ Service is responding" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 404) {
        Write-Host "   ⚠️  404 on root (this is normal - use /api/v1)" -ForegroundColor Yellow
    } else {
        Write-Host "   ❌ Service error: $statusCode" -ForegroundColor Red
    }
}

Write-Host "`n=== END DIAGNOSTIC REPORT ===`n" -ForegroundColor Cyan
```

---

## 📞 Next Steps Based on Error

### If you see "Cannot connect to database":
1. Check database status: https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
2. Verify DATABASE_URL environment variable
3. Restart both database and service

### If you see "relation does not exist":
1. Run migrations: `npm run migrate:sql` in Render Shell
2. See: `RUN_MIGRATIONS_GUIDE.md`

### If you see "JWT_SECRET is not defined":
1. Add missing environment variables
2. See: `PRODUCTION_SECRETS.md` for values
3. Redeploy service

### If you see "Module not found":
1. Check build logs
2. Verify package.json is correct
3. Try manual deploy

### If service won't start:
1. Check build command: `npm install && npm run build`
2. Check start command: `npm run start:prod`
3. Verify Node version: 22.x

---

## 🔗 Quick Links

### Render Dashboards:
- **Service:** https://dashboard.render.com/web/final-production-q1yw
- **Logs:** https://dashboard.render.com/web/final-production-q1yw/logs
- **Events:** https://dashboard.render.com/web/final-production-q1yw/events
- **Env Vars:** https://dashboard.render.com/web/final-production-q1yw/env-vars
- **Shell:** https://dashboard.render.com/web/final-production-q1yw/shell
- **Database:** https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog

### Test URLs:
- **Health:** https://final-production-q1yw.onrender.com/api/v1/health
- **Categories:** https://final-production-q1yw.onrender.com/api/v1/categories

---

## 💡 Pro Tips

1. **Always check logs first** - They tell you exactly what's wrong
2. **Wait for deploys** - Free tier takes 2-3 minutes to start
3. **Check environment variables** - Most issues are missing config
4. **Run migrations** - Database tables must exist
5. **Test incrementally** - Health → Categories → Auth

---

**Tell me what error you see in the Render logs and I'll help you fix it!** 🔧

---

_Last Updated: February 6, 2026_  
_Para Shooting Committee of India © 2026_
