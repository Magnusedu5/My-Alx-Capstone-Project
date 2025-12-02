# 🚀 Deploy Frontend to Render - Step by Step Guide

## Quick Deployment Guide for Academic Hub UI

Your frontend is ready to deploy! Follow these steps to deploy your React + TypeScript frontend to Render.

---

## ✅ Pre-Deployment Checklist

- [x] Frontend integrated with backend API ✅
- [x] All pages working correctly ✅
- [x] Production build successful ✅
- [x] Environment variables configured ✅
- [x] Backend deployed and running ✅

---

## 🌐 Option 1: Deploy to Render (Recommended)

### Step 1: Prepare Your Repository

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Frontend integration complete - ready for deployment"
   git push origin main
   ```

2. **Verify `.env.production` file:**
   ```bash
   cat academic-hub-ui/.env.production
   ```
   Should contain:
   ```env
   VITE_API_URL=https://dms-alx-capstone.onrender.com/api
   ```

### Step 2: Create Static Site on Render

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com/
   - Click "New +" button
   - Select "Static Site"

2. **Connect Repository:**
   - Connect your GitHub account (if not already connected)
   - Select your repository: `My-Alx-Capstone-Project`
   - Click "Connect"

3. **Configure Build Settings:**
   
   **Name:** `academic-hub-ui` (or your preferred name)
   
   **Root Directory:** `academic-hub-ui`
   
   **Build Command:**
   ```bash
   npm install && npm run build
   ```
   
   **Publish Directory:**
   ```
   dist
   ```

4. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   - Key: `VITE_API_URL`
   - Value: `https://dms-alx-capstone.onrender.com/api`

5. **Deploy:**
   - Click "Create Static Site"
   - Wait for deployment to complete (2-5 minutes)
   - You'll get a URL like: `https://academic-hub-ui.onrender.com`

### Step 3: Update Backend CORS

1. **Update `.env` in backend:**
   ```bash
   # Add your frontend URL to CORS
   nano .env
   ```
   
   Update the CORS line:
   ```env
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080,https://academic-hub-ui.onrender.com
   ```

2. **Redeploy backend (if needed):**
   - Go to Render dashboard → Your backend service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Or it may auto-deploy on git push

3. **Test the deployment:**
   - Visit your frontend URL
   - Try logging in with demo credentials
   - Test document/result upload

---

## 🌐 Option 2: Deploy to Netlify

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

### Step 3: Build and Deploy

```bash
cd academic-hub-ui
npm run build
netlify deploy --prod --dir=dist
```

### Step 4: Set Environment Variables

1. Go to Netlify site dashboard
2. Navigate to: Site settings → Environment variables
3. Add variable:
   - Key: `VITE_API_URL`
   - Value: `https://dms-alx-capstone.onrender.com/api`

4. Redeploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Step 5: Update CORS

Add Netlify URL to backend `.env`:
```env
CORS_ALLOWED_ORIGINS=...,https://your-site.netlify.app
```

---

## 🌐 Option 3: Deploy to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
cd academic-hub-ui
vercel
```

Follow the prompts:
- Set up and deploy: Y
- Which scope: Your account
- Link to existing project: N
- Project name: academic-hub-ui
- Directory: ./
- Override settings: N

### Step 3: Add Environment Variable

```bash
vercel env add VITE_API_URL
```
Enter value: `https://dms-alx-capstone.onrender.com/api`
Select environments: Production

### Step 4: Redeploy with Environment Variable

```bash
vercel --prod
```

### Step 5: Update CORS

Add Vercel URL to backend `.env`:
```env
CORS_ALLOWED_ORIGINS=...,https://your-site.vercel.app
```

---

## 📋 Post-Deployment Steps

### 1. Test Your Deployment

Visit your deployed frontend URL and test:

- [ ] Homepage loads correctly
- [ ] Login page displays
- [ ] Can login with demo credentials:
  - HOD: `hod@demo.local` / `demo123`
  - Staff: `staff@demo.local` / `demo123`
- [ ] Dashboard loads with real data
- [ ] Documents page shows documents
- [ ] Results page shows results
- [ ] Can upload document
- [ ] Can upload result
- [ ] HOD can approve/reject (if logged in as HOD)
- [ ] Logout works correctly

### 2. Update Documentation

Update `FRONTEND_INTEGRATION_COMPLETE.md` with your deployment URL:
```markdown
| Frontend (React) | ✅ Deployed | https://your-frontend-url.com |
```

### 3. Share Access

Your application is now live! Share these URLs:
- **Frontend:** `https://your-frontend-url.com`
- **Backend API:** `https://dms-alx-capstone.onrender.com/api/`
- **Admin Panel:** `https://dms-alx-capstone.onrender.com/admin/`

---

## 🔧 Render Deployment Configuration Files

### Option: Create `render.yaml` for Frontend

Create `academic-hub-ui/render.yaml`:

```yaml
services:
  - type: web
    name: academic-hub-ui
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_URL
        value: https://dms-alx-capstone.onrender.com/api
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

Then in Render dashboard:
- Choose "Blueprint" instead of manual setup
- Point to your repository
- It will auto-detect the `render.yaml`

---

## 🐛 Troubleshooting Deployment Issues

### Issue: Blank page after deployment

**Solution:**
1. Check browser console for errors
2. Verify environment variable is set correctly
3. Check if API URL is accessible from browser
4. Ensure `dist/` folder was built correctly

### Issue: API calls failing (CORS errors)

**Solution:**
1. Verify CORS_ALLOWED_ORIGINS includes your frontend URL
2. Redeploy backend after updating CORS
3. Check browser Network tab for actual error
4. Ensure URL doesn't have trailing slash issues

### Issue: 404 on page refresh

**Solution:**
Add rewrite rules for SPA:

**For Render:** Already handled in configuration above

**For Netlify:** Create `academic-hub-ui/public/_redirects`:
```
/*    /index.html   200
```

**For Vercel:** Create `academic-hub-ui/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Issue: Environment variables not working

**Solution:**
1. Ensure variable name starts with `VITE_` for Vite projects
2. Rebuild after adding environment variables
3. Check deployment logs for errors
4. Verify with `console.log(import.meta.env.VITE_API_URL)`

---

## 📊 Monitoring Your Deployment

### Render Dashboard:
- View deployment logs
- Check build status
- Monitor usage and performance
- View custom domain settings

### Browser DevTools:
- Network tab: Monitor API calls
- Console: Check for JavaScript errors
- Application tab: Verify localStorage tokens

---

## 🎯 Custom Domain (Optional)

### Add Custom Domain to Render:

1. Go to your static site in Render dashboard
2. Click "Settings" → "Custom Domain"
3. Add your domain: `app.yourdomain.com`
4. Update DNS records as instructed by Render:
   - Type: CNAME
   - Name: app
   - Value: [provided by Render]

5. Wait for SSL certificate (automatic, ~5 minutes)

6. Update CORS in backend:
   ```env
   CORS_ALLOWED_ORIGINS=...,https://app.yourdomain.com
   ```

---

## ✅ Deployment Checklist

Before going live, ensure:

- [ ] Frontend builds successfully
- [ ] Environment variables configured
- [ ] Backend CORS includes frontend URL
- [ ] All demo accounts work
- [ ] File uploads work
- [ ] Approve/reject functionality works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] SSL certificate active (https)
- [ ] Custom domain configured (optional)

---

## 🎉 You're Live!

Congratulations! Your Document Management System is now deployed and accessible worldwide!

**Share your application:**
- Frontend: `https://your-frontend-url.com`
- Backend: `https://dms-alx-capstone.onrender.com`

**Demo Credentials:**
- HOD: `hod@demo.local` / `demo123`
- Staff: `staff@demo.local` / `demo123`

---

## 📞 Support

If you encounter any issues:

1. Check deployment logs in Render dashboard
2. Review browser console for errors
3. Verify all environment variables are set
4. Ensure CORS configuration is correct
5. Check Network tab for failed API calls

**Common URLs:**
- Render Dashboard: https://dashboard.render.com/
- Netlify Dashboard: https://app.netlify.com/
- Vercel Dashboard: https://vercel.com/dashboard

Good luck with your deployment! 🚀
