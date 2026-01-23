import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Clock, ChefHat, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useOrders } from "@/context/OrderContext";

const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const { getOrderById } = useOrders();

  const order = searched ? getOrderById(orderId.trim()) : null;

  const handleTrack = () => {
    setError("");
    setSearched(true);

    if (!orderId.trim()) {
      setError("Please enter a valid Order ID");
    }
  };

  const getStatusIcon = () => {
    if (!order) return null;
    switch (order.orderStatus) {
      case "Preparing":
        return <ChefHat className="w-5 h-5 text-amber-500" />;
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24 flex justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8"
        >
          <h1 className="font-serif text-3xl text-center mb-2">
            Track Your Order
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Enter your Order ID to see live order status
          </p>

          <div className="flex gap-2 mb-4">
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="ORD-XXXXXX"
              className="luxury-input flex-1"
            />
            <button
              onClick={handleTrack}
              className="btn-gold flex items-center gap-2 px-6"
            >
              <Search size={18} /> Track
            </button>
          </div>

          {searched && !order && (
            <p className="text-red-500 text-sm text-center mt-3">
              ❌ Order not found. Please check your Order ID.
            </p>
          )}

          {order && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 border-t pt-6 space-y-3 text-sm"
            >
              <p><b>Order ID:</b> {order.orderId}</p>
              <p><b>Name:</b> {order.fullName}</p>
              <p><b>Mobile:</b> {order.mobile}</p>
              <p><b>Total:</b> ₹{order.totalAmount.toFixed(2)}</p>

              <div className="flex items-center gap-2 mt-2">
                {getStatusIcon()}
                <span className="font-medium text-primary">
                  {order.orderStatus}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrder;
