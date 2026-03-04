import React from "react";
import { useOrders } from "@/context/OrderContext";
import { useReservations } from "@/context/ReservationContext";

import TopItemsChart from "./TopItemsChart";
import OrderStatusChart from "./OrderStatusChart";
import PeakHoursChart from "./PeakHoursChart";
import ReservationChart from "./ReservationChart";
import ReservationHeatmap from "./ReservationHeatmap";

const AnalyticsSection = () => {

  const { orders } = useOrders();
  const { reservations } = useReservations();

  return (

    <div className="space-y-10">

      <div className="grid lg:grid-cols-2 gap-8">

        <TopItemsChart orders={orders} />

        <OrderStatusChart orders={orders} />

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <ReservationChart reservations={reservations} />

        <PeakHoursChart orders={orders} />

      </div>

      <ReservationHeatmap reservations={reservations} />

    </div>

  );

};

export default AnalyticsSection;
