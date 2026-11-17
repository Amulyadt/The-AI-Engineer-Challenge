"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

// On Vercel, vercel.json rewrites /api/* to the FastAPI service on the same
// domain, so production uses a relative URL. Locally, the backend runs on :8000.
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:8000");

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey — I’m here to help with stress, motivation, habits, and confidence. Tell me what’s on your mind.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = draft.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const userMessage = trimmed;
    setDraft("");
    setError("");
    setMessages((current) => [
      ...current,
      { role: "user", content: userMessage },
      { role: "assistant", content: "Thinking..." },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail ?? "Something went wrong while contacting the coach.");
      }

      setMessages((current) => {
        const next = [...current];
        const lastAssistantIndex = next.map((message) => message.role).lastIndexOf("assistant");
        if (lastAssistantIndex >= 0) {
          next[lastAssistantIndex] = {
            role: "assistant",
            content: data.reply ?? "I’m here with you — let’s keep going.",
          };
        }
        return next;
      });
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to reach the coach right now.";
      setError(message);
      setMessages((current) => {
        const next = [...current];
        const lastAssistantIndex = next.map((message) => message.role).lastIndexOf("assistant");
        if (lastAssistantIndex >= 0) {
          next[lastAssistantIndex] = {
            role: "assistant",
            content: "I hit a snag while responding. Please try again in a moment.",
          };
        }
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6d9ff,_#f3f4f6_42%,_#e2e8f0)] px-4 py-8 text-slate-800">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm">
        <header className="border-b border-slate-200 px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">MindCoach AI</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">Your supportive mental coach</h1>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {isLoading ? "Thinking…" : "Online"}
            </div>
          </div>
        </header>

        <section className="space-y-4 px-6 py-6 sm:px-8">
          <div className="flex min-h-[420px] flex-col gap-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm sm:text-base ${
                  message.role === "user"
                    ? "ml-auto bg-violet-600 text-white"
                    : "bg-white text-slate-700 ring-1 ring-slate-200"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-3">
            <label htmlFor="message" className="sr-only">
              Message the coach
            </label>
            <textarea
              id="message"
              rows={4}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Share what feels heavy, confusing, or motivating today..."
              className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-800 shadow-inner outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-200"
            />

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Connects to {API_BASE}/api/chat
              </p>
              <button
                type="submit"
                disabled={isLoading || !draft.trim()}
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
