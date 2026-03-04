import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { hour: "10 AM", orders: 4 },
  { hour: "12 PM", orders: 18 },
  { hour: "2 PM", orders: 12 },
  { hour: "6 PM", orders: 22 },
  { hour: "8 PM", orders: 30 }
];

const PeakHoursChart = () => {

  return (

    <div className="bg-card border rounded-xl p-6">

      <h2 className="text-xl font-serif mb-6">
        Peak Hours
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={data}>

          <XAxis dataKey="hour" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="orders"
            radius={[6,6,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

};

export default PeakHoursChart;
