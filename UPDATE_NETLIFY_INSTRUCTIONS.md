# 🔗 Update Netlify with Backend URL

## 🎯 Quick Instructions (2 Minutes)

Your backend is live at: **https://final-production-q1yw.onrender.com**

Now you need to tell your frontend where to find it!

---

## 📋 Step-by-Step Instructions

### Step 1: Open Netlify Environment Variables

**Click this link:**
```
https://app.netlify.com/sites/para-shooting-india-webf/settings/deploys#environment
```

Or manually:
1. Go to: https://app.netlify.com
2. Click on your site: "para-shooting-india-webf"
3. Click "Site settings" (top menu)
4. Click "Environment variables" (left sidebar)

---

### Step 2: Find NEXT_PUBLIC_API_URL

1. **Scroll through the list** of environment variables
2. **Look for:** `NEXT_PUBLIC_API_URL`
3. **Click the "..." menu** next to it
4. **Click "Edit"**

---

### Step 3: Update the Value

**Current value (probably):**
```
https://placeholder-api.example.com/api/v1
```
or
```
http://localhost:4000/api/v1
```

**Change it to:**
```
https://final-production-q1yw.onrender.com/api/v1
```

**Important:** Make sure to include `/api/v1` at the end!

---

### Step 4: Save Changes

1. **Click "Save"** button
2. **Wait for confirmation** message
3. **You're done with this part!**

---

### Step 5: Trigger Redeploy

Now you need to rebuild your frontend with the new API URL:

1. **Click "Deploys"** (top menu)
   
   Or go to: https://app.netlify.com/sites/para-shooting-india-webf/deploys

2. **Click "Trigger deploy"** button (top right)

3. **Select "Deploy site"**

4. **Wait ~3-5 minutes** for the build to complete

---

## ✅ Verification

### After Redeploy Completes:

1. **Go to your login page:**
   ```
   https://para-shooting-india-webf.netlify.app/login
   ```

2. **Check for errors:**
   - ✅ No "Unexpected token" error = SUCCESS!
   - ❌ Still seeing JSON error = Wait a bit longer or check steps

3. **Try to login** (after migrations are run):
   - Email: `admin@psci.in`
   - Password: `Admin@123`

---

## 🔍 What This Does

### Before Update:
```
Frontend → ❌ https://placeholder-api.example.com/api/v1
           (doesn't exist)
```

### After Update:
```
Frontend → ✅ https://final-production-q1yw.onrender.com/api/v1
           (your live backend!)
```

---

## 🆘 Troubleshooting

### Can't Find NEXT_PUBLIC_API_URL

**Problem:** Variable doesn't exist.

**Solution:** Create it!
1. Click "Add a variable" button
2. Key: `NEXT_PUBLIC_API_URL`
3. Value: `https://final-production-q1yw.onrender.com/api/v1`
4. Scopes: Check "All" (or at least "Production")
5. Click "Create variable"

### Redeploy Failed

**Problem:** Build error.

**Solution:**
1. Check build logs: https://app.netlify.com/sites/para-shooting-india-webf/deploys
2. Look for errors
3. Most likely cause: typo in API URL
4. Fix and redeploy

### Still Seeing JSON Error

**Problem:** Frontend not using new URL yet.

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Try incognito/private window
4. Wait a few more minutes for CDN to update

---

## 📊 Expected Timeline

| Step | Time | Status |
|------|------|--------|
| Update env var | 1 min | ⏳ Do now |
| Trigger redeploy | 30 sec | ⏳ Do now |
| Build completes | 3-5 min | ⏳ Wait |
| CDN updates | 1-2 min | ⏳ Wait |
| **Total** | **~5-8 min** | ⏳ |

---

## 🎯 Next Steps After This

Once Netlify is updated and redeployed:

### 1. Run Database Migrations
See: `RUN_MIGRATIONS_GUIDE.md`

### 2. Create Admin User
After migrations, create your admin account.

### 3. Test Login
Try logging in at: https://para-shooting-india-webf.netlify.app/login

---

## 📋 Quick Checklist

- [ ] Open Netlify environment variables page
- [ ] Find `NEXT_PUBLIC_API_URL`
- [ ] Update value to: `https://final-production-q1yw.onrender.com/api/v1`
- [ ] Save changes
- [ ] Trigger redeploy
- [ ] Wait ~5 minutes
- [ ] Verify login page (no JSON error)
- [ ] Proceed to migrations

---

## 💡 Pro Tip

**Bookmark these URLs:**
- Netlify Settings: https://app.netlify.com/sites/para-shooting-india-webf/settings
- Netlify Deploys: https://app.netlify.com/sites/para-shooting-india-webf/deploys
- Render Dashboard: https://dashboard.render.com/web/final-production-q1yw
- Your Live Site: https://para-shooting-india-webf.netlify.app

---

**Update Netlify now and you're one step closer to completion!** 🚀

---

_Last Updated: February 6, 2026_  
_Para Shooting Committee of India © 2026_
