import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu as MenuIcon,
  X,
  ShoppingBag,
  Search,
  Utensils,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "Reservations", path: "/reservations" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

interface NavbarProps {
  onCartClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const location = useLocation();
  const { totalItems } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all ${
          scrolled
            ? "bg-card/95 backdrop-blur-lg shadow-medium py-3"
            : "bg-card/80 backdrop-blur-md py-4"
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2">
              <Utensils className="w-7 h-7 text-primary" />
              <span className="font-serif text-2xl font-semibold">
                Veloria
              </span>
            </Link>

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              ))}

              {/* TRACK ORDER */}
              <Link
                to="/track-order"
                className="flex items-center gap-2 px-4 py-2 rounded-full
                           bg-primary/10 text-primary
                           hover:bg-primary hover:text-primary-foreground
                           transition-all text-sm font-medium"
              >
                <Search className="w-4 h-4" />
                Track Order
              </Link>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">
              {/* CART */}
              <button
                onClick={onCartClick}
                className="relative p-3 rounded-full bg-secondary/60 hover:bg-secondary transition"
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5
                                 bg-primary text-white text-xs
                                 rounded-full flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* RESERVE BUTTON */}
              <Link to="/reservations" className="hidden md:block">
                <button className="btn-gold px-6 py-2.5 text-sm">
                  Reserve Now
                </button>
              </Link>

              {/* MOBILE MENU TOGGLE */}
              <button
                onClick={() => setMobileOpen((p) => !p)}
                className="md:hidden p-3 rounded-xl bg-secondary/60"
              >
                {mobileOpen ? <X /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* DRAWER */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm
                         bg-card z-50"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="space-y-2 flex-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="block px-4 py-4 rounded-2xl
                                 hover:bg-secondary text-base"
                    >
                      {link.name}
                    </Link>
                  ))}

                  <Link
                    to="/track-order"
                    className="flex items-center gap-3 px-4 py-4 rounded-2xl
                               bg-primary/10 text-primary font-medium"
                  >
                    <Search className="w-5 h-5" />
                    Track Order
                  </Link>
                </div>

                <Link
                  to="/reservations"
                  className="btn-gold w-full mt-6 py-4 text-lg rounded-2xl text-center"
                >
                  Reserve a Table
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
