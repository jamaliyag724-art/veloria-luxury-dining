import { motion, AnimatePresence } from "framer-motion";
import { useChatbotStore } from "./chatbotStore";

export default function ChatbotPanel() {
  const { isOpen, messages } = useChatbotStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="
            fixed bottom-24 right-6 z-50
            w-[320px] h-[420px]
            rounded-2xl
            bg-black/60 backdrop-blur-xl
            border border-[#C6A75E]/30
            shadow-2xl
            flex flex-col
          "
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#C6A75E]/20">
            <p className="text-[#C6A75E] text-sm tracking-wide">
              Veloria Concierge
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.from === "bot"
                    ? "text-[#F8F5F0]"
                    : "text-[#C6A75E] text-right"
                }
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[#C6A75E]/20 text-xs text-[#9A9A9A]">
            A private dining experience
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
