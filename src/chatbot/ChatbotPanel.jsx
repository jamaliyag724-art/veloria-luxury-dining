import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbotStore } from "./chatbotStore";
import ChatbotPortal from "./ChatbotPortal";

export default function ChatbotPanel() {
  const {
    isOpen,
    closeChat,
    messages,
    addMessage,
    botReply,
    isTyping,
  } = useChatbotStore();

  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const send = () => {
    if (!input.trim()) return;
    addMessage({ from: "user", text: input });
    botReply(input);
    setInput("");
  };

  return (
    <ChatbotPortal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          style={{ pointerEvents: "auto" }}
          className="fixed bottom-24 right-6 z-[999999]"
        >
          <div className="w-[360px] h-[520px] bg-white rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">
            {/* HEADER */}
            <div className="px-4 py-3 border-b flex justify-between">
              <span className="text-xs tracking-widest">
                VELORIA CONCIERGE
              </span>
              <button onClick={closeChat}>✕</button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 p-4 overflow-y-auto text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-3 ${
                    m.from === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block px-4 py-2 rounded-xl ${
                      m.from === "user"
                        ? "bg-[#D4AF37]/20"
                        : "bg-black/5"
                    }`}
                  >
                    {m.text}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="text-xs opacity-60">Concierge is typing…</div>
              )}
              <div ref={endRef} />
            </div>

            {/* INPUT */}
            <div className="p-3 border-t">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type your request…"
                className="w-full px-4 py-2 rounded-full border text-sm outline-none"
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </ChatbotPortal>
  );
}
