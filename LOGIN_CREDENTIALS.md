# 🔐 Login Credentials

## Demo User Accounts

The system includes two demo accounts for testing:

### 👨‍💼 HOD (Head of Department) Account
- **Email:** `hod@demo.local`
- **Password:** `demo123`
- **Permissions:** Can view all documents and results, approve/reject submissions

### 👤 Staff Account
- **Email:** `staff@demo.local`
- **Password:** `demo123`
- **Permissions:** Can upload documents and results, view own submissions

---

## Creating/Updating Demo Users

To create or reset the demo user passwords, run:

```bash
python manage.py create_demo_users
```

This command will:
- Create the demo users if they don't exist
- Reset passwords to `demo123` if they already exist
- Display the credentials in the terminal

---

## Creating Custom Users

### Option 1: Django Admin Panel

1. Create a superuser first:
   ```bash
   python manage.py createsuperuser
   ```

2. Access admin panel at: `http://localhost:8000/admin/`

3. Navigate to "Custom Users" and create new users with their roles

### Option 2: Django Shell

```bash
python manage.py shell
```

```python
from DMS_ALX.models import CustomUser

# Create HOD user
hod = CustomUser.objects.create_user(
    username='john_hod',
    email='john@example.com',
    password='securepassword',
    role='HOD'
)

# Create Staff user
staff = CustomUser.objects.create_user(
    username='jane_staff',
    email='jane@example.com',
    password='securepassword',
    role='STAFF'
)
```

---

## Password Reset

If you forget a user's password, you can reset it via Django shell:

```bash
python manage.py shell
```

```python
from DMS_ALX.models import CustomUser

user = CustomUser.objects.get(email='user@example.com')
user.set_password('newpassword')
user.save()
```

---

## Important Notes

⚠️ **Security Reminders:**
- Change default passwords in production
- Use strong passwords for production deployments
- Never commit passwords to version control
- The demo accounts are for development/testing only

✅ **Login works with:**
- Email address (case-insensitive)
- Both frontend (React) and API endpoints
- JWT token authentication for API requests
