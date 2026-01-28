import { create } from "zustand";

export const useChatbotStore = create((set) => ({
  isOpen: false,

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),
}));
