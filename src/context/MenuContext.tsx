import React, { createContext, useContext, useState } from "react";

/* ---------------- TYPES ---------------- */
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
  description?: string;
};

export type MenuCategory = {
  id: string;
  label: string;
  description?: string;
};

type MenuContextType = {
  items: MenuItem[];
  categories: MenuCategory[];
  loading: boolean;
};

/* ---------------- CONTEXT ---------------- */
const MenuContext = createContext<MenuContextType | undefined>(undefined);

/* ---------------- PROVIDER ---------------- */
export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading] = useState(false);

  // 🔹 TEMP STATIC DATA (safe)
  const categories: MenuCategory[] = [
    { id: "starters", label: "Starters", description: "Begin your journey" },
    { id: "brunch", label: "Brunch" },
    { id: "lunch", label: "Lunch" },
    { id: "main-course", label: "Main Course" },
    { id: "desserts", label: "Desserts" },
    { id: "wine-beverages", label: "Wine & Beverages" },
  ];

  const items: MenuItem[] = []; // empty = safe, blank menu but NO crash

  return (
    <MenuContext.Provider value={{ items, categories, loading }}>
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
