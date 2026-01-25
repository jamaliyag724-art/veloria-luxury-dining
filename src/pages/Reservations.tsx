import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Users,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import ReservationLoader from "@/components/ui/ReservationLoader";
import ReservationUrgency from "./ReservationUrgency";
import { useReservations } from "@/context/ReservationContext";

/* -----------------------------
   VALIDATION SCHEMA
------------------------------ */
const reservationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  guests: z.number().min(1).max(20),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  specialRequest: z.string().max(500).optional(),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

const Reservations: React.FC = () => {
  const navigate = useNavigate();
  const { addReservation } = useReservations();

  const [cartOpen, setCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ReservationFormData>({
    fullName: "",
    email: "",
    mobile: "",
    guests: 2,
    date: "",
    time: "",
    specialRequest: "",
  });

  const [errors, setErrors] =
    useState<Partial<Record<keyof ReservationFormData, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "guests" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = reservationSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: any = {};
      result.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const id = await addReservation(formData);
      navigate(`/reservation-success/${id}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-background">
      {submitting && <ReservationLoader />}

      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ================= HERO ================= */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        <img
          src="/reservation-bg.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 bg-white/95 backdrop-blur-xl rounded-[32px] px-14 py-12 text-center max-w-2xl mx-4 shadow-2xl"
        >
          <span className="text-primary uppercase tracking-widest text-sm">
            Book a Table
          </span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 mb-6">
            Make a Reservation
          </h1>
          <ReservationUrgency />
        </motion.div>
      </section>

      {/* ================= FORM ================= */}
      <section className="py-24">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-card rounded-[32px] p-10 shadow-xl space-y-6 mx-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name *</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="luxury-input"
              />
              {errors.fullName && (
                <p className="error-text">
                  <AlertCircle /> {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="label">Email *</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="luxury-input"
              />
              {errors.email && (
                <p className="error-text">
                  <AlertCircle /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="label">Mobile *</label>
              <input
                name="mobile"
                maxLength={10}
                value={formData.mobile}
                onChange={handleChange}
                className="luxury-input"
              />
              {errors.mobile && (
                <p className="error-text">
                  <AlertCircle /> {errors.mobile}
                </p>
              )}
            </div>

            <div>
              <label className="label">Guests *</label>
              <div className="relative">
                <Users className="icon-left" />
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="luxury-input pl-10"
                >
                  {[1,2,3,4,5,6,8,10,12,15,20].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Date *</label>
              <div className="relative">
                <CalendarDays className="icon-left" />
                <input
                  type="date"
                  min={today}
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="luxury-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Time *</label>
              <div className="relative">
                <Clock className="icon-left" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="luxury-input pl-10"
                />
              </div>
            </div>
          </div>

          <textarea
            name="specialRequest"
            placeholder="Special requests (optional)"
            value={formData.specialRequest}
            onChange={handleChange}
            className="luxury-input"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={submitting}
            className="btn-gold w-full py-4 text-lg"
          >
            Confirm Reservation
          </motion.button>
        </motion.form>
      </section>

      <Footer />
    </div>
  );
};

export default Reservations;
