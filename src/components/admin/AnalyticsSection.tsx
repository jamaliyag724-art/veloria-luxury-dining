import React from "react";
import TopItemsChart from "./TopItemsChart";
import OrderStatusChart from "./OrderStatusChart";
import PeakHoursChart from "./PeakHoursChart";

const AnalyticsSection = () => {

  return (

    <div className="space-y-10">

      <div className="grid lg:grid-cols-2 gap-8">

        <TopItemsChart/>

        <OrderStatusChart/>

      </div>

      <PeakHoursChart/>

    </div>

  );

};

export default AnalyticsSection;
