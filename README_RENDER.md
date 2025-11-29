# Deploying to Render (Docker)

This project is prepared to deploy to Render using the included `Dockerfile`.
The repository already contains a conditional frontend-build stage and a
`serve_react_index` view so Django will serve the built React SPA from
`STATIC_ROOT`.

Quick steps

1. Push your code (including this `README_RENDER.md` and `.render.yaml`) to
   the `main` branch of your GitHub repository.

2. Open the Render dashboard and click **New** → **Web Service**.
   - Choose the repository and branch `main`.
   - Render will detect the `.render.yaml` manifest and create the resources
     (a Docker web service and a managed Postgres database).

3. In the Render service settings, update the following environment variables
   (either in the service's Environment tab or replace the placeholder values
   from `.render.yaml` with secure values):

   - `SECRET_KEY` — set a secure Django secret key
   - `DEBUG=false`
   - `ALLOWED_HOSTS` — comma-separated hosts or `*` for testing
   - `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_EMAIL`,
     `DJANGO_SUPERUSER_PASSWORD` — to create an admin user on first boot
   - `WAIT_FOR_DB=true` — lets the container wait briefly before running

4. (Optional) If you want Render to build the frontend inside Docker, ensure
   `frontend/package.json` and `frontend/yarn.lock` are present in the repo. If
   you instead commit the built `frontend/dist` directory, the Dockerfile will
   copy the built assets into `staticfiles/`.

5. Trigger a deploy. Render will build the Docker image and run the container.
   The entrypoint runs migrations and `collectstatic` before starting Gunicorn.

Troubleshooting

- Blank page after deploy: open browser DevTools → Console & Network. Ensure
  `index.html` is served from `/` and its referenced assets exist under
  `/static/` or the paths used by `index.html`. If you used absolute `/assets/`
  paths in the build, make sure they map to the static location.
- Database connection issues: check the managed Postgres `DATABASE_URL` in the
  Render dashboard and that the web service has the `DATABASE_URL` env var set
  (Render populates this automatically when linking a database via the
  manifest).

Security notes

- Never commit real secrets into the repository. Use Render's dashboard to set
  environment secrets.
- For production, set `DEBUG=false`.
