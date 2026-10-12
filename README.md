# Career Compass AI

A human-in-the-loop job hunting assistant. Track jobs, analyze JDs with AI and score your resume with you approving every AI-assisted step.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express (ESM, layered architecture)
- **Database**: MySQL
- **AI**: Google Gemini Flash

## Project Structure

```
Project_jobhunt/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── connection.js          # MySQL pool singleton
│   │   │   └── migrations/            # SQL migration files
│   │   ├── routes/                    # HTTP routing only
│   │   ├── controllers/               # req/res handling, input validation
│   │   ├── services/                  # business logic + DB queries + LLM calls
│   │   └── index.js                   # app entry point
│   ├── .env                           # secrets (not committed)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── api/                       # fetch wrappers
    └── package.json
```

## Architecture Rules

- `routes` → `controllers` → `services` (strictly layered)
- No business logic in controllers
- All LLM calls live in services
- Deterministic logic is separate from AI logic

## Setup

### 1. Database

```bash
mysql -u root -p -e "CREATE DATABASE jobhunt;"
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in your credentials
npm install
npm run migrate        # run SQL migrations
npm start              # http://localhost:8000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # set VITE_API_URL
npm install
npm run dev            # http://localhost:5173
```

## Environment Variables

### Backend Environment Variables (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```bash
cd backend
cp .env.example .env
```

| Variable | Required | Default / Example | Description |
| --- | --- | --- | --- |
| `PORT` | No | `8000` | Port for Express API server |
| `FRONTEND_URL` | Yes | `http://localhost:5173` | Allowed CORS origin & cookie domain |
| `DB_HOST` | Yes | `localhost` | MySQL database host |
| `DB_PORT` | No | `3306` | MySQL database port |
| `DB_USER` | Yes | `root` | MySQL database username |
| `DB_PASSWORD` | Yes | `""` | MySQL database password |
| `DB_NAME` | Yes | `jobhunt` | MySQL database name |
| `JWT_ACCESS_SECRET` | Yes | `your_access_token_secret` | Secret key for signing access JWTs |
| `JWT_REFRESH_SECRET` | Yes | `your_refresh_token_secret` | Secret key for signing refresh JWTs |
| `ACCESS_TOKEN_EXPIRES_IN` | No | `15m` | Token expiry duration for access tokens |
| `REFRESH_TOKEN_EXPIRES_IN` | No | `7d` | Token expiry duration for refresh tokens |
| `GEMINI_API_KEY` | Yes | `your_gemini_api_key_here` | Google Gemini API key for JD analysis & AI scoring |
| `ADZUNA_APP_ID` | No | `""` | Adzuna API App ID for job search |
| `ADZUNA_APP_KEY` | No | `""` | Adzuna API Key for job search |
| `SERPAPI_KEY` | No | `""` | SerpApi key for fallback job search |

### Frontend Environment Variables (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```bash
cd frontend
cp .env.example .env
```

| Variable | Required | Default / Example | Description |
| --- | --- | --- | --- |
| `VITE_API_URL` | Yes | `http://localhost:8000/api` | Base URL for backend REST API endpoints |

## Features

1. **Job Tracking** — save jobs, update status (saved → applied → rejected)
2. **JD Analysis** — Gemini extracts skills, requirements, red flags
3. **Resume Scoring** — deterministic keyword match + AI explanation
4. **Human-in-the-Loop** — user reviews and approves before any action

