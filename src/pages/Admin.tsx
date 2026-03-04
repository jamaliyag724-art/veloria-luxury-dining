import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  LogOut,
  DollarSign,
  ClipboardList,
  Users
} from "lucide-react";

import { useAdmin } from "@/context/AdminContext";
import { useOrders } from "@/context/OrderContext";

import RevenueCard from "@/components/admin/RevenueCard";
import OrdersChart from "@/components/admin/OrdersChart";
import TopItemsChart from "@/components/admin/TopItemsChart";

const Admin = () => {

  const { logout } = useAdmin();
  const { orders, loading } = useOrders();

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.paymentStatus === "Paid" ? o.totalAmount : 0),
    0
  );

  const totalOrders = orders.length;

  const totalReservations = orders.filter(
    (o) => o.type === "reservation"
  ).length;

  const avgOrder =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (

    <div className="min-h-screen bg-background text-foreground">

      {/* NAVBAR */}

      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">

        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white"/>
            </div>

            <div>
              <h1 className="font-serif text-xl">Veloria Admin</h1>
              <p className="text-xs text-muted-foreground">
                Restaurant Management
              </p>
            </div>

          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
          >
            <LogOut className="w-4 h-4 inline mr-2"/>
            Logout
          </button>

        </div>

      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-10">

        {/* NAV TABS */}

        <div className="flex gap-3">

          <Link to="/admin" className="admin-filter admin-filter-active flex gap-2">
            <LayoutDashboard className="w-4 h-4"/> Dashboard
          </Link>

          <Link to="/admin/orders" className="admin-filter flex gap-2">
            <ShoppingBag className="w-4 h-4"/> Orders
          </Link>

          <Link to="/admin/reservations" className="admin-filter flex gap-2">
            <CalendarDays className="w-4 h-4"/> Reservations
          </Link>

        </div>

        {/* KPI CARDS */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <RevenueCard
            title="Total Revenue"
            value={totalRevenue}
            icon={DollarSign}
            isCurrency
            loading={loading}
            trend={12}
          />

          <RevenueCard
            title="Orders"
            value={totalOrders}
            icon={ClipboardList}
            loading={loading}
            trend={5}
          />

          <RevenueCard
            title="Reservations"
            value={totalReservations}
            icon={Users}
            loading={loading}
            trend={3}
          />

          <RevenueCard
            title="Avg Order Value"
            value={avgOrder}
            icon={DollarSign}
            isCurrency
            loading={loading}
          />

        </div>

        {/* ANALYTICS */}

        <div className="grid lg:grid-cols-2 gap-8">

          <OrdersChart
            orders={orders}
            dateRange="30days"
            loading={loading}
          />

          <TopItemsChart
            orders={orders}
            loading={loading}
          />

        </div>

      </main>

    </div>

  );

};

export default Admin;
