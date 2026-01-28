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
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            zIndex: 2147483647,
          }}
        >
          <div className="w-[380px] h-[520px] rounded-2xl bg-white/90 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.25)] flex flex-col">
            {/* HEADER */}
            <div className="px-5 py-4 border-b flex justify-between">
              <div className="text-xs tracking-[0.3em] text-black/70">
                VELORIA CONCIERGE
              </div>
              <button onClick={closeChat}>✕</button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 px-4 py-4 overflow-y-auto text-sm">
              {messages.map((msg, i) => (
                <div key={i} className="mb-3">
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[78%] ${
                      msg.from === "user"
                        ? "ml-auto bg-[#D4AF37]/20"
                        : "bg-black/5"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* 🎯 QUICK ACTION BUTTONS */}
                  {msg.actions && (
                    <div className="flex gap-2 mt-3">
                      {[
                        { label: "View Menu", value: "view_menu" },
                        { label: "Check Reservation", value: "check_reservation" },
                        { label: "Track Order", value: "track_order" },
                      ].map((b) => (
                        <button
                          key={b.value}
                          onClick={() => {
                            addMessage({ from: "user", text: b.label });
                            botReply(b.value);
                          }}
                          className="px-4 py-1 rounded-full text-xs bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30"
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 🍽️ MENU CATEGORIES */}
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
                          className="px-3 py-1 rounded-full text-xs bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30"
                        >
                          {c.replace("-", " ").toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="text-xs opacity-60 animate-pulse">
                  Concierge is typing…
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="px-4 py-3 border-t">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your request…"
                className="w-full px-4 py-2 rounded-full border text-sm"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
