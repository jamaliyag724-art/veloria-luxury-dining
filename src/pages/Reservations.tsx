import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";

const Reservations = () => {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  /* ---------------- NEW STATES ---------------- */
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState("");

  /* ---------------- FETCH SLOTS ---------------- */
const fetchSlots = async (date: string) => {
  const { data, error } = await supabase
    .from("table_availability")
    .select("*")
    .eq("date", date) // 🔥 direct use karo
    .order("time_slot", { ascending: true });

  if (error) {
    console.error(error);
    setTimeSlots([]);
    return;
  }

  console.log("Fetched slots:", data); // debug ke liye

  setTimeSlots(data || []);
};
  return (
    <div className="relative min-h-screen overflow-hidden">
      
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/main.webp)" }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="relative z-10 pt-36 pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto 
                     bg-white/10 
                     backdrop-blur-2xl 
                     border border-white/20
                     rounded-[40px] 
                     p-12 
                     shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          <h1 className="font-serif text-4xl text-white text-center mb-10">
            Make a Reservation
          </h1>

          <form className="space-y-6">

            {/* ROW 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              <input placeholder="Full Name" className="lux-input" />
              <input placeholder="Email" className="lux-input" />
            </div>

            {/* ROW 2 */}
            <div className="grid md:grid-cols-2 gap-6">
              <input placeholder="Mobile" className="lux-input" />

              <div className="relative">
                <Users className="absolute left-4 top-4 text-gold w-4 h-4 opacity-70" />
                <select className="lux-input pl-10">
                  {[1,2,3,4,5,6].map(n => (
                    <option key={n}>{n} Guest</option>
                  ))}
                </select>
              </div>
            </div>

           {/* DATE */}
<div className="relative">
  <CalendarDays className="absolute left-4 top-4 text-yellow-400 w-4 h-4 opacity-80" />
  <input
    type="date"
    min={today}
    value={selectedDate}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedDate(value);

      if (value) {
        fetchSlots(value);
      }
    }}
    className="lux-input pl-10 text-white"
  />
</div>

            {/* TIME (NOW DYNAMIC) */}
            <div className="relative">
              <Clock className="absolute left-4 top-4 text-gold w-4 h-4 opacity-70" />
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="lux-input pl-10"
                disabled={!selectedDate}
              >
                <option value="">Select Time</option>

                {timeSlots.length === 0 && selectedDate && (
                  <option disabled>No slots available</option>
                )}

                {timeSlots.map((slot) => {
                  const isFull =
                    slot.booked_tables >= slot.total_tables;

                  return (
                    <option
                      key={slot.id}
                      value={slot.time_slot}
                      disabled={isFull}
                    >
                      {slot.time_slot}
                      {isFull
                        ? " (Full)"
                        : ` (${slot.total_tables - slot.booked_tables} left)`}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* MESSAGE */}
            <textarea
              placeholder="Special requests (optional)"
              className="lux-input min-h-[120px]"
            />

            <button
              type="submit"
              className="w-full py-4 rounded-full 
                         bg-gradient-to-r from-yellow-500 to-amber-400
                         text-black font-semibold
                         hover:scale-105 transition-all duration-300"
            >
              Confirm Reservation
            </button>

            <div className="text-center mt-6">
              <p className="text-white/70 text-sm mb-2">
                Already have a Reservation ID?
              </p>
              <button
                type="button"
                onClick={() => navigate("/reservation-status")}
                className="px-6 py-2 rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
              >
                Track Reservation
              </button>
            </div>

          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservations;
