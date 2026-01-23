import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  addReservation: (data: Omit<ReservationData, 'reservationId' | 'status' | 'createdAt'>) => string;
  updateReservationStatus: (reservationId: string, status: ReservationStatus) => void;
  getReservationById: (reservationId: string) => ReservationData | undefined;
  getReservationsCount: () => { total: number; pending: number; confirmed: number; waiting: number; rejected: number };
}

const ReservationContext = createContext<ReservationContextType | null>(null);

const STORAGE_KEY = 'veloria_reservations';

const generateReservationId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'RSV-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<ReservationData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  }, [reservations]);

  const addReservation = (data: Omit<ReservationData, 'reservationId' | 'status' | 'createdAt'>): string => {
    const reservationId = generateReservationId();
    const newReservation: ReservationData = {
      ...data,
      reservationId,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setReservations(prev => [newReservation, ...prev]);
    return reservationId;
  };

  const updateReservationStatus = (reservationId: string, status: ReservationStatus) => {
    setReservations(prev =>
      prev.map(res =>
        res.reservationId === reservationId ? { ...res, status } : res
      )
    );
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
      addReservation,
      updateReservationStatus,
      getReservationById,
      getReservationsCount,
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
