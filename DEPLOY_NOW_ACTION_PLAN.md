# 🚀 DEPLOY NOW - ACTION PLAN

## ⚡ Quick Start (30 Minutes to Live!)

---

## ✅ COMPLETED AUTOMATICALLY

1. ✅ **Tech Stack Analysis** - Confirmed Next.js 14 + NestJS 11
2. ✅ **Security Secrets Generated** - 256-bit cryptographic secrets created
3. ✅ **Deployment Guides Created** - Comprehensive documentation ready
4. ✅ **Netlify Project Identified** - Using existing `para-shooting-india-webf`
5. ✅ **Configuration Files Updated** - `netlify.toml` optimized

---

## 📋 YOUR ACTION ITEMS (Follow in Order)

### STEP 1: Configure Netlify Environment Variables (5 minutes)

1. **Go to:** https://app.netlify.com/sites/para-shooting-india-webf/settings/deploys#environment

2. **Click:** "Add a variable" and add each of these:

```
Variable Name: NODE_ENV
Value: production

Variable Name: NEXT_PUBLIC_ENV  
Value: production

Variable Name: JWT_SECRET
Value: b9c93cc1e69ae2d0d6718bcbffc0023e5bd9f991251e0ea7dbe41ff4e7f1a47f

Variable Name: NEXT_PUBLIC_API_TIMEOUT
Value: 30000

Variable Name: NEXT_PUBLIC_ENABLE_ANALYTICS
Value: false

Variable Name: NEXT_PUBLIC_DEBUG_MODE
Value: false

Variable Name: NEXT_PUBLIC_APP_NAME
Value: Para Shooting Committee of India

Variable Name: NEXT_PUBLIC_APP_VERSION
Value: 1.0.0
```

**Note:** We'll add `NEXT_PUBLIC_API_URL` after backend deployment in Step 3.

3. **Trigger Redeploy:**
   - Go to: https://app.netlify.com/sites/para-shooting-india-webf/deploys
   - Click "Trigger deploy" → "Deploy site"

---

### STEP 2: Deploy Backend to Railway (10 minutes)

#### Option A: Web Interface (Recommended)

1. **Go to:** https://railway.app/new

2. **Click:** "Deploy from GitHub repo"

3. **Authorize GitHub** and select your repository

4. **Configure Service:**
   - **Root Directory:** `apps/api`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`

5. **Add PostgreSQL:**
   - Click "+ New" in your project
   - Select "Database" → "PostgreSQL"
   - Railway will auto-configure `DATABASE_URL`

6. **Add Environment Variables:**
   - Click on your API service
   - Go to "Variables" tab
   - Click "Raw Editor"
   - Paste this (Railway will auto-fill `DATABASE_URL`):

```env
NODE_ENV=production
PORT=4000
API_PREFIX=api/v1
DATABASE_URL=${{Postgres.DATABASE_URL}}
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

7. **Deploy:**
   - Railway will automatically deploy
   - Wait 3-5 minutes for build to complete
   - **Copy your Railway URL** (e.g., `https://your-app.up.railway.app`)

#### Option B: Railway CLI (Alternative)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to API directory
cd results_final/apps/api

# Initialize Railway project
railway init

# Add PostgreSQL
railway add

# Set environment variables (one by one or use railway variables set)
railway variables set NODE_ENV=production
railway variables set PORT=4000
# ... (add all variables from above)

# Deploy
railway up
```

---

### STEP 3: Update API URL in Netlify (2 minutes)

1. **Get your Railway URL** from Step 2 (e.g., `https://your-app.up.railway.app`)

2. **Go to:** https://app.netlify.com/sites/para-shooting-india-webf/settings/deploys#environment

3. **Add new variable:**
   ```
   Variable Name: NEXT_PUBLIC_API_URL
   Value: https://your-app.up.railway.app/api/v1
   ```
   ⚠️ **Important:** Add `/api/v1` at the end!

4. **Trigger Redeploy:**
   - Go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"

---

### STEP 4: Run Database Migrations (5 minutes)

1. **Option A: Railway CLI**
   ```bash
   cd results_final/apps/api
   railway run npm run migrate:sql
   ```

2. **Option B: Railway Dashboard**
   - Go to your PostgreSQL service in Railway
   - Click "Data" tab
   - Click "Query" and run SQL files from `apps/api/migrations/`
   - Run them in order (check filenames for sequence)

3. **Verify migrations:**
   - Check that tables are created
   - Verify schema matches your application

---

### STEP 5: Create Admin User (3 minutes)

1. **Generate password hash locally:**
   ```bash
   cd results_final/apps/api
   node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YourSecurePassword123!', 10, (e,h) => console.log(h));"
   ```

2. **Run in Railway PostgreSQL:**
   - Go to Railway → PostgreSQL → Data → Query
   - Replace `$2b$10$...` with your generated hash:

   ```sql
   INSERT INTO users (email, password_hash, full_name, role, is_active, created_at, updated_at)
   VALUES (
     'admin@psci.in',
     '$2b$10$YourGeneratedHashHere',
     'System Administrator',
     'admin',
     true,
     NOW(),
     NOW()
   );
   ```

3. **Verify:**
   ```sql
   SELECT email, full_name, role, is_active FROM users WHERE email = 'admin@psci.in';
   ```

---

### STEP 6: Test Your Deployment (5 minutes)

1. **Test Backend Health:**
   - Visit: `https://your-railway-app.up.railway.app/api/v1/health`
   - Should return: `{"status":"ok"}`

2. **Test Frontend:**
   - Visit: `https://para-shooting-india-webf.netlify.app`
   - Should load homepage

3. **Test Login:**
   - Go to: `https://para-shooting-india-webf.netlify.app/admin`
   - Login with: `admin@psci.in` / `YourSecurePassword123!`
   - Verify dashboard loads

4. **Test API Integration:**
   - Open browser DevTools → Network tab
   - Navigate around the site
   - Verify API calls to Railway backend succeed
   - Check for any CORS errors (should be none)

---

## 🎉 SUCCESS CRITERIA

Your deployment is successful when:

- ✅ Netlify site loads without errors
- ✅ Railway backend responds to health check
- ✅ Admin login works
- ✅ Dashboard displays correctly
- ✅ API calls work (check Network tab)
- ✅ No CORS errors in console
- ✅ Database queries work

---

## 🚨 TROUBLESHOOTING

### Netlify Build Fails
**Check:**
- All environment variables are set
- No typos in variable names
- Build logs for specific errors

**Fix:**
- Add missing variables
- Check `netlify.toml` syntax
- Verify `package.json` has all dependencies

### Railway Build Fails
**Check:**
- Root directory is set to `apps/api`
- Build command is correct
- Environment variables are set

**Fix:**
- Verify PostgreSQL service is running
- Check Railway logs for specific errors
- Ensure `DATABASE_URL` is set

### CORS Errors
**Check:**
- `CORS_ORIGIN` in Railway matches Netlify URL exactly
- No trailing slashes
- HTTPS vs HTTP

**Fix:**
- Update Railway `CORS_ORIGIN` variable
- Redeploy Railway service
- Clear browser cache

### Login Doesn't Work
**Check:**
- Admin user exists in database
- Password hash is correct
- JWT_SECRET matches between frontend and backend

**Fix:**
- Recreate admin user
- Verify JWT_SECRET is identical
- Check browser console for errors

### API Calls Fail
**Check:**
- `NEXT_PUBLIC_API_URL` is correct
- Railway backend is running
- Network tab shows correct URL

**Fix:**
- Update Netlify `NEXT_PUBLIC_API_URL`
- Verify Railway URL is accessible
- Check Railway logs for errors

---

## 📞 NEED HELP?

### Check Logs
- **Netlify:** https://app.netlify.com/sites/para-shooting-india-webf/deploys
- **Railway:** https://railway.app/dashboard → Your Project → Deployments

### Documentation
- **Full Guide:** `DEPLOYMENT_COMPLETE_GUIDE.md`
- **Secrets:** `PRODUCTION_SECRETS.md`
- **Status:** `DEPLOYMENT_STATUS_LIVE.md`

### Support
- **Netlify Docs:** https://docs.netlify.com
- **Railway Docs:** https://docs.railway.app
- **Community:** Stack Overflow, Discord

---

## 🎯 AFTER DEPLOYMENT

### Immediate
- [ ] Bookmark deployment URLs
- [ ] Save admin credentials securely
- [ ] Share URLs with stakeholders
- [ ] Monitor logs for errors

### Within 24 Hours
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure error tracking (Sentry)
- [ ] Test all features thoroughly
- [ ] Document any issues

### Within 1 Week
- [ ] Implement cloud storage for file uploads
- [ ] Set up automated backups
- [ ] Configure monitoring alerts
- [ ] Performance optimization

---

## 📊 DEPLOYMENT SUMMARY

### Your URLs
- **Frontend:** https://para-shooting-india-webf.netlify.app
- **Backend:** https://your-railway-app.up.railway.app
- **Admin:** https://para-shooting-india-webf.netlify.app/admin

### Your Credentials
- **Admin Email:** admin@psci.in
- **Admin Password:** (The one you set in Step 5)

### Your Dashboards
- **Netlify:** https://app.netlify.com/sites/para-shooting-india-webf
- **Railway:** https://railway.app/dashboard

### Your Secrets
- **JWT_SECRET:** `b9c93cc1e69ae2d0d6718bcbffc0023e5bd9f991251e0ea7dbe41ff4e7f1a47f`
- **REFRESH_TOKEN_SECRET:** `a43f28a93936fe2052dd7415607f16964f1fb3c14600651b436240c0cb352442`
- **ENCRYPTION_KEY:** `d2b025d19df4e942ac8472d3450a0ff0e6c79e7bdde123da4c5bdcafa28f7257`

⚠️ **Keep these secrets secure!**

---

## 🏆 YOU'RE READY!

Follow the 6 steps above in order, and you'll be live in **~30 minutes**!

**Good luck with your deployment!** 🚀

---

_Created: February 7, 2026_  
_Para Shooting Committee of India © 2026_
