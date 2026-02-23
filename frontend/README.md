# Mental Coach Terminal — Front End

A **Disney-style terminal** UI for chatting with your mental coach. Rounded corners, warm colors, and a friendly vibe—with clear contrast so nothing gets lost on the screen.

## Run it locally

1. **Install dependencies** (from the `frontend` folder):
   ```bash
   cd frontend
   npm install
   ```

2. **Point the UI at your API**  
   Copy the example env file and set your backend URL:
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and set `NEXT_PUBLIC_API_URL` to where your API runs (e.g. `http://localhost:8000` if you're running the FastAPI backend locally).

3. **Start the dev server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser. Make sure your Mental Coach API is running (e.g. on port 8000) so the chat can talk to it.

## Deploy on Vercel

- Push the repo and import the project in Vercel (use the repo root; Vercel can be set to use the `frontend` directory as the root, or you can keep the app at repo root and adjust paths).
- Set the env var `NEXT_PUBLIC_API_URL` to your deployed API URL.
- Deploy; the app is built with `next build` and runs with `next start`.

## Tech

- **Next.js 14** (App Router), ready for Vercel and local dev.
- **TypeScript** for type-safe components.
- Chat hits `POST /api/chat` with `{ "message": "..." }` and displays the `reply` from your backend.

Have fun chatting with your coach.
