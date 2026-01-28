export default function ChatbotPanel({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="
        fixed bottom-24 right-6 z-[9999]
        w-[360px] h-[480px]
        rounded-2xl
        bg-white/80 backdrop-blur-xl
        shadow-[0_30px_80px_rgba(0,0,0,0.2)]
        flex flex-col
      "
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-black/5 flex justify-between items-center">
        <div className="text-sm font-medium tracking-wide text-[#2B2B2B]">
          Veloria Concierge
        </div>
        <button onClick={onClose} className="text-sm opacity-50 hover:opacity-100">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 px-5 py-4 text-sm text-[#3A3A3A] leading-relaxed">
        <div className="max-w-[85%]">
          Welcome to Veloria.  
          <br />
          May I assist you with a reservation, menu, or order status?
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-black/5">
        <input
          placeholder="Type your request…"
          className="
            w-full rounded-full
            px-4 py-2
            text-sm
            bg-white
            border border-black/10
            focus:outline-none
          "
        />
      </div>
    </div>
  );
}
