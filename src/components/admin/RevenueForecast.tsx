import React from "react";
import { useOrders } from "@/context/OrderContext";

const RevenueForecast = ()=>{

const { orders } = useOrders()

const revenue = orders.reduce(
(sum,o)=>sum+o.totalAmount,0
)

const forecast = Math.round(revenue * 1.2)

return(

<div className="bg-card border border-border rounded-xl p-6">

<h2 className="font-serif text-lg mb-4">
Revenue Forecast
</h2>

<p className="text-muted-foreground text-sm">

Projected next month revenue

</p>

<p className="text-2xl text-primary mt-2">

₹{forecast}

</p>

</div>

)

}

export default RevenueForecast
