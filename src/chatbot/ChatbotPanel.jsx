import { useState } from "react";
import { useChatbotStore } from "./chatbotStore";

export default function ChatbotPanel() {
  const {
    isOpen,
    closeChat,
    messages,
    addMessage,
    botReply,
    isTyping
  } = useChatbotStore();

  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const sendMessage = () => {
    if (!input.trim()) return;

    addMessage({ from: "user", text: input });
    botReply(input);
    setInput("");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 96,
        right: 24,
        zIndex: 2147483647,
        width: 360,
        height: 500,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        borderRadius: 20,
        boxShadow: "0 40px 100px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div style={{ fontSize: 14, letterSpacing: 0.5 }}>
          Veloria Concierge
        </div>
        <button onClick={closeChat}>✕</button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: 16,
          fontSize: 14,
          overflowY: "auto"
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              textAlign: m.from === "user" ? "right" : "left",
              color: m.from === "user" ? "#9C7A2F" : "#222"
            }}
          >
            {m.text}
          </div>
        ))}

        {isTyping && (
          <div style={{ fontSize: 12, opacity: 0.6 }}>Concierge is typing…</div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your request…"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.15)",
            outline: "none",
            fontSize: 14
          }}
        />
      </div>
    </div>
  );
}
