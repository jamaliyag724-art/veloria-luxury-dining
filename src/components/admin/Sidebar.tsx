import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  Brain
} from "lucide-react";

const menu = [
  { id:"dashboard", label:"Dashboard", icon:LayoutDashboard },
  { id:"analytics", label:"Analytics", icon:BarChart3 },
  { id:"customers", label:"Customers", icon:Users },
  { id:"ai", label:"AI Insights", icon:Brain },
  { id:"operations", label:"Operations", icon:Settings }
];

const Sidebar = ({section,setSection}:any)=>{

  return(

    <aside className="w-64 border-r border-border bg-card p-6">

      <h1 className="text-xl font-serif mb-10">
        Veloria Admin
      </h1>

      <div className="space-y-2">

        {menu.map(item=>{

          const Icon = item.icon

          return(

            <button
            key={item.id}
            onClick={()=>setSection(item.id)}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition
            ${section===item.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}
            `}
            >

              <Icon size={18}/>

              {item.label}

            </button>

          )

        })}

      </div>

    </aside>

  )

}

export default Sidebar
