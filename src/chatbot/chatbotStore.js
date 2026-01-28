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

  startReservation: () => {
    set({
      reservationStep: "date",
      messages: [
        ...get().messages,
        { from: "bot", text: "For which date would you like to reserve?" }
      ]
    });
  },

  handleReservationInput: (input) => {
    const { reservationStep, reservationData } = get();
    let next = null;
    let reply = "";

    if (reservationStep === "date") {
      reservationData.date = input;
      next = "guests";
      reply = "How many guests?";
    } else if (reservationStep === "guests") {
      reservationData.guests = input;
      next = "time";
      reply = "Preferred time?";
    } else {
      reservationData.time = input;
      reply = `Reservation confirmed for ${reservationData.guests} guests on ${reservationData.date} at ${reservationData.time}.`;
    }

    set({
      reservationStep: next,
      reservationData,
      messages: [...get().messages, { from: "bot", text: reply }]
    });
  },

  startStatusCheck: () => {
    set({
      statusMode: true,
      messages: [...get().messages, { from: "bot", text: "Enter reservation ID." }]
    });
  },

  handleStatusInput: (id) => {
    const data = reservations[id];
    const reply = data
      ? `Reservation ${id}: ${data.status}`
      : "Reservation not found.";

    set((s) => ({
      statusMode: false,
      messages: [...s.messages, { from: "bot", text: reply }]
    }));
  },

  botReply: (text) => {
    if (/^rv-/i.test(text)) return get().handleStatusInput(text);
    if (get().reservationStep) return get().handleReservationInput(text);

    set({ isTyping: true });
    setTimeout(() => {
      let reply = "How may I assist you?";
      if (text.includes("reserve")) return get().startReservation();
      if (text.includes("status")) return get().startStatusCheck();

      set((s) => ({
        isTyping: false,
        messages: [...s.messages, { from: "bot", text: reply }]
      }));
    }, 700);
  }
}));
