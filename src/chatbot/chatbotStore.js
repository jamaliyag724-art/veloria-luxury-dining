import { create } from "zustand";

export const useChatbotStore = create((set) => ({
  isOpen: false,

  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria. May I assist you today?"
    }
  ],

  toggleChat: () =>
    set((state) => ({
      isOpen: !state.isOpen
    })),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message]
    })),

  clearMessages: () =>
    set(() => ({
      messages: [
        {
          from: "bot",
          text: "Welcome to Veloria. May I assist you today?"
        }
      ]
    }))
}));
