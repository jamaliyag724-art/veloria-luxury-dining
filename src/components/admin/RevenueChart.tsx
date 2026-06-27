// RevenueChart.tsx
import React, { useMemo } from "react"
import {
AreaChart,
Area,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts"

import { useOrders } from "@/context/OrderContext"
import { useReservations } from "@/context/ReservationContext"

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const RevenueChart=()=>{

const { orders } = useOrders()
const { reservations } = useReservations()

const data = useMemo(() => {
  const revenueByDate = new Map<string, number>()

  orders.forEach((order) => {
    const createdAt = order.createdAt
    if (!createdAt) return
    const key = new Date(createdAt).toISOString().slice(0, 10)
    revenueByDate.set(key, (revenueByDate.get(key) || 0) + (order.totalAmount || 0))
  })

  reservations.forEach((reservation) => {
    const createdAt = reservation.createdAt
    if (!createdAt) return
    const key = new Date(createdAt).toISOString().slice(0, 10)
    revenueByDate.set(key, (revenueByDate.get(key) || 0) + (reservation.reservationAmount || 0))
  })

  return Array.from(revenueByDate.entries())
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([dateKey, revenue]) => ({
      day: DAY_LABELS[new Date(dateKey).getDay()],
      dateKey,
      revenue,
    }))
}, [orders, reservations])

const hasData = data.length > 0 && data.some((d) => d.revenue > 0)

return(

<div className="
bg-[#121214]
border border-[#1f1f23]
rounded-2xl
p-8
shadow-[0_0_40px_rgba(0,0,0,0.5)]
">

<h2 className="mb-6 text-lg text-gray-200">
Revenue Trend
</h2>

{hasData ? (

<ResponsiveContainer width="100%" height={300}>

<AreaChart data={data}>

<defs>

<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">

<stop offset="5%" stopColor="#d4af37" stopOpacity={0.6}/>
<stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>

</linearGradient>

</defs>

<CartesianGrid stroke="#1f1f23"/>

<XAxis dataKey="day" stroke="#666"/>
<YAxis stroke="#666"/>

<Tooltip
contentStyle={{
background:"#0b0b0c",
border:"1px solid #1f1f23"
}}
/>

<Area
type="monotone"
dataKey="revenue"
stroke="#d4af37"
strokeWidth={3}
fill="url(#gold)"
/>

</AreaChart>

</ResponsiveContainer>

) : (

<div className="flex items-center justify-center h-[300px]">
<p className="text-gray-500 text-sm">No revenue available</p>
</div>

)}

</div>

)

}

export default RevenueChart
