import { supabase } from "@/integrations/supabase/client";

export const EXPENSE_CATEGORIES = [
  "Staff Salary", "Rent", "Electricity Bill", "Water Bill", "Internet",
  "Gas", "Inventory Purchase", "Vendor Payment", "Maintenance", "Cleaning",
  "Marketing", "Tax", "Miscellaneous",
] as const;

export const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "UPI", "Cheque"] as const;
export const UTILITY_TYPES = ["Electricity", "Water", "Internet", "Gas"] as const;

/* ───────── BRAND / RESTAURANT META ───────── */
export const RESTAURANT = {
  name: "Veloria Luxury Dining",
  address: "12 Marine Drive, Mumbai, Maharashtra 400020, India",
  gstin: "27AABCV1234F1Z5",
  owner: "Gaurang",
  phone: "+91 9537248835",
  email: "owner@veloria.com",
  website: "veloria.com",
  pan: "AABCV1234F",
} as const;

/* ───────── CURRENCY ───────── */
export const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

export const fmtINRpdf = (n: number) =>
  "Rs. " + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n || 0));

/* ───────── GST (18%) ─────────
 * Assumes order totalAmount stored is GST-inclusive.
 * taxable = total / 1.18, gst = total - taxable
 */
export const GST_RATE = 0.18;

export const splitGST = (grossInclusive: number) => {
  const taxable = grossInclusive / (1 + GST_RATE);
  const gst = grossInclusive - taxable;
  return { taxable, gst, gross: grossInclusive };
};

export const sumGST = (orders: any[]) => {
  let gross = 0, taxable = 0, gst = 0;
  orders.forEach((o) => {
    const t = Number(o.totalAmount || o.total_amount || 0);
    gross += t;
    const s = splitGST(t);
    taxable += s.taxable;
    gst += s.gst;
  });
  return { gross, taxable, gst };
};

export async function fetchAll<T = any>(table: string): Promise<T[]> {
  const { data } = await (supabase as any).from(table).select("*");
  return (data as T[]) || [];
}
