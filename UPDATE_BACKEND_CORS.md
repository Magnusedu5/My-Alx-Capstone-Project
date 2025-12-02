# 🔧 Update Backend CORS for Production Frontend

## ⚠️ Action Required: Add Frontend URL to Backend CORS

Your frontend is deployed at:
**https://my-alx-capstone-project-frontend.onrender.com**

But the backend needs to allow requests from this URL.

---

## ✅ Update Backend CORS Settings

### Method 1: Update via Render Dashboard (Recommended)

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com/

2. **Select Your Backend Service:**
   - Click on: **"my-alx-capstone-project"** (your Django backend)

3. **Go to Environment Tab:**
   - Click **"Environment"** in the left sidebar

4. **Find or Add CORS_ALLOWED_ORIGINS:**
   - Look for existing `CORS_ALLOWED_ORIGINS` variable
   - If it doesn't exist, click **"Add Environment Variable"**

5. **Set the Value:**
   ```
   http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080,https://my-alx-capstone-project-frontend.onrender.com
   ```
   
   **Important:** Include all URLs separated by commas, no spaces!

6. **Save Changes:**
   - Click **"Save Changes"**
   - Backend will automatically redeploy (takes 2-3 minutes)

7. **Wait for Deployment:**
   - Watch the deploy logs
   - Wait for "Deploy succeeded ✅" message

---

### Method 2: Update .env File (Alternative)

If you prefer to manage via git:

1. **Check your backend's environment variables on Render**

2. **Add the variable:**
   ```
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080,https://my-alx-capstone-project-frontend.onrender.com
   ```

3. **Save and trigger redeploy**

---

## 🧪 Test After Update

Once backend redeploys:

### 1. Test Frontend Login

1. Visit: **https://my-alx-capstone-project-frontend.onrender.com**

2. Try logging in:
   - **Email:** `hod@demo.local`
   - **Password:** `demo123`

3. **Check for CORS errors:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Should see NO CORS errors
   - Login should succeed and redirect to dashboard

### 2. Test API Calls

- Dashboard should load statistics
- Documents page should show list
- Results page should show list
- No network errors in browser console

### 3. Test Uploads

- Try uploading a document
- Try uploading a result
- Should work without CORS errors

---

## 🔍 How to Verify CORS is Working

### In Browser DevTools:

1. **Open your frontend:** https://my-alx-capstone-project-frontend.onrender.com

2. **Open DevTools:** Press F12 or Right-click → Inspect

3. **Go to Network tab**

4. **Try to login**

5. **Click on the "login/" request**

6. **Check Response Headers:**
   Should include:
   ```
   Access-Control-Allow-Origin: https://my-alx-capstone-project-frontend.onrender.com
   Access-Control-Allow-Credentials: true
   ```

### If CORS is NOT Working:

You'll see error in console:
```
Access to XMLHttpRequest at 'https://my-alx-capstone-project.onrender.com/api/login/' 
from origin 'https://my-alx-capstone-project-frontend.onrender.com' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

---

## ✅ Expected Configuration

### Backend Environment Variables:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080,https://my-alx-capstone-project-frontend.onrender.com
DJANGO_SETTINGS_MODULE=Alx_Capstone_project.settings
DEBUG=False
SECRET_KEY=your-secret-key
```

### Frontend Environment Variables:

```env
VITE_API_URL=https://my-alx-capstone-project.onrender.com/api
```

---

## 🎯 Quick Checklist

- [ ] Backend CORS_ALLOWED_ORIGINS includes frontend URL
- [ ] Backend redeployed after CORS update
- [ ] Frontend accessible at deployed URL
- [ ] Login page loads without errors
- [ ] Can login with demo credentials
- [ ] No CORS errors in browser console
- [ ] Dashboard loads with data
- [ ] Documents/Results pages work
- [ ] File uploads work

---

## 📞 URLs to Test

### Frontend:
- **Main URL:** https://my-alx-capstone-project-frontend.onrender.com
- **Should redirect to login:** /
- **After login (HOD):** /dashboard
- **After login (Staff):** /staff-dashboard

### Backend:
- **API Base:** https://my-alx-capstone-project.onrender.com/api/
- **Login:** https://my-alx-capstone-project.onrender.com/api/login/
- **Admin:** https://my-alx-capstone-project.onrender.com/admin/

---

## 🐛 Troubleshooting

### Issue: CORS Error Still Appears

**Solutions:**
1. Verify CORS_ALLOWED_ORIGINS is saved correctly (check Render dashboard)
2. Ensure backend redeployed after CORS change
3. Clear browser cache: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Try incognito/private browsing mode
5. Check Render logs for any errors

### Issue: Login Works but Other Pages Don't Load

**Solutions:**
1. Check if user is being redirected correctly after login
2. Verify token is saved in localStorage
3. Check Network tab for failed API calls
4. Verify all API endpoints are accessible

### Issue: Backend Shows in Logs: "Invalid HTTP_HOST header"

**Solutions:**
Add to backend settings:
```python
ALLOWED_HOSTS = [
    'my-alx-capstone-project.onrender.com',
    'localhost',
    '127.0.0.1',
]
```

---

## 🎉 After Successful CORS Update

Your application will be fully functional:

✅ Frontend: https://my-alx-capstone-project-frontend.onrender.com  
✅ Backend: https://my-alx-capstone-project.onrender.com  
✅ CORS: Properly configured  
✅ Authentication: Working  
✅ All features: Operational  

---

## 📋 Demo Accounts (Share with Users)

### HOD Account:
- **URL:** https://my-alx-capstone-project-frontend.onrender.com
- **Email:** `hod@demo.local`
- **Password:** `demo123`
- **Access:** Full access, can approve/reject all documents and results

### Staff Account:
- **URL:** https://my-alx-capstone-project-frontend.onrender.com
- **Email:** `staff@demo.local`
- **Password:** `demo123`
- **Access:** Can upload and view own documents and results

### Django Admin:
- **URL:** https://my-alx-capstone-project.onrender.com/admin/
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Full admin panel access

---

## 🚀 Next Action

**Go to Render Dashboard NOW and add the CORS environment variable!**

1. Dashboard → Your Backend Service → Environment
2. Add: `CORS_ALLOWED_ORIGINS` with the frontend URL
3. Save and wait for redeploy
4. Test login on your frontend

---

**Let me know once you've updated CORS and I'll help you test everything!** 🎯
