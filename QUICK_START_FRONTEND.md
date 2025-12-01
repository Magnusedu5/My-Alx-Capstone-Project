# 🚀 Quick Start - Running Your Full Application

## ✅ What's Ready

You now have a **complete full-stack application**:
- ✅ **Backend:** Django REST API (running on port 8000)
- ✅ **Frontend:** React app (running on port 5173)
- ✅ **Authentication:** JWT-based login
- ✅ **8 Pages:** Login, Dashboard, Documents, Results, Approvals
- ✅ **Styling:** Beautiful UI with Tailwind CSS

---

## 🎯 Step-by-Step: Start Everything

### **Step 1: Start Django Backend**

Open a **new terminal** in your project root:

```bash
# Activate virtual environment
source venv/bin/activate

# Start Django server
python manage.py runserver
```

**You should see:**
```
Starting development server at http://127.0.0.1:8000/
```

✅ **Backend is running!**

---

### **Step 2: Frontend is Already Running!**

The frontend is already started! Check if you can see:
```
VITE v7.2.6  ready in 344 ms
➜  Local:   http://localhost:5173/
```

If not running, open another terminal:
```bash
cd frontend
npm run dev
```

✅ **Frontend is running!**

---

### **Step 3: Open Your Browser**

1. Go to: **http://localhost:5173**
2. You should see the **Login Page**

---

### **Step 4: Login with Demo Credentials**

Use these credentials to test:

**Staff Account:**
- Email: `staff@example.com`
- Password: `pass1234`

**HOD Account:**
- Email: `hod@example.com`
- Password: `pass1234`

---

## 🎨 What You Can Do

### **As Staff:**
1. ✅ View Dashboard (see statistics)
2. ✅ Upload Documents
3. ✅ View Documents List
4. ✅ Delete Own Documents
5. ✅ Upload Results
6. ✅ View Results List
7. ✅ Delete Own Results

### **As HOD:**
All staff features, PLUS:
1. ✅ Approve/Reject Documents
2. ✅ Approve/Reject Results
3. ✅ Delete Any Document
4. ✅ Delete Any Result

---

## 🔍 Testing the Features

### **Test 1: Login**
1. Go to http://localhost:5173
2. Login as staff: `staff@example.com` / `pass1234`
3. Should redirect to Dashboard

### **Test 2: Upload Document**
1. Click "Upload Document" in navbar
2. Fill in:
   - Title: "Test Document"
   - Description: "This is a test"
   - Select a file
3. Click "Upload Document"
4. Should show success and redirect to documents list

### **Test 3: View Documents**
1. Click "Documents" in navbar
2. Should see the document you just uploaded
3. Status should be "PENDING"

### **Test 4: HOD Approval (Login as HOD)**
1. Logout (top right)
2. Login as HOD: `hod@example.com` / `pass1234`
3. Click "Approve Documents" in navbar
4. Should see pending documents
5. Click "✓ Approve" button
6. Document should disappear from pending list

### **Test 5: View Approved Document**
1. Click "Documents" in navbar
2. Should see the approved document
3. Status should be "APPROVED" (green badge)

---

## 🎓 Understanding the Flow

### **Login Flow:**
```
User enters credentials
    ↓
Frontend sends to Django: POST /api/login/
    ↓
Django validates and returns JWT token
    ↓
Frontend stores token in localStorage
    ↓
Frontend redirects to Dashboard
    ↓
All future API calls include token automatically
```

### **Upload Document Flow:**
```
User fills form and selects file
    ↓
Frontend creates FormData with file
    ↓
Sends to Django: POST /api/documents/upload/
    ↓
Django saves file and creates database record
    ↓
Returns document data
    ↓
Frontend shows success and redirects
```

### **Approval Flow (HOD):**
```
HOD sees pending documents
    ↓
Clicks "Approve" button
    ↓
Frontend sends: PATCH /api/documents/{id}/approve/
    ↓
Django updates status to "APPROVED"
    ↓
Frontend removes from pending list
    ↓
Document now shows as approved
```

---

## 📁 Project Structure

```
Your-Project/
├── backend (Django)
│   ├── manage.py
│   ├── DMS_ALX/
│   │   ├── models.py (Database models)
│   │   ├── api_views.py (API endpoints)
│   │   ├── serializers.py (Data formatting)
│   │   └── urls.py (URL routing)
│   └── db.sqlite3 (Database)
│
└── frontend/ (React)
    ├── src/
    │   ├── pages/ (8 pages)
    │   ├── components/ (4 reusable components)
    │   ├── services/ (5 API service files)
    │   ├── context/ (Global state)
    │   └── App.jsx (Main app with routing)
    └── package.json (Dependencies)
```

---

## 🔧 Troubleshooting

### **Problem: "Cannot connect to backend"**

**Check:**
```bash
# Is Django running?
curl http://localhost:8000/api/

# Should return API data, not error
```

**Fix:** Start Django backend:
```bash
python manage.py runserver
```

---

### **Problem: "CORS error in console"**

**Check:** Browser console (F12) shows CORS error

**Fix:** Django CORS is already configured, but verify:
```python
# In Alx_Capstone_project/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

---

### **Problem: "401 Unauthorized"**

**Reason:** Token expired or invalid

**Fix:** 
1. Logout and login again
2. Or clear localStorage and login:
```javascript
// In browser console (F12)
localStorage.clear()
location.reload()
```

---

### **Problem: "White screen / blank page"**

**Check:**
1. Open browser console (F12)
2. Look for JavaScript errors

**Common fixes:**
```bash
# Rebuild frontend
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

## 📚 Important Files

### **Backend (Django)**
- `DMS_ALX/api_views.py` - All API endpoints
- `DMS_ALX/models.py` - Database models
- `DMS_ALX/serializers.py` - Data formatting
- `Alx_Capstone_project/settings.py` - Configuration

### **Frontend (React)**
- `src/App.jsx` - Main app with routing
- `src/pages/Login.jsx` - Login page
- `src/pages/Dashboard.jsx` - Dashboard
- `src/services/api.js` - API configuration
- `src/context/AuthContext.jsx` - User state

---

## 🎯 Pages Available

| URL | Page | Access |
|-----|------|--------|
| `/login` | Login | Public |
| `/dashboard` | Dashboard | Staff + HOD |
| `/documents` | Documents List | Staff + HOD |
| `/documents/upload` | Upload Document | Staff + HOD |
| `/results` | Results List | Staff + HOD |
| `/results/upload` | Upload Result | Staff + HOD |
| `/approve-documents` | Approve Documents | HOD Only |
| `/approve-results` | Approve Results | HOD Only |

---

## 🎨 UI Features

### **Navigation Bar**
- Shows on every page after login
- Links to all pages (role-based)
- Shows username and role
- Logout button

### **Dashboard**
- Statistics cards
- Quick action buttons
- Different data for Staff vs HOD

### **Documents/Results Lists**
- Shows all items
- Status badges (Pending/Approved/Rejected)
- Download buttons
- Delete buttons (permission-based)

### **Upload Forms**
- File selection
- Form validation
- File size check (max 10MB)
- Success/error messages

### **Approval Pages (HOD)**
- Only shows pending items
- Approve/Reject buttons
- Removes from list after action

---

## 💡 Tips

### **For Testing:**
1. Open two browser windows
2. Login as Staff in one, HOD in other
3. Upload as Staff, approve as HOD

### **For Learning:**
1. Read the comments in each file
2. Start with simple files (Button.jsx, Card.jsx)
3. Move to pages (Login.jsx, Dashboard.jsx)
4. Understand services (api.js, auth.js)

### **For Customization:**
1. **Colors:** Modify Tailwind classes
   - `bg-blue-600` → `bg-purple-600`
2. **Layout:** Edit Layout.jsx
3. **New Pages:** Copy existing page, modify
4. **New Features:** Add new service functions

---

## 📖 Documentation

We created 3 comprehensive guides:

1. **FRONTEND_COMPLETE_GUIDE.md** (9,000+ words)
   - Complete tutorial for beginners
   - Every concept explained
   - Step-by-step examples

2. **frontend/README_TUTORIAL.md**
   - Project structure explained
   - File-by-file breakdown
   - Common issues and solutions

3. **QUICK_START_FRONTEND.md** (This file)
   - Quick reference
   - How to run everything
   - Testing guide

---

## 🎉 Success Checklist

Before you're done, verify:

- [ ] Django backend running at http://localhost:8000
- [ ] React frontend running at http://localhost:5173
- [ ] Can login with staff credentials
- [ ] Can login with HOD credentials
- [ ] Dashboard shows statistics
- [ ] Can upload a document
- [ ] Can view documents list
- [ ] Can upload a result
- [ ] Can view results list
- [ ] HOD can approve/reject documents
- [ ] HOD can approve/reject results
- [ ] Logout works correctly

---

## 🚀 You're All Set!

**Your full-stack application is complete and running!**

**What you have:**
- ✅ Modern React frontend
- ✅ Django REST API backend
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ File upload functionality
- ✅ Beautiful UI with Tailwind CSS
- ✅ Comprehensive documentation

**Next steps:**
1. Test all features
2. Read the detailed guides
3. Customize to your needs
4. Deploy to production (when ready)

---

**Need Help?**
- Read: `FRONTEND_COMPLETE_GUIDE.md` for detailed explanations
- Check: `frontend/README_TUTORIAL.md` for technical details
- Look: Comments in each file for inline help

**Congratulations! You've built a full-stack application!** 🎉
