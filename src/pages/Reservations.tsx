import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import { useReservations } from "@/context/ReservationContext";

/* -----------------------------
   VALIDATION
------------------------------ */
const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  guests: z.number().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  specialRequest: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const Reservations: React.FC = () => {
  const navigate = useNavigate();
  const { addReservation } = useReservations();

  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    mobile: "",
    guests: 2,
    date: "",
    time: "",
    specialRequest: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "guests" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        errs[err.path[0]] = err.message;
      });
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const id = await addReservation({
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        guests: form.guests,
        date: form.date,
        time: form.time,
        specialRequest: form.specialRequest,
      });

      navigate(`/reservation-success/${id}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-24">
        
        {/* Background */}
        <img
          src="/reservation-bg.webp"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-3xl 
                     bg-black/85 backdrop-blur-md
                     border border-primary/20
                     rounded-[32px] shadow-2xl p-10 text-white"
        >
          {/* HEADER */}
          <div className="text-center mb-10">
            <span className="text-primary tracking-[0.25em] text-xs uppercase">
              Book a Table
            </span>
            <h1 className="font-serif text-4xl mt-3 mb-2">
              Make a Reservation
            </h1>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name + Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
              <Input label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
            </div>

            {/* Mobile + Guests */}
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} error={errors.mobile} />

              <div>
                <label className="label">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <select
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    className="luxury-input pl-10"
                  >
                    {[1,2,3,4,5,6,8,10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Date</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input
                    type="date"
                    min={today}
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="luxury-input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="label">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="luxury-input pl-10"
                  >
                    <option value="">Select Time</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Request */}
            <textarea
              name="specialRequest"
              placeholder="Special requests (optional)"
              value={form.specialRequest}
              onChange={handleChange}
              className="luxury-input"
            />

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="btn-gold w-full py-4 text-lg"
            >
              {loading ? "Processing..." : "Confirm Reservation"}
            </motion.button>
          </form>

          {/* Track Section */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400 mb-4">
              Already have a Reservation ID?
            </p>

            <button
              type="button"
              onClick={() => navigate("/reservation-status")}
              className="btn-outline-gold px-6 py-3 text-sm"
            >
              Track Reservation
            </button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default Reservations;

/* -----------------------------
   INPUT COMPONENT
------------------------------ */
const Input = ({ label, error, ...props }: any) => (
  <div>
    <label className="label">{label}</label>
    <input {...props} className="luxury-input" />
    {error && (
      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" /> {error}
      </p>
    )}
  </div>
);
