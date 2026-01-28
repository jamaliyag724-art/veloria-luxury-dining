import { create } from "zustand";

export const useChatbotStore = create((set, get) => ({
  isOpen: false,
  isTyping: false,

  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria. How may I assist you today?"
    }
  ],

  // reservation flow state
  reservationStep: null, // date | guests | time | confirm
  reservationData: {
    date: "",
    guests: "",
    time: ""
  },

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg]
    })),

  startReservation: () => {
    set({
      reservationStep: "date",
      reservationData: { date: "", guests: "", time: "" },
      messages: [
        ...get().messages,
        { from: "bot", text: "Certainly. For which date would you like to reserve a table?" }
      ]
    });
  },

  handleReservationInput: (input) => {
    const { reservationStep, reservationData } = get();
    let nextStep = null;
    let botText = "";

    if (reservationStep === "date") {
      nextStep = "guests";
      botText = "And how many guests will be joining you?";
      reservationData.date = input;
    }

    if (reservationStep === "guests") {
      nextStep = "time";
      botText = "At what time would you prefer?";
      reservationData.guests = input;
    }

    if (reservationStep === "time") {
      nextStep = "confirm";
      reservationData.time = input;
      botText = `Thank you. Your reservation for ${reservationData.guests} guests on ${reservationData.date} at ${reservationData.time} has been noted.`;
    }

    set({
      reservationStep: nextStep,
      reservationData,
      messages: [...get().messages, { from: "bot", text: botText }]
    });
  },

  botReply: (userText) => {
    const text = userText.toLowerCase();

    // if reservation flow active
    if (get().reservationStep) {
      get().handleReservationInput(userText);
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

      if (text.includes("menu")) {
        reply =
          "Our menu features curated European cuisine. Would you like vegetarian or chef’s specials?";
      }

      if (text.includes("order")) {
        reply =
          "You may track your order by sharing the order ID.";
      }

      set((state) => ({
        isTyping: false,
        messages: [...state.messages, { from: "bot", text: reply }]
      }));
    }, 1000);
  }
}));
