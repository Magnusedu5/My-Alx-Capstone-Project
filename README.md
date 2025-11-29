# 📄 Document Management System (DMS)

A Django + Django REST Framework (DRF) based backend for managing academic documents and results.  
Designed for institutions where **staff** can upload results/documents and **HODs** can approve them.

---

## 🚀 Features
- **User Roles**: Staff and HOD (HODs have approval permissions)
- **Document & Result Management**: Upload, retrieve, and filter
- **Filtering**: Search results by session, semester, and course code
- **Secure Access**: Role-based permissions
- **Timestamps**: Auto record upload date & uploader

---

## 🛠 Tech Stack



🔌 API Endpoints
| Method | Endpoint               | Description                               | Auth Required |
| ------ | ---------------------- | ----------------------------------------- | ------------- |
| GET    | `/api/results/`    | List all results                          | ✅            |
| POST   | `/api/results/upload`  | Upload a new result                       | ✅            |
| GET    | `/api/documents/`  | List all documents                        | ✅            |
| POST   | `/api/documents/upload`| Upload a new document                     | ✅            |
| GET    | `/api/results/filter/` | Filter results by session/semester/course | ✅            |
✅            |
| POST   | `/api/login/`| Login                  | ✅        
---
✅            |
## Quick local development

- Activate the Python virtualenv:

```bash
source venv/bin/activate
```

- Install Python dependencies (if needed):

```bash
pip install -r requirements.txt
```

- Apply migrations and create demo users:

```bash
python manage.py migrate
python manage.py createsuperuser  # or use management command below
python manage.py create_demo_users
```

- Start backend server:

```bash
python manage.py runserver
```

- Start frontend dev server (from `frontend/`):

```bash
cd frontend
# Ensure VITE_API_BASE_URL is set; example:
VITE_API_BASE_URL="http://127.0.0.1:8000/api" npm install
VITE_API_BASE_URL="http://127.0.0.1:8000/api" npm run dev
```

## API notes
- The API base path is `http://127.0.0.1:8000/api/` by default.
- Endpoints added/changed:
	- `POST /api/login/` - returns `token`, `refresh`, and `user` (role lowercased)
	- `GET /api/profile/` - returns current user profile (requires auth)
	- `DELETE /api/documents/{id}/` - delete document (HOD or owner)
	- `DELETE /api/results/{id}/` - delete result (HOD or owner)
| GET   | `/api/dashboard`| View Dashboard                   | ✅        



