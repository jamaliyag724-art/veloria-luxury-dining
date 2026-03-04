import React from "react";
import { useOrders } from "@/context/OrderContext";

const DemandPrediction = ()=>{

const { orders } = useOrders()

const total = orders.length

const weekendOrders =
orders.filter(o=>{
const d=new Date(o.createdAt).getDay()
return d===5||d===6
}).length

const weekdayOrders = total - weekendOrders

const prediction =
weekendOrders > weekdayOrders
?"High weekend demand expected"
:"Stable demand expected"

return(

<div className="bg-card border border-border rounded-xl p-6">

<h2 className="font-serif text-lg mb-4">
AI Demand Prediction
</h2>

<p className="text-muted-foreground">

Based on recent order patterns

</p>

<p className="text-xl mt-3 text-primary">

{prediction}

</p>

</div>

)

}

export default DemandPrediction
