import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export const useChatbotStore = create((set, get) => ({
  isOpen: false,
  isTyping: false,

  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria. How may I assist you today?",
    },
    {
      from: "bot",
      text: "You can say: track my order or check my reservation.",
    },
  ],

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  setTyping: (val) => set({ isTyping: val }),

  botReply: async (input) => {
    const text = input.toLowerCase();
    const { addMessage, setTyping } = get();

    setTyping(true);

    // slight luxury delay
    await new Promise((r) => setTimeout(r, 900));

    /* -------------------------------
       ORDER TRACKING
    -------------------------------- */
    if (text.includes("order")) {
      setTyping(false);
      addMessage({
        from: "bot",
        text: "Please provide your Order ID (e.g. ORD-9001).",
      });
      return;
    }

    if (/^ord-\d+/i.test(text)) {
      const orderId = text.toUpperCase();

      const { data, error } = await supabase
        .from("orders")
        .select("order_id,status,created_at")
        .eq("order_id", orderId)
        .single();

      setTyping(false);

      if (error || !data) {
        addMessage({
          from: "bot",
          text: "I couldn't find an order with that ID. Please verify and try again.",
        });
        return;
      }

      addMessage({
        from: "bot",
        text: `Order ${data.order_id} is currently ${data.status}.`,
      });
      return;
    }

    /* -------------------------------
       RESERVATION TRACKING
    -------------------------------- */
    if (text.includes("reservation")) {
      setTyping(false);
      addMessage({
        from: "bot",
        text: "Please provide your Reservation ID (e.g. RV-1024).",
      });
      return;
    }

    if (/^rv-\d+/i.test(text)) {
      const reservationId = text.toUpperCase();

      const { data, error } = await supabase
        .from("reservations")
        .select("reservation_id,date,time,guests,status")
        .eq("reservation_id", reservationId)
        .single();

      setTyping(false);

      if (error || !data) {
        addMessage({
          from: "bot",
          text:
            "I couldn't locate this reservation. Kindly check the ID and try again.",
        });
        return;
      }

      addMessage({
        from: "bot",
        text: `Reservation ${data.reservation_id} is ${data.status}.
Date: ${data.date}
Time: ${data.time}
Guests: ${data.guests}`,
      });
      return;
    }

    /* -------------------------------
       FALLBACK
    -------------------------------- */
    setTyping(false);
    addMessage({
      from: "bot",
      text:
        "I can help with order tracking or reservation status. Please let me know.",
    });
  },
}));
