# Backend — Career Compass AI

Node.js + Express REST API.

## Setup

```bash
cp .env.example .env   # fill in your credentials
npm install
npm run migrate
npm start
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Express server port (default `8000`) |
| `FRONTEND_URL` | Allowed frontend origin for CORS |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL Connection credentials |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Secret keys for JWT authentication |
| `GEMINI_API_KEY` | Google Gemini API key for AI features |
| `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` | Optional Adzuna Job Search API credentials |
| `SERPAPI_KEY` | Optional SerpApi key for job search fallback |

