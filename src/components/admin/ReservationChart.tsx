import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  {day:"Mon", reservations:12},
  {day:"Tue", reservations:18},
  {day:"Wed", reservations:10},
  {day:"Thu", reservations:22},
  {day:"Fri", reservations:30},
  {day:"Sat", reservations:40},
  {day:"Sun", reservations:35}
]

const ReservationChart = ()=>{

  return(

    <div className="bg-card border border-border rounded-2xl p-7">

      <h2 className="font-serif text-lg mb-6">
        Reservations
      </h2>

      <ResponsiveContainer width="100%" height={280}>

        <LineChart data={data}>

          <XAxis dataKey="day"/>
          <YAxis/>
          <Tooltip/>

          <Line
          type="monotone"
          dataKey="reservations"
          stroke="#D4AF37"
          strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  )

}

export default ReservationChart
