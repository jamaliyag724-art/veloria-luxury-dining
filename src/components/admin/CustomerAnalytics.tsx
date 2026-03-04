import React from "react"

const customers=[
{name:"Aarav Patel",orders:18,spent:4200},
{name:"Riya Shah",orders:14,spent:3600},
{name:"Kabir Mehta",orders:11,spent:2800},
{name:"Neha Desai",orders:9,spent:2100}
]

const CustomerAnalytics=()=>{

return(

<div className="bg-[#121214] border border-[#1f1f23] rounded-2xl p-7">

<h2 className="mb-6 text-lg">
Customer Analytics
</h2>

<div className="space-y-4">

{customers.map(c=>(
<div key={c.name}
className="flex justify-between border-b border-[#1f1f23] pb-3"
>

<div>

<p>{c.name}</p>
<p className="text-sm text-gray-400">
{c.orders} orders
</p>

</div>

<p className="text-[#d4af37]">
₹{c.spent}
</p>

</div>
))}

</div>

</div>

)

}

export default CustomerAnalytics
