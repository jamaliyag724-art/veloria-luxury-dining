import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  Search,
  Filter,
  LogOut,
  ChevronDown,
  MapPin,
  Package
} from "lucide-react";

import { useAdmin } from "@/context/AdminContext";
import { useOrders, OrderStatus } from "@/context/OrderContext";

const AdminOrders: React.FC = () => {

  const navigate = useNavigate();
  const { logout } = useAdmin();
  const { orders, updateOrderStatus } = useOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const filteredOrders = orders.filter((order) => {

    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.mobile.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;

  });

  const getStatusColor = (status: OrderStatus) => {

    switch (status) {

      case "Completed":
        return "bg-green-500/10 text-green-400 border border-green-500/20";

      case "Preparing":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";

      case "Cancelled":
        return "bg-red-500/10 text-red-400 border border-red-500/20";

      default:
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";

    }

  };

  return (

    <div className="min-h-screen bg-background text-foreground">

      {/* HEADER */}

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">

              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />

            </div>

            <div>

              <h1 className="font-serif text-xl font-semibold">
                Veloria Admin
              </h1>

              <p className="text-xs text-muted-foreground">
                Order Management
              </p>

            </div>

          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition"
          >

            <LogOut className="w-4 h-4" />

            Logout

          </button>

        </div>

      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* FILTERS */}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">

          <div className="relative flex-1">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

            <input
              placeholder="Search by Order ID, Name, or Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:outline-none"
            />

          </div>

          <div className="relative">

            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as OrderStatus | "all")
              }
              className="pl-12 pr-10 py-3 rounded-xl bg-card border border-border appearance-none"
            >

              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>

            </select>

            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          </div>

        </div>

        {/* ORDERS */}

        <div className="space-y-6">

          {filteredOrders.map((order) => (

            <motion.div
              key={order.orderId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:border-primary/30 transition"
            >

              {/* TOP ROW */}

              <div className="flex justify-between gap-6">

                <div>

                  <p className="font-mono text-primary font-semibold">
                    {order.orderId}
                  </p>

                  <p className="font-medium">
                    {order.fullName}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {order.email} · {order.mobile}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-serif font-bold text-lg">
                    ₹{order.totalAmount}
                  </p>

                  <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    {order.paymentStatus}
                  </span>

                </div>

              </div>

              {/* ADDRESS */}

              {order.address && (

                <div className="mt-4 flex items-start gap-2 text-sm">

                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />

                  <span>{order.address}</span>

                </div>

              )}

              {/* ITEMS */}

              {order.items?.length > 0 && (

                <div className="mt-4">

                  <div className="flex items-center gap-2 mb-2">

                    <Package className="w-4 h-4" />

                    <p className="font-medium text-sm">
                      Ordered Items
                    </p>

                  </div>

                  <ul className="text-sm space-y-1 ml-6 list-disc text-muted-foreground">

                    {order.items.map((item, idx) => (

                      <li key={idx}>
                        {item.name} × {item.quantity} — ₹{item.price}
                      </li>

                    ))}

                  </ul>

                </div>

              )}

              {/* STATUS + DATE */}

              <div className="mt-4 flex justify-between items-center">

                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    updateOrderStatus(
                      order.orderId,
                      e.target.value as OrderStatus
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                    order.orderStatus
                  )}`}
                >

                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>

                </select>

                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

        <div className="mt-4 text-sm text-muted-foreground text-right">

          Showing {filteredOrders.length} of {orders.length} orders

        </div>

      </div>

    </div>

  );

};

export default AdminOrders;
