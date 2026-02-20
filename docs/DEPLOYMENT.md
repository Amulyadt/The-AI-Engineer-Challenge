# How to Deploy Mental Coach

This app has two parts: a **Next.js frontend** (chat UI) and a **FastAPI backend** (API). To have the full app live, deploy both and connect them.

## Option: Two Vercel projects (recommended)

Use one Vercel project for the API and one for the frontend. The **public URL** you share is the frontend project’s URL.

### 1. Deploy the API

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New Project** → Import your repo (`The-AI-Engineer-Challenge`).
3. Leave **Root Directory** as `.` (repo root).
4. **Environment Variables:** Add `OPENAI_API_KEY` with your OpenAI API key (Settings → Environment Variables).
5. Deploy. Vercel will use the existing `vercel.json` and deploy the Python API.
6. Copy the project URL (e.g. `https://your-project-api.vercel.app`). This is your **API URL**.

### 2. Deploy the frontend

1. **Add New Project** again → Import the **same** repo.
2. Set **Root Directory** to `frontend` (so Vercel builds the Next.js app).
3. **Environment Variables:** Add:
   - Name: `NEXT_PUBLIC_API_URL`  
   - Value: the API URL from step 1 (e.g. `https://your-project-api.vercel.app`)  
   No trailing slash.
4. Deploy. Vercel will detect Next.js and run the build.
5. The URL of this project is your **public app URL** — open it to use the Mental Coach chat UI.

### Summary

| What              | URL / setting                                      |
|-------------------|----------------------------------------------------|
| API project       | e.g. `https://your-api.vercel.app`                 |
| Frontend project  | e.g. `https://your-frontend.vercel.app` ← **share this** |
| Env on frontend   | `NEXT_PUBLIC_API_URL` = API project URL             |
| Env on API        | `OPENAI_API_KEY` = your OpenAI key                 |

After the first deploy, new pushes to the repo can trigger automatic deploys for each project (if you enabled that when linking the repo).

## One Vercel project (API only)

If you only deploy with the default setup (repo root and current `vercel.json`), Vercel deploys **only the API**. Visiting that URL will return JSON (e.g. `{"status":"ok"}` at `/`), not the chat UI. The chat UI must be deployed separately (e.g. the frontend project above) for a public link that looks like the app.
