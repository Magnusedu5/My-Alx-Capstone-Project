# 🚀 New Frontend Setup Guide

## ✅ Old Frontend Removed Successfully

Your old React frontend has been safely backed up and removed. You're now ready to connect your new frontend!

---

## 📦 Backup Status

✅ **Backed up to:** `frontend_backups/frontend_backup_20251202_124625.tar.gz`  
✅ **Git branch preserved:** `frontend` branch still exists  
✅ **Restoration guide:** See `FRONTEND_BACKUP_INFO.md`  
✅ **Old frontend removed:** `frontend/` folder deleted  

---

## 🎯 Connect Your New Frontend - Quick Steps

### Step 1: Clone Your New Frontend

```bash
# Clone your new frontend repository
git clone <your-new-frontend-repo-url> frontend

# Or if you have it locally
cp -r /path/to/your-new-frontend ./frontend
```

### Step 2: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 3: Configure API Connection

Create or update `.env` file (choose based on your framework):

**For Vite (React/Vue/Svelte):**
```env
VITE_API_URL=http://localhost:8000/api
VITE_API_URL_PROD=https://your-backend.onrender.com/api
```

**For Create React App:**
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_API_URL_PROD=https://your-backend.onrender.com/api
```

**For Vue CLI:**
```env
VUE_APP_API_URL=http://localhost:8000/api
VUE_APP_API_URL_PROD=https://your-backend.onrender.com/api
```

**For Next.js:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_URL_PROD=https://your-backend.onrender.com/api
```

### Step 4: Update API Service File

Find your API configuration file (usually `api.js`, `axios.js`, `http.js`, or similar) and update it:

**Example for Axios (React/Vue):**
```javascript
import axios from 'axios';

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     process.env.REACT_APP_API_URL || 
                     process.env.VUE_APP_API_URL ||
                     'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Example for Fetch API:**
```javascript
const API_BASE_URL = 'http://localhost:8000/api';

async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
  }
  
  return response.json();
}

export { apiCall };
```

### Step 5: Update CORS Settings (if needed)

If your new frontend runs on a different port, update Django settings:

Edit `Alx_Capstone_project/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",      # Create React App
    "http://localhost:5173",      # Vite
    "http://localhost:8080",      # Vue CLI
    "http://localhost:4200",      # Angular
    "https://your-frontend-domain.com",  # Production
]

# For development, you can temporarily allow all origins:
# CORS_ALLOW_ALL_ORIGINS = DEBUG  # Only use in development!
```

### Step 6: Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### Step 7: Run Your New Frontend

```bash
# Start development server
npm run dev
# or
npm start
# or
yarn dev
```

---

## 🔌 Django Backend API Endpoints

Your new frontend can use these endpoints:

### 🔐 Authentication
```
POST   /api/login/
Body: { "email": "user@example.com", "password": "password" }
Response: { "access": "jwt_token", "refresh": "refresh_token", "user": {...} }

POST   /api/token/refresh/
Body: { "refresh": "refresh_token" }
Response: { "access": "new_jwt_token" }

GET    /api/user/
Headers: { "Authorization": "Bearer {token}" }
Response: { "id": 1, "email": "...", "role": "STAFF", ... }
```

### 📊 Dashboard
```
GET    /api/dashboard/
Response: {
  "total_documents": 10,
  "total_results": 5,
  "pending_approvals": 3,
  "user": {...},
  "role": "STAFF"
}
```

### 📄 Documents
```
GET    /api/documents/
Response: [{ "id": 1, "title": "...", "status": "PENDING", ... }]

POST   /api/documents/upload/
Body: FormData with { "title": "...", "description": "...", "file": File, "category": "..." }
Response: { "id": 1, "title": "...", ... }

GET    /api/documents/{id}/
Response: { "id": 1, "title": "...", ... }

DELETE /api/documents/{id}/
Response: { "message": "Document deleted successfully" }
```

### 📝 Results
```
GET    /api/results/
Response: [{ "id": 1, "course_code": "CS101", ... }]

POST   /api/results/upload/
Body: FormData with {
  "course_code": "CS101",
  "course_title": "Intro to CS",
  "session": "2023/2024",
  "semester": "First",
  "file": File
}
Response: { "id": 1, "course_code": "CS101", ... }

GET    /api/results/{id}/
Response: { "id": 1, "course_code": "CS101", ... }

DELETE /api/results/{id}/
Response: { "message": "Result deleted successfully" }
```

### 👨‍💼 HOD (Admin) Endpoints
```
GET    /api/hod/documents/pending/
Response: [{ "id": 1, "title": "...", "status": "PENDING", ... }]

POST   /api/hod/documents/{id}/approve/
Response: { "message": "Document approved successfully" }

POST   /api/hod/documents/{id}/reject/
Response: { "message": "Document rejected successfully" }

GET    /api/hod/results/pending/
Response: [{ "id": 1, "course_code": "...", "status": "PENDING", ... }]

POST   /api/hod/results/{id}/approve/
Response: { "message": "Result approved successfully" }

POST   /api/hod/results/{id}/reject/
Response: { "message": "Result rejected successfully" }
```

---

## 🔑 Demo Accounts for Testing

Use these credentials to test your frontend:

### Staff Account
- **Email:** `staff@demo.local`
- **Password:** `demo123`
- **Role:** STAFF (can upload documents/results, view own items)

### HOD Account
- **Email:** `hod@demo.local`
- **Password:** `demo123`
- **Role:** HOD (can view all, approve/reject)

### Admin Account (Django Admin)
- **Username:** `admin`
- **Password:** `admin123`
- **URL:** `http://localhost:8000/admin/`

---

## 🎨 Example Login Implementation

Here's how to implement login in your new frontend:

### React Example
```javascript
import { useState } from 'react';
import api from './services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login/', { email, password });
      
      // Save token and user data
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### Vue Example
```vue
<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <p v-if="error">{{ error }}</p>
    <button type="submit">Login</button>
  </form>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const { data } = await api.post('/login/', {
          email: this.email,
          password: this.password
        });
        
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = err.response?.data?.error || 'Login failed';
      }
    }
  }
};
</script>
```

---

## ⚠️ Common Issues & Solutions

### Issue: CORS Error
**Error:** `Access-Control-Allow-Origin` error in console

**Solution:**
```python
# In settings.py, add your frontend URL
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Add your frontend port
]
```

### Issue: 401 Unauthorized
**Error:** Getting 401 errors on API calls

**Solution:**
- Check token is saved: `console.log(localStorage.getItem('token'))`
- Verify Authorization header format: `Bearer {token}` (note the space)
- Check token hasn't expired (tokens expire after 60 minutes)

### Issue: File Upload Not Working
**Error:** Document/result upload failing

**Solution:**
```javascript
// Use FormData for file uploads
const formData = new FormData();
formData.append('file', fileObject);
formData.append('title', 'Document Title');
formData.append('description', 'Description');

// Don't set Content-Type header for FormData
await api.post('/documents/upload/', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### Issue: Routes Not Working
**Error:** 404 errors or routing issues

**Solution:**
- Ensure frontend router is configured
- Check API base URL includes `/api/`
- Verify Django is running on port 8000

---

## 🧪 Testing the Integration

### Step 1: Start Backend
```bash
# In project root
python manage.py runserver
```

### Step 2: Start Frontend
```bash
# In frontend folder
cd frontend
npm run dev
```

### Step 3: Test Login
1. Open browser to `http://localhost:5173` (or your frontend port)
2. Login with: `staff@demo.local` / `demo123`
3. Check browser console for API requests
4. Verify you see dashboard/home page after login

### Step 4: Test API Calls
Open browser DevTools → Network tab:
- Should see requests to `localhost:8000/api/`
- Should see Authorization header with Bearer token
- Should get 200 responses (not 401 or 403)

---

## 📂 Expected Project Structure

After adding your new frontend:

```
project-root/
├── Alx_Capstone_project/     # Django project settings
├── DMS_ALX/                  # Django app
├── frontend/                 # 👈 Your new frontend here
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env
│   └── ...
├── frontend_backups/         # Old frontend backup
├── manage.py
├── db.sqlite3
└── requirements.txt
```

---

## ✅ Integration Checklist

Before considering integration complete, verify:

- [ ] Frontend folder exists and has your new code
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] `.env` file created with API URL
- [ ] API service file updated to use Django backend
- [ ] JWT token added to request headers
- [ ] CORS settings updated in Django (if needed)
- [ ] Backend running on port 8000
- [ ] Frontend running on its port
- [ ] Login works and returns JWT token
- [ ] API calls successful (check Network tab)
- [ ] Token stored in localStorage
- [ ] Protected routes work
- [ ] File uploads work
- [ ] No CORS errors in console

---

## 📚 Additional Resources

- **Backend Integration Guide:** `FRONTEND_INTEGRATION_GUIDE.md`
- **Quick Integration:** `FRONTEND_QUICK_INTEGRATION.md`
- **Backup Info:** `FRONTEND_BACKUP_INFO.md`
- **Django Admin Access:** `DJANGO_ADMIN_ACCESS.md`
- **Login Credentials:** `LOGIN_CREDENTIALS.md`

---

## 🆘 Need Help?

### Check Backend is Running
```bash
curl http://localhost:8000/api/
# Should return API info or 404, not connection refused
```

### Check CORS Settings
```bash
# In Alx_Capstone_project/settings.py
grep -A 5 "CORS_ALLOWED_ORIGINS" Alx_Capstone_project/settings.py
```

### View Backend Logs
```bash
# Start backend with verbose output
python manage.py runserver
# Watch for API requests and any errors
```

### Test API Directly
```bash
# Test login endpoint
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "staff@demo.local", "password": "demo123"}'
```

---

## 🎉 You're Ready!

Your project is now ready for a new frontend! Follow the steps above to connect your new frontend to the Django backend.

**What's your new frontend?** Share the:
- Repository URL
- Framework used (React, Vue, Angular, etc.)
- Any special requirements

I'll help you get it connected! 🚀
