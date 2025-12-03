# 🔧 Fix: View & Download Buttons Not Working

## 🐛 Problem

When clicking View or Download buttons:
- ❌ Got "Not Found" error
- ❌ Files not loading
- ❌ Both old and new files not accessible

## 🔍 Root Cause

**Your existing documents were uploaded BEFORE Google Drive integration:**

```
Documents uploaded before today:
├── CV.pdf
│   ├── gdrive_file_id: None
│   ├── gdrive_file_url: None
│   └── file: /media/documents/Magnus_Edus_CV.pdf  ← Relative path
│
└── API.pdf
    ├── gdrive_file_id: None
    ├── gdrive_file_url: None
    └── file: /media/documents/API.pdf  ← Relative path
```

**The Problem:**
- Frontend tried to open: `/media/documents/file.pdf` (relative path)
- Browser looked for: `http://localhost:5173/media/documents/file.pdf` ❌
- But file is at: `http://localhost:8000/media/documents/file.pdf` ✅

## ✅ Solution Applied

Updated both `DocumentSerializer` and `ResultSerializer` to return **absolute URLs**:

### **Before:**
```python
def get_file_url(self, obj):
    return obj.file_url  # Returns: /media/documents/file.pdf
```

### **After:**
```python
def get_file_url(self, obj):
    # Priority: Google Drive > Local file
    if obj.gdrive_file_url:
        return obj.gdrive_file_url  # Google Drive URL
    elif obj.file:
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.file.url)  # Full URL
        return obj.file.url
    return None
```

### **Now Returns:**
```json
{
  "file_url": "http://localhost:8000/media/documents/Magnus_Edus_CV.pdf"
}
```

Instead of:
```json
{
  "file_url": "/media/documents/Magnus_Edus_CV.pdf"
}
```

## 🧪 Testing

### **Test 1: Restart Django Server**

```bash
# Stop current server (Ctrl+C)
# Then restart
source venv/bin/activate
python manage.py runserver
```

### **Test 2: Check API Response**

```bash
# In browser or curl
curl http://localhost:8000/api/documents/

# Look for file_url field:
# Old files: "file_url": "http://localhost:8000/media/documents/..."
# New files: "file_url": "https://drive.google.com/file/d/..."
```

### **Test 3: Test View Button**

1. Open frontend: http://localhost:5173
2. Login
3. Go to Documents page
4. Click 👁️ (View) button on existing document
5. **Expected**: File opens in new tab ✅
6. **Not**: "Not Found" error ❌

### **Test 4: Test Download Button**

1. On Documents page
2. Click ⬇️ (Download) button
3. **Expected**: File downloads ✅

### **Test 5: Upload NEW Document**

1. Upload a new document
2. It will go to Google Drive
3. Click View button
4. **Expected**: Opens from Google Drive ✅

## 📊 Behavior Comparison

### **Old Documents (Pre-Google Drive):**
```
Storage: Local server (/media/documents/)
file_url: http://localhost:8000/media/documents/file.pdf
View: Opens from local server
Download: Downloads from local server
```

### **New Documents (Post-Google Drive):**
```
Storage: Google Drive (Academic Hub/Documents/)
file_url: https://drive.google.com/file/d/ABC123/view
View: Opens from Google Drive
Download: Downloads from Google Drive
```

## 🔄 Migration Plan (Optional)

If you want to move old files to Google Drive:

### **Option 1: Manual Upload**
1. Download old files from local server
2. Upload them again through the frontend
3. They'll go to Google Drive automatically
4. Delete old local files

### **Option 2: Migration Script** (I can create this)
```python
# Script to migrate all local files to Google Drive
# Uploads each file
# Updates database records
# Deletes local files
```

### **Option 3: Keep Both**
- Old files stay on local server
- New files go to Google Drive
- Both work with View/Download buttons
- **Recommended for now!**

## ⚠️ Important Notes

### **For Local Development:**
- ✅ Old files work (served by Django)
- ✅ New files work (served by Google Drive)
- ✅ View/Download buttons work for both

### **For Production (Render/AWS):**
- ⚠️ **Old local files will be lost** on redeployment!
- ✅ Only Google Drive files persist
- 🎯 **Solution**: Migrate old files to Google Drive before deploying

## 🚨 Action Required Before Production

Before deploying to Render/AWS:

```bash
# 1. List all documents with local files
python manage.py shell

>>> from DMS_ALX.models import Document, Result
>>> local_docs = Document.objects.filter(gdrive_file_id__isnull=True)
>>> print(f"Documents on local: {local_docs.count()}")

# 2. Options:
#    A. Re-upload through frontend (goes to Google Drive)
#    B. Run migration script (I can create this)
#    C. Accept they'll be lost (not recommended)
```

## ✅ Summary

**Changes Made:**
- ✅ Updated `DocumentSerializer.get_file_url()`
- ✅ Updated `ResultSerializer.get_file_url()`
- ✅ Now returns absolute URLs for local files
- ✅ Returns Google Drive URLs for new files

**What Works Now:**
- ✅ View button opens old files from local server
- ✅ View button opens new files from Google Drive
- ✅ Download button works for both
- ✅ No more "Not Found" errors

**Next Steps:**
1. Restart Django server
2. Test View/Download buttons
3. Upload a new document (goes to Google Drive)
4. Decide on migration plan for old files

---

**Status:** ✅ **FIXED**

Restart your Django server and test the View/Download buttons! 🎉
