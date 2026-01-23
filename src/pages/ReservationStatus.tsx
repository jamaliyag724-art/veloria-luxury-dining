import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, CheckCircle, AlertCircle, Users, CalendarDays, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useReservations, ReservationStatus as ResStatus } from "@/context/ReservationContext";
import CartModal from "@/components/cart/CartModal";

const ReservationStatus = () => {
  const navigate = useNavigate();
  const { getReservationById } = useReservations();
  const [cartOpen, setCartOpen] = useState(false);
  const [reservationId, setReservationId] = useState("");
  const [searched, setSearched] = useState(false);
  const [reservation, setReservation] = useState<ReturnType<typeof getReservationById>>(undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (reservationId.trim()) {
      const found = getReservationById(reservationId.trim().toUpperCase());
      setReservation(found);
      setSearched(true);
    }
  };

  const getStatusConfig = (status: ResStatus) => {
    switch (status) {
      case 'Confirmed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          label: 'Confirmed',
          description: 'Your table is reserved. See you soon!',
        };
      case 'Pending':
        return {
          icon: Clock,
          color: 'text-amber-600',
          bg: 'bg-amber-100',
          label: 'Pending',
          description: 'Your reservation is being reviewed.',
        };
      case 'Waiting':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          label: 'Waiting List',
          description: 'You\'re on our waiting list. We\'ll notify you if a table opens up.',
        };
      case 'Rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100',
          label: 'Rejected',
          description: 'We\'re sorry, we couldn\'t accommodate your reservation.',
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          label: 'Unknown',
          description: '',
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
          className="max-w-lg mx-auto bg-white/95 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <span className="text-primary uppercase tracking-widest text-sm">
              Reservation
            </span>
            <h1 className="font-serif text-3xl mt-3 text-foreground">
              Check Your Status
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Enter your reservation ID to view the current status
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter Reservation ID (e.g., RSV-ABC12)"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value.toUpperCase())}
                className="luxury-input pl-12 pr-4 uppercase"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-gold w-full mt-4 py-3"
            >
              Check Status
            </motion.button>
          </form>

          {searched && !reservation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-6 bg-red-50 rounded-2xl"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="font-serif text-xl text-foreground mb-2">Reservation Not Found</h3>
              <p className="text-muted-foreground text-sm">
                We couldn't find a reservation with ID "{reservationId}". Please check and try again.
              </p>
            </motion.div>
          )}

          {reservation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Card */}
              {(() => {
                const config = getStatusConfig(reservation.status);
                const StatusIcon = config.icon;
                return (
                  <div className={`${config.bg} rounded-2xl p-6 text-center`}>
                    <StatusIcon className={`w-12 h-12 ${config.color} mx-auto mb-3`} />
                    <h3 className={`font-serif text-2xl ${config.color} mb-2`}>{config.label}</h3>
                    <p className="text-muted-foreground text-sm">{config.description}</p>
                  </div>
                );
              })()}

              {/* Reservation Details */}
              <div className="bg-ivory rounded-2xl p-6 space-y-4">
                <div className="text-center border-b border-border pb-4">
                  <p className="text-sm text-muted-foreground">Reservation ID</p>
                  <p className="font-serif text-xl text-primary font-bold">{reservation.reservationId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-xl">
                    <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-semibold">{reservation.guests}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl">
                    <CalendarDays className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{new Date(reservation.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="text-center p-3 bg-white rounded-xl">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-semibold">{reservation.time}</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Guest Name</p>
                  <p className="font-medium text-foreground">{reservation.fullName}</p>
                </div>

                {reservation.specialRequest && (
                  <div>
                    <p className="text-sm text-muted-foreground">Special Request</p>
                    <p className="text-foreground text-sm">{reservation.specialRequest}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/reservations')}
              className="text-primary hover:underline font-medium text-sm"
            >
              Make a New Reservation
            </button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservationStatus;
