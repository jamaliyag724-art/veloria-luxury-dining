import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  CalendarDays,
  XCircle,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import {
  useReservations,
  ReservationStatus as ResStatus,
} from "@/context/ReservationContext";

const ReservationStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getReservationById } = useReservations();

  const [cartOpen, setCartOpen] = useState(false);
  const [reservationId, setReservationId] = useState("");
  const [searched, setSearched] = useState(false);
  const [reservation, setReservation] = useState<any | null>(null);

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      const formatted = idFromUrl.toUpperCase();
      setReservationId(formatted);
      const found = getReservationById(formatted);
      setReservation(found);
      setSearched(true);
    }
  }, [searchParams, getReservationById]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationId.trim()) return;

    const found = getReservationById(reservationId.trim().toUpperCase());
    setReservation(found);
    setSearched(true);
  };

  const getStatusConfig = (status: ResStatus) => {
    switch (status) {
      case "Confirmed":
        return {
          icon: CheckCircle,
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-100 dark:bg-green-900/30",
          label: "Confirmed",
          description: "Your table is reserved. See you soon!",
        };
      case "Pending":
        return {
          icon: Clock,
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-100 dark:bg-amber-900/30",
          label: "Pending",
          description: "Your reservation is being reviewed.",
        };
      case "Waiting":
        return {
          icon: Clock,
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-100 dark:bg-blue-900/30",
          label: "Waiting List",
          description:
            "You're on our waiting list. We'll notify you if a table opens up.",
        };
      case "Rejected":
        return {
          icon: XCircle,
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-100 dark:bg-red-900/30",
          label: "Rejected",
          description:
            "We're sorry, we couldn't accommodate your reservation.",
        };
      default:
        return {
          icon: Clock,
          color: "text-muted-foreground",
          bg: "bg-muted",
          label: "Unknown",
          description: "",
        };
    }
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

      <main className="relative z-10 pt-36 pb-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto bg-card backdrop-blur-xl rounded-[32px] p-8 shadow-2xl"
        >
          {/* HEADER */}
          <div className="text-center mb-8">
            <span className="text-primary uppercase tracking-widest text-sm">
              Reservation
            </span>
            <h1 className="font-serif text-3xl mt-3 text-foreground">
              Check Your Status
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Enter your reservation ID
            </p>
          </div>

          {/* SEARCH */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                value={reservationId}
                onChange={(e) =>
                  setReservationId(e.target.value.toUpperCase())
                }
                placeholder="RSV-XXXX"
                className="w-full px-4 py-3 pl-12 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition uppercase"
              />
            </div>
            <button className="btn-gold w-full mt-4 py-3">
              Check Status
            </button>
          </form>

          {/* RESULT */}
          {searched && !reservation && (
            <div className="bg-destructive/10 p-6 rounded-2xl text-center">
              <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <p className="text-sm text-foreground">
                Reservation ID not found.
              </p>
            </div>
          )}

          {reservation && (() => {
            const cfg = getStatusConfig(reservation.status);
            const Icon = cfg.icon;

            return (
              <div className="space-y-6">
                <div className={`${cfg.bg} p-6 rounded-2xl text-center`}>
                  <Icon className={`w-12 h-12 ${cfg.color} mx-auto mb-2`} />
                  <h3 className={`text-2xl font-serif ${cfg.color}`}>
                    {cfg.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cfg.description}
                  </p>
                </div>
              </div>
            );
          })()}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservationStatus;
