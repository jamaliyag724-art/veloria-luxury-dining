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

import BusinessHealthSection from "@/components/admin/finance/BusinessHealthSection";
import ExpensesSection from "@/components/admin/finance/ExpensesSection";
import ProfitLossSection from "@/components/admin/finance/ProfitLossSection";
import PayrollSection from "@/components/admin/finance/PayrollSection";
import UtilityBillsSection from "@/components/admin/finance/UtilityBillsSection";
import VendorsSection from "@/components/admin/finance/VendorsSection";
import FoodCostSection from "@/components/admin/finance/FoodCostSection";
import OwnerAISection from "@/components/admin/finance/OwnerAISection";
import ReportsSection from "@/components/admin/finance/ReportsSection";

import {
  LayoutDashboard, BarChart3, Users, Brain, Settings, Calendar,
  ChefHat, Package, UserCog, Grid3X3,
  Wallet, Receipt, TrendingUp, Banknote, Zap, Truck, FileText, Sparkles, Activity,
} from "lucide-react";

const groups = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "business-health", label: "Business Health", icon: Activity },
    ],
  },
  {
    label: "Operations",
    items: [
      { id: "kitchen", label: "Kitchen", icon: ChefHat },
      { id: "tables", label: "Tables", icon: Grid3X3 },
      { id: "inventory", label: "Inventory", icon: Package },
      { id: "staff", label: "Staff", icon: UserCog },
      { id: "reservations", label: "Reservations", icon: Calendar },
      { id: "customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "expenses", label: "Expenses", icon: Receipt },
      { id: "profit-loss", label: "Profit & Loss", icon: TrendingUp },
      { id: "payroll", label: "Payroll", icon: Banknote },
      { id: "utility-bills", label: "Utility Bills", icon: Zap },
      { id: "vendors", label: "Vendors", icon: Truck },
      { id: "food-cost", label: "Food Cost", icon: ChefHat },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { id: "owner-ai", label: "Owner AI", icon: Sparkles },
      { id: "insights", label: "AI Insights", icon: Brain },
      { id: "reports", label: "Reports", icon: FileText },
      { id: "operations-settings", label: "Operations", icon: Settings },
    ],
  },
];

const Admin = () => {
  const [tab, setTab] = useState("dashboard");

  const renderSection = () => {
    switch (tab) {
      case "analytics": return <AnalyticsSection />;
      case "business-health": return <BusinessHealthSection />;
      case "kitchen": return <KitchenDisplay />;
      case "tables": return <TableOccupancyMap />;
      case "inventory": return <InventorySection />;
      case "staff": return <StaffSection />;
      case "customers": return <CustomersSection />;
      case "reservations": return <ReservationsSection />;
      case "expenses": return <ExpensesSection />;
      case "profit-loss": return <ProfitLossSection />;
      case "payroll": return <PayrollSection />;
      case "utility-bills": return <UtilityBillsSection />;
      case "vendors": return <VendorsSection />;
      case "food-cost": return <FoodCostSection />;
      case "owner-ai": return <OwnerAISection />;
      case "insights": return <AIInsights />;
      case "reports": return <ReportsSection />;
      case "operations-settings": return <OperationsSection />;
      default: return <DashboardSection />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-border p-6 flex flex-col overflow-y-auto"
      >
        <div className="flex items-center gap-2 mb-8">
          <Wallet className="text-primary" size={20}/>
          <h1 className="font-serif text-xl">Veloria Admin</h1>
        </div>
        <nav className="space-y-6 flex-1">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-2 px-3">{g.label}</p>
              <div className="space-y-1">
                {g.items.map((item) => {
                  const Icon = item.icon;
                  const active = tab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 2 }}
                      onClick={() => setTab(item.id)}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-all ${
                        active
                          ? "bg-primary/15 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </motion.aside>

      <main className="flex-1 p-10 overflow-auto">
        {renderSection()}
      </main>
    </div>
  );
};

export default Admin;
