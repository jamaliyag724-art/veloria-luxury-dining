import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, CheckCircle, AlertCircle } from "lucide-react";
import { formatINR } from "@/lib/currency";

interface Coupon {
  code: string;
  type: "percent";
  value: number;
  minOrder: number;
  label: string;
}

const COUPONS: Coupon[] = [
  { code: "WELCOME10", type: "percent", value: 10, minOrder: 0, label: "10% off" },
  { code: "VELORIA20", type: "percent", value: 20, minOrder: 2000, label: "20% off (min ₹2000)" },
  { code: "VIP30", type: "percent", value: 30, minOrder: 0, label: "30% off — VIP" },
];

interface CouponInputProps {
  subtotal: number;
  onApply: (discount: number, code: string) => void;
  onRemove: () => void;
  appliedCode: string | null;
  discount: number;
}

const CouponInput: React.FC<CouponInputProps> = ({
  subtotal,
  onApply,
  onRemove,
  appliedCode,
  discount,
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    setError("");
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    const coupon = COUPONS.find((c) => c.code === trimmed);
    if (!coupon) {
      setError("Invalid coupon code.");
      return;
    }
    if (subtotal < coupon.minOrder) {
      setError(`Minimum order of ${formatINR(coupon.minOrder)} required.`);
      return;
    }

    const discountAmt = Math.round((subtotal * coupon.value) / 100);
    onApply(discountAmt, coupon.code);
    setCode("");
  };

  const handleRemove = () => {
    onRemove();
    setCode("");
    setError("");
  };

  return (
    <div className="mt-4">
      <AnimatePresence mode="wait">
        {appliedCode ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between p-3 rounded-xl border border-primary/30 bg-primary/5"
          >
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="font-medium">{appliedCode}</span>
              <span className="text-muted-foreground">— You save {formatINR(discount)}</span>
            </div>
            <button onClick={handleRemove} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
                  placeholder="Coupon Code"
                  className="luxury-input pl-9 !py-2.5 text-sm tracking-wider"
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                />
              </div>
              <button
                onClick={handleApply}
                className="px-5 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition"
              >
                Apply
              </button>
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-1 text-accent text-xs mt-2"
                >
                  <AlertCircle className="w-3 h-3" /> {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponInput;
