# The Roarworks

The Roarworks is a coworking and podcast-space website with a React frontend and a FastAPI backend. The backend provides authentication, bookings, workspace offerings, blog posts, team and partner content, and administration APIs.

## Requirements

- Python 3.10 or later
- Node.js and npm
- PowerShell on Windows (commands below use the repository's existing `.venv`)

## Run locally on Windows

### Backend

From the repository root, install the backend dependencies into the workspace virtual environment:

```powershell
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

Start the API from the `backend` directory. Starting there makes the default SQLite database resolve to `backend\roarworks.db`.

```powershell
Set-Location backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

On startup, the API creates any missing database tables and seeds initial demo data. Redis is optional for local development; when it is unavailable, the backend uses an in-memory cache and rate limiter.

Useful backend URLs:

- Health check: <http://127.0.0.1:8000/health>
- Interactive API docs: <http://127.0.0.1:8000/docs>
- OpenAPI schema: <http://127.0.0.1:8000/api/v1/openapi.json>

### Frontend

Open a second PowerShell terminal from the repository root:

```powershell
Set-Location frontend
npm install
npm run dev
```

Vite serves the frontend at <http://localhost:5173> and proxies `/api` requests to the backend at `http://localhost:8000`. To use a different API base URL, set `VITE_API_BASE_URL` in the frontend environment (the default is `/api/v1`).

## Configuration

The backend reads optional environment variables (or values in `backend\.env` when started from the backend directory):

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite+aiosqlite:///./roarworks.db` | SQLAlchemy database connection |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis cache and rate-limit storage |
| `SECRET_KEY` | Development-only key in `backend/app/core/config.py` | JWT signing key |
| `ADMIN_EMAIL` | `info@theroarworks.com` | Notification recipient |

Set a unique `SECRET_KEY` and secure credentials before deploying. Seeded local demo account details are defined in `backend/app/seed.py`; do not use demo credentials in production.

## Tests

Run the backend tests from the repository root:

```powershell
.\.venv\Scripts\python.exe -m pytest backend\tests
```

## Project layout

```text
backend/    FastAPI application, SQLAlchemy models, seed data, and tests
frontend/   React, TypeScript, and Vite application
vercel.json Deployment routing configuration
```
