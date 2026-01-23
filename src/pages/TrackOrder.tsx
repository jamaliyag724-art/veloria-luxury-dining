import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = () => {
    setError("");
    setOrder(null);

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = orders.find((o: any) => o.id === orderId);

    if (!found) {
      setError("❌ Order not found. Please check your Order ID.");
      return;
    }

    setOrder(found);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8"
      >
        <h1 className="font-serif text-3xl mb-2 text-center">
          Track Your Order
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          Enter your Order ID to check live status
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
            className="btn-gold px-5 flex items-center gap-2"
          >
            <Search size={18} />
            Track
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {order && (
          <div className="mt-6 border-t pt-6 space-y-2 text-sm">
            <p><b>Order ID:</b> {order.id}</p>
            <p><b>Name:</b> {order.fullName}</p>
            <p><b>Mobile:</b> {order.mobile}</p>
            <p><b>Total:</b> ₹{order.total}</p>
            <p>
              <b>Status:</b>{" "}
              <span className="text-primary font-medium">
                {order.status}
              </span>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TrackOrder;
