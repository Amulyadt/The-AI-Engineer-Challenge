"use client";

import { useCallback, useRef, useEffect, useState } from "react";

type Message = { role: "user" | "coach"; content: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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
        setError(data.detail || `Error ${res.status}`);
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
          ? "Could not reach the coach. Is the API running?"
          : "Set NEXT_PUBLIC_API_URL in .env.local"
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
        maxWidth: "560px",
        borderRadius: "var(--radius-terminal)",
        overflow: "hidden",
        boxShadow: "var(--shadow-soft), 0 0 0 1px var(--border-soft)",
        background: "var(--terminal-surface)",
        display: "flex",
        flexDirection: "column",
        minHeight: "420px",
        maxHeight: "85vh",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          padding: "12px 16px",
          background: "var(--terminal-bg)",
          borderBottom: "1px solid var(--border-soft)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "var(--accent-rose)",
            boxShadow: "0 0 8px var(--accent-rose)",
          }}
        />
        <span
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--accent-gold)",
            letterSpacing: "0.02em",
          }}
        >
          Mental Coach Terminal
        </span>
      </div>

      {/* Messages area — scrollable, grows to fit content */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          minHeight: 0,
        }}
      >
        {messages.length === 0 && !loading && !error && (
          <p
            style={{
              color: "var(--terminal-text-muted)",
              fontSize: "0.9rem",
              marginBottom: "4px",
            }}
          >
            Type a message below and press Enter. Your coach is here to help.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "90%",
              padding: "10px 14px",
              borderRadius: "var(--radius-inner)",
              background: msg.role === "user" ? "var(--user-bubble)" : "var(--coach-bubble)",
              border:
                msg.role === "coach"
                  ? "1px solid var(--border-soft)"
                  : "1px solid rgba(232, 180, 184, 0.2)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {msg.role === "coach" && (
              <span
                style={{
                  color: "var(--accent-gold)",
                  marginRight: "6px",
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
            style={{
              alignSelf: "flex-start",
              padding: "10px 14px",
              borderRadius: "var(--radius-inner)",
              background: "var(--coach-bubble)",
              border: "1px solid var(--border-soft)",
              color: "var(--terminal-text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent-gold)",
                animation: "blink 1s ease-in-out infinite",
              }}
            />
            Coach is typing…
          </div>
        )}
        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-inner)",
              background: "rgba(200, 80, 80, 0.2)",
              border: "1px solid rgba(200, 80, 80, 0.4)",
              color: "#f0c0c0",
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
          padding: "12px 16px",
          borderTop: "1px solid var(--border-soft)",
          background: "var(--terminal-bg)",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            autoFocus
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "var(--radius-inner)",
              border: "1px solid var(--border-soft)",
              background: "var(--terminal-surface)",
              color: "var(--terminal-text)",
              fontSize: "0.95rem",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = `0 0 0 2px var(--accent-glow)`;
              e.target.style.borderColor = "var(--accent-gold)";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.borderColor = "var(--border-soft)";
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-inner)",
              border: "none",
              background: "var(--accent-gold)",
              color: "var(--terminal-bg)",
              fontWeight: 700,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              opacity: loading || !input.trim() ? 0.6 : 1,
            }}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
