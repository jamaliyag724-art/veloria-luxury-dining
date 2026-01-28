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
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 2147483647,
        pointerEvents: "auto",
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#D4AF37",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)"
      }}
      aria-label="Open concierge"
    >
      ✦
    </motion.button>
  );
}
