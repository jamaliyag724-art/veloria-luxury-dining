// src/lib/utils/currency.ts

const USD_TO_INR = 83; // 🔁 change here if rate updates

export const convertToINR = (usd: number): number => {
  return Math.round(usd * USD_TO_INR);
};

export const formatINR = (usd: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(convertToINR(usd));
};
