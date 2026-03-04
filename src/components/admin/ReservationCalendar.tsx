import React from "react";
import { useReservations } from "@/context/ReservationContext";

const ReservationCalendar = ()=>{

const { reservations } = useReservations()

const grouped = reservations.reduce((acc:any,r)=>{

if(!acc[r.date]) acc[r.date]=[]

acc[r.date].push(r)

return acc

},{});

return(

<div className="bg-card border border-border rounded-xl p-6">

<h2 className="font-serif text-lg mb-6">
Reservation Calendar
</h2>

<div className="grid grid-cols-7 gap-4 text-sm">

{Object.keys(grouped).map(date=>(

<div
key={date}
className="p-3 border border-border rounded-lg"
>

<p className="font-medium">{date}</p>

<p className="text-muted-foreground text-xs">

{grouped[date].length} bookings

</p>

</div>

))}

</div>

</div>

)

}

export default ReservationCalendar
