import React from "react";
import { useOrders } from "@/context/OrderContext";

const CustomersSection = () => {

const { orders } = useOrders();

const customers = Object.values(

orders.reduce((acc:any,o)=>{

if(!acc[o.email]){

acc[o.email]={

name:o.fullName,
orders:0,
revenue:0

}

}

acc[o.email].orders+=1
acc[o.email].revenue+=o.totalAmount

return acc

},{})
);

return (

<div>

<h1 className="text-2xl font-serif mb-6">

Top Customers

</h1>

<div className="bg-card border border-border rounded-xl p-6">

{customers.map((c:any,i)=>(

<div key={i} className="flex justify-between py-4 border-b border-border">

<div>

<p>{c.name}</p>
<p className="text-sm text-muted-foreground">
{c.orders} orders
</p>

</div>

<div>

₹{c.revenue}

</div>

</div>
))}

</div>

</div>

);

};

export default CustomersSection;
