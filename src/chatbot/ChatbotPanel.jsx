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

  const sendMessage = () => {
    if (!input.trim()) return;

    const sound = new Audio("/sounds/soft-send.mp3");
    sound.volume = 0.12;
    sound.play().catch(() => {});

    addMessage({ from: "user", text: input });
    botReply(input);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-24 right-6 z-[2147483647]"
        >
          <div className="w-[380px] h-[520px] rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden">

            {/* HEADER */}
            <div className="px-5 py-4 border-b flex justify-between">
              <span className="text-xs tracking-widest">VELORIA CONCIERGE</span>
              <button onClick={closeChat}>✕</button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 px-4 py-4 overflow-y-auto text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
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
                </div>
              ))}

              {isTyping && (
                <div className="text-xs opacity-60">Concierge is typing…</div>
              )}

              <div ref={endRef} />
            </div>

            {/* INPUT */}
            <div className="px-4 py-3 border-t">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your request…"
                className="w-full px-4 py-2 rounded-full border text-sm outline-none"
              />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
