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
import { useRouteLoader } from "@/context/RouteLoaderContext";

const navLinks = [
  { name: "Home", path: "/", loader: null },
  { name: "Menu", path: "/menu", loader: "menu" },
  { name: "Reservations", path: "/reservations", loader: "reservation" },
  { name: "About", path: "/about", loader: null },
  { name: "Contact", path: "/contact", loader: null },
];

interface NavbarProps {
  onCartClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const { showLoader, hideLoader } = useRouteLoader();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleNavigate = (
    path: string,
    loaderType: "menu" | "reservation" | "checkout" | null
  ) => {
    if (loaderType) {
      showLoader(loaderType);
      setTimeout(() => {
        navigate(path);
        hideLoader();
      }, 1200);
    } else {
      navigate(path);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 inset-x-0 z-50 bg-card/90 backdrop-blur-md"
      >
        <div className="section-container">
          <div className="flex items-center justify-between py-4">
            {/* LOGO */}
            <button
              onClick={() => handleNavigate("/", null)}
              className="flex items-center gap-2"
            >
              <Utensils className="w-7 h-7 text-primary" />
              <span className="font-serif text-xl">Veloria</span>
            </button>

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() =>
                    handleNavigate(
                      link.path,
                      link.loader as any
                    )
                  }
                  className={`text-sm ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary"
                  }`}
                >
                  {link.name}
                </button>
              ))}

              <button
                onClick={() => handleNavigate("/track-order", null)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm"
              >
                <Search className="w-4 h-4" />
                Track Order
              </button>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">
              {/* CART */}
              <button
                onClick={onCartClick}
                className="relative p-3 rounded-full bg-secondary/60"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* RESERVE */}
              <button
                onClick={() =>
                  handleNavigate("/reservations", "reservation")
                }
                className="hidden md:block btn-gold px-6 py-2"
              >
                Reserve Now
              </button>

              {/* MOBILE */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-3 rounded-xl bg-secondary/60"
              >
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 w-[80%] bg-card z-50 p-6"
          >
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() =>
                  handleNavigate(
                    link.path,
                    link.loader as any
                  )
                }
                className="block w-full text-left py-3"
              >
                {link.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
