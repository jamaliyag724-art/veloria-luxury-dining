export const USD_TO_INR = 83;

export const formatINR = (usdPrice: number) => {
  const inr = usdPrice * USD_TO_INR;
  return `₹${inr.toFixed(0)}`;
};
