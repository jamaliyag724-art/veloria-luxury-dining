import { supabase } from "@/integrations/supabase/client";

export const EXPENSE_CATEGORIES = [
  "Staff Salary", "Rent", "Electricity Bill", "Water Bill", "Internet",
  "Gas", "Inventory Purchase", "Vendor Payment", "Maintenance", "Cleaning",
  "Marketing", "Tax", "Miscellaneous",
] as const;

export const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "UPI", "Cheque"] as const;
export const UTILITY_TYPES = ["Electricity", "Water", "Internet", "Gas"] as const;

export const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

export async function fetchAll<T = any>(table: string): Promise<T[]> {
  const { data } = await (supabase as any).from(table).select("*");
  return (data as T[]) || [];
}
