import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { useRouteLoader } from "@/context/RouteLoaderContext"; // ✅ ADD

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import { useReservations } from "@/context/ReservationContext";

/* -----------------------------
   VALIDATION
------------------------------ */
const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  guests: z.number().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  specialRequest: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const Reservations: React.FC = () => {
  /* ---------------------------------------
     🍽️ ROUTE LOADER
  ---------------------------------------- */
  const { setLoader } = useRouteLoader();

  useEffect(() => {
    setLoader("reservation"); // 🍽️ PLATE LOADER

    const t = setTimeout(() => {
      setLoader("default");
    }, 1400);

    return () => clearTimeout(t);
  }, [setLoader]);

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
      result.error.errors.forEach((e) => {
        errs[e.path[0]] = e.message;
      });
      setErrors(errs);
      return;
    }

    setLoading(true);
    const id = await addReservation(form);
    navigate(`/reservation-success/${id}`);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ================= BACKGROUND ================= */}
      <main className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-24">
        {/* Image */}
        <img
          src="/reservation-bg.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        {/* ================= CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-3xl 
                     bg-white/95 backdrop-blur-xl
                     rounded-[32px] shadow-2xl p-10"
        >
          {/* HEADER */}
          <div className="text-center mb-10">
            <span className="text-primary tracking-[0.25em] text-xs uppercase">
              Book a Table
            </span>

            <h1 className="font-serif text-4xl mt-3 mb-2">
              Make a Reservation
            </h1>

            <div className="inline-flex items-center gap-2 mt-2 px-4 py-1.5
                            rounded-full bg-primary/10 text-primary text-sm">
              Only <strong>2 tables</strong> remaining for this evening
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
              <Input label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
              <Input label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} error={errors.mobile} />

              <div>
                <label className="label">Guests</label>
                <div className="relative">
                  <Users className="icon-left" />
                  <select
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    className="luxury-input pl-10"
                  >
                    {[1,2,3,4,5,6,8,10].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Date</label>
                <div className="relative">
                  <CalendarDays className="icon-left" />
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
                  <Clock className="icon-left" />
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="luxury-input pl-10"
                  />
                </div>
              </div>
            </div>

            <textarea
              name="specialRequest"
              placeholder="Special requests (optional)"
              value={form.specialRequest}
              onChange={handleChange}
              className="luxury-input"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="btn-gold w-full py-4 text-lg"
            >
              {loading ? "Processing..." : "Confirm Reservation"}
            </motion.button>
          </form>
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
      <p className="error-text">
        <AlertCircle /> {error}
      </p>
    )}
  </div>
);
