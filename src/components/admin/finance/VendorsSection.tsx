import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, X, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fmtINR } from "@/lib/finance";

const VendorsSection = () => {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ name: "", contact: "", email: "", products_supplied: "", total_purchases: 0, outstanding_balance: 0, notes: "" });
  const { toast } = useToast();

  const load = useCallback(async () => {
    const { data } = await supabase.from("vendors").select("*").order("name");
    setItems(data || []);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel("vend-rt").on("postgres_changes", { event: "*", schema: "public", table: "vendors" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const save = async () => {
    if (!form.name) return toast({ title: "Name required", variant: "destructive" });
    const payload = { ...form, total_purchases: Number(form.total_purchases), outstanding_balance: Number(form.outstanding_balance) };
    if (editId) await supabase.from("vendors").update(payload).eq("id", editId);
    else await supabase.from("vendors").insert([payload]);
    setShow(false); setEditId(null); setForm({ name: "", contact: "", email: "", products_supplied: "", total_purchases: 0, outstanding_balance: 0, notes: "" });
    toast({ title: "Saved" });
  };

  const totalOut = items.reduce((s,v)=>s+Number(v.outstanding_balance||0),0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold font-serif">Vendors</h1>
          <p className="text-sm text-muted-foreground mt-1">Outstanding: <span className="text-amber-400">{fmtINR(totalOut)}</span></p>
        </div>
        <button onClick={()=>{setShow(!show); setEditId(null);}} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm">
          {show?<X size={16}/>:<Plus size={16}/>} {show?"Close":"Add Vendor"}
        </button>
      </div>

      {show && (
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} className="bg-card border border-border rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input placeholder="Vendor Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input placeholder="Contact" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input placeholder="Products Supplied" value={form.products_supplied} onChange={e=>setForm({...form,products_supplied:e.target.value})} className="col-span-2 bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input type="number" placeholder="Total Purchases" value={form.total_purchases||""} onChange={e=>setForm({...form,total_purchases:+e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input type="number" placeholder="Outstanding Balance" value={form.outstanding_balance||""} onChange={e=>setForm({...form,outstanding_balance:+e.target.value})} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
          </div>
          <button onClick={save} className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm">{editId?"Update":"Save"}</button>
        </motion.div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-muted-foreground">
            <th className="text-left p-4">Name</th><th className="text-left p-4">Contact</th>
            <th className="text-left p-4">Products</th><th className="text-right p-4">Purchases</th>
            <th className="text-right p-4">Outstanding</th><th></th>
          </tr></thead>
          <tbody>
            {items.map(v=>(
              <tr key={v.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="p-4 font-medium">{v.name}</td>
                <td className="p-4 text-muted-foreground">{v.contact || "—"}</td>
                <td className="p-4 text-muted-foreground">{v.products_supplied || "—"}</td>
                <td className="p-4 text-right">{fmtINR(Number(v.total_purchases))}</td>
                <td className="p-4 text-right text-amber-400">{fmtINR(Number(v.outstanding_balance))}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={()=>{setEditId(v.id); setForm(v); setShow(true);}} className="text-muted-foreground hover:text-primary"><Pencil size={14}/></button>
                  <button onClick={()=>supabase.from("vendors").delete().eq("id",v.id)} className="text-muted-foreground hover:text-red-400"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
            {items.length===0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No vendors yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorsSection;
