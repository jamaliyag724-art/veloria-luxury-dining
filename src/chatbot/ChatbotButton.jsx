import { motion } from "framer-motion";
import { useChatbotStore } from "./chatbotStore";

export default function ChatbotButton() {
  const openChat = useChatbotStore((s) => s.openChat);

  return (
    <motion.button
      onClick={openChat}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="
        fixed bottom-6 right-6 z-[9999]
        w-14 h-14 rounded-full
        bg-[#D4AF37]
        text-black
        shadow-[0_20px_50px_rgba(0,0,0,0.35)]
      "
      aria-label="Open concierge"
    >
      ✦
    </motion.button>
  );
}
