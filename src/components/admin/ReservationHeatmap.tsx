import React from "react"

const hours=[
"12PM","1PM","2PM","3PM","4PM",
"5PM","6PM","7PM","8PM","9PM"
]

const ReservationHeatmap=()=>{

return(

<div className="bg-[#121214] border border-[#1f1f23] rounded-2xl p-7">

<h2 className="mb-6 text-lg">
Reservation Heatmap
</h2>

<div className="grid grid-cols-5 gap-4">

{hours.map(h=>(
<div
key={h}
className="p-4 rounded-lg bg-[#d4af37]/20 text-[#d4af37] text-center"
>
{h}
</div>
))}

</div>

</div>

)

}

export default ReservationHeatmap
