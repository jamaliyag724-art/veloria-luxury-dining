import React, { createContext, useContext, useState } from "react";

export interface ReservationData {
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
  guests: number;
  date: string;
  time: string;
  specialRequest?: string;
}

interface ReservationContextType {
  addReservation: (data: ReservationData) => string;
}

const ReservationContext = createContext<ReservationContextType | null>(null);

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reservations] = useState<Record<string, ReservationData>>({});

  const addReservation = (data: ReservationData) => {
    const id = `VR-${Date.now().toString().slice(-6)}`;
    reservations[id] = data;
    return id;
  };

  return (
    <ReservationContext.Provider value={{ addReservation }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error("useReservations must be used inside provider");
  return ctx;
};
