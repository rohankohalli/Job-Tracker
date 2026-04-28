# AI Job Assistant

A human-in-the-loop job hunting assistant. Track jobs, analyze JDs with AI, score your resume, and draft outreach messages — with you approving every AI-assisted step.

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
npm install
npm run dev            # http://localhost:5173
```

## Environment Variables

See `backend/.env.example` for all required variables.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `GET` | `/api/jobs` | List all jobs (`?status=saved\|applied\|rejected`) |
| `GET` | `/api/jobs/:id` | Get a single job |
| `POST` | `/api/jobs` | Save a new job |
| `PATCH` | `/api/jobs/:id/status` | Update job status |
| `DELETE` | `/api/jobs/:id` | Delete a job |
| `POST` | `/api/jobs/:id/analyze` | Trigger Gemini JD analysis |
| `GET` | `/api/jobs/:id/analysis` | Fetch stored analysis |
| `POST` | `/api/jobs/:id/generate-message` | Generate cold DM / email draft |
| `GET` | `/api/jobs/:id/messages` | List message drafts |
| `PATCH` | `/api/messages/:id/approve` | Approve a message draft |

## Features

1. **Job Tracking** — save jobs, update status (saved → applied → rejected)
2. **JD Analysis** — Gemini extracts skills, requirements, red flags
3. **Resume Scoring** — deterministic keyword match + AI explanation
4. **Message Generator** — cold DM / email drafts
5. **Human-in-the-Loop** — user reviews and approves before any action
