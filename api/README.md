# OpenAI Chat API Backend

This is a FastAPI-based backend service that provides a chat interface using OpenAI's API. The service acts as a supportive mental coach, helping users with stress, motivation, habits, and confidence.

## Prerequisites

- Python 3.10+
- An OpenAI API key (set as `OPENAI_API_KEY` when you run the server)

**Optional:** [`uv`](https://github.com/astral-sh/uv) package manager (`pip install uv`) can provision Python and install dependencies; otherwise use `pip` and a virtual environment.

## Setup

All commands below assume you are running them from the **repository root**.

**Option A – using `uv`:**

```bash
uv sync
source .venv/bin/activate  # Windows: .venv\Scripts\activate
```

**Option B – using pip and venv:**

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Running the Server

With your virtual environment activated:

```bash
uvicorn api.index:app --reload
```

Or with `uv` (from repo root, no need to activate):

```bash
uv run uvicorn api.index:app --reload
```

The app runs at **http://localhost:8000** with auto-reload for development.

**Setting `OPENAI_API_KEY`:** The chat endpoint requires an OpenAI API key. Use either:

- **Environment variable:** `export OPENAI_API_KEY=sk-your-key-here`
- **`.env` file:** In the repo root, create a `.env` file with `OPENAI_API_KEY=sk-your-key-here` (the API loads it when `python-dotenv` is installed). Do not commit `.env`.

Without the key, `GET /` still returns `{"status":"ok"}`, but `POST /api/chat` will return 500 with "OPENAI_API_KEY not configured".

**If you see "Address already in use":** Something is already using port 8000. Free it or use another port:

```bash
lsof -ti :8000 | xargs kill -9
# then run uvicorn again
```

Or run on a different port: `uvicorn api.index:app --reload --port 8001` (and point the frontend at `http://localhost:8001`).

## API Endpoints

### Chat Endpoint
- **URL**: `/api/chat`
- **Method**: POST
- **Request Body**:
```json
{
    "message": "string"
}
```
- **Response**: JSON object with the AI's reply:
```json
{
    "reply": "string"
}
```

The chat endpoint uses OpenAI's `gpt-3.5-turbo` model with a supportive mental coach system prompt.

### Root / health
- **URL**: `/`
- **Method**: GET
- **Response**: `{"status": "ok"}` — use this to confirm the server is running.

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## CORS Configuration

The API is configured to accept requests from any origin (`*`). This can be modified in the `index.py` file if you need to restrict access to specific domains.

## Error Handling

The API includes basic error handling for:
- Invalid API keys
- OpenAI API errors
- General server errors

All errors will return a 500 status code with an error message.

## Testing the API

Once your server is running, you can test the chat endpoint using curl:

```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

You should receive a JSON response with the AI's reply:

```json
{
  "reply": "Hi! It's good to hear from you. What's on your mind today?..."
}
```

You can confirm the server is up with:

```bash
curl http://127.0.0.1:8000/
# Expect: {"status":"ok"}
```