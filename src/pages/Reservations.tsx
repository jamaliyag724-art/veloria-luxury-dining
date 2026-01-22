import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, Users, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = addReservation(formData);
    setOrderId(id);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🌄 BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/reservation-bg.webp)" }}
      />
      <div className="fixed inset-0 bg-black/35" />

      <div className="relative z-20">
        <Navbar onCartClick={() => setIsCartOpen(true)} />

        <main className="pt-36 pb-32">
          <div className="section-container max-w-2xl mx-auto">
            {!isSubmitted ? (
              <>
                {/* HEADER */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <span className="text-primary text-sm tracking-widest uppercase">
                    Book a Table
                  </span>
                  <h1 className="font-serif text-4xl md:text-5xl mt-4 mb-4">
                    Make a Reservation
                  </h1>
                  <p className="text-muted-foreground">
                    Reserve your seat for an unforgettable dining experience.
                  </p>
                </motion.div>

                {/* FORM */}
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onSubmit={handleSubmit}
                  className="bg-background/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl space-y-6"
                >
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
                      <select
                        name="guests"
                        className="luxury-input pl-10"
                        onChange={handleChange}
                        defaultValue="2"
                      >
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <option key={n} value={n}>
                            {n} Guest{n > 1 && "s"}
                          </option>
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
                    placeholder="Special Requests (optional)"
                    rows={3}
                    className="luxury-input"
                    onChange={handleChange}
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-gold w-full py-4"
                  >
                    Confirm Reservation
                  </motion.button>
                </motion.form>
              </>
            ) : (
              /* SUCCESS */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background/90 backdrop-blur-xl rounded-3xl p-10 text-center shadow-2xl"
              >
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="font-serif text-3xl mb-4">
                  Reservation Confirmed
                </h2>
                <p className="text-muted-foreground mb-6">
                  We look forward to welcoming you.
                </p>
                <p className="text-sm text-muted-foreground">Reservation ID</p>
                <p className="font-serif text-2xl text-primary mb-8">
                  {orderId}
                </p>
                <button onClick={() => navigate("/")} className="btn-gold">
                  Back to Home
                </button>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </div>
  );
};

export default Reservations;
