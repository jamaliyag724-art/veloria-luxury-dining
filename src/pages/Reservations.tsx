import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useReservations } from "@/context/ReservationContext";

const Reservations = () => {
  const navigate = useNavigate();
  const { addReservation } = useReservations();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    guests: 2,
    date: "",
    time: "",
    specialRequest: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/reservation-bg.webp)" }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <Navbar />

      <main className="relative z-10 pt-36 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white/90 backdrop-blur-xl rounded-[32px] p-10 shadow-2xl"
        >
          <div className="text-center mb-10">
            <span className="text-primary uppercase tracking-widest text-sm">
              Book a Table
            </span>
            <h1 className="font-serif text-4xl mt-3">
              Make a Reservation
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" required className="luxury-input" onChange={handleChange} />
              <input name="email" type="email" placeholder="Email" required className="luxury-input" onChange={handleChange} />
              <input name="mobile" placeholder="Mobile Number" required className="luxury-input" onChange={handleChange} />
              <input name="city" placeholder="City" required className="luxury-input" onChange={handleChange} />
              <input name="address" placeholder="Address" required className="luxury-input" onChange={handleChange} />
              <input name="pincode" placeholder="Pincode" required className="luxury-input" onChange={handleChange} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Users className="input-icon" />
                <select name="guests" className="luxury-input pl-10" onChange={handleChange}>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n} Guest{n > 1 && "s"}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <CalendarDays className="input-icon" />
                <input type="date" name="date" required className="luxury-input pl-10" onChange={handleChange} />
              </div>
              <div className="relative">
                <Clock className="input-icon" />
                <input type="time" name="time" required className="luxury-input pl-10" onChange={handleChange} />
              </div>
            </div>

            <textarea
              name="specialRequest"
              placeholder="Special requests (optional)"
              className="luxury-input"
              rows={3}
              onChange={handleChange}
            />

            <motion.button
              whileHover={{ scale: 1.03 }}
              className="btn-gold w-full py-4 text-lg"
            >
              Confirm Reservation
            </motion.button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservations;
