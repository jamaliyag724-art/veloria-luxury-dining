import React, { createContext, useContext, useState } from "react";
import { menuItems as initialMenuItems } from "@/data/menuData";

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
  setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
};

/* ---------------- CONTEXT ---------------- */

const MenuContext = createContext<MenuContextType | null>(null);

/* ---------------- PROVIDER ---------------- */

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);

  return (
    <MenuContext.Provider value={{ items, setItems }}>
      {children}
    </MenuContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used inside MenuProvider");
  }
  return context;
};
