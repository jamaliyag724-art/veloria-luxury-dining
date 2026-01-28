import { useChatbotStore } from "./chatbotStore";

export default function ChatbotPanel() {
  const isOpen = useChatbotStore((s) => s.isOpen);
  const closeChat = useChatbotStore((s) => s.closeChat);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed bottom-24 right-6 z-[99999]
        w-[360px] h-[480px]
        rounded-2xl
        bg-white/80 backdrop-blur-xl
        shadow-[0_30px_80px_rgba(0,0,0,0.25)]
        flex flex-col
      "
    >
      {/* Header */}
      <div className="px-5 py-4 flex justify-between items-center border-b border-black/5">
        <span className="text-sm tracking-wide text-[#2B2B2B]">
          Veloria Concierge
        </span>
        <button
          onClick={closeChat}
          className="opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </div>

      {/* Message */}
      <div className="flex-1 px-5 py-4 text-sm text-[#3A3A3A] leading-relaxed">
        Welcome to Veloria.  
        <br />
        May I assist you with reservations, menu, or order tracking?
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-black/5">
        <input
          placeholder="Type your request…"
          className="
            w-full rounded-full px-4 py-2 text-sm
            border border-black/10
            focus:outline-none
          "
        />
      </div>
    </div>
  );
}
