import { motion } from "framer-motion";
import { useChatbotStore } from "./chatbotStore";

export default function ChatbotButton() {
  const openChat = useChatbotStore((s) => s.openChat);

  return (
    <motion.button
      onClick={() => {
        console.log("CHATBOT CLICKED"); // 👈 DEBUG
        openChat();
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 2147483647,
        pointerEvents: "auto",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "#D4AF37",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)"
      }}
    >
      ✦
    </motion.button>
  );
}
