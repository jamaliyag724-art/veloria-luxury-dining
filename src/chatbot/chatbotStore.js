import { create } from "zustand";
import { reservations } from "./reservationData";
import { orders } from "./orderData";
import { menuCategories, menuItems } from "@/data/menuData";

export const useChatbotStore = create((set, get) => ({
  isOpen: false,
  isTyping: false,

  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria. How may I assist you today?",
      actions: true, // 👈 QUICK ACTION BUTTONS
    },
  ],

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  botReply: (input) => {
    const text = input.toLowerCase().trim();
    set({ isTyping: true });

    setTimeout(() => {
      let reply = "I’m sorry, I didn’t quite understand that.";

      /* =========================
         🎯 QUICK ACTIONS
      ========================= */
      if (text === "view_menu") {
        set((state) => ({
          messages: [
            ...state.messages,
            {
              from: "bot",
              text: "Please choose a menu category.",
              menuCategories: true,
            },
          ],
          isTyping: false,
        }));
        return;
      }

      if (text === "check_reservation") {
        reply = "Please provide your reservation ID (e.g. RV-1024).";
      }

      if (text === "track_order") {
        reply = "Please provide your order ID (e.g. ORD-9001).";
      }

      /* =========================
         🍽️ MENU ENTRY (TEXT)
      ========================= */
      if (text.includes("menu")) {
        set((state) => ({
          messages: [
            ...state.messages,
            {
              from: "bot",
              text: "Here is our curated menu. Please choose a category.",
              menuCategories: true,
            },
          ],
          isTyping: false,
        }));
        return;
      }

      /* =========================
         🍽️ MENU CATEGORY
      ========================= */
      const category = menuCategories.find(
        (c) => c.id.toLowerCase() === text
      );

      if (category) {
        const items = menuItems.filter(
          (item) => item.category === category.id
        );

        reply =
          `Our ${category.name} selection:\n\n` +
          items
            .slice(0, 5)
            .map(
              (i) =>
                `• ${i.name} — ₹${i.price}\n  ${i.description}`
            )
            .join("\n\n");
      }

      /* =========================
         📅 RESERVATION STATUS
      ========================= */
      if (text.includes("reservation")) {
        const match = input.match(/rv-\d+/i);

        if (match) {
          const id = match[0].toUpperCase();
          const r = reservations[id];

          reply = r
            ? `Reservation ${id}: ${r.name}, ${r.guests} guests on ${r.date} at ${r.time}. Status: ${r.status}.`
            : `I couldn’t find a reservation with ID ${id}.`;
        }
      }

      /* =========================
         📦 ORDER TRACKING
      ========================= */
      if (text.includes("order")) {
        const match = input.match(/ord-\d+/i);

        if (match) {
          const id = match[0].toUpperCase();
          const o = orders[id];

          reply = o
            ? `Order ${id}: ${o.items} items. Current status: ${o.status}.`
            : `I couldn’t find an order with ID ${id}.`;
        }
      }

      set((state) => ({
        messages: [...state.messages, { from: "bot", text: reply }],
        isTyping: false,
      }));
    }, 800);
  },
}));
