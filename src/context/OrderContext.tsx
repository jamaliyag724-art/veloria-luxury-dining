import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

/* ---------------- TYPES ---------------- */

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus = "Pending" | "Preparing" | "Completed" | "Cancelled";
export type PaymentStatus = "Paid" | "Unpaid" | "Refunded";

export interface Order {
  orderId: string;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  addOrderFake: (
    order: Omit<
      Order,
      "orderId" | "createdAt" | "orderStatus" | "paymentStatus"
    >
  ) => Promise<string>;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | null>(null);

/* ---------------- HELPERS ---------------- */

const generateOrderId = () => {
  return "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
};

/* ---------------- PROVIDER ---------------- */

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  /* ✅ FAKE PAYMENT ORDER (NO SUPABASE TOUCH) */
  const addOrderFake = async (
    orderData: Omit<
      Order,
      "orderId" | "createdAt" | "orderStatus" | "paymentStatus"
    >
  ): Promise<string> => {
    const orderId = generateOrderId();

    // Fake payment delay
    await new Promise((res) => setTimeout(res, 2000));

    const newOrder: Order = {
      orderId,
      ...orderData,
      paymentStatus: "Paid",
      orderStatus: "Preparing",
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    return orderId;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.orderId === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrderFake,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error("useOrders must be used inside OrderProvider");
  }
  return ctx;
};
