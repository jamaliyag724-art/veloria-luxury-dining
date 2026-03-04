import React, { useState } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";

import DashboardSection from "@/components/admin/DashboardSection";
import AnalyticsSection from "@/components/admin/AnalyticsSection";
import CustomersSection from "@/components/admin/CustomersSection";
import OperationsSection from "@/components/admin/OperationsSection";
import AISection from "@/components/admin/AISection";

const Admin = () => {

  const [section, setSection] = useState("dashboard");

  return (

    <div className="flex min-h-screen bg-background text-foreground">

      <AdminSidebar section={section} setSection={setSection}/>

      <main className="flex-1 p-10">

        {section === "dashboard" && <DashboardSection/>}
        {section === "analytics" && <AnalyticsSection/>}
        {section === "customers" && <CustomersSection/>}
        {section === "operations" && <OperationsSection/>}
        {section === "ai" && <AISection/>}

      </main>

    </div>

  );
};

export default Admin;
