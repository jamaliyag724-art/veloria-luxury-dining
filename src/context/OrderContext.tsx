import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

/* ---------------- TYPES ---------------- */
export type OrderStatus = "Pending" | "Preparing" | "Completed" | "Cancelled";
export type PaymentStatus = "Paid" | "Unpaid" | "Refunded";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

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
  loading: boolean;
  addOrder: (
    order: Omit<Order, "orderId" | "createdAt" | "orderStatus" | "paymentStatus">
  ) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderStats: () => { total: number; pending: number; preparing: number; completed: number; cancelled: number };
  getOrderById: (orderId: string) => Order | undefined;
  getTotalRevenue: () => number;
  getOrdersCount: () => { total: number; pending: number; preparing: number; completed: number; cancelled: number };
}

const OrderContext = createContext<OrderContextType | null>(null);

/* ---------------- HELPERS ---------------- */
const generateOrderId = () =>
  "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();

const mapRow = (row: any): Order => ({
  orderId: row.order_id,
  fullName: row.full_name,
  email: row.email,
  mobile: row.mobile,
  address: row.address,
  city: row.city,
  pincode: row.pincode,
  items: (row.items as OrderItem[]) || [],
  subtotal: row.subtotal,
  tax: row.tax,
  totalAmount: row.total_amount,
  paymentStatus: row.payment_status as PaymentStatus,
  orderStatus: row.order_status as OrderStatus,
  createdAt: row.created_at,
});

/* ---------------- PROVIDER ---------------- */
export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders((data || []).map(mapRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  /* -------- ADD ORDER (FAKE PAYMENT) -------- */
  const addOrder = async (
    orderData: Omit<Order, "orderId" | "createdAt" | "orderStatus" | "paymentStatus">
  ): Promise<string> => {
    const orderId = generateOrderId();

    // Fake payment delay
    await new Promise((res) => setTimeout(res, 2000));

    const { error } = await supabase.from("orders").insert([
      {
        order_id: orderId,
        full_name: orderData.fullName,
        email: orderData.email,
        mobile: orderData.mobile,
        address: orderData.address,
        city: orderData.city,
        pincode: orderData.pincode,
        items: orderData.items as any,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        total_amount: orderData.totalAmount,
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

  /* -------- UPDATE ORDER STATUS -------- */
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("order_id", orderId);

    if (error) {
      console.error(error);
      throw new Error("Failed to update order status");
    }
  };

  const getOrderStats = () => ({
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "Pending").length,
    preparing: orders.filter((o) => o.orderStatus === "Preparing").length,
    completed: orders.filter((o) => o.orderStatus === "Completed").length,
    cancelled: orders.filter((o) => o.orderStatus === "Cancelled").length,
  });

  const getOrderById = (orderId: string) => orders.find((o) => o.orderId === orderId);

  const getTotalRevenue = () =>
    orders.filter((o) => o.paymentStatus === "Paid").reduce((sum, o) => sum + o.totalAmount, 0);

  const getOrdersCount = getOrderStats;

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder, updateOrderStatus, getOrderStats, getOrderById, getTotalRevenue, getOrdersCount }}>
      {children}
    </OrderContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */
export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside OrderProvider");
  return ctx;
};
