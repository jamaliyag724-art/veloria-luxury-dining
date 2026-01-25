import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users, AlertCircle } from "lucide-react";
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
  fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
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
  const [touched, setTouched] =
    useState<Partial<Record<keyof ReservationFormData, boolean>>>({});

  const validateField = (
    field: keyof ReservationFormData,
    value: string | number
  ) => {
    try {
      reservationSchema.shape[field].parse(value);
      setErrors((p) => ({ ...p, [field]: undefined }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((p) => ({ ...p, [field]: err.errors[0].message }));
      }
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const parsed = name === "guests" ? Number(value) : value;
    setFormData({ ...formData, [name]: parsed });

    if (touched[name as keyof ReservationFormData]) {
      validateField(name as keyof ReservationFormData, parsed);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const parsed = name === "guests" ? Number(value) : value;
    setTouched((p) => ({ ...p, [name]: true }));
    validateField(name as keyof ReservationFormData, parsed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = reservationSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Partial<
        Record<keyof ReservationFormData, string>
      > = {};
      result.error.errors.forEach((err) => {
        newErrors[err.path[0] as keyof ReservationFormData] = err.message;
      });
      setErrors(newErrors);
      setTouched({
        fullName: true,
        email: true,
        mobile: true,
        guests: true,
        date: true,
        time: true,
      });
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

  const inputClass = (field: keyof ReservationFormData) =>
    `luxury-input ${
      touched[field] && errors[field]
        ? "border-destructive ring-2 ring-destructive/20"
        : ""
    }`;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🔄 Reservation submit loader */}
      {submitting && <ReservationLoader />}

      {/* 🌄 Background */}
      <img
        src="/reservation-bg.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />

      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="relative z-10 pt-36 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white/95 backdrop-blur-xl rounded-[32px] p-10 shadow-2xl mx-4"
        >
          <div className="text-center mb-10">
            <span className="text-primary uppercase tracking-widest text-sm">
              Book a Table
            </span>
            <h1 className="font-serif text-4xl mt-3">
              Make a Reservation
            </h1>

            <ReservationUrgency />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- form unchanged --- */}
            {/* Tumhara existing form code exactly same rahega */}
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservations;
