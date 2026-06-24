import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrders } from "@/context/OrderContext";
import { fmtINR } from "@/lib/finance";

const OwnerAISection = () => {
  const { orders } = useOrders();
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("expenses").select("*").then(({data})=>setExpenses(data||[]));
  }, []);

  const now = new Date();
  const lm = new Date(now.getFullYear(), now.getMonth()-1, 1);
  const inMonth = (d: Date, ref: Date) => d.getMonth()===ref.getMonth() && d.getFullYear()===ref.getFullYear();

  const revThis = orders.filter((o:any)=>inMonth(new Date(o.createdAt||o.created_at),now)).reduce((s,o:any)=>s+(o.totalAmount||0),0);
  const revLast = orders.filter((o:any)=>inMonth(new Date(o.createdAt||o.created_at),lm)).reduce((s,o:any)=>s+(o.totalAmount||0),0);
  const expThis = expenses.filter(e=>inMonth(new Date(e.expense_date),now)).reduce((s,e)=>s+Number(e.amount),0);
  const expLast = expenses.filter(e=>inMonth(new Date(e.expense_date),lm)).reduce((s,e)=>s+Number(e.amount),0);

  const revGrowth = revLast>0 ? ((revThis-revLast)/revLast)*100 : 0;
  const expGrowth = expLast>0 ? ((expThis-expLast)/expLast)*100 : 0;
  const forecast = (revThis - expThis) * 1.08;

  const insights: {text:string; type:"good"|"warn"|"info"}[] = [];
  if (revGrowth > 5) insights.push({ text: `Revenue grew ${revGrowth.toFixed(1)}% versus last month — momentum is strong.`, type: "good" });
  if (revGrowth < -5) insights.push({ text: `Revenue declined ${Math.abs(revGrowth).toFixed(1)}% — review marketing & menu mix.`, type: "warn" });
  if (expGrowth > 10) insights.push({ text: `Expenses increased ${expGrowth.toFixed(1)}% this month — audit top categories.`, type: "warn" });
  const byCat: Record<string, number> = {};
  expenses.filter(e=>inMonth(new Date(e.expense_date),now)).forEach(e=>{ byCat[e.category]=(byCat[e.category]||0)+Number(e.amount); });
  const topCat = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
  if (topCat) insights.push({ text: `${topCat[0]} is your largest expense this month at ${fmtINR(topCat[1])}.`, type: "info" });

  const itemRev: Record<string, number> = {};
  orders.forEach((o:any)=>(o.items||[]).forEach((it:any)=>{ itemRev[it.name]=(itemRev[it.name]||0)+(it.price||0)*(it.quantity||1); }));
  const totalItemRev = Object.values(itemRev).reduce((s,v)=>s+v,0);
  const topDish = Object.entries(itemRev).sort((a,b)=>b[1]-a[1])[0];
  if (topDish && totalItemRev>0) insights.push({ text: `Top dish "${topDish[0]}" generated ${((topDish[1]/totalItemRev)*100).toFixed(1)}% of total revenue.`, type: "good" });
  insights.push({ text: `Expected next month profit: ${fmtINR(forecast)}.`, type: "info" });
  if (insights.length === 0) insights.push({ text: "Add more orders & expenses to unlock deeper insights.", type: "info" });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold font-serif flex items-center gap-3"><Brain className="text-primary"/> Owner Insights AI</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Stat label="Revenue Growth" value={`${revGrowth.toFixed(1)}%`} positive={revGrowth>=0} icon={revGrowth>=0?TrendingUp:TrendingDown}/>
        <Stat label="Expense Growth" value={`${expGrowth.toFixed(1)}%`} positive={expGrowth<=0} icon={expGrowth<=0?TrendingDown:TrendingUp}/>
        <Stat label="Profit Forecast" value={fmtINR(forecast)} positive={forecast>=0} icon={Sparkles}/>
      </div>

      <div className="bg-gradient-to-br from-primary/10 via-card to-card border border-primary/30 rounded-2xl p-6">
        <h2 className="font-serif text-lg mb-4 flex items-center gap-2"><Sparkles size={18} className="text-primary"/> AI Recommendations</h2>
        <div className="space-y-3">
          {insights.map((ins,i)=>(
            <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}
              className={`p-4 rounded-xl border ${ins.type==="good"?"bg-emerald-500/5 border-emerald-500/20 text-emerald-300":ins.type==="warn"?"bg-amber-500/5 border-amber-500/20 text-amber-300":"bg-primary/5 border-primary/20"}`}>
              <p className="text-sm">{ins.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Stat = ({label,value,positive,icon:Icon}:any) => (
  <div className="bg-card border border-border rounded-2xl p-5">
    <div className="flex items-center justify-between mb-2"><span className="text-xs text-muted-foreground">{label}</span><Icon size={16} className={positive?"text-emerald-400":"text-red-400"}/></div>
    <p className={`text-xl font-semibold ${positive?"text-emerald-400":"text-red-400"}`}>{value}</p>
  </div>
);

export default OwnerAISection;
