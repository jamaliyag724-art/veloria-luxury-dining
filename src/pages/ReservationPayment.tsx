import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Hash,
  Tag,
  MapPin,
  Users,
  CalendarDays,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  CreditCard,
  Smartphone,
  Wallet,
  Landmark,
  ShieldCheck,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import { formatINR } from "@/lib/currency";
import { useReservations } from "@/context/ReservationContext";
import { supabase } from "@/integrations/supabase/client";

/* ---------------- TYPES ---------------- */
interface ReservationData {
  fullName: string;
  email: string;
  mobile: string;
  guests: number | string;
  date: string;
  time: string;
  specialRequest?: string;
}

interface SelectedTableData {
  tableNumber: string | number;
  category: string;
  area: string;
  seats: number | string;
  minSpend: number;
  status?: string;
}

interface PaymentSummary {
  subtotal: number;
  gst: number;
  platformFee: number;
  grandTotal: number;
}

type PaymentMethodId = "card" | "upi" | "wallet" | "netbanking";
type PaymentStage = "idle" | "processing" | "success" | "error";

const PAYMENT_METHODS: { id: PaymentMethodId; label: string; icon: React.ElementType }[] = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "netbanking", label: "Net Banking", icon: Landmark },
];

/* ---------------- COMPONENT ---------------- */
const ReservationPayment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addReservation } = useReservations();

  const [cartOpen, setCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("card");
  const [stage, setStage] = useState<PaymentStage>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reservation = location.state?.reservation as ReservationData | undefined;
  const selectedTable = location.state?.selectedTable as SelectedTableData | undefined;
  const paymentSummary = location.state?.paymentSummary as PaymentSummary | undefined;

  /* ---------------- GUARD: MISSING DATA ---------------- */
  if (!reservation || !selectedTable || !paymentSummary) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar onCartClick={() => setCartOpen(true)} />
        <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

        <main className="pt-40 pb-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto bg-card border border-border rounded-3xl p-10 text-center shadow-xl"
          >
            <h1 className="font-serif text-2xl mb-3">No Reservation Found</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find any reservation details to process payment for.
              Please start a new reservation.
            </p>
            <button
              onClick={() => navigate("/reservations")}
              className="btn-outline-gold px-8 py-3"
            >
              Make a Reservation
            </button>
          </motion.div>
        </main>

        <Footer />
      </div>
    );
  }

  const handleBack = () => {
    if (stage === "processing") return;
    navigate("/reservation-summary", {
      state: { reservation, selectedTable },
    });
  };

  const handlePayNow = async () => {
    if (stage === "processing" || stage === "success") return;

    setStage("processing");
    setErrorMessage(null);

    try {
      const tableNote = `Table ${selectedTable.tableNumber} (${selectedTable.category}, ${selectedTable.area}, Min spend ${formatINR(
        selectedTable.minSpend
      )}) | Payment: ${formatINR(paymentSummary.grandTotal)} via ${paymentMethod.toUpperCase()}`;
      const composedRequest = [tableNote, reservation.specialRequest]
        .filter(Boolean)
        .join(" | ");

      const reservationId = await addReservation({
        fullName: reservation.fullName,
        email: reservation.email,
        mobile: reservation.mobile,
        guests:
          typeof reservation.guests === "string"
            ? parseInt(reservation.guests, 10)
            : reservation.guests,
        date: reservation.date,
        time: reservation.time,
        specialRequest: composedRequest || undefined,
        reservationAmount: selectedTable.minSpend,
      });

      try {
        await supabase.functions.invoke("send-email", {
          body: {
            type: "reservation_confirmation",
            data: {
              fullName: reservation.fullName,
              email: reservation.email,
              reservationId,
              date: reservation.date,
              time: reservation.time,
              guests: reservation.guests,
              specialRequest: reservation.specialRequest,
            },
          },
        });
      } catch (emailErr) {
        console.error("Reservation confirmation email failed:", emailErr);
      }

      setStage("success");
      navigate(`/reservation-success/${reservationId}`);
    } catch (err) {
      console.error("Reservation payment error:", err);
      setErrorMessage("Payment failed. Please try again.");
      setStage("error");
    }
  };

  /* ---------------- PROCESSING SCREEN ---------------- */
  if (stage === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-6"
          />
          <p className="font-serif text-xl text-foreground">Processing your payment…</p>
          <p className="text-sm text-muted-foreground mt-2">Please do not close this page.</p>
        </motion.div>
      </div>
    );
  }

  /* ---------------- SUCCESS SCREEN (brief, before redirect) ---------------- */
  if (stage === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </motion.div>
          <p className="font-serif text-xl text-foreground">Payment Successful</p>
          <p className="text-sm text-muted-foreground mt-2">Redirecting to your reservation…</p>
        </motion.div>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-32 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mb-10 text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl text-center mb-16"
          >
            Secure Payment
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* ===================== LEFT CARD — RESERVATION SUMMARY ===================== */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 relative"
            >
              <div className="absolute -inset-1 bg-primary/10 blur-2xl opacity-40 rounded-3xl" />

              <div className="relative bg-card/80 backdrop-blur-2xl border border-border rounded-3xl p-10 shadow-xl">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                  <h2 className="font-serif text-2xl">Reservation Summary</h2>
                  <span className="text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/30">
                    {selectedTable.category}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <SummaryRow
                    icon={Hash}
                    label="Table Number"
                    value={String(selectedTable.tableNumber)}
                    highlight
                  />
                  <SummaryRow icon={Tag} label="Category" value={selectedTable.category} />
                  <SummaryRow icon={MapPin} label="Restaurant Area" value={selectedTable.area} />
                  <SummaryRow icon={Users} label="Seats" value={`${selectedTable.seats} seats`} />
                  <SummaryRow
                    icon={Users}
                    label="Guests"
                    value={`${reservation.guests} guest${Number(reservation.guests) > 1 ? "s" : ""}`}
                  />
                  <SummaryRow
                    icon={CalendarDays}
                    label="Date"
                    value={formatDate(reservation.date)}
                  />
                  <SummaryRow icon={Clock} label="Time" value={reservation.time} />
                  <SummaryRow icon={User} label="Customer Name" value={reservation.fullName} />
                  <SummaryRow icon={Mail} label="Email" value={reservation.email} />
                  <SummaryRow icon={Phone} label="Mobile" value={reservation.mobile} />
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-start gap-3">
                    <MessageSquare size={16} className="text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Special Request
                      </p>
                      <p className="text-sm">
                        {reservation.specialRequest && reservation.specialRequest.trim()
                          ? reservation.specialRequest
                          : "No special requests added."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ===================== RIGHT CARD — PAYMENT ===================== */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-primary/10 blur-2xl opacity-40 rounded-3xl" />

              <div className="relative bg-card/80 backdrop-blur-2xl border border-border rounded-3xl p-8 shadow-xl">
                <h2 className="font-serif text-xl mb-6">Payment Method</h2>

                <div className="space-y-4 mb-6">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full p-4 rounded-xl border transition flex items-center gap-3 ${
                        paymentMethod === m.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <m.icon
                        size={18}
                        className={paymentMethod === m.id ? "text-primary" : "text-muted-foreground"}
                      />
                      <span className="text-sm font-medium">{m.label}</span>
                      {paymentMethod === m.id && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl border border-border bg-background/40 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum Spend</span>
                    <span>{formatINR(paymentSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>{formatINR(paymentSummary.gst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span>{formatINR(paymentSummary.platformFee)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border font-serif text-base">
                    <span>Grand Total</span>
                    <span className="text-primary">{formatINR(paymentSummary.grandTotal)}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {stage === "error" && errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-xl p-3"
                    >
                      <XCircle size={16} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-4">
                  <ShieldCheck size={12} className="text-primary" />
                  Your payment information is encrypted and secure.
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayNow}
                  className="w-full mt-6 py-4 rounded-xl font-medium bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Lock size={16} />
                  Pay Now {formatINR(paymentSummary.grandTotal)}
                </motion.button>

                <button
                  onClick={handleBack}
                  className="w-full mt-3 py-3 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition disabled:opacity-50"
                >
                  Back
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ---------------- SUB-COMPONENTS ---------------- */
interface SummaryRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={15} className="text-primary" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm break-words ${highlight ? "font-serif text-lg text-primary" : "font-medium"}`}>
        {value}
      </p>
    </div>
  </div>
);

/* ---------------- HELPERS ---------------- */
function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default ReservationPayment;
