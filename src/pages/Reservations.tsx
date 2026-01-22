import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, Users, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import ReservationCTA from "@/components/home/ReservationCTA";
import { useReservations } from "@/context/ReservationContext";
import ReservationSuccess from "@/components/ReservationSuccess";


const Reservations: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reservationId, setReservationId] = useState("");

  const { addReservation } = useReservations();

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
    setReservationId(id);
    setIsSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🌄 Cinematic Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/reservation-bg.webp)" }}
      />

      {/* 🌫 Ambient overlays */}
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      <div className="relative z-10">
        <Navbar onCartClick={() => setIsCartOpen(true)} />

        <main className="pt-32 pb-32">
          <div className="section-container max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6 }}
                  className="bg-background/90 backdrop-blur-xl rounded-3xl p-10 shadow-[0_40px_120px_rgba(0,0,0,0.35)]"
                >
                  {/* Header */}
                  <div className="text-center mb-10">
                    <span className="text-primary text-sm tracking-widest uppercase">
                      Book a Table
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl mt-3 mb-4">
                      Make a Reservation
                    </h1>
                    <p className="text-muted-foreground">
                      Reserve your seat for an unforgettable dining experience.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input name="fullName" placeholder="Full Name" required className="luxury-input" onChange={handleChange} />
                      <input name="email" type="email" placeholder="Email" required className="luxury-input" onChange={handleChange} />
                      <input name="mobile" placeholder="Mobile Number" required className="luxury-input" onChange={handleChange} />
                      <input name="location" placeholder="City" required className="luxury-input" onChange={handleChange} />
                      <input name="address" placeholder="Address" required className="luxury-input" onChange={handleChange} />
                      <input name="pincode" placeholder="Pincode" required className="luxury-input" onChange={handleChange} />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select name="guests" className="luxury-input pl-10" onChange={handleChange}>
                          {[1,2,3,4,5,6,7,8].map(n => (
                            <option key={n} value={n}>{n} Guest{n > 1 && "s"}</option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input name="date" type="date" required className="luxury-input pl-10" onChange={handleChange} />
                      </div>

                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input name="time" type="time" required className="luxury-input pl-10" onChange={handleChange} />
                      </div>
                    </div>

                    <textarea
                      name="specialRequest"
                      rows={3}
                      placeholder="Special requests (optional)"
                      className="luxury-input"
                      onChange={handleChange}
                    />

                    <button type="submit" className="btn-gold w-full py-4 text-lg">
                      Confirm Reservation
                    </button>
                  </form>
                </motion.div>
              ) : (
                <ReservationSuccess reservationId={reservationId} />
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* STEP 2 — Global CTA */}
        <ReservationCTA />

        <Footer />
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </div>
  );
};

export default Reservations;
