import { useChatbotStore } from "./chatbotStore";

export default function ChatbotPanel() {
  const { isOpen, closeChat, messages } = useChatbotStore();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 96,
        right: 24,
        zIndex: 2147483647,
        width: 360,
        height: 480,
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
        <button onClick={closeChat} style={{ border: "none", background: "none" }}>
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: 16, fontSize: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}
