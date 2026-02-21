import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";

const Reservations = () => {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }

    alert(
      `Reservation Confirmed 🎉\nDate: ${selectedDate}\nTime: ${selectedTime}`
    );
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
          bg-white/10 backdrop-blur-2xl 
          border border-white/20
          rounded-[40px] p-12 
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          <h1 className="font-serif text-4xl text-white text-center mb-10">
            Make a Reservation
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* DATE */}
            <div className="relative">
              <CalendarDays className="absolute left-4 top-4 text-yellow-400 w-4 h-4 opacity-80" />
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="lux-input pl-10"
              />
            </div>

            {/* TIME */}
            <div className="relative">
              <Clock className="absolute left-4 top-4 text-yellow-400 w-4 h-4 opacity-80" />
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={!selectedDate}
                className="lux-input pl-10"
              >
                <option value="">Select Time</option>
                <option>12:00 PM</option>
                <option>1:00 PM</option>
                <option>2:00 PM</option>
                <option>6:00 PM</option>
                <option>7:00 PM</option>
                <option>8:00 PM</option>
                <option>9:00 PM</option>
              </select>
            </div>

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
