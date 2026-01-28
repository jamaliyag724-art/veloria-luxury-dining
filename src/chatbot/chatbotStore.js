import { create } from "zustand";

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
    set((state) => ({
      messages: [...state.messages, msg]
    })),

  botReply: (userText) => {
    set({ isTyping: true });

    setTimeout(() => {
      let reply =
        "May I help you with reservations, menu details, or order tracking?";

      const text = userText.toLowerCase();

      if (text.includes("menu")) {
        reply =
          "Our menu features curated European dishes. Would you like vegetarian or chef’s specials?";
      } else if (text.includes("reservation")) {
        reply =
          "I can assist with reservations. Please tell me the date and number of guests.";
      } else if (text.includes("order")) {
        reply =
          "You can track your order by providing the order ID.";
      }

      set((state) => ({
        isTyping: false,
        messages: [...state.messages, { from: "bot", text: reply }]
      }));
    }, 1200); // luxury delay
  }
}));
