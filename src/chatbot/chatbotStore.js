import { create } from "zustand";
import { reservations } from "./reservationData";
import { orders } from "./orderData";

export const useChatbotStore = create((set, get) => ({
  isOpen: false,
  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria. How may I assist you?",
    },
    {
      from: "bot",
      text: "I can help with reservations, reservation status, menu details, or order tracking.",
    },
  ],
  isTyping: false,

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  botReply: (input) => {
    const text = input.toLowerCase();

    set({ isTyping: true });

    setTimeout(() => {
      let reply = "I’m sorry, I didn’t quite understand that.";

      // 🔍 RESERVATION CHECK
      if (text.includes("reservation")) {
        const match = input.match(/rv-\d+/i);

        if (match) {
          const id = match[0].toUpperCase();
          const r = reservations[id];

          reply = r
            ? `Reservation ${id}: ${r.name}, ${r.guests} guests on ${r.date} at ${r.time}. Status: ${r.status}.`
            : `I couldn’t find a reservation with ID ${id}.`;
        } else {
          reply = "Please provide your reservation ID (e.g. RV-1024).";
        }
      }

      // 🔍 ORDER TRACKING
      if (text.includes("order")) {
        const match = input.match(/ord-\d+/i);

        if (match) {
          const id = match[0].toUpperCase();
          const o = orders[id];

          reply = o
            ? `Order ${id}: ${o.items} items. Current status: ${o.status}.`
            : `I couldn’t find an order with ID ${id}.`;
        } else {
          reply = "Please provide your order ID (e.g. ORD-9001).";
        }
      }

      set((state) => ({
        messages: [...state.messages, { from: "bot", text: reply }],
        isTyping: false,
      }));
    }, 900);
  },
}));
