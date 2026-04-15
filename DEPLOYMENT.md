# 🚀 Para Shooting India - Deployment Guide

## Server Information

- **IP**: 68.178.164.93
- **User**: webtesters
- **OS**: Ubuntu 24.04 LTS
- **Node.js**: v20.20.0
- **PostgreSQL**: 16.11
- **Nginx**: 1.24.0

## Recent Changes (March 2026)

### 1. Contact Page — Complete Redesign

- **File**: `apps/web/src/app/(public)/contact/page.tsx`
- Replaced entire contact page with a premium design including:
  - Hero banner with animated gradient overlay
  - Sticky quick-contact bar (phone, email, address)
  - Leadership cards (Chairman, Vice Chairman, Secretary General, Treasurer/Joint Secretary)
  - Zone Incharge cards (North, South, East, West)
  - Full directory table with role, name, email, and category badges
  - Contact form with POST to `/api/v1/contact` and `mailto:` fallback
  - Scroll-triggered animations (IntersectionObserver)
  - Fully responsive across devices
- **Note**: No changes to navbar, footer, or layout shell

### 2. Shooter Profile Management — Re-Review on Edit

- **API File**: `apps/api/src/shooters/shooters.service.ts`
- **Web File**: `apps/web/src/app/(dashboard)/shooter/profile/page.tsx`
- When a shooter edits their profile **after** it has been approved or rejected, their status automatically reverts to `pending`, forcing a re-review by admins
- Fixed shooter approval API endpoint:
  - Changed to use PATCH with JSON body (`Content-Type: application/json`)
  - Made `approvedBy` field optional in `ApproveDto`

### 3. Shooter Dashboard Sidebar — Navigation Simplified

- **File**: `apps/web/src/app/(dashboard)/shooter/layout.tsx`
- Commented out the following sidebar items (temporarily hidden):
  - Dashboard
  - Import Permit
  - Participation (Match Registration, My Matches, Athlete History)
  - Results (My Scores, International Medalist, Certificates)
  - Equipment (My Equipment, Equipment Control)
  - Payments
  - Support & FAQ
- Only **My Profile** (with sub-items: My Profile, My ID Card) remains active

### 4. API Dependencies Required

- The following packages must be installed on the server for the API to build:
  ```bash
  # In apps/api/
  npm install --save pdf-lib archiver qrcode nodemailer
  npm install --save-dev @types/archiver @types/qrcode @types/nodemailer
  ```

### 5. VPS Build Fixes & UI Tweaks (March 3)

- **Fixed `next build` errors on VPS**:
  - Replaced escaped backticks (`\``) with proper backticks (`` ` ``) in `apps/web/src/app/(dashboard)/admin/certificates/generate/page.tsx`and`apps/web/src/app/(public)/verify/[[...certNo]]/page.tsx`.
  - Fixed relative CSS import path in `verify/[[...certNo]]/page.tsx` from `./verify.css` to `../verify.css`.
- **Contact Page UI Tweaks**:
  - Removed `sticky top-0` from the quick contact bar so it scrolls naturally with the page.
  - Renamed "Committee Members" to "Working Committee Members".

---

## Deployment Steps

### 1. Upload Code to Server

```bash
# From your local machine
scp -r apps webtesters@68.178.164.93:/home/webtesters/para-shooting-india/
scp package.json webtesters@68.178.164.93:/home/webtesters/para-shooting-india/
scp deploy.sh webtesters@68.178.164.93:/home/webtesters/
```

### 2. Run Deployment Script

```bash
# SSH into server
ssh webtesters@68.178.164.93

# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 3. Access Your Application

- **Frontend**: http://68.178.164.93
- **Backend API**: http://68.178.164.93/api/v1
- **Health Check**: http://68.178.164.93/api/v1/health

## Post-Deployment

### Check Application Status

```bash
pm2 status
pm2 logs para-api
pm2 logs para-web
```

### Restart Services

```bash
pm2 restart para-api
pm2 restart para-web
# or
pm2 restart all
```

### View Logs

```bash
# API logs
pm2 logs para-api --lines 100

# Web logs
pm2 logs para-web --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Access

```bash
# Connect to database
psql -U para_shooting_user -d para_shooting_db -h localhost

# Password: ParaShooting2025!SecureDB
```

## Troubleshooting

### If API won't start

```bash
cd /home/webtesters/para-shooting-india/apps/api
npm run build
pm2 restart para-api
pm2 logs para-api
```

### If Web won't start

```bash
cd /home/webtesters/para-shooting-india/apps/web
npm run build
pm2 restart para-web
pm2 logs para-web
```

### Database connection issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check database exists
sudo -u postgres psql -l | grep para_shooting
```

### Nginx issues

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx
```

## Security Recommendations

1. **Change default database password** in `/home/webtesters/para-shooting-india/apps/api/.env`
2. **Set up SSL certificate** using Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```
3. **Configure firewall**:
   ```bash
   sudo ufw enable
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   ```

## Updating the Application

> **Note**: Before deploying, check the **Recent Changes** section above for any new dependency requirements or special steps.

```bash
# SSH into server
ssh webtesters@68.178.164.93

# Navigate to app directory
cd /home/webtesters/para-shooting-india

# Pull latest changes (if using git)
git pull origin main

# Rebuild and restart API
cd apps/api
npm install
# Install any newly added dependencies (if needed)
npm install --save pdf-lib archiver qrcode nodemailer
npm install --save-dev @types/archiver @types/qrcode @types/nodemailer
npm run build
pm2 restart para-api

# Rebuild and restart Web
cd ../web
npm install
npm run build
pm2 restart para-web

# Verify everything is running
pm2 status
```

## Environment Variables

### API (.env location: `/home/webtesters/para-shooting-india/apps/api/.env`)

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Auto-generated secure key
- `ENCRYPTION_KEY`: Auto-generated secure key
- `PORT`: 4000
- `NODE_ENV`: production

### Web (.env.local location: `/home/webtesters/para-shooting-india/apps/web/.env.local`)

- `NEXT_PUBLIC_API_URL`: http://68.178.164.93:4000/api/v1
- `NODE_ENV`: production

## Monitoring

### Set up PM2 monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Check resource usage

```bash
pm2 monit
```

## Backup

### Database backup

```bash
# Create backup
pg_dump -U para_shooting_user -d para_shooting_db > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U para_shooting_user -d para_shooting_db < backup_20260214.sql
```

## Support

If you encounter issues:

1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check system logs: `sudo journalctl -xe`
