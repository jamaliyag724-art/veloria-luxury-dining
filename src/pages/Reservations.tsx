import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";

/* ---------------- VALIDATION ---------------- */

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(10),
  guests: z.number().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  specialRequest: z.string().optional(),
});

const Reservations: React.FC = () => {
  const navigate = useNavigate();

  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<any[]>([]);

  const [form, setForm] = useState({
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

    const fetchSlots = async () => {
      const { data } = await supabase
        .from("table_availability")
        .select("*")
        .eq("date", form.date)
        .order("time_slot", { ascending: true });

      if (data) setAvailability(data);
    };

    fetchSlots();

    const channel = supabase
      .channel("availability-live")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "table_availability",
        },
        (payload) => {
          setAvailability((prev) =>
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

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse(form);
    if (!result.success) return;

    setLoading(true);

    await supabase.rpc("increment_booking", {
      p_date: form.date,
      p_time: form.time,
    });

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

    if (data) navigate(`/reservation-success/${data.id}`);

    setLoading(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-24">
        
        {/* BACKGROUND IMAGE */}
        <img
          src="/reservation-bg.webp"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />

        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-3xl 
                     bg-white/10 backdrop-blur-2xl 
                     border border-white/20
                     rounded-[32px] shadow-2xl p-10"
        >
          <h1 className="font-serif text-4xl text-white text-center mb-10">
            Make a Reservation
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* BASIC FIELDS */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Full Name"
                className="luxury-input"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />
              <input
                placeholder="Email"
                className="luxury-input"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              <input
                placeholder="Mobile"
                className="luxury-input"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />
              <select
                className="luxury-input"
                value={form.guests}
                onChange={(e) =>
                  setForm({ ...form, guests: Number(e.target.value) })
                }
              >
                {[1,2,3,4,5,6,8,10].map(n => (
                  <option key={n}>{n} Guests</option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <input
              type="date"
              min={today}
              className="luxury-input"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value, time: "" })
              }
            />

            {/* REAL TIME SLOTS */}
            {form.date && (
              <div className="space-y-3">
                {availability.map((slot) => {
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
                      className={`w-full px-5 py-3 rounded-xl border transition text-left
                        ${
                          form.time === slot.time_slot
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-white/20"
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
                            Only {available} left
                          </span>
                        )}

                        {!isFull && !isLimited && (
                          <span className="text-green-400 text-sm">
                            Available ✅
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <textarea
              placeholder="Special requests (optional)"
              className="luxury-input"
              value={form.specialRequest}
              onChange={(e) =>
                setForm({ ...form, specialRequest: e.target.value })
              }
            />

            <button
              disabled={loading || !form.time}
              className="btn-gold w-full py-4 text-lg"
            >
              {loading ? "Processing..." : "Confirm Reservation"}
            </button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default Reservations;
