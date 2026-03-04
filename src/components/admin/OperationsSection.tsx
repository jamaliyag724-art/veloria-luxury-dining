import React from "react";
import { useOrders } from "@/context/OrderContext";

const OperationsSection = () => {

const { orders, updateOrderStatus } = useOrders();

return (

<div className="space-y-6">

<h1 className="text-2xl font-serif">
Orders
</h1>

<div className="bg-card border border-border rounded-xl p-6">

<table className="w-full text-sm">

<thead>

<tr className="text-muted-foreground">

<th className="text-left pb-3">Customer</th>
<th>Amount</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{orders.map((o) => (

<tr key={o.orderId} className="border-t border-border">

<td className="py-3">

{o.fullName}

</td>

<td>

₹{o.totalAmount}

</td>

<td>

<select

value={o.orderStatus}

onChange={(e) =>
updateOrderStatus(
o.orderId,
e.target.value as any
)
}

className="bg-card border border-border rounded px-2 py-1"

>

<option value="Pending">Pending</option>
<option value="Preparing">Preparing</option>
<option value="Completed">Completed</option>
<option value="Cancelled">Cancelled</option>

</select>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

};

export default OperationsSection;
