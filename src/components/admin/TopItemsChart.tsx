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
    .map(([name, count]) => ({
      name: name.length > 16 ? name.slice(0, 14) + "…" : name,
      count,
    }));
};

const GOLD_SHADES = [
  "hsl(38,70%,50%)",
  "hsl(38,60%,55%)",
  "hsl(38,55%,60%)",
  "hsl(38,50%,65%)",
  "hsl(38,45%,70%)",
  "hsl(38,40%,75%)",
  "hsl(38,35%,78%)",
  "hsl(38,30%,82%)",
];

const TopItemsChart: React.FC<TopItemsChartProps> = ({ orders, loading }) => {

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-7 border border-border">
        <Skeleton className="w-40 h-6 mb-6" />
        <Skeleton className="w-full h-64 rounded-xl" />
      </div>
    );
  }

  const data = getTopItems(orders);

  return (
    <div className="bg-card rounded-2xl p-7 border border-border">
      <h2 className="font-serif text-lg mb-6 text-foreground">
        Most Ordered Items
      </h2>

      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-16">
          No order data yet
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              horizontal={false}
            />

            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />

            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
              width={100}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "14px",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
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
