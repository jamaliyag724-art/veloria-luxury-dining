import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Search } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";

const ReservationSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  const copyId = () => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    toast.success("Reservation ID copied");
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

      <main className="relative z-10 pt-40 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto bg-white/95 backdrop-blur-2xl rounded-3xl p-10 text-center shadow-2xl mx-4"
        >
          {/* SUCCESS ICON */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-6"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-20 h-20 rounded-full border-2 border-green-400 mx-auto"
            />
          </motion.div>

          <h1 className="font-serif text-3xl mb-4 text-foreground">
            Reservation Submitted 🍷
          </h1>

          <p className="text-muted-foreground mb-8">
            Your reservation request has been received. We'll confirm it shortly.
          </p>

          {/* RESERVATION ID */}
          <div className="mb-6 p-4 bg-ivory rounded-xl flex items-center justify-between gap-3">
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Reservation ID</p>
              <p className="font-serif text-xl text-primary font-bold">
                {id}
              </p>
            </div>
            <button onClick={copyId} className="text-primary">
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            Save this ID to track your reservation status anytime.
          </p>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(`/track-reservation?id=${id}`)
              }
              className="btn-gold px-8 py-3 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Track Reservation
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="btn-outline-gold px-8 py-3"
            >
              Back to Home
            </motion.button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservationSuccess;
