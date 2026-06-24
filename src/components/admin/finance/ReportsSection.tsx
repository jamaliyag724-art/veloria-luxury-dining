import React, { useMemo, useState } from "react";
import { FileSpreadsheet, FileText, Sparkles, TrendingUp, TrendingDown, IndianRupee, Receipt, Users, Package } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/integrations/supabase/client";
import { useOrders } from "@/context/OrderContext";
import { useReservations } from "@/context/ReservationContext";
import { fmtINR, fmtINRpdf, splitGST, sumGST, RESTAURANT, GST_RATE } from "@/lib/finance";
import { useToast } from "@/hooks/use-toast";

type RangeKey = "today"|"yesterday"|"7days"|"month"|"lastmonth"|"quarter"|"year"|"custom";

const GOLD: [number, number, number] = [212, 175, 55];
const INK: [number, number, number] = [18, 18, 22];
const MUTED: [number, number, number] = [120, 120, 130];
const LINE: [number, number, number] = [220, 215, 200];
const SOFT: [number, number, number] = [248, 244, 232];

const ReportsSection = () => {
  const { orders } = useOrders();
  const { reservations } = useReservations();
  const [range, setRange] = useState<RangeKey>("month");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [busy, setBusy] = useState<null | "pdf" | "xlsx">(null);
  const { toast } = useToast();

  const getRange = (): [Date, Date] => {
    const end = new Date(); const start = new Date();
    end.setHours(23,59,59,999);
    if (range==="today") { start.setHours(0,0,0,0); }
    else if (range==="yesterday") { start.setDate(end.getDate()-1); start.setHours(0,0,0,0); end.setDate(end.getDate()-1); end.setHours(23,59,59,999); }
    else if (range==="7days") { start.setDate(end.getDate()-7); start.setHours(0,0,0,0); }
    else if (range==="month") { start.setDate(1); start.setHours(0,0,0,0); }
    else if (range==="lastmonth") { start.setMonth(end.getMonth()-1); start.setDate(1); start.setHours(0,0,0,0); end.setDate(0); end.setHours(23,59,59,999); }
    else if (range==="quarter") { start.setMonth(end.getMonth()-3); start.setHours(0,0,0,0); }
    else if (range==="year") { start.setMonth(0); start.setDate(1); start.setHours(0,0,0,0); }
    else if (range==="custom" && from && to) return [new Date(from+"T00:00:00"), new Date(to+"T23:59:59")];
    return [start, end];
  };

  const collect = async () => {
    const [start, end] = getRange();
    const inRange = (d: any) => { if (!d) return false; const dt = new Date(d); return dt >= start && dt <= end; };

    const [{ data: expenses }, { data: payroll }, { data: bills }, { data: inv }, { data: staff }, { data: vendors }] = await Promise.all([
      supabase.from("expenses").select("*"),
      supabase.from("payroll").select("*"),
      supabase.from("utility_bills").select("*"),
      supabase.from("inventory").select("*"),
      supabase.from("staff").select("*"),
      supabase.from("vendors").select("*"),
    ]);

    // previous period for growth
    const ms = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - ms);
    const inPrev = (d: any) => { if (!d) return false; const dt = new Date(d); return dt >= prevStart && dt <= prevEnd; };

    const o = orders.filter((x:any)=>inRange(x.createdAt||x.created_at));
    const oPrev = orders.filter((x:any)=>inPrev(x.createdAt||x.created_at));
    const r = reservations.filter((x:any)=>inRange(x.createdAt||x.created_at||x.date));
    const e = (expenses||[]).filter((x:any)=>inRange(x.expense_date));
    const ePrev = (expenses||[]).filter((x:any)=>inPrev(x.expense_date));

    return {
      o, oPrev, r, e, ePrev,
      payroll: payroll||[], bills: bills||[], inv: inv||[], staff: staff||[], vendors: vendors||[],
      start, end, prevStart, prevEnd,
    };
  };

  /* ─────────────────────────── PDF ─────────────────────────── */
  const exportPDF = async () => {
    setBusy("pdf");
    try {
      const D = await collect();
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      const gst = sumGST(D.o);
      const expensesTotal = D.e.reduce((s:number,x:any)=>s+Number(x.amount||0),0);
      const expensesPrevTotal = D.ePrev.reduce((s:number,x:any)=>s+Number(x.amount||0),0);
      const payrollTotal = D.payroll.reduce((s:number,p:any)=>s+Number(p.net_pay||0),0);
      const billsTotal = D.bills.reduce((s:number,b:any)=>s+Number(b.amount||0),0);
      const inventoryValue = D.inv.reduce((s:number,i:any)=>s+(Number(i.quantity||0)*Number(i.unit_cost||i.cost_per_unit||0)),0);
      const prevGross = D.oPrev.reduce((s:number,x:any)=>s+Number(x.totalAmount||0),0);
      const netProfit = gst.taxable - expensesTotal;
      const margin = gst.taxable > 0 ? (netProfit/gst.taxable)*100 : 0;
      const revGrowth = prevGross > 0 ? ((gst.gross - prevGross)/prevGross)*100 : 0;
      const expGrowth = expensesPrevTotal > 0 ? ((expensesTotal - expensesPrevTotal)/expensesPrevTotal)*100 : 0;
      const aov = D.o.length ? gst.gross / D.o.length : 0;

      // helpers
      const setColor = (rgb:[number,number,number]) => doc.setTextColor(rgb[0],rgb[1],rgb[2]);
      const fill = (rgb:[number,number,number]) => doc.setFillColor(rgb[0],rgb[1],rgb[2]);
      const stroke = (rgb:[number,number,number]) => doc.setDrawColor(rgb[0],rgb[1],rgb[2]);

      const drawHeader = (title:string, subtitle?:string) => {
        fill(INK); doc.rect(0,0,W,60,"F");
        setColor(GOLD); doc.setFont("times","bold"); doc.setFontSize(18);
        doc.text("VELORIA", 40, 30);
        doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(200,200,200);
        doc.text("LUXURY DINING · ERP", 40, 44);
        doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(255,255,255);
        doc.text(title, W-40, 30, { align:"right" });
        if (subtitle) { doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(200,200,200); doc.text(subtitle, W-40, 44, { align:"right" }); }
      };
      const drawFooter = (pageNo:number, totalPages:number) => {
        stroke(LINE); doc.setLineWidth(0.5); doc.line(40, H-40, W-40, H-40);
        doc.setFont("helvetica","normal"); doc.setFontSize(8); setColor(MUTED);
        doc.text(`${RESTAURANT.name}  ·  GSTIN: ${RESTAURANT.gstin}  ·  ${RESTAURANT.website}`, 40, H-25);
        doc.text(`Page ${pageNo} / ${totalPages}`, W-40, H-25, { align:"right" });
        doc.setFontSize(7); doc.text("Prepared by Veloria ERP System  ·  Confidential — for internal use only", W/2, H-13, { align:"center" });
      };
      const kpiCard = (x:number, y:number, w:number, h:number, label:string, value:string, delta?:string, deltaPositive?:boolean) => {
        fill(SOFT); doc.roundedRect(x,y,w,h,6,6,"F");
        stroke(GOLD); doc.setLineWidth(0.8); doc.roundedRect(x,y,w,h,6,6,"S");
        // gold accent bar
        fill(GOLD); doc.rect(x,y,4,h,"F");
        setColor(MUTED); doc.setFont("helvetica","normal"); doc.setFontSize(8);
        doc.text(label.toUpperCase(), x+14, y+18);
        setColor(INK); doc.setFont("helvetica","bold"); doc.setFontSize(14);
        doc.text(value, x+14, y+38);
        if (delta) {
          doc.setFont("helvetica","normal"); doc.setFontSize(8);
          if (deltaPositive) doc.setTextColor(34,139,34); else doc.setTextColor(178,34,34);
          doc.text(delta, x+14, y+52);
        }
      };
      const sectionTitle = (text:string, y:number) => {
        setColor(INK); doc.setFont("times","bold"); doc.setFontSize(14);
        doc.text(text, 40, y);
        fill(GOLD); doc.rect(40, y+4, 36, 2, "F");
      };

      /* ───── PAGE 1 — COVER ───── */
      fill(INK); doc.rect(0,0,W,H,"F");
      // gold diagonal accents
      fill(GOLD); doc.rect(0,0,W,6,"F"); doc.rect(0,H-6,W,6,"F");
      setColor(GOLD); doc.setFont("times","bold"); doc.setFontSize(56);
      doc.text("VELORIA", W/2, H/2 - 80, { align:"center" });
      doc.setFontSize(12); doc.setFont("helvetica","normal"); doc.setTextColor(220,215,200);
      doc.text("LUXURY  DINING  ·  EST. 2024", W/2, H/2 - 60, { align:"center" });
      // divider
      stroke(GOLD); doc.setLineWidth(1); doc.line(W/2-80, H/2-40, W/2+80, H/2-40);
      doc.setFont("times","bold"); doc.setFontSize(28); setColor(GOLD);
      doc.text("Monthly Financial Report", W/2, H/2, { align:"center" });
      doc.setFont("helvetica","normal"); doc.setFontSize(11); doc.setTextColor(220,215,200);
      doc.text(`Reporting Period: ${D.start.toDateString()} — ${D.end.toDateString()}`, W/2, H/2+24, { align:"center" });
      doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, W/2, H/2+40, { align:"center" });
      // brand block bottom
      const by = H - 160;
      stroke(GOLD); doc.setLineWidth(0.4); doc.line(60, by, W-60, by);
      doc.setFont("times","bold"); doc.setFontSize(13); setColor(GOLD); doc.text(RESTAURANT.name, W/2, by+22, { align:"center" });
      doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(200,200,200);
      doc.text(RESTAURANT.address, W/2, by+38, { align:"center" });
      doc.text(`GSTIN: ${RESTAURANT.gstin}   ·   PAN: ${RESTAURANT.pan}`, W/2, by+52, { align:"center" });
      doc.text(`Proprietor: ${RESTAURANT.owner}   ·   ${RESTAURANT.phone}   ·   ${RESTAURANT.email}`, W/2, by+66, { align:"center" });

      /* ───── PAGE 2 — EXECUTIVE SUMMARY ───── */
      doc.addPage();
      drawHeader("Executive Summary", "Period KPIs at a glance");
      sectionTitle("Executive Summary", 100);
      const cardW = (W - 80 - 20) / 3;
      const cardH = 70;
      const row1y = 120;
      kpiCard(40, row1y, cardW, cardH, "Gross Revenue", fmtINRpdf(gst.gross), `${revGrowth>=0?"▲":"▼"} ${Math.abs(revGrowth).toFixed(1)}% vs prev`, revGrowth>=0);
      kpiCard(40+cardW+10, row1y, cardW, cardH, "GST Collected (18%)", fmtINRpdf(gst.gst));
      kpiCard(40+(cardW+10)*2, row1y, cardW, cardH, "Net Revenue (Taxable)", fmtINRpdf(gst.taxable));
      const row2y = row1y + cardH + 14;
      kpiCard(40, row2y, cardW, cardH, "Total Expenses", fmtINRpdf(expensesTotal), `${expGrowth>=0?"▲":"▼"} ${Math.abs(expGrowth).toFixed(1)}% vs prev`, expGrowth<=0);
      kpiCard(40+cardW+10, row2y, cardW, cardH, "Net Profit", fmtINRpdf(netProfit), `Margin ${margin.toFixed(1)}%`, netProfit>=0);
      kpiCard(40+(cardW+10)*2, row2y, cardW, cardH, "Avg Order Value", fmtINRpdf(aov));
      const row3y = row2y + cardH + 14;
      kpiCard(40, row3y, cardW, cardH, "Orders", String(D.o.length));
      kpiCard(40+cardW+10, row3y, cardW, cardH, "Reservations", String(D.r.length));
      kpiCard(40+(cardW+10)*2, row3y, cardW, cardH, "Inventory Value", fmtINRpdf(inventoryValue));

      sectionTitle("Profit & Loss Statement", row3y + cardH + 40);
      autoTable(doc, {
        startY: row3y + cardH + 50,
        head: [["Particulars","Amount (Rs.)"]],
        body: [
          [{ content:"REVENUE", styles:{ fontStyle:"bold", fillColor:[245,240,220] } }, ""],
          ["Gross Revenue (incl. GST)", fmtINRpdf(gst.gross)],
          ["Less: GST Collected @18%", `(${fmtINRpdf(gst.gst)})`],
          [{ content:"Net Revenue (Taxable)", styles:{ fontStyle:"bold" } }, { content: fmtINRpdf(gst.taxable), styles:{ fontStyle:"bold" } }],
          [{ content:"EXPENSES", styles:{ fontStyle:"bold", fillColor:[245,240,220] } }, ""],
          ...expenseRows(D.e, payrollTotal, billsTotal),
          [{ content:"Total Expenses", styles:{ fontStyle:"bold" } }, { content: fmtINRpdf(expensesTotal + payrollTotal + billsTotal), styles:{ fontStyle:"bold" } }],
          [{ content:"NET PROFIT", styles:{ fontStyle:"bold", fillColor: netProfit>=0?[230,245,225]:[252,228,228] } },
           { content: fmtINRpdf(gst.taxable - expensesTotal - payrollTotal - billsTotal), styles:{ fontStyle:"bold" } }],
          [{ content:"Profit Margin", styles:{ fontStyle:"bold" } }, { content: `${margin.toFixed(2)}%`, styles:{ fontStyle:"bold" } }],
        ],
        styles: { fontSize: 9, cellPadding: 6 },
        headStyles: { fillColor: GOLD, textColor: INK, fontStyle:"bold" },
        columnStyles: { 1: { halign:"right" } },
        theme:"grid",
      });

      /* ───── PAGE 3 — REVENUE ANALYTICS ───── */
      doc.addPage();
      drawHeader("Revenue Analytics", "Trends, peaks and order behaviour");
      sectionTitle("Daily Revenue Trend", 100);
      const daily = aggregateDaily(D.o);
      drawBarChart(doc, 40, 120, W-80, 160, daily.map(d=>({ label:d.label, value:d.value })), "Revenue per day");

      sectionTitle("Peak Revenue Hours", 320);
      const hourly = aggregateHourly(D.o);
      drawBarChart(doc, 40, 340, W-80, 140, hourly.map(d=>({ label:d.label, value:d.value })), "Revenue by hour of day");

      sectionTitle("Revenue Snapshot", 510);
      autoTable(doc, {
        startY: 520,
        head: [["Metric","Value"]],
        body: [
          ["Gross Revenue", fmtINRpdf(gst.gross)],
          ["Net Revenue (ex-GST)", fmtINRpdf(gst.taxable)],
          ["Average Order Value", fmtINRpdf(aov)],
          ["Orders", String(D.o.length)],
          ["Revenue Growth", `${revGrowth>=0?"+":""}${revGrowth.toFixed(2)}%`],
        ],
        styles:{ fontSize:9, cellPadding:5 }, headStyles:{ fillColor: GOLD, textColor: INK }, columnStyles:{ 1:{ halign:"right" } }, theme:"grid",
      });

      /* ───── PAGE 4 — EXPENSE ANALYTICS ───── */
      doc.addPage();
      drawHeader("Expense Analytics", "Category breakdown & top spends");
      sectionTitle("Expense Distribution", 100);
      const byCat: Record<string, number> = {};
      D.e.forEach((x:any)=>{ byCat[x.category]=(byCat[x.category]||0)+Number(x.amount||0); });
      if (payrollTotal) byCat["Payroll (Net)"] = (byCat["Payroll (Net)"]||0) + payrollTotal;
      if (billsTotal) byCat["Utility Bills"] = (byCat["Utility Bills"]||0) + billsTotal;
      const catEntries = Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
      drawPieChart(doc, 40, 120, 180, catEntries);

      sectionTitle("Top Expense Categories", 320);
      autoTable(doc, {
        startY: 330,
        head: [["#","Category","Amount","Share"]],
        body: catEntries.slice(0,10).map(([k,v],i)=>{
          const total = catEntries.reduce((s,[,x])=>s+x,0) || 1;
          return [String(i+1), k, fmtINRpdf(v), `${((v/total)*100).toFixed(1)}%`];
        }),
        styles:{ fontSize:9, cellPadding:5 }, headStyles:{ fillColor: GOLD, textColor: INK }, columnStyles:{ 2:{ halign:"right" }, 3:{ halign:"right" } }, theme:"grid",
      });

      /* ───── PAGE 5 — TOP CUSTOMERS ───── */
      doc.addPage();
      drawHeader("Top Customers", "Lifetime value leaders");
      sectionTitle("Top 15 Customers by Spend", 100);
      const custMap: Record<string, { name:string; orders:number; spend:number }> = {};
      D.o.forEach((o:any)=>{
        const key = (o.email||o.fullName||"Guest").toLowerCase();
        if (!custMap[key]) custMap[key] = { name: o.fullName || o.email || "Guest", orders:0, spend:0 };
        custMap[key].orders += 1;
        custMap[key].spend += Number(o.totalAmount||0);
      });
      const topCust = Object.values(custMap).sort((a,b)=>b.spend-a.spend).slice(0,15);
      autoTable(doc, {
        startY: 110,
        head: [["#","Customer","Orders","Avg Order","Lifetime Spend"]],
        body: topCust.map((c,i)=>[String(i+1), c.name, String(c.orders), fmtINRpdf(c.spend/c.orders), fmtINRpdf(c.spend)]),
        styles:{ fontSize:9, cellPadding:5 }, headStyles:{ fillColor: GOLD, textColor: INK }, columnStyles:{ 2:{ halign:"right" }, 3:{ halign:"right" }, 4:{ halign:"right" } }, theme:"striped",
      });

      /* ───── PAGE 6 — TOP DISHES ───── */
      doc.addPage();
      drawHeader("Top Selling Items", "Menu performance ranked by revenue");
      const itemMap: Record<string, { qty:number; rev:number }> = {};
      D.o.forEach((x:any)=>(x.items||[]).forEach((it:any)=>{
        itemMap[it.name] = itemMap[it.name] || { qty:0, rev:0 };
        itemMap[it.name].qty += it.quantity||1;
        itemMap[it.name].rev += (it.price||0)*(it.quantity||1);
      }));
      const topItems = Object.entries(itemMap).sort((a,b)=>b[1].rev-a[1].rev).slice(0,20);
      sectionTitle("Bestsellers", 100);
      autoTable(doc, {
        startY: 110,
        head: [["Rank","Dish","Qty Sold","Revenue","Est. Profit (35%)"]],
        body: topItems.map(([k,v],i)=>[String(i+1), k, String(v.qty), fmtINRpdf(v.rev), fmtINRpdf(v.rev*0.35)]),
        styles:{ fontSize:9, cellPadding:5 }, headStyles:{ fillColor: GOLD, textColor: INK }, columnStyles:{ 2:{ halign:"right" }, 3:{ halign:"right" }, 4:{ halign:"right" } }, theme:"striped",
      });

      /* ───── PAGE 7 — INVENTORY ───── */
      doc.addPage();
      drawHeader("Inventory Report", "Stock levels and reorder watchlist");
      sectionTitle("Inventory Summary", 100);
      const lowStock = D.inv.filter((i:any)=>Number(i.quantity||0) <= Number(i.reorder_level||i.min_stock||0));
      kpiCard(40, 120, (W-100)/3, 60, "Total Items", String(D.inv.length));
      kpiCard(40+(W-100)/3+10, 120, (W-100)/3, 60, "Inventory Value", fmtINRpdf(inventoryValue));
      kpiCard(40+((W-100)/3+10)*2, 120, (W-100)/3, 60, "Low Stock Alerts", String(lowStock.length), lowStock.length?"Reorder required":"Healthy", lowStock.length===0);

      sectionTitle("Stock Position", 210);
      autoTable(doc, {
        startY: 220,
        head: [["Item","Category","Qty","Unit","Unit Cost","Value","Status"]],
        body: D.inv.slice(0,25).map((i:any)=>{
          const qty = Number(i.quantity||0);
          const rl = Number(i.reorder_level||i.min_stock||0);
          const status = qty <= rl ? "LOW" : "OK";
          const uc = Number(i.unit_cost||i.cost_per_unit||0);
          return [i.name||i.item_name, i.category||"-", String(qty), i.unit||"-", fmtINRpdf(uc), fmtINRpdf(qty*uc), status];
        }),
        styles:{ fontSize:8, cellPadding:4 }, headStyles:{ fillColor: GOLD, textColor: INK },
        columnStyles:{ 2:{ halign:"right" }, 4:{ halign:"right" }, 5:{ halign:"right" }, 6:{ halign:"center" } },
        didParseCell: (data:any) => { if (data.column.index===6 && data.cell.raw==="LOW") { data.cell.styles.textColor=[178,34,34]; data.cell.styles.fontStyle="bold"; } },
        theme:"striped",
      });

      /* ───── PAGE 8 — PAYROLL ───── */
      doc.addPage();
      drawHeader("Staff & Payroll", "Compensation summary");
      sectionTitle("Payroll Summary", 100);
      const totalGross = D.payroll.reduce((s:number,p:any)=>s+Number(p.gross_pay||p.basic_salary||0),0);
      const totalBonus = D.payroll.reduce((s:number,p:any)=>s+Number(p.bonus||0),0);
      const totalDed = D.payroll.reduce((s:number,p:any)=>s+Number(p.deductions||0),0);
      kpiCard(40, 120, (W-100)/3, 60, "Gross Payroll", fmtINRpdf(totalGross));
      kpiCard(40+(W-100)/3+10, 120, (W-100)/3, 60, "Bonus + Allowances", fmtINRpdf(totalBonus));
      kpiCard(40+((W-100)/3+10)*2, 120, (W-100)/3, 60, "Net Pay", fmtINRpdf(payrollTotal));

      sectionTitle("Employees", 210);
      autoTable(doc, {
        startY: 220,
        head: [["Employee","Role","Basic","Bonus","Deductions","Net Pay"]],
        body: D.payroll.slice(0,25).map((p:any)=>{
          const emp = D.staff.find((s:any)=>s.id===p.staff_id);
          return [emp?.name||p.employee_name||"-", emp?.role||p.role||"-", fmtINRpdf(Number(p.gross_pay||p.basic_salary||0)), fmtINRpdf(Number(p.bonus||0)), fmtINRpdf(Number(p.deductions||0)), fmtINRpdf(Number(p.net_pay||0))];
        }),
        styles:{ fontSize:9, cellPadding:5 }, headStyles:{ fillColor: GOLD, textColor: INK },
        columnStyles:{ 2:{ halign:"right" }, 3:{ halign:"right" }, 4:{ halign:"right" }, 5:{ halign:"right" } },
        theme:"striped",
      });

      /* ───── LAST PAGE — OWNER SUMMARY & AI ───── */
      doc.addPage();
      drawHeader("Owner Summary", "Growth, insights and recommendations");
      sectionTitle("Performance vs Previous Period", 100);
      autoTable(doc, {
        startY: 110,
        head: [["Metric","Current","Previous","Growth"]],
        body: [
          ["Gross Revenue", fmtINRpdf(gst.gross), fmtINRpdf(prevGross), `${revGrowth>=0?"+":""}${revGrowth.toFixed(2)}%`],
          ["Expenses", fmtINRpdf(expensesTotal), fmtINRpdf(expensesPrevTotal), `${expGrowth>=0?"+":""}${expGrowth.toFixed(2)}%`],
          ["Net Profit", fmtINRpdf(netProfit), fmtINRpdf((D.oPrev.reduce((s:number,x:any)=>s+Number(x.totalAmount||0),0)/1.18) - expensesPrevTotal), "—"],
          ["Orders", String(D.o.length), String(D.oPrev.length), `${D.oPrev.length?(((D.o.length-D.oPrev.length)/D.oPrev.length)*100).toFixed(1):"0"}%`],
        ],
        styles:{ fontSize:9, cellPadding:6 }, headStyles:{ fillColor: GOLD, textColor: INK },
        columnStyles:{ 1:{ halign:"right" }, 2:{ halign:"right" }, 3:{ halign:"right" } }, theme:"grid",
      });

      // AI insights
      const insights = generateInsights({
        revGrowth, expGrowth, margin, lowStock: lowStock.length,
        topDish: topItems[0]?.[0], topDishShare: topItems[0] ? (topItems[0][1].rev/Math.max(1,gst.gross))*100 : 0,
        foodCostPct: gst.gross ? (expensesTotal/gst.gross)*100 : 0,
        payrollPct: gst.gross ? (payrollTotal/gst.gross)*100 : 0,
      });
      const aiY = (doc as any).lastAutoTable.finalY + 24;
      sectionTitle("AI Business Insights", aiY);
      fill(SOFT); doc.roundedRect(40, aiY+10, W-80, insights.length*22 + 16, 6,6,"F");
      stroke(GOLD); doc.setLineWidth(0.6); doc.roundedRect(40, aiY+10, W-80, insights.length*22 + 16, 6,6,"S");
      doc.setFont("helvetica","normal"); doc.setFontSize(10); setColor(INK);
      insights.forEach((line, i) => {
        setColor(GOLD); doc.text("◆", 54, aiY+30 + i*22);
        setColor(INK); doc.text(line, 70, aiY+30 + i*22, { maxWidth: W-150 });
      });

      // signature block
      const sy = H - 130;
      stroke(LINE); doc.line(40, sy, W-40, sy);
      doc.setFont("helvetica","normal"); doc.setFontSize(9); setColor(MUTED);
      doc.text("Prepared by", 40, sy+18); doc.text("Authorised by", W-40, sy+18, { align:"right" });
      setColor(INK); doc.setFont("helvetica","bold"); doc.setFontSize(11);
      doc.text("Veloria ERP System", 40, sy+38); doc.text(RESTAURANT.owner, W-40, sy+38, { align:"right" });
      doc.setFont("helvetica","normal"); doc.setFontSize(8); setColor(MUTED);
      doc.text(`Generated ${new Date().toLocaleString("en-IN")}`, 40, sy+52);
      doc.text("Proprietor", W-40, sy+52, { align:"right" });

      // page numbers + footers (skip cover)
      const total = doc.getNumberOfPages();
      for (let i=2; i<=total; i++) { doc.setPage(i); drawFooter(i-1, total-1); }

      doc.save(`Veloria-Financial-Report-${range}-${Date.now()}.pdf`);
      toast({ title: "Premium PDF report generated", description: `${total} pages · investor-ready` });
    } catch (err:any) {
      console.error(err);
      toast({ title:"PDF export failed", description: err.message, variant:"destructive" });
    } finally { setBusy(null); }
  };

  /* ─────────────────────────── EXCEL ─────────────────────────── */
  const exportExcel = async () => {
    setBusy("xlsx");
    try {
      const D = await collect();
      const gst = sumGST(D.o);
      const expensesTotal = D.e.reduce((s:number,x:any)=>s+Number(x.amount||0),0);
      const payrollTotal = D.payroll.reduce((s:number,p:any)=>s+Number(p.net_pay||0),0);
      const billsTotal = D.bills.reduce((s:number,b:any)=>s+Number(b.amount||0),0);
      const netProfit = gst.taxable - expensesTotal - payrollTotal - billsTotal;
      const margin = gst.taxable>0 ? (netProfit/gst.taxable)*100 : 0;
      const aov = D.o.length ? gst.gross / D.o.length : 0;
      const prevGross = D.oPrev.reduce((s:number,x:any)=>s+Number(x.totalAmount||0),0);
      const revGrowth = prevGross>0 ? ((gst.gross-prevGross)/prevGross)*100 : 0;
      const inventoryValue = D.inv.reduce((s:number,i:any)=>s+(Number(i.quantity||0)*Number(i.unit_cost||i.cost_per_unit||0)),0);

      const wb = XLSX.utils.book_new();
      const inr = '"₹"#,##0';
      const pct = '0.00%';

      const makeSheet = (rows: any[][], opts: { cols?: number[]; freeze?: number; merges?: XLSX.Range[]; numFmt?: Record<string,string>; } = {}) => {
        const ws = XLSX.utils.aoa_to_sheet(rows);
        if (opts.cols) ws["!cols"] = opts.cols.map(w=>({ wch: w }));
        if (opts.freeze) ws["!freeze"] = { xSplit: 0, ySplit: opts.freeze } as any;
        ws["!freeze"] = { xSplit: 0, ySplit: opts.freeze ?? 1 } as any;
        if (opts.merges) ws["!merges"] = opts.merges;
        if (opts.numFmt) {
          Object.entries(opts.numFmt).forEach(([addr, z]) => { if (ws[addr]) (ws[addr] as any).z = z; });
        }
        return ws;
      };

      /* DASHBOARD */
      const dashRows: any[][] = [
        ["VELORIA LUXURY DINING — EXECUTIVE DASHBOARD"],
        [`Period: ${D.start.toDateString()} → ${D.end.toDateString()}`],
        [`GSTIN: ${RESTAURANT.gstin}   Proprietor: ${RESTAURANT.owner}`],
        [],
        ["KEY PERFORMANCE INDICATORS"],
        ["Metric", "Value"],
        ["Gross Revenue (incl. GST)", Math.round(gst.gross)],
        ["GST Collected @18%", Math.round(gst.gst)],
        ["Net Revenue (Taxable)", Math.round(gst.taxable)],
        ["Total Expenses", Math.round(expensesTotal + payrollTotal + billsTotal)],
        ["Net Profit", Math.round(netProfit)],
        ["Profit Margin", margin/100],
        ["Revenue Growth (vs prev)", revGrowth/100],
        ["Average Order Value", Math.round(aov)],
        ["Orders", D.o.length],
        ["Reservations", D.r.length],
        ["Inventory Value", Math.round(inventoryValue)],
        ["Food Cost %", gst.gross? (expensesTotal/gst.gross) : 0],
        ["Payroll Cost %", gst.gross? (payrollTotal/gst.gross) : 0],
        ["Utility Cost %", gst.gross? (billsTotal/gst.gross) : 0],
        [],
        ["DAILY REVENUE TREND"],
        ["Date", "Orders", "Gross (₹)", "GST (₹)", "Net (₹)"],
        ...aggregateDaily(D.o).map(d => [d.label, d.count, Math.round(d.value), Math.round(d.value*GST_RATE/(1+GST_RATE)), Math.round(d.value/(1+GST_RATE))]),
      ];
      const dash = makeSheet(dashRows, {
        cols: [38, 22],
        merges: [{ s:{r:0,c:0}, e:{r:0,c:4} }, { s:{r:1,c:0}, e:{r:1,c:4} }, { s:{r:2,c:0}, e:{r:2,c:4} }, { s:{r:4,c:0}, e:{r:4,c:4} }, { s:{r:21,c:0}, e:{r:21,c:4} }],
        numFmt: { B7: inr, B8: inr, B9: inr, B10: inr, B11: inr, B12: pct, B13: pct, B14: inr, B17: inr, B18: pct, B19: pct, B20: pct },
        freeze: 6,
      });
      XLSX.utils.book_append_sheet(wb, dash, "Dashboard");

      /* REVENUE */
      const revRows: any[][] = [
        ["Date","Order ID","Customer","Items","Gross (₹)","Taxable (₹)","GST (₹)","Status"],
        ...D.o.map((o:any)=>{
          const s = splitGST(Number(o.totalAmount||0));
          return [new Date(o.createdAt||o.created_at).toLocaleDateString("en-IN"), o.orderId||o.order_id, o.fullName||o.full_name||"-", (o.items||[]).length, Math.round(s.gross), Math.round(s.taxable), Math.round(s.gst), o.orderStatus||o.order_status];
        }),
      ];
      XLSX.utils.book_append_sheet(wb, makeSheet(revRows, { cols:[14,14,24,8,14,14,14,14], freeze:1 }), "Revenue");

      /* ORDERS */
      const orderRows: any[][] = [
        ["Order ID","Date","Customer","Email","Mobile","City","Items","Gross","Taxable","GST","Payment","Status"],
        ...D.o.map((o:any)=>{
          const s = splitGST(Number(o.totalAmount||0));
          return [o.orderId||o.order_id, new Date(o.createdAt||o.created_at).toLocaleString("en-IN"), o.fullName, o.email, o.mobile, o.city, (o.items||[]).map((i:any)=>`${i.name}×${i.quantity}`).join(", "), Math.round(s.gross), Math.round(s.taxable), Math.round(s.gst), o.paymentStatus, o.orderStatus];
        }),
      ];
      XLSX.utils.book_append_sheet(wb, makeSheet(orderRows, { cols:[14,18,22,26,14,14,40,12,12,12,12,12], freeze:1 }), "Orders");

      /* RESERVATIONS */
      const resRows: any[][] = [
        ["Reservation ID","Date","Time","Guest","Email","Mobile","Guests","Status","Created"],
        ...D.r.map((r:any)=>[r.reservationId||r.reservation_id, r.date, r.time, r.fullName||r.full_name, r.email, r.mobile, r.guests, r.status, new Date(r.createdAt||r.created_at).toLocaleString("en-IN")]),
      ];
      XLSX.utils.book_append_sheet(wb, makeSheet(resRows, { cols:[16,14,10,22,26,14,8,12,18], freeze:1 }), "Reservations");

      /* CUSTOMERS */
      const custMap: Record<string, any> = {};
      D.o.forEach((o:any)=>{
        const k=(o.email||o.fullName||"Guest").toLowerCase();
        if (!custMap[k]) custMap[k]={ name:o.fullName, email:o.email, mobile:o.mobile, orders:0, spend:0, last:""};
        custMap[k].orders++; custMap[k].spend += Number(o.totalAmount||0);
        const dt = new Date(o.createdAt||o.created_at);
        if (!custMap[k].last || dt > new Date(custMap[k].last)) custMap[k].last = dt.toISOString();
      });
      const custList = Object.values(custMap).sort((a:any,b:any)=>b.spend-a.spend);
      const custRows: any[][] = [
        ["Customer","Email","Mobile","Orders","Avg Order (₹)","Lifetime Spend (₹)","Last Order"],
        ...custList.map((c:any)=>[c.name, c.email, c.mobile, c.orders, Math.round(c.spend/c.orders), Math.round(c.spend), new Date(c.last).toLocaleDateString("en-IN")]),
      ];
      XLSX.utils.book_append_sheet(wb, makeSheet(custRows, { cols:[22,28,14,10,14,18,16], freeze:1 }), "Customers");

      /* INVENTORY */
      const invRows: any[][] = [
        ["Item","Category","Qty","Unit","Unit Cost (₹)","Value (₹)","Reorder Level","Status"],
        ...D.inv.map((i:any)=>{
          const qty=Number(i.quantity||0); const rl=Number(i.reorder_level||i.min_stock||0); const uc=Number(i.unit_cost||i.cost_per_unit||0);
          return [i.name||i.item_name, i.category||"-", qty, i.unit||"-", uc, qty*uc, rl, qty<=rl?"LOW":"OK"];
        }),
      ];
      XLSX.utils.book_append_sheet(wb, makeSheet(invRows, { cols:[24,16,8,10,14,16,12,10], freeze:1 }), "Inventory");

      /* PAYROLL */
      const payRows: any[][] = [
        ["Employee","Role","Month","Basic (₹)","Bonus (₹)","Deductions (₹)","Net Pay (₹)","Status"],
        ...D.payroll.map((p:any)=>{
          const emp = D.staff.find((s:any)=>s.id===p.staff_id);
          return [emp?.name||p.employee_name||"-", emp?.role||"-", p.pay_period||p.month||"-", Number(p.gross_pay||p.basic_salary||0), Number(p.bonus||0), Number(p.deductions||0), Number(p.net_pay||0), p.status||"Processed"];
        }),
      ];
      XLSX.utils.book_append_sheet(wb, makeSheet(payRows, { cols:[22,16,14,14,12,14,14,12], freeze:1 }), "Payroll");

      /* EXPENSES */
      const expRows: any[][] = [
        ["Date","Category","Description","Vendor","Method","Amount (₹)"],
        ...D.e.map((x:any)=>[x.expense_date, x.category, x.description||"-", x.vendor||"-", x.payment_method||"-", Number(x.amount||0)]),
        ["","","","","Total", expensesTotal],
      ];
      XLSX.utils.book_append_sheet(wb, makeSheet(expRows, { cols:[14,20,30,18,14,14], freeze:1 }), "Expenses");

      /* P&L */
      const pnlRows: any[][] = [
        ["VELORIA — PROFIT & LOSS STATEMENT"],
        [`Period: ${D.start.toDateString()} → ${D.end.toDateString()}`],
        [],
        ["Particulars","Amount (₹)"],
        ["REVENUE",""],
        ["  Gross Revenue (incl. GST)", Math.round(gst.gross)],
        ["  Less: GST @18%", -Math.round(gst.gst)],
        ["  Net Revenue (Taxable)", Math.round(gst.taxable)],
        ["",""],
        ["EXPENSES",""],
        ...Object.entries(groupExpenses(D.e)).map(([k,v])=>["  "+k, Math.round(v as number)]),
        ["  Payroll (Net)", Math.round(payrollTotal)],
        ["  Utility Bills", Math.round(billsTotal)],
        ["  Total Expenses", Math.round(expensesTotal + payrollTotal + billsTotal)],
        ["",""],
        ["GROSS PROFIT", Math.round(gst.taxable - expensesTotal)],
        ["NET PROFIT", Math.round(netProfit)],
        ["PROFIT MARGIN", margin/100],
      ];
      const pnl = makeSheet(pnlRows, { cols:[40,20], merges:[{s:{r:0,c:0},e:{r:0,c:1}},{s:{r:1,c:0},e:{r:1,c:1}}], freeze:4 });
      // currency format col B from row 6 onward
      pnlRows.forEach((row, idx) => {
        const addr = `B${idx+1}`;
        if (typeof row[1] === "number" && idx !== pnlRows.length-1 && pnl[addr]) (pnl[addr] as any).z = inr;
      });
      const last = `B${pnlRows.length}`; if (pnl[last]) (pnl[last] as any).z = pct;
      XLSX.utils.book_append_sheet(wb, pnl, "Profit & Loss");

      /* GST REPORT */
      const gstRows: any[][] = [
        ["GST REPORT — GSTR-equivalent summary"],
        [`Period: ${D.start.toDateString()} → ${D.end.toDateString()}`],
        [`GSTIN: ${RESTAURANT.gstin}`],
        [],
        ["Date","Order ID","Taxable Value (₹)","CGST 9% (₹)","SGST 9% (₹)","Total GST (₹)","Invoice Total (₹)"],
        ...D.o.map((o:any)=>{
          const s = splitGST(Number(o.totalAmount||0));
          const half = s.gst/2;
          return [new Date(o.createdAt||o.created_at).toLocaleDateString("en-IN"), o.orderId||o.order_id, Math.round(s.taxable), Math.round(half), Math.round(half), Math.round(s.gst), Math.round(s.gross)];
        }),
        ["","Total", Math.round(gst.taxable), Math.round(gst.gst/2), Math.round(gst.gst/2), Math.round(gst.gst), Math.round(gst.gross)],
      ];
      const gstWS = makeSheet(gstRows, { cols:[14,16,18,14,14,14,18], merges:[{s:{r:0,c:0},e:{r:0,c:6}},{s:{r:1,c:0},e:{r:1,c:6}},{s:{r:2,c:0},e:{r:2,c:6}}], freeze:5 });
      XLSX.utils.book_append_sheet(wb, gstWS, "GST Report");

      XLSX.writeFile(wb, `Veloria-Workbook-${range}-${Date.now()}.xlsx`);
      toast({ title: "Excel workbook generated", description: "10 sheets · formatted & investor-ready" });
    } catch (err:any) {
      console.error(err);
      toast({ title:"Excel export failed", description: err.message, variant:"destructive" });
    } finally { setBusy(null); }
  };

  const ranges: { id: RangeKey; label: string }[] = [
    { id:"today", label:"Today" }, { id:"yesterday", label:"Yesterday" }, { id:"7days", label:"Last 7 Days" },
    { id:"month", label:"This Month" }, { id:"lastmonth", label:"Last Month" }, { id:"quarter", label:"Quarterly" },
    { id:"year", label:"Yearly" }, { id:"custom", label:"Custom" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold font-serif">Report Center</h1>
          <p className="text-sm text-muted-foreground mt-1">CFO-grade financial reports — premium PDF & multi-sheet Excel, GST-ready.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30">
          <Sparkles size={14} className="text-primary"/>
          <span className="text-xs text-primary font-medium">Investor · Accountant · CA-ready</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h2 className="font-serif text-lg">1. Choose Period</h2>
        <div className="flex flex-wrap gap-2">
          {ranges.map(k=>(
            <button key={k.id} onClick={()=>setRange(k.id)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${range===k.id?"bg-primary text-primary-foreground shadow-lg shadow-primary/30":"bg-background border border-border hover:border-primary/40"}`}>
              {k.label}
            </button>
          ))}
        </div>
        {range==="custom" && (
          <div className="flex gap-3 flex-wrap">
            <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
            <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="bg-background border border-border rounded-xl px-4 py-2 text-sm"/>
          </div>
        )}

        <div className="h-px bg-border my-2"/>
        <h2 className="font-serif text-lg">2. Generate Report</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button onClick={exportPDF} disabled={!!busy} className="group relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/40 rounded-2xl p-6 text-left hover:border-primary transition disabled:opacity-50">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20"><FileText size={22} className="text-primary"/></div>
              <div className="flex-1">
                <h3 className="font-serif text-lg mb-1">Premium PDF Report</h3>
                <p className="text-xs text-muted-foreground mb-3">9-page branded financial dossier: cover, exec summary, P&L, revenue & expense analytics with charts, top customers, bestsellers, inventory, payroll, AI insights, signature block.</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">{busy==="pdf"?"Generating...":"Export PDF →"}</span>
              </div>
            </div>
          </button>
          <button onClick={exportExcel} disabled={!!busy} className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/30 rounded-2xl p-6 text-left hover:border-emerald-500 transition disabled:opacity-50">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/15"><FileSpreadsheet size={22} className="text-emerald-500"/></div>
              <div className="flex-1">
                <h3 className="font-serif text-lg mb-1">Multi-Sheet Excel Workbook</h3>
                <p className="text-xs text-muted-foreground mb-3">10 formatted sheets: Dashboard, Revenue, Orders, Reservations, Customers, Inventory, Payroll, Expenses, P&L, GST Report. Frozen headers, ₹ formatting, totals.</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500">{busy==="xlsx"?"Generating...":"Export Excel →"}</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { i: IndianRupee, t:"GST Engine", d:"18% split into CGST 9% + SGST 9%" },
          { i: Receipt, t:"GSTR-Ready", d:"Invoice-level taxable/GST split" },
          { i: TrendingUp, t:"Growth Metrics", d:"vs prev period comparisons" },
          { i: Users, t:"CLV Tracking", d:"Lifetime spend & AOV per customer" },
          { i: Package, t:"Inventory Watch", d:"Low-stock alerts & valuation" },
          { i: Sparkles, t:"AI Insights", d:"Owner-level recommendations" },
          { i: FileText, t:"Branded Cover", d:"Veloria identity, GSTIN, proprietor" },
          { i: TrendingDown, t:"Cost Ratios", d:"Food, payroll, utility %" },
        ].map((x,i)=>(
          <div key={i} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><x.i size={16} className="text-primary"/></div>
            <div><p className="text-sm font-medium">{x.t}</p><p className="text-xs text-muted-foreground mt-0.5">{x.d}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ───────── HELPERS ───────── */
function aggregateDaily(orders:any[]) {
  const map = new Map<string, { count:number; value:number }>();
  orders.forEach((o:any)=>{
    const d = new Date(o.createdAt||o.created_at);
    const key = d.toLocaleDateString("en-IN", { day:"2-digit", month:"short" });
    const cur = map.get(key) || { count:0, value:0 };
    cur.count++; cur.value += Number(o.totalAmount||0);
    map.set(key, cur);
  });
  return Array.from(map.entries()).map(([label, v]) => ({ label, ...v }));
}
function aggregateHourly(orders:any[]) {
  const arr = Array.from({length:24}, (_,h)=>({ label:`${h}:00`, value:0, count:0 }));
  orders.forEach((o:any)=>{
    const h = new Date(o.createdAt||o.created_at).getHours();
    arr[h].value += Number(o.totalAmount||0); arr[h].count++;
  });
  return arr.filter(x=>x.value>0);
}
function groupExpenses(e:any[]) {
  const out: Record<string, number> = {};
  e.forEach(x => { out[x.category] = (out[x.category]||0) + Number(x.amount||0); });
  return out;
}
function expenseRows(e:any[], payroll:number, bills:number): any[][] {
  const grouped = groupExpenses(e);
  const rows: any[][] = Object.entries(grouped).map(([k,v]) => [k, fmtINRpdf(v as number)]);
  if (payroll) rows.push(["Payroll (Net)", fmtINRpdf(payroll)]);
  if (bills) rows.push(["Utility Bills", fmtINRpdf(bills)]);
  return rows;
}
function drawBarChart(doc: jsPDF, x:number, y:number, w:number, h:number, data:{label:string; value:number}[], caption?:string) {
  doc.setDrawColor(220,215,200); doc.setLineWidth(0.5);
  doc.rect(x, y, w, h);
  if (!data.length) {
    doc.setFont("helvetica","italic"); doc.setFontSize(9); doc.setTextColor(150);
    doc.text("No data for this period", x+w/2, y+h/2, { align:"center" });
    return;
  }
  const max = Math.max(...data.map(d=>d.value)) || 1;
  const slots = data.length;
  const padding = 10;
  const innerW = w - padding*2;
  const innerH = h - padding*2 - 14;
  const bw = (innerW / slots) * 0.7;
  const gap = (innerW / slots) * 0.3;
  data.forEach((d, i) => {
    const bh = (d.value / max) * innerH;
    const bx = x + padding + i*(bw+gap) + gap/2;
    const by = y + padding + (innerH - bh);
    doc.setFillColor(212,175,55); doc.rect(bx, by, bw, bh, "F");
    doc.setFontSize(6); doc.setTextColor(80);
    if (slots <= 20) doc.text(d.label, bx + bw/2, y+h-4, { align:"center" });
  });
  if (caption) { doc.setFontSize(8); doc.setTextColor(150); doc.text(caption, x+w-4, y+10, { align:"right" }); }
}
function drawPieChart(doc: jsPDF, x:number, y:number, size:number, entries:[string, number][]) {
  if (!entries.length) {
    doc.setFont("helvetica","italic"); doc.setFontSize(9); doc.setTextColor(150);
    doc.text("No expenses recorded", x, y+size/2);
    return;
  }
  const total = entries.reduce((s,[,v])=>s+v,0) || 1;
  const cx = x + size/2, cy = y + size/2, r = size/2 - 6;
  let acc = -Math.PI/2;
  const palette: [number,number,number][] = [[212,175,55],[60,60,80],[180,140,60],[120,90,40],[200,180,140],[80,80,100],[160,120,50],[240,210,150],[140,110,70],[100,90,80]];
  entries.forEach(([, v], i) => {
    const ang = (v/total) * Math.PI*2;
    const steps = Math.max(6, Math.ceil(ang*16));
    const pts: [number,number][] = [[cx, cy]];
    for (let s=0; s<=steps; s++) {
      const a = acc + (ang*s/steps);
      pts.push([cx + Math.cos(a)*r, cy + Math.sin(a)*r]);
    }
    const c = palette[i % palette.length];
    doc.setFillColor(c[0], c[1], c[2]);
    // jspdf doesn't support polygons natively for fill; emulate with triangles
    for (let t=1; t<pts.length-1; t++) {
      doc.triangle(pts[0][0],pts[0][1], pts[t][0],pts[t][1], pts[t+1][0],pts[t+1][1], "F");
    }
    acc += ang;
  });
  // legend
  const lx = x + size + 20;
  let ly = y + 8;
  doc.setFontSize(9);
  entries.slice(0,8).forEach(([k,v], i) => {
    const c = palette[i % palette.length];
    doc.setFillColor(c[0],c[1],c[2]); doc.rect(lx, ly-7, 10, 10, "F");
    doc.setTextColor(40); doc.text(`${k}`, lx+16, ly);
    doc.setTextColor(120); doc.text(`${fmtINRpdf(v)}  ·  ${((v/total)*100).toFixed(1)}%`, lx+16, ly+10);
    ly += 24;
  });
}
function generateInsights(o:{ revGrowth:number; expGrowth:number; margin:number; lowStock:number; topDish?:string; topDishShare:number; foodCostPct:number; payrollPct:number; }) {
  const out: string[] = [];
  if (o.revGrowth > 5) out.push(`Revenue is up ${o.revGrowth.toFixed(1)}% vs the previous period — momentum is strong.`);
  else if (o.revGrowth < -5) out.push(`Revenue dropped ${Math.abs(o.revGrowth).toFixed(1)}% vs previous period — review marketing & menu pricing.`);
  else out.push(`Revenue is broadly flat (${o.revGrowth.toFixed(1)}%) — consider promotions or upsell programmes.`);
  if (o.expGrowth > 10) out.push(`Expenses rose ${o.expGrowth.toFixed(1)}% — investigate top categories for waste.`);
  if (o.margin < 10) out.push(`Net margin at ${o.margin.toFixed(1)}% is below industry healthy band (12–18%) — tighten food cost.`);
  else if (o.margin > 18) out.push(`Net margin of ${o.margin.toFixed(1)}% is excellent — reinvest in marketing or staff bonus.`);
  if (o.lowStock > 0) out.push(`${o.lowStock} inventory item(s) are below reorder level — restock to prevent menu gaps.`);
  if (o.topDish && o.topDishShare > 15) out.push(`"${o.topDish}" generated ${o.topDishShare.toFixed(1)}% of revenue — consider promoting it as a hero dish.`);
  if (o.foodCostPct > 35) out.push(`Inventory/food cost at ${o.foodCostPct.toFixed(1)}% of revenue is high — target ≤30%.`);
  if (o.payrollPct > 30) out.push(`Payroll at ${o.payrollPct.toFixed(1)}% of revenue is elevated — review shift scheduling.`);
  out.push(`Next-period forecast: at current trend, expect revenue around ${(100 + o.revGrowth).toFixed(0)}% of current period.`);
  return out.slice(0, 8);
}

export default ReportsSection;
