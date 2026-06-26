import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Receipt, Pencil, X, Search, SlidersHorizontal, Download, Printer,
  Copy, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, IndianRupee,
  TrendingUp, CalendarDays, Wallet, Clock3, BarChart3, PieChart as PieChartIcon,
  CheckSquare, Square, AlertTriangle, Loader2, FileSpreadsheet, LayoutDashboard,
  Table2, FileBarChart, CircleDollarSign, Repeat, ChevronsUpDown, RotateCcw,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fmtINR } from "@/lib/finance";

/* ============================================================================
 * Veloria Luxury Dining — Expenses Management (Enterprise ERP module)
 * Requires `recharts` for the analytics charts (already used elsewhere in
 * this ERP for the Dashboard/P&L modules). If it isn't installed yet:
 *   npm i recharts
 * ========================================================================== */

interface Expense {
  id: string;
  category: string;
  amount: number;
  expense_date: string;
  vendor: string | null;
  notes: string | null;
  payment_method: string | null;
  receipt_url: string | null;
  gst_percent?: number | null;
  gst_amount?: number | null;
  total_amount?: number | null;
  status?: string | null;
  reference_number?: string | null;
  invoice_number?: string | null;
  description?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  is_recurring?: boolean | null;
}

type FormState = {
  category: string;
  vendor: string;
  amount: number | "";
  gst_percent: number | "";
  gst_amount: number;
  total_amount: number;
  expense_date: string;
  payment_method: string;
  status: string;
  reference_number: string;
  invoice_number: string;
  description: string;
  notes: string;
  receipt_url: string;
  is_recurring: boolean;
};

const CATEGORIES = [
  "Kitchen Supplies", "Vegetables", "Seafood", "Meat", "Dairy", "Beverages",
  "Electricity", "Water", "Gas", "Internet", "Maintenance", "Cleaning",
  "Uniform", "Staff Welfare", "Marketing", "Advertising", "Rent", "Repairs",
  "Taxes", "Licenses", "Office Supplies", "Furniture", "Equipment", "Miscellaneous",
];

const PAYMENT_METHODS = ["Cash", "UPI", "Credit Card", "Debit Card", "Net Banking", "Cheque", "Bank Transfer"];
const STATUSES = ["Paid", "Pending", "Partially Paid", "Cancelled", "Refunded"];
const DATE_PRESETS = ["All Time", "Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "This Year", "Custom"];
const REPORT_TYPES = ["Daily", "Weekly", "Monthly", "Yearly", "Category", "Vendor", "GST"] as const;
const PAGE_SIZES = [10, 25, 50, 100];
const GST_DEFAULT = 18;

const GOLD_PALETTE = ["#D4AF37", "#C9A227", "#E5C158", "#B8860B", "#F0CB67", "#8B6914", "#FFD966", "#A67C00", "#CDA434", "#705400"];

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  "Partially Paid": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
  Refunded: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
};

const todayStr = () => new Date().toISOString().slice(0, 10);

const emptyForm: FormState = {
  category: "Miscellaneous",
  vendor: "",
  amount: "",
  gst_percent: GST_DEFAULT,
  gst_amount: 0,
  total_amount: 0,
  expense_date: todayStr(),
  payment_method: "Cash",
  status: "Paid",
  reference_number: "",
  invoice_number: "",
  description: "",
  notes: "",
  receipt_url: "",
  is_recurring: false,
};

const calcGST = (amount: number, gstPercent: number) => {
  const gst = Math.round(amount * (gstPercent / 100) * 100) / 100;
  const total = Math.round((amount + gst) * 100) / 100;
  return { gst, total };
};

const displayId = (id?: string | null) => (id ? `EXP-${id.slice(0, 8).toUpperCase()}` : "—");

const groupSum = (rows: Expense[], keyFn: (e: Expense) => string) => {
  const map = new Map<string, number>();
  rows.forEach((e) => {
    const k = keyFn(e);
    map.set(k, (map.get(k) || 0) + Number(e.amount));
  });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
};

const weekKey = (d: Date) => {
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
  return `Wk ${week} '${String(d.getFullYear()).slice(-2)}`;
};

const monthKey = (d: Date) => `${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`;

const getDateRange = (preset: string, customFrom?: string, customTo?: string): { from?: Date; to?: Date } => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = (d: Date) => new Date(d.getTime() + 86399999);
  switch (preset) {
    case "Today":
      return { from: start, to: endOfDay(start) };
    case "Yesterday": {
      const y = new Date(start);
      y.setDate(y.getDate() - 1);
      return { from: y, to: endOfDay(y) };
    }
    case "Last 7 Days": {
      const f = new Date(start);
      f.setDate(f.getDate() - 6);
      return { from: f, to: endOfDay(start) };
    }
    case "Last 30 Days": {
      const f = new Date(start);
      f.setDate(f.getDate() - 29);
      return { from: f, to: endOfDay(start) };
    }
    case "This Month":
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59) };
    case "Last Month":
      return { from: new Date(now.getFullYear(), now.getMonth() - 1, 1), to: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59) };
    case "This Year":
      return { from: new Date(now.getFullYear(), 0, 1), to: new Date(now.getFullYear(), 11, 31, 23, 59, 59) };
    case "Custom":
      return { from: customFrom ? new Date(customFrom) : undefined, to: customTo ? new Date(`${customTo}T23:59:59`) : undefined };
    default:
      return {};
  }
};

const inRange = (dateStr: string, from?: Date, to?: Date) => {
  if (!from && !to) return true;
  const d = new Date(`${dateStr}T00:00:00`);
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
};

const exportCSV = (rows: Expense[], filename: string) => {
  const headers = ["Expense ID", "Date", "Category", "Vendor", "Amount", "GST %", "GST Amount", "Total Amount", "Payment Method", "Status", "Invoice No", "Reference No", "Description", "Notes"];
  const lines = rows.map((e) =>
    [
      displayId(e.id), e.expense_date, e.category, e.vendor || "", e.amount,
      e.gst_percent ?? 0, e.gst_amount ?? 0, e.total_amount ?? e.amount,
      e.payment_method || "", e.status || "", e.invoice_number || "", e.reference_number || "",
      (e.description || "").replace(/"/g, "'"), (e.notes || "").replace(/"/g, "'"),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const exportExcel = (rows: Expense[], filename: string) => {
  const headers = ["Expense ID", "Date", "Category", "Vendor", "Amount", "GST %", "GST Amount", "Total Amount", "Payment Method", "Status", "Invoice No", "Reference No"];
  const body = rows
    .map(
      (e) =>
        `<tr><td>${displayId(e.id)}</td><td>${e.expense_date}</td><td>${e.category}</td><td>${e.vendor || ""}</td><td>${e.amount}</td><td>${e.gst_percent ?? 0}</td><td>${e.gst_amount ?? 0}</td><td>${e.total_amount ?? e.amount}</td><td>${e.payment_method || ""}</td><td>${e.status || ""}</td><td>${e.invoice_number || ""}</td><td>${e.reference_number || ""}</td></tr>`
    )
    .join("");
  const html = `<html><head><meta charset="utf-8" /></head><body><table border="1"><thead><tr>${headers
    .map((h) => `<th>${h}</th>`)
    .join("")}</tr></thead><tbody>${body}</tbody></table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/* ---------------------------- small UI helpers --------------------------- */

const AnimatedCounter = ({ value, formatter }: { value: number; formatter: (v: number) => string }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = display;
    const end = value;
    const startTime = performance.now();
    const duration = 700;
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplay(start + (end - start) * progress);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span>{formatter(display)}</span>;
};

const SummaryCard = ({
  icon: Icon, label, value, sub,
}: { icon: any; label: string; value: React.ReactNode; sub?: string }) => (
  <motion.div whileHover={{ y: -3 }} className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur transition-shadow hover:shadow-lg hover:shadow-primary/5">
    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-colors group-hover:bg-primary/20" />
    <div className="mb-3 flex items-center justify-between">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <Icon size={15} className="text-primary" />
    </div>
    <div className="font-serif text-xl font-semibold text-foreground">{value}</div>
    {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
  </motion.div>
);

const Modal = ({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode; wide?: boolean }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm no-print"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
          className={`max-h-[85vh] w-full overflow-y-auto rounded-2xl border border-border bg-card p-6 ${wide ? "max-w-3xl" : "max-w-lg"}`}
        >
          {title && (
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">{title}</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
          )}
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-xl">
      <div className="mb-1 text-muted-foreground">{label}</div>
      {payload.map((p: any, idx: number) => (
        <div key={idx} className="font-medium text-foreground">{fmtINR(p.value)}</div>
      ))}
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    {children}
  </div>
);

const inputCls = "bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 w-full";

/* ================================================================== */

const ExpensesSection = () => {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [viewing, setViewing] = useState<Expense | null>(null);
  const [confirmState, setConfirmState] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [currentUserLabel, setCurrentUserLabel] = useState("System");

  const [tab, setTab] = useState<"overview" | "transactions" | "analytics">("overview");

  // search / filters
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    preset: "All Time", customFrom: "", customTo: "",
    category: "All", vendor: "All", paymentMethod: "All", status: "All",
  });

  // sort / pagination / selection
  const [sortKey, setSortKey] = useState<string>("expense_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // analytics
  const [reportType, setReportType] = useState<typeof REPORT_TYPES[number]>("Monthly");

  const { toast } = useToast();

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false });
    if (!error) setItems((data as Expense[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("expenses-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load]);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (data?.user?.email) setCurrentUserLabel(data.user.email);
      })
      .catch(() => {});
  }, []);

  // auto compute GST + total whenever amount / gst% change
  useEffect(() => {
    const amt = Number(form.amount) || 0;
    const gstP = Number(form.gst_percent) || 0;
    const { gst, total } = calcGST(amt, gstP);
    setForm((f) => ({ ...f, gst_amount: gst, total_amount: total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.amount, form.gst_percent]);

  useEffect(() => {
    setPage(1);
  }, [search, filters, pageSize]);

  /* ----------------------------- derived data ----------------------------- */

  const vendorOptions = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.vendor).filter(Boolean) as string[])).sort()],
    [items]
  );

  const filtered = useMemo(() => {
    let list = items;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (e) =>
          e.category.toLowerCase().includes(q) ||
          (e.vendor || "").toLowerCase().includes(q) ||
          (e.notes || "").toLowerCase().includes(q) ||
          displayId(e.id).toLowerCase().includes(q) ||
          String(e.amount).includes(q) ||
          (e.payment_method || "").toLowerCase().includes(q) ||
          (e.invoice_number || "").toLowerCase().includes(q) ||
          (e.reference_number || "").toLowerCase().includes(q)
      );
    }
    const { from, to } = getDateRange(filters.preset, filters.customFrom, filters.customTo);
    if (from || to) list = list.filter((e) => inRange(e.expense_date, from, to));
    if (filters.category !== "All") list = list.filter((e) => e.category === filters.category);
    if (filters.vendor !== "All") list = list.filter((e) => (e.vendor || "Unknown") === filters.vendor);
    if (filters.paymentMethod !== "All") list = list.filter((e) => (e.payment_method || "") === filters.paymentMethod);
    if (filters.status !== "All") list = list.filter((e) => (e.status || "Paid") === filters.status);
    return list;
  }, [items, search, filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av: any;
      let bv: any;
      if (sortKey === "total_amount") {
        av = a.total_amount ?? a.amount;
        bv = b.total_amount ?? b.amount;
      } else if (sortKey === "amount") {
        av = Number(a.amount);
        bv = Number(b.amount);
      } else {
        av = (a as any)[sortKey] ?? "";
        bv = (b as any)[sortKey] ?? "";
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(() => {
    const now = new Date();
    const ts = todayStr();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 6);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const total = items.reduce((s, i) => s + Number(i.amount), 0);
    const today = items.filter((i) => i.expense_date === ts).reduce((s, i) => s + Number(i.amount), 0);
    const week = items.filter((i) => new Date(`${i.expense_date}T00:00:00`) >= weekAgo).reduce((s, i) => s + Number(i.amount), 0);
    const month = items.filter((i) => new Date(`${i.expense_date}T00:00:00`) >= monthStart).reduce((s, i) => s + Number(i.amount), 0);
    const year = items.filter((i) => new Date(`${i.expense_date}T00:00:00`) >= yearStart).reduce((s, i) => s + Number(i.amount), 0);
    const highest = items.reduce((m, i) => Math.max(m, Number(i.amount)), 0);
    const days = new Set(items.map((i) => i.expense_date)).size || 1;
    const avgDaily = total / days;
    const pending = items.filter((i) => ["Pending", "Partially Paid"].includes(i.status || "Paid")).reduce((s, i) => s + Number(i.amount), 0);
    const paid = items.filter((i) => (i.status || "Paid") === "Paid").reduce((s, i) => s + Number(i.amount), 0);
    const recurring = items.filter((i) => i.is_recurring).length;

    return { total, today, week, month, year, highest, avgDaily, pending, paid, recurring, count: items.length };
  }, [items]);

  const monthlyTrend = useMemo(() => {
    const asc = [...items].sort((a, b) => a.expense_date.localeCompare(b.expense_date));
    return groupSum(asc, (e) => monthKey(new Date(`${e.expense_date}T00:00:00`))).slice(-6);
  }, [items]);

  const categoryData = useMemo(
    () => groupSum(items, (e) => e.category).sort((a, b) => b.value - a.value),
    [items]
  );

  const vendorData = useMemo(
    () => groupSum(items, (e) => e.vendor || "Unknown").sort((a, b) => b.value - a.value).slice(0, 10),
    [items]
  );

  const paymentData = useMemo(
    () => groupSum(items, (e) => e.payment_method || "Unknown").sort((a, b) => b.value - a.value),
    [items]
  );

  const gstSummary = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + Number(i.amount), 0);
    const gst = items.reduce((s, i) => s + Number(i.gst_amount || 0), 0);
    return { subtotal, gst, total: subtotal + gst };
  }, [items]);

  const reportData = useMemo(() => {
    if (reportType === "Category") return categoryData;
    if (reportType === "Vendor") return vendorData;
    if (reportType === "GST")
      return [
        { name: "Subtotal", value: gstSummary.subtotal },
        { name: "GST Collected", value: gstSummary.gst },
        { name: "Grand Total", value: gstSummary.total },
      ];
    const asc = [...items].sort((a, b) => a.expense_date.localeCompare(b.expense_date));
    if (reportType === "Daily") return groupSum(asc, (e) => e.expense_date);
    if (reportType === "Weekly") return groupSum(asc, (e) => weekKey(new Date(`${e.expense_date}T00:00:00`)));
    if (reportType === "Yearly") return groupSum(asc, (e) => e.expense_date.slice(0, 4));
    return groupSum(asc, (e) => monthKey(new Date(`${e.expense_date}T00:00:00`)));
  }, [reportType, items, categoryData, vendorData, gstSummary]);

  /* -------------------------------- actions -------------------------------- */

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startNew = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = (e: Expense) => {
    setEditingId(e.id);
    setForm({
      category: e.category,
      vendor: e.vendor || "",
      amount: Number(e.amount),
      gst_percent: e.gst_percent ?? GST_DEFAULT,
      gst_amount: e.gst_amount ?? 0,
      total_amount: e.total_amount ?? Number(e.amount),
      expense_date: e.expense_date,
      payment_method: e.payment_method || "Cash",
      status: e.status || "Paid",
      reference_number: e.reference_number || "",
      invoice_number: e.invoice_number || "",
      description: e.description || "",
      notes: e.notes || "",
      receipt_url: e.receipt_url || "",
      is_recurring: !!e.is_recurring,
    });
    setShowForm(true);
  };

  const startDuplicate = (e: Expense) => {
    setEditingId(null);
    setForm({
      category: e.category,
      vendor: e.vendor || "",
      amount: Number(e.amount),
      gst_percent: e.gst_percent ?? GST_DEFAULT,
      gst_amount: e.gst_amount ?? 0,
      total_amount: e.total_amount ?? Number(e.amount),
      expense_date: todayStr(),
      payment_method: e.payment_method || "Cash",
      status: "Pending",
      reference_number: "",
      invoice_number: "",
      description: e.description || "",
      notes: e.notes || "",
      receipt_url: "",
      is_recurring: !!e.is_recurring,
    });
    setShowForm(true);
    toast({ title: "Duplicated — review and save" });
  };

  const validate = (): string | null => {
    if (!form.category) return "Category is required";
    if (!form.vendor.trim()) return "Vendor is required";
    if (!form.amount || Number(form.amount) <= 0) return "Amount must be greater than 0";
    if (!form.expense_date) return "Expense date is required";
    if (form.expense_date > todayStr()) return "Expense date cannot be in the future";
    if (form.invoice_number.trim()) {
      const dup = items.some(
        (i) => i.id !== editingId && (i.invoice_number || "").trim().toLowerCase() === form.invoice_number.trim().toLowerCase()
      );
      if (dup) return "An expense with this invoice number already exists";
    }
    if (form.reference_number.trim()) {
      const dup = items.some(
        (i) => i.id !== editingId && (i.reference_number || "").trim().toLowerCase() === form.reference_number.trim().toLowerCase()
      );
      if (dup) return "An expense with this reference number already exists";
    }
    return null;
  };

  const save = async () => {
    const err = validate();
    if (err) {
      toast({ title: err, variant: "destructive" });
      return;
    }
    setSaving(true);
    const amt = Number(form.amount);
    const { gst, total } = calcGST(amt, Number(form.gst_percent) || 0);
    const payload = {
      category: form.category,
      vendor: form.vendor.trim(),
      amount: amt,
      gst_percent: Number(form.gst_percent) || 0,
      gst_amount: gst,
      total_amount: total,
      expense_date: form.expense_date,
      payment_method: form.payment_method,
      status: form.status,
      reference_number: form.reference_number.trim() || null,
      invoice_number: form.invoice_number.trim() || null,
      description: form.description.trim() || null,
      notes: form.notes.trim() || null,
      receipt_url: form.receipt_url.trim() || null,
      is_recurring: form.is_recurring,
    };
    try {
      if (editingId) {
        const { error } = await supabase.from("expenses").update(payload).eq("id", editingId).select();
        if (error) throw error;
        toast({ title: "Expense updated" });
      } else {
        const { data, error } = await supabase.from("expenses").insert([payload]).select();
        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error("Insert returned no data. Check that Row Level Security (RLS) is disabled on the expenses table in Supabase.");
        }
        toast({ title: "Expense added" });
      }
      window.dispatchEvent(new CustomEvent("expenses:updated"));
      await load();
      resetForm();
      setShowForm(false);
    } catch (e: any) {
      toast({ title: "Failed to save expense", description: e?.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Expense deleted" });
      window.dispatchEvent(new CustomEvent("expenses:updated"));
    }
    setConfirmState(null);
  };

  const requestDelete = (id: string) =>
    setConfirmState({ message: "Delete this expense permanently? This cannot be undone.", onConfirm: () => doDelete(id) });

  const doBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    const { error } = await supabase.from("expenses").delete().in("id", ids);
    if (error) toast({ title: "Bulk delete failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: `${ids.length} expense(s) deleted` });
      window.dispatchEvent(new CustomEvent("expenses:updated"));
    }
    setSelectedIds(new Set());
    setConfirmState(null);
  };

  const requestBulkDelete = () =>
    setConfirmState({ message: `Delete ${selectedIds.size} selected expense(s) permanently?`, onConfirm: doBulkDelete });

  const bulkUpdateCategory = async (category: string) => {
    const ids = Array.from(selectedIds);
    const { error } = await supabase.from("expenses").update({ category }).in("id", ids);
    if (error) toast({ title: "Bulk update failed", variant: "destructive" });
    else {
      toast({ title: `Category updated for ${ids.length} expense(s)` });
      setSelectedIds(new Set());
    }
  };

  const bulkUpdateStatus = async (status: string) => {
    const ids = Array.from(selectedIds);
    const { error } = await supabase.from("expenses").update({ status }).in("id", ids);
    if (error) toast({ title: "Bulk update failed", variant: "destructive" });
    else {
      toast({ title: `Status updated for ${ids.length} expense(s)` });
      setSelectedIds(new Set());
    }
  };

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allPagedSelected = paged.length > 0 && paged.every((e) => selectedIds.has(e.id));
  const toggleSelectAll = () =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPagedSelected) paged.forEach((e) => next.delete(e.id));
      else paged.forEach((e) => next.add(e.id));
      return next;
    });

  const resetFilters = () =>
    setFilters({ preset: "All Time", customFrom: "", customTo: "", category: "All", vendor: "All", paymentMethod: "All", status: "All" });

  const SortHeader = ({ k, label, align }: { k: string; label: string; align?: "right" }) => (
    <th
      onClick={() => toggleSort(k)}
      className={`cursor-pointer select-none whitespace-nowrap p-4 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground ${align === "right" ? "text-right" : "text-left"}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === k ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ChevronsUpDown size={12} className="opacity-40" />}
      </span>
    </th>
  );

  /* ---------------------------------- render ---------------------------------- */

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          #printable-expenses { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 no-print">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Total tracked: <span className="font-medium text-primary">{fmtINR(stats.total)}</span> across {stats.count} transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-muted/40"
            >
              <Download size={15} /> Export
            </button>
            <AnimatePresence>
              {exportMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                  onMouseLeave={() => setExportMenuOpen(false)}
                >
                  <button
                    onClick={() => { exportCSV(sorted, "veloria-expenses.csv"); setExportMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted/40"
                  >
                    <FileSpreadsheet size={14} /> Export CSV
                  </button>
                  <button
                    onClick={() => { exportExcel(sorted, "veloria-expenses.xls"); setExportMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted/40"
                  >
                    <Table2 size={14} /> Export Excel
                  </button>
                  <button
                    onClick={() => { window.print(); setExportMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted/40"
                  >
                    <Printer size={14} /> Print / Export PDF
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => (showForm ? setShowForm(false) : startNew())}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Close" : "Add Expense"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-fit items-center gap-1 rounded-xl border border-border bg-card p-1 no-print">
        {[
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "transactions", label: "Transactions", icon: Table2 },
          { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm transition-colors ${
              tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Expense form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border border-border bg-card p-6 no-print"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-base font-semibold">{editingId ? "Edit Expense" : "New Expense"}</h3>
              <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {editingId ? displayId(editingId) : "Auto-generated on save"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <Field label="Category *">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Vendor *">
                <input placeholder="Vendor name" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Expense Date *">
                <input type="date" max={todayStr()} value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} className={inputCls} />
              </Field>

              <Field label="Amount (₹) *">
                <input
                  type="number" min={0} placeholder="0.00" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value === "" ? "" : +e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="GST %">
                <input
                  type="number" min={0} max={100} value={form.gst_percent}
                  onChange={(e) => setForm({ ...form, gst_percent: e.target.value === "" ? "" : +e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="GST Amount">
                <input disabled value={fmtINR(form.gst_amount)} className={`${inputCls} cursor-not-allowed opacity-70`} />
              </Field>

              <Field label="Total Amount">
                <input disabled value={fmtINR(form.total_amount)} className={`${inputCls} cursor-not-allowed font-medium text-primary opacity-90`} />
              </Field>
              <Field label="Payment Method">
                <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className={inputCls}>
                  {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>

              <Field label="Invoice Number">
                <input placeholder="INV-0001" value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Reference Number">
                <input placeholder="REF-0001" value={form.reference_number} onChange={(e) => setForm({ ...form, reference_number: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Receipt URL">
                <input placeholder="https://..." value={form.receipt_url} onChange={(e) => setForm({ ...form, receipt_url: e.target.value })} className={inputCls} />
              </Field>

              <Field label="Description">
                <input placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
              </Field>
              <label className="flex items-center gap-2 self-end pb-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={form.is_recurring} onChange={(e) => setForm({ ...form, is_recurring: e.target.checked })} className="h-4 w-4 rounded border-border accent-primary" />
                <Repeat size={14} /> Recurring expense
              </label>

              <Field label="Notes">
                <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${inputCls} sm:col-span-2 md:col-span-1`} rows={2} />
              </Field>

              <div className="col-span-full text-xs text-muted-foreground sm:col-span-2 md:col-span-3">
                Created by <span className="text-foreground">{editingId ? "—" : currentUserLabel}</span>
                {editingId && <> · Last updated automatically on save</>}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm text-primary-foreground disabled:opacity-60">
                {saving && <Loader2 size={14} className="animate-spin" />} {editingId ? "Update Expense" : "Save Expense"}
              </button>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="rounded-xl border border-border px-6 py-2 text-sm hover:bg-muted/40">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================ OVERVIEW ============================ */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <SummaryCard icon={IndianRupee} label="Total Expenses" value={<AnimatedCounter value={stats.total} formatter={fmtINR} />} />
            <SummaryCard icon={Clock3} label="Today" value={<AnimatedCounter value={stats.today} formatter={fmtINR} />} />
            <SummaryCard icon={Wallet} label="This Week" value={<AnimatedCounter value={stats.week} formatter={fmtINR} />} />
            <SummaryCard icon={CalendarDays} label="This Month" value={<AnimatedCounter value={stats.month} formatter={fmtINR} />} />
            <SummaryCard icon={CalendarDays} label="This Year" value={<AnimatedCounter value={stats.year} formatter={fmtINR} />} />
            <SummaryCard icon={TrendingUp} label="Highest Expense" value={<AnimatedCounter value={stats.highest} formatter={fmtINR} />} />
            <SummaryCard icon={BarChart3} label="Avg. Daily Expense" value={<AnimatedCounter value={stats.avgDaily} formatter={fmtINR} />} />
            <SummaryCard icon={AlertTriangle} label="Pending Payments" value={<AnimatedCounter value={stats.pending} formatter={fmtINR} />} />
            <SummaryCard icon={CircleDollarSign} label="Paid Expenses" value={<AnimatedCounter value={stats.paid} formatter={fmtINR} />} />
            <SummaryCard icon={Repeat} label="Recurring Expenses" value={<AnimatedCounter value={stats.recurring} formatter={(v) => Math.round(v).toString()} />} sub="active entries" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
              <h3 className="mb-4 font-serif text-sm font-semibold text-foreground">Monthly Trend</h3>
              {monthlyTrend.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "currentColor" }} stroke="rgba(255,255,255,0.15)" />
                    <YAxis tick={{ fontSize: 11, fill: "currentColor" }} stroke="rgba(255,255,255,0.15)" tickFormatter={(v) => fmtINR(v)} width={70} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={GOLD_PALETTE[0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 font-serif text-sm font-semibold text-foreground"><PieChartIcon size={14} className="text-primary" /> By Category</h3>
              {categoryData.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={categoryData.slice(0, 6)} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                      {categoryData.slice(0, 6).map((_, idx) => <Cell key={idx} fill={GOLD_PALETTE[idx % GOLD_PALETTE.length]} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-sm font-semibold text-foreground">Recent Transactions</h3>
              <button onClick={() => setTab("transactions")} className="text-xs text-primary hover:underline">View all →</button>
            </div>
            <div className="divide-y divide-border/50">
              {items.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs text-primary">{e.category}</span>
                    <span className="text-muted-foreground">{e.vendor || "—"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{e.expense_date}</span>
                    <span className="font-medium">{fmtINR(Number(e.amount))}</span>
                  </div>
                </div>
              ))}
              {items.length === 0 && <div className="py-6 text-center text-sm text-muted-foreground">No expenses recorded yet</div>}
            </div>
          </div>
        </div>
      )}

      {/* ============================ TRANSACTIONS ============================ */}
      {tab === "transactions" && (
        <div className="space-y-4">
          {/* Search + filter toggle */}
          <div className="flex flex-wrap items-center gap-3 no-print">
            <div className="relative max-w-md flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by vendor, category, notes, ID, amount, invoice…"
                className={`${inputCls} pl-9`}
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted/40 ${showFilters ? "bg-muted/40" : "bg-card"}`}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
            {(filters.preset !== "All Time" || filters.category !== "All" || filters.vendor !== "All" || filters.paymentMethod !== "All" || filters.status !== "All" || search) && (
              <button onClick={() => { resetFilters(); setSearch(""); }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden no-print">
                <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3 md:grid-cols-6">
                  <Field label="Date Range">
                    <select value={filters.preset} onChange={(e) => setFilters({ ...filters, preset: e.target.value })} className={inputCls}>
                      {DATE_PRESETS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </Field>
                  {filters.preset === "Custom" && (
                    <>
                      <Field label="From">
                        <input type="date" value={filters.customFrom} onChange={(e) => setFilters({ ...filters, customFrom: e.target.value })} className={inputCls} />
                      </Field>
                      <Field label="To">
                        <input type="date" value={filters.customTo} onChange={(e) => setFilters({ ...filters, customTo: e.target.value })} className={inputCls} />
                      </Field>
                    </>
                  )}
                  <Field label="Category">
                    <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className={inputCls}>
                      <option>All</option>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Vendor">
                    <select value={filters.vendor} onChange={(e) => setFilters({ ...filters, vendor: e.target.value })} className={inputCls}>
                      {vendorOptions.map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field label="Payment Method">
                    <select value={filters.paymentMethod} onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })} className={inputCls}>
                      <option>All</option>
                      {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </Field>
                  <Field label="Status">
                    <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className={inputCls}>
                      <option>All</option>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk actions bar */}
          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 no-print">
                <span className="text-sm font-medium">{selectedIds.size} selected</span>
                <button onClick={() => exportCSV(items.filter((i) => selectedIds.has(i.id)), "selected-expenses.csv")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <Download size={12} /> Export
                </button>
                <select onChange={(e) => e.target.value && bulkUpdateCategory(e.target.value)} defaultValue="" className="rounded-lg border border-border bg-background px-2 py-1 text-xs">
                  <option value="" disabled>Bulk category…</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <select onChange={(e) => e.target.value && bulkUpdateStatus(e.target.value)} defaultValue="" className="rounded-lg border border-border bg-background px-2 py-1 text-xs">
                  <option value="" disabled>Bulk status…</option>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button onClick={requestBulkDelete} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300">
                  <Trash2 size={12} /> Delete
                </button>
                <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
                  Clear
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table */}
          <div id="printable-expenses" className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="max-h-[640px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-card">
                  <tr className="border-b border-border">
                    <th className="p-4 no-print">
                      <button onClick={toggleSelectAll} className="text-muted-foreground hover:text-primary">
                        {allPagedSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </th>
                    <SortHeader k="id" label="Expense ID" />
                    <SortHeader k="expense_date" label="Date" />
                    <SortHeader k="category" label="Category" />
                    <SortHeader k="vendor" label="Vendor" />
                    <SortHeader k="amount" label="Amount" align="right" />
                    <th className="p-4 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">GST</th>
                    <SortHeader k="total_amount" label="Total" align="right" />
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Method</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Receipt</th>
                    <th className="p-4 no-print" />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td colSpan={11} className="p-4">
                          <div className="h-5 w-full animate-pulse rounded bg-muted/40" />
                        </td>
                      </tr>
                    ))
                  ) : paged.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="p-10 text-center text-muted-foreground">
                        No expenses match your filters
                      </td>
                    </tr>
                  ) : (
                    paged.map((e) => (
                      <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="p-4 no-print">
                          <button onClick={() => toggleSelect(e.id)} className="text-muted-foreground hover:text-primary">
                            {selectedIds.has(e.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                          </button>
                        </td>
                        <td className="p-4 font-mono text-xs text-muted-foreground">{displayId(e.id)}</td>
                        <td className="p-4 whitespace-nowrap">{e.expense_date}</td>
                        <td className="p-4">
                          <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs text-primary">{e.category}</span>
                        </td>
                        <td className="p-4 text-muted-foreground">{e.vendor || "—"}</td>
                        <td className="p-4 text-right font-medium">{fmtINR(Number(e.amount))}</td>
                        <td className="p-4 text-right text-xs text-muted-foreground">{fmtINR(e.gst_amount || 0)}</td>
                        <td className="p-4 text-right font-medium text-primary">{fmtINR(e.total_amount ?? Number(e.amount))}</td>
                        <td className="p-4 text-muted-foreground">{e.payment_method || "—"}</td>
                        <td className="p-4">
                          <span className={`rounded-lg px-2 py-1 text-xs ${STATUS_STYLES[e.status || "Paid"] || STATUS_STYLES.Paid}`}>{e.status || "Paid"}</span>
                        </td>
                        <td className="p-4">
                          {e.receipt_url ? (
                            <a href={e.receipt_url} target="_blank" rel="noreferrer" className="text-primary">
                              <Receipt size={14} />
                            </a>
                          ) : "—"}
                        </td>
                        <td className="p-4 no-print">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setViewing(e)} className="text-muted-foreground hover:text-primary" title="View"><Eye size={14} /></button>
                            <button onClick={() => startEdit(e)} className="text-muted-foreground hover:text-primary" title="Edit"><Pencil size={14} /></button>
                            <button onClick={() => startDuplicate(e)} className="text-muted-foreground hover:text-primary" title="Duplicate"><Copy size={14} /></button>
                            <button onClick={() => requestDelete(e.id)} className="text-muted-foreground hover:text-red-400" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 no-print">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  Showing {sorted.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
                </span>
                <select value={pageSize} onChange={(e) => setPageSize(+e.target.value)} className="rounded-lg border border-border bg-background px-2 py-1 text-xs">
                  {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} / page</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg p-1.5 hover:bg-muted/40 disabled:opacity-40">
                  <ChevronLeft size={16} />
                </button>
                <span className="px-2 text-xs text-muted-foreground">Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg p-1.5 hover:bg-muted/40 disabled:opacity-40">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================ ANALYTICS ============================ */}
      {tab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard icon={IndianRupee} label="Subtotal" value={fmtINR(gstSummary.subtotal)} />
            <SummaryCard icon={FileBarChart} label="GST Collected" value={fmtINR(gstSummary.gst)} sub="Default rate 18%" />
            <SummaryCard icon={CircleDollarSign} label="Grand Total" value={fmtINR(gstSummary.total)} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 font-serif text-sm font-semibold text-foreground">Top Vendors</h3>
              {vendorData.length === 0 ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={vendorData} layout="vertical" margin={{ left: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "currentColor" }} tickFormatter={(v) => fmtINR(v)} stroke="rgba(255,255,255,0.15)" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "currentColor" }} width={100} stroke="rgba(255,255,255,0.15)" />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} fill={GOLD_PALETTE[1]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 font-serif text-sm font-semibold text-foreground">By Payment Method</h3>
              {paymentData.length === 0 ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={paymentData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                      {paymentData.map((_, idx) => <Cell key={idx} fill={GOLD_PALETTE[idx % GOLD_PALETTE.length]} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Report generator */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-serif text-sm font-semibold text-foreground">Report Generator</h3>
              <div className="flex items-center gap-2">
                <select value={reportType} onChange={(e) => setReportType(e.target.value as any)} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs">
                  {REPORT_TYPES.map((r) => <option key={r}>{r}</option>)}
                </select>
                <button
                  onClick={() =>
                    exportCSV(
                      reportData.map((r, idx) => ({ id: String(idx), category: r.name, amount: r.value, expense_date: "", vendor: null, notes: null, payment_method: null, receipt_url: null } as unknown as Expense)),
                      `${reportType.toLowerCase()}-report.csv`
                    )
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted/40"
                >
                  <Download size={12} /> Export
                </button>
              </div>
            </div>

            {reportData.length === 0 ? (
              <EmptyChart />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "currentColor" }} stroke="rgba(255,255,255,0.15)" interval={Math.max(0, Math.floor(reportData.length / 12))} />
                    <YAxis tick={{ fontSize: 11, fill: "currentColor" }} tickFormatter={(v) => fmtINR(v)} width={70} stroke="rgba(255,255,255,0.15)" />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={GOLD_PALETTE[2]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-border/60">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card">
                      <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                        <th className="p-3 text-left">{reportType}</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((r, idx) => (
                        <tr key={idx} className="border-b border-border/40">
                          <td className="p-3">{r.name}</td>
                          <td className="p-3 text-right font-medium">{fmtINR(r.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* View modal */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing ? displayId(viewing.id) : ""} wide>
        {viewing && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <DetailRow label="Category" value={viewing.category} />
            <DetailRow label="Vendor" value={viewing.vendor || "—"} />
            <DetailRow label="Date" value={viewing.expense_date} />
            <DetailRow label="Status" value={viewing.status || "Paid"} />
            <DetailRow label="Amount" value={fmtINR(Number(viewing.amount))} />
            <DetailRow label="GST" value={`${viewing.gst_percent ?? 0}% (${fmtINR(viewing.gst_amount || 0)})`} />
            <DetailRow label="Total Amount" value={fmtINR(viewing.total_amount ?? Number(viewing.amount))} />
            <DetailRow label="Payment Method" value={viewing.payment_method || "—"} />
            <DetailRow label="Invoice Number" value={viewing.invoice_number || "—"} />
            <DetailRow label="Reference Number" value={viewing.reference_number || "—"} />
            <DetailRow label="Created By" value={viewing.created_by || "—"} />
            <DetailRow label="Created At" value={viewing.created_at ? new Date(viewing.created_at).toLocaleString("en-IN") : "—"} />
            <DetailRow label="Updated At" value={viewing.updated_at ? new Date(viewing.updated_at).toLocaleString("en-IN") : "—"} />
            <DetailRow label="Recurring" value={viewing.is_recurring ? "Yes" : "No"} />
            <div className="col-span-2"><DetailRow label="Description" value={viewing.description || "—"} /></div>
            <div className="col-span-2"><DetailRow label="Notes" value={viewing.notes || "—"} /></div>
            {viewing.receipt_url && (
              <div className="col-span-2">
                <a href={viewing.receipt_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                  <Receipt size={14} /> View receipt
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Confirm dialog */}
      <Modal open={!!confirmState} onClose={() => setConfirmState(null)} title="Confirm action">
        {confirmState && (
          <div>
            <div className="mb-5 flex items-start gap-3 text-sm">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
              <p className="text-muted-foreground">{confirmState.message}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmState(null)} className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted/40">Cancel</button>
              <button onClick={confirmState.onConfirm} className="rounded-xl bg-red-500/90 px-4 py-2 text-sm text-white hover:bg-red-500">Confirm</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const EmptyChart = () => (
  <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">No data yet</div>
);

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="mt-0.5 text-foreground">{value}</div>
  </div>
);

export default ExpensesSection;
