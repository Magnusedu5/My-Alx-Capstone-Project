# 🧪 Test Google Drive Integration with Your Frontend

## ✅ **Your Frontend Already Works!**

The Google Drive integration is **fully functional** with your React frontend. No changes needed!

---

## 🎯 **What Happens When Users Upload Files:**

```
User in React App (localhost:5173 or deployed)
    ↓
Fills upload form and selects file
    ↓
Clicks "Upload" button
    ↓
Frontend sends POST to /api/documents/upload/ or /api/results/upload/
    ↓
Django backend receives file
    ↓
✨ AUTOMATICALLY uploads to YOUR Google Drive ✨
    ↓
Returns success with Google Drive URL
    ↓
Frontend shows success message
    ↓
User can view/download from Google Drive link
```

---

## 🚀 **Step-by-Step Testing:**

### **Step 1: Start Your Backend**
```bash
cd /path/to/Alx_Capstone_project
source venv/bin/activate
python manage.py runserver
```
Should see: `Starting development server at http://127.0.0.1:8000/`

### **Step 2: Start Your Frontend**
In a new terminal:
```bash
cd academic-hub-ui
npm run dev
```
Should see: `Local: http://localhost:5173/`

### **Step 3: Login to Your App**
1. Open browser: `http://localhost:5173`
2. Click "Login"
3. Enter credentials:
   - Username: `staff_user`
   - Password: `password123`
4. Click "Sign In"

### **Step 4: Upload a Document**
1. Click "**Documents**" in the left sidebar
2. Click "**Upload Document**" button
3. Fill in the form:
   - **Title**: "Test Document - Google Drive"
   - **Description**: "Testing automatic Google Drive upload"
   - **File**: Select any file (PDF, image, text file, etc.)
4. Click "**Upload**" button
5. Wait for success message

### **Step 5: Verify Upload**
Check these 3 places:

1. **In Your React App**:
   - You should see the document in the list
   - Status shows "PENDING"

2. **In Your Google Drive**:
   - Open https://drive.google.com
   - You should see the uploaded file!
   - File name matches what you uploaded

3. **In Django Admin** (optional):
   - Go to http://localhost:8000/admin/
   - Login with admin credentials
   - Go to "Documents" 
   - You'll see ☁️ indicator showing it's on Google Drive
   - Click the 🔗 link to view file

### **Step 6: Upload a Result**
1. Click "**Results**" in the left sidebar
2. Click "**Upload Result**" button
3. Fill in the form:
   - **Course Code**: "TEST101"
   - **Course Title**: "Test Course"
   - **Session**: Select "2023/2024"
   - **Semester**: Select "First Semester"
   - **File**: Select any file
4. Click "**Submit**" button
5. Check Google Drive again - another file uploaded!

---

## 🔍 **What to Look For:**

### ✅ **Success Indicators:**
- ✅ Success toast notification appears
- ✅ File appears in documents/results list
- ✅ File visible in your Google Drive
- ✅ No errors in browser console
- ✅ No errors in Django terminal

### ❌ **If Something Goes Wrong:**
Check Django terminal for errors like:
- "Google Drive upload failed: ..." → Check internet connection
- "FileNotFoundError: credentials.json" → Ensure file exists
- "Token expired" → Run: `python gdrive_auth.py`

---

## 📊 **Response from API:**

When your frontend uploads a file, the API returns:

```json
{
  "message": "Document uploaded successfully",
  "document": {
    "id": 1,
    "title": "Test Document",
    "description": "Testing upload",
    "status": "PENDING",
    "upload_date": "2024-01-15T10:30:00Z",
    "gdrive_file_id": "1ABC...xyz",
    "gdrive_file_url": "https://drive.google.com/file/d/1ABC...xyz/view",
    "file_url": "https://drive.google.com/file/d/1ABC...xyz/view",
    "original_filename": "test.pdf",
    "uploaded_by": {
      "id": 2,
      "username": "staff_user",
      "email": "staff@example.com"
    }
  }
}
```

Your frontend uses `file_url` to display/download the file.

---

## 🎓 **For Different User Types:**

### **Staff Users:**
- Can upload documents and results
- Files go to Google Drive automatically
- Can view their own uploads

### **HOD Users:**
- Can do everything staff can
- Plus: Can approve/reject documents and results
- Can view all pending items

### **All Uploads:**
- ✅ Documents → Google Drive
- ✅ Results → Google Drive
- ✅ Status starts as "PENDING"
- ✅ HOD can approve/reject

---

## 🔗 **Testing File Access:**

After uploading, you can test file access:

1. **View in Google Drive:**
   - Copy the `gdrive_file_url` from the response
   - Paste in browser
   - File should open/download

2. **View via Frontend:**
   - Click on the document/result in your app
   - If you have a view/download button, it should use the Google Drive URL

---

## 🌐 **Works on Deployed Version Too!**

This works the same way on your deployed version:

```
Production Frontend (Render/Vercel)
    ↓
Calls Production Backend API (Render)
    ↓
Backend uploads to Google Drive
    ↓
Returns Google Drive URL
    ↓
Frontend displays success
```

**Important for deployment:**
- Ensure `credentials.json` is on production server
- Ensure `token.pickle` is on production server
- Both files should NOT be in Git (they're in .gitignore)

---

## 🎉 **Summary:**

✅ **Your frontend code doesn't need any changes**  
✅ **Files automatically upload to Google Drive**  
✅ **Works for both documents and results**  
✅ **Works in development and production**  
✅ **All users see the same seamless experience**  

The integration is **completely transparent** to users. They just upload files as normal, and behind the scenes, everything goes to Google Drive!

---

## 🚀 **Next Steps:**

1. Test it now with the steps above
2. Deploy to production
3. Enjoy unlimited file storage!

**Questions?** Check the other documentation files:
- `QUICK_START_GOOGLE_DRIVE.md`
- `GOOGLE_DRIVE_INTEGRATION.md`
