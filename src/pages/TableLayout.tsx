import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Hash, CircleDot, X, MapPin, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import TableScene from "@/components/table-view/TableScene";
import type { TableData } from "@/hooks/useTableLayout";
import { cameraPresets } from "@/hooks/useTableLayout";
import { fmtINR } from "@/lib/finance";

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  available: { text: "Available", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  reserved:  { text: "Reserved",  cls: "text-primary bg-primary/10 border-primary/30" },
  occupied:  { text: "Occupied",  cls: "text-red-400 bg-red-500/10 border-red-500/30" },
  cleaning:  { text: "Cleaning",  cls: "text-sky-400 bg-sky-500/10 border-sky-500/30" },
};

const CAMERA_VIEWS: { key: keyof typeof cameraPresets; label: string }[] = [
  { key: "reset",    label: "Reset" },
  { key: "top",      label: "Top View" },
  { key: "entrance", label: "Entrance" },
  { key: "vip",      label: "VIP Room" },
  { key: "bar",      label: "Bar" },
  { key: "kitchen",  label: "Kitchen" },
  { key: "garden",   label: "Garden" },
];

const TableLayout: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [view, setView] = useState<keyof typeof cameraPresets>("reset");

  const handleSelectTable = (table: TableData | null) => {
    setSelectedTable((prev) => (prev?.id === table?.id ? null : table));
  };

  const handleReserve = () => {
    if (!selectedTable) return;
    const params = new URLSearchParams({
      table: selectedTable.tableNumber,
      category: selectedTable.category,
      seats: String(selectedTable.capacity),
      minSpend: String(selectedTable.minSpend),
      area: selectedTable.area,
    });
    navigate(`/reservations?${params.toString()}`);
  };

  const disabled = selectedTable && selectedTable.status !== "available";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      {/* Header */}
      <div className="fixed top-20 left-0 right-0 z-30 flex items-center justify-between px-6 py-3 pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="pointer-events-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-border"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="text-center pointer-events-none">
          <h1 className="font-serif text-xl md:text-2xl tracking-wide">
            <span className="text-primary">Veloria</span> · Luxury Floor
          </h1>
          <p className="text-muted-foreground text-[11px] mt-0.5 tracking-[0.2em] uppercase">The Leela · Gandhinagar</p>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] pointer-events-auto bg-background/60 backdrop-blur-md border border-border rounded-full px-3 py-1.5">
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <span key={k} className={`flex items-center gap-1.5 px-1.5`}>
              <span className={`w-2 h-2 rounded-full`} style={{ background: { available:"#3fb27f", reserved:"#D4AF37", occupied:"#c0392b", cleaning:"#3a8fd8" }[k] }} />
              {v.text}
            </span>
          ))}
        </div>
      </div>

      {/* Camera presets */}
      <div className="fixed top-36 left-1/2 -translate-x-1/2 z-30 flex flex-wrap justify-center gap-1.5 bg-background/60 backdrop-blur-md border border-border rounded-full p-1.5 max-w-[92vw]">
        {CAMERA_VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={`px-3 py-1 rounded-full text-[11px] tracking-wide transition ${
              view === v.key ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* 3D Canvas */}
      <div className="fixed inset-0 pt-16">
        <TableScene onSelectTable={handleSelectTable} selectedTable={selectedTable} cameraPreset={view} />
      </div>

      {/* Floating Info Sidebar */}
      <AnimatePresence>
        {selectedTable && (
          <motion.aside
            key={selectedTable.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-[92vw] max-w-sm"
          >
            <div className="relative bg-card/90 backdrop-blur-2xl border border-primary/25 rounded-3xl p-6 shadow-[0_20px_60px_rgba(212,175,55,0.12)]">
              <button
                onClick={() => setSelectedTable(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-background/60 hover:bg-background transition"
              >
                <X size={14} />
              </button>

              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/15 text-primary border border-primary/30">
                  <Hash size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl leading-tight">Table {selectedTable.tableNumber}</h3>
                  <p className="text-xs text-primary tracking-wider uppercase mt-0.5">{selectedTable.category}</p>
                </div>
              </div>

              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] border mb-5 ${STATUS_LABEL[selectedTable.status].cls}`}>
                <CircleDot size={12} /> {STATUS_LABEL[selectedTable.status].text}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                <div className="rounded-xl border border-border p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Seats</p>
                  <p className="font-semibold flex items-center gap-1.5 mt-1"><Users size={14} className="text-primary" />{selectedTable.capacity}</p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Area</p>
                  <p className="font-semibold flex items-center gap-1.5 mt-1 truncate"><MapPin size={14} className="text-primary" />{selectedTable.area}</p>
                </div>
                <div className="rounded-xl border border-primary/40 bg-primary/5 p-3 col-span-2">
                  <p className="text-[10px] text-primary uppercase tracking-wider flex items-center gap-1"><Sparkles size={11} /> Minimum Spend</p>
                  <p className="font-serif text-2xl text-primary mt-1">{fmtINR(selectedTable.minSpend)}</p>
                </div>
              </div>

              {disabled ? (
                <div className="text-center py-3 rounded-2xl bg-muted/30 border border-border text-muted-foreground text-sm">
                  This table is currently {selectedTable.status}
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReserve}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-semibold text-sm shadow-lg hover:shadow-primary/30 transition"
                >
                  Reserve {selectedTable.tableNumber} →
                </motion.button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TableLayout;
