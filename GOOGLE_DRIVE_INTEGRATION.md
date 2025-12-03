# 🚀 Google Drive Integration - Complete Guide

## 📋 Overview

The Academic Hub DMS now integrates with Google Drive to store all uploaded files (documents and results) in the cloud instead of local server storage.

### ✅ Benefits

- **Unlimited Storage**: No more server disk space limitations
- **Reliable**: Google's infrastructure handles backups and redundancy
- **Scalable**: Perfect for production deployment on platforms like Render
- **Accessible**: Files can be viewed and shared easily
- **Cost-Effective**: Free up to 15GB, affordable beyond that

---

## 🔧 How It Works

### Upload Process

```
User uploads file → Django receives file → Upload to Google Drive → 
Get Drive file ID & URL → Save to database → Delete temp file → Return success
```

### Download Process

```
User clicks download → Frontend uses Google Drive URL → 
File opens in browser or downloads directly from Google Drive
```

---

## 🗃️ Database Structure

### New Fields Added to Models

Both `Document` and `Result` models now have:

- **`gdrive_file_id`**: Google Drive file ID (unique identifier)
- **`gdrive_file_url`**: Public URL to view the file
- **`original_filename`**: Original name of uploaded file
- **`file`**: Local file field (kept for fallback, usually `None`)

### Model Property

Both models have a `file_url` property that returns:
1. Google Drive URL if available
2. Local file URL if no Google Drive URL
3. `None` if no file exists

---

## 📁 Project Structure

```
Alx_Capstone_project/
├── credentials.json              # Google OAuth credentials
├── token.pickle                  # Authentication token (auto-generated)
├── DMS_ALX/
│   ├── utils/
│   │   ├── __init__.py
│   │   └── google_drive.py      # Google Drive integration utilities
│   ├── models.py                 # Updated with Google Drive fields
│   ├── serializers.py            # Updated to handle uploads
│   ├── api_views.py              # Upload endpoints
│   └── admin.py                  # Enhanced admin panel
└── requirements.txt              # Includes Google API packages
```

---

## 🔐 Authentication Setup

### Files Required

1. **`credentials.json`**: OAuth 2.0 credentials from Google Cloud Console
   - Already configured in your project
   - Contains: `client_id`, `client_secret`, `project_id`

2. **`token.pickle`**: Authentication token
   - Generated automatically after first authentication
   - Expires after some time, refreshes automatically

### Security

- Both files are in `.gitignore` to prevent accidental commits
- Token is stored securely on the server
- Files uploaded to Google Drive are private by default but viewable via link

---

## 🛠️ API Usage

### Uploading Documents

**Endpoint**: `POST /api/documents/upload/`

**Request**: multipart/form-data
```json
{
  "title": "Document Title",
  "description": "Document description",
  "category": "Academic",
  "file": <file_upload>
}
```

**Response**:
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "id": 1,
    "title": "Document Title",
    "gdrive_file_id": "1ABC...xyz",
    "gdrive_file_url": "https://drive.google.com/file/d/1ABC...xyz/view",
    "file_url": "https://drive.google.com/file/d/1ABC...xyz/view",
    "original_filename": "document.pdf",
    "status": "PENDING"
  }
}
```

### Uploading Results

**Endpoint**: `POST /api/results/upload/`

**Request**: multipart/form-data
```json
{
  "course_code": "CS101",
  "course_title": "Introduction to Computer Science",
  "session": "2023/2024",
  "semester": "first",
  "file": <file_upload>
}
```

**Response**:
```json
{
  "message": "Result uploaded successfully",
  "result": {
    "id": 1,
    "course_code": "CS101",
    "gdrive_file_id": "1ABC...xyz",
    "gdrive_file_url": "https://drive.google.com/file/d/1ABC...xyz/view",
    "file_url": "https://drive.google.com/file/d/1ABC...xyz/view",
    "original_filename": "results.pdf"
  }
}
```

---

## 👨‍💼 Admin Panel Features

### Enhanced Views

The Django admin panel now shows:

- **Storage Type**: Visual indicator (☁️ Google Drive / 💾 Local / ❌ No File)
- **View File Link**: Clickable link to open file
- **Google Drive URL**: Full Google Drive link
- **Original Filename**: Name of uploaded file

### Admin Interface

Navigate to: `http://your-domain/admin/DMS_ALX/`

You'll see enhanced lists and detail pages with Google Drive information.

---

## 🔧 Utility Functions

### Available Functions in `DMS_ALX/utils/google_drive.py`

```python
# Upload a file
from DMS_ALX.utils.google_drive import upload_to_drive

result = upload_to_drive(
    file_object=uploaded_file,
    filename="my_document.pdf",
    mimetype="application/pdf"
)
# Returns: {'id': '...', 'name': '...', 'webViewLink': '...', 'webContentLink': '...'}

# Delete a file
from DMS_ALX.utils.google_drive import delete_from_drive

success = delete_from_drive(file_id="1ABC...xyz")
# Returns: True/False

# Get file link
from DMS_ALX.utils.google_drive import get_drive_link

links = get_drive_link(file_id="1ABC...xyz")
# Returns: {'webViewLink': '...', 'webContentLink': '...'}
```

---

## 🧪 Testing

A test script is included to verify the integration:

```bash
source venv/bin/activate
python tmp_rovodev_test_gdrive.py
```

This tests:
- ✅ Connection to Google Drive
- ✅ File upload
- ✅ File deletion

---

## 🚨 Troubleshooting

### Issue: "File not found: credentials.json"

**Solution**: Ensure `credentials.json` exists in the project root directory.

### Issue: "Token expired"

**Solution**: Delete `token.pickle` and re-run authentication:
```bash
source venv/bin/activate
python gdrive_auth.py
```

### Issue: Upload fails, falls back to local storage

**Check**:
1. Internet connection
2. Google Drive API quota
3. Token validity

**View logs**: Check Django console for error messages starting with "Google Drive upload failed:"

### Issue: "Insufficient Permission"

**Solution**: The Google Drive API scope needs to be updated. Delete `token.pickle` and re-authenticate.

---

## 🔄 Fallback Mechanism

If Google Drive upload fails for any reason, the system automatically falls back to local file storage:

1. Upload to Google Drive is attempted
2. If it fails, file is saved locally
3. Error is logged but upload succeeds
4. User sees no difference in functionality

This ensures **zero downtime** even if Google Drive is unavailable.

---

## 📊 Migration Notes

### Existing Files

Files uploaded before Google Drive integration:
- Are stored locally in `documents/` and `results/` folders
- Continue to work normally
- Can be viewed using the local file URL
- Will not be automatically migrated to Google Drive

### New Files

All new uploads after integration:
- Go directly to Google Drive
- Local file field remains empty (`None`)
- Use Google Drive URLs for access

---

## 🔐 Environment Variables (Optional)

For production, you can store credentials in environment variables:

```python
# In settings.py
GOOGLE_DRIVE_CREDENTIALS = os.getenv('GOOGLE_DRIVE_CREDENTIALS')
```

This is recommended for platforms like Render, Heroku, etc.

---

## 📦 Deployment Checklist

When deploying to production:

- [ ] Ensure `credentials.json` is in project root
- [ ] Run authentication: `python gdrive_auth.py`
- [ ] Verify `token.pickle` is generated
- [ ] Add to `.gitignore`: `token.pickle` and `credentials.json`
- [ ] Test upload via API
- [ ] Verify files appear in Google Drive
- [ ] Configure environment variables (if needed)

---

## 🎉 Success Indicators

You know integration is working when:

✅ Files upload without errors  
✅ Admin panel shows "☁️ Google Drive" storage type  
✅ Clicking file links opens Google Drive  
✅ No files are stored in local `documents/` or `results/` folders  
✅ Database shows `gdrive_file_id` and `gdrive_file_url` populated  

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Django logs
3. Verify Google Drive API status
4. Check token validity

---

**Integration completed successfully! 🎉**  
*Your Academic Hub DMS now uses Google Drive for all file storage.*
