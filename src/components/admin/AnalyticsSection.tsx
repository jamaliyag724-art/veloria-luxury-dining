import React from "react";
import { useOrders } from "@/context/OrderContext";
import { useReservations } from "@/context/ReservationContext";

import TopItemsChart from "./TopItemsChart";
import OrderStatusChart from "./OrderStatusChart";
import PeakHoursChart from "./PeakHoursChart";
import ReservationChart from "./ReservationChart";
import ReservationHeatmap from "./ReservationHeatmap";

import ReservationCalendar from "./ReservationCalendar";
import DemandPrediction from "./DemandPrediction";
import DishProfitability from "./DishProfitability";
import RevenueForecast from "./RevenueForecast";

const AnalyticsSection = () => {

  const { orders } = useOrders();
  const { reservations } = useReservations();

  return (

    <div className="space-y-10">

      {/* Order Analytics */}

      <div className="grid lg:grid-cols-2 gap-8">

        <TopItemsChart orders={orders} />

        <OrderStatusChart orders={orders} />

      </div>


      {/* Reservation Analytics */}

      <div className="grid lg:grid-cols-2 gap-8">

        <ReservationChart reservations={reservations} />

        <PeakHoursChart orders={orders} />

      </div>


      {/* Reservation Heatmap */}

      <ReservationHeatmap reservations={reservations} />


      {/* Business Analytics */}

      <div className="grid lg:grid-cols-2 gap-8">

        <DishProfitability />

        <RevenueForecast />

      </div>


      {/* AI Insights */}

      <div className="grid lg:grid-cols-2 gap-8">

        <DemandPrediction />

        <ReservationCalendar />

      </div>

    </div>

  );

};

export default AnalyticsSection;
