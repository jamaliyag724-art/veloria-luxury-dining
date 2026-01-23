import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Refunded';

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
  addOrder: (order: Omit<Order, 'orderId' | 'createdAt' | 'orderStatus' | 'paymentStatus'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getTotalRevenue: () => number;
  getOrdersCount: () => { total: number; pending: number; preparing: number; completed: number; cancelled: number };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = 'veloria_orders';

const generateOrderId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ORD-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'orderId' | 'createdAt' | 'orderStatus' | 'paymentStatus'>): string => {
    const orderId = generateOrderId();
    const newOrder: Order = {
      ...orderData,
      orderId,
      paymentStatus: 'Paid',
      orderStatus: 'Preparing',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return orderId;
  };
const updateOrderStatus = (orderId: string, status: OrderStatus) => {
  setOrders((prev) => {
    const updated = prev.map((order) =>
      order.orderId === orderId
        ? { ...order, orderStatus: status }
        : order
    );

    // 🔑 THIS IS THE KEY
    localStorage.setItem("orders", JSON.stringify(updated));

    return updated;
  });
};

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.orderId === orderId);
  };

  const getTotalRevenue = (): number => {
    return orders
      .filter(order => order.paymentStatus === 'Paid' && order.orderStatus !== 'Cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const getOrdersCount = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.orderStatus === 'Pending').length,
      preparing: orders.filter(o => o.orderStatus === 'Preparing').length,
      completed: orders.filter(o => o.orderStatus === 'Completed').length,
      cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length,
    };
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getOrderById,
      getTotalRevenue,
      getOrdersCount,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
