import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface StatusData {
  pending: number;
  preparing: number;
  completed: number;
  cancelled: number;
}

interface OrderStatusPieProps {
  stats: StatusData;
  loading?: boolean;
}

const STATUS_COLORS = {
  Pending: "hsl(38, 60%, 55%)",
  Preparing: "hsl(210, 60%, 55%)",
  Completed: "hsl(145, 55%, 45%)",
  Cancelled: "hsl(0, 60%, 55%)",
};

const OrderStatusPie: React.FC<OrderStatusPieProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="bg-card rounded-3xl p-7 shadow-soft border border-border/40">
        <Skeleton className="w-40 h-6 mb-6" />
        <Skeleton className="w-full h-64 rounded-full mx-auto max-w-[200px]" />
      </div>
    );
  }

  const data = [
    { name: "Pending", value: stats.pending },
    { name: "Preparing", value: stats.preparing },
    { name: "Completed", value: stats.completed },
    { name: "Cancelled", value: stats.cancelled },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-white rounded-3xl p-7 shadow-soft border border-border/40">
      <h2 className="font-serif text-lg mb-6">Order Status</h2>

      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-16">
          No orders yet
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default OrderStatusPie;
