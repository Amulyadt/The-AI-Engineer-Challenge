/**
 * Client for the mental coach chat API.
 * Uses NEXT_PUBLIC_API_URL when set (e.g. http://localhost:8000 for local dev).
 */

const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || ""
    : process.env.NEXT_PUBLIC_API_URL || "";

export async function sendMessage(message: string): Promise<string> {
  const url = API_BASE ? `${API_BASE}/api/chat` : "/api/chat";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }

  const data = await res.json();
  return data.reply;
}
