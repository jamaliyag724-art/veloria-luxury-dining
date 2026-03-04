import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import { useReservations } from "@/context/ReservationContext";

const Reservations = () => {
  const navigate = useNavigate();
  const { addReservation } = useReservations();
  const [cartOpen, setCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    guests: "1",
    date: "",
    time: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      const reservationId = await addReservation({
        fullName: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        guests: parseInt(formData.guests),
        date: formData.date,
        time: formData.time,
        specialRequest: formData.message || undefined,
      });

      toast.success("Reservation submitted successfully!");
      navigate(`/reservation-success/${reservationId}`);
    } catch (err) {
      console.error("Reservation error:", err);
      toast.error("Failed to submit reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name + Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="lux-input"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="lux-input"
                required
              />
            </div>

            {/* Mobile + Guests */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="lux-input"
                required
              />

              <div className="relative">
                <Users className="absolute left-4 top-4 text-yellow-400 w-4 h-4 opacity-70" />
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="lux-input pl-10"
                >
                  {[1,2,3,4,5,6].map(n => (
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="relative">
              <CalendarDays className="absolute left-4 top-4 text-yellow-400 w-4 h-4 opacity-70" />
              <input
                type="date"
                name="date"
                min={today}
                value={formData.date}
                onChange={handleChange}
                className="lux-input pl-10"
                required
              />
            </div>

            {/* Time */}
            <div className="relative">
              <Clock className="absolute left-4 top-4 text-yellow-400 w-4 h-4 opacity-70" />
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="lux-input pl-10 cursor-pointer"
                required
              >
                <option value="">Select Time</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="6:00 PM">6:00 PM</option>
                <option value="7:00 PM">7:00 PM</option>
                <option value="8:00 PM">8:00 PM</option>
                <option value="9:00 PM">9:00 PM</option>
              </select>
            </div>

            {/* Message */}
            <textarea
              name="message"
              placeholder="Special requests (optional)"
              value={formData.message}
              onChange={handleChange}
              className="lux-input min-h-[120px]"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full 
                         bg-gradient-to-r from-yellow-500 to-amber-400
                         text-black font-semibold
                         hover:scale-105 transition-all duration-300
                         disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting ? "Submitting..." : "Confirm Reservation"}
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
