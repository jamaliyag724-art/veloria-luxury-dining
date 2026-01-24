import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  loading: boolean;
  error: string | null;
  addOrder: (order: Omit<Order, 'orderId' | 'createdAt' | 'orderStatus' | 'paymentStatus'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getTotalRevenue: () => number;
  getOrdersCount: () => { total: number; pending: number; preparing: number; completed: number; cancelled: number };
  refetchOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const generateOrderId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ORD-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mappedOrders: Order[] = (data || []).map((row) => ({
        orderId: row.order_id,
        fullName: row.full_name,
        email: row.email,
        mobile: row.mobile,
        address: row.address,
        city: row.city,
        pincode: row.pincode,
        items: (row.items as unknown as OrderItem[]) || [],
        subtotal: Number(row.subtotal),
        tax: Number(row.tax),
        totalAmount: Number(row.total_amount),
        paymentStatus: row.payment_status as PaymentStatus,
        orderStatus: row.order_status as OrderStatus,
        createdAt: row.created_at,
      }));

      setOrders(mappedOrders);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const addOrder = async (orderData: Omit<Order, 'orderId' | 'createdAt' | 'orderStatus' | 'paymentStatus'>): Promise<string> => {
    const orderId = generateOrderId();
    
    const { error: insertError } = await supabase
      .from('orders')
      .insert([{
        order_id: orderId,
        full_name: orderData.fullName,
        email: orderData.email,
        mobile: orderData.mobile,
        address: orderData.address,
        city: orderData.city,
        pincode: orderData.pincode,
        items: JSON.parse(JSON.stringify(orderData.items)),
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        total_amount: orderData.totalAmount,
        payment_status: 'Paid',
        order_status: 'Preparing',
      }]);

    if (insertError) {
      console.error('Error adding order:', insertError);
      throw new Error('Failed to create order');
    }

    return orderId;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('order_id', orderId);

    if (updateError) {
      console.error('Error updating order status:', updateError);
      throw new Error('Failed to update order status');
    }
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
      loading,
      error,
      addOrder,
      updateOrderStatus,
      getOrderById,
      getTotalRevenue,
      getOrdersCount,
      refetchOrders: fetchOrders,
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
