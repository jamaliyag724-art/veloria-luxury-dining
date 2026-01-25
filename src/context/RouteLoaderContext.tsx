import React, { createContext, useContext, useState, useEffect } from "react";

export type LoaderType = "menu" | "reservation" | "checkout" | "about" | "contact" | null;

interface RouteLoaderContextType {
  activeLoader: LoaderType;
  showLoader: (type: LoaderType) => void;
  hideLoader: () => void;
  hasShownBrandLoader: boolean;
  markBrandLoaderShown: () => void;
}

const RouteLoaderContext = createContext<RouteLoaderContextType | null>(null);

const BRAND_LOADER_KEY = "veloria_brand_loader_shown";

export const RouteLoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeLoader, setActiveLoader] = useState<LoaderType>(null);
  const [hasShownBrandLoader, setHasShownBrandLoader] = useState(() => {
    // Check sessionStorage to see if brand loader was already shown this session
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(BRAND_LOADER_KEY) === "true";
    }
    return false;
  });

  const showLoader = (type: LoaderType) => setActiveLoader(type);
  const hideLoader = () => setActiveLoader(null);

  const markBrandLoaderShown = () => {
    setHasShownBrandLoader(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(BRAND_LOADER_KEY, "true");
    }
  };

  return (
    <RouteLoaderContext.Provider
      value={{
        activeLoader,
        showLoader,
        hideLoader,
        hasShownBrandLoader,
        markBrandLoaderShown,
      }}
    >
      {children}
    </RouteLoaderContext.Provider>
  );
};

export const useRouteLoader = () => {
  const ctx = useContext(RouteLoaderContext);
  if (!ctx) throw new Error("useRouteLoader must be used inside RouteLoaderProvider");
  return ctx;
};
