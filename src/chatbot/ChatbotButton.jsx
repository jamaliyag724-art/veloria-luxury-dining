import { useChatbotStore } from "./chatbotStore";

export default function ChatbotButton() {
  const toggleChat = useChatbotStore((s) => s.toggleChat);

  return (
    <button
      onClick={toggleChat}
      className="
        fixed bottom-6 right-6 z-[99999]
        w-14 h-14 rounded-full
        bg-[#D4AF37] text-black
        shadow-[0_12px_40px_rgba(0,0,0,0.3)]
        transition hover:scale-105
      "
      aria-label="Open concierge"
    >
      ✦
    </button>
  );
}
