import { create } from "zustand";

export const useChatbotStore = create((set) => ({
  isOpen: false,
  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria. How may I assist you today?"
    }
  ],

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((s) => ({ isOpen: !s.isOpen }))
}));
