/**
 * Currency utilities for Veloria
 * Single source of truth for INR formatting
 */

export const CURRENCY = "INR";

/**
 * Format number into Indian Rupee currency
 * Example: 1299 -> ₹1,299
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Alias for compatibility & clean naming
 * Use formatPrice() across UI if preferred
 */
export const formatPrice = (amount: number): string => {
  return formatINR(amount);
};

/**
 * Convert any numeric value to INR (future-safe)
 * Useful if you later add multi-currency support
 */
export const convertToINR = (amount: number): string => {
  return formatINR(amount);
};

/**
 * Convert INR amount to paise (for Razorpay / Stripe)
 * UI must NEVER use this
 */
export const toPaise = (amount: number): number => {
  return Math.round(amount * 100);
};
