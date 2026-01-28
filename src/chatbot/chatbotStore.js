import { create } from "zustand";

export const useChatbotStore = create((set, get) => ({
  isOpen: false,
  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria. Concierge online."
    }
  ],

  toggleChat: () => {
    console.log("TOGGLE CLICKED, BEFORE:", get().isOpen);
    set({ isOpen: !get().isOpen });
    console.log("AFTER:", get().isOpen);
  }
}));
