# Production Deployment Guide

## Overview
This guide covers deploying the Para Shooting India application to production using:
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (NestJS + PostgreSQL)

---

## Prerequisites

1. **GitHub Repository**: https://github.com/RLalithSeeker/results_final
2. **Vercel Account**: https://vercel.com
3. **Railway Account**: https://railway.app

---

## Step 1: Deploy Backend to Railway

### 1.1 Create New Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `RLalithSeeker/results_final`
5. Select branch: `result3`

### 1.2 Add PostgreSQL Database
1. In Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create the database

### 1.3 Configure Environment Variables
Add these variables in Railway dashboard:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=${DATABASE_URL}  # Auto-filled by Railway
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

### 1.4 Configure Build Settings
- **Root Directory**: `/`
- **Build Command**: `cd apps/api && npm install && npm run build`
- **Start Command**: `cd apps/api && npm run start:prod`

### 1.5 Run Database Migrations
After first deploy, connect to Railway PostgreSQL and run:
```bash
# Connect to Railway PostgreSQL shell
# Run seed scripts from apps/api/scripts/
```

### 1.6 Note Your Backend URL
Railway will give you a URL like: `https://your-app.railway.app`

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create New Vercel Project
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import `RLalithSeeker/results_final`
4. Select branch: `result3`

### 2.2 Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 2.3 Add Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-app.railway.app/api/v1
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

⚠️ **IMPORTANT**: Use the SAME `JWT_SECRET` as Railway!

### 2.4 Deploy
Click "Deploy" and wait for build to complete.

---

## Step 3: Update Railway CORS

After Vercel deployment:
1. Get your Vercel URL: `https://your-app.vercel.app`
2. Update Railway `ALLOWED_ORIGINS` env var to include it
3. Redeploy Railway app

---

## Step 4: Verify Deployment

### 4.1 Test Backend
Visit: `https://your-app.railway.app/api/v1/health`
Should return: `{"status":"ok"}`

### 4.2 Test Frontend
1. Visit: `https://your-app.vercel.app`
2. Try logging in with admin credentials
3. Test classification document upload
4. Verify all features work

---

## Environment Variables Reference

### Backend (Railway)
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `4000` |
| `DATABASE_URL` | PostgreSQL connection | Auto-filled |
| `JWT_SECRET` | JWT signing key | `random-secure-string` |
| `JWT_EXPIRATION` | Token expiry | `7d` |
| `ALLOWED_ORIGINS` | CORS origins | `https://your-app.vercel.app` |

### Frontend (Vercel)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://your-app.railway.app/api/v1` |
| `JWT_SECRET` | JWT secret (must match backend) | `random-secure-string` |

---

## Post-Deployment Tasks

### Security
- [ ] Generate new strong `JWT_SECRET` for production
- [ ] Enable Railway's private networking if needed
- [ ] Review and restrict CORS origins
- [ ] Enable Vercel's security headers
- [ ] Set up monitoring and error tracking

### Database
- [ ] Run production seed data (categories, roles, etc.)
- [ ] Set up automated backups on Railway
- [ ] Create admin user account

### File Uploads
⚠️ **Current Issue**: Local file uploads won't work on Railway

**Solution Required**: Migrate to cloud storage
- AWS S3
- Cloudinary
- Vercel Blob Storage

---

## Troubleshooting

### Issue: 403 Forbidden on API calls
**Solution**: Check `ALLOWED_ORIGINS` in Railway includes your Vercel URL

### Issue: JWT Invalid Signature
**Solution**: Ensure `JWT_SECRET` matches exactly between Railway and Vercel

### Issue: Database connection failed
**Solution**: Verify `DATABASE_URL` is set correctly in Railway

### Issue: File uploads not working
**Solution**: Implement cloud storage (S3/Cloudinary) - see docs

---

## Monitoring

### Railway
- View logs: Railway Dashboard → App → Deployments
- Database metrics: Railway Dashboard → PostgreSQL

### Vercel
- View logs: Vercel Dashboard → Project → Deployments
- Analytics: Vercel Dashboard → Analytics

---

## Rollback Procedure

### Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Railway
1. Go to Deployments
2. Select previous deployment
3. Click "Redeploy"

---

## Support

For issues, check:
1. Railway logs for backend errors
2. Vercel logs for frontend errors  
3. Browser console for client-side errors
