import React from "react"
import {
AreaChart,
Area,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts"

const data=[
{day:"Mon", revenue:1200},
{day:"Tue", revenue:1800},
{day:"Wed", revenue:900},
{day:"Thu", revenue:2200},
{day:"Fri", revenue:3000},
{day:"Sat", revenue:4200},
{day:"Sun", revenue:3600}
]

const RevenueChart=()=>{

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

</div>

)

}

export default RevenueChart
