import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

export const useChatbotStore = create((set, get) => ({
  isOpen: false,
  isTyping: false,

  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria Concierge. How may I assist you today?",
    },
    {
      from: "bot",
      text: "You can check your reservation or track your order.",
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
    await new Promise((r) => setTimeout(r, 800));

    /* ----------------------------
       RESERVATION FLOW
    ----------------------------- */
    if (text.includes("reservation")) {
      setTyping(false);
      addMessage({
        from: "bot",
        text: "Please enter the phone number used for your reservation.",
      });
      return;
    }

    if (/^\d{10}$/.test(text)) {
      const phone = text;

      const { data, error } = await supabase
        .from("reservations")
        .select(
          "name,people,reservation_date,reservation_time,address,notes"
        )
        .eq("phone", phone)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setTyping(false);

      if (error || !data) {
        addMessage({
          from: "bot",
          text:
            "I couldn't find a reservation with this phone number. Please verify and try again.",
        });
        return;
      }

      addMessage({
        from: "bot",
        text: `Reservation found for ${data.name}.
Date: ${data.reservation_date}
Time: ${data.reservation_time}
Guests: ${data.people}
Location: ${data.address || "Veloria Restaurant"}`,
      });
      return;
    }

    /* ----------------------------
       ORDER TRACKING (if exists)
    ----------------------------- */
    if (text.includes("order")) {
      setTyping(false);
      addMessage({
        from: "bot",
        text:
          "Order tracking is available via the Track Order page from the menu.",
      });
      return;
    }

    /* ----------------------------
       FALLBACK
    ----------------------------- */
    setTyping(false);
    addMessage({
      from: "bot",
      text:
        "I can help you check your reservation. Just type 'reservation'.",
    });
  },
}));
