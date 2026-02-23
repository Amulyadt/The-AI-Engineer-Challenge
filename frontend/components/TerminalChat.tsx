"use client";

import { useCallback, useRef, useEffect, useState } from "react";

type Message = { role: "user" | "coach"; content: string };

/** Base URL for the FastAPI backend. Set NEXT_PUBLIC_API_URL in .env.local (e.g. http://localhost:8000). */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * FastAPI can return detail as a string or an array of { msg: string } (e.g. validation errors).
 * Normalize to a single string for display.
 */
function normalizeErrorDetail(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (first && typeof first === "object" && "msg" in first && typeof (first as { msg: unknown }).msg === "string") {
      return (first as { msg: string }).msg;
    }
  }
  return "Something went wrong.";
}

export function TerminalChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(normalizeErrorDetail(data.detail) || `Error ${res.status}`);
        return;
      }

      if (typeof data.reply === "string") {
        setMessages((prev) => [...prev, { role: "coach", content: data.reply }]);
      } else {
        setError("Invalid response from coach.");
      }
    } catch (e) {
      setError(
        API_URL
          ? "Could not reach the coach. Is the FastAPI server running?"
          : "Set NEXT_PUBLIC_API_URL in .env.local (e.g. http://localhost:8000)"
      );
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div
      className="terminal-window"
      style={{
        width: "100%",
        maxWidth: "580px",
        borderRadius: "var(--radius-terminal)",
        overflow: "hidden",
        boxShadow: "var(--shadow-soft), var(--shadow-glow), 0 0 0 1px var(--border-soft)",
        background: "var(--terminal-glass)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid var(--border-soft)",
        display: "flex",
        flexDirection: "column",
        minHeight: "440px",
        maxHeight: "85vh",
        animation: "terminalGlow 5s ease-in-out infinite",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          padding: "14px 18px",
          background: "var(--terminal-bg)",
          borderBottom: "1px solid var(--border-soft)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "var(--accent-rose)",
            boxShadow: "0 0 12px var(--accent-rose)",
          }}
        />
        <span
            style={{
              fontFamily: "var(--font-display), var(--font-nunito), system-ui, sans-serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--accent-gold)",
              letterSpacing: "0.04em",
              animation: "titleShine 3s ease-in-out infinite",
            }}
          >
          Mental Coach Terminal
        </span>
      </div>

      {/* Messages area — scrollable, grows to fit content */}
      <div
        ref={scrollRef}
        className="terminal-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          minHeight: 0,
        }}
      >
        {messages.length === 0 && !loading && !error && (
          <p
            style={{
              color: "var(--terminal-text-muted)",
              fontSize: "0.92rem",
              lineHeight: 1.5,
              marginBottom: "4px",
            }}
          >
            Type a message below and press Enter. Your coach is here to help.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className="message-bubble"
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "90%",
              padding: "12px 16px",
              borderRadius: "var(--radius-inner)",
              background: msg.role === "user" ? "var(--user-bubble)" : "var(--coach-bubble)",
              border:
                msg.role === "coach"
                  ? "1px solid var(--border-soft)"
                  : "1px solid var(--accent-rose-glow)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              boxShadow: msg.role === "user" ? "0 4px 16px rgba(0,0,0,0.2)" : "none",
            }}
          >
            {msg.role === "coach" && (
              <span
                style={{
                  color: "var(--accent-gold)",
                  marginRight: "8px",
                  fontWeight: 700,
                }}
              >
                &gt;{" "}
              </span>
            )}
            {msg.content}
          </div>
        ))}
        {loading && (
          <div
            className="message-bubble"
            style={{
              alignSelf: "flex-start",
              padding: "12px 16px",
              borderRadius: "var(--radius-inner)",
              background: "var(--coach-bubble)",
              border: "1px solid var(--border-soft)",
              color: "var(--terminal-text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--accent-gold)",
                animation: "blink 1s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            Coach is typing…
          </div>
        )}
        {error && (
          <div
            className="message-bubble"
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-inner)",
              background: "rgba(180, 70, 70, 0.2)",
              border: "1px solid rgba(220, 100, 100, 0.4)",
              color: "#f0d0d0",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "14px 18px",
          borderTop: "1px solid var(--border-soft)",
          background: "var(--terminal-bg)",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            autoFocus
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "var(--radius-inner)",
              border: "1px solid var(--border-soft)",
              background: "var(--terminal-surface)",
              color: "var(--terminal-text)",
              fontSize: "0.95rem",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = "0 0 0 2px var(--accent-glow)";
              e.target.style.borderColor = "var(--accent-gold)";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.borderColor = "var(--border-soft)";
            }}
          />
          <button
            type="submit"
            className="btn-send"
            disabled={loading || !input.trim()}
            style={{
              padding: "12px 20px",
              borderRadius: "var(--radius-inner)",
              border: "none",
              background: "var(--accent-gold)",
              color: "var(--terminal-bg)",
              fontWeight: 700,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              opacity: loading || !input.trim() ? 0.6 : 1,
              transition: "transform 0.2s, box-shadow 0.2s, opacity 0.2s",
            }}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
