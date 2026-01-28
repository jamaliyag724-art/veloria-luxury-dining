import { create } from "zustand";
import { reservations } from "./reservationData";

export const useChatbotStore = create((set, get) => ({
  isOpen: false,
  isTyping: false,

  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria. How may I assist you today?"
    }
  ],

  // Reservation booking flow
  reservationStep: null,
  reservationData: {
    date: "",
    guests: "",
    time: ""
  },

  // Reservation status flow
  statusMode: false,

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg]
    })),

  // ---------- BOOKING FLOW ----------
  startReservation: () => {
    set({
      reservationStep: "date",
      reservationData: { date: "", guests: "", time: "" },
      messages: [
        ...get().messages,
        {
          from: "bot",
          text: "Certainly. For which date would you like to reserve a table?"
        }
      ]
    });
  },

  handleReservationInput: (input) => {
    const { reservationStep, reservationData } = get();
    let nextStep = null;
    let botText = "";

    if (reservationStep === "date") {
      reservationData.date = input;
      nextStep = "guests";
      botText = "And how many guests will be joining you?";
    } else if (reservationStep === "guests") {
      reservationData.guests = input;
      nextStep = "time";
      botText = "At what time would you prefer?";
    } else if (reservationStep === "time") {
      reservationData.time = input;
      nextStep = null;
      botText = `Thank you. Your reservation for ${reservationData.guests} guests on ${reservationData.date} at ${reservationData.time} has been noted.`;
    }

    set({
      reservationStep: nextStep,
      reservationData,
      messages: [...get().messages, { from: "bot", text: botText }]
    });
  },

  // ---------- STATUS FLOW ----------
  startStatusCheck: () => {
    set({
      statusMode: true,
      messages: [
        ...get().messages,
        {
          from: "bot",
          text: "Please provide your reservation ID (e.g., RV-1024)."
        }
      ]
    });
  },

  handleStatusInput: (input) => {
    const data = reservations[input.toUpperCase()];

    let reply;
    if (!data) {
      reply =
        "I’m unable to locate a reservation with that ID. Please verify and try again.";
    } else {
      reply = `Your reservation for ${data.guests} guests on ${data.date} at ${data.time} is currently ${data.status}.`;
    }

    set((state) => ({
      statusMode: false,
      messages: [...state.messages, { from: "bot", text: reply }]
    }));
  },

  // ---------- MAIN BOT LOGIC ----------
  botReply: (userText) => {
    const text = userText.toLowerCase();

    // Active booking flow
    if (get().reservationStep) {
      get().handleReservationInput(userText);
      return;
    }

    // Active status flow
    if (get().statusMode) {
      get().handleStatusInput(userText);
      return;
    }

    set({ isTyping: true });

    setTimeout(() => {
      let reply =
        "May I assist you with reservations, menu details, or order tracking?";

      if (text.includes("reservation") || text.includes("book")) {
        get().startReservation();
        set({ isTyping: false });
        return;
      }

      if (text.includes("status") || text.includes("check")) {
        get().startStatusCheck();
        set({ isTyping: false });
        return;
      }

      if (text.includes("menu")) {
        reply =
          "Our menu features curated European cuisine. Would you like vegetarian or chef’s specials?";
      }

      if (text.includes("order")) {
        reply =
          "Please share your order ID to track your order status.";
      }

      set((state) => ({
        isTyping: false,
        messages: [...state.messages, { from: "bot", text: reply }]
      }));
    }, 1000);
  }
}));
