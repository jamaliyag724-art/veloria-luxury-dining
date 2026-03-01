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
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today).length;
  const todayReservations = reservations.filter((r) => new Date(r.createdAt).toDateString() === today).length;

  const recentOrders = orders.slice(0, 5);
  const recentReservations = reservations.slice(0, 5);

  // Unique customers
  const uniqueCustomers = new Set(orders.map((o) => o.email)).size;

  // Conversion rate (completed / total)
  const conversionRate = orderStats.total > 0
    ? Math.round((orderStats.completed / orderStats.total) * 100)
    : 0;

  const statsCards = [
    {
      title: "Total Revenue",
      value: totalRevenue,
      icon: IndianRupee,
      accentClass: "bg-green-50 text-green-700",
      isCurrency: true,
      trend: 12,
    },
    {
      title: "Total Orders",
      value: orderStats.total,
      icon: ShoppingBag,
      accentClass: "bg-blue-50 text-blue-700",
      subtitle: `${todayOrders} today`,
    },
    {
      title: "Customers",
      value: uniqueCustomers,
      icon: Users,
      accentClass: "bg-purple-50 text-purple-700",
      subtitle: "Unique emails",
    },
    {
      title: "Reservations",
      value: reservationStats.total,
      icon: CalendarDays,
      accentClass: "bg-amber-50 text-amber-700",
      subtitle: `${todayReservations} today`,
    },
    {
      title: "Active Orders",
      value: orderStats.pending + orderStats.preparing,
      icon: Clock,
      accentClass: "bg-orange-50 text-orange-700",
      subtitle: "Pending / Preparing",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: BarChart3,
      accentClass: "bg-teal-50 text-teal-700",
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
    <div className="min-h-screen bg-[#faf8f4]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-gold">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold">Veloria Admin</h1>
              <p className="text-xs text-muted-foreground">Restaurant Management</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
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
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all
                ${item.active ? "bg-primary text-primary-foreground shadow-gold" : "bg-white border border-border hover:bg-secondary"}`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* DATE FILTERS */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h2 className="font-serif text-2xl">Analytics Overview</h2>
          <AnalyticsFilters dateRange={dateRange} onChange={setDateRange} />
        </div>

        {/* STATS GRID */}
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
          <OrdersChart orders={orders} dateRange={dateRange} loading={loading} />
          <TopItemsChart orders={orders} loading={loading} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <OrderStatusPie stats={orderStats} loading={loading} />

          {/* Revenue by period */}
          <div className="bg-white rounded-3xl p-7 shadow-soft border border-border/40">
            <h2 className="font-serif text-lg mb-6">Quick Insights</h2>
            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-[#faf8f4] rounded-2xl">
                <span className="text-sm text-muted-foreground">Avg Order Value</span>
                <span className="font-serif font-semibold">
                  {formatPrice(orderStats.total > 0 ? totalRevenue / orderStats.total : 0)}
                </span>
              </div>
              <div className="flex justify-between p-4 bg-[#faf8f4] rounded-2xl">
                <span className="text-sm text-muted-foreground">Pending Reservations</span>
                <span className="font-serif font-semibold">{reservationStats.pending}</span>
              </div>
              <div className="flex justify-between p-4 bg-[#faf8f4] rounded-2xl">
                <span className="text-sm text-muted-foreground">Confirmed Reservations</span>
                <span className="font-serif font-semibold">{reservationStats.confirmed}</span>
              </div>
              <div className="flex justify-between p-4 bg-[#faf8f4] rounded-2xl">
                <span className="text-sm text-muted-foreground">Cancelled Orders</span>
                <span className="font-serif font-semibold text-red-500">{orderStats.cancelled}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT DATA */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* ORDERS */}
          <div className="bg-white rounded-3xl p-7 shadow-soft border border-border/40">
            <div className="flex justify-between mb-6">
              <h2 className="font-serif text-lg">Recent Orders</h2>
              <Link to="/admin/orders" className="text-primary text-sm font-medium">
                View All
              </Link>
            </div>
            {recentOrders.length ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.orderId} className="flex justify-between p-4 bg-[#faf8f4] rounded-2xl">
                    <div>
                      <p className="text-sm font-medium">{order.orderId}</p>
                      <p className="text-xs text-muted-foreground">{order.fullName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-primary">{formatPrice(order.totalAmount)}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">No orders yet</p>
            )}
          </div>

          {/* RESERVATIONS */}
          <div className="bg-white rounded-3xl p-7 shadow-soft border border-border/40">
            <div className="flex justify-between mb-6">
              <h2 className="font-serif text-lg">Recent Reservations</h2>
              <Link to="/admin/reservations" className="text-primary text-sm font-medium">
                View All
              </Link>
            </div>
            {recentReservations.length ? (
              <div className="space-y-4">
                {recentReservations.map((res) => (
                  <div key={res.reservationId} className="flex justify-between p-4 bg-[#faf8f4] rounded-2xl">
                    <div>
                      <p className="text-sm font-medium">{res.reservationId}</p>
                      <p className="text-xs text-muted-foreground">
                        {res.fullName} • {res.guests} guests
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{new Date(res.date).toLocaleDateString()}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        {res.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">No reservations yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
