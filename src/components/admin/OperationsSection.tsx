import React from "react";
import RecentOrders from "./RecentOrders";

const OperationsSection = () => {

  const orders = [];

  return (

    <div>

      <h2 className="text-xl font-serif mb-6">
        Operations
      </h2>

      <RecentOrders orders={orders}/>

    </div>

  );

};

export default OperationsSection;
