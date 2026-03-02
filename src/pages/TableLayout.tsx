import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Hash, CircleDot, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import TableScene from "@/components/table-view/TableScene";
import type { TableData } from "@/hooks/useTableLayout";

const TableLayout: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

  const handleSelectTable = (table: TableData | null) => {
    setSelectedTable((prev) => (prev?.id === table?.id ? null : table));
  };

  const handleReserve = () => {
    if (!selectedTable) return;
    navigate(`/reservations?table=${selectedTable.tableNumber}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <Navbar />

      {/* Header */}
      <div className="fixed top-20 left-0 right-0 z-30 flex items-center justify-between px-6 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-primary transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center">
          <h1 className="font-serif text-xl md:text-2xl tracking-wide">
            <span className="text-primary">3D</span> Table View
          </h1>
          <p className="text-zinc-500 text-xs mt-0.5">Click a table to view details</p>
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary/80" /> Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" /> Reserved
          </span>
        </div>
      </div>

      {/* 3D Canvas — full screen */}
      <div className="fixed inset-0 pt-16">
        <TableScene onSelectTable={handleSelectTable} selectedTable={selectedTable} />
      </div>

      {/* Floating Info Card */}
      <AnimatePresence>
        {selectedTable && (
          <motion.div
            key={selectedTable.id}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm"
          >
            <div className="relative bg-[#151517]/95 backdrop-blur-xl border border-primary/20 rounded-3xl p-6 shadow-[0_0_60px_rgba(212,175,55,0.08)]">
              {/* Close button */}
              <button
                onClick={() => setSelectedTable(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition"
              >
                <X size={14} className="text-zinc-400" />
              </button>

              {/* Table info */}
              <div className="flex items-start gap-4 mb-5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    selectedTable.isReserved
                      ? "bg-red-500/15 text-red-400"
                      : "bg-primary/15 text-primary"
                  }`}
                >
                  <Hash size={20} />
                </div>

                <div className="flex-1">
                  <h3 className="font-serif text-xl">
                    Table {selectedTable.tableNumber}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {selectedTable.capacity} seats
                    </span>
                    <span className="flex items-center gap-1">
                      <CircleDot size={14} />
                      {selectedTable.isReserved ? (
                        <span className="text-red-400">Reserved</span>
                      ) : (
                        <span className="text-green-400">Available</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              {selectedTable.isReserved ? (
                <div className="text-center py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  This table is currently reserved
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReserve}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm shadow-gold hover:opacity-90 transition"
                >
                  Reserve Table {selectedTable.tableNumber}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile legend */}
      <div className="fixed bottom-4 right-4 z-30 md:hidden flex flex-col gap-1.5 text-[10px] bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/5">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary/80" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" /> Reserved
        </span>
      </div>
    </div>
  );
};

export default TableLayout;
