import React from "react";
import { useReservations } from "@/context/ReservationContext";

const ReservationsSection = () => {

const { reservations, updateReservationStatus } = useReservations();

return (

<div className="space-y-6">

<h1 className="text-2xl font-serif">
Reservations
</h1>

<div className="bg-card border border-border rounded-xl p-6">

<table className="w-full text-sm">

<thead>

<tr className="text-muted-foreground">

<th className="text-left pb-3">Customer</th>
<th>Date</th>
<th>Guests</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{reservations.map((r) => (

<tr key={r.reservationId} className="border-t border-border">

<td className="py-3">

{r.fullName}

</td>

<td>

{r.date} {r.time}

</td>

<td>

{r.guests}

</td>

<td>

<select

value={r.status}

onChange={(e) =>
updateReservationStatus(
r.reservationId,
e.target.value as any
)
}

className="bg-card border border-border rounded px-2 py-1"

>

<option value="Pending">Pending</option>
<option value="Confirmed">Confirmed</option>
<option value="Waiting">Waiting</option>
<option value="Rejected">Rejected</option>

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

export default ReservationsSection;
