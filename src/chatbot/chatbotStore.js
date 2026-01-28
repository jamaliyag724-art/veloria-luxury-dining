import { create } from "zustand";

export const useChatbotStore = create((set, get) => ({
  isOpen: false,
  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria. How may I assist you today?",
    },
  ],
  isTyping: false,

  openChat: () => {
    console.log("STORE → openChat()");
    set({ isOpen: true });
  },

  closeChat: () => set({ isOpen: false }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  botReply: (input) => {
    set({ isTyping: true });

    setTimeout(() => {
      let reply = "I can help with reservations or order tracking.";

      if (input.toLowerCase().includes("order")) {
        reply = "Please provide your order ID (e.g. ORD-1001).";
      }

      if (input.toLowerCase().includes("reservation")) {
        reply = "Please provide your reservation email or phone number.";
      }

      set((state) => ({
        messages: [...state.messages, { from: "bot", text: reply }],
        isTyping: false,
      }));
    }, 900);
  },
}));
