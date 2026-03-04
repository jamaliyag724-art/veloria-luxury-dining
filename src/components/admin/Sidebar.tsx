import React from "react"
import { motion } from "framer-motion"
import {
LayoutDashboard,
BarChart3,
Users,
Brain,
Settings
} from "lucide-react"

const menu = [
{ id:"dashboard", label:"Dashboard", icon:LayoutDashboard },
{ id:"analytics", label:"Analytics", icon:BarChart3 },
{ id:"customers", label:"Customers", icon:Users },
{ id:"ai", label:"AI Insights", icon:Brain },
{ id:"operations", label:"Operations", icon:Settings }
]

const Sidebar = ({section,setSection}:any)=>{

return(

<motion.aside
initial={{x:-60,opacity:0}}
animate={{x:0,opacity:1}}
className="w-64 bg-[#0e0e10] border-r border-[#1f1f23] p-6"
>

<h1 className="text-xl mb-10 font-serif">
Veloria Admin
</h1>

<div className="space-y-2">

{menu.map(item=>{

const Icon=item.icon

return(

<motion.button
whileHover={{scale:1.03}}
key={item.id}
onClick={()=>setSection(item.id)}
className={`flex items-center gap-3 w-full p-3 rounded-xl transition
${section===item.id
? "bg-[#d4af37]/20 text-[#d4af37]"
: "text-gray-400 hover:bg-[#1a1a1d]"
}`}
>

<Icon size={18}/>

{item.label}

</motion.button>

)

})}

</div>

</motion.aside>

)

}

export default Sidebar
