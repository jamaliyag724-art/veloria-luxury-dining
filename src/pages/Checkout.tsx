import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Smartphone,
  Wallet,
  ArrowLeft,
} from "lucide-react";
import confetti from "canvas-confetti";
import { z } from "zod";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import CouponInput from "@/components/checkout/CouponInput";

import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { formatINR } from "@/lib/currency";

/* ---------------- VALIDATION ---------------- */
const checkoutSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  address: z.string().min(5),
  city: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const TAX_RATE = 0.1;

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState<"payment" | "processing">("payment");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
  });

  const subtotal = totalPrice;
  const discountedSubtotal = subtotal - couponDiscount;
  const taxAmount = Math.round(discountedSubtotal * TAX_RATE);
  const totalAmount = discountedSubtotal + taxAmount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid =
    checkoutSchema.safeParse(formData).success && items.length > 0;

  const handlePayment = async () => {
    const validation = checkoutSchema.safeParse(formData);
    if (!validation.success || items.length === 0) return;

    const validData = validation.data;
    setStep("processing");
    setPaymentError(null);

    try {
      // addOrder handles DB insert + fake payment delay
      const orderId = await addOrder({
        fullName: validData.fullName,
        email: validData.email,
        mobile: validData.mobile,
        address: validData.address,
        city: validData.city,
        pincode: validData.pincode,
        items,
        subtotal: discountedSubtotal,
        tax: taxAmount,
        totalAmount,
      });

      // Only play sound & celebrate AFTER successful DB insert
      const audio = new Audio("/sounds/payment-success.mp3");
      audio.volume = 0.6;
      audio.play().catch(() => {});

      if (navigator.vibrate) navigator.vibrate(100);

      confetti({ particleCount: 120, spread: 80 });
      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      console.error("Payment Error:", err);
      setPaymentError("Payment failed. Please try again.");
      setStep("payment");
    }
  };

  /* ---------------- PROCESSING SCREEN ---------------- */
  if (step === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-32 pb-32">
        <div className="max-w-6xl mx-auto px-6">

          <button
            onClick={() => navigate("/menu")}
            className="flex items-center gap-2 mb-10 text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft size={16} /> Back to Menu
          </button>

          <h1 className="font-serif text-5xl text-center mb-16">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-10 items-start">

            {/* LEFT DELIVERY */}
            <div className="lg:col-span-2 relative">
              <div className="absolute -inset-1 bg-primary/10 blur-2xl opacity-40 rounded-3xl" />

              <div className="relative bg-card backdrop-blur-2xl border border-border rounded-3xl p-10 shadow-xl">
                <h2 className="font-serif text-2xl mb-8">
                  Delivery Details
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    ["fullName", "Full Name"],
                    ["email", "Email"],
                    ["mobile", "Mobile"],
                    ["city", "City"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        {label}
                      </label>
                      <input
                        name={key}
                        value={(formData as any)[key]}
                        onChange={handleChange}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition"
                      />
                    </div>
                  ))}

                  <div className="md:col-span-2">
                    <label className="text-sm text-muted-foreground mb-1 block">
                      Address
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">
                      Pincode
                    </label>
                    <input
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PAYMENT */}
            <div className="relative">
              <div className="absolute -inset-1 bg-primary/10 blur-2xl opacity-40 rounded-3xl" />

              <div className="relative bg-card backdrop-blur-2xl border border-border rounded-3xl p-8 shadow-xl">
                <h2 className="font-serif text-xl mb-6">
                  Payment Method
                </h2>

                {[
                  { id: "card", icon: CreditCard, label: "Card" },
                  { id: "upi", icon: Smartphone, label: "UPI" },
                  { id: "wallet", icon: Wallet, label: "Wallet" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`w-full mb-4 p-4 rounded-xl border transition ${
                      paymentMethod === m.id
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                  >
                    <m.icon className="inline mr-2 text-primary" />
                    {m.label}
                  </button>
                ))}

                <CouponInput
                  subtotal={subtotal}
                  onApply={(disc, code) => {
                    setCouponDiscount(disc);
                    setCouponCode(code);
                  }}
                  onRemove={() => {
                    setCouponDiscount(0);
                    setCouponCode(null);
                  }}
                  appliedCode={couponCode}
                  discount={couponDiscount}
                />

                {paymentError && (
                  <p className="mt-4 text-sm text-destructive text-center">{paymentError}</p>
                )}

                <button
                  disabled={!isFormValid}
                  onClick={handlePayment}
                  className="w-full mt-8 py-4 rounded-xl font-medium bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  Pay {formatINR(totalAmount)}
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
