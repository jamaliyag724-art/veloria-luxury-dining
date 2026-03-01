import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "@/context/OrderContext";

interface OrdersChartProps {
  orders: Order[];
  dateRange: string;
  loading?: boolean;
}

const getFilteredOrders = (orders: Order[], dateRange: string) => {
  const now = new Date();
  let start: Date;

  switch (dateRange) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "7days":
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30days":
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      start = new Date(0);
  }

  return orders.filter((o) => new Date(o.createdAt) >= start);
};

const aggregateByDay = (orders: Order[]) => {
  const map = new Map<string, { count: number; revenue: number }>();

  orders.forEach((o) => {
    const day = new Date(o.createdAt).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
    const existing = map.get(day) || { count: 0, revenue: 0 };
    map.set(day, {
      count: existing.count + 1,
      revenue: existing.revenue + (o.paymentStatus === "Paid" ? o.totalAmount : 0),
    });
  });

  return Array.from(map.entries()).map(([date, data]) => ({
    date,
    orders: data.count,
    revenue: data.revenue,
  }));
};

const OrdersChart: React.FC<OrdersChartProps> = ({ orders, dateRange, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-7 shadow-soft border border-border/40">
        <Skeleton className="w-40 h-6 mb-6" />
        <Skeleton className="w-full h-64 rounded-2xl" />
      </div>
    );
  }

  const filtered = getFilteredOrders(orders, dateRange);
  const data = aggregateByDay(filtered);

  return (
    <div className="bg-white rounded-3xl p-7 shadow-soft border border-border/40">
      <h2 className="font-serif text-lg mb-6">Orders Trend</h2>

      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-16">
          No orders in this period
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 60%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38, 60%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
            <YAxis tick={{ fontSize: 12 }} stroke="#999" />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="hsl(38, 60%, 55%)"
              strokeWidth={2}
              fill="url(#goldGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default OrdersChart;
