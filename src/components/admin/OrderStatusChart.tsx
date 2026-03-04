import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer
} from "recharts";

import { Order } from "@/context/OrderContext";

const COLORS = [
  "#D4AF37",
  "#10B981",
  "#EF4444"
];

interface Props {
  orders?: Order[];
}

const OrderStatusChart: React.FC<Props> = ({ orders }) => {

  const safeOrders = orders ?? [];

  const paid = safeOrders.filter(o => o.paymentStatus === "Paid").length;
  const pending = safeOrders.filter(o => o.paymentStatus === "Pending").length;
  const cancelled = safeOrders.filter(o => o.paymentStatus === "Cancelled").length;

  const data = [
    { name: "Paid", value: paid },
    { name: "Pending", value: pending },
    { name: "Cancelled", value: cancelled }
  ];

  return (

    <div className="bg-card border border-border rounded-2xl p-7">

      <h2 className="font-serif text-lg mb-6">
        Order Status
      </h2>

      <ResponsiveContainer width="100%" height={260}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
          >

            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

};

export default OrderStatusChart;
