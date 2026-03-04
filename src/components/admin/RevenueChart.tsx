import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Order } from "@/context/OrderContext";

interface Props {
  orders?: Order[];
}

const RevenueChart: React.FC<Props> = ({ orders = [] }) => {

  const safeOrders = orders ?? [];

  const map = new Map<string, number>();

  safeOrders.forEach(o => {

    const day = new Date(o.createdAt).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric"
    });

    const revenue = o.paymentStatus === "Paid" ? o.totalAmount : 0;

    map.set(day, (map.get(day) || 0) + revenue);

  });

  const data = Array.from(map.entries()).map(([date, revenue]) => ({
    date,
    revenue
  }));

  return (

    <div className="bg-card border border-border rounded-2xl p-7">

      <h2 className="font-serif text-lg mb-6">
        Revenue Trend
      </h2>

      <ResponsiveContainer width="100%" height={280}>

        <AreaChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(38,60%,55%)"
            fill="hsl(38,60%,55%)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  );

};

export default RevenueChart;
