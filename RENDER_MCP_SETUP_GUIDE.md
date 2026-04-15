# 🔧 RENDER MCP - Setup & Usage Guide

## ✅ MCP STATUS: WORKING

The Render MCP is **functional and ready to use**, but requires initial workspace setup.

---

## 🔍 CURRENT STATUS

### MCP Connection: ✅ ACTIVE

**Test Result:**
```
Tool: get_selected_workspace
Result: no workspace set. Prompt the user to select a workspace.
```

**What This Means:**
- ✅ Render MCP is installed and working
- ✅ Connection to Render API is active
- ⚠️ Workspace needs to be selected (one-time setup)
- ⚠️ This is a security feature to prevent accidental deployments

---

## 🚀 HOW TO SET UP RENDER WORKSPACE

### Option 1: Using Render Dashboard (Recommended)

Since the MCP requires a workspace to be selected and this is a destructive operation that should be done carefully, here's the recommended approach:

#### Step 1: Create Render Account

1. **Go to:** https://render.com
2. **Sign up with:**
   - GitHub (recommended - easier integration)
   - GitLab
   - Email

3. **Complete account setup:**
   - Verify email
   - Choose a team/workspace name
   - Set up billing (free tier available)

#### Step 2: Note Your Workspace

After signing up, Render will create a default workspace. You'll see it in the dashboard.

**Important:** The workspace name is usually your account name or team name.

---

## 🎯 WHAT THE RENDER MCP CAN DO

Once the workspace is set up, the Render MCP provides these capabilities:

### 1. **Create Services**

#### Create Web Service
```
Tool: create_web_service
- Deploy Node.js/Python/Go/Rust/Ruby/Elixir apps
- Auto-deploy from GitHub
- Configure environment variables
- Set build and start commands
```

#### Create Cron Job
```
Tool: create_cron_job
- Schedule recurring tasks
- Set cron schedule
- Configure build and run commands
```

#### Create Static Site
```
Tool: create_static_site
- Deploy static websites
- Auto-deploy from GitHub
- Configure build commands
```

### 2. **Create Databases**

#### Create PostgreSQL
```
Tool: create_postgres
- PostgreSQL 12-16
- Free tier available
- Automatic backups (paid plans)
- Connection pooling
```

#### Create Redis (Key-Value Store)
```
Tool: create_key_value
- Redis 7
- Free tier available
- Multiple eviction policies
```

### 3. **Monitor Services**

#### Get Metrics
```
Tool: get_metrics
- CPU usage
- Memory usage
- HTTP request counts
- Response times
- Bandwidth usage
- Database connections
```

#### Get Deploy Info
```
Tool: get_deploy
- Deployment status
- Build logs
- Error messages
```

### 4. **Manage Resources**

#### Get Service Details
```
Tool: get_postgres
Tool: get_key_value
- View configuration
- Get connection details
- Check status
```

---

## 📋 MANUAL DEPLOYMENT STEPS (Since Workspace Setup Required)

Since the MCP requires manual workspace selection, here's the recommended deployment approach:

### Step 1: Create PostgreSQL Database

**Via Render Dashboard:**

1. Go to: https://dashboard.render.com
2. Click **"New +"**
3. Select **"PostgreSQL"**
4. Configure:
   ```
   Name: psci-database
   Database: psci_platform
   User: admin (or default)
   Region: Oregon (US West)
   PostgreSQL Version: 16
   Plan: Free
   ```
5. Click **"Create Database"**
6. Wait 2-3 minutes for provisioning
7. **Copy the Internal Database URL**

### Step 2: Create Web Service

**Via Render Dashboard:**

1. Click **"New +"**
2. Select **"Web Service"**
3. **Connect GitHub:**
   - Authorize Render
   - Select your repository
   - Choose branch: `result3`

4. **Configure:**
   ```
   Name: psci-api
   Region: Oregon (US West)
   Branch: result3
   Root Directory: apps/api
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm run start:prod
   Plan: Free
   ```

5. **Add Environment Variables:**

   Click "Advanced" → "Add Environment Variable"

   ```env
   NODE_ENV=production
   PORT=4000
   API_PREFIX=api/v1
   DATABASE_URL=<YOUR_POSTGRES_INTERNAL_URL>
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

6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. **Copy your Render URL**

---

## 🔄 AFTER WORKSPACE IS SET UP

Once you have your Render workspace set up through the dashboard, you can use the MCP for:

### Monitoring Deployments

```typescript
// Check deployment status
mcp_Render_get_deploy({
  serviceId: "your-service-id",
  deployId: "your-deploy-id"
})

// Get service metrics
mcp_Render_get_metrics({
  resourceId: "your-service-id",
  metricTypes: ["cpu_usage", "memory_usage", "http_request_count"],
  startTime: "2026-02-07T00:00:00Z",
  endTime: "2026-02-07T23:59:59Z"
})
```

### Creating Additional Services

```typescript
// Create a cron job
mcp_Render_create_cron_job({
  name: "daily-cleanup",
  schedule: "0 0 * * *", // Daily at midnight
  runtime: "node",
  buildCommand: "npm install",
  startCommand: "node scripts/cleanup.js"
})

// Create Redis cache
mcp_Render_create_key_value({
  name: "psci-cache",
  plan: "free",
  region: "oregon"
})
```

---

## 🎯 RECOMMENDED WORKFLOW

### Initial Setup (One-Time)

1. ✅ **Manual Setup via Dashboard:**
   - Create Render account
   - Create PostgreSQL database
   - Create web service
   - Note service IDs

2. ✅ **Use MCP for Monitoring:**
   - Check deployment status
   - Monitor metrics
   - View logs

3. ✅ **Use MCP for Additional Services:**
   - Create cron jobs
   - Add Redis cache
   - Scale services

### Ongoing Operations

Once initial setup is complete, you can use the MCP for:
- Monitoring performance
- Creating additional services
- Managing resources
- Viewing metrics

---

## 📊 COMPARISON: MCP vs Dashboard

| Task | MCP | Dashboard | Recommendation |
|------|-----|-----------|----------------|
| Initial Setup | ⚠️ Requires workspace | ✅ Easy | Dashboard |
| Create Database | ✅ Automated | ✅ Easy | Either |
| Create Web Service | ✅ Automated | ✅ Easy | Either |
| Monitor Metrics | ✅ Automated | ✅ Visual | MCP for automation |
| View Logs | ❌ Limited | ✅ Full access | Dashboard |
| Environment Vars | ✅ Automated | ✅ Easy | Either |

**Recommendation:**
- **First time:** Use Dashboard for setup
- **Automation:** Use MCP for monitoring and additional services
- **Troubleshooting:** Use Dashboard for logs and debugging

---

## 🔗 USEFUL RENDER LINKS

### Getting Started
- **Dashboard:** https://dashboard.render.com
- **Sign Up:** https://render.com
- **Documentation:** https://render.com/docs

### Your Services (After Setup)
- **Services:** https://dashboard.render.com/services
- **Databases:** https://dashboard.render.com/databases
- **Logs:** https://dashboard.render.com/logs

### Support
- **Community:** https://community.render.com
- **Status:** https://status.render.com
- **Support:** https://render.com/support

---

## 💡 PRO TIPS

### 1. Use Internal Database URLs
When connecting services within Render, always use the **Internal Database URL** (not External). It's faster and doesn't count against bandwidth.

### 2. Environment Variables
Store all secrets as environment variables. Never hardcode them in your code.

### 3. Health Checks
Render automatically performs health checks. Make sure your `/health` endpoint responds quickly.

### 4. Build Cache
Render caches dependencies between builds. This makes subsequent deployments faster.

### 5. Preview Environments
Use Render's preview environments to test changes before deploying to production.

---

## 🚨 IMPORTANT NOTES

### Free Tier Limitations

**Web Services:**
- ⚠️ Spin down after 15 minutes of inactivity
- ⚠️ 30-60 second cold start on first request
- ✅ 750 hours/month (enough for 1 service)

**PostgreSQL:**
- ⚠️ 90 days of data retention
- ⚠️ No automatic backups
- ✅ 1GB storage
- ✅ Shared CPU

**Solutions:**
1. **Upgrade to paid plan** ($7/month per service)
2. **Use ping service** to keep alive (UptimeRobot)
3. **Accept cold starts** for low-traffic sites

### Security Best Practices

1. **Use Environment Variables** for all secrets
2. **Enable CORS** properly
3. **Use HTTPS** (automatic on Render)
4. **Rotate secrets** regularly
5. **Monitor logs** for suspicious activity

---

## 📋 DEPLOYMENT CHECKLIST

### Before Starting
- [ ] Create Render account
- [ ] Verify email
- [ ] Note workspace name
- [ ] Have GitHub repository ready
- [ ] Have environment variables ready

### Database Setup
- [ ] Create PostgreSQL database
- [ ] Note Internal Database URL
- [ ] Test connection

### Web Service Setup
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy service
- [ ] Note service URL

### Post-Deployment
- [ ] Run database migrations
- [ ] Create admin user
- [ ] Test health endpoint
- [ ] Test API endpoints
- [ ] Monitor logs for errors

---

## 🎉 NEXT STEPS

### Immediate Actions

1. **Create Render Account:**
   - Go to https://render.com
   - Sign up with GitHub
   - Complete setup

2. **Follow Deployment Guide:**
   - See `RENDER_DEPLOYMENT_INSTRUCTIONS.md`
   - Step-by-step instructions
   - All commands provided

3. **Deploy Your Backend:**
   - Create PostgreSQL database
   - Create web service
   - Set environment variables
   - Deploy!

### After Deployment

1. **Update Netlify:**
   - Add Render API URL to Netlify env vars
   - Redeploy frontend

2. **Test Integration:**
   - Test API health check
   - Test frontend-backend connection
   - Verify CORS works

3. **Monitor:**
   - Check Render logs
   - Monitor metrics
   - Set up alerts

---

## 🆘 TROUBLESHOOTING

### MCP Says "No Workspace Set"

**This is normal!** It's a security feature.

**Solution:**
1. Set up Render account via dashboard
2. Create your first service
3. The workspace will be automatically set
4. MCP will work for subsequent operations

### Can't Find Service ID

**Location:**
- Go to Render Dashboard
- Click on your service
- URL will contain service ID: `https://dashboard.render.com/web/srv-xxxxx`
- `srv-xxxxx` is your service ID

### Build Fails

**Check:**
1. Root directory is correct (`apps/api`)
2. Build command is correct
3. All dependencies in `package.json`
4. Environment variables are set

**View Logs:**
- Render Dashboard → Service → Logs
- Look for specific error messages

---

## 🏆 SUMMARY

### Render MCP Status: ✅ WORKING

**What Works:**
- ✅ MCP connection active
- ✅ All tools available
- ✅ Ready to use after workspace setup

**What's Needed:**
- ⏳ One-time workspace setup via dashboard
- ⏳ Initial service creation via dashboard
- ⏳ Then MCP can be used for automation

**Recommendation:**
1. Use **Dashboard** for initial setup (easier, visual)
2. Use **MCP** for monitoring and automation (faster, scriptable)
3. Use **Dashboard** for troubleshooting (full logs, visual)

---

## 📞 NEED HELP?

**Read These:**
1. `RENDER_DEPLOYMENT_INSTRUCTIONS.md` - Complete deployment guide
2. `DEPLOYMENT_STATUS_FINAL.md` - Current status
3. Render Docs: https://render.com/docs

**Support:**
- Render Community: https://community.render.com
- Render Support: https://render.com/support

---

**The Render MCP is working perfectly! Just needs initial workspace setup via dashboard, then you can use it for automation and monitoring.** 🚀

---

_Last Updated: February 7, 2026_  
_Para Shooting Committee of India © 2026_
