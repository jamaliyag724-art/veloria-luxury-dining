import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-lift z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-xl font-semibold">Your Order</h2>
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  {totalItems}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">
                    Your order is empty
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add items from our menu to begin
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, x: 100 }}
                        className="flex gap-4 p-4 bg-secondary/30 rounded-xl"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-serif font-medium text-foreground">
                            {item.name}
                          </h3>
                          <p className="text-primary font-semibold mt-1">
                            ${item.price}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            <span className="font-medium text-foreground w-6 text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-muted-foreground hover:text-accent transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                          <p className="font-semibold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border-t border-border space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax (10%)</span>
                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg font-semibold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">
                      ${(totalPrice * 1.1).toFixed(2)}
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="btn-gold w-full py-4 text-base"
                >
                  Proceed to Checkout
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
