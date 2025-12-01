# 🚀 Frontend Deployment Guide - Complete Setup

## ✅ **Current Status**

### **Backend (Django)**
- ✅ **Deployed at:** https://my-alx-capstone-project.onrender.com
- ✅ **API Working:** Tested and confirmed
- ✅ **Endpoints:** All functional

### **Frontend (React)**
- ✅ **Built successfully:** dist/ folder ready
- ✅ **API URL configured:** Automatically uses production backend
- ✅ **Environment variables:** Set up for production

---

## 🎯 **Backend Configuration Verified**

### **What's Already Set:**
```python
# Django Backend - Alx_Capstone_project/settings.py

ALLOWED_HOSTS = config('ALLOWED_HOSTS', ...)
# Should include your frontend domain

CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', ...)
# Needs your frontend URL

CSRF_TRUSTED_ORIGINS = config('CSRF_TRUSTED_ORIGINS', ...)
# Already has: https://my-alx-capstone-project.onrender.com
```

---

## 📋 **Pre-Deployment Checklist**

### **1. Backend Environment Variables (Render)**

Go to your backend service on Render and ensure these are set:

```bash
# Required - Already Set
SECRET_KEY=<your-secret-key>
DEBUG=False
ALLOWED_HOSTS=my-alx-capstone-project.onrender.com,<your-frontend-domain>
DATABASE_URL=<postgres-url>

# Add Frontend Domain
CORS_ALLOWED_ORIGINS=https://<your-frontend-domain>.onrender.com,https://<your-frontend-domain>.netlify.app,https://<your-frontend-domain>.vercel.app
CSRF_TRUSTED_ORIGINS=https://my-alx-capstone-project.onrender.com,https://<your-frontend-domain>

# Optional
SECURE_SSL_REDIRECT=True
LOG_LEVEL=INFO
```

### **2. Frontend Configuration**

✅ Already configured:
- `frontend/.env.production` - Production API URL
- `frontend/.env.development` - Development API URL
- `frontend/src/services/api.js` - Auto-detects environment

---

## 🚀 **Deployment Options**

### **Option 1: Render.com (Recommended)**

#### **Step 1: Create New Web Service**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `dms-frontend` (or your choice)
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

#### **Step 2: Environment Variables**
Add in Render dashboard:
```
VITE_API_URL=https://my-alx-capstone-project.onrender.com/api
```

#### **Step 3: Deploy**
- Click **"Create Static Site"**
- Wait 3-5 minutes for build
- Get your URL: `https://dms-frontend.onrender.com`

#### **Step 4: Update Backend CORS**
Add your frontend URL to backend environment variables:
```
CORS_ALLOWED_ORIGINS=https://dms-frontend.onrender.com
CSRF_TRUSTED_ORIGINS=https://my-alx-capstone-project.onrender.com,https://dms-frontend.onrender.com
ALLOWED_HOSTS=my-alx-capstone-project.onrender.com,dms-frontend.onrender.com
```

---

### **Option 2: Netlify**

#### **Step 1: Install Netlify CLI**
```bash
npm install -g netlify-cli
```

#### **Step 2: Build and Deploy**
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

#### **Step 3: Environment Variables**
In Netlify dashboard:
```
VITE_API_URL=https://my-alx-capstone-project.onrender.com/api
```

#### **Step 4: Update Backend CORS**
Add Netlify URL to backend environment variables.

---

### **Option 3: Vercel**

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Deploy**
```bash
cd frontend
vercel --prod
```

#### **Step 3: Environment Variables**
In Vercel dashboard, add:
```
VITE_API_URL=https://my-alx-capstone-project.onrender.com/api
```

#### **Step 4: Update Backend CORS**
Add Vercel URL to backend environment variables.

---

## 🔧 **Testing Your Deployment**

### **Step 1: Test Backend API**
```bash
# Test login endpoint
curl -X POST https://my-alx-capstone-project.onrender.com/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"staff@example.com","password":"pass1234"}'

# Should return: {"token":"...", "user":{...}}
```

### **Step 2: Test Frontend**
1. Visit your frontend URL
2. Should see login page with dark theme
3. Login with: `staff@example.com` / `pass1234`
4. Should redirect to dashboard
5. Check browser console (F12) - no CORS errors

### **Step 3: Test Features**
- ✅ Login works
- ✅ Dashboard loads with stats
- ✅ Upload document works
- ✅ View documents works
- ✅ Toast notifications appear

---

## 🐛 **Troubleshooting**

### **Issue 1: CORS Error**

**Symptom:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
1. Go to Render backend dashboard
2. Add frontend URL to `CORS_ALLOWED_ORIGINS`:
```
CORS_ALLOWED_ORIGINS=https://your-frontend-url.com
```
3. Restart backend service

---

### **Issue 2: 404 on API Calls**

**Symptom:**
```
POST https://backend.com/api/login/ 404 Not Found
```

**Solution:**
Check `frontend/.env.production`:
```
VITE_API_URL=https://my-alx-capstone-project.onrender.com/api
```
Note the `/api` at the end!

---

### **Issue 3: Build Fails**

**Symptom:**
```
Error: Cannot find module 'framer-motion'
```

**Solution:**
```bash
cd frontend
npm install
npm run build
```

---

### **Issue 4: Login Works Locally But Not in Production**

**Symptom:**
- Works on localhost
- Fails on deployed version

**Solutions:**
1. Check browser console for errors
2. Verify API URL in Network tab (F12)
3. Check backend CORS settings
4. Clear browser cache (Ctrl+Shift+R)

---

## 🔐 **Security Checklist**

Before going live:

- [ ] Backend `DEBUG=False`
- [ ] Backend `SECRET_KEY` is strong (50+ characters)
- [ ] Backend `ALLOWED_HOSTS` includes frontend domain
- [ ] Backend `CORS_ALLOWED_ORIGINS` includes frontend domain only
- [ ] Backend `CSRF_TRUSTED_ORIGINS` includes both domains
- [ ] Frontend uses HTTPS (not HTTP)
- [ ] Environment variables not committed to git
- [ ] `.env` files in `.gitignore`
- [ ] Database is PostgreSQL (not SQLite)
- [ ] SSL/HTTPS enabled on both backend and frontend

---

## 📊 **Performance Optimization**

### **Frontend Optimizations Applied:**
- ✅ Vite code splitting
- ✅ Tree shaking (unused code removed)
- ✅ Minified JavaScript
- ✅ Compressed CSS
- ✅ Lazy loading routes
- ✅ Image optimization

### **Bundle Sizes:**
```
index.html:   0.46 kB
CSS:         63.83 kB (gzipped: 8.92 kB)
JavaScript: 443.56 kB (gzipped: 139.70 kB)
```

**Total gzipped:** ~149 KB (excellent!)

---

## 🌐 **Custom Domain Setup (Optional)**

### **1. Buy Domain**
- Namecheap, GoDaddy, Google Domains

### **2. Configure DNS**
Point to your Render/Netlify/Vercel URL:
```
Type: CNAME
Name: www
Value: your-frontend.onrender.com
```

### **3. Update Backend CORS**
Add your custom domain to CORS settings.

---

## 📈 **Post-Deployment Monitoring**

### **Things to Monitor:**
1. **API Response Times**
   - Backend dashboard on Render
   - Should be < 500ms

2. **Error Logs**
   - Check Render logs
   - Look for 500 errors

3. **CORS Issues**
   - Browser console
   - Network tab in DevTools

4. **User Reports**
   - Login failures
   - Upload errors

---

## 🎯 **Quick Deploy Commands**

### **Build Locally:**
```bash
cd frontend
npm run build
```

### **Test Build Locally:**
```bash
cd frontend
npm run preview
```

### **Deploy to Render:**
- Push to GitHub
- Render auto-deploys from main branch

### **Deploy to Netlify:**
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

### **Deploy to Vercel:**
```bash
cd frontend
vercel --prod
```

---

## 📝 **Environment Variables Summary**

### **Backend (Django) - Render Dashboard:**
```bash
SECRET_KEY=<strong-secret-key>
DEBUG=False
ALLOWED_HOSTS=my-alx-capstone-project.onrender.com,<frontend-domain>
DATABASE_URL=<postgres-connection-string>
CORS_ALLOWED_ORIGINS=https://<frontend-domain>
CSRF_TRUSTED_ORIGINS=https://my-alx-capstone-project.onrender.com,https://<frontend-domain>
SECURE_SSL_REDIRECT=True
LOG_LEVEL=INFO
```

### **Frontend - Render/Netlify/Vercel:**
```bash
VITE_API_URL=https://my-alx-capstone-project.onrender.com/api
```

---

## ✅ **Verification Steps**

After deployment:

### **1. Test Login**
```javascript
// Open browser console on your frontend
fetch('https://my-alx-capstone-project.onrender.com/api/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'staff@example.com',
    password: 'pass1234'
  })
})
.then(r => r.json())
.then(console.log)
```

### **2. Check Network Tab**
- Open DevTools (F12)
- Go to Network tab
- Login
- Look for `/api/login/` request
- Should be 200 OK

### **3. Verify CORS**
- No CORS errors in console
- Requests show proper headers

---

## 🎉 **Success Indicators**

Your deployment is successful when:

✅ Frontend loads without errors
✅ Login works and shows toast notification
✅ Dashboard displays with animated cards
✅ Can upload documents
✅ Can view documents list
✅ No CORS errors in console
✅ Network requests all succeed
✅ Animations are smooth (60fps)
✅ Works on mobile devices
✅ HTTPS padlock shows in browser

---

## 📞 **Support Resources**

- **Render Docs:** https://render.com/docs
- **Vite Docs:** https://vitejs.dev/
- **React Docs:** https://react.dev/
- **Django CORS:** https://pypi.org/project/django-cors-headers/

---

## 🚀 **Your Deployment URLs**

### **Backend:**
- URL: https://my-alx-capstone-project.onrender.com
- API: https://my-alx-capstone-project.onrender.com/api
- Status: ✅ Live and Working

### **Frontend:**
- URL: (Will be assigned after deployment)
- Build: ✅ Ready in `frontend/dist/`
- Config: ✅ Production environment configured

---

## 🎓 **What You Accomplished**

✅ Built a production-ready React frontend
✅ Configured environment-specific API URLs
✅ Set up proper CORS handling
✅ Created optimized production build
✅ Ready for deployment on any platform
✅ Professional UI with animations
✅ Mobile responsive design
✅ Security best practices implemented

**Your application is 100% ready for deployment!** 🚀

Choose your preferred platform (Render, Netlify, or Vercel) and follow the steps above.
