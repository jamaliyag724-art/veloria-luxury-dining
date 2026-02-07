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

import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { formatINR } from "@/lib/currency";

/* -------------------- VALIDATION -------------------- */
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
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
  });

  /* -------------------- PRICE -------------------- */
  const subtotal = totalPrice;
  const taxAmount = subtotal * TAX_RATE;
  const totalAmount = subtotal + taxAmount;

  /* -------------------- FORM -------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid =
    checkoutSchema.safeParse(formData).success && items.length > 0;

  /* -------------------- FAKE PAYMENT -------------------- */
  const handlePayment = async () => {
    const validation = checkoutSchema.safeParse(formData);
    if (!validation.success || items.length === 0) return;

    setStep("processing");

    try {
      const orderId = await addOrder({
        fullName: validation.data.fullName,
        email: validation.data.email,
        mobile: validation.data.mobile,
        address: validation.data.address,
        city: validation.data.city,
        pincode: validation.data.pincode,
        items,
        subtotal,
        tax: taxAmount,
        totalAmount,
      });

      confetti({ particleCount: 120, spread: 80 });
      clearCart();

      navigate(`/order-success/${orderId}`);
    } catch (err) {
      console.error("Fake payment failed:", err);
      setStep("payment");
    }
  };

  /* -------------------- PROCESSING -------------------- */
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

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-24 pb-24">
        <div className="section-container max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/menu")}
            className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft size={16} /> Back to Menu
          </button>

          <h1 className="font-serif text-4xl text-center mb-10">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* DELIVERY FORM */}
            <div className="lg:col-span-2 glass-card p-6">
              <h2 className="font-serif text-xl mb-6">
                Delivery Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  ["fullName", "Full Name"],
                  ["email", "Email"],
                  ["mobile", "Mobile"],
                  ["city", "City"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-sm">{label}</label>
                    <input
                      name={key}
                      value={(formData as any)[key]}
                      onChange={handleChange}
                      className="luxury-input"
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="text-sm">Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="luxury-input"
                  />
                </div>

                <div>
                  <label className="text-sm">Pincode</label>
                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="luxury-input"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="glass-card p-6 h-fit">
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
                  className={`w-full mb-3 p-3 rounded-xl border ${
                    paymentMethod === m.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <m.icon className="inline mr-2" /> {m.label}
                </button>
              ))}

              <button
                disabled={!isFormValid}
                onClick={handlePayment}
                className="btn-gold w-full mt-6 disabled:opacity-50"
              >
                Pay {formatINR(totalAmount)}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
