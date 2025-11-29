# Stage 1 — build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY frontend/ .
RUN yarn build

# Stage 2 — build python app
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

# Install system dependencies (adjust if you need pillow, etc.)
RUN apt-get update && apt-get install -y build-essential libpq-dev gcc curl && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Copy frontend build into staticfiles (so collectstatic can pick it up)
RUN mkdir -p /app/staticfiles
RUN cp -r /app/frontend/dist/* /app/staticfiles/ || true

# Entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENV DJANGO_SETTINGS_MODULE=Alx_Capstone_project.settings
EXPOSE 8000

CMD ["/app/entrypoint.sh"]
