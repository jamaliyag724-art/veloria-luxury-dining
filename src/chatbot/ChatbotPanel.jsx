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
    isTyping,
  } = useChatbotStore();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const sound = new Audio("/sound/soft-send.mp3");
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
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            zIndex: 2147483647,
            pointerEvents: "auto",
          }}
        >
          <div
            className="
              w-[380px] h-[520px]
              rounded-2xl
              bg-white/90 backdrop-blur-2xl
              shadow-[0_40px_120px_rgba(0,0,0,0.25)]
              flex flex-col overflow-hidden
            "
          >
            {/* HEADER */}
            <div className="px-5 py-4 border-b border-black/5 flex justify-between items-center">
              <div className="text-[11px] tracking-[0.25em] text-black/70">
                VELORIA CONCIERGE
              </div>
              <button
                onClick={closeChat}
                className="opacity-50 hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 px-4 py-4 overflow-y-auto text-[14px] leading-relaxed">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex mb-3 ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[78%]">
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        msg.from === "user"
                          ? "bg-[#D4AF37]/20 text-black"
                          : "bg-black/5 text-black"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* 🍽️ MENU CATEGORY BUTTONS */}
                    {msg.menuCategories && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {[
                          "starters",
                          "brunch",
                          "lunch",
                          "main-course",
                          "desserts",
                          "wine-beverages",
                        ].map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              addMessage({ from: "user", text: c });
                              botReply(c);
                            }}
                            className="
                              px-4 py-1 rounded-full text-xs
                              bg-[#D4AF37]/20
                              hover:bg-[#D4AF37]/30
                              transition
                            "
                          >
                            {c.replace("-", " ").toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="text-xs opacity-60 mt-2 animate-pulse">
                  Concierge is typing…
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="px-4 py-3 border-t border-black/5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your request…"
                className="
                  w-full px-4 py-2
                  rounded-full
                  border border-black/15
                  text-sm outline-none
                  focus:ring-1 focus:ring-black/20
                "
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
