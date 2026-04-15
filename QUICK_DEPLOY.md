# 🚀 QUICK DEPLOYMENT GUIDE

## Current Status
✅ Netlify account detected: saitritej2006@gmail.com
✅ Existing project found: **para-shooting-india-webf**
✅ Current URL: http://para-shooting-india-webf.netlify.app

---

## STEP-BY-STEP DEPLOYMENT

### Step 1: Prepare Environment Variables

Create `results_final/.env.production` file with these values:

```env
# Generate these secrets first!
JWT_SECRET=<GENERATE_64_CHAR_SECRET>
REFRESH_TOKEN_SECRET=<GENERATE_64_CHAR_SECRET>
ENCRYPTION_KEY=<GENERATE_64_CHAR_SECRET>
```

**Generate secrets with:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Step 2: Deploy Frontend to Netlify

The project is already set up! Just need to:

1. **Update netlify.toml** (already configured ✅)
2. **Set Environment Variables in Netlify:**
   - Go to: https://app.netlify.com/sites/para-shooting-india-webf/settings/deploys#environment
   - Add:
     ```
     NEXT_PUBLIC_API_URL=<YOUR_BACKEND_URL>/api/v1
     JWT_SECRET=<SAME_AS_BACKEND>
     NODE_ENV=production
     ```

3. **Trigger Deploy:**
   ```bash
   cd results_final
   git add .
   git commit -m "Deploy to production"
   git push origin result3
   ```

---

### Step 3: Deploy Backend to Railway

#### Option A: Using Railway Web Interface

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory:** `apps/api`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`

5. Add PostgreSQL:
   - Click "+ New" → "Database" → "PostgreSQL"

6. Set Environment Variables:
   ```env
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=<YOUR_64_CHAR_SECRET>
   JWT_EXPIRES_IN=7d
   REFRESH_TOKEN_SECRET=<YOUR_64_CHAR_SECRET>
   REFRESH_TOKEN_EXPIRES_IN=30d
   ENCRYPTION_KEY=<YOUR_64_CHAR_SECRET>
   CORS_ORIGIN=https://para-shooting-india-webf.netlify.app
   MAX_FILE_SIZE=5242880
   THROTTLE_TTL=60
   THROTTLE_LIMIT=10
   LOG_LEVEL=info
   ```

#### Option B: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd results_final/apps/api
railway init

# Add PostgreSQL
railway add

# Deploy
railway up
```

---

### Step 4: Run Database Migrations

After backend is deployed:

```bash
# Connect to Railway PostgreSQL
railway run npm run migrate:sql

# Or manually run SQL files from apps/api/migrations/
```

---

### Step 5: Update CORS

After both deployments:

1. Get your Railway backend URL (e.g., `https://your-app.up.railway.app`)
2. Update Netlify env var:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api/v1
   ```
3. Update Railway env var:
   ```
   CORS_ORIGIN=https://para-shooting-india-webf.netlify.app
   ```

---

### Step 6: Test Deployment

1. **Backend Health Check:**
   ```
   https://your-app.up.railway.app/api/v1/health
   ```

2. **Frontend:**
   ```
   https://para-shooting-india-webf.netlify.app
   ```

3. **Test Login:**
   - Go to admin dashboard
   - Login with credentials
   - Verify API calls work

---

## AUTOMATED DEPLOYMENT SCRIPT

I can deploy this for you automatically! Would you like me to:

1. ✅ Commit current changes
2. ✅ Push to GitHub
3. ✅ Trigger Netlify deployment
4. ✅ Set up Railway backend
5. ✅ Configure all environment variables

Just say "YES, DEPLOY NOW" and I'll handle everything!

---

## Manual Deployment Commands

If you prefer manual control:

```bash
# 1. Commit changes
cd results_final
git add .
git commit -m "Production deployment"
git push origin result3

# 2. Deploy to Netlify (automatic on push)
# Or manually:
netlify deploy --prod --dir=apps/web/.next

# 3. Deploy to Railway
cd apps/api
railway up

# 4. Run migrations
railway run npm run migrate:sql
```

---

## Need Help?

- Netlify Dashboard: https://app.netlify.com/sites/para-shooting-india-webf
- Railway Dashboard: https://railway.app/dashboard
- Full Guide: See DEPLOYMENT_COMPLETE_GUIDE.md

---

**Ready to deploy?** Let me know and I'll start the process! 🚀
