import React from "react"
import { motion } from "framer-motion"

const RevenueCard = ({title,value,icon:Icon})=>{

return(

<motion.div
whileHover={{y:-4}}
className="
relative
bg-[#121214]
border border-[#1f1f23]
rounded-2xl
p-6
shadow-[0_0_30px_rgba(0,0,0,0.6)]
transition
">

<div className="flex items-center justify-between mb-5">

<div className="bg-[#1f1f23] p-3 rounded-xl">
<Icon size={18} className="text-[#d4af37]"/>
</div>

</div>

<h2 className="text-2xl font-semibold text-white">
{value}
</h2>

<p className="text-sm text-gray-400">
{title}
</p>

</motion.div>

)

}

export default RevenueCard
