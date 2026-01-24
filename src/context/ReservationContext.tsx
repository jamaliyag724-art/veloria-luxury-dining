import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Waiting' | 'Rejected';

export interface ReservationData {
  reservationId: string;
  fullName: string;
  email: string;
  mobile: string;
  guests: number;
  date: string;
  time: string;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: string;
}

interface ReservationContextType {
  reservations: ReservationData[];
  loading: boolean;
  error: string | null;
  addReservation: (data: Omit<ReservationData, 'reservationId' | 'status' | 'createdAt'>) => Promise<string>;
  updateReservationStatus: (reservationId: string, status: ReservationStatus) => Promise<void>;
  getReservationById: (reservationId: string) => ReservationData | undefined;
  getReservationsCount: () => { total: number; pending: number; confirmed: number; waiting: number; rejected: number };
  refetchReservations: () => Promise<void>;
}

const ReservationContext = createContext<ReservationContextType | null>(null);

const generateReservationId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'RSV-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mappedReservations: ReservationData[] = (data || []).map((row) => ({
        reservationId: row.reservation_id,
        fullName: row.full_name,
        email: row.email,
        mobile: row.mobile,
        guests: row.guests,
        date: row.date,
        time: row.time,
        specialRequest: row.special_request || undefined,
        status: row.status as ReservationStatus,
        createdAt: row.created_at,
      }));

      setReservations(mappedReservations);
      setError(null);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('reservations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => {
          fetchReservations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReservations]);

  const addReservation = async (data: Omit<ReservationData, 'reservationId' | 'status' | 'createdAt'>): Promise<string> => {
    const reservationId = generateReservationId();
    
    const { error: insertError } = await supabase
      .from('reservations')
      .insert({
        reservation_id: reservationId,
        full_name: data.fullName,
        email: data.email,
        mobile: data.mobile,
        guests: data.guests,
        date: data.date,
        time: data.time,
        special_request: data.specialRequest || null,
        status: 'Pending',
      });

    if (insertError) {
      console.error('Error adding reservation:', insertError);
      throw new Error('Failed to create reservation');
    }

    return reservationId;
  };

  const updateReservationStatus = async (reservationId: string, status: ReservationStatus) => {
    const { error: updateError } = await supabase
      .from('reservations')
      .update({ status })
      .eq('reservation_id', reservationId);

    if (updateError) {
      console.error('Error updating reservation status:', updateError);
      throw new Error('Failed to update reservation status');
    }
  };

  const getReservationById = (reservationId: string): ReservationData | undefined => {
    return reservations.find(res => res.reservationId === reservationId);
  };

  const getReservationsCount = () => {
    return {
      total: reservations.length,
      pending: reservations.filter(r => r.status === 'Pending').length,
      confirmed: reservations.filter(r => r.status === 'Confirmed').length,
      waiting: reservations.filter(r => r.status === 'Waiting').length,
      rejected: reservations.filter(r => r.status === 'Rejected').length,
    };
  };

  return (
    <ReservationContext.Provider value={{
      reservations,
      loading,
      error,
      addReservation,
      updateReservationStatus,
      getReservationById,
      getReservationsCount,
      refetchReservations: fetchReservations,
    }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error("useReservations must be used inside provider");
  return ctx;
};
