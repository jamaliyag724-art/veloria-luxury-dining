import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChefHat, CheckCircle2, AlertCircle } from "lucide-react";
import { useOrders, Order, OrderStatus } from "@/context/OrderContext";

const statusColumns: { key: OrderStatus; label: string; color: string; icon: React.ElementType }[] = [
  { key: "Pending", label: "New Orders", color: "border-amber-500/50 bg-amber-500/5", icon: AlertCircle },
  { key: "Preparing", label: "Preparing", color: "border-primary/50 bg-primary/5", icon: ChefHat },
  { key: "Completed", label: "Ready", color: "border-emerald-500/50 bg-emerald-500/5", icon: CheckCircle2 },
];

const ElapsedTimer = ({ createdAt }: { createdAt: string }) => {
  const [elapsed, setElapsed] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
      const m = Math.floor(diff / 60);
      const s = diff % 60;
      setElapsed(`${m}:${s.toString().padStart(2, "0")}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Clock size={12} /> {elapsed}
    </span>
  );
};

const KitchenDisplay = () => {
  const { orders, updateOrderStatus } = useOrders();

  const moveOrder = async (orderId: string, to: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, to);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold font-serif">Kitchen Display</h1>
        <span className="text-sm text-muted-foreground">
          Live • {orders.filter(o => o.orderStatus !== "Cancelled" && o.orderStatus !== "Completed").length} active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {statusColumns.map((col) => {
          const filtered = orders.filter((o) => o.orderStatus === col.key);
          const Icon = col.icon;
          return (
            <div key={col.key} className={`rounded-2xl border-2 ${col.color} p-5 min-h-[400px]`}>
              <div className="flex items-center gap-2 mb-4">
                <Icon size={18} className="text-foreground" />
                <h2 className="font-semibold text-foreground">{col.label}</h2>
                <span className="ml-auto text-xs bg-foreground/10 px-2 py-0.5 rounded-full">{filtered.length}</span>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {filtered.map((order) => (
                    <motion.div
                      key={order.orderId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-card border border-border rounded-xl p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm font-bold text-primary">{order.orderId}</span>
                        <ElapsedTimer createdAt={order.createdAt} />
                      </div>
                      <p className="text-sm text-muted-foreground">{order.fullName}</p>
                      <ul className="space-y-1">
                        {order.items.slice(0, 5).map((item, i) => (
                          <li key={i} className="text-sm flex justify-between">
                            <span>{item.name}</span>
                            <span className="text-muted-foreground">×{item.quantity}</span>
                          </li>
                        ))}
                        {order.items.length > 5 && (
                          <li className="text-xs text-muted-foreground">+{order.items.length - 5} more</li>
                        )}
                      </ul>
                      <div className="flex gap-2 pt-1">
                        {col.key === "Pending" && (
                          <button onClick={() => moveOrder(order.orderId, "Preparing")} className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/30 transition">
                            Start Preparing
                          </button>
                        )}
                        {col.key === "Preparing" && (
                          <button onClick={() => moveOrder(order.orderId, "Completed")} className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition">
                            Mark Ready
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No orders</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KitchenDisplay;
