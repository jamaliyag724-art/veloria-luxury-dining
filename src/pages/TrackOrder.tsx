import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, ChefHat, CheckCircle, Truck, Package, XCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/currency";

type OrderStatus = "Pending" | "Preparing" | "Completed" | "Cancelled";

interface TrackedOrder {
  orderId: string;
  fullName: string;
  mobile: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  items: any[];
  createdAt: string;
}

const STATUS_STEPS: { status: OrderStatus; icon: React.ElementType; label: string }[] = [
  { status: "Pending", icon: Clock, label: "Order Placed" },
  { status: "Preparing", icon: ChefHat, label: "Preparing" },
  { status: "Completed", icon: CheckCircle, label: "Completed" },
];

const getStepIndex = (status: OrderStatus) => {
  if (status === "Cancelled") return -1;
  return STATUS_STEPS.findIndex((s) => s.status === status);
};

const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", id.trim())
      .single();

    if (fetchError || !data) {
      setOrder(null);
    } else {
      setOrder({
        orderId: data.order_id,
        fullName: data.full_name,
        mobile: data.mobile,
        totalAmount: data.total_amount,
        orderStatus: data.order_status as OrderStatus,
        items: (data.items as any[]) || [],
        createdAt: data.created_at,
      });
    }
    setLoading(false);
  };

  // Real-time subscription
  useEffect(() => {
    if (!order) return;

    const channel = supabase
      .channel(`track-order-${order.orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `order_id=eq.${order.orderId}`,
        },
        (payload) => {
          const updated = payload.new as any;
          setOrder((prev) =>
            prev
              ? {
                  ...prev,
                  orderStatus: updated.order_status as OrderStatus,
                  totalAmount: updated.total_amount,
                }
              : null
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.orderId]);

  const handleTrack = () => {
    setError("");
    setSearched(true);

    if (!orderId.trim()) {
      setError("Please enter a valid Order ID");
      return;
    }

    fetchOrder(orderId);
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : -1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 flex justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-lg w-full bg-gradient-to-b from-[#1a1a1d] to-[#111113] border border-primary/20 shadow-[0_0_60px_rgba(250,204,21,0.06)] rounded-3xl p-8"
        >
          {/* Gold pattern overlay */}
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
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                placeholder="ORD-XXXXXX"
                className="flex-1 px-4 py-3 rounded-xl bg-[#1c1c1f] border border-primary/20 text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <button onClick={handleTrack} className="btn-gold flex items-center gap-2 px-6">
                <Search size={18} /> Track
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center mt-2">{error}</p>
            )}

            {searched && !order && !error && !loading && (
              <p className="text-red-400 text-sm text-center mt-3">
                Order not found. Please check your Order ID.
              </p>
            )}

            {loading && (
              <div className="flex justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full"
                />
              </div>
            )}

            <AnimatePresence mode="wait">
              {order && !loading && (
                <motion.div
                  key={order.orderStatus}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 border-t border-primary/20 pt-6"
                >
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                    <div>
                      <span className="text-zinc-500">Order ID</span>
                      <p className="text-white font-medium">{order.orderId}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Name</span>
                      <p className="text-white font-medium">{order.fullName}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Total</span>
                      <p className="text-primary font-serif text-lg">{formatINR(order.totalAmount)}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Placed</span>
                      <p className="text-white text-xs">
                        {new Date(order.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Status Progress */}
                  {order.orderStatus === "Cancelled" ? (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                      <XCircle className="w-6 h-6 text-red-400" />
                      <span className="text-red-400 font-medium">Order Cancelled</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-4">
                        Live Status
                      </h3>
                      <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-zinc-700">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{
                              width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%`,
                            }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                          />
                        </div>

                        {STATUS_STEPS.map((step, i) => {
                          const isActive = i <= currentStep;
                          const isCurrent = i === currentStep;
                          const StepIcon = step.icon;

                          return (
                            <div key={step.status} className="relative z-10 flex flex-col items-center gap-2">
                              <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                  isActive
                                    ? "bg-primary border-primary"
                                    : "bg-zinc-800 border-zinc-600"
                                }`}
                                animate={
                                  isCurrent
                                    ? { scale: [1, 1.15, 1], boxShadow: ["0 0 0 0 rgba(212,175,55,0)", "0 0 0 8px rgba(212,175,55,0.2)", "0 0 0 0 rgba(212,175,55,0)"] }
                                    : {}
                                }
                                transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                              >
                                <StepIcon
                                  className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-zinc-500"}`}
                                />
                              </motion.div>
                              <span
                                className={`text-xs font-medium ${
                                  isActive ? "text-primary" : "text-zinc-500"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  {order.items.length > 0 && (
                    <div className="mt-6 border-t border-zinc-800 pt-4">
                      <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm text-zinc-300">
                            <span>{item.name} × {item.quantity}</span>
                            <span>{formatINR(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
