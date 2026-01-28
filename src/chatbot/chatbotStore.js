import { create } from "zustand";
import { reservations } from "./reservationData";
import { orders } from "./orderData";

export const useChatbotStore = create((set, get) => ({
  /* ---------------- UI STATE ---------------- */
  isOpen: false,
  isTyping: false,

  messages: [
    {
      from: "bot",
      text: "Welcome to Veloria. How may I assist you today?"
    }
  ],

  /* ---------------- BOOKING FLOW ---------------- */
  reservationStep: null,
  reservationData: {
    date: "",
    guests: "",
    time: ""
  },

  /* ---------------- STATUS MODES ---------------- */
  statusMode: false,
  orderMode: false,

  /* ---------------- BASIC ACTIONS ---------------- */
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg]
    })),

  /* =================================================
     RESERVATION BOOKING
  ================================================= */
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

  /* =================================================
     RESERVATION STATUS
  ================================================= */
  startStatusCheck: () => {
    set({
      statusMode: true,
      orderMode: false,
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
    const id = input.trim().toUpperCase();
    const data = reservations[id];

    const reply = data
      ? `Your reservation for ${data.guests} guests on ${data.date} at ${data.time} is currently ${data.status}.`
      : "I’m unable to locate a reservation with that ID. Please verify and try again.";

    set((state) => ({
      statusMode: false,
      messages: [...state.messages, { from: "bot", text: reply }]
    }));
  },

  /* =================================================
     ORDER TRACKING
  ================================================= */
  startOrderTracking: () => {
    set({
      orderMode: true,
      statusMode: false,
      messages: [
        ...get().messages,
        {
          from: "bot",
          text: "Please provide your order ID (e.g., OD-7781)."
        }
      ]
    });
  },

  handleOrderInput: (input) => {
    const id = input.trim().toUpperCase();
    const data = orders[id];

    const reply = data
      ? `Your order #${id} (${data.items}) is currently ${data.status}.`
      : "I’m unable to locate an order with that ID. Please verify and try again.";

    set((state) => ({
      orderMode: false,
      messages: [...state.messages, { from: "bot", text: reply }]
    }));
  },

  /* =================================================
     MAIN INTELLIGENCE (PRIORITY SAFE)
  ================================================= */
  botReply: (userText) => {
    const raw = userText.trim();
    const text = raw.toLowerCase();

    /* 1️⃣ Direct IDs */
    if (/^rv-\d+/i.test(raw)) {
      get().handleStatusInput(raw);
      return;
    }

    if (/^od-\d+/i.test(raw)) {
      get().handleOrderInput(raw);
      return;
    }

    /* 2️⃣ Active flows */
    if (get().reservationStep) {
      get().handleReservationInput(raw);
      return;
    }

    if (get().statusMode) {
      get().handleStatusInput(raw);
      return;
    }

    if (get().orderMode) {
      get().handleOrderInput(raw);
      return;
    }

    set({ isTyping: true });

    setTimeout(() => {
      /* 3️⃣ Intent detection */
      if (text.includes("check") && text.includes("reservation")) {
        get().startStatusCheck();
        set({ isTyping: false });
        return;
      }

      if (text.includes("order")) {
        get().startOrderTracking();
        set({ isTyping: false });
        return;
      }

      if (text.includes("book") || text.includes("reserve")) {
        get().startReservation();
        set({ isTyping: false });
        return;
      }

      if (text.includes("menu")) {
        set((state) => ({
          isTyping: false,
          messages: [
            ...state.messages,
            {
              from: "bot",
              text:
                "Our menu features curated European cuisine. Would you like vegetarian or chef’s specials?"
            }
          ]
        }));
        return;
      }

      /* 4️⃣ Fallback */
      set((state) => ({
        isTyping: false,
        messages: [
          ...state.messages,
          {
            from: "bot",
            text:
              "I can assist with reservations, reservation status, order tracking, or menu details."
          }
        ]
      }));
    }, 900);
  }
}));
