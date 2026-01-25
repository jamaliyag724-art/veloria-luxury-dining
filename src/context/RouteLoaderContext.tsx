import React, { createContext, useContext, useState } from "react";

interface RouteLoaderContextType {
  loading: boolean;
  start: () => void;
  stop: () => void;
}

const RouteLoaderContext = createContext<RouteLoaderContextType | null>(null);

export const RouteLoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const start = () => setLoading(true);
  const stop = () => setLoading(false);

  return (
    <RouteLoaderContext.Provider value={{ loading, start, stop }}>
      {children}
    </RouteLoaderContext.Provider>
  );
};

export const useRouteLoader = () => {
  const ctx = useContext(RouteLoaderContext);
  if (!ctx) {
    throw new Error("useRouteLoader must be used inside RouteLoaderProvider");
  }
  return ctx;
};
