import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Receipt, Pencil, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, fmtINR } from "@/lib/finance";

interface Expense {
  id: string; category: string; amount: number; expense_date: string;
  vendor: string | null; notes: string | null; payment_method: string | null; receipt_url: string | null;
}

const empty = { category: "Miscellaneous", amount: 0, expense_date: new Date().toISOString().slice(0,10), vendor: "", notes: "", payment_method: "Cash", receipt_url: "" };

const ExpensesSection = () => {
  const [items, setItems] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(empty);
  const { toast } = useToast();

  const load = useCallback(async () => {
    const { data } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false });
    setItems((data as Expense[]) || []);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel("expenses-rt").on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const save = async () => {
    if (!form.category || !form.amount) return toast({ title: "Category & amount required", variant: "destructive" });
    const payload = { ...form, amount: Number(form.amount) };
    if (editingId) await supabase.from("expenses").update(payload).eq("id", editingId);
    else await supabase.from("expenses").insert([payload]);
    setForm(empty); setEditingId(null); setShowForm(false);
    toast({ title: editingId ? "Expense updated" : "Expense added" });
  };

  const edit = (e: Expense) => { setEditingId(e.id); setForm({ ...e }); setShowForm(true); };
  const del = async (id: string) => { await supabase.from("expenses").delete().eq("id", id); toast({ title: "Deleted" }); };

  const total = items.reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold font-serif">Expenses</h1>
          <p className="text-sm text-muted-foreground mt-1">Total tracked: <span className="text-primary font-medium">{fmtINR(total)}</span></p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(empty); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm hover:opacity-90">
          {showForm ? <X size={16}/> : <Plus size={16}/>} {showForm ? "Close" : "Add Expense"}
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card border border-border rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm">
              {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Amount" value={form.amount || ""} onChange={e => setForm({ ...form, amount: +e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input type="date" value={form.expense_date} onChange={e => setForm({ ...form, expense_date: e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input placeholder="Vendor" value={form.vendor || ""} onChange={e => setForm({ ...form, vendor: e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <select value={form.payment_method || "Cash"} onChange={e => setForm({ ...form, payment_method: e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm">
              {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
            <input placeholder="Receipt URL" value={form.receipt_url || ""} onChange={e => setForm({ ...form, receipt_url: e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <textarea placeholder="Notes" value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} className="col-span-2 md:col-span-3 bg-background border border-border rounded-xl px-4 py-2 text-sm" rows={2}/>
          </div>
          <button onClick={save} className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm">{editingId ? "Update" : "Save"}</button>
        </motion.div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-muted-foreground">
            <th className="text-left p-4">Date</th><th className="text-left p-4">Category</th><th className="text-left p-4">Vendor</th>
            <th className="text-left p-4">Method</th><th className="text-right p-4">Amount</th><th className="text-left p-4">Receipt</th><th></th>
          </tr></thead>
          <tbody>
            {items.map(e => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="p-4">{e.expense_date}</td>
                <td className="p-4"><span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs">{e.category}</span></td>
                <td className="p-4 text-muted-foreground">{e.vendor || "—"}</td>
                <td className="p-4 text-muted-foreground">{e.payment_method || "—"}</td>
                <td className="p-4 text-right font-medium">{fmtINR(Number(e.amount))}</td>
                <td className="p-4">{e.receipt_url ? <a href={e.receipt_url} target="_blank" rel="noreferrer" className="text-primary"><Receipt size={14}/></a> : "—"}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => edit(e)} className="text-muted-foreground hover:text-primary"><Pencil size={14}/></button>
                  <button onClick={() => del(e.id)} className="text-muted-foreground hover:text-red-400"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No expenses recorded yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesSection;
