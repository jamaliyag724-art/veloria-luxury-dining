// DashboardSection.tsx
import React from "react";

import RevenueCard from "./RevenueCard";
import RevenueChart from "./RevenueChart";
import OrdersChart from "./OrdersChart";

import { useOrders } from "@/context/OrderContext";
import { useReservations } from "@/context/ReservationContext";

import {
  DollarSign,
  ShoppingCart,
  Users,
  BarChart3,
} from "lucide-react";

const DashboardSection = () => {
  const {
    orders,
    loading,
    getOrderStats,
    getTotalRevenue,
  } = useOrders();

  const { reservations, loading: reservationsLoading } = useReservations();

  const stats = getOrderStats();
  const orderRevenue = getTotalRevenue();
  const reservationRevenue = reservations.reduce(
    (sum, r) => sum + (r.reservationAmount || 0),
    0
  );
  const totalRevenue = orderRevenue + reservationRevenue;

  const totalOrders = stats.total;
  const totalReservations = reservations.length;

  const avgRevenue =
    totalOrders + totalReservations > 0
      ? Math.round(totalRevenue / (totalOrders + totalReservations))
      : 0;

  const customers = new Set([
    ...orders.map((order) => order.email),
    ...reservations.map((r) => r.email),
  ]).size;

  if (loading || reservationsLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <p className="text-muted-foreground">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-semibold">
        Veloria Analytics
      </h1>

      <div className="grid md:grid-cols-4 gap-6">
        <RevenueCard
          title="Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          icon={DollarSign}
        />

        <RevenueCard
          title="Orders"
          value={stats.total.toString()}
          icon={ShoppingCart}
        />

        <RevenueCard
          title="Avg Order"
          value={`₹${avgRevenue.toLocaleString("en-IN")}`}
          icon={BarChart3}
        />

        <RevenueCard
          title="Customers"
          value={customers.toString()}
          icon={Users}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <RevenueChart />

        <OrdersChart
          orders={orders}
          dateRange="30days"
        />
      </div>
    </div>
  );
};

export default DashboardSection;
