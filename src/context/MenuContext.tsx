import React, { createContext, useContext, useState } from "react";

/* ---------------- TYPES ---------------- */
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
};

type MenuContextType = {
  items: MenuItem[];
  addItem: (item: MenuItem) => void;
  updateItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
};

/* ---------------- CONTEXT ---------------- */
const MenuContext = createContext<MenuContextType | null>(null);

/* ---------------- PROVIDER ---------------- */
export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<MenuItem[]>([]);

  const addItem = (item: MenuItem) => {
    setItems(prev => [item, ...prev]);
  };

  const updateItem = (updated: MenuItem) => {
    setItems(prev =>
      prev.map(item => (item.id === updated.id ? updated : item))
    );
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <MenuContext.Provider
      value={{ items, addItem, updateItem, removeItem }}
    >
      {children}
    </MenuContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */
export const useMenu = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside MenuProvider");
  return ctx;
};
