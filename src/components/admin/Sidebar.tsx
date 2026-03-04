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
  setSection: (s: string) => void;
}

const Sidebar: React.FC<Props> = ({ section, setSection }) => {

  const Item = ({
    icon: Icon,
    label,
    id
  }: any) => (

    <button
      onClick={() => setSection(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition
      ${section === id
        ? "bg-primary text-black"
        : "hover:bg-muted"}
      `}
    >

      <Icon className="w-5 h-5"/>

      {label}

    </button>

  );

  return (

    <aside className="w-64 border-r border-border h-screen p-6">

      <h2 className="font-serif text-xl mb-8">
        Veloria Admin
      </h2>

      <div className="space-y-2">

        <Item id="dashboard" label="Dashboard" icon={LayoutDashboard}/>
        <Item id="analytics" label="Analytics" icon={BarChart3}/>
        <Item id="customers" label="Customers" icon={Users}/>
        <Item id="operations" label="Operations" icon={ClipboardList}/>
        <Item id="ai" label="AI Insights" icon={Sparkles}/>

      </div>

    </aside>

  );

};

export default Sidebar;
