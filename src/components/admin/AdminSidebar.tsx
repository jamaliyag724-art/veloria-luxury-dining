import React from "react";
import { motion } from "framer-motion";
import {
LayoutDashboard,
BarChart3,
Users,
CalendarDays,
Brain,
Settings
} from "lucide-react";

const items = [
{ id:"dashboard", label:"Dashboard", icon:LayoutDashboard },
{ id:"analytics", label:"Analytics", icon:BarChart3 },
{ id:"customers", label:"Customers", icon:Users },
{ id:"reservations", label:"Reservations", icon:CalendarDays },
{ id:"ai", label:"AI Insights", icon:Brain },
{ id:"operations", label:"Operations", icon:Settings }
];

interface Props{
active:string
setActive:(s:string)=>void
}

const AdminSidebar:React.FC<Props> = ({active,setActive})=>{

return(

<motion.aside
initial={{x:-40,opacity:0}}
animate={{x:0,opacity:1}}
className="w-64 border-r border-border bg-card p-6"

>

<h1 className="font-serif text-xl mb-8">
Veloria Admin
</h1>

<div className="space-y-3">

{items.map(item=>{

const Icon=item.icon

return(

<button
key={item.id}
onClick={()=>setActive(item.id)}
className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
active===item.id
?"bg-primary/10 text-primary"
:"hover:bg-muted"
}`}

>

<Icon size={18}/>
{item.label}

</button>

)

})}

</div>

</motion.aside>

)

}

export default AdminSidebar
