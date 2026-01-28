import { useChatbotStore } from "./chatbotStore";

export default function ChatbotButton() {
  const openChat = useChatbotStore((s) => s.openChat);

  return (
    <button
      onClick={openChat}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 2147483647,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#D4AF37",
        color: "#000",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
      }}
      aria-label="Open chat"
    >
      ✦
    </button>
  );
}
