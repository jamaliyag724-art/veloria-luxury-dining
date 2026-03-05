import React, { useState } from "react";
import { motion } from "framer-motion";

import DashboardSection from "@/components/admin/DashboardSection";
import AnalyticsSection from "@/components/admin/AnalyticsSection";
import CustomersSection from "@/components/admin/CustomersSection";
import OperationsSection from "@/components/admin/OperationsSection";
import ReservationsSection from "@/components/admin/ReservationsSection";
import AIInsights from "@/components/admin/AIInsights";
import KitchenDisplay from "@/components/admin/KitchenDisplay";
import InventorySection from "@/components/admin/InventorySection";
import StaffSection from "@/components/admin/StaffSection";
import TableOccupancyMap from "@/components/admin/TableOccupancyMap";

import {
  LayoutDashboard, BarChart3, Users, Brain, Settings, Calendar,
  ChefHat, Package, UserCog, Grid3X3
} from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "kitchen", label: "Kitchen", icon: ChefHat },
  { id: "tables", label: "Tables", icon: Grid3X3 },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "staff", label: "Staff", icon: UserCog },
  { id: "reservations", label: "Reservations", icon: Calendar },
  { id: "customers", label: "Customers", icon: Users },
  { id: "insights", label: "AI Insights", icon: Brain },
  { id: "operations", label: "Operations", icon: Settings },
];

const Admin = () => {
  const [tab, setTab] = useState("dashboard");

  const renderSection = () => {
    switch (tab) {
      case "analytics": return <AnalyticsSection />;
      case "kitchen": return <KitchenDisplay />;
      case "tables": return <TableOccupancyMap />;
      case "inventory": return <InventorySection />;
      case "staff": return <StaffSection />;
      case "customers": return <CustomersSection />;
      case "reservations": return <ReservationsSection />;
      case "insights": return <AIInsights />;
      case "operations": return <OperationsSection />;
      default: return <DashboardSection />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-border p-6 flex flex-col"
      >
        <h1 className="font-serif text-xl mb-8">Veloria Admin</h1>
        <nav className="space-y-1 flex-1">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 2 }}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </motion.button>
            );
          })}
        </nav>
      </motion.aside>

      {/* CONTENT */}
      <main className="flex-1 p-10 overflow-auto">
        {renderSection()}
      </main>
    </div>
  );
};

export default Admin;
