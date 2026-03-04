import React from "react";
import RevenueCard from "./RevenueCard";
import RevenueChart from "./RevenueChart";
import OrdersChart from "./OrdersChart";

import { DollarSign, ShoppingCart, Users, BarChart3 } from "lucide-react";

const DashboardSection = () => {

  const orders = [];

  return (

    <div className="space-y-10">

      <div className="grid md:grid-cols-4 gap-6">

        <RevenueCard
          title="Revenue"
          value={5400}
          icon={DollarSign}
          isCurrency
        />

        <RevenueCard
          title="Orders"
          value={27}
          icon={ShoppingCart}
        />

        <RevenueCard
          title="Avg Order"
          value={203}
          icon={BarChart3}
          isCurrency
        />

        <RevenueCard
          title="Customers"
          value={27}
          icon={Users}
        />

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <RevenueChart orders={orders} />

        <OrdersChart
          orders={orders}
          dateRange="30days"
        />

      </div>

    </div>

  );

};

export default DashboardSection;
