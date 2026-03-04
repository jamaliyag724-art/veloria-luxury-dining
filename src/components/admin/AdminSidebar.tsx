import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ClipboardList,
  Sparkles
} from "lucide-react";

interface Props {
  section: string;
  setSection: (section: string) => void;
}

const AdminSidebar: React.FC<Props> = ({ section, setSection }) => {
  const menu = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "operations", label: "Operations", icon: ClipboardList },
    { id: "ai", label: "AI Insights", icon: Sparkles },
  ];

  return (
    <div className="w-64 bg-black text-white flex flex-col p-6 gap-6">

      <h1 className="text-2xl font-serif mb-6">Veloria Admin</h1>

      {menu.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            className={`flex items-center gap-3 p-3 rounded-lg transition
            ${section === item.id ? "bg-zinc-800" : "hover:bg-zinc-900"}`}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default AdminSidebar;
