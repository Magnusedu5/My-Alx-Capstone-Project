# 🎓 Frontend Tutorial - What We Built

## 📚 **What is This Frontend?**

This is a **React** application that provides a user interface for your Document Management System. It's like a "face" for your Django backend - users interact with this instead of using curl commands or Postman.

---

## 🏗️ **Project Structure Explained**

```
frontend/
├── src/
│   ├── components/          # Reusable UI pieces
│   │   ├── Navbar.jsx      # Top navigation bar
│   │   ├── Layout.jsx      # Wrapper for all pages
│   │   ├── Button.jsx      # Reusable button component
│   │   └── Card.jsx        # Reusable card component
│   │
│   ├── context/            # Global state management
│   │   └── AuthContext.jsx # User authentication state
│   │
│   ├── pages/              # All the pages/screens
│   │   ├── Login.jsx       # Login page
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── DocumentsList.jsx      # View documents
│   │   ├── UploadDocument.jsx     # Upload document form
│   │   ├── ResultsList.jsx        # View results
│   │   ├── UploadResult.jsx       # Upload result form
│   │   ├── ApproveDocuments.jsx   # HOD approval (documents)
│   │   └── ApproveResults.jsx     # HOD approval (results)
│   │
│   ├── services/           # API communication
│   │   ├── api.js         # Axios configuration
│   │   ├── auth.js        # Login/logout functions
│   │   ├── documents.js   # Document API calls
│   │   ├── results.js     # Results API calls
│   │   └── dashboard.js   # Dashboard API calls
│   │
│   ├── utils/             # Helper functions
│   │   └── ProtectedRoute.jsx  # Route protection
│   │
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
│
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

---

## 🎯 **Key Concepts Explained**

### 1. **Components**
Think of components like LEGO blocks - reusable pieces you can use anywhere.

**Example:**
```jsx
<Button variant="primary">Click Me</Button>
```

Instead of writing button HTML+CSS everywhere, we created one `Button` component.

### 2. **State**
State is like React's memory - it remembers things and updates the page when they change.

**Example:**
```jsx
const [email, setEmail] = useState('');  // State variable
```

When `email` changes, React automatically updates the page.

### 3. **Props**
Props are like function arguments - you pass data to components.

**Example:**
```jsx
<Card title="Welcome">Content here</Card>
```

The `title` is a prop passed to the Card component.

### 4. **Hooks**
Hooks are special React functions that let you use features.

- `useState` - Remember values
- `useEffect` - Run code when component loads
- `useAuth` - Our custom hook to get user info

### 5. **Routing**
Routing shows different pages based on the URL.

```
/login → Login page
/dashboard → Dashboard page
/documents → Documents list page
```

### 6. **API Calls**
We use Axios to talk to your Django backend.

**Example:**
```javascript
const data = await getDocuments();  // Fetches from Django
```

---

## 🔄 **How Data Flows**

### Example: Logging In

1. **User enters email/password** → Updates `email` and `password` state
2. **User clicks "Sign In"** → Calls `handleSubmit` function
3. **Function calls API** → `login(email, password)` in `auth.js`
4. **API calls Django** → `POST /api/login/` with credentials
5. **Django responds** → Returns JWT token and user data
6. **Frontend saves token** → Stores in localStorage
7. **Updates context** → `setAuthUser(data.user)`
8. **Redirects to dashboard** → `navigate('/dashboard')`

### Example: Viewing Documents

1. **Page loads** → `useEffect` runs
2. **Fetches data** → `getDocuments()` calls Django API
3. **Django responds** → Returns array of documents
4. **Updates state** → `setDocuments(data)`
5. **React re-renders** → Shows documents on screen

---

## 🎨 **Styling with Tailwind CSS**

Instead of writing CSS files, we use utility classes:

```jsx
<div className="bg-blue-600 text-white px-4 py-2 rounded">
  Hello World
</div>
```

**What this means:**
- `bg-blue-600` = Blue background
- `text-white` = White text
- `px-4` = Padding horizontal (left/right)
- `py-2` = Padding vertical (top/bottom)
- `rounded` = Rounded corners

---

## 🔐 **Authentication Flow**

### Login Process:
1. User enters credentials
2. Frontend sends to Django: `POST /api/login/`
3. Django validates and returns JWT token
4. Frontend stores token in localStorage
5. Frontend adds token to all future API requests
6. User is redirected to dashboard

### Protected Routes:
```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

If user is not logged in, they're redirected to `/login`.

### HOD-Only Routes:
```jsx
<ProtectedRoute requireHOD={true}>
  <ApproveDocuments />
</ProtectedRoute>
```

If user is not HOD, they're redirected to dashboard.

---

## 📡 **API Integration**

### How API Calls Work:

**1. Configuration (api.js):**
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});
```

**2. Interceptor adds token automatically:**
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**3. Service functions make calls:**
```javascript
export const getDocuments = async () => {
  const response = await api.get('/documents/');
  return response.data;
};
```

**4. Pages use the service:**
```javascript
const data = await getDocuments();
setDocuments(data);
```

---

## 🚀 **Running the Frontend**

### Development Mode:
```bash
cd frontend
npm run dev
```

This starts the development server at `http://localhost:5173`

### Build for Production:
```bash
npm run build
```

This creates optimized files in the `dist/` folder.

---

## 🎓 **Learning Path**

### Beginner:
1. Understand **components** - Reusable UI pieces
2. Learn **props** - Passing data to components
3. Master **state** - Managing changing data
4. Practice **hooks** - useState, useEffect

### Intermediate:
5. Understand **routing** - Multiple pages
6. Learn **API calls** - Fetching data
7. Master **forms** - Handling user input
8. Practice **conditional rendering** - Show/hide based on conditions

### Advanced:
9. Learn **context** - Global state
10. Master **protected routes** - Authentication
11. Understand **interceptors** - Automatic token handling
12. Practice **error handling** - User-friendly errors

---

## 🐛 **Common Issues & Solutions**

### Issue 1: "CORS Error"
**Problem:** Browser blocks API calls
**Solution:** Django backend needs CORS configured (already done in settings.py)

### Issue 2: "401 Unauthorized"
**Problem:** Token expired or invalid
**Solution:** Login again to get new token

### Issue 3: "404 Not Found"
**Problem:** API endpoint doesn't exist
**Solution:** Check Django backend is running and endpoint exists

### Issue 4: "Network Error"
**Problem:** Django backend is not running
**Solution:** Start Django: `python manage.py runserver`

---

## 📚 **Key Files to Understand**

### For Beginners, Start With:

1. **src/pages/Login.jsx** - Simplest page with form
2. **src/components/Button.jsx** - Simple reusable component
3. **src/services/auth.js** - Simple API calls
4. **src/App.jsx** - How routing works

### Once Comfortable:

5. **src/context/AuthContext.jsx** - Global state
6. **src/utils/ProtectedRoute.jsx** - Route protection
7. **src/services/api.js** - Axios configuration

---

## 🎯 **What Each File Does**

| File | Purpose | Complexity |
|------|---------|------------|
| `Button.jsx` | Reusable button | ⭐ Easy |
| `Card.jsx` | Reusable card container | ⭐ Easy |
| `Login.jsx` | Login page with form | ⭐⭐ Medium |
| `Dashboard.jsx` | Shows statistics | ⭐⭐ Medium |
| `DocumentsList.jsx` | Lists all documents | ⭐⭐ Medium |
| `UploadDocument.jsx` | Upload form | ⭐⭐ Medium |
| `Navbar.jsx` | Navigation bar | ⭐⭐ Medium |
| `Layout.jsx` | Page wrapper | ⭐ Easy |
| `AuthContext.jsx` | Global user state | ⭐⭐⭐ Advanced |
| `ProtectedRoute.jsx` | Route protection | ⭐⭐⭐ Advanced |
| `api.js` | Axios setup | ⭐⭐⭐ Advanced |

---

## 💡 **Tips for Understanding React**

1. **Think in Components** - Break UI into small pieces
2. **State = Memory** - State remembers values between renders
3. **Props = Arguments** - Pass data down to children
4. **Effects = Side Effects** - Run code when component loads/updates
5. **Hooks = Special Functions** - Give components special powers

---

## 🎉 **Congratulations!**

You now have a fully functional React frontend that:
- ✅ Authenticates users with JWT
- ✅ Shows role-based pages (Staff vs HOD)
- ✅ Uploads documents and results
- ✅ Lists and filters data
- ✅ Approves/rejects items (HOD)
- ✅ Handles errors gracefully
- ✅ Looks beautiful with Tailwind CSS

**Next Steps:**
1. Run the frontend: `npm run dev`
2. Start Django backend: `python manage.py runserver`
3. Login with demo credentials
4. Explore all the features!

---

**Questions?** Read through the comments in each file - they explain everything! 🎓
