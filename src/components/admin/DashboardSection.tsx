import React from "react"

import RevenueCard from "./RevenueCard"
import RevenueChart from "./RevenueChart"
import OrdersChart from "./OrdersChart"
import { useOrders } from "@/context/OrderContext"

import {
DollarSign,
ShoppingCart,
Users,
BarChart3
} from "lucide-react"

const DashboardSection=()=>{
const { orders } = useOrders()

return(

<div className="space-y-10">

<h1 className="text-3xl font-semibold">
Veloria Analytics
</h1>

<div className="grid md:grid-cols-4 gap-6">

<RevenueCard
title="Revenue"
value="₹5400"
icon={DollarSign}
/>

<RevenueCard
title="Orders"
value="27"
icon={ShoppingCart}
/>

<RevenueCard
title="Avg Order"
value="₹203"
icon={BarChart3}
/>

<RevenueCard
title="Customers"
value="27"
icon={Users}
/>

</div>

<div className="grid lg:grid-cols-2 gap-8">

<RevenueChart/>

<OrdersChart orders={orders} dateRange="30days" />

</div>

</div>

)

}

export default DashboardSection
