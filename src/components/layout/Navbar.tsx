import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Utensils } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Reservations', path: '/reservations' },
  { name: 'About', path: '/#about' },
  { name: 'Contact', path: '/#contact' },
];

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path.includes('#')) return false;
    return location.pathname === path;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-card/95 backdrop-blur-lg shadow-medium py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Utensils className="w-8 h-8 text-primary" />
            </motion.div>
            <span className="font-serif text-2xl font-semibold text-foreground">
              Veloria
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-medium text-sm tracking-wide transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-foreground/80 hover:text-primary'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              className="relative p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Reserve Button (Desktop) */}
            <Link to="/reservations" className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gold text-sm py-2 px-6"
              >
                Reserve Now
              </motion.button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-6 space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block py-2 font-medium transition-colors ${
                        isActive(link.path)
                          ? 'text-primary'
                          : 'text-foreground/80 hover:text-primary'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <Link to="/reservations" onClick={() => setIsOpen(false)}>
                    <button className="btn-gold w-full mt-4">Reserve Now</button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
