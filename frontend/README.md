# MindCoach AI Frontend

This is the Vibe Coding frontend for the AI Engineer Challenge. It talks to the FastAPI backend in the repo and presents a simple, friendly chat experience for a supportive mental coach.

## Run it locally

From the repo root:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

If your backend is running on a different host or port, update the value in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Backend requirement

Start the API from the project root before chatting:

```bash
uv sync
uv run uvicorn api.index:app --reload
```

The frontend sends requests to:

```text
POST /api/chat
GET /api/health
```

## Deploy to Vercel

This app is designed to work well with the repo’s Vercel config. For a full-stack deploy, run from the repo root:

```bash
npx vercel
```

or for production:

```bash
npx vercel --prod
```

The backend and frontend are routed together by the repo-level Vercel config, so the frontend can usually call the backend through the same origin.
