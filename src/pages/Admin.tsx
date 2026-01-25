import React from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  TrendingUp,
  Clock,
  LogOut,
  IndianRupee,
} from "lucide-react";

import { useAdmin } from "@/context/AdminContext";
import { useOrders } from "@/context/OrderContext";
import { useReservations } from "@/context/ReservationContext";
import { formatPrice } from "@/lib/currency";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAdmin();
  const { orders, getTotalRevenue, getOrdersCount, loading: ordersLoading } =
    useOrders();
  const {
    reservations,
    getReservationsCount,
    loading: reservationsLoading,
  } = useReservations();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const orderStats = getOrdersCount();
  const reservationStats = getReservationsCount();
  const totalRevenue = getTotalRevenue();

  const today = new Date().toDateString();

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  ).length;

  const todayReservations = reservations.filter(
    (r) => new Date(r.createdAt).toDateString() === today
  ).length;

  const recentOrders = orders.slice(0, 5);
  const recentReservations = reservations.slice(0, 5);

  const statsCards = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: IndianRupee,
      accent: "bg-green-50 text-green-700",
      trend: "+12%",
    },
    {
      title: "Total Orders",
      value: orderStats.total.toString(),
      icon: ShoppingBag,
      accent: "bg-blue-50 text-blue-700",
      sub: `${todayOrders} today`,
    },
    {
      title: "Active Orders",
      value: (orderStats.pending + orderStats.preparing).toString(),
      icon: Clock,
      accent: "bg-amber-50 text-amber-700",
      sub: "Pending / Preparing",
    },
    {
      title: "Reservations",
      value: reservationStats.total.toString(),
      icon: CalendarDays,
      accent: "bg-purple-50 text-purple-700",
      sub: `${todayReservations} today`,
    },
  ];

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin", active: true },
    { name: "Orders", icon: ShoppingBag, path: "/admin/orders" },
    { name: "Reservations", icon: CalendarDays, path: "/admin/reservations" },
    {
      name: "Menu",
      icon: UtensilsCrossed,
      path: "/admin/menu",
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-gold">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold">
                Veloria Admin
              </h1>
              <p className="text-xs text-muted-foreground">
                Restaurant Management
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                       bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* NAV */}
        <div className="flex gap-3 mb-10 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.disabled ? "#" : item.path}
              onClick={(e) => item.disabled && e.preventDefault()}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all
                ${
                  item.active
                    ? "bg-primary text-primary-foreground shadow-gold"
                    : item.disabled
                    ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                    : "bg-white border border-border hover:bg-secondary"
                }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {statsCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-3xl p-7 shadow-soft border border-border/40"
            >
              <div className="flex justify-between mb-5">
                <div className={`p-3 rounded-2xl ${card.accent}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                {card.trend && (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    {card.trend}
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-serif font-semibold">
                {card.value}
              </h3>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              {card.sub && (
                <p className="text-xs text-primary mt-1">{card.sub}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* RECENT DATA */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* ORDERS */}
          <div className="bg-white rounded-3xl p-7 shadow-soft border border-border/40">
            <div className="flex justify-between mb-6">
              <h2 className="font-serif text-lg">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-primary text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {recentOrders.length ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="flex justify-between p-4 bg-[#faf8f4] rounded-2xl"
                  >
                    <div>
                      <p className="text-sm font-medium">{order.orderId}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.fullName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-primary">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                No orders yet
              </p>
            )}
          </div>

          {/* RESERVATIONS */}
          <div className="bg-white rounded-3xl p-7 shadow-soft border border-border/40">
            <div className="flex justify-between mb-6">
              <h2 className="font-serif text-lg">Recent Reservations</h2>
              <Link
                to="/admin/reservations"
                className="text-primary text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {recentReservations.length ? (
              <div className="space-y-4">
                {recentReservations.map((res) => (
                  <div
                    key={res.reservationId}
                    className="flex justify-between p-4 bg-[#faf8f4] rounded-2xl"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {res.reservationId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {res.fullName} • {res.guests} guests
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {new Date(res.date).toLocaleDateString()}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        {res.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                No reservations yet
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
