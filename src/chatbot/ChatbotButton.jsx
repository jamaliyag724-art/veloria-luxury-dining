import { motion } from "framer-motion";
import { useChatbotStore } from "./chatbotStore";

export default function ChatbotButton() {
  const toggleChat = useChatbotStore((state) => state.toggleChat);

  return (
    <motion.button
      onClick={toggleChat}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-[#C6A75E] text-[#0B0B0B]
        flex items-center justify-center
        shadow-2xl
      "
      aria-label="Open chat"
    >
      ✦
    </motion.button>
  );
}
