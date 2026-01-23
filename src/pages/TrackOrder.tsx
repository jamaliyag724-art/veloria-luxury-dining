import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, ChefHat, CheckCircle, Clock } from "lucide-react";
import { useLocation } from "react-router-dom";

type OrderStatus = "Pending" | "Preparing" | "Completed" | "Cancelled";

const TrackOrder: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlOrderId = params.get("orderId") || "";

  const [orderId, setOrderId] = useState(urlOrderId);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const findOrder = (id: string) => {
    setError("");
    setOrder(null);

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = orders.find((o: any) => o.orderId === id);

    if (!found) {
      setError("❌ Order not found. Please check your Order ID.");
      return;
    }

    setOrder(found);
  };

  useEffect(() => {
    if (urlOrderId) {
      findOrder(urlOrderId);
    }
  }, [urlOrderId]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Preparing":
        return <ChefHat className="w-5 h-5 text-amber-600" />;
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "Cancelled":
        return <Package className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
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
          Enter your Order ID to see live order status
        </p>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="ORD-XXXXXX"
            className="luxury-input flex-1"
          />
          <button
            onClick={() => findOrder(orderId)}
            className="btn-gold px-5 flex items-center gap-2"
          >
            <Search size={18} />
            Track
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 border-t pt-6 space-y-3 text-sm"
          >
            <p>
              <b>Order ID:</b>{" "}
              <span className="font-mono text-primary">{order.orderId}</span>
            </p>
            <p><b>Name:</b> {order.fullName}</p>
            <p><b>Mobile:</b> {order.mobile}</p>
            <p><b>Total:</b> ₹{order.totalAmount}</p>

            <div className="flex items-center gap-2 mt-2">
              {getStatusIcon(order.orderStatus)}
              <span className="font-medium text-primary">
                {order.orderStatus}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TrackOrder;
