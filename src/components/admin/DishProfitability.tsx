import React from "react";
import { useOrders } from "@/context/OrderContext";

const DishProfitability = ()=>{

const { orders } = useOrders()

const map:any={}

orders.forEach(o=>{

o.items.forEach(i=>{

if(!map[i.name]){

map[i.name]={orders:0,revenue:0}

}

map[i.name].orders += i.quantity
map[i.name].revenue += i.price * i.quantity

})

})

const dishes = Object.entries(map)
.map(([name,data]:any)=>({
name,
...data
}))
.sort((a,b)=>b.revenue-a.revenue)
.slice(0,5)

return(

<div className="bg-card border border-border rounded-xl p-6">

<h2 className="font-serif text-lg mb-6">
Dish Profitability
</h2>

{dishes.map((d,i)=>(

<div key={i} className="flex justify-between py-2">

<span>{d.name}</span> <span>₹{d.revenue}</span>

</div>
))}

</div>

)

}

export default DishProfitability
