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
- **Backend**: Python, Django, Django REST Framework
- **Database**: SQLite (default) — easily swappable with PostgreSQL/MySQL
- **Authentication**: Django’s built-in auth system
- **API Style**: RESTful API endpoints




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
✅            |
| GET   | `/api/dashboard`| View Dashboard                   | ✅        



