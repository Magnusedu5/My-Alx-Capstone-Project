# 🔧 Fix Render Deployment Error

## ❌ Error You're Getting

```
Service Root Directory "/opt/render/project/src/frontend" is missing.
```

**Cause:** Render is looking for `frontend` folder, but we renamed it to `academic-hub-ui`.

---

## ✅ Solution: Update Render Configuration

### Option 1: Update Root Directory in Render Dashboard (Recommended)

1. **Go to your Render Dashboard:**
   - Visit: https://dashboard.render.com/

2. **Select your Static Site:**
   - Click on your frontend service (the one failing)

3. **Update Settings:**
   - Click "Settings" in the left sidebar
   - Scroll to "Build & Deploy" section
   - Find **"Root Directory"**
   - Change from: `frontend`
   - Change to: `academic-hub-ui`

4. **Update Build Command:**
   - Build Command: `npm install && npm run build`
   - OR: `yarn install && yarn build`

5. **Update Publish Directory:**
   - Publish Directory: `dist`

6. **Save Changes:**
   - Click "Save Changes"
   - Trigger a manual deploy: "Manual Deploy" → "Deploy latest commit"

---

### Option 2: Create New Static Site (Fresh Start)

If you prefer to start fresh:

1. **Delete Old Static Site** (optional):
   - Go to old service → Settings → "Delete Service"

2. **Create New Static Site:**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select repository: `DMS_Backend` or your repo name

3. **Configure Settings:**
   
   **Name:** `academic-hub-frontend` (or your preferred name)
   
   **Root Directory:** `academic-hub-ui`
   
   **Build Command:**
   ```bash
   npm install && npm run build
   ```
   
   **Publish Directory:**
   ```
   dist
   ```
   
   **Environment Variables:**
   - Click "Advanced" → "Add Environment Variable"
   - Key: `VITE_API_URL`
   - Value: `https://dms-alx-capstone.onrender.com/api`
   
4. **Create Static Site:**
   - Click "Create Static Site"
   - Wait for deployment (2-5 minutes)

---

### Option 3: Rename Folder Back (Not Recommended)

If you absolutely need to keep the `frontend` name:

```bash
# Rename the folder
mv academic-hub-ui frontend

# Update git
git add .
git commit -m "Rename to frontend for Render compatibility"
git push origin main
```

**But I don't recommend this** - better to update Render settings.

---

## 📋 Correct Render Configuration

For `academic-hub-ui` frontend:

| Setting | Value |
|---------|-------|
| **Root Directory** | `academic-hub-ui` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Node Version** | 22.x (auto-detected) |

### Environment Variables to Add:
- `VITE_API_URL` = `https://dms-alx-capstone.onrender.com/api`

---

## 🔍 Verify Your Setup

After updating the configuration:

1. **Check Build Logs:**
   - Look for: "Cloning from..." should show correct repo
   - Look for: "Service Root Directory" should be `academic-hub-ui`
   - Look for: "Running build command" should execute successfully

2. **Successful Build Should Show:**
   ```
   ==> Using Node.js version 22.x
   ==> Running build command 'npm install && npm run build'...
   ✓ 1780 modules transformed
   ✓ built in 6.34s
   ==> Build succeeded 🎉
   ```

3. **Test Deployment:**
   - Visit your Render URL
   - Should see the login page
   - Try logging in with demo credentials

---

## 🐛 Other Common Issues

### Issue: "package.json not found"

**Solution:**
- Verify Root Directory is set to `academic-hub-ui`
- Check repository has the folder at root level
- Verify package.json exists: `academic-hub-ui/package.json`

### Issue: Build succeeds but page is blank

**Solution:**
1. Check environment variable is set: `VITE_API_URL`
2. Check browser console for errors
3. Verify API URL is correct and accessible

### Issue: CORS errors after deployment

**Solution:**
Add your Render frontend URL to backend CORS:

1. Get your frontend URL from Render (e.g., `https://academic-hub-frontend.onrender.com`)

2. Update backend `.env` or environment variables:
   ```
   CORS_ALLOWED_ORIGINS=http://localhost:8080,https://academic-hub-frontend.onrender.com
   ```

3. Redeploy backend if needed

---

## 📝 Quick Checklist

Before deploying:
- [ ] Root Directory = `academic-hub-ui`
- [ ] Build Command = `npm install && npm run build`
- [ ] Publish Directory = `dist`
- [ ] Environment variable `VITE_API_URL` is set
- [ ] Latest code is pushed to GitHub
- [ ] package.json exists in academic-hub-ui folder

---

## 🎯 Step-by-Step Fix (Most Common)

1. **Go to Render Dashboard** → Your failing static site
2. **Click "Settings"**
3. **Find "Root Directory"**
4. **Change to:** `academic-hub-ui`
5. **Click "Save Changes"**
6. **Go to "Manual Deploy"**
7. **Click "Deploy latest commit"**
8. **Wait for build to complete**
9. **✅ Done!**

---

## 🆘 Still Having Issues?

### Check these:

1. **Repository Structure:**
   ```bash
   git ls-files | grep academic-hub-ui | head -5
   ```
   Should show files like:
   - `academic-hub-ui/package.json`
   - `academic-hub-ui/vite.config.ts`
   - `academic-hub-ui/index.html`

2. **Verify package.json:**
   ```bash
   cat academic-hub-ui/package.json
   ```
   Should have scripts: `dev`, `build`, `preview`

3. **Test Build Locally:**
   ```bash
   cd academic-hub-ui
   npm install
   npm run build
   ls -la dist/
   ```
   Should create `dist/` folder with `index.html`

---

## 🎉 After Successful Deployment

Once deployed successfully:

1. **Get Your Frontend URL:**
   - Example: `https://academic-hub-frontend.onrender.com`

2. **Update Backend CORS:**
   - Add frontend URL to CORS_ALLOWED_ORIGINS
   - Redeploy backend if needed

3. **Test Everything:**
   - Visit frontend URL
   - Login with: `hod@demo.local` / `demo123`
   - Upload document/result
   - Check approve/reject works

4. **Update Documentation:**
   - Add your frontend URL to `INTEGRATION_SUCCESS.md`
   - Share access with others!

---

## 📞 Need More Help?

If you're still stuck, share:
- Your Render build logs
- Your repository structure: `ls -la`
- Your Render service settings screenshot

Good luck! 🚀
