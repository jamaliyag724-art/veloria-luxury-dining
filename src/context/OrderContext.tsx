import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

const OrderContext = createContext<any>(null);

const generateOrderId = () => {
  return "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* -------- ADD ORDER (FAKE PAYMENT WORKING) -------- */
  const addOrder = async (order: any) => {
    const orderId = generateOrderId();

    const { error } = await supabase.from("orders").insert([
      {
        order_id: orderId,
        full_name: order.fullName,
        email: order.email,
        mobile: order.mobile,
        address: order.address,
        city: order.city,
        pincode: order.pincode,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        total_amount: order.totalAmount,
        payment_status: "Paid",
        order_status: "Preparing",
      },
    ]);

    if (error) {
      console.error(error);
      throw new Error("Order failed");
    }

    return orderId;
  };

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
