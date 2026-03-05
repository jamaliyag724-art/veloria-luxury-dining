import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RestaurantTable {
  id: string;
  table_number: number;
  capacity: number;
  status: string;
  position_x: number;
  position_y: number;
  customer_name: string | null;
  reservation_time: string | null;
  guests: number | null;
}

const statusColors: Record<string, { bg: string; border: string; label: string }> = {
  available: { bg: "bg-emerald-500/20", border: "border-emerald-500/50", label: "Available" },
  occupied: { bg: "bg-red-500/20", border: "border-red-500/50", label: "Occupied" },
  reserved: { bg: "bg-amber-500/20", border: "border-amber-500/50", label: "Reserved" },
};

const TableOccupancyMap = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [selected, setSelected] = useState<RestaurantTable | null>(null);
  const [assignForm, setAssignForm] = useState({ customer_name: "", reservation_time: "", guests: 2 });
  const { toast } = useToast();

  const fetch_ = useCallback(async () => {
    const { data } = await supabase.from("restaurant_tables").select("*").order("table_number");
    setTables((data as RestaurantTable[]) || []);
  }, []);

  useEffect(() => {
    fetch_();
    const ch = supabase.channel("tables-ch").on("postgres_changes", { event: "*", schema: "public", table: "restaurant_tables" }, fetch_).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetch_]);

  const updateTable = async (id: string, updates: Partial<RestaurantTable>) => {
    await supabase.from("restaurant_tables").update(updates).eq("id", id);
    setSelected(null);
    toast({ title: "Table updated" });
  };

  const releaseTable = (id: string) =>
    updateTable(id, { status: "available", customer_name: null, reservation_time: null, guests: null });

  const occupyTable = (id: string) =>
    updateTable(id, {
      status: "occupied",
      customer_name: assignForm.customer_name || "Walk-in",
      reservation_time: assignForm.reservation_time || new Date().toLocaleTimeString(),
      guests: assignForm.guests,
    });

  const stats = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold font-serif">Table Occupancy</h1>
        <div className="flex gap-4 text-sm">
          {Object.entries(statusColors).map(([key, val]) => (
            <span key={key} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${val.bg} border ${val.border}`} />
              {val.label} ({stats[key as keyof typeof stats]})
            </span>
          ))}
        </div>
      </div>

      {/* Floor Map */}
      <div className="bg-card border border-border rounded-2xl p-8 relative min-h-[500px]">
        <div className="grid grid-cols-4 gap-6">
          {tables.map((table) => {
            const st = statusColors[table.status] || statusColors.available;
            return (
              <motion.button
                key={table.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelected(table); setAssignForm({ customer_name: table.customer_name || "", reservation_time: table.reservation_time || "", guests: table.guests || 2 }); }}
                className={`${st.bg} border-2 ${st.border} rounded-2xl p-6 text-center transition-all hover:shadow-lg`}
              >
                <p className="text-2xl font-bold font-mono">{table.table_number}</p>
                <p className="text-xs text-muted-foreground mt-1">Seats {table.capacity}</p>
                <p className={`text-xs mt-2 font-medium`}>{st.label}</p>
                {table.customer_name && <p className="text-xs text-muted-foreground mt-1 truncate">{table.customer_name}</p>}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Table Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-2xl p-8 w-full max-w-md space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-xl">Table {selected.table_number}</h2>
                <button onClick={() => setSelected(null)}><X size={18} /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Status</p><p className="font-medium capitalize">{selected.status}</p></div>
                <div><p className="text-muted-foreground">Capacity</p><p className="font-medium">{selected.capacity} seats</p></div>
                {selected.customer_name && <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selected.customer_name}</p></div>}
                {selected.reservation_time && <div><p className="text-muted-foreground">Time</p><p className="font-medium">{selected.reservation_time}</p></div>}
                {selected.guests && <div><p className="text-muted-foreground">Guests</p><p className="font-medium">{selected.guests}</p></div>}
              </div>

              {selected.status === "available" && (
                <div className="space-y-3 border-t border-border pt-4">
                  <p className="text-sm font-medium">Assign Table</p>
                  <input placeholder="Customer Name" value={assignForm.customer_name} onChange={(e) => setAssignForm({ ...assignForm, customer_name: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm" />
                  <input type="number" placeholder="Guests" value={assignForm.guests} onChange={(e) => setAssignForm({ ...assignForm, guests: +e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm" />
                  <button onClick={() => occupyTable(selected.id)} className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-sm hover:opacity-90 transition">Mark Occupied</button>
                </div>
              )}

              {(selected.status === "occupied" || selected.status === "reserved") && (
                <button onClick={() => releaseTable(selected.id)} className="w-full bg-emerald-500/20 text-emerald-400 py-2 rounded-xl text-sm hover:bg-emerald-500/30 transition">Release Table</button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TableOccupancyMap;
