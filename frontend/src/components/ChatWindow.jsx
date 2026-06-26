import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";

const QUICK_QUESTIONS = [
  "What are my total sales?",
  "Which customers have unpaid invoices?",
  "Who are my top 3 customers?",
  "What is my GST payable?",
  "Show me sales by month",
  "Which products sell the most?",
];

export function ChatWindow({ messages, loading, onSend }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    onSend(q);
  };

  return (
    <div className="chat-container">
      {/* Quick question chips */}
      <div className="quick-questions">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            className="quick-chip"
            disabled={loading}
            onClick={() => onSend(q)}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message list */}
      <div className="messages-list">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {loading && (
          <div className="typing-indicator">
            <div className="typing-avatar msg-avatar ai">🤖</div>
            <div className="typing-bubble">
              Searching your data…
              <span className="typing-dots">
                <span /><span /><span />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          disabled={loading}
          placeholder="Ask anything — e.g. Who owes me money?"
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          Send ↗
        </button>
      </div>
    </div>
  );
}
