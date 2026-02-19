# Mental Coach Frontend

A clean, modern chat interface for the mental coach API.

## Prerequisites

- **Node.js 18+** and npm (they ship together)

**If you see `npm: command not found`**, install Node.js first:

- **macOS (Homebrew):** `brew install node`
- **macOS / Windows:** Download the LTS installer from [nodejs.org](https://nodejs.org), run it, then restart your terminal.

Check that it worked: `node -v` and `npm -v` should print version numbers.

## Running locally

### 1. Start the backend API

From the project root:

```bash
# Create/activate virtualenv and install deps
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run the FastAPI server (default: http://localhost:8000)
uvicorn api.index:app --reload
```

### 2. Start the frontend

```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

The app will be at [http://localhost:3000](http://localhost:3000).

> **Note:** `NEXT_PUBLIC_API_URL` tells the frontend where the API lives. Omit it when the API is served from the same origin (e.g. behind a proxy).

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Production build
- `npm run start` – Run production build locally
- `npm run lint` – Run ESLint
