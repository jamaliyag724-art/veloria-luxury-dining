import { create } from "zustand";
import { reservations } from "./reservationData";
import { orders } from "./orderData";

export const useChatbotStore = create((set, get) => ({
  isOpen: false,
  isTyping: false,

  messages: [
    { from: "bot", text: "Welcome to Veloria. How may I assist you?" }
  ],

  reservationStep: null,
  reservationData: { date: "", guests: "", time: "" },
  statusMode: false,

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] })),

  /* ---------------- RESERVATION FLOW ---------------- */

  startReservation: () => {
    set({
      reservationStep: "date",
      statusMode: false,
      messages: [
        ...get().messages,
        { from: "bot", text: "For which date would you like to reserve a table?" }
      ]
    });
  },

  handleReservationInput: (input) => {
    const state = get();
    const data = { ...state.reservationData };
    let next = null;
    let reply = "";

    if (state.reservationStep === "date") {
      data.date = input;
      next = "guests";
      reply = "How many guests will be joining?";
    } 
    else if (state.reservationStep === "guests") {
      data.guests = input;
      next = "time";
      reply = "What time would you prefer?";
    } 
    else if (state.reservationStep === "time") {
      data.time = input;
      reply = `Thank you. Your reservation for ${data.guests} guests on ${data.date} at ${data.time} has been noted.`;
    }

    set({
      reservationStep: next,
      reservationData: data,
      messages: [...state.messages, { from: "bot", text: reply }]
    });
  },

  /* ---------------- STATUS FLOW ---------------- */

  startStatusCheck: () => {
    set({
      statusMode: true,
      reservationStep: null,
      messages: [
        ...get().messages,
        { from: "bot", text: "Please provide your reservation ID (e.g. RV-1024)." }
      ]
    });
  },

  handleStatusInput: (id) => {
    const data = reservations[id];
    const reply = data
      ? `Reservation ${id}: ${data.status} for ${data.guests} guests on ${data.date} at ${data.time}.`
      : "Sorry, I could not find a reservation with that ID.";

    set({
      statusMode: false,
      messages: [...get().messages, { from: "bot", text: reply }]
    });
  },

  /* ---------------- MAIN BRAIN ---------------- */

  botReply: (rawText) => {
    const text = rawText.toLowerCase().trim();

    // 1️⃣ If currently checking status
    if (get().statusMode) {
      return get().handleStatusInput(rawText);
    }

    // 2️⃣ If reservation flow active
    if (get().reservationStep) {
      return get().handleReservationInput(rawText);
    }

    // 3️⃣ Direct reservation ID
    if (/^rv-\d+/i.test(rawText)) {
      return get().handleStatusInput(rawText);
    }

    set({ isTyping: true });

    setTimeout(() => {
      let reply =
        "I can help with reservations, reservation status, menu details, or order tracking.";

      if (text.includes("reserve") || text.includes("book")) {
        set({ isTyping: false });
        return get().startReservation();
      }

      if (text.includes("status") || text.includes("check")) {
        set({ isTyping: false });
        return get().startStatusCheck();
      }

      if (text.includes("order")) {
        reply = "Please share your order ID to track your order.";
      }

      set((s) => ({
        isTyping: false,
        messages: [...s.messages, { from: "bot", text: reply }]
      }));
    }, 700);
  }
}));
