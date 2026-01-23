import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from "@/lib/currency";


interface FloatingCartProps {
  onClick: () => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ onClick }) => {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-gold animate-pulse-gold"
    >
      <div className="relative">
        <ShoppingBag className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      </div>
      <span className="font-medium">
       {formatINR(totalPrice)}
      </span>
    </motion.button>
  );
};

export default FloatingCart;
