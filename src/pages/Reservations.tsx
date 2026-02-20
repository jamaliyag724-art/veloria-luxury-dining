import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";

interface Slot {
  id: string;
  time_slot: string;
  total_tables: number;
  booked_tables: number;
}

const Reservation: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    guests: 1,
    date: "",
    time: "",
    special: "",
  });

  const [availability, setAvailability] = useState<Slot[]>([]);
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
        setAvailability(data);
      } else {
        setAvailability([]);
      }

      setLoadingSlots(false);
    };

    fetchSlots();
  }, [form.date]);

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

      <main className="relative z-10 pt-40 pb-32 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl 
                     rounded-3xl p-10 border border-white/20"
        >
          <h1 className="text-center font-serif text-4xl mb-10 text-white">
            Make a Reservation
          </h1>

          {/* FORM GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Full Name"
              className="luxury-input"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="luxury-input"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="tel"
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
              {[1,2,3,4,5,6,7,8].map((g) => (
                <option key={g} value={g}>
                  {g} Guest{g > 1 && "s"}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="luxury-input md:col-span-2"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value, time: "" })
              }
            />
          </div>

          {/* TIME SLOTS */}
          {form.date && (
            <div className="mt-8">
              <h3 className="text-white mb-4 font-medium">
                Select Time
              </h3>

              {loadingSlots ? (
                <p className="text-white/70">Loading slots...</p>
              ) : availability.length === 0 ? (
                <p className="text-white/70">
                  No time slots available for this date
                </p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {availability.map((slot) => {
                    const available =
                      slot.total_tables - slot.booked_tables;

                    const isFull = available <= 0;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isFull}
                        onClick={() =>
                          setForm({
                            ...form,
                            time: slot.time_slot,
                          })
                        }
                        className={`px-5 py-2 rounded-full border transition
                          ${
                            form.time === slot.time_slot
                              ? "bg-yellow-500 text-black border-yellow-500"
                              : "border-white/30 text-white hover:border-yellow-500"
                          }
                          ${isFull && "opacity-40 cursor-not-allowed"}
                        `}
                      >
                        {slot.time_slot}
                        {isFull && " (Full)"}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <textarea
            placeholder="Special requests (optional)"
            className="luxury-input mt-8 w-full"
            value={form.special}
            onChange={(e) =>
              setForm({ ...form, special: e.target.value })
            }
          />

          <button className="btn-gold w-full mt-8">
            Confirm Reservation
          </button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservation;
