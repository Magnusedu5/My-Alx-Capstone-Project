# 🚀 Frontend Integration - Quick Start

## TL;DR - Integrate Any Frontend in 5 Steps

Your Django backend is **already ready** to work with any frontend! Here's how:

---

## ⚡ **Quick Integration (5 Minutes)**

### Step 1: Clone Your Frontend
```bash
git clone https://github.com/username/your-frontend.git frontend_new
cd frontend_new
```

### Step 2: Configure API URL
Create `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
REACT_APP_API_URL=http://localhost:8000/api
VUE_APP_API_URL=http://localhost:8000/api
```

### Step 3: Update API Service
Find the API file (usually `api.js` or `axios.js`) and set:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';

// Add JWT token to requests
const token = localStorage.getItem('token');
headers: { Authorization: `Bearer ${token}` }
```

### Step 4: Install & Run
```bash
npm install
npm run dev
```

### Step 5: Update CORS (if needed)
In Django `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Your frontend port
]
```

---

## 🎯 **Available API Endpoints**

Your frontend can use these endpoints immediately:

### Authentication
- `POST /api/login/` - Login (returns JWT token)
- `POST /api/token/refresh/` - Refresh token
- `GET /api/user/` - Get current user

### Documents
- `GET /api/documents/` - List documents
- `POST /api/documents/upload/` - Upload document
- `GET /api/documents/{id}/` - Get document details

### Results
- `GET /api/results/` - List results
- `POST /api/results/upload/` - Upload result
- `GET /api/results/{id}/` - Get result details

### Admin (HOD)
- `GET /api/hod/documents/pending/` - Pending documents
- `POST /api/hod/documents/{id}/approve/` - Approve
- `POST /api/hod/documents/{id}/reject/` - Reject

### Dashboard
- `GET /api/dashboard/` - Get statistics

---

## 🔑 **Authentication Flow**

Your frontend needs to:

1. **Login:**
   ```javascript
   const response = await axios.post('/api/login/', {
     email: 'user@example.com',
     password: 'password123'
   });
   
   localStorage.setItem('token', response.data.access);
   localStorage.setItem('user', JSON.stringify(response.data.user));
   ```

2. **Add Token to Requests:**
   ```javascript
   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   ```

3. **Handle Token Expiry:**
   ```javascript
   if (error.response.status === 401) {
     // Redirect to login
     localStorage.clear();
     window.location.href = '/login';
   }
   ```

---

## 📦 **Example: Quick Integration**

### React Example
```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Usage in component
import api from './services/api';

const login = async (email, password) => {
  const { data } = await api.post('/login/', { email, password });
  localStorage.setItem('token', data.access);
  return data;
};

const getDocuments = async () => {
  const { data } = await api.get('/documents/');
  return data;
};
```

### Vue Example
```javascript
// src/plugins/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Usage in component
import api from '@/plugins/api';

export default {
  async created() {
    const { data } = await api.get('/documents/');
    this.documents = data;
  }
}
```

---

## 🎨 **Framework-Specific Setup**

### React (Vite)
```bash
npm create vite@latest my-frontend -- --template react
cd my-frontend
npm install axios
```

### Vue 3
```bash
npm create vue@latest my-frontend
cd my-frontend
npm install axios
```

### Angular
```bash
npx @angular/cli new my-frontend
cd my-frontend
# API service built-in with HttpClient
```

### Svelte
```bash
npm create vite@latest my-frontend -- --template svelte
cd my-frontend
npm install axios
```

---

## 🔧 **Common Ports**

| Framework | Default Port |
|-----------|--------------|
| Vite (React/Vue) | 5173 |
| Create React App | 3000 |
| Vue CLI | 8080 |
| Angular | 4200 |
| Next.js | 3000 |
| Django Backend | 8000 |

---

## ⚠️ **Troubleshooting**

### CORS Error?
Add your frontend port to Django `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

### 401 Unauthorized?
- Check token is saved: `console.log(localStorage.getItem('token'))`
- Verify header format: `Bearer {token}` (with space)
- Check token expiration

### API Not Found (404)?
- Verify backend is running: `http://localhost:8000/api/`
- Check API base URL includes `/api/`
- Verify endpoint spelling

---

## 📚 **Full Documentation**

See `FRONTEND_INTEGRATION_GUIDE.md` for:
- Detailed integration approaches
- Multiple frontend examples
- Security best practices
- Advanced configurations

---

## ✅ **Test Your Integration**

1. **Start Backend:**
   ```bash
   python manage.py runserver
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Login:**
   - Email: `staff@demo.local`
   - Password: `demo123`

4. **Check Console:**
   - Should see API requests to `localhost:8000`
   - Should get JWT token back
   - Should see user data

---

## 🎉 **You're Ready!**

Your Django backend works with **any** frontend framework out of the box. Just:
1. Point your frontend to `http://localhost:8000/api`
2. Send JWT token in Authorization header
3. Start building!

**Need help with a specific frontend?** Tell me:
- What framework? (React, Vue, Angular, etc.)
- Repository URL?
- What features do you want to integrate?

Let's get your frontend connected! 🚀
