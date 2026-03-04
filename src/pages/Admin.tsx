import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  Clock,
  LogOut,
  IndianRupee,
  Users,
  BarChart3,
} from "lucide-react";

import { useAdmin } from "@/context/AdminContext";
import { useOrders } from "@/context/OrderContext";
import { useReservations } from "@/context/ReservationContext";
import { formatPrice } from "@/lib/currency";

import RevenueCard from "@/components/admin/RevenueCard";
import OrdersChart from "@/components/admin/OrdersChart";
import TopItemsChart from "@/components/admin/TopItemsChart";
import OrderStatusPie from "@/components/admin/OrderStatusPie";
import AnalyticsFilters from "@/components/admin/AnalyticsFilters";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAdmin();
  const { orders, getTotalRevenue, getOrdersCount, loading: ordersLoading } = useOrders();
  const { reservations, getReservationsCount, loading: reservationsLoading } = useReservations();

  const [dateRange, setDateRange] = useState("30days");

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const orderStats = getOrdersCount();
  const reservationStats = getReservationsCount();
  const totalRevenue = getTotalRevenue();

  const loading = ordersLoading || reservationsLoading;

  const today = new Date().toDateString();

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  ).length;

  const todayReservations = reservations.filter(
    (r) => new Date(r.createdAt).toDateString() === today
  ).length;

  const recentOrders = orders.slice(0, 5);
  const recentReservations = reservations.slice(0, 5);

  const uniqueCustomers = new Set(orders.map((o) => o.email)).size;

  const conversionRate =
    orderStats.total > 0
      ? Math.round((orderStats.completed / orderStats.total) * 100)
      : 0;

  const statsCards = [
    {
      title: "Total Revenue",
      value: totalRevenue,
      icon: IndianRupee,
      accentClass: "bg-[#1a1a1a] text-green-400",
      isCurrency: true,
      trend: 12,
    },
    {
      title: "Total Orders",
      value: orderStats.total,
      icon: ShoppingBag,
      accentClass: "bg-[#1a1a1a] text-blue-400",
      subtitle: `${todayOrders} today`,
    },
    {
      title: "Customers",
      value: uniqueCustomers,
      icon: Users,
      accentClass: "bg-[#1a1a1a] text-purple-400",
      subtitle: "Unique emails",
    },
    {
      title: "Reservations",
      value: reservationStats.total,
      icon: CalendarDays,
      accentClass: "bg-[#1a1a1a] text-yellow-400",
      subtitle: `${todayReservations} today`,
    },
    {
      title: "Active Orders",
      value: orderStats.pending + orderStats.preparing,
      icon: Clock,
      accentClass: "bg-[#1a1a1a] text-orange-400",
      subtitle: "Pending / Preparing",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: BarChart3,
      accentClass: "bg-[#1a1a1a] text-teal-400",
      subtitle: "Completed / Total",
    },
  ];

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin", active: true },
    { name: "Orders", icon: ShoppingBag, path: "/admin/orders", active: false },
    { name: "Reservations", icon: CalendarDays, path: "/admin/reservations", active: false },
    { name: "Menu", icon: UtensilsCrossed, path: "/admin/menu", active: false },
  ];

  return (
  <div className="min-h-screen bg-background text-foreground">

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#111111]/90 border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">

          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#D4AF37] flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-black" />
            </div>

            <div>
              <h1 className="font-serif text-xl font-semibold">
                Veloria Admin
              </h1>

              <p className="text-xs text-gray-400">
                Restaurant Management
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
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
              to={item.path}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition
              ${
                item.active
                  ? "bg-[#D4AF37] text-black"
                  : "bg-card border border-border hover:bg-[#1d1d1d]"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}

        </div>

        {/* FILTER */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">

          <h2 className="font-serif text-2xl">
            Analytics Overview
          </h2>

          <AnalyticsFilters
            dateRange={dateRange}
            onChange={setDateRange}
          />

        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

          {statsCards.map((card, i) => (
            <RevenueCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
              trend={card.trend}
              subtitle={card.subtitle}
              loading={loading}
              isCurrency={card.isCurrency}
              accentClass={card.accentClass}
              index={i}
            />
          ))}

        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">

          <OrdersChart
            orders={orders}
            dateRange={dateRange}
            loading={loading}
          />

          <TopItemsChart
            orders={orders}
            loading={loading}
          />

        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">

          <OrderStatusPie
            stats={orderStats}
            loading={loading}
          />

          <div className="bg-[#151515] rounded-xl p-7 border border-[#222]">

            <h2 className="font-serif text-lg mb-6">
              Quick Insights
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between p-4 bg-[#1c1c1c] rounded-xl">
                <span className="text-sm text-gray-400">
                  Avg Order Value
                </span>

                <span className="font-semibold">
                  {formatPrice(
                    orderStats.total > 0
                      ? totalRevenue / orderStats.total
                      : 0
                  )}
                </span>
              </div>

              <div className="flex justify-between p-4 bg-[#1c1c1c] rounded-xl">
                <span className="text-sm text-gray-400">
                  Pending Reservations
                </span>

                <span>
                  {reservationStats.pending}
                </span>
              </div>

              <div className="flex justify-between p-4 bg-[#1c1c1c] rounded-xl">
                <span className="text-sm text-gray-400">
                  Confirmed Reservations
                </span>

                <span>
                  {reservationStats.confirmed}
                </span>
              </div>

              <div className="flex justify-between p-4 bg-[#1c1c1c] rounded-xl">
                <span className="text-sm text-gray-400">
                  Cancelled Orders
                </span>

                <span className="text-red-400">
                  {orderStats.cancelled}
                </span>
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default Admin;
