import React, { createContext, useContext, useState } from "react";

const RouteLoaderContext = createContext({
  show: () => {},
  hide: () => {},
});

export const useRouteLoader = () => useContext(RouteLoaderContext);

export const RouteLoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return (
    <RouteLoaderContext.Provider
      value={{
        show: () => setLoading(true),
        hide: () => setLoading(false),
      }}
    >
      {loading && children}
    </RouteLoaderContext.Provider>
  );
};
