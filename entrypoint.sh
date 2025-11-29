#!/usr/bin/env bash
set -e

# Optional simple wait for DB
if [ -n "$WAIT_FOR_DB" ]; then
  sleep 5
fi

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Create superuser from env if provided (safe to run every start)
if [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py createsuperuser --noinput --email "$DJANGO_SUPERUSER_EMAIL" --username "$DJANGO_SUPERUSER_USERNAME" || true
fi

# Start gunicorn
exec gunicorn Alx_Capstone_project.wsgi:application --bind 0.0.0.0:8000 --workers 3
