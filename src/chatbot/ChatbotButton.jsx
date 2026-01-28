import { motion } from "framer-motion";
import { useChatbotStore } from "./chatbotStore";
import ChatbotPortal from "./ChatbotPortal";

export default function ChatbotButton() {
  const toggleChat = useChatbotStore((state) => state.toggleChat);

  return (
    <ChatbotPortal>
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="
          fixed bottom-6 right-6
          z-[999999]
          pointer-events-auto
          w-14 h-14 rounded-full
          bg-[#C6A75E] text-black
          flex items-center justify-center
          shadow-2xl
        "
      >
        ✦
      </motion.button>
    </ChatbotPortal>
  );
}
