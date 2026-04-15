# Environment Variables - Production

## 🔐 Critical Security Notice
**NEVER commit real `.env` or `.env.local` files to Git!**
These files contain sensitive secrets and credentials.

---

## Backend Environment Variables (Railway)

Create these in Railway Dashboard → Project → Variables:

```env
# Environment
NODE_ENV=production

# Server
PORT=4000

# Database (Auto-filled by Railway when you add PostgreSQL)
DATABASE_URL=${DATABASE_URL}

# JWT Authentication
JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_STRING_IN_PRODUCTION
JWT_EXPIRATION=7d

# CORS - Add your Vercel URL here
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-custom-domain.com

# File Uploads (if using cloud storage)
# AWS_ACCESS_KEY_ID=your_aws_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret
# AWS_S3_BUCKET=your_bucket_name
# AWS_REGION=us-east-1
```

---

## Frontend Environment Variables (Vercel)

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Backend API URL (from Railway deployment)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1

# JWT Secret (MUST match backend!)
JWT_SECRET=SAME_AS_BACKEND_JWT_SECRET
```

---

## Local Development (.env files)

### Backend (`apps/api/.env`)
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/para_shooting_db
JWT_SECRET=development_secret_key_123
JWT_EXPIRATION=7d
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
JWT_SECRET=development_secret_key_123
```

---

## Generating Secure JWT_SECRET

Use one of these methods to generate a secure random string:

### Node.js
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### PowerShell
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
```

### Online
https://www.uuidgenerator.net/ (use UUID v4, repeat 4 times and concat)

---

## Environment File Checklist

Before deploying to production:

- [ ] Generate new secure `JWT_SECRET` (never use development secret!)
- [ ] Update `ALLOWED_ORIGINS` with actual frontend URL
- [ ] Verify `DATABASE_URL` is set correctly on Railway
- [ ] Ensure `NEXT_PUBLIC_API_URL` points to Railway backend
- [ ] Confirm all secrets match between frontend and backend
- [ ] Add `.env.local` to `.gitignore` (if not already there)
- [ ] Never commit `.env` files to version control

---

## Verification

After setting environment variables:

1. **Backend Health Check**: 
   Visit: `https://your-backend.railway.app/api/v1/health`
   
2. **Frontend API Connection**:
   Check browser console on: `https://your-frontend.vercel.app`
   Should see successful API requests

3. **Authentication**:
   Try logging in with admin credentials
   If you get "Invalid signature" error, JWT_SECRET mismatch!
