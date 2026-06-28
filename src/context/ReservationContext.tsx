// src/context/ReservationContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";


export type ReservationStatus = 'Pending' | 'Confirmed' | 'Waiting' | 'Rejected';

export interface ReservationData {
  id: string;
  reservationId: string;
  fullName: string;
  email: string;
  mobile: string;
  guests: number;
  date: string;
  time: string;
  specialRequest?: string;
  reservationAmount: number;
  status: ReservationStatus;
  createdAt: string;
}

export interface CreatedReservation {
  id: string;
  reservationId: string;
}

interface ReservationContextType {
  reservations: ReservationData[];
  loading: boolean;
  error: string | null;
  addReservation: (data: Omit<ReservationData, 'id' | 'reservationId' | 'status' | 'createdAt'>) => Promise<CreatedReservation>;
  updateReservationStatus: (reservationId: string, status: ReservationStatus) => Promise<void>;
  getReservationById: (reservationId: string) => ReservationData | undefined;
  getReservationByUuid: (id: string) => ReservationData | undefined;
  fetchReservationByUuid: (id: string) => Promise<ReservationData | null>;
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
        id: row.id,
        reservationId: row.reservation_id,
        fullName: row.full_name,
        email: row.email,
        mobile: row.mobile,
        guests: row.guests,
        date: row.date,
        time: row.time,
        specialRequest: row.special_request || undefined,
        reservationAmount: Number(row.reservation_amount || 0),
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

  const addReservation = async (data: Omit<ReservationData, 'id' | 'reservationId' | 'status' | 'createdAt'>): Promise<CreatedReservation> => {
    const reservationId = generateReservationId();

    const { data: insertedRow, error: insertError } = await supabase
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
        reservation_amount: data.reservationAmount ?? 0,
        status: 'Pending',
      })
      .select()
      .single();

    if (insertError || !insertedRow) {
      console.error('Error adding reservation:', insertError);
      throw new Error(insertError?.message || 'Failed to create reservation');
    }

    return {
      id: insertedRow.id,
      reservationId: insertedRow.reservation_id,
    };
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

  const getReservationByUuid = (id: string): ReservationData | undefined => {
    return reservations.find(res => res.id === id);
  };

  const fetchReservationByUuid = async (id: string): Promise<ReservationData | null> => {
    const { data, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError || !data) {
      if (fetchError) console.error('Error fetching reservation by id:', fetchError);
      return null;
    }

    return {
      id: data.id,
      reservationId: data.reservation_id,
      fullName: data.full_name,
      email: data.email,
      mobile: data.mobile,
      guests: data.guests,
      date: data.date,
      time: data.time,
      specialRequest: data.special_request || undefined,
      reservationAmount: Number(data.reservation_amount || 0),
      status: data.status as ReservationStatus,
      createdAt: data.created_at,
    };
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
      getReservationByUuid,
      fetchReservationByUuid,
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
