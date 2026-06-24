import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, X, Trash2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fmtINR } from "@/lib/finance";

interface Payroll {
  id: string; staff_name: string; period: string; base_salary: number;
  bonus: number; deductions: number; advance: number; overtime: number; net_pay: number; status: string;
}

const PayrollSection = () => {
  const [items, setItems] = useState<Payroll[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [slipFor, setSlipFor] = useState<Payroll | null>(null);
  const [form, setForm] = useState<any>({ staff_name: "", period: new Date().toISOString().slice(0,7), base_salary: 0, bonus: 0, deductions: 0, advance: 0, overtime: 0, status: "pending" });
  const { toast } = useToast();

  const load = useCallback(async () => {
    const { data } = await supabase.from("payroll").select("*").order("created_at", { ascending: false });
    setItems((data as Payroll[]) || []);
  }, []);

  useEffect(() => {
    load();
    supabase.from("staff").select("*").then(({ data }) => setStaff(data || []));
    const ch = supabase.channel("pay-rt").on("postgres_changes", { event: "*", schema: "public", table: "payroll" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const save = async () => {
    if (!form.staff_name) return toast({ title: "Select staff", variant: "destructive" });
    const net = Number(form.base_salary) + Number(form.bonus) + Number(form.overtime) - Number(form.deductions) - Number(form.advance);
    await supabase.from("payroll").insert([{ ...form, net_pay: net }]);
    setShow(false); setForm({ staff_name: "", period: new Date().toISOString().slice(0,7), base_salary: 0, bonus: 0, deductions: 0, advance: 0, overtime: 0, status: "pending" });
    toast({ title: "Payroll added" });
  };

  const markPaid = async (id: string) => {
    await supabase.from("payroll").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", id);
    toast({ title: "Marked as paid" });
  };

  const del = async (id: string) => { await supabase.from("payroll").delete().eq("id", id); };

  const totalPay = items.reduce((s,p)=>s+Number(p.net_pay),0);
  const pending = items.filter(p=>p.status==="pending").reduce((s,p)=>s+Number(p.net_pay),0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold font-serif">Payroll</h1>
          <p className="text-sm text-muted-foreground mt-1">Total: <span className="text-primary">{fmtINR(totalPay)}</span> · Pending: <span className="text-amber-400">{fmtINR(pending)}</span></p>
        </div>
        <button onClick={()=>setShow(!show)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm">
          {show ? <X size={16}/> : <Plus size={16}/>} {show ? "Close" : "New Payroll"}
        </button>
      </div>

      {show && (
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} className="bg-card border border-border rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select value={form.staff_name} onChange={e=>setForm({...form,staff_name:e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm">
              <option value="">Select staff</option>
              {staff.map(s=> <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <input type="month" value={form.period} onChange={e=>setForm({...form,period:e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input type="number" placeholder="Base Salary" value={form.base_salary||""} onChange={e=>setForm({...form,base_salary:+e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input type="number" placeholder="Bonus" value={form.bonus||""} onChange={e=>setForm({...form,bonus:+e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input type="number" placeholder="Deductions" value={form.deductions||""} onChange={e=>setForm({...form,deductions:+e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input type="number" placeholder="Advance" value={form.advance||""} onChange={e=>setForm({...form,advance:+e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input type="number" placeholder="Overtime" value={form.overtime||""} onChange={e=>setForm({...form,overtime:+e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
          </div>
          <button onClick={save} className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm">Save Payroll</button>
        </motion.div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-muted-foreground">
            <th className="text-left p-4">Staff</th><th className="text-left p-4">Period</th>
            <th className="text-right p-4">Base</th><th className="text-right p-4">Bonus</th>
            <th className="text-right p-4">Deduct</th><th className="text-right p-4">Net</th>
            <th className="text-left p-4">Status</th><th></th>
          </tr></thead>
          <tbody>
            {items.map(p=>(
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="p-4 font-medium">{p.staff_name}</td>
                <td className="p-4 text-muted-foreground">{p.period}</td>
                <td className="p-4 text-right">{fmtINR(Number(p.base_salary))}</td>
                <td className="p-4 text-right text-emerald-400">{fmtINR(Number(p.bonus))}</td>
                <td className="p-4 text-right text-red-400">{fmtINR(Number(p.deductions)+Number(p.advance))}</td>
                <td className="p-4 text-right font-semibold text-primary">{fmtINR(Number(p.net_pay))}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-lg text-xs ${p.status==="paid"?"bg-emerald-500/10 text-emerald-400":"bg-amber-500/10 text-amber-400"}`}>{p.status}</span></td>
                <td className="p-4 flex gap-2">
                  <button onClick={()=>setSlipFor(p)} className="text-muted-foreground hover:text-primary"><FileText size={14}/></button>
                  {p.status==="pending" && <button onClick={()=>markPaid(p.id)} className="text-muted-foreground hover:text-emerald-400"><Check size={14}/></button>}
                  <button onClick={()=>del(p.id)} className="text-muted-foreground hover:text-red-400"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
            {items.length===0 && <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No payroll records yet</td></tr>}
          </tbody>
        </table>
      </div>

      {slipFor && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={()=>setSlipFor(null)}>
          <div className="bg-card border border-primary/30 rounded-2xl p-8 max-w-md w-full" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div><h3 className="font-serif text-xl text-primary">Salary Slip</h3><p className="text-xs text-muted-foreground">Veloria Luxury Dining</p></div>
              <button onClick={()=>setSlipFor(null)}><X size={18}/></button>
            </div>
            <div className="space-y-3 text-sm">
              <Row k="Employee" v={slipFor.staff_name}/>
              <Row k="Period" v={slipFor.period}/>
              <hr className="border-border"/>
              <Row k="Base Salary" v={fmtINR(Number(slipFor.base_salary))}/>
              <Row k="Bonus" v={fmtINR(Number(slipFor.bonus))} positive/>
              <Row k="Overtime" v={fmtINR(Number(slipFor.overtime))} positive/>
              <Row k="Deductions" v={fmtINR(Number(slipFor.deductions))} negative/>
              <Row k="Advance" v={fmtINR(Number(slipFor.advance))} negative/>
              <hr className="border-border"/>
              <div className="flex justify-between text-lg font-semibold text-primary"><span>Net Pay</span><span>{fmtINR(Number(slipFor.net_pay))}</span></div>
              <p className="text-xs text-muted-foreground text-center pt-4">Status: {slipFor.status.toUpperCase()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Row = ({k,v,positive,negative}:{k:string;v:string;positive?:boolean;negative?:boolean}) =>
  <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className={positive?"text-emerald-400":negative?"text-red-400":""}>{v}</span></div>;

export default PayrollSection;
