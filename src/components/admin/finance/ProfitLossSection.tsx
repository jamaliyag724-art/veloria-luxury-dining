import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useOrders } from "@/context/OrderContext";
import { fmtINR } from "@/lib/finance";

const COLORS = ["#D4AF37","#B8860B","#8B6914","#DAA520","#CD853F","#BDB76B","#A0522D","#C19A6B","#9E7B4F","#8C7853","#7C6940","#6B5B3A","#5C4A28"];

const ProfitLossSection = () => {
  const { orders } = useOrders();
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("expenses").select("*");
      setExpenses(data || []);
    };
    load();
    const ch = supabase.channel("pl-exp").on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const revenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const totalExp = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const grossProfit = revenue * 0.7;
  const netProfit = revenue - totalExp;
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  const now = new Date();
  const monthExp = expenses.filter(e => new Date(e.expense_date).getMonth() === now.getMonth() && new Date(e.expense_date).getFullYear() === now.getFullYear())
    .reduce((s,e)=>s+Number(e.amount||0),0);
  const monthRev = orders.filter((o:any)=>{const d=new Date(o.createdAt||o.created_at);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();})
    .reduce((s,o:any)=>s+(o.totalAmount||0),0);

  const months = Array.from({length:6},(_,i)=>{const d=new Date(); d.setMonth(d.getMonth()-(5-i)); return d;});
  const trend = months.map(d => {
    const rev = orders.filter((o:any)=>{const od=new Date(o.createdAt||o.created_at);return od.getMonth()===d.getMonth()&&od.getFullYear()===d.getFullYear();}).reduce((s,o:any)=>s+(o.totalAmount||0),0);
    const exp = expenses.filter(e=>{const ed=new Date(e.expense_date);return ed.getMonth()===d.getMonth()&&ed.getFullYear()===d.getFullYear();}).reduce((s,e)=>s+Number(e.amount||0),0);
    return { month: d.toLocaleString("en", { month: "short" }), Revenue: rev, Expenses: exp, Profit: rev - exp };
  });

  const byCategory = Object.values(expenses.reduce((acc: any, e) => {
    acc[e.category] = acc[e.category] || { name: e.category, value: 0 };
    acc[e.category].value += Number(e.amount || 0);
    return acc;
  }, {})) as any[];

  const cards = [
    { label: "Total Revenue", value: fmtINR(revenue), icon: DollarSign, color: "text-emerald-400" },
    { label: "Total Expenses", value: fmtINR(totalExp), icon: TrendingDown, color: "text-red-400" },
    { label: "Gross Profit", value: fmtINR(grossProfit), icon: TrendingUp, color: "text-primary" },
    { label: "Net Profit", value: fmtINR(netProfit), icon: TrendingUp, color: netProfit >= 0 ? "text-emerald-400" : "text-red-400" },
    { label: "Monthly Revenue", value: fmtINR(monthRev), icon: DollarSign, color: "text-emerald-400" },
    { label: "Monthly Expenses", value: fmtINR(monthExp), icon: TrendingDown, color: "text-red-400" },
    { label: "Monthly Profit", value: fmtINR(monthRev - monthExp), icon: TrendingUp, color: "text-primary" },
    { label: "Profit Margin", value: `${margin.toFixed(1)}%`, icon: Percent, color: "text-primary" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold font-serif">Profit & Loss</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-muted-foreground">{c.label}</span><c.icon size={16} className={c.color}/></div>
            <p className={`text-xl font-semibold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-serif text-lg mb-4">Revenue vs Expenses</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}/>
              <Legend/>
              <Bar dataKey="Revenue" fill="#D4AF37" radius={[6,6,0,0]}/>
              <Bar dataKey="Expenses" fill="#8B6914" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-serif text-lg mb-4">Monthly Profit Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}/>
              <Line type="monotone" dataKey="Profit" stroke="#D4AF37" strokeWidth={3} dot={{ fill:"#D4AF37" }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-serif text-lg mb-4">Expense Breakdown</h2>
        {byCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {byCategory.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        ) : <p className="text-muted-foreground text-center py-8">No expense data yet</p>}
      </div>
    </div>
  );
};

export default ProfitLossSection;
