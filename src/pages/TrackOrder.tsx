import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, ChefHat, CheckCircle } from "lucide-react";
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
        return <ChefHat className="w-5 h-5 text-yellow-400" />;
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 flex justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-lg w-full 
          bg-gradient-to-b from-[#1a1a1d] to-[#111113]
          border border-yellow-500/20
          shadow-[0_0_60px_rgba(250,204,21,0.06)]
          rounded-3xl p-8"
        >
          {/* subtle gold pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5 rounded-3xl"
            style={{
              backgroundImage: "url('/gold-pattern.svg')",
              backgroundRepeat: "repeat",
              backgroundSize: "140px 140px",
            }}
          />

          <div className="relative z-10">
            <h1 className="font-serif text-3xl text-white text-center mb-2 tracking-wide">
              Track Your Order
            </h1>

            <p className="text-zinc-400 text-center mb-6">
              Enter your Order ID to see live order status
            </p>

            <div className="flex gap-2 mb-4">
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="ORD-XXXXXX"
                className="flex-1 px-4 py-3 rounded-xl 
                bg-[#1c1c1f] 
                border border-yellow-500/20
                text-white placeholder:text-zinc-500
                focus:outline-none focus:border-yellow-400
                focus:ring-1 focus:ring-yellow-400/30
                transition-all"
              />

              <button
                onClick={handleTrack}
                className="btn-gold flex items-center gap-2 px-6"
              >
                <Search size={18} /> Track
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center mt-2">
                {error}
              </p>
            )}

            {searched && !order && !error && (
              <p className="text-red-400 text-sm text-center mt-3">
                Order not found. Please check your Order ID.
              </p>
            )}

            {order && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 border-t border-yellow-500/20 pt-6 space-y-3 text-sm"
              >
                <p className="text-zinc-300">
                  <span className="text-zinc-500">Order ID:</span>{" "}
                  {order.orderId}
                </p>

                <p className="text-zinc-300">
                  <span className="text-zinc-500">Name:</span>{" "}
                  {order.fullName}
                </p>

                <p className="text-zinc-300">
                  <span className="text-zinc-500">Mobile:</span>{" "}
                  {order.mobile}
                </p>

                <p className="text-zinc-300">
                  <span className="text-zinc-500">Total:</span>{" "}
                  ₹{order.totalAmount.toFixed(2)}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  {getStatusIcon()}
                  <span className="font-medium text-yellow-400">
                    {order.orderStatus}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
