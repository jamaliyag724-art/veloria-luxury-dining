import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "@/context/OrderContext";

interface TopItemsChartProps {
  orders: Order[];
  loading?: boolean;
}

const getTopItems = (orders: Order[], limit = 8) => {
  const map = new Map<string, number>();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const count = map.get(item.name) || 0;
      map.set(item.name, count + item.quantity);
    });
  });

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name: name.length > 16 ? name.slice(0, 14) + "…" : name, count }));
};

const GOLD_SHADES = [
  "hsl(38, 70%, 50%)",
  "hsl(38, 60%, 55%)",
  "hsl(38, 55%, 60%)",
  "hsl(38, 50%, 65%)",
  "hsl(38, 45%, 70%)",
  "hsl(38, 40%, 75%)",
  "hsl(38, 35%, 78%)",
  "hsl(38, 30%, 82%)",
];

const TopItemsChart: React.FC<TopItemsChartProps> = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-7 shadow-soft border border-border/40">
        <Skeleton className="w-40 h-6 mb-6" />
        <Skeleton className="w-full h-64 rounded-2xl" />
      </div>
    );
  }

  const data = getTopItems(orders);

  return (
    <div className="bg-white rounded-3xl p-7 shadow-soft border border-border/40">
      <h2 className="font-serif text-lg mb-6">Most Ordered Items</h2>

      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-16">
          No order data yet
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#999" />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11 }}
              stroke="#999"
              width={100}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
              {data.map((_, i) => (
                <Cell key={i} fill={GOLD_SHADES[i % GOLD_SHADES.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopItemsChart;
