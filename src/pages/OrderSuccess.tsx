import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Clock,
  ChefHat,
  Download,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import { supabase } from "@/integrations/supabase/client";

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  /* ---------------- FETCH ORDER FROM SUPABASE ---------------- */
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_id", orderId)
        .single();

      if (!error && data) {
        setOrder({
          orderId: data.order_id,
          fullName: data.full_name,
          email: data.email,
          mobile: data.mobile,
          address: data.address,
          city: data.city,
          pincode: data.pincode,
          items: data.items || [],
          subtotal: data.subtotal,
          tax: data.tax,
          totalAmount: data.total_amount,
          orderStatus: data.order_status,
          paymentStatus: data.payment_status,
        });
      }

      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading order...
      </div>
    );
  }

  /* ---------------- NOT FOUND ---------------- */
  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onCartClick={() => setCartOpen(true)} />
        <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <main className="pt-32 text-center">
          <h1 className="font-serif text-3xl mb-4">Order Not Found</h1>
          <button onClick={() => navigate("/menu")} className="btn-gold">
            Browse Menu
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  /* ---------------- STATUS ICON ---------------- */
  const getStatusIcon = () => {
    switch (order.orderStatus) {
      case "Preparing":
        return <ChefHat className="w-5 h-5 text-amber-600" />;
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "Cancelled":
        return <Package className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  /* ---------------- QR DOWNLOAD ---------------- */
  const handleDownloadQR = () => {
    const svg = document.getElementById("order-qr");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const png = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = png;
      a.download = `veloria-${order.orderId}.png`;
      a.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="section-container max-w-2xl mx-auto text-center"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="font-serif text-3xl mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Your order is placed & being prepared
          </p>

          <div className="glass-card p-6 mb-8">
            <p className="text-sm mb-1">Order ID</p>
            <p className="font-serif text-3xl text-primary mb-6">
              {order.orderId}
            </p>

            <div className="bg-white p-4 rounded-xl inline-block shadow mb-4">
              <QRCodeSVG
                id="order-qr"
                value={`VELORIA-${order.orderId}`}
                size={150}
                level="H"
              />
            </div>

            <button
              onClick={handleDownloadQR}
              className="btn-outline-gold w-full max-w-xs mx-auto mb-6 flex justify-center gap-2"
            >
              <Download size={16} />
              Download QR Code
            </button>

            <div className="flex items-center justify-center gap-2 bg-primary/10 p-3 rounded-xl mb-6">
              {getStatusIcon()}
              <span className="font-medium text-primary">
                {order.orderStatus}
              </span>
            </div>

            <div className="text-left border-t pt-4">
              <h3 className="font-serif mb-3">Order Summary</h3>

              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}

              <div className="border-t mt-3 pt-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{order.tax}</span>
                </div>
                <div className="flex justify-between font-serif text-lg mt-2">
                  <span>Total</span>
                  <span className="text-primary">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/menu")} className="btn-gold">
              Order More
            </button>

            <Link to={`/track-order?orderId=${order.orderId}`}>
              <button className="btn-outline-gold">
                Track Your Order
              </button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
