# 🚀 RENDER DEPLOYMENT - Complete Instructions

## ✅ NETLIFY DEPLOYMENT STATUS

**Status:** 🟡 IN PROGRESS

**Deploy ID:** 6986461cb936ef4f3a18ee11  
**Monitor:** https://app.netlify.com/sites/b4b2e692-f11d-4f62-95b7-65c99e7184d5/deploys/6986461cb936ef4f3a18ee11

**Environment Variables:** ✅ CONFIGURED
- NODE_ENV=production
- NEXT_PUBLIC_ENV=production
- JWT_SECRET=*** (secured)
- NEXT_PUBLIC_API_TIMEOUT=30000
- NEXT_PUBLIC_ENABLE_ANALYTICS=false
- NEXT_PUBLIC_DEBUG_MODE=false
- NEXT_PUBLIC_APP_NAME=Para Shooting Committee of India
- NEXT_PUBLIC_APP_VERSION=1.0.0

**Note:** We'll add `NEXT_PUBLIC_API_URL` after Render backend is deployed.

---

## 🎯 RENDER DEPLOYMENT STEPS

Since you need to set up a Render workspace, follow these steps:

### Step 1: Sign Up / Login to Render

1. Go to: https://render.com
2. Sign up or login with GitHub (recommended)
3. Complete account setup

### Step 2: Create PostgreSQL Database

1. **Click "New +"** in Render Dashboard
2. **Select "PostgreSQL"**
3. **Configure:**
   - **Name:** `psci-database`
   - **Database:** `psci_platform`
   - **User:** `admin` (or leave default)
   - **Region:** Oregon (US West)
   - **PostgreSQL Version:** 16
   - **Plan:** Free

4. **Click "Create Database"**
5. **Wait 2-3 minutes** for database to provision
6. **Copy the Internal Database URL** (starts with `postgresql://`)

### Step 3: Create Backend Web Service

1. **Click "New +"** in Render Dashboard
2. **Select "Web Service"**
3. **Connect GitHub Repository:**
   - Authorize Render to access GitHub
   - Select your repository
   - Choose branch: `result3`

4. **Configure Service:**
   - **Name:** `psci-api`
   - **Region:** Oregon (US West)
   - **Branch:** `result3`
   - **Root Directory:** `apps/api`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Plan:** Free

5. **Add Environment Variables:**

Click "Advanced" → "Add Environment Variable" and add these:

```env
NODE_ENV=production
PORT=4000
API_PREFIX=api/v1
DATABASE_URL=<PASTE_YOUR_POSTGRES_INTERNAL_URL_HERE>
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

6. **Click "Create Web Service"**
7. **Wait 5-10 minutes** for deployment to complete
8. **Copy your Render URL** (e.g., `https://psci-api.onrender.com`)

### Step 4: Update Netlify with Backend URL

1. **Go to:** https://app.netlify.com/sites/para-shooting-india-webf/settings/deploys#environment

2. **Add new environment variable:**
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-render-app.onrender.com/api/v1`
   - **Scopes:** All scopes
   - **Context:** All contexts

3. **Trigger Redeploy:**
   - Go to: https://app.netlify.com/sites/para-shooting-india-webf/deploys
   - Click "Trigger deploy" → "Deploy site"

### Step 5: Run Database Migrations

**Option A: Using Render Shell**

1. Go to your Render web service dashboard
2. Click "Shell" tab
3. Run these commands:

```bash
cd apps/api
npm run migrate:sql
```

**Option B: Connect Locally**

1. Get your database connection string from Render
2. Update your local `.env` with the Render database URL
3. Run locally:

```bash
cd results_final/apps/api
npm run migrate:sql
```

**Option C: Manual SQL Execution**

1. Go to Render → PostgreSQL → "Connect"
2. Use the provided connection details
3. Connect with a PostgreSQL client (pgAdmin, DBeaver, etc.)
4. Run SQL files from `apps/api/migrations/` in order

### Step 6: Create Admin User

1. **Generate password hash locally:**

```bash
cd results_final/apps/api
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YourSecurePassword123!', 10, (e,h) => console.log(h));"
```

2. **Connect to Render PostgreSQL:**
   - Go to Render → PostgreSQL → "Connect"
   - Use psql or any PostgreSQL client

3. **Run this SQL (replace hash with your generated one):**

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

4. **Verify:**

```sql
SELECT email, full_name, role, is_active FROM users WHERE email = 'admin@psci.in';
```

---

## 🧪 TESTING YOUR DEPLOYMENT

### Test Backend Health

Visit: `https://your-render-app.onrender.com/api/v1/health`

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-07T..."
}
```

### Test Frontend

Visit: `https://para-shooting-india-webf.netlify.app`

**Expected:**
- Homepage loads correctly
- No console errors
- Images and assets load

### Test Admin Login

1. Go to: `https://para-shooting-india-webf.netlify.app/admin`
2. Login with:
   - Email: `admin@psci.in`
   - Password: `YourSecurePassword123!`
3. Verify dashboard loads

### Test API Integration

1. Open browser DevTools → Network tab
2. Navigate around the site
3. Verify API calls to Render backend succeed
4. Check for CORS errors (should be none)

---

## 📊 DEPLOYMENT SUMMARY

### Your Services

| Service | Platform | URL | Status |
|---------|----------|-----|--------|
| Frontend | Netlify | https://para-shooting-india-webf.netlify.app | 🟡 Deploying |
| Backend | Render | https://your-app.onrender.com | ⏳ Pending |
| Database | Render | PostgreSQL 16 | ⏳ Pending |

### Environment Variables

**Netlify (Frontend):** ✅ CONFIGURED
- All variables set except `NEXT_PUBLIC_API_URL`
- Will add after Render backend is deployed

**Render (Backend):** ⏳ NEEDS CONFIGURATION
- See Step 3 above for complete list
- Use secrets from `PRODUCTION_SECRETS.md`

---

## 🚨 IMPORTANT NOTES

### Render Free Tier Limitations

⚠️ **Render Free tier services spin down after 15 minutes of inactivity**

**What this means:**
- First request after inactivity takes 30-60 seconds (cold start)
- Subsequent requests are fast
- Not ideal for production, but perfect for testing

**Solutions:**
1. **Upgrade to paid plan** ($7/month) - No cold starts
2. **Use a ping service** - Keep service alive (UptimeRobot, etc.)
3. **Accept cold starts** - Fine for low-traffic sites

### Database Backups

**Render Free tier:**
- ❌ No automatic backups
- Manual backups only

**Recommendation:**
- Set up manual backup script
- Or upgrade to paid plan ($7/month) for daily backups

### File Uploads

⚠️ **Render ephemeral filesystem** - Uploaded files are lost on restart!

**Solution Required:**
- Migrate to cloud storage (S3, Cloudinary, Vercel Blob)
- See `DEPLOYMENT_COMPLETE_GUIDE.md` for implementation

---

## 🔗 USEFUL LINKS

### Your Dashboards
- **Netlify:** https://app.netlify.com/sites/para-shooting-india-webf
- **Render:** https://dashboard.render.com

### Monitoring
- **Netlify Deploy:** https://app.netlify.com/sites/b4b2e692-f11d-4f62-95b7-65c99e7184d5/deploys/6986461cb936ef4f3a18ee11
- **Render Services:** https://dashboard.render.com/services

### Documentation
- **Render Docs:** https://render.com/docs
- **Netlify Docs:** https://docs.netlify.com

---

## 🆘 TROUBLESHOOTING

### Netlify Build Fails

**Check:**
- Build logs in Netlify dashboard
- Environment variables are set
- `netlify.toml` configuration

**Common Issues:**
- Missing environment variables
- Build command errors
- Dependency issues

### Render Build Fails

**Check:**
- Build logs in Render dashboard
- Root directory is `apps/api`
- Build command is correct
- Environment variables are set

**Common Issues:**
- Wrong root directory
- Missing `DATABASE_URL`
- Node version mismatch

### CORS Errors

**Solution:**
1. Verify `CORS_ORIGIN` in Render matches Netlify URL exactly
2. No trailing slashes
3. Use HTTPS (not HTTP)
4. Redeploy Render service after changes

### Database Connection Fails

**Check:**
- `DATABASE_URL` is set in Render
- Database is running (check Render dashboard)
- Connection string format is correct

**Format:**
```
postgresql://user:password@host:port/database
```

### Cold Start Issues (Render Free Tier)

**Expected Behavior:**
- First request after 15 min inactivity: 30-60 seconds
- Subsequent requests: Fast

**Solutions:**
1. Upgrade to paid plan ($7/month)
2. Use ping service (UptimeRobot)
3. Accept the limitation

---

## 💰 COST BREAKDOWN

### Current Setup (FREE)

| Service | Plan | Cost |
|---------|------|------|
| Netlify | Free | $0/month |
| Render Web Service | Free | $0/month |
| Render PostgreSQL | Free | $0/month |
| **Total** | | **$0/month** |

**Limitations:**
- Render services spin down after 15 min inactivity
- No automatic database backups
- Limited resources

### Recommended Production Setup

| Service | Plan | Cost |
|---------|------|------|
| Netlify | Free | $0/month |
| Render Web Service | Starter | $7/month |
| Render PostgreSQL | Starter | $7/month |
| **Total** | | **$14/month** |

**Benefits:**
- No cold starts
- Always-on services
- Automatic daily backups
- Better performance

---

## ✅ DEPLOYMENT CHECKLIST

### Completed
- [x] Netlify environment variables configured
- [x] Netlify deployment initiated
- [x] Deployment guides created
- [x] Secrets generated

### Your Tasks
- [ ] Sign up / Login to Render
- [ ] Create PostgreSQL database on Render
- [ ] Create web service on Render
- [ ] Set Render environment variables
- [ ] Wait for Render deployment
- [ ] Update Netlify with Render URL
- [ ] Run database migrations
- [ ] Create admin user
- [ ] Test all functionality

---

## 🎉 NEXT STEPS

1. **Monitor Netlify Deployment:**
   - Check: https://app.netlify.com/sites/b4b2e692-f11d-4f62-95b7-65c99e7184d5/deploys/6986461cb936ef4f3a18ee11
   - Wait for completion (5-10 minutes)

2. **Set Up Render:**
   - Follow Steps 1-3 above
   - Should take 15-20 minutes

3. **Complete Integration:**
   - Follow Steps 4-6 above
   - Test everything (Step 7)

**Total Time:** ~30-40 minutes

---

## 📞 NEED HELP?

### Check Logs
- **Netlify:** Dashboard → Deploys → Latest Deploy → Logs
- **Render:** Dashboard → Service → Logs

### Common Questions

**Q: Netlify build is taking too long?**
A: First build can take 10-15 minutes. Subsequent builds are faster.

**Q: Render service won't start?**
A: Check environment variables, especially `DATABASE_URL`. View logs for errors.

**Q: Can't connect to database?**
A: Use the Internal Database URL (not External) for Render services.

**Q: API calls failing?**
A: Verify `CORS_ORIGIN` in Render and `NEXT_PUBLIC_API_URL` in Netlify.

---

## 🏆 SUCCESS!

Once all steps are complete, you'll have:

✅ Frontend deployed on Netlify  
✅ Backend deployed on Render  
✅ PostgreSQL database on Render  
✅ All services connected and working  
✅ Admin access configured  

**Your application will be LIVE!** 🚀

---

_Last Updated: February 7, 2026_  
_Para Shooting Committee of India © 2026_
