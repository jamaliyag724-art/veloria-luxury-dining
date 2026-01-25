import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const WelcomePopup: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("veloria-welcome");
    if (!seen) {
      setTimeout(() => setOpen(true), 600); // slight delay = premium feel
      sessionStorage.setItem("veloria-welcome", "true");
    }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative max-w-lg w-[90%] rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl p-8 text-center"
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
            >
              <X />
            </button>

            {/* Logo / Title */}
            <span className="block text-sm uppercase tracking-widest text-primary mb-3">
              Welcome to
            </span>

            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              Veloria
            </h2>

            <p className="text-muted-foreground mb-6">
              A timeless fine-dining experience where every detail is crafted
              with elegance, flavor & passion.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/menu">
                <button
                  onClick={() => setOpen(false)}
                  className="btn-gold w-full"
                >
                  Explore Menu
                </button>
              </Link>

              <Link to="/reservations">
                <button
                  onClick={() => setOpen(false)}
                  className="btn-gold w-full"
                >
                  Reserve a Table
                </button>
              </Link>
            </div>

            {/* Footer note */}
            <p className="text-xs text-muted-foreground mt-6">
              ✦ Michelin-inspired dining ✦
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
