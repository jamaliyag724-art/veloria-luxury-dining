import React from "react"

const predictions=[
{
dish:"Truffle Pasta",
demand:"+22%"
},
{
dish:"Lobster Risotto",
demand:"+18%"
},
{
dish:"Steak",
demand:"+12%"
}
]

const AIDemandPrediction=()=>{

return(

<div className="bg-[#121214] border border-[#1f1f23] rounded-2xl p-7">

<h2 className="mb-6 text-lg">
AI Demand Prediction
</h2>

<div className="space-y-4">

{predictions.map(p=>(
<div
key={p.dish}
className="flex justify-between"
>

<p>{p.dish}</p>

<p className="text-green-400">
{p.demand}
</p>

</div>
))}

</div>

</div>

)

}

export default AIDemandPrediction
