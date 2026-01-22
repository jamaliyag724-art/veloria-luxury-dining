import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReservationCTA from "@/components/home/ReservationCTA";
import { useReservations } from "@/context/ReservationContext";

const Reservations: React.FC = () => {
  const navigate = useNavigate();
  const { addReservation } = useReservations();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    address: "",
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
    navigate(`/reservation-success/${id}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/reservation-bg.webp)" }}
      />
      <div className="fixed inset-0 bg-black/55 backdrop-blur-sm" />

      <Navbar />

      <main className="relative z-10 pt-36 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-background/90 backdrop-blur-xl rounded-[32px] shadow-2xl p-10"
        >
          <div className="text-center mb-10">
            <span className="text-primary uppercase tracking-widest text-sm">
              Book a Table
            </span>
            <h1 className="font-serif text-4xl mt-4 mb-2">
              Make a Reservation
            </h1>
            <p className="text-muted-foreground">
              Reserve your seat for an unforgettable dining experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" required className="luxury-input" onChange={handleChange} />
              <input name="email" type="email" placeholder="Email" required className="luxury-input" onChange={handleChange} />
              <input name="mobile" placeholder="Mobile Number" required className="luxury-input" onChange={handleChange} />
              <input name="city" placeholder="City" required className="luxury-input" onChange={handleChange} />
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
                  defaultValue={2}
                >
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n} Guest{n > 1 && "s"}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="date" name="date" required className="luxury-input pl-10" onChange={handleChange} />
              </div>

              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="time" name="time" required className="luxury-input pl-10" onChange={handleChange} />
              </div>
            </div>

            <textarea
              name="specialRequest"
              rows={3}
              placeholder="Special requests (optional)"
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
          </form>
        </motion.div>
      </main>

      {/* CTA */}
      <ReservationCTA />

      <Footer />
    </div>
  );
};

export default Reservations;
