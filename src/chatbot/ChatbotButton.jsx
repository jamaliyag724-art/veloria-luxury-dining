export default function ChatbotButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-[9999]
        w-14 h-14 rounded-full
        bg-[#D4AF37]
        text-black
        shadow-[0_10px_40px_rgba(0,0,0,0.25)]
        hover:scale-105 transition
      "
      aria-label="Open concierge"
    >
      ✦
    </button>
  );
}
