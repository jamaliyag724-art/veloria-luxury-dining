import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import ReservationCTA from "@/components/home/ReservationCTA";
import { useReservations } from "@/context/ReservationContext";

const Reservations: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const { addReservation } = useReservations();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    location: "",
    pincode: "",
    guests: 2,
    date: "",
    time: "",
    specialRequest: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = addReservation(formData);
    setOrderId(id);
    setIsSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🌌 CINEMATIC BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: "url(/reservations-bg.webp)" }}
      />

      {/* Vignette */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

      {/* Fog overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />

      <Navbar onCartClick={() => setIsCartOpen(true)} />

      <main className="relative z-10 pt-32 pb-32">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="section-container max-w-3xl mx-auto"
            >
              {/* Header */}
              <div className="text-center mb-12">
                <span className="text-primary tracking-widest text-xs uppercase">
                  Book a Table
                </span>
                <h1 className="font-serif text-4xl md:text-5xl text-white mt-3">
                  Make a Reservation
                </h1>
                <p className="text-white/70 mt-4">
                  Reserve your seat for an unforgettable dining experience.
                </p>
              </div>

              {/* FORM CARD */}
              <motion.form
                onSubmit={handleSubmit}
                className="backdrop-blur-xl bg-white/90 rounded-[32px] p-10 md:p-12 shadow-[0_30px_120px_rgba(0,0,0,0.35)] space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    ["fullName", "Full Name"],
                    ["email", "Email"],
                    ["mobile", "Mobile Number"],
                    ["location", "City"],
                    ["address", "Address"],
                    ["pincode", "Pincode"],
                  ].map(([name, label]) => (
                    <input
                      key={name}
                      name={name}
                      placeholder={label}
                      required
                      className="luxury-input"
                      onChange={handleChange}
                    />
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <select
                      name="guests"
                      className="luxury-input pl-12"
                      onChange={handleChange}
                      defaultValue={2}
                    >
                      {[1,2,3,4,5,6,7,8].map(n => (
                        <option key={n} value={n}>
                          {n} Guest{n > 1 && "s"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="date"
                      name="date"
                      required
                      className="luxury-input pl-12"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="time"
                      name="time"
                      required
                      className="luxury-input pl-12"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <textarea
                  name="specialRequest"
                  placeholder="Special requests (optional)"
                  rows={3}
                  className="luxury-input"
                  onChange={handleChange}
                />

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="btn-gold w-full py-4 text-lg"
                >
                  Confirm Reservation
                </motion.button>
              </motion.form>
            </motion.div>
          ) : (
            /* ✅ SUCCESS UX */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="section-container max-w-xl mx-auto text-center"
            >
              <div className="backdrop-blur-xl bg-white/90 rounded-[32px] p-12 shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="font-serif text-3xl mb-3">
                  Reservation Confirmed
                </h2>
                <p className="text-muted-foreground mb-6">
                  We look forward to welcoming you.
                </p>
                <div className="glass-card p-6 mb-6">
                  <p className="text-sm text-muted-foreground">
                    Reservation ID
                  </p>
                  <p className="font-serif text-2xl text-primary">
                    {orderId}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="btn-gold px-10"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* CTA */}
      <ReservationCTA />

      <Footer />
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Reservations;
