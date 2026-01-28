import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbotStore } from "./chatbotStore";

export default function ChatbotPanel() {
  const {
    isOpen,
    closeChat,
    messages,
    addMessage,
    botReply,
    isTyping
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="fixed bottom-24 right-6 z-[999999]"
    >
      <div className="w-[380px] h-[520px] bg-white rounded-2xl shadow-xl flex flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 border-b flex justify-between">
          <span className="text-xs tracking-widest">VELORIA CONCIERGE</span>
          <button onClick={closeChat}>✕</button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-4 overflow-y-auto text-sm">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-3 flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                    m.from === "user"
                      ? "bg-[#D4AF37]/20"
                      : "bg-black/5"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="text-xs opacity-50 mt-1">Concierge is typing…</div>
          )}
          <div ref={endRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 border-t">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type your request…"
            className="w-full px-4 py-2 rounded-full border outline-none"
          />
        </div>
      </div>
    </motion.div>
  );
}
