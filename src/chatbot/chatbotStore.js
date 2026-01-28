import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export const useChatbotStore = create((set) => ({
  isOpen: false,
  isTyping: false,

  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria. How may I assist you today?",
      actions: true,
    },
  ],

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  botReply: async (input) => {
    const text = input.toLowerCase().trim();
    set({ isTyping: true });

    /* =========================
       🎯 QUICK ACTIONS
    ========================= */
    if (text === "track_order") {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            from: "bot",
            text: "Please provide your Order ID (e.g. ORD-9001).",
          },
        ],
        isTyping: false,
      }));
      return;
    }

    if (text === "check_reservation") {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            from: "bot",
            text: "Please provide your Reservation ID (e.g. RV-1024).",
          },
        ],
        isTyping: false,
      }));
      return;
    }

    /* =========================
       📦 ORDER TRACKING (REAL DB)
    ========================= */
    if (text.startsWith("ord-")) {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", input.toUpperCase())
        .single();

      set((state) => ({
        messages: [
          ...state.messages,
          {
            from: "bot",
            text: error || !data
              ? "I couldn’t find an order with this ID."
              : `Order ${data.id}: ${data.items} items. Current status: ${data.status}.`,
          },
        ],
        isTyping: false,
      }));
      return;
    }

    /* =========================
       📅 RESERVATION TRACKING
    ========================= */
    if (text.startsWith("rv-")) {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("id", input.toUpperCase())
        .single();

      set((state) => ({
        messages: [
          ...state.messages,
          {
            from: "bot",
            text: error || !data
              ? "I couldn’t find a reservation with this ID."
              : `Reservation ${data.id}: ${data.name}, ${data.guests} guests on ${data.date} at ${data.time}. Status: ${data.status}.`,
          },
        ],
        isTyping: false,
      }));
      return;
    }

    /* =========================
       ❓ FALLBACK
    ========================= */
    set((state) => ({
      messages: [
        ...state.messages,
        {
          from: "bot",
          text: "Please choose an option below to continue.",
          actions: true,
        },
      ],
      isTyping: false,
    }));
  },
}));
