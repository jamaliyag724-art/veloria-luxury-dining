import React, { useEffect, useState } from "react";
import { ChefHat, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrders } from "@/context/OrderContext";
import { fmtINR } from "@/lib/finance";

const FoodCostSection = () => {
  const { orders } = useOrders();
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("inventory").select("*").then(({data})=>setInventory(data||[]));
  }, []);

  const itemStats = new Map<string,{name:string;qty:number;rev:number}>();
  orders.forEach((o:any) => {
    (o.items||[]).forEach((it:any) => {
      const k = it.name || it.id;
      const cur = itemStats.get(k) || { name: k, qty: 0, rev: 0 };
      cur.qty += it.quantity || 1;
      cur.rev += (it.price||0) * (it.quantity||1);
      itemStats.set(k, cur);
    });
  });

  const dishes = Array.from(itemStats.values()).map(d => {
    const cost = d.rev * 0.32; // assumed avg food cost
    const profit = d.rev - cost;
    return { ...d, cost, profit, margin: d.rev > 0 ? (profit/d.rev)*100 : 0 };
  }).sort((a,b)=>b.profit-a.profit);

  const totalRev = dishes.reduce((s,d)=>s+d.rev,0);
  const totalCost = dishes.reduce((s,d)=>s+d.cost,0);
  const foodCostPct = totalRev > 0 ? (totalCost/totalRev)*100 : 0;
  const inventoryValue = inventory.reduce((s,i)=>s + (i.stock_level||0) * 100, 0);

  const top = dishes.slice(0,5);
  const bottom = dishes.slice(-5).reverse();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold font-serif">Food Cost Analytics</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <Card label="Food Cost %" value={`${foodCostPct.toFixed(1)}%`} icon={ChefHat}/>
        <Card label="Total Food Cost" value={fmtINR(totalCost)} icon={TrendingDown}/>
        <Card label="Total Revenue" value={fmtINR(totalRev)} icon={TrendingUp}/>
        <Card label="Inventory Value" value={fmtINR(inventoryValue)} icon={ChefHat}/>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Most Profitable Dishes" data={top} positive/>
        <Panel title="Least Profitable Dishes" data={bottom}/>
      </div>
    </div>
  );
};

const Card = ({label,value,icon:Icon}:any) => (
  <div className="bg-card border border-border rounded-2xl p-5">
    <div className="flex items-center justify-between mb-2"><span className="text-xs text-muted-foreground">{label}</span><Icon size={16} className="text-primary"/></div>
    <p className="text-xl font-semibold text-primary">{value}</p>
  </div>
);

const Panel = ({title,data,positive}:{title:string;data:any[];positive?:boolean}) => (
  <div className="bg-card border border-border rounded-2xl p-6">
    <h2 className="font-serif text-lg mb-4">{title}</h2>
    <div className="space-y-3">
      {data.length===0 && <p className="text-muted-foreground text-sm">No data</p>}
      {data.map((d,i)=>(
        <div key={i} className="flex items-center justify-between p-3 bg-background rounded-xl">
          <div><p className="font-medium text-sm">{d.name}</p><p className="text-xs text-muted-foreground">{d.qty} sold · margin {d.margin.toFixed(1)}%</p></div>
          <p className={`font-semibold ${positive?"text-emerald-400":"text-amber-400"}`}>{fmtINR(d.profit)}</p>
        </div>
      ))}
    </div>
  </div>
);

export default FoodCostSection;
