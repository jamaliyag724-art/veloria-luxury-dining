import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Copy } from "lucide-react";
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

      <main className="relative z-10 pt-40 pb-32 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto bg-white/95 backdrop-blur-2xl 
                     rounded-3xl p-10 text-center shadow-2xl"
        >
          {/* ICON */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full 
                            flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </motion.div>

          <h1 className="font-serif text-3xl mb-3">
            Reservation Submitted 🍷
          </h1>

          <p className="text-muted-foreground mb-8">
            Your reservation request has been received.
            <br />
            We’ll confirm it shortly.
          </p>

          {/* RESERVATION ID */}
          <div className="bg-ivory rounded-xl p-5 mb-6 relative">
            <p className="text-sm text-muted-foreground mb-1">
              Reservation ID
            </p>

            <p className="font-serif text-2xl text-primary font-bold">
              {id}
            </p>

            <button
              onClick={copyId}
              className="absolute top-4 right-4 text-primary hover:opacity-80"
              aria-label="Copy Reservation ID"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            Please save this ID for future reference.
          </p>

          {/* ONLY BACK HOME */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="btn-outline-gold px-10 py-3"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservationSuccess;
