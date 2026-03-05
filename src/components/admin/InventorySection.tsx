import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Package, AlertTriangle, TrendingDown, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock_level: number;
  unit: string;
  reorder_level: number;
  usage_rate_per_day: number;
  last_restocked_at: string;
}

const InventorySection = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "General", stock_level: 0, unit: "kg", reorder_level: 5, usage_rate_per_day: 1 });
  const { toast } = useToast();

  const fetch_ = useCallback(async () => {
    const { data } = await supabase.from("inventory").select("*").order("name");
    setItems((data as InventoryItem[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch_();
    const ch = supabase.channel("inv").on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, fetch_).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetch_]);

  const addItem = async () => {
    if (!newItem.name.trim()) return;
    await supabase.from("inventory").insert([newItem]);
    setNewItem({ name: "", category: "General", stock_level: 0, unit: "kg", reorder_level: 5, usage_rate_per_day: 1 });
    setShowAdd(false);
    toast({ title: "Ingredient added" });
  };

  const deleteItem = async (id: string) => {
    await supabase.from("inventory").delete().eq("id", id);
    toast({ title: "Ingredient removed" });
  };

  const getDaysRemaining = (item: InventoryItem) =>
    item.usage_rate_per_day > 0 ? Math.round(item.stock_level / item.usage_rate_per_day) : Infinity;

  const getStockStatus = (item: InventoryItem) => {
    const days = getDaysRemaining(item);
    if (item.stock_level <= 0) return { label: "Out of Stock", color: "text-red-400 bg-red-500/10" };
    if (days <= 2) return { label: "Critical", color: "text-red-400 bg-red-500/10" };
    if (item.stock_level <= item.reorder_level) return { label: "Low Stock", color: "text-amber-400 bg-amber-500/10" };
    return { label: "In Stock", color: "text-emerald-400 bg-emerald-500/10" };
  };

  const predictions = items
    .filter((i) => getDaysRemaining(i) <= 3 && getDaysRemaining(i) !== Infinity)
    .sort((a, b) => getDaysRemaining(a) - getDaysRemaining(b))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold font-serif">Inventory</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-xl text-sm hover:bg-primary/30 transition">
          <Plus size={16} /> Add Ingredient
        </button>
      </div>

      {/* AI Predictions */}
      {predictions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-amber-500/20 rounded-2xl p-6">
          <h2 className="flex items-center gap-2 font-serif text-lg mb-4">
            <AlertTriangle size={18} className="text-amber-400" /> AI Predictions
          </h2>
          <div className="space-y-2">
            {predictions.map((item) => (
              <p key={item.id} className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">{item.name}</span> — stock may run out in{" "}
                <span className="text-amber-400 font-semibold">{getDaysRemaining(item)} day{getDaysRemaining(item) !== 1 ? "s" : ""}</span>
              </p>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add Form */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card border border-border rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm" />
            <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm">
              <option>General</option><option>Protein</option><option>Dairy</option><option>Produce</option><option>Oils</option><option>Spices</option><option>Grains</option>
            </select>
            <input type="number" placeholder="Stock" value={newItem.stock_level || ""} onChange={(e) => setNewItem({ ...newItem, stock_level: +e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm" />
            <select value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm">
              <option>kg</option><option>liters</option><option>pieces</option><option>bottles</option><option>packs</option>
            </select>
            <input type="number" placeholder="Reorder Level" value={newItem.reorder_level || ""} onChange={(e) => setNewItem({ ...newItem, reorder_level: +e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm" />
            <input type="number" placeholder="Daily Usage" value={newItem.usage_rate_per_day || ""} onChange={(e) => setNewItem({ ...newItem, usage_rate_per_day: +e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm" />
          </div>
          <button onClick={addItem} className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm hover:opacity-90 transition">Save</button>
        </motion.div>
      )}

      {/* Inventory Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-4">Ingredient</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Usage/Day</th>
                <th className="text-left p-4">Days Left</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const status = getStockStatus(item);
                const days = getDaysRemaining(item);
                return (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition">
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4 text-muted-foreground">{item.category}</td>
                    <td className="p-4">{item.stock_level} {item.unit}</td>
                    <td className="p-4 text-muted-foreground">{item.usage_rate_per_day} {item.unit}</td>
                    <td className="p-4">{days === Infinity ? "∞" : `${days}d`}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded-lg text-xs ${status.color}`}>{status.label}</span></td>
                    <td className="p-4"><button onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-red-400 transition"><Trash2 size={14} /></button></td>
                  </tr>
                );
              })}
              {items.length === 0 && !loading && (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No inventory items yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventorySection;
