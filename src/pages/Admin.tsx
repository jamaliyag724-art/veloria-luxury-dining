import React, { useState } from "react";

import DashboardSection from "@/components/admin/DashboardSection";
import AnalyticsSection from "@/components/admin/AnalyticsSection";
import CustomersSection from "@/components/admin/CustomersSection";
import OperationsSection from "@/components/admin/OperationsSection";
import ReservationsSection from "@/components/admin/ReservationsSection";
import AIInsights from "@/components/admin/AIInsights";

import { LayoutDashboard, BarChart3, Users, Brain, Settings, Calendar } from "lucide-react";

const Admin = () => {

const [tab, setTab] = useState("dashboard");

const renderSection = () => {

switch (tab) {

case "analytics":
return <AnalyticsSection />;

case "customers":
return <CustomersSection />;

case "reservations":
return <ReservationsSection />;

case "insights":
return <AIInsights />;

case "operations":
return <OperationsSection />;

default:
return <DashboardSection />;

}

};

return (

<div className="flex min-h-screen bg-background text-foreground">

{/* SIDEBAR */}

<aside className="w-64 border-r border-border p-6 space-y-4">

<h1 className="font-serif text-xl mb-8">
Veloria Admin
</h1>

<button onClick={() => setTab("dashboard")} className="flex items-center gap-3 w-full"> <LayoutDashboard size={18}/> Dashboard </button>

<button onClick={() => setTab("analytics")} className="flex items-center gap-3 w-full"> <BarChart3 size={18}/> Analytics </button>

<button onClick={() => setTab("customers")} className="flex items-center gap-3 w-full"> <Users size={18}/> Customers </button>

<button onClick={() => setTab("reservations")} className="flex items-center gap-3 w-full"> <Calendar size={18}/> Reservations </button>

<button onClick={() => setTab("insights")} className="flex items-center gap-3 w-full"> <Brain size={18}/> AI Insights </button>

<button onClick={() => setTab("operations")} className="flex items-center gap-3 w-full"> <Settings size={18}/> Operations </button>

</aside>

{/* CONTENT */}

<main className="flex-1 p-10">

{renderSection()}

</main>

</div>

);

};

export default Admin;
