import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, X, Trash2, Check, AlertTriangle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fmtINR, UTILITY_TYPES } from "@/lib/finance";

const UtilityBillsSection = () => {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<any>({ bill_type: "Electricity", amount: 0, due_date: new Date().toISOString().slice(0,10), status: "pending", notes: "" });
  const { toast } = useToast();

  const load = useCallback(async () => {
    const { data } = await supabase.from("utility_bills").select("*").order("due_date");
    setItems(data || []);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel("util-rt").on("postgres_changes", { event: "*", schema: "public", table: "utility_bills" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const save = async () => {
    await supabase.from("utility_bills").insert([{ ...form, amount: Number(form.amount) }]);
    setShow(false); setForm({ bill_type: "Electricity", amount: 0, due_date: new Date().toISOString().slice(0,10), status: "pending", notes: "" });
    toast({ title: "Bill added" });
  };

  const pay = async (id: string) => {
    await supabase.from("utility_bills").update({ status: "paid", payment_date: new Date().toISOString().slice(0,10) }).eq("id", id);
  };

  const today = new Date().toISOString().slice(0,10);
  const upcoming = items.filter(b => b.status==="pending" && b.due_date >= today && new Date(b.due_date).getTime() - Date.now() < 7*86400000);
  const overdue = items.filter(b => b.status==="pending" && b.due_date < today);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold font-serif">Utility Bills</h1>
        <button onClick={()=>setShow(!show)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm">
          {show?<X size={16}/>:<Plus size={16}/>} {show?"Close":"Add Bill"}
        </button>
      </div>

      {(upcoming.length>0 || overdue.length>0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {overdue.length>0 && (
            <div className="bg-card border border-red-500/30 rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-red-400 mb-3"><AlertTriangle size={16}/> Overdue ({overdue.length})</h3>
              {overdue.map(b => <p key={b.id} className="text-sm text-muted-foreground">{b.bill_type} — {fmtINR(Number(b.amount))} · due {b.due_date}</p>)}
            </div>
          )}
          {upcoming.length>0 && (
            <div className="bg-card border border-amber-500/30 rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-amber-400 mb-3"><Clock size={16}/> Upcoming ({upcoming.length})</h3>
              {upcoming.map(b => <p key={b.id} className="text-sm text-muted-foreground">{b.bill_type} — {fmtINR(Number(b.amount))} · due {b.due_date}</p>)}
            </div>
          )}
        </div>
      )}

      {show && (
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} className="bg-card border border-border rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select value={form.bill_type} onChange={e=>setForm({...form,bill_type:e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm">
              {UTILITY_TYPES.map(t=> <option key={t}>{t}</option>)}
            </select>
            <input type="number" placeholder="Amount" value={form.amount||""} onChange={e=>setForm({...form,amount:+e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input type="date" value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
          </div>
          <button onClick={save} className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm">Save</button>
        </motion.div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-muted-foreground">
            <th className="text-left p-4">Type</th><th className="text-right p-4">Amount</th>
            <th className="text-left p-4">Due</th><th className="text-left p-4">Paid On</th>
            <th className="text-left p-4">Status</th><th></th>
          </tr></thead>
          <tbody>
            {items.map(b=>(
              <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="p-4 font-medium">{b.bill_type}</td>
                <td className="p-4 text-right">{fmtINR(Number(b.amount))}</td>
                <td className="p-4 text-muted-foreground">{b.due_date}</td>
                <td className="p-4 text-muted-foreground">{b.payment_date || "—"}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-lg text-xs ${b.status==="paid"?"bg-emerald-500/10 text-emerald-400":b.due_date<today?"bg-red-500/10 text-red-400":"bg-amber-500/10 text-amber-400"}`}>{b.status==="paid"?"Paid":b.due_date<today?"Overdue":"Pending"}</span></td>
                <td className="p-4 flex gap-2">
                  {b.status==="pending" && <button onClick={()=>pay(b.id)} className="text-muted-foreground hover:text-emerald-400"><Check size={14}/></button>}
                  <button onClick={()=>supabase.from("utility_bills").delete().eq("id",b.id)} className="text-muted-foreground hover:text-red-400"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
            {items.length===0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No bills tracked yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UtilityBillsSection;
