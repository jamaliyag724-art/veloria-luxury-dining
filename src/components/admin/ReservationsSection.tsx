import React from "react";
import { useReservations } from "@/context/ReservationContext";

const ReservationsSection = () => {

const { reservations, updateReservationStatus } = useReservations();

return (

{reservations.map((r) => (

{r.fullName}

{r.date} {r.time}

{r.guests}

<select

value={r.status}

onChange={(e) =>
updateReservationStatus(
r.reservationId,
e.target.value as any
)
}

className="bg-card border border-border rounded px-2 py-1"




))}

);

};

export default ReservationsSection;
