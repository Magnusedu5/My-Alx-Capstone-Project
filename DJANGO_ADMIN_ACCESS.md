# 🔐 Django Admin Access Guide

## Current Admin Account

### Superuser Credentials
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@example.com`

---

## Accessing Django Admin

### For Local Development

1. **Start the Django server** (if not already running):
   ```bash
   python manage.py runserver
   ```

2. **Navigate to the admin URL:**
   ```
   http://localhost:8000/admin/
   ```

3. **Login with:**
   - Username: `admin`
   - Password: `admin123`

### For Deployed Application (Render/Production)

1. **Find your deployment URL** (check your Render dashboard or deployment logs)

2. **Navigate to:**
   ```
   https://your-service.onrender.com/admin/
   ```

3. **Login with:**
   - Username: `admin`
   - Password: `admin123`

---

## What You Can Do in Django Admin

### ✅ User Management
- **View all users** (demo users + any custom users)
- **Create new users** with specific roles (HOD or Staff)
- **Edit user details** (username, email, role, department)
- **Activate/deactivate users**
- **Change user passwords**
- **Grant/revoke admin privileges**

### ✅ Department Management
- **Create new departments**
- **Edit department names**
- **Assign users to departments**

### ✅ Document Management
- **View all uploaded documents**
- **Approve/reject documents**
- **Delete documents**
- **Change document status**

### ✅ Result Management
- **View all uploaded results**
- **Approve/reject results**
- **Delete results**
- **Change result status**

### ✅ Session Management
- **Create academic sessions** (e.g., "2023/2024")
- **Edit session names**

---

## Creating a New User via Django Admin

### Step-by-Step Guide

1. **Login to Django Admin** at `/admin/`

2. **Click on "Custom Users"** under the DMS_ALX section

3. **Click the "Add Custom User" button** (top right)

4. **Fill in the required fields:**
   - **Username:** Unique username (required)
   - **Password:** Enter twice for confirmation
   - **Email:** User's email address
   - **First name:** (optional)
   - **Last name:** (optional)

5. **Click "Save and continue editing"**

6. **Set the role and permissions:**
   - **Role:** Choose HOD or STAFF
   - **Department:** Select department (optional)
   - **Staff status:** Check this if user needs admin access
   - **Active:** Must be checked for user to login

7. **Click "Save"**

8. **The user can now login** with their email and the password you set

---

## Resetting Admin Password

### Method 1: Via Django Shell

```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Get the admin user
admin = User.objects.get(username='admin')

# Set a new password
admin.set_password('new_secure_password')
admin.save()

print("Admin password updated successfully!")
```

### Method 2: Via Management Command

```bash
python manage.py changepassword admin
```

Then follow the prompts to enter a new password.

---

## Creating Additional Superuser Accounts

### Interactive Method

```bash
python manage.py createsuperuser
```

Follow the prompts:
- Username: `new_admin`
- Email: `newadmin@example.com`
- Password: (enter twice)

### Non-Interactive Method (for scripts)

```bash
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()

User.objects.create_superuser(
    username='new_admin',
    email='newadmin@example.com',
    password='secure_password',
    role='HOD'
)
print("Superuser created!")
EOF
```

---

## Common Admin Tasks

### 1. Approve Pending Documents
1. Go to **Documents** in admin
2. Click on a pending document
3. Change **Status** from "Pending" to "Approved"
4. Click **Save**

### 2. Approve Pending Results
1. Go to **Results** in admin
2. Click on a pending result
3. Change **Status** from "Pending" to "Approved"
4. Click **Save**

### 3. Make a User an HOD
1. Go to **Custom Users**
2. Click on the user
3. Change **Role** to "Head of Department"
4. Click **Save**

### 4. Grant Admin Access to a User
1. Go to **Custom Users**
2. Click on the user
3. Check **Staff status**
4. Optionally check **Superuser status** for full admin access
5. Click **Save**

### 5. Deactivate a User
1. Go to **Custom Users**
2. Click on the user
3. Uncheck **Active**
4. Click **Save**

---

## Security Best Practices

### ⚠️ For Production Deployment

1. **Change the default admin password immediately:**
   ```bash
   python manage.py changepassword admin
   ```

2. **Use strong passwords:**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - Avoid common words or patterns

3. **Limit superuser accounts:**
   - Only create superusers for trusted administrators
   - Regular users don't need superuser status

4. **Enable Two-Factor Authentication** (recommended):
   - Install: `pip install django-otp qrcode`
   - Configure in settings.py

5. **Regular security audits:**
   - Review user accounts periodically
   - Remove inactive superuser accounts
   - Check for suspicious activity in admin logs

6. **Use environment variables:**
   - Never hardcode admin credentials in code
   - Store in secure environment variables

---

## Troubleshooting

### Can't Access Admin Site

**Problem:** Getting 404 or page not found

**Solution:**
- Verify the server is running
- Check URL is correct: `/admin/` (with trailing slash)
- Verify `django.contrib.admin` is in `INSTALLED_APPS`

---

### Login Fails

**Problem:** "Please enter the correct username and password"

**Solution:**
- Use username (`admin`), not email, for admin login
- Reset password using `python manage.py changepassword admin`
- Check user has `is_staff=True` and `is_active=True`

---

### CSRF Verification Failed

**Problem:** CSRF error when trying to login

**Solution:**
- Check `CSRF_TRUSTED_ORIGINS` in settings includes your domain
- Clear browser cookies
- For production, ensure HTTPS is properly configured

---

### Can't See Custom Models

**Problem:** Custom User, Document, Result models not showing

**Solution:**
- Verify models are registered in `admin.py`
- Run migrations: `python manage.py migrate`
- Restart the server

---

## Quick Reference Commands

```bash
# Start server
python manage.py runserver

# Create superuser
python manage.py createsuperuser

# Change password
python manage.py changepassword admin

# Access Django shell
python manage.py shell

# List all superusers
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); [print(u.username) for u in User.objects.filter(is_superuser=True)]"
```

---

## Admin URLs Reference

| Path | Description |
|------|-------------|
| `/admin/` | Admin home page |
| `/admin/DMS_ALX/customuser/` | User management |
| `/admin/DMS_ALX/document/` | Document management |
| `/admin/DMS_ALX/result/` | Result management |
| `/admin/DMS_ALX/department/` | Department management |
| `/admin/DMS_ALX/session/` | Session management |

---

## Current System Status

✅ **Admin configured and accessible**
✅ **Custom user model registered**
✅ **All models registered in admin**
✅ **2 superuser accounts exist**

**Default Credentials:**
- Username: `admin` | Password: `admin123`

🔒 **IMPORTANT:** Change the default password before deploying to production!
