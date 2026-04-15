# 🚀 Complete Deployment Guide - Para Shooting India Platform

## 📊 Tech Stack Analysis

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 3.4
- **UI Library:** Lucide React (icons)
- **State:** React 18 with hooks
- **Auth:** JWT with jose library

### Backend
- **Framework:** NestJS 11
- **Language:** TypeScript 5.7
- **Database:** PostgreSQL 16 (TypeORM)
- **Auth:** Passport JWT + bcrypt
- **Security:** Helmet, CORS, Rate Limiting, Throttling
- **File Upload:** Multer
- **Logging:** Winston

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Monorepo:** npm workspaces

---

## 🎯 Recommended Deployment Architecture

### Option 1: **RECOMMENDED - Free Tier**
- **Frontend:** Vercel (Free tier - Perfect for Next.js)
- **Backend:** Railway (Free $5/month credit)
- **Database:** Railway PostgreSQL (Included)
- **File Storage:** Vercel Blob Storage or Cloudinary (Free tier)

### Option 2: **Alternative - Netlify**
- **Frontend:** Netlify (Free tier)
- **Backend:** Render (Free tier)
- **Database:** Render PostgreSQL (Free tier)
- **File Storage:** Cloudinary (Free tier)

### Option 3: **Self-Hosted - Docker**
- **All Services:** Docker Compose on VPS (DigitalOcean, AWS, etc.)
- **Cost:** ~$5-10/month

---

## 🚀 DEPLOYMENT STEPS

# ═══════════════════════════════════════════════════════════════
# OPTION 1: VERCEL + RAILWAY (RECOMMENDED)
# ═══════════════════════════════════════════════════════════════

## Step 1: Deploy Backend to Railway

### 1.1 Prerequisites
- GitHub account with your repository
- Railway account (sign up at https://railway.app)

### 1.2 Create Railway Project

1. **Go to Railway Dashboard**
   - Visit https://railway.app/dashboard
   - Click "New Project"

2. **Deploy from GitHub**
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub
   - Select your repository
   - Choose branch: `result3`

3. **Add PostgreSQL Database**
   - In your Railway project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway automatically creates and links the database

### 1.3 Configure Backend Service

1. **Set Root Directory**
   - Go to your service settings
   - Set "Root Directory": `apps/api`

2. **Configure Build Command**
   ```bash
   npm install && npm run build
   ```

3. **Configure Start Command**
   ```bash
   npm run start:prod
   ```

### 1.4 Environment Variables (Railway Backend)

Add these in Railway Dashboard → Variables:

```env
# Application
NODE_ENV=production
PORT=4000
API_PREFIX=api/v1

# Database (Railway auto-fills this)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Security - GENERATE NEW SECRETS!
JWT_SECRET=CHANGE_THIS_TO_RANDOM_64_CHAR_STRING
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=CHANGE_THIS_TO_ANOTHER_RANDOM_64_CHAR_STRING
REFRESH_TOKEN_EXPIRES_IN=30d
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# CORS (Add your Vercel URL after frontend deployment)
CORS_ORIGIN=https://your-app.vercel.app

# File Upload
MAX_FILE_SIZE=5242880
THROTTLE_TTL=60
THROTTLE_LIMIT=10
LOG_LEVEL=info
```

### 1.5 Generate Secure Secrets

Use these commands to generate secure secrets:

```bash
# JWT_SECRET (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# REFRESH_TOKEN_SECRET (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ENCRYPTION_KEY (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.6 Deploy Backend

1. Railway will automatically deploy after configuration
2. Wait for deployment to complete (check logs)
3. Note your Railway URL: `https://your-app.up.railway.app`

### 1.7 Run Database Migrations

1. **Connect to Railway PostgreSQL**
   - Go to PostgreSQL service → Data tab
   - Or use connection string from variables

2. **Run Migrations**
   ```bash
   # Option A: Use Railway CLI
   railway run npm run migrate:sql

   # Option B: Connect directly and run SQL files
   # Use files from apps/api/migrations/
   ```

3. **Create Admin User**
   ```sql
   -- Run this in Railway PostgreSQL console
   INSERT INTO users (email, password_hash, full_name, role, is_active)
   VALUES (
     'admin@psci.in',
     '$2b$10$YourHashedPasswordHere',
     'Admin User',
     'admin',
     true
   );
   ```

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Prerequisites
- Vercel account (sign up at https://vercel.com)
- Railway backend URL from Step 1

### 2.2 Create Vercel Project

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Repository**
   - Select your GitHub repository
   - Choose branch: `result3`

### 2.3 Configure Build Settings

1. **Framework Preset:** Next.js (auto-detected)

2. **Root Directory:** `apps/web`

3. **Build Command:**
   ```bash
   npm install && npm run build
   ```

4. **Output Directory:** `.next` (default)

5. **Install Command:**
   ```bash
   npm install
   ```

### 2.4 Environment Variables (Vercel Frontend)

Add these in Vercel → Project Settings → Environment Variables:

```env
# Environment
NODE_ENV=production
NEXT_PUBLIC_ENV=production

# Backend Connection (Use your Railway URL)
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000

# Security (MUST MATCH Railway JWT_SECRET exactly!)
JWT_SECRET=SAME_AS_RAILWAY_JWT_SECRET

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SENTRY=false
NEXT_PUBLIC_DEBUG_MODE=false

# App Metadata
NEXT_PUBLIC_APP_NAME=Para Shooting Committee of India
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 2.5 Deploy Frontend

1. Click "Deploy"
2. Wait for build to complete (5-10 minutes)
3. Note your Vercel URL: `https://your-app.vercel.app`

---

## Step 3: Update CORS Configuration

### 3.1 Update Railway Backend

1. Go to Railway → Your Backend Service → Variables
2. Update `CORS_ORIGIN` with your Vercel URL:
   ```env
   CORS_ORIGIN=https://your-app.vercel.app,https://your-app-git-result3.vercel.app
   ```
3. Redeploy the backend service

---

## Step 4: Verification & Testing

### 4.1 Test Backend Health

Visit: `https://your-app.up.railway.app/api/v1/health`

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-07T..."
}
```

### 4.2 Test Frontend

1. Visit: `https://your-app.vercel.app`
2. Navigate to different pages
3. Try login with admin credentials
4. Test all features

### 4.3 Test API Integration

1. Open browser DevTools → Network tab
2. Login to admin dashboard
3. Verify API calls to Railway backend succeed
4. Check for CORS errors (should be none)

---

# ═══════════════════════════════════════════════════════════════
# OPTION 2: NETLIFY + RENDER (ALTERNATIVE)
# ═══════════════════════════════════════════════════════════════

## Step 1: Deploy Backend to Render

### 1.1 Create Render Account
- Sign up at https://render.com

### 1.2 Create PostgreSQL Database

1. Click "New" → "PostgreSQL"
2. Name: `psci-database`
3. Select free tier
4. Note the connection details

### 1.3 Create Web Service

1. Click "New" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name:** `psci-api`
   - **Root Directory:** `apps/api`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Environment:** Node

### 1.4 Environment Variables (Render)

Same as Railway configuration above, but use Render's PostgreSQL URL.

---

## Step 2: Deploy Frontend to Netlify

### 2.1 Create Netlify Account
- Sign up at https://netlify.com

### 2.2 Deploy Site

1. Click "Add new site" → "Import an existing project"
2. Connect GitHub repository
3. Configure:
   - **Base directory:** `apps/web`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `apps/web/.next`

### 2.3 Environment Variables (Netlify)

Add in Netlify → Site Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com/api/v1
JWT_SECRET=SAME_AS_RENDER_JWT_SECRET
NODE_ENV=production
```

---

# ═══════════════════════════════════════════════════════════════
# OPTION 3: DOCKER COMPOSE (SELF-HOSTED)
# ═══════════════════════════════════════════════════════════════

## Step 1: Prepare VPS

### 1.1 Requirements
- Ubuntu 22.04 LTS or similar
- 2GB RAM minimum
- 20GB storage
- Docker & Docker Compose installed

### 1.2 Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group
sudo usermod -aG docker $USER
```

## Step 2: Deploy Application

### 2.1 Clone Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
git checkout result3
```

### 2.2 Create Environment Files

Create `.env` in root:
```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=CHANGE_THIS_SECURE_PASSWORD
POSTGRES_DB=psci_platform
REDIS_PASSWORD=CHANGE_THIS_SECURE_PASSWORD
PGADMIN_EMAIL=admin@psci.in
PGADMIN_PASSWORD=CHANGE_THIS_SECURE_PASSWORD
```

Create `apps/api/.env`:
```env
DATABASE_URL=postgresql://admin:CHANGE_THIS_SECURE_PASSWORD@postgres:5432/psci_platform
NODE_ENV=production
PORT=4000
JWT_SECRET=GENERATE_SECURE_SECRET
# ... (rest of variables)
```

Create `apps/web/.env`:
```env
NEXT_PUBLIC_API_URL=http://your-vps-ip:4000/api/v1
JWT_SECRET=SAME_AS_API_JWT_SECRET
# ... (rest of variables)
```

### 2.3 Build and Deploy

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Run migrations
docker-compose exec api npm run migrate:sql
```

### 2.4 Configure Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install nginx -y

# Create configuration
sudo nano /etc/nginx/sites-available/psci
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:4000;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/psci /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2.5 SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

# ═══════════════════════════════════════════════════════════════
# POST-DEPLOYMENT TASKS
# ═══════════════════════════════════════════════════════════════

## Security Checklist

- [ ] Generate and use strong, unique secrets for production
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Disable debug mode in production
- [ ] Review and restrict database access
- [ ] Set up monitoring and alerting
- [ ] Configure automated backups
- [ ] Implement error tracking (Sentry)

## Database Tasks

- [ ] Run all migrations
- [ ] Seed initial data (categories, states, etc.)
- [ ] Create admin user account
- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Optimize indexes

## File Upload Configuration

⚠️ **Important:** Local file uploads won't work on serverless platforms!

### Solution: Migrate to Cloud Storage

#### Option A: Vercel Blob Storage
```bash
npm install @vercel/blob
```

#### Option B: Cloudinary
```bash
npm install cloudinary
```

#### Option C: AWS S3
```bash
npm install @aws-sdk/client-s3
```

## Monitoring Setup

### 1. Application Monitoring

**Vercel:**
- Built-in analytics
- Real-time logs
- Performance metrics

**Railway:**
- Resource usage dashboard
- Application logs
- Database metrics

### 2. Error Tracking

**Sentry Setup:**
```bash
npm install @sentry/nextjs @sentry/node
```

### 3. Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- Better Uptime

---

# ═══════════════════════════════════════════════════════════════
# TROUBLESHOOTING
# ═══════════════════════════════════════════════════════════════

## Common Issues

### Issue: CORS Errors

**Symptoms:**
- API calls fail with CORS error
- Browser console shows "Access-Control-Allow-Origin" error

**Solution:**
1. Check `CORS_ORIGIN` in backend includes frontend URL
2. Ensure no trailing slashes
3. Include both production and preview URLs
4. Redeploy backend after changes

### Issue: JWT Invalid Signature

**Symptoms:**
- Login works but subsequent requests fail
- "Invalid token" errors

**Solution:**
1. Verify `JWT_SECRET` matches exactly between frontend and backend
2. Check for extra spaces or line breaks
3. Regenerate tokens after secret change

### Issue: Database Connection Failed

**Symptoms:**
- Backend fails to start
- "Connection refused" errors

**Solution:**
1. Verify `DATABASE_URL` format
2. Check database service is running
3. Verify network connectivity
4. Check firewall rules

### Issue: File Uploads Not Working

**Symptoms:**
- Upload button doesn't work
- Files not saved

**Solution:**
1. Implement cloud storage (S3/Cloudinary)
2. Update multer configuration
3. Configure proper CORS for upload endpoint

### Issue: Build Failures

**Symptoms:**
- Deployment fails during build
- TypeScript errors
- Module not found errors

**Solution:**
1. Check all dependencies are in package.json
2. Verify Node version compatibility
3. Clear build cache and retry
4. Check for TypeScript errors locally

### Issue: Environment Variables Not Working

**Symptoms:**
- Features not working as expected
- Undefined values in logs

**Solution:**
1. Verify variable names (NEXT_PUBLIC_ prefix for client-side)
2. Redeploy after adding variables
3. Check for typos in variable names
4. Restart services after changes

---

# ═══════════════════════════════════════════════════════════════
# MAINTENANCE
# ═══════════════════════════════════════════════════════════════

## Regular Tasks

### Daily
- [ ] Check application logs
- [ ] Monitor error rates
- [ ] Review security alerts

### Weekly
- [ ] Review performance metrics
- [ ] Check database size and growth
- [ ] Verify backup integrity
- [ ] Update dependencies (security patches)

### Monthly
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Database maintenance (VACUUM, ANALYZE)
- [ ] Review and rotate secrets
- [ ] Update documentation

## Backup Strategy

### Database Backups

**Railway:**
- Automatic daily backups (retained 7 days)
- Manual backups before major changes

**Self-Hosted:**
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T postgres pg_dump -U admin psci_platform > backup_$DATE.sql
```

### File Backups

- Use cloud storage (S3/Cloudinary) for automatic redundancy
- Regular exports of uploaded files
- Version control for code

## Rollback Procedure

### Vercel Rollback
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Railway Rollback
1. Go to Deployments tab
2. Select previous deployment
3. Click "Redeploy"

### Docker Rollback
```bash
# Stop current containers
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Rebuild and start
docker-compose up -d --build
```

---

# ═══════════════════════════════════════════════════════════════
# PERFORMANCE OPTIMIZATION
# ═══════════════════════════════════════════════════════════════

## Frontend Optimization

### 1. Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Use WebP format
- Set proper cache headers

### 2. Code Splitting
- Dynamic imports for large components
- Route-based code splitting (automatic in Next.js)
- Lazy load non-critical components

### 3. Caching Strategy
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## Backend Optimization

### 1. Database Indexing
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_results_event_id ON results(event_id);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
```

### 2. Query Optimization
- Use select specific columns
- Implement pagination
- Add database query logging
- Use connection pooling

### 3. Caching
- Implement Redis for session storage
- Cache frequently accessed data
- Use HTTP cache headers

### 4. Rate Limiting
```typescript
// Already configured in your NestJS app
@UseGuards(ThrottlerGuard)
@Throttle(10, 60) // 10 requests per 60 seconds
```

---

# ═══════════════════════════════════════════════════════════════
# SCALING STRATEGY
# ═══════════════════════════════════════════════════════════════

## Horizontal Scaling

### Frontend (Vercel/Netlify)
- Automatic scaling
- Global CDN
- Edge functions

### Backend (Railway/Render)
- Upgrade to higher tier for auto-scaling
- Add more instances
- Load balancing (automatic)

### Database
- Upgrade to higher tier
- Enable read replicas
- Implement connection pooling

## Vertical Scaling

### When to Scale Up
- CPU usage > 70% consistently
- Memory usage > 80%
- Database connections maxed out
- Response times > 500ms

### How to Scale
1. **Railway/Render:** Upgrade plan in dashboard
2. **Self-Hosted:** Increase VPS resources
3. **Database:** Upgrade to higher tier or optimize queries

---

# ═══════════════════════════════════════════════════════════════
# COST ESTIMATION
# ═══════════════════════════════════════════════════════════════

## Free Tier (Recommended for Start)

### Vercel + Railway
- **Vercel:** Free (100GB bandwidth, unlimited requests)
- **Railway:** $5/month credit (enough for small apps)
- **Total:** ~$0-5/month

### Netlify + Render
- **Netlify:** Free (100GB bandwidth)
- **Render:** Free tier (limited hours)
- **Total:** $0/month (with limitations)

## Production Tier

### Vercel + Railway
- **Vercel Pro:** $20/month
- **Railway Hobby:** $5/month + usage (~$10-20/month)
- **Total:** ~$35-45/month

### Self-Hosted VPS
- **DigitalOcean Droplet:** $12/month (2GB RAM)
- **Cloudflare:** Free (CDN + DDoS protection)
- **Total:** ~$12/month

---

# ═══════════════════════════════════════════════════════════════
# SUPPORT & RESOURCES
# ═══════════════════════════════════════════════════════════════

## Documentation Links

- **Next.js:** https://nextjs.org/docs
- **NestJS:** https://docs.nestjs.com
- **Vercel:** https://vercel.com/docs
- **Railway:** https://docs.railway.app
- **PostgreSQL:** https://www.postgresql.org/docs

## Community Support

- **Next.js Discord:** https://nextjs.org/discord
- **NestJS Discord:** https://discord.gg/nestjs
- **Stack Overflow:** Tag your questions appropriately

## Monitoring Dashboards

After deployment, bookmark these:
- Vercel Dashboard: https://vercel.com/dashboard
- Railway Dashboard: https://railway.app/dashboard
- Database Admin: (Railway provides built-in)

---

## 🎉 Deployment Complete!

Your application should now be live and accessible. Make sure to:

1. ✅ Test all features thoroughly
2. ✅ Set up monitoring and alerts
3. ✅ Configure automated backups
4. ✅ Document your deployment URLs
5. ✅ Share with stakeholders

**Need help?** Check the troubleshooting section or reach out to the community.

---

_Last Updated: February 7, 2026_
_Para Shooting Committee of India © 2026_
