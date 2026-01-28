import { create } from "zustand";
import { supabase } from "../integrations/supabase/client";

export const useChatbotStore = create((set, get) => ({
  isOpen: false,
  isTyping: false,
  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria. How may I assist you today?"
    }
  ],

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  botReply: async (input) => {
    set({ isTyping: true });

    setTimeout(async () => {
      let reply = "I'm sorry, I didn’t quite understand that.";

      if (input.toLowerCase().includes("track")) {
        reply = "Please provide your order ID (e.g. ORD-9001).";
      }

      set((state) => ({
        messages: [...state.messages, { from: "bot", text: reply }],
        isTyping: false
      }));
    }, 800);
  }
}));
