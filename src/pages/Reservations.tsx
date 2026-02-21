import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";

const Reservations = () => {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH SLOTS ================= */
  const fetchSlots = async (date: string) => {
    if (!date) return;

    setLoading(true);

    // Get base slot definitions
    const { data: dailySlots } = await supabase
      .from("daily_slots")
      .select("*")
      .order("time_slot", { ascending: true });

    // Get booked data for selected date
    const { data: availability } = await supabase
      .from("table_availability")
      .select("*")
      .eq("date", date);

    const merged =
      dailySlots?.map((slot) => {
        const existing = availability?.find(
          (a) => a.time_slot === slot.time_slot
        );

        return {
          time_slot: slot.time_slot,
          total_tables: slot.total_tables,
          booked_tables: existing?.booked_tables ?? 0,
        };
      }) || [];

    setTimeSlots(merged);
    setSelectedTime("");
    setLoading(false);
  };

  /* ================= BOOK TABLE ================= */
  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }

    setSubmitting(true);

    // Re-check latest availability
    const { data: existing } = await supabase
      .from("table_availability")
      .select("*")
      .eq("date", selectedDate)
      .eq("time_slot", selectedTime)
      .maybeSingle();

    const selectedSlot = timeSlots.find(
      (s) => s.time_slot === selectedTime
    );

    if (!selectedSlot) {
      alert("Invalid slot");
      setSubmitting(false);
      return;
    }

    const currentBooked = existing?.booked_tables ?? 0;

    if (currentBooked >= selectedSlot.total_tables) {
      alert("Slot fully booked");
      setSubmitting(false);
      return;
    }

    if (existing) {
      await supabase
        .from("table_availability")
        .update({
          booked_tables: currentBooked + 1,
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("table_availability").insert({
        date: selectedDate,
        time_slot: selectedTime,
        total_tables: selectedSlot.total_tables,
        booked_tables: 1,
      });
    }

    alert("Reservation Confirmed 🎉");

    await fetchSlots(selectedDate);
    setSubmitting(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/main.webp)" }}
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="relative z-10 pt-36 pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto 
          bg-black/40 backdrop-blur-xl
          border border-yellow-500/20
          rounded-[40px] p-12 shadow-2xl"
        >
          <h1 className="font-serif text-4xl text-center text-white mb-10">
            Make a Reservation
          </h1>

          <form onSubmit={handleReservation} className="space-y-6">

            {/* DATE */}
            <div className="relative">
              <CalendarDays className="absolute left-4 top-4 text-yellow-400 w-4 h-4" />
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  fetchSlots(e.target.value);
                }}
                className="luxury-input pl-10"
              />
            </div>

            {/* TIME */}
            <div className="relative">
              <Clock className="absolute left-4 top-4 text-yellow-400 w-4 h-4" />
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={!selectedDate || loading}
                className="luxury-input pl-10"
              >
                <option value="">
                  {loading ? "Loading..." : "Select Time"}
                </option>

                {timeSlots.map((slot) => {
                  const remaining =
                    slot.total_tables - slot.booked_tables;

                  return (
                    <option
                      key={slot.time_slot}
                      value={slot.time_slot}
                      disabled={remaining <= 0}
                    >
                      {slot.time_slot}{" "}
                      {remaining <= 0
                        ? "❌ Full"
                        : remaining <= 2
                        ? `⚠️ Only ${remaining} left`
                        : `✅ Available`}
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full 
              bg-gradient-to-r from-yellow-500 to-amber-400
              text-black font-semibold 
              hover:scale-105 transition"
            >
              {submitting ? "Processing..." : "Confirm Reservation"}
            </button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservations;
