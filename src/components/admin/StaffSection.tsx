import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Trash2, Users, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  contact: string;
  is_active: boolean;
}

const ROLES = ["Manager", "Chef", "Waiter", "Host", "Kitchen Staff", "Financial Analyst" , "Bartender" , "Security Guard", "Receptionist"];
const SHIFTS = ["All Day"];

const StaffSection = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", role: "Waiter", shift: "All Day", contact: "" });
  const { toast } = useToast();

  const fetch_ = useCallback(async () => {
    const { data } = await supabase.from("staff").select("*").order("name");
    setStaff((data as StaffMember[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch_();
    const ch = supabase.channel("staff-ch").on("postgres_changes", { event: "*", schema: "public", table: "staff" }, fetch_).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetch_]);

 const addStaff = async () => {
  if (!form.name.trim()) return;

  const { data, error } = await supabase
    .from("staff")
    .insert([form])
    .select();

  console.log("Inserted:", data);
  console.log("Error:", error);

  if (error) {
    toast({
      title: "Insert Failed",
      description: error.message,
      variant: "destructive",
    });
    return;
  }

  setForm({
    name: "",
    role: "Waiter",
    shift: "All Day",
    contact: "",
  });

  setShowAdd(false);

  toast({
    title: "Staff member added",
  });
};

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("staff").update({ is_active: !current }).eq("id", id);
  };

  const deleteStaff = async (id: string) => {
    await supabase.from("staff").delete().eq("id", id);
    toast({ title: "Staff member removed" });
  };

  const activeCount = staff.filter((s) => s.is_active).length;
  const byRole = ROLES.map((r) => ({ role: r, count: staff.filter((s) => s.role === r).length }));
  const byShift = SHIFTS.map((s) => ({ shift: s, count: staff.filter((st) => st.shift === s && st.is_active).length }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold font-serif">Staff Management</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-xl text-sm hover:bg-primary/30 transition">
          <UserPlus size={16} /> Add Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-sm">Total Staff</p>
          <p className="text-2xl font-semibold mt-1">{staff.length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-sm">Active Now</p>
          <p className="text-2xl font-semibold mt-1 text-emerald-400">{activeCount}</p>
        </div>
        {byShift.slice(0, 2).map((s) => (
          <div key={s.shift} className="bg-card border border-border rounded-2xl p-5">
            <p className="text-muted-foreground text-sm">{s.shift} Shift</p>
            <p className="text-2xl font-semibold mt-1">{s.count}</p>
          </div>
        ))}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-card border border-border rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm">
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
              <select value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm">
                {SHIFTS.map((s) => <option key={s}>{s}</option>)}
              </select>
              <input placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="bg-background border border-border rounded-xl px-4 py-2 text-sm" />
            </div>
            <button onClick={addStaff} className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm hover:opacity-90 transition">Save</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Staff Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Shift</th>
                <th className="text-left p-4">Contact</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4"></th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id} className="border-b border-border/50 hover:bg-muted/30 transition">
                  <td className="p-4 font-medium">{member.name}</td>
                  <td className="p-4"><span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs">{member.role}</span></td>
                  <td className="p-4 text-muted-foreground flex items-center gap-1"><Clock size={12} /> {member.shift}</td>
                  <td className="p-4 text-muted-foreground">{member.contact || "—"}</td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(member.id, member.is_active)} className={`px-2 py-1 rounded-lg text-xs transition ${member.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                      {member.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4"><button onClick={() => deleteStaff(member.id)} className="text-muted-foreground hover:text-red-400 transition"><Trash2 size={14} /></button></td>
                </tr>
              ))}
              {staff.length === 0 && !loading && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No staff members yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffSection;
