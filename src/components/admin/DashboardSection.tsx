import React from "react";
import RevenueCard from "./RevenueCard";

const DashboardSection = () => {

  return (

    <div className="space-y-10">

      <div className="grid md:grid-cols-4 gap-6">

        <RevenueCard title="Revenue" value={5400}/>
        <RevenueCard title="Orders" value={27}/>
        <RevenueCard title="Avg Order" value={203}/>
        <RevenueCard title="Customers" value={27}/>

      </div>

    </div>

  );

};

export default DashboardSection;
