import React, { createContext, useContext, useState } from "react";

type RouteType = "menu" | "reservation" | "checkout" | null;

interface RouteLoaderContextType {
  activeRoute: RouteType;
  showLoader: (route: RouteType) => void;
  hideLoader: () => void;
}

const RouteLoaderContext = createContext<RouteLoaderContextType | null>(null);

export const RouteLoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeRoute, setActiveRoute] = useState<RouteType>(null);

  const showLoader = (route: RouteType) => setActiveRoute(route);
  const hideLoader = () => setActiveRoute(null);

  return (
    <RouteLoaderContext.Provider value={{ activeRoute, showLoader, hideLoader }}>
      {children}
    </RouteLoaderContext.Provider>
  );
};

export const useRouteLoader = () => {
  const ctx = useContext(RouteLoaderContext);
  if (!ctx) throw new Error("useRouteLoader must be used inside RouteLoaderProvider");
  return ctx;
};
