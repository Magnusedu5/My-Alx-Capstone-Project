# 🎨 Frontend Integration Guide

## How to Integrate a Frontend from Another Repository

Yes, you can easily integrate a different frontend with your Django backend! Your Django REST API is already set up to work with any frontend framework.

---

## 🎯 **Your Current Setup**

### Backend (Django)
- ✅ REST API endpoints at `/api/`
- ✅ CORS configured for frontend communication
- ✅ JWT authentication ready
- ✅ Running on `http://localhost:8000` (dev) or `https://your-site.onrender.com` (prod)

### Current Frontend (React + Vite)
- ✅ React 19 with Vite
- ✅ Tailwind CSS
- ✅ React Router for navigation
- ✅ Axios for API calls
- ✅ JWT authentication flow

---

## 📋 **Integration Approaches**

### **Approach 1: Replace Current Frontend** ⭐ (Simplest)

Completely replace your current React frontend with another one.

#### Steps:

##### 1. **Backup Current Frontend**
```bash
# Rename current frontend folder
mv frontend frontend_backup

# Or create a git branch
git checkout -b backup-frontend
git add .
git commit -m "Backup current frontend"
git checkout main
```

##### 2. **Clone New Frontend**
```bash
# Clone the other frontend repository
git clone https://github.com/username/other-frontend.git frontend

# Or if you have it locally
cp -r /path/to/other-frontend ./frontend
```

##### 3. **Configure API Connection**
Update the API base URL to point to your Django backend.

**For React/Vue/Angular frontends:**
Create or edit `.env` file in the frontend folder:
```env
# Development
VITE_API_URL=http://localhost:8000/api
REACT_APP_API_URL=http://localhost:8000/api
VUE_APP_API_URL=http://localhost:8000/api

# Production
VITE_API_URL=https://your-backend.onrender.com/api
REACT_APP_API_URL=https://your-backend.onrender.com/api
VUE_APP_API_URL=https://your-backend.onrender.com/api
```

##### 4. **Update API Service File**
Find the API configuration file (usually `api.js`, `axios.js`, or `http.js`) and update it:

**Example for Axios:**
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 
                     process.env.REACT_APP_API_URL || 
                     'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

##### 5. **Install Dependencies**
```bash
cd frontend

# For npm
npm install

# For yarn
yarn install

# For pnpm
pnpm install
```

##### 6. **Update CORS Settings (if needed)**
Edit `Alx_Capstone_project/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",      # React default
    "http://localhost:5173",      # Vite default
    "http://localhost:8080",      # Vue default
    "http://localhost:4200",      # Angular default
    "https://your-frontend.com",   # Production frontend
]
```

##### 7. **Test the Integration**
```bash
# Terminal 1: Start Django backend
python manage.py runserver

# Terminal 2: Start frontend
cd frontend
npm run dev
# or
yarn dev
# or
npm start
```

---

### **Approach 2: Keep Both Frontends** 🔄

Run both frontends side-by-side for comparison or gradual migration.

#### Steps:

##### 1. **Clone New Frontend to Different Folder**
```bash
git clone https://github.com/username/other-frontend.git frontend_new
```

##### 2. **Configure Both Frontends**
```bash
# Current frontend
cd frontend
npm install
# Runs on port 5173 (Vite default)

# New frontend
cd ../frontend_new
npm install
# Change port in vite.config.js or package.json
```

**For Vite, edit `vite.config.js`:**
```javascript
export default defineConfig({
  server: {
    port: 5174  // Different port
  }
})
```

**For Create React App, edit `package.json`:**
```json
{
  "scripts": {
    "start": "PORT=3001 react-scripts start"
  }
}
```

##### 3. **Both Use Same Backend**
Both frontends will connect to `http://localhost:8000/api`

##### 4. **Update CORS for Both Ports**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Current frontend
    "http://localhost:5174",  # New frontend
]
```

---

### **Approach 3: Merge Frontends** 📦

Integrate specific pages/components from another frontend into your current one.

#### Steps:

##### 1. **Clone the Other Frontend**
```bash
git clone https://github.com/username/other-frontend.git /tmp/other-frontend
```

##### 2. **Copy Specific Components**
```bash
# Copy components you want
cp -r /tmp/other-frontend/src/components/NewFeature ./frontend/src/components/

# Copy pages
cp -r /tmp/other-frontend/src/pages/NewPage.jsx ./frontend/src/pages/
```

##### 3. **Add Routes**
Edit `frontend/src/App.jsx`:
```javascript
import NewPage from './pages/NewPage';

function App() {
  return (
    <Routes>
      {/* Existing routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* New routes from other frontend */}
      <Route path="/new-feature" element={<NewPage />} />
    </Routes>
  );
}
```

##### 4. **Install Additional Dependencies**
Check the other frontend's `package.json` and install missing packages:
```bash
cd frontend
npm install additional-package-1 additional-package-2
```

##### 5. **Update Styling (if needed)**
If the other frontend uses different CSS framework:
- Tailwind → Keep Tailwind, adjust classes
- Bootstrap → Install Bootstrap: `npm install bootstrap`
- Material-UI → Install MUI: `npm install @mui/material @emotion/react @emotion/styled`

---

### **Approach 4: Different Frontend Framework** 🌐

Use a completely different framework (Vue, Angular, Svelte, etc.)

#### Vue.js Example:

##### 1. **Clone Vue Frontend**
```bash
git clone https://github.com/username/vue-frontend.git frontend_vue
cd frontend_vue
```

##### 2. **Configure API**
Create or edit `src/services/api.js`:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8000/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

##### 3. **Install & Run**
```bash
npm install
npm run serve
```

#### Angular Example:

##### 1. **Configure API Service**
Edit `src/app/services/api.service.ts`:
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl || 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  get(endpoint: string) {
    return this.http.get(`${this.apiUrl}/${endpoint}`, { headers: this.getHeaders() });
  }
}
```

---

## 🔌 **API Endpoints Your Frontend Can Use**

Your Django backend already provides these endpoints:

### Authentication
```
POST   /api/login/          - Login and get JWT tokens
POST   /api/token/refresh/  - Refresh access token
GET    /api/user/           - Get current user info
```

### Documents
```
GET    /api/documents/           - List all documents
POST   /api/documents/upload/    - Upload new document
GET    /api/documents/<id>/      - Get specific document
PUT    /api/documents/<id>/      - Update document
DELETE /api/documents/<id>/      - Delete document
```

### Results
```
GET    /api/results/          - List all results
POST   /api/results/upload/   - Upload new result
GET    /api/results/<id>/     - Get specific result
PUT    /api/results/<id>/     - Update result
DELETE /api/results/<id>/     - Delete result
```

### HOD (Admin) Endpoints
```
GET    /api/hod/documents/pending/  - Get pending documents
POST   /api/hod/documents/<id>/approve/   - Approve document
POST   /api/hod/documents/<id>/reject/    - Reject document

GET    /api/hod/results/pending/    - Get pending results
POST   /api/hod/results/<id>/approve/     - Approve result
POST   /api/hod/results/<id>/reject/      - Reject result
```

### Dashboard
```
GET    /api/dashboard/  - Get dashboard statistics
```

---

## 📋 **Frontend Requirements Checklist**

For any frontend to work with your Django backend, it needs:

### ✅ Required Features:
- [ ] HTTP client (Axios, Fetch, etc.)
- [ ] JWT token storage (localStorage or sessionStorage)
- [ ] Authorization header in requests: `Bearer {token}`
- [ ] Login page that calls `/api/login/`
- [ ] Token refresh mechanism
- [ ] Routing system

### ✅ Recommended Features:
- [ ] Protected routes (check authentication)
- [ ] API error handling (401, 403, 500)
- [ ] Loading states
- [ ] Toast notifications for user feedback
- [ ] Form validation

---

## 🛠️ **Common Integration Issues & Solutions**

### Issue 1: CORS Errors
**Symptom:** `Access-Control-Allow-Origin` error in browser console

**Solution:**
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://your-frontend-domain.com",
]

# For development, temporarily allow all:
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Only in development!
```

### Issue 2: Authentication Not Working
**Symptom:** Getting 401 Unauthorized errors

**Solution:**
- Check token is saved: `localStorage.getItem('token')`
- Verify Authorization header format: `Bearer {token}` (note the space)
- Check token expiration
- Verify token refresh logic

### Issue 3: API Routes Not Found
**Symptom:** 404 errors for API calls

**Solution:**
- Verify API base URL includes `/api/`
- Check Django URL configuration in `urls.py`
- Ensure Django server is running
- Check endpoint spelling in frontend code

### Issue 4: File Upload Issues
**Symptom:** Cannot upload documents/results

**Solution:**
```javascript
// Use FormData for file uploads
const formData = new FormData();
formData.append('file', fileObject);
formData.append('title', 'Document Title');

// Send with multipart/form-data
api.post('/documents/upload/', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

---

## 🚀 **Quick Start Template**

### Minimal Frontend Integration

Create a simple `index.html` to test your backend:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Django Backend</title>
</head>
<body>
    <h1>Django Backend Test</h1>
    
    <div id="login">
        <h2>Login</h2>
        <input type="email" id="email" placeholder="Email">
        <input type="password" id="password" placeholder="Password">
        <button onclick="login()">Login</button>
    </div>
    
    <div id="result"></div>

    <script>
        const API_URL = 'http://localhost:8000/api';
        
        async function login() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(`${API_URL}/login/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('token', data.access);
                    document.getElementById('result').innerHTML = 
                        `<p>Login successful! Token: ${data.access.substring(0, 20)}...</p>`;
                } else {
                    document.getElementById('result').innerHTML = 
                        `<p>Error: ${data.error || 'Login failed'}</p>`;
                }
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    `<p>Error: ${error.message}</p>`;
            }
        }
    </script>
</body>
</html>
```

---

## 📚 **Examples for Popular Frontends**

### React (Create React App)
```bash
npx create-react-app frontend-new
cd frontend-new
npm install axios react-router-dom
```

### React (Vite)
```bash
npm create vite@latest frontend-new -- --template react
cd frontend-new
npm install axios react-router-dom
npm run dev
```

### Vue 3
```bash
npm create vue@latest frontend-new
cd frontend-new
npm install axios
npm run dev
```

### Angular
```bash
npx @angular/cli new frontend-new
cd frontend-new
ng serve
```

### Svelte
```bash
npm create vite@latest frontend-new -- --template svelte
cd frontend-new
npm install axios
npm run dev
```

### Next.js
```bash
npx create-next-app@latest frontend-new
cd frontend-new
npm install axios
npm run dev
```

---

## ✅ **Ready to Integrate!**

Tell me:

1. **What frontend do you want to integrate?**
   - GitHub repository URL?
   - Framework? (React, Vue, Angular, Svelte, etc.)
   - What does it look like? Any screenshots or description?

2. **What's your goal?**
   - Replace current frontend completely?
   - Keep both frontends?
   - Integrate specific features?
   - Just testing another UI?

3. **Any special requirements?**
   - Specific authentication flow?
   - Additional API endpoints needed?
   - Custom styling or themes?

Share the details and I'll give you step-by-step instructions specific to your frontend! 🚀
