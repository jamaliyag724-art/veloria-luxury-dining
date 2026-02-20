import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";

/* ---------------- VALIDATION ---------------- */

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

  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slots, setSlots] = useState<any[]>([]);

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    mobile: "",
    guests: 2,
    date: "",
    time: "",
    specialRequest: "",
  });

  /* ---------------- FETCH AVAILABILITY ---------------- */

  useEffect(() => {
    if (!form.date) return;

    const fetchAvailability = async () => {
      setAvailabilityLoading(true);

      const { data } = await supabase
        .from("table_availability")
        .select("*")
        .eq("date", form.date)
        .order("time_slot", { ascending: true });

      if (data) setSlots(data);

      setAvailabilityLoading(false);
    };

    fetchAvailability();

    const channel = supabase
      .channel("availability")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "table_availability",
        },
        (payload) => {
          setSlots((prev) =>
            prev.map((slot) =>
              slot.id === payload.new.id ? payload.new : slot
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [form.date]);

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "guests" ? Number(value) : value });
  };

  /* ---------------- HANDLE SUBMIT ---------------- */

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

    setErrors({});
    setLoading(true);

    const selectedSlot = slots.find(
      (s) => s.time_slot === form.time
    );

    if (
      !selectedSlot ||
      selectedSlot.total_tables - selectedSlot.booked_tables <= 0
    ) {
      setLoading(false);
      return;
    }

    /* increment booking */
    await supabase.rpc("increment_booking", {
      p_date: form.date,
      p_time: form.time,
    });

    /* insert reservation */
    const { data } = await supabase
      .from("reservations")
      .insert({
        full_name: form.fullName,
        email: form.email,
        mobile: form.mobile,
        guests: form.guests,
        date: form.date,
        time_slot: form.time,
        special_request: form.specialRequest,
      })
      .select()
      .single();

    if (data) {
      navigate(`/reservation-success/${data.id}`);
    }

    setLoading(false);
  };

  const today = new Date().toISOString().split("T")[0];

  const selectedSlot = slots.find((s) => s.time_slot === form.time);
  const isSelectedFull =
    selectedSlot &&
    selectedSlot.total_tables - selectedSlot.booked_tables <= 0;

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-24">
        <div className="absolute inset-0 bg-black/80" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-3xl glass-card rounded-[32px] shadow-2xl p-10"
        >
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl text-white">
              Make a Reservation
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
              <Input label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
              <Input label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} error={errors.mobile} />

              <div>
                <label className="label text-white">Guests</label>
                <select
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  className="luxury-input"
                >
                  {[1,2,3,4,5,6,8,10].map(n => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label text-white">Date</label>
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

            {/* DYNAMIC TIME SLOTS */}
            <div>
              <label className="label text-white">Time</label>

              {availabilityLoading && (
                <p className="text-sm text-gray-400">Checking availability...</p>
              )}

              <div className="space-y-2 mt-2">
                {slots.map((slot) => {
                  const available =
                    slot.total_tables - slot.booked_tables;

                  const isFull = available <= 0;
                  const isLimited = available > 0 && available <= 2;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isFull}
                      onClick={() =>
                        setForm({ ...form, time: slot.time_slot })
                      }
                      className={`w-full text-left px-4 py-3 rounded-xl border transition
                        ${
                          form.time === slot.time_slot
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-gray-700"
                        }
                        ${isFull ? "opacity-40 cursor-not-allowed" : ""}
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white">
                          {slot.time_slot}
                        </span>

                        {isFull && (
                          <span className="text-red-500 text-sm">
                            Fully Booked ❌
                          </span>
                        )}

                        {isLimited && (
                          <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs animate-pulse">
                            Only {available} tables left
                          </span>
                        )}

                        {!isFull && !isLimited && (
                          <span className="text-green-500 text-sm">
                            Available ✅
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
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
              disabled={loading || isSelectedFull}
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

/* INPUT COMPONENT */

const Input = ({ label, error, ...props }: any) => (
  <div>
    <label className="label text-white">{label}</label>
    <input {...props} className="luxury-input" />
    {error && (
      <p className="text-red-500 text-sm flex items-center gap-1">
        <AlertCircle className="w-4 h-4" /> {error}
      </p>
    )}
  </div>
);
