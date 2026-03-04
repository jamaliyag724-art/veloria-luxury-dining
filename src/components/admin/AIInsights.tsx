import React from "react";

const insights = [

{
title:"Peak Revenue Time",
description:"Most revenue occurs between 7PM - 9PM."
},

{
title:"Top Dish",
description:"Truffle Burrata is trending this week."
},

{
title:"Customer Pattern",
description:"Weekend reservations are 35% higher."
}

]

const AIInsights = ()=>{

return(

<div className="grid md:grid-cols-3 gap-6">

{insights.map((i,index)=>(
<div
key={index}
className="bg-card border border-border rounded-xl p-6"
>

<h3 className="font-semibold mb-2">
{i.title}
</h3>

<p className="text-sm text-muted-foreground">
{i.description}
</p>

</div>
))}

</div>

)

}

export default AIInsights
