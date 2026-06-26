import React from "react";

import RevenueCard from "./RevenueCard";
import RevenueChart from "./RevenueChart";
import OrdersChart from "./OrdersChart";

import { useOrders } from "@/context/OrderContext";

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

  const stats = getOrderStats();
  const revenue = getTotalRevenue();

  const avgOrder =
    stats.total > 0
      ? Math.round(revenue / stats.total)
      : 0;

  const customers = new Set(
    orders.map((order) => order.email)
  ).size;

  if (loading) {
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
          value={`₹${revenue.toLocaleString("en-IN")}`}
          icon={DollarSign}
        />

        <RevenueCard
          title="Orders"
          value={stats.total.toString()}
          icon={ShoppingCart}
        />

        <RevenueCard
          title="Avg Order"
          value={`₹${avgOrder.toLocaleString("en-IN")}`}
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
