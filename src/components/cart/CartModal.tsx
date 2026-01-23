import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { formatINR } from "@/lib/currency";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } =
    useCart();
  const navigate = useNavigate();

  const tax = totalPrice * 0.1;
  const grandTotal = totalPrice + tax;

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
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

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-lift z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-xl font-semibold">
                  Your Order
                </h2>
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">
                    Your order is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const itemTotal = item.price * item.quantity;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        className="flex gap-4 p-4 bg-secondary/30 rounded-xl"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />

                        <div className="flex-1">
                          <h3 className="font-serif font-medium">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatINR(item.price)} × {item.quantity}
                          </p>

                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4" />
                            </button>

                            <span className="w-6 text-center">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-accent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <p className="font-serif font-semibold text-primary">
                            {formatINR(itemTotal)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatINR(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>{formatINR(tax)}</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatINR(grandTotal)}
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
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
