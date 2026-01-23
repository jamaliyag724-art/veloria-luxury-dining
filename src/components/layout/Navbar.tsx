import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingBag,
  Utensils,
  Search,
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
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all ${
          scrolled
            ? "bg-card/95 backdrop-blur-lg shadow-medium py-3"
            : "bg-card/80 backdrop-blur-md py-4"
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Utensils className="w-8 h-8 text-primary" />
              <span className="font-serif text-2xl font-semibold">
                Veloria
              </span>
            </Link>

            {/* Desktop Links */}
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

              {/* Track Order */}
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

            {/* Right Actions */}
            <div className="flex items-center gap-3">

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={onCartClick}
                className="relative p-3 rounded-full bg-secondary/60 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Desktop Reserve */}
              <Link to="/reservations" className="hidden md:block">
                <button className="btn-gold px-6 py-2.5 text-sm">
                  Reserve Now
                </button>
              </Link>

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-3 rounded-xl bg-secondary/60 active:scale-95"
              >
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-card z-50"
            >
              <div className="p-6 flex flex-col h-full">

                {/* Links */}
                <div className="space-y-2 flex-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.path)}
                      className="w-full text-left px-4 py-4 rounded-2xl hover:bg-secondary text-base"
                    >
                      {link.name}
                    </button>
                  ))}

                  {/* Mobile Track Order */}
                  <button
                    onClick={() => handleNavClick("/track-order")}
                    className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl
                               bg-primary/10 text-primary font-medium text-base"
                  >
                    <Search className="w-5 h-5" />
                    Track Order
                  </button>
                </div>

                {/* Bottom CTA */}
                <button
                  onClick={() => handleNavClick("/reservations")}
                  className="btn-gold w-full mt-6 py-4 text-lg rounded-2xl"
                >
                  Reserve a Table
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
