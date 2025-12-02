# 🔗 Backend Integration Guide

## How to Integrate a Backend from Another Repository

Yes, you can integrate a backend from a different repository! Here are the various approaches:

---

## 📋 **Approach 1: Add as Django App (Recommended for Django backends)**

This is best if the other backend is also a Django app.

### Steps:

#### 1. **Copy the Backend App**
```bash
# Clone the other repository
git clone https://github.com/username/other-backend.git /tmp/other-backend

# Copy the Django app to your project
cp -r /tmp/other-backend/app_name ./new_app_name
```

#### 2. **Install Dependencies**
```bash
# If the other repo has requirements.txt
pip install -r /tmp/other-backend/requirements.txt

# Or add to your requirements.txt
cat /tmp/other-backend/requirements.txt >> requirements.txt
pip install -r requirements.txt
```

#### 3. **Register the App in Settings**
Edit `Alx_Capstone_project/settings.py`:
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'DMS_ALX',          # Your existing app
    'new_app_name',     # 👈 Add the new app here
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
]
```

#### 4. **Add URL Routes**
Edit `Alx_Capstone_project/urls.py`:
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('DMS_ALX.api_urls')),        # Existing
    path('api/new/', include('new_app_name.urls')),   # 👈 Add new routes
    path('', include('DMS_ALX.urls')),
]
```

#### 5. **Run Migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 6. **Update Database Models (if needed)**
If there are conflicts with existing models, you may need to:
- Rename models
- Use custom table names
- Set up database routing

---

## 📋 **Approach 2: Use as Git Submodule**

Best for keeping the other backend updated with its original repository.

### Steps:

#### 1. **Add as Submodule**
```bash
# Add the other repo as a submodule
git submodule add https://github.com/username/other-backend.git backends/other_backend

# Initialize and update
git submodule update --init --recursive
```

#### 2. **Install Dependencies**
```bash
pip install -r backends/other_backend/requirements.txt
```

#### 3. **Configure Python Path**
Add to `Alx_Capstone_project/settings.py`:
```python
import sys
import os

# Add the submodule to Python path
sys.path.insert(0, os.path.join(BASE_DIR, 'backends', 'other_backend'))
```

#### 4. **Register and Configure**
Follow steps 3-5 from Approach 1.

#### 5. **Update Submodule**
When you want to pull updates:
```bash
cd backends/other_backend
git pull origin main
cd ../..
git add backends/other_backend
git commit -m "Update submodule"
```

---

## 📋 **Approach 3: Microservices Architecture**

Best for completely separate backends that need to remain independent.

### Option A: Separate Backend Servers

#### Current Project Structure:
```
Frontend (React) → Backend 1 (Django DMS) → Database 1
                 → Backend 2 (Other API) → Database 2
```

#### 1. **Run Both Backends**
```bash
# Terminal 1: Your current backend
python manage.py runserver 0.0.0.0:8000

# Terminal 2: Other backend
cd /path/to/other-backend
python manage.py runserver 0.0.0.0:8001
```

#### 2. **Update Frontend to Call Both APIs**
Edit `frontend/src/services/api.js`:
```javascript
// Current backend
const API_BASE_URL = 'http://localhost:8000/api';

// New backend
const API_BASE_URL_2 = 'http://localhost:8001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const api2 = axios.create({
  baseURL: API_BASE_URL_2,
});
```

#### 3. **Configure CORS for Both**
In both backends' `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Frontend
    "http://localhost:8000",  # Backend 1
    "http://localhost:8001",  # Backend 2
]
```

### Option B: API Gateway (Advanced)

Create a proxy/gateway that routes requests to different backends:

```python
# gateway/urls.py
urlpatterns = [
    path('api/dms/', include('DMS_ALX.api_urls')),
    path('api/other/', proxy_to('http://localhost:8001/api/')),
]
```

---

## 📋 **Approach 4: Merge Models and Views**

Best for integrating functionality without maintaining separate apps.

### Steps:

#### 1. **Copy Models**
Add models from the other backend to `DMS_ALX/models.py`:
```python
# Your existing models
class CustomUser(AbstractUser):
    pass

class Document(models.Model):
    pass

# 👇 New models from other backend
class NewModel(models.Model):
    # ... fields from other backend
    pass
```

#### 2. **Copy Views/Serializers**
Add to `DMS_ALX/api_views.py` and `DMS_ALX/serializers.py`

#### 3. **Add Routes**
Add to `DMS_ALX/api_urls.py`:
```python
urlpatterns = [
    # Existing routes
    path('login/', views.LoginView.as_view(), name='login'),
    
    # 👇 New routes from other backend
    path('new-endpoint/', views.NewView.as_view(), name='new-endpoint'),
]
```

#### 4. **Run Migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 🤔 **Which Approach Should You Use?**

| Approach | When to Use | Pros | Cons |
|----------|-------------|------|------|
| **Django App** | Other backend is Django-based, need tight integration | Clean integration, shared DB, single deployment | More coupling, potential conflicts |
| **Git Submodule** | Want to keep other backend updated independently | Easy updates, clear separation | Git complexity, still coupled |
| **Microservices** | Backends are very different, need independence | Complete separation, scalable | More complex deployment, CORS issues |
| **Merge Code** | Simple backend, one-time integration | Simplest structure | Hard to update, loses separate history |

---

## 📝 **Before You Start - Important Questions**

Before integrating, please provide this information:

1. **What backend are you integrating?**
   - Repository URL?
   - What technology? (Django, Flask, FastAPI, Node.js, etc.)
   - What does it do?

2. **Why do you need to integrate it?**
   - Additional features?
   - Replace existing functionality?
   - Add new endpoints?

3. **Database requirements?**
   - Does it use its own database?
   - Need to share data with current system?
   - What database? (PostgreSQL, MySQL, SQLite, MongoDB, etc.)

4. **Authentication/Authorization?**
   - Does it have its own auth system?
   - Should it use your current JWT auth?
   - Need to sync users?

5. **Deployment considerations?**
   - Deploy together or separately?
   - Hosting platform? (Render, Heroku, AWS, etc.)

---

## 🛠️ **Example Integration Scenarios**

### Scenario 1: Payment Processing Backend

**Best Approach:** Microservices (Option A)

```
Frontend → DMS Backend (Port 8000) → Document/Result Management
        → Payment Backend (Port 8001) → Payment Processing
```

### Scenario 2: Additional Django App (Blog, Forum, etc.)

**Best Approach:** Django App (Approach 1)

```
Project/
├── DMS_ALX/          # Your current app
├── blog/             # New app from other repo
├── manage.py
└── Alx_Capstone_project/
    └── settings.py   # Register both apps
```

### Scenario 3: Analytics API (Flask/FastAPI)

**Best Approach:** Microservices (Option A)

```
Frontend → Django Backend → DMS features
        → Analytics API → Data analytics/reports
```

---

## 🚀 **Let's Get Started!**

Tell me:
1. **What backend do you want to integrate?** (GitHub link or description)
2. **What does it do?**
3. **How do you want it to work with your current system?**

I'll help you choose the best approach and guide you through the integration step by step!

---

## 📚 **Additional Resources**

### Useful Django Packages for Integration:
- `django-cors-headers` - Already installed ✅
- `django-rest-framework` - Already installed ✅
- `django-proxy` - For proxying to other APIs
- `requests` - For calling external APIs
- `celery` - For background tasks between services

### Multi-Database Configuration:
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
    'other_backend_db': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'other_db',
        'USER': 'user',
        'PASSWORD': 'pass',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Database Routers:
```python
# routers.py
class OtherBackendRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'other_app':
            return 'other_backend_db'
        return None
```

---

## ⚠️ **Common Pitfalls to Avoid**

1. **Conflicting URLs** - Use different prefixes (`/api/dms/`, `/api/other/`)
2. **Dependency Conflicts** - Check for version conflicts in requirements.txt
3. **Model Name Conflicts** - Use unique model names or db_table
4. **Static Files Conflicts** - Configure separate STATIC_ROOT paths
5. **Database Migrations** - Keep track of which migrations belong to which app
6. **Authentication Issues** - Decide on shared vs separate auth early

---

Ready to integrate? Share the details of the backend you want to add! 🚀
