import React, { createContext, useContext, useState } from "react";
import { menuItems } from "@/data/menuData";

/* ---------------- TYPES ---------------- */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

interface MenuContextType {
  items: MenuItem[];
}

/* ---------------- CONTEXT ---------------- */

const MenuContext = createContext<MenuContextType | null>(null);

/* ---------------- PROVIDER ---------------- */

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 👈 PURANA behaviour: static menu data
  const [items] = useState<MenuItem[]>(menuItems);

  return (
    <MenuContext.Provider value={{ items }}>
      {children}
    </MenuContext.Provider>
