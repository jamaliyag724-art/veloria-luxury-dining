import React, { useState } from "react";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/integrations/supabase/client";
import { useOrders } from "@/context/OrderContext";
import { useReservations } from "@/context/ReservationContext";
import { fmtINR } from "@/lib/finance";
import { useToast } from "@/hooks/use-toast";

type RangeKey = "today"|"week"|"month"|"year"|"custom";

const ReportsSection = () => {
  const { orders } = useOrders();
  const { reservations } = useReservations();
  const [range, setRange] = useState<RangeKey>("month");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const { toast } = useToast();

  const getRange = (): [Date, Date] => {
    const end = new Date(); const start = new Date();
    if (range==="today") start.setHours(0,0,0,0);
    else if (range==="week") start.setDate(end.getDate()-7);
    else if (range==="month") start.setMonth(end.getMonth()-1);
    else if (range==="year") start.setFullYear(end.getFullYear()-1);
    else if (range==="custom" && from && to) return [new Date(from), new Date(to)];
    return [start, end];
  };

  const collect = async () => {
    const [start, end] = getRange();
    const inRange = (d: any) => { const dt = new Date(d); return dt >= start && dt <= end; };

    const [{ data: expenses }, { data: payroll }, { data: bills }, { data: inv }, { data: staff }] = await Promise.all([
      supabase.from("expenses").select("*"),
      supabase.from("payroll").select("*"),
      supabase.from("utility_bills").select("*"),
      supabase.from("inventory").select("*"),
      supabase.from("staff").select("*"),
    ]);

    const o = orders.filter((x:any)=>inRange(x.createdAt||x.created_at));
    const r = reservations.filter((x:any)=>inRange(x.createdAt||x.created_at||x.date));
    const e = (expenses||[]).filter(x=>inRange(x.expense_date));
    return { o, r, e, payroll: payroll||[], bills: bills||[], inv: inv||[], staff: staff||[], start, end };
  };

  const exportExcel = async () => {
    const { o, r, e, payroll, bills, inv, staff } = await collect();
    const wb = XLSX.utils.book_new();
    const add = (rows: any[], name: string) => XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.length?rows:[{ info:"No data" }]), name);

    const revenue = o.reduce((s,x:any)=>s+(x.totalAmount||0),0);
    const expenses = e.reduce((s,x)=>s+Number(x.amount),0);
    add([
      { Metric: "Revenue", Value: revenue },
      { Metric: "Expenses", Value: expenses },
      { Metric: "Net Profit", Value: revenue - expenses },
      { Metric: "Orders", Value: o.length },
      { Metric: "Reservations", Value: r.length },
    ], "Summary");
    add(o.map((x:any)=>({ ID: x.id, Date: x.createdAt||x.created_at, Customer: x.customerName, Total: x.totalAmount, Status: x.status })), "Orders");
    add(r.map((x:any)=>({ ID: x.id, Date: x.date, Name: x.name, Guests: x.guests, Status: x.status })), "Reservations");
    add(e, "Expenses");
    add(payroll, "Payroll");
    add(bills, "Utility Bills");
    add(inv, "Inventory");
    add(staff, "Staff");
    XLSX.writeFile(wb, `veloria-report-${range}-${Date.now()}.xlsx`);
    toast({ title: "Excel report downloaded" });
  };

  const exportPDF = async () => {
    const { o, r, e, payroll, bills, inv, start, end } = await collect();
    const doc = new jsPDF();
    const revenue = o.reduce((s,x:any)=>s+(x.totalAmount||0),0);
    const expenses = e.reduce((s,x)=>s+Number(x.amount),0);
    const profit = revenue - expenses;

    doc.setFontSize(22); doc.setTextColor(212,175,55);
    doc.text("VELORIA", 14, 20);
    doc.setFontSize(10); doc.setTextColor(120);
    doc.text("Luxury Dining · Financial Report", 14, 27);
    doc.text(`Period: ${start.toDateString()} — ${end.toDateString()}`, 14, 33);

    doc.setFontSize(14); doc.setTextColor(20);
    doc.text("Financial Summary", 14, 46);
    autoTable(doc, { startY: 50, head: [["Metric","Value"]], body: [
      ["Total Revenue", fmtINR(revenue)],
      ["Total Expenses", fmtINR(expenses)],
      ["Net Profit", fmtINR(profit)],
      ["Profit Margin", `${revenue>0?((profit/revenue)*100).toFixed(1):0}%`],
      ["Orders", String(o.length)],
      ["Reservations", String(r.length)],
      ["Payroll Cost", fmtINR(payroll.reduce((s,p)=>s+Number(p.net_pay),0))],
      ["Utility Bills", fmtINR(bills.reduce((s,b)=>s+Number(b.amount),0))],
      ["Inventory Items", String(inv.length)],
    ], styles: { fontSize: 10 }, headStyles: { fillColor: [212,175,55] } });

    const expByCat: Record<string, number> = {};
    e.forEach(x=>{ expByCat[x.category]=(expByCat[x.category]||0)+Number(x.amount); });
    const catRows = Object.entries(expByCat).map(([k,v])=>[k, fmtINR(v)]);
    if (catRows.length) {
      doc.text("Expense Breakdown", 14, (doc as any).lastAutoTable.finalY + 12);
      autoTable(doc, { startY: (doc as any).lastAutoTable.finalY + 16, head: [["Category","Amount"]], body: catRows, styles: { fontSize: 10 }, headStyles: { fillColor: [212,175,55] } });
    }

    const itemQty: Record<string, { qty: number; rev: number }> = {};
    o.forEach((x:any)=>(x.items||[]).forEach((it:any)=>{
      itemQty[it.name] = itemQty[it.name] || { qty: 0, rev: 0 };
      itemQty[it.name].qty += it.quantity||1;
      itemQty[it.name].rev += (it.price||0)*(it.quantity||1);
    }));
    const topItems = Object.entries(itemQty).sort((a,b)=>b[1].rev-a[1].rev).slice(0,10).map(([k,v])=>[k, String(v.qty), fmtINR(v.rev)]);
    if (topItems.length) {
      doc.text("Top Selling Items", 14, (doc as any).lastAutoTable.finalY + 12);
      autoTable(doc, { startY: (doc as any).lastAutoTable.finalY + 16, head: [["Item","Qty","Revenue"]], body: topItems, styles: { fontSize: 10 }, headStyles: { fillColor: [212,175,55] } });
    }

    doc.save(`veloria-report-${range}-${Date.now()}.pdf`);
    toast({ title: "PDF report downloaded" });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold font-serif">Report Center</h1>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-serif text-lg mb-4">Generate Report</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {(["today","week","month","year","custom"] as RangeKey[]).map(k=>(
            <button key={k} onClick={()=>setRange(k)} className={`px-4 py-2 rounded-xl text-sm capitalize ${range===k?"bg-primary text-primary-foreground":"bg-background border border-border"}`}>{k}</button>
          ))}
        </div>
        {range==="custom" && (
          <div className="flex gap-3 mb-4">
            <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={exportPDF} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm"><FileText size={16}/> Export PDF</button>
          <button onClick={exportExcel} className="flex items-center gap-2 bg-card border border-primary/40 text-primary px-5 py-2.5 rounded-xl text-sm"><FileSpreadsheet size={16}/> Export Excel</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Orders","Reservations","Customers","Inventory","Staff","Payroll","Expenses","Profit & Loss"].map(t=>(
          <div key={t} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-3">
            <FileDown size={18} className="text-primary"/><span className="text-sm">{t}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">All exports respect the selected date range. PDFs include Veloria branding, summaries, and breakdown tables.</p>
    </div>
  );
};

export default ReportsSection;
