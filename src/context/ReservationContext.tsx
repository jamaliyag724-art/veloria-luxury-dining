import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Reservation {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  location: string;
  pincode: string;
  guests: number;
  date: string;
  time: string;
  specialRequest: string;
  createdAt: string;
}

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => string;
  getReservation: (id: string) => Reservation | undefined;
  updateReservation: (id: string, data: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

const generateId = () => {
  return 'VLR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('veloria-reservations');
    if (saved) {
      return JSON.parse(saved);
    }
    // Mock initial data
    return [
      {
        id: 'VLR-ABC123',
        fullName: 'James Anderson',
        email: 'james@email.com',
        mobile: '+1 555-0123',
        address: '123 Park Avenue',
        location: 'Manhattan, NY',
        pincode: '10001',
        guests: 4,
        date: '2026-01-25',
        time: '19:30',
        specialRequest: 'Anniversary celebration, window seat preferred',
        createdAt: '2026-01-20T10:30:00Z',
      },
      {
        id: 'VLR-DEF456',
        fullName: 'Sarah Mitchell',
        email: 'sarah.m@email.com',
        mobile: '+1 555-0456',
        address: '456 Oak Street',
        location: 'Brooklyn, NY',
        pincode: '11201',
        guests: 2,
        date: '2026-01-26',
        time: '20:00',
        specialRequest: 'Vegetarian menu required',
        createdAt: '2026-01-20T14:15:00Z',
      },
      {
        id: 'VLR-GHI789',
        fullName: 'Michael Chen',
        email: 'mchen@email.com',
        mobile: '+1 555-0789',
        address: '789 Madison Blvd',
        location: 'Queens, NY',
        pincode: '11101',
        guests: 6,
        date: '2026-01-27',
        time: '18:30',
        specialRequest: 'Business dinner, private area if available',
        createdAt: '2026-01-21T09:00:00Z',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('veloria-reservations', JSON.stringify(reservations));
  }, [reservations]);

  const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    const id = generateId();
    const newReservation: Reservation = {
      ...reservation,
      id,
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [...prev, newReservation]);
    return id;
  };

  const getReservation = (id: string) => {
    return reservations.find((r) => r.id === id);
  };

  const updateReservation = (id: string, data: Partial<Reservation>) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
  };

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        addReservation,
        getReservation,
        updateReservation,
        deleteReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};
