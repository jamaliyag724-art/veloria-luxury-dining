import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";

const Reservations: React.FC = () => {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    guests: 1,
    date: "",
    time: "",
    specialRequest: "",
  });

  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  /* ---------------- FETCH TIME SLOTS ---------------- */
  useEffect(() => {
    if (!form.date) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);

      const { data, error } = await supabase
        .from("table_availability")
        .select("*")
        .eq("date", form.date)
        .order("time_slot", { ascending: true });

      if (!error && data) {
        setSlots(data);
      }

      setLoadingSlots(false);
    };

    fetchSlots();
  }, [form.date]);

  /* ---------------- HANDLE SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.time) return alert("Please select time slot");

    const reservationId =
      "RSV-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    await supabase.from("reservations").insert({
      reservation_id: reservationId,
      full_name: form.fullName,
      email: form.email,
      mobile: form.mobile,
      guests: form.guests,
      date: form.date,
      time_slot: form.time,
      special_request: form.specialRequest,
    });

    navigate(`/reservation-success/${reservationId}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/main.webp)" }}
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="relative z-10 pt-36 pb-24 px-4">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto
          bg-white/10 backdrop-blur-2xl
          border border-white/20
          rounded-3xl p-10 shadow-2xl"
        >
          <h1 className="text-4xl font-serif text-center mb-10">
            Make a Reservation
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid md:grid-cols-2 gap-6">

              <input
                placeholder="Full Name"
                required
                className="lux-input"
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email"
                required
                className="lux-input"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                placeholder="Mobile"
                required
                className="lux-input"
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />

              <select
                className="lux-input"
                value={form.guests}
                onChange={(e) =>
                  setForm({ ...form, guests: Number(e.target.value) })
                }
              >
                {[1,2,3,4,5,6].map((g) => (
                  <option key={g} value={g} className="text-black">
                    {g} Guest{g > 1 && "s"}
                  </option>
                ))}
              </select>

              <input
                type="date"
                required
                className="lux-input md:col-span-2"
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />

              <select
                required
                value={form.time}
                className="lux-input md:col-span-2"
                onChange={(e) =>
                  setForm({ ...form, time: e.target.value })
                }
              >
                <option value="" className="text-black">
                  {loadingSlots ? "Loading..." : "Select Time"}
                </option>

                {slots.map((slot) => {
                  const available =
                    slot.total_tables - slot.booked_tables;
                  const isFull = available <= 0;

                  return (
                    <option
                      key={slot.id}
                      value={slot.time_slot}
                      disabled={isFull}
                      className="text-black"
                    >
                      {slot.time_slot} —{" "}
                      {isFull
                        ? "Fully Booked ❌"
                        : available <= 2
                        ? `Only ${available} left ⚠️`
                        : "Available ✅"}
                    </option>
                  );
                })}
              </select>

              <textarea
                placeholder="Special requests (optional)"
                className="lux-input md:col-span-2 h-28 resize-none"
                onChange={(e) =>
                  setForm({
                    ...form,
                    specialRequest: e.target.value,
                  })
                }
              />

            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full
              bg-gradient-to-r from-amber-400 to-yellow-500
              text-black font-semibold text-lg
              hover:scale-[1.02] transition"
            >
              Confirm Reservation
            </button>

          </form>

          <div className="text-center mt-8">
            <p className="text-white/60 text-sm mb-3">
              Already have a Reservation ID?
            </p>

            <button
              onClick={() => navigate("/track-reservation")}
              className="border border-amber-400
              px-6 py-2 rounded-full
              text-amber-400 hover:bg-amber-400 hover:text-black transition"
            >
              Track Reservation
            </button>
          </div>

        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservations;
