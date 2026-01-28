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

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  /* =========================
     SEND MESSAGE
  ========================= */
  const sendMessage = () => {
    if (!input.trim()) return;

    // soft send sound
    const sound = new Audio("/sound/soft-send.mp3");
    sound.volume = 0.12;
    sound.play().catch(() => {});

    addMessage({ from: "user", text: input });
    botReply(input);
    setInput("");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-24 right-6 z-[9999]"
      >
        <div
          className="
            w-[420px] h-[520px]
            rounded-2xl
            bg-white/90 backdrop-blur-2xl
            shadow-[0_40px_120px_rgba(0,0,0,0.25)]
            flex flex-col overflow-hidden
          "
        >
          {/* ================= HEADER ================= */}
          <div className="px-6 py-4 border-b border-black/10 flex justify-between items-center">
            <div className="text-[11px] tracking-[0.3em] text-black/70">
              VELORIA CONCIERGE
            </div>
            <button
              onClick={closeChat}
              className="text-black/40 hover:text-black transition"
            >
              ✕
            </button>
          </div>

          {/* ================= MESSAGES ================= */}
          <div className="flex-1 px-5 py-4 overflow-y-auto text-[14px] leading-relaxed">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.from === "user"
                        ? "bg-[#D4AF37]/20 text-black"
                        : "bg-black/5 text-black"
                    }`}
                  >
                    {msg.text}

                    {/* QUICK ACTION BUTTONS */}
                    {msg.actions && (
                      <div className="flex gap-2 mt-3">
                        {[
                          { label: "Track Order", value: "track_order" },
                          {
                            label: "Check Reservation",
                            value: "check_reservation",
                          },
                        ].map((b) => (
                          <button
                            key={b.value}
                            onClick={() => {
                              addMessage({
                                from: "user",
                                text: b.label,
                              });
                              botReply(b.value);
                            }}
                            className="
                              px-3 py-1 rounded-full
                              text-[11px]
                              border border-black/10
                              bg-white hover:bg-black/5
                              transition
                            "
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="text-xs opacity-60 animate-pulse">
                Concierge is typing…
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ================= INPUT ================= */}
          <div className="px-5 py-4 border-t border-black/10">
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
    </AnimatePresence>
  );
}
