import { motion, AnimatePresence } from "framer-motion";
import { useChatbotStore } from "./chatbotStore";

export default function ChatbotPanel() {
  const { isOpen, messages } = useChatbotStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="
            fixed bottom-24 right-6
            z-[2147483647]
            pointer-events-auto
            w-[320px] h-[420px]
            rounded-2xl
            bg-black/70 backdrop-blur-xl
            border border-[#C6A75E]/30
            shadow-2xl
            flex flex-col
          "
          style={{ pointerEvents: "auto" }}
        >
          <div className="px-4 py-3 border-b border-[#C6A75E]/20 text-[#C6A75E] text-sm">
            Veloria Concierge
          </div>

          <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto text-sm text-[#F8F5F0]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === "bot" ? "" : "text-right text-[#C6A75E]"}
              >
                {m.text}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
