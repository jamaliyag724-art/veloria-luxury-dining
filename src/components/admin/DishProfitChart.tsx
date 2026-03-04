import React from "react"
import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

const data=[
{name:"Steak", profit:2200},
{name:"Truffle Pasta", profit:1800},
{name:"Burrata", profit:1400},
{name:"Risotto", profit:900}
]

const DishProfitChart=()=>{

return(

<div className="bg-[#121214] border border-[#1f1f23] rounded-2xl p-7">

<h2 className="mb-6 text-lg">
Dish Profitability
</h2>

<ResponsiveContainer width="100%" height={280}>

<BarChart data={data}>

<XAxis dataKey="name"/>
<YAxis/>

<Tooltip/>

<Bar dataKey="profit" fill="#d4af37"/>

</BarChart>

</ResponsiveContainer>

</div>

)

}

export default DishProfitChart
