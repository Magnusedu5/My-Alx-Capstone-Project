# 🚀 Deployment Guide - Document Management System

## Environment Variables Setup

### Required Environment Variables for Production

When deploying to Render or any production environment, set these environment variables:

```bash
# Django Core
SECRET_KEY=<generate-a-secure-random-50+-character-string>
DEBUG=False
ALLOWED_HOSTS=your-service.onrender.com,your-domain.com

# Database (Render provides this automatically when you add PostgreSQL)
DATABASE_URL=postgresql://user:password@hostname:5432/dbname

# CORS - Add your frontend URL(s)
CORS_ALLOWED_ORIGINS=https://your-frontend.onrender.com,https://your-domain.com

# CSRF - Add your backend URL(s)
CSRF_TRUSTED_ORIGINS=https://your-service.onrender.com,https://your-domain.com

# Security
SECURE_SSL_REDIRECT=True

# Logging
LOG_LEVEL=INFO

# Database Wait (Optional)
WAIT_FOR_DB=1

# Admin User (Optional - remove after first deployment)
DJANGO_SUPERUSER_EMAIL=admin@yourdomain.com
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_PASSWORD=<strong-password>
```

## Generating a Secure SECRET_KEY

Run this Python command to generate a secure secret key:

```python
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

## Render.com Deployment Steps

### 1. Create PostgreSQL Database

1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Name: `alx-capstone-db`
4. Region: Oregon (or nearest to you)
5. Plan: Starter ($7/month) or Free
6. Click "Create Database"
7. Copy the **Internal Database URL** (starts with `postgresql://`)

### 2. Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `alx-capstone-backend`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Runtime:** Docker
   - **Plan:** Starter ($7/month) or Free

### 3. Set Environment Variables

In the Render dashboard for your web service, go to "Environment" tab and add:

```
SECRET_KEY=<your-generated-secret-key>
DEBUG=False
ALLOWED_HOSTS=alx-capstone-backend.onrender.com
DATABASE_URL=<paste-internal-database-url>
CORS_ALLOWED_ORIGINS=https://your-frontend-url.com
CSRF_TRUSTED_ORIGINS=https://alx-capstone-backend.onrender.com
SECURE_SSL_REDIRECT=True
LOG_LEVEL=INFO
DJANGO_SUPERUSER_EMAIL=admin@yourdomain.com
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_PASSWORD=<strong-password>
```

### 4. Add Persistent Disk for Media Files (Optional but Recommended)

1. Go to your web service settings
2. Click "Disks" tab
3. Add disk:
   - **Name:** `media-files`
   - **Mount Path:** `/app/media`
   - **Size:** 1GB (or as needed)

### 5. Deploy

1. Click "Manual Deploy" → "Deploy latest commit"
2. Wait for build to complete (5-10 minutes)
3. Check logs for any errors

## Post-Deployment Verification

### 1. Check Service Health

Visit: `https://your-service.onrender.com/api/`

You should see the API documentation or a JSON response.

### 2. Access Admin Panel

Visit: `https://your-service.onrender.com/admin/`

Login with the superuser credentials you set in environment variables.

### 3. Test API Endpoints

```bash
# Test login
curl -X POST https://your-service.onrender.com/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@yourdomain.com", "password": "your-password"}'

# Should return JWT token
```

## Local Development Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd My-Alx-Capstone-Project
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Setup Environment Variables

The `.env` file is already created with development defaults. Modify if needed:

```bash
# .env file is already configured for development
# No changes needed for local development
```

### 5. Run Migrations

```bash
python manage.py migrate
```

### 6. Create Superuser

```bash
python manage.py createsuperuser
```

### 7. Run Development Server

```bash
python manage.py runserver
```

Visit: `http://localhost:8000`

## Database Migration from SQLite to PostgreSQL

If you have existing data in SQLite that you want to migrate:

### 1. Dump SQLite Data

```bash
python manage.py dumpdata --natural-foreign --natural-primary \
  -e contenttypes -e auth.Permission > data.json
```

### 2. Switch to PostgreSQL

Update your `.env` or environment variables with `DATABASE_URL`.

### 3. Run Migrations

```bash
python manage.py migrate
```

### 4. Load Data

```bash
python manage.py loaddata data.json
```

## Troubleshooting

### Static Files Not Loading

Ensure `collectstatic` runs during deployment:

```bash
python manage.py collectstatic --noinput
```

This is already included in `entrypoint.sh`.

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Ensure database is in the same region as web service
3. Use **Internal Database URL**, not External

### CORS Errors

Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`:

```bash
CORS_ALLOWED_ORIGINS=https://your-frontend.com,https://another-domain.com
```

### CSRF Token Errors

Ensure backend URL is in `CSRF_TRUSTED_ORIGINS`:

```bash
CSRF_TRUSTED_ORIGINS=https://your-backend.onrender.com
```

### Media Files Not Persisting

Add a persistent disk in Render:
- Mount path: `/app/media`
- Size: As needed

## Security Checklist

Before going to production:

- [x] Generated secure `SECRET_KEY` (50+ characters)
- [x] Set `DEBUG=False`
- [x] Configured `ALLOWED_HOSTS` properly
- [x] Using PostgreSQL, not SQLite
- [x] SSL/HTTPS enabled (`SECURE_SSL_REDIRECT=True`)
- [x] CORS configured with specific origins
- [x] CSRF trusted origins configured
- [x] Removed or changed default superuser password
- [x] Using environment variables for secrets
- [x] Persistent disk for media files (if needed)
- [x] Regular database backups configured

## Monitoring and Logs

### View Logs in Render

1. Go to your web service dashboard
2. Click "Logs" tab
3. Monitor for errors or warnings

### Log Levels

Set `LOG_LEVEL` environment variable:
- `DEBUG` - Development only
- `INFO` - Production default
- `WARNING` - Production (less verbose)
- `ERROR` - Only errors

## Backup Strategy

### Database Backups

Render automatically backs up PostgreSQL databases on paid plans.

For manual backups:

```bash
# From Render dashboard, use the backup feature
# Or use pg_dump via psql
```

### Media Files Backups

If using persistent disk:
1. Regular manual downloads
2. Or setup automated S3 sync (recommended for production)

## Scaling Considerations

### Horizontal Scaling

Render automatically scales web services based on plan.

### Database Optimization

1. Add indexes to frequently queried fields
2. Use connection pooling (already configured with `conn_max_age=600`)
3. Monitor slow queries

### Media Storage

For production at scale, consider:
- Amazon S3
- Cloudinary
- Google Cloud Storage

Configure in settings using environment variables.

## Support and Documentation

- Django Documentation: https://docs.djangoproject.com/
- Render Documentation: https://render.com/docs
- Django REST Framework: https://www.django-rest-framework.org/

---

**Note:** Remove the `DJANGO_SUPERUSER_*` environment variables after first deployment for security reasons.
