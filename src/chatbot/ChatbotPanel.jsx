import { useState, useEffect, useRef } from "react";
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
  const messagesEndRef = useRef(null);

  // auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const sendMessage = () => {
    if (!input.trim()) return;

    addMessage({
      from: "user",
      text: input
    });

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
        width: 380,
        height: 520,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(22px)",
        borderRadius: 22,
        boxShadow: "0 40px 120px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "16px 18px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: "0.08em",
            fontWeight: 500,
            color: "#2B2B2B"
          }}
        >
          VELORIA CONCIERGE
        </div>

        <button
          onClick={closeChat}
          style={{
            border: "none",
            background: "transparent",
            fontSize: 16,
            cursor: "pointer",
            opacity: 0.6
          }}
        >
          ✕
        </button>
      </div>

      {/* MESSAGES */}
      <div
        style={{
          flex: 1,
          padding: "18px",
          overflowY: "auto",
          fontSize: 14,
          lineHeight: 1.6,
          color: "#2A2A2A"
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
              marginBottom: 14
            }}
          >
            <div
              style={{
                maxWidth: "78%",
                padding: "10px 14px",
                borderRadius: 16,
                background:
                  msg.from === "user"
                    ? "rgba(212,175,55,0.18)"
                    : "rgba(0,0,0,0.05)",
                color: "#2A2A2A"
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div
            style={{
              fontSize: 12,
              opacity: 0.55,
              marginTop: 6
            }}
          >
            Concierge is typing…
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div
        style={{
          padding: "14px",
          borderTop: "1px solid rgba(0,0,0,0.06)"
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your request…"
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.15)",
            fontSize: 14,
            outline: "none"
          }}
        />
      </div>
    </div>
  );
}
