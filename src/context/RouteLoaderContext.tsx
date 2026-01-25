import React, { createContext, useContext, useState } from "react";

export type LoaderType =
  | "default"
  | "menu"
  | "reservation"
  | "checkout";

interface RouteLoaderContextType {
  loader: LoaderType;
  setLoader: (type: LoaderType) => void;
}

const RouteLoaderContext = createContext<RouteLoaderContextType | null>(null);

export const RouteLoaderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loader, setLoader] = useState<LoaderType>("default");

  return (
    <RouteLoaderContext.Provider value={{ loader, setLoader }}>
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
