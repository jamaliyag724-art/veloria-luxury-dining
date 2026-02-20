import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import { supabase } from "@/integrations/supabase/client";

const Reservations: React.FC = () => {
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

  /* ================= FETCH AVAILABLE TIME SLOTS ================= */
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

  /* ================= REALTIME UPDATE ================= */
  useEffect(() => {
    const channel = supabase
      .channel("availability-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "table_availability",
        },
        () => {
          if (form.date) {
            supabase
              .from("table_availability")
              .select("*")
              .eq("date", form.date)
              .then(({ data }) => {
                if (data) setSlots(data);
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [form.date]);

  /* ================= UI ================= */
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/main.webp)" }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="relative z-10 pt-40 pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto bg-white/10 backdrop-blur-2xl 
                     border border-white/20 rounded-3xl p-10 shadow-2xl"
        >
          <h1 className="text-center font-serif text-4xl text-white mb-10">
            Make a Reservation
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Full Name"
              className="input-luxury"
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="input-luxury"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Mobile"
              className="input-luxury"
              onChange={(e) =>
                setForm({ ...form, mobile: e.target.value })
              }
            />

            <select
              className="input-luxury"
              onChange={(e) =>
                setForm({ ...form, guests: Number(e.target.value) })
              }
            >
              {[1,2,3,4,5,6].map((g) => (
                <option key={g} value={g}>
                  {g} Guest{g > 1 && "s"}
                </option>
              ))}
            </select>

            {/* DATE */}
            <input
              type="date"
              className="input-luxury md:col-span-2"
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            {/* TIME DROPDOWN */}
            <select
              className="input-luxury md:col-span-2"
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
              disabled={!form.date || loadingSlots}
            >
              <option value="">
                {loadingSlots
                  ? "Loading slots..."
                  : "Select Time"}
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
              className="input-luxury md:col-span-2"
              onChange={(e) =>
                setForm({
                  ...form,
                  specialRequest: e.target.value,
                })
              }
            />
          </div>

          <button className="btn-gold w-full mt-8">
            Confirm Reservation
          </button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservations;
