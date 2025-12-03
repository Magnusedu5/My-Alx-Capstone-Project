# 🚀 Deploy Google Drive Integration to Render

## 🚨 Current Issue

Your Render deployment is showing:
```
Google Drive upload failed: Credentials file not found at /app/credentials.json
```

This happens because:
1. `credentials.json` is in `.gitignore` (correct!)
2. Render doesn't have access to the file
3. Google Drive integration falls back to local storage

---

## ✅ Solution: Use Environment Variables

Instead of storing `credentials.json` and `token.pickle` as files on Render, we'll store them as **environment variables**.

---

## 📋 Step-by-Step Fix

### **Step 1: Prepare Your Credentials**

On your local machine, encode your credentials to base64:

```bash
# Navigate to your project
cd /path/to/Alx_Capstone_project

# Encode credentials.json
cat credentials.json | base64 > credentials_base64.txt

# Encode token.pickle
cat token.pickle | base64 > token_base64.txt

# View the encoded strings
cat credentials_base64.txt
cat token_base64.txt
```

**Copy both encoded strings** - you'll need them in Step 3.

---

### **Step 2: Update Django Settings**

Add this to your `Alx_Capstone_project/settings.py`:

```python
import os
import base64
from pathlib import Path

# ... existing code ...

# Google Drive Configuration for Production
if not DEBUG:  # In production (Render)
    # Decode credentials from environment variables
    GOOGLE_CREDENTIALS_BASE64 = os.getenv('GOOGLE_CREDENTIALS_BASE64')
    GOOGLE_TOKEN_BASE64 = os.getenv('GOOGLE_TOKEN_BASE64')
    
    if GOOGLE_CREDENTIALS_BASE64:
        # Decode and write credentials.json
        credentials_content = base64.b64decode(GOOGLE_CREDENTIALS_BASE64)
        credentials_path = BASE_DIR / 'credentials.json'
        with open(credentials_path, 'wb') as f:
            f.write(credentials_content)
    
    if GOOGLE_TOKEN_BASE64:
        # Decode and write token.pickle
        token_content = base64.b64decode(GOOGLE_TOKEN_BASE64)
        token_path = BASE_DIR / 'token.pickle'
        with open(token_path, 'wb') as f:
            f.write(token_content)
```

---

### **Step 3: Add Environment Variables to Render**

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your web service: **my-alx-capstone-project**
3. Click "**Environment**" in the left sidebar
4. Click "**Add Environment Variable**"
5. Add these two variables:

**Variable 1:**
- **Key**: `GOOGLE_CREDENTIALS_BASE64`
- **Value**: Paste the content from `credentials_base64.txt`

**Variable 2:**
- **Key**: `GOOGLE_TOKEN_BASE64`
- **Value**: Paste the content from `token_base64.txt`

6. Click "**Save Changes**"

Render will automatically redeploy your service.

---

### **Step 4: Commit and Push Changes**

```bash
# Add the settings.py change
git add Alx_Capstone_project/settings.py

# Commit
git commit -m "Add Google Drive environment variable support for production"

# Push to trigger Render deployment
git push origin main
```

---

### **Step 5: Verify Deployment**

After Render redeploys:

1. Check the logs for this message:
   ```
   ✅ Should NOT see: "Credentials file not found"
   ✅ Should see: File uploaded successfully to Google Drive
   ```

2. Test uploading a file through your frontend
3. Check your Google Drive - file should appear!

---

## 🔒 Alternative Solution: Render Secret Files (Simpler)

Render also supports **Secret Files** which is easier:

### **Method 2: Using Render Secret Files**

1. Go to your Render service dashboard
2. Click "**Environment**" tab
3. Scroll to "**Secret Files**" section
4. Click "**Add Secret File**"

**Add credentials.json:**
- **Filename**: `credentials.json`
- **Contents**: Paste the entire content of your local `credentials.json`

**Add token.pickle:**
- **Filename**: `token.pickle`
- **Contents**: Paste the entire content of your local `token.pickle`

5. Click "**Save Changes**"

That's it! Render will create these files in your app's root directory.

---

## ✅ Which Method Should You Use?

| Method | Pros | Cons |
|--------|------|------|
| **Environment Variables** (Method 1) | More portable, works on any platform | Requires code changes |
| **Secret Files** (Method 2) | Simpler, no code changes | Render-specific feature |

**Recommendation**: Use **Method 2 (Secret Files)** - it's simpler and doesn't require code changes!

---

## 🧪 Testing After Deployment

### Test 1: Check Logs
```bash
# In Render dashboard, check logs for:
✅ "Google Drive connection successful"
❌ NOT "Credentials file not found"
```

### Test 2: Upload a File
1. Go to your deployed frontend
2. Login as staff user
3. Upload a document or result
4. Check Google Drive - file should be there!

### Test 3: Check Database
Files should have:
- ✅ `gdrive_file_id` populated
- ✅ `gdrive_file_url` populated
- ✅ No local file path

---

## 🚨 Important Security Notes

### ✅ DO:
- Use environment variables or secret files
- Keep `credentials.json` in `.gitignore`
- Keep `token.pickle` in `.gitignore`
- Rotate credentials periodically

### ❌ DON'T:
- Commit credentials to Git
- Share credentials publicly
- Use the same credentials for dev and prod
- Expose credentials in logs

---

## 🔄 Fallback Behavior

Even if Google Drive fails on Render, your app will continue to work:

```python
try:
    # Upload to Google Drive
    drive_result = upload_to_drive(...)
except Exception as e:
    # Falls back to local storage
    print(f"Google Drive upload failed: {e}. Using local storage.")
```

**However**, on Render, local storage is **ephemeral** (gets deleted on redeployment), so you **must** get Google Drive working!

---

## 📞 Troubleshooting

### Issue: "Credentials file not found"
**Solution**: Add credentials as environment variables or secret files

### Issue: "Token expired"
**Solution**: Generate new token locally and re-encode it:
```bash
python gdrive_auth.py
cat token.pickle | base64 > token_base64.txt
```
Then update the `GOOGLE_TOKEN_BASE64` environment variable on Render.

### Issue: Files upload locally but not to Drive
**Check**:
1. Environment variables are set correctly
2. No typos in variable names
3. Base64 encoding is correct
4. Render has redeployed after changes

---

## 🎯 Quick Fix (Recommended)

Use **Render Secret Files** (simplest):

1. Go to: https://dashboard.render.com
2. Select: **my-alx-capstone-project**
3. Click: **Environment** tab
4. Scroll to: **Secret Files**
5. Add: `credentials.json` with your file content
6. Add: `token.pickle` with your file content
7. Click: **Save Changes**
8. Wait for redeploy
9. Test upload - should work! ✅

---

**Which method would you like to use? I can guide you through either one!** 🚀
