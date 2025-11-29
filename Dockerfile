# Stage 1 — build frontend (optional). If the repo contains a frontend package.json
# we'll install dependencies and build with Yarn; otherwise skip this step and
# rely on an existing `frontend/dist` in the repo (useful for CI or local builds
# where only the built assets are committed).
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/ .
# Only run install/build when a package.json exists in the frontend directory.
RUN if [ -f package.json ]; then \
			yarn install --frozen-lockfile && yarn build; \
		else \
			echo "No frontend package.json found — skipping frontend build"; \
		fi

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
