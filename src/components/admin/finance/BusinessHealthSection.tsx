// BusinessHealthSection.tsx
import React, { useEffect, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Users, Clock, AlertTriangle, DollarSign, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrders } from "@/context/OrderContext";
import { useReservations } from "@/context/ReservationContext";
import { fmtINR } from "@/lib/finance";

const BusinessHealthSection = () => {
  const { orders } = useOrders();
  const { reservations } = useReservations();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [e,p,v,b] = await Promise.all([
        supabase.from("expenses").select("*"),
        supabase.from("payroll").select("*"),
        supabase.from("vendors").select("*"),
        supabase.from("utility_bills").select("*"),
      ]);
      setExpenses(e.data||[]); setPayroll(p.data||[]); setVendors(v.data||[]); setBills(b.data||[]);
    };
    load();
    const ch = supabase.channel("biz-health")
      .on("postgres_changes",{event:"*",schema:"public",table:"expenses"},load)
      .on("postgres_changes",{event:"*",schema:"public",table:"payroll"},load)
      .on("postgres_changes",{event:"*",schema:"public",table:"vendors"},load)
      .on("postgres_changes",{event:"*",schema:"public",table:"utility_bills"},load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const today = new Date().toISOString().slice(0,10);
  const now = new Date();
  const isThisMonth = (d: Date) => d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();

  const todayOrderRev = orders.filter((o:any)=>(new Date(o.createdAt||o.created_at).toISOString().slice(0,10))===today).reduce((s,o:any)=>s+(o.totalAmount||0),0);
  const todayReservationRev = reservations.filter((r:any)=>(new Date(r.createdAt||r.created_at).toISOString().slice(0,10))===today).reduce((s,r:any)=>s+(r.reservationAmount||0),0);
  const todayRev = todayOrderRev + todayReservationRev;
  const todayExp = expenses.filter(e=>e.expense_date===today).reduce((s,e)=>s+Number(e.amount),0);

  const monthOrderRev = orders.filter((o:any)=>isThisMonth(new Date(o.createdAt||o.created_at))).reduce((s,o:any)=>s+(o.totalAmount||0),0);
  const monthReservationRev = reservations.filter((r:any)=>isThisMonth(new Date(r.createdAt||r.created_at))).reduce((s,r:any)=>s+(r.reservationAmount||0),0);
  const monthRev = monthOrderRev + monthReservationRev;
  const monthExp = expenses.filter(e=>isThisMonth(new Date(e.expense_date))).reduce((s,e)=>s+Number(e.amount),0);

  const totalOrderRev = orders.reduce((s,o:any)=>s+(o.totalAmount||0),0);
  const totalReservationRev = reservations.reduce((s,r:any)=>s+(r.reservationAmount||0),0);
  const totalRev = totalOrderRev + totalReservationRev;
  const totalExp = expenses.reduce((s,e)=>s+Number(e.amount),0);
  const cashInHand = totalRev - totalExp;
  const pendingSalaries = payroll.filter(p=>p.status==="pending").reduce((s,p)=>s+Number(p.net_pay),0);
  const pendingVendors = vendors.reduce((s,v)=>s+Number(v.outstanding_balance||0),0);
  const upcomingBills = bills.filter(b=>b.status==="pending").reduce((s,b)=>s+Number(b.amount),0);

  const cards = [
    { label: "Today's Revenue", value: fmtINR(todayRev), icon: DollarSign, color: "from-emerald-500/20 to-emerald-500/5", text: "text-emerald-400" },
    { label: "Today's Expenses", value: fmtINR(todayExp), icon: TrendingDown, color: "from-red-500/20 to-red-500/5", text: "text-red-400" },
    { label: "Today's Profit", value: fmtINR(todayRev - todayExp), icon: TrendingUp, color: "from-primary/20 to-primary/5", text: "text-primary" },
    { label: "Monthly Revenue", value: fmtINR(monthRev), icon: DollarSign, color: "from-emerald-500/20 to-emerald-500/5", text: "text-emerald-400" },
    { label: "Monthly Expenses", value: fmtINR(monthExp), icon: TrendingDown, color: "from-red-500/20 to-red-500/5", text: "text-red-400" },
    { label: "Monthly Profit", value: fmtINR(monthRev - monthExp), icon: TrendingUp, color: "from-primary/20 to-primary/5", text: "text-primary" },
    { label: "Cash In Hand", value: fmtINR(cashInHand), icon: Wallet, color: "from-primary/20 to-primary/5", text: "text-primary" },
    { label: "Pending Salaries", value: fmtINR(pendingSalaries), icon: Users, color: "from-amber-500/20 to-amber-500/5", text: "text-amber-400" },
    { label: "Pending Vendors", value: fmtINR(pendingVendors), icon: Package, color: "from-amber-500/20 to-amber-500/5", text: "text-amber-400" },
    { label: "Upcoming Bills", value: fmtINR(upcomingBills), icon: Clock, color: "from-amber-500/20 to-amber-500/5", text: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold font-serif">Business Health</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(c=>(
          <div key={c.label} className={`bg-gradient-to-br ${c.color} border border-border rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{c.label}</span>
              <c.icon size={16} className={c.text}/>
            </div>
            <p className={`text-xl font-semibold ${c.text}`}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHealthSection;
