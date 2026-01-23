import { useState } from "react";
import { useOrders } from "@/context/AdminContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TrackOrder = () => {
  const { orders } = useOrders();
  const [orderId, setOrderId] = useState("");
  const [mobile, setMobile] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = () => {
    const found = orders.find(
      (o) =>
        o.id === orderId.trim() &&
        o.mobile === mobile.trim()
    );

    if (!found) {
      setError("Order not found. Please check details.");
      setResult(null);
      return;
    }

    setResult(found);
    setError("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 section-container max-w-xl mx-auto">
        <h1 className="font-serif text-4xl mb-6 text-center">
          Track Your Order
        </h1>

        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
          <input
            placeholder="Order ID (e.g. ORD-M6YYD1)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full input"
          />
          <input
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full input"
          />

          <button
            onClick={handleTrack}
            className="btn-gold w-full"
          >
            Track Order
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}
        </div>

        {result && (
          <div className="mt-8 bg-white rounded-3xl shadow-lg p-6 space-y-2">
            <p><b>Order ID:</b> {result.id}</p>
            <p><b>Name:</b> {result.customer}</p>
            <p><b>Total:</b> ₹{result.total}</p>
            <p><b>Payment:</b> {result.payment}</p>
            <p className="font-semibold">
              Status:{" "}
              <span className="text-primary">
                {result.status}
              </span>
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
