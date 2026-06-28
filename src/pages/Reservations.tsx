import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users, Sparkles, MapPin, Hash, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import { fmtINR } from "@/lib/finance";

const Reservations = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cartOpen, setCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const selectedTable = useMemo(() => {
    const tableNumber = searchParams.get("table");
    if (!tableNumber) return null;
    return {
      tableNumber,
      category: searchParams.get("category") || "",
      seats: Number(searchParams.get("seats") || 0),
      minSpend: Number(searchParams.get("minSpend") || 0),
      area: searchParams.get("area") || "",
    };
  }, [searchParams]);

  const clearTable = () => {
    const sp = new URLSearchParams(searchParams);
    ["table", "category", "seats", "minSpend", "area"].forEach((k) => sp.delete(k));
    setSearchParams(sp, { replace: true });
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    guests: selectedTable ? String(selectedTable.seats || 2) : "1",
    date: "",
    time: "",
    message: "",
  });


  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    const guests = parseInt(formData.guests) || 1;

    const reservation = {
      fullName: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      guests,
      date: formData.date,
      time: formData.time,
      specialRequest: formData.message,
    };

    // If no table was chosen from the 3D layout, build a sensible default
    // so the Reservation Summary always renders correctly.
    const tableForSummary = selectedTable ?? {
      tableNumber: "Auto-Assign",
      category: guests <= 2 ? "Couple Dining" : guests <= 4 ? "Indoor Dining" : "Family Dining",
      seats: Math.max(guests, 2),
      minSpend: guests * 1500,
      area: "Indoor Dining",
    };

    navigate("/reservation-summary", {
      state: {
        reservation,
        selectedTable: tableForSummary,
      },
    });

    setSubmitting(false);
  };

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

      <main className="relative z-10 pt-36 pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto 
                     bg-white/10 
                     backdrop-blur-2xl 
                     border border-white/20
                     rounded-[40px] 
                     p-12 
                     shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          <h1 className="font-serif text-4xl text-white text-center mb-6">
            Make a Reservation
          </h1>

          {selectedTable && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-2xl border border-yellow-400/40 bg-yellow-400/5 p-5 relative"
            >
              <button
                type="button"
                onClick={clearTable}
                className="absolute top-3 right-3 p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <X size={14} />
              </button>
              <p className="text-yellow-400 text-[10px] tracking-[0.3em] uppercase flex items-center gap-1.5">
                <Sparkles size={11} /> Selected Table
              </p>
              <div className="mt-2 flex flex-wrap items-end gap-4 text-white">
                <span className="font-serif text-3xl flex items-center gap-2"><Hash size={20} className="text-yellow-400" />{selectedTable.tableNumber}</span>
                <span className="text-sm opacity-90">{selectedTable.category}</span>
                <span className="text-xs opacity-70 flex items-center gap-1"><MapPin size={12} />{selectedTable.area}</span>
                <span className="text-xs opacity-70 flex items-center gap-1"><Users size={12} />{selectedTable.seats} seats</span>
                <span className="ml-auto text-yellow-400 font-semibold">Min spend {fmtINR(selectedTable.minSpend)}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/table-layout")}
                className="mt-3 text-[11px] text-yellow-400/80 hover:text-yellow-400 underline underline-offset-2"
              >
                Change table in 3D view
              </button>
            </motion.div>
          )}


          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="lux-input"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="lux-input"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="lux-input"
                required
              />

              <div className="relative">
                <Users className="absolute left-4 top-4 text-yellow-400 w-4 h-4 opacity-70" />
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="lux-input pl-10"
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <CalendarDays className="absolute left-4 top-4 text-yellow-400 w-4 h-4 opacity-70" />
              <input
                type="date"
                name="date"
                min={today}
                value={formData.date}
                onChange={handleChange}
                className="lux-input pl-10"
                required
              />
            </div>

            <div className="relative">
              <Clock className="absolute left-4 top-4 text-yellow-400 w-4 h-4 opacity-70" />
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="lux-input pl-10 cursor-pointer"
                required
              >
                <option value="">Select Time</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="6:00 PM">6:00 PM</option>
                <option value="7:00 PM">7:00 PM</option>
                <option value="8:00 PM">8:00 PM</option>
                <option value="9:00 PM">9:00 PM</option>
              </select>
            </div>

            <textarea
              name="message"
              placeholder="Special requests (optional)"
              value={formData.message}
              onChange={handleChange}
              className="lux-input min-h-[120px]"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full 
                         bg-gradient-to-r from-yellow-500 to-amber-400
                         text-black font-semibold
                         hover:scale-105 transition-all duration-300
                         disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting ? "Submitting..." : "Confirm Reservation"}
            </button>

            <div className="text-center mt-6">
              <p className="text-white/70 text-sm mb-2">
                Already have a Reservation ID?
              </p>
              <button
                type="button"
                onClick={() => navigate("/reservation-status")}
                className="px-6 py-2 rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
              >
                Track Reservation
              </button>
            </div>

          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservations;
