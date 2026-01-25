import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRouteLoader } from "@/context/RouteLoaderContext";

const RouteChangeListener = () => {
  const location = useLocation();
  const { start, stop } = useRouteLoader();

  useEffect(() => {
    start(); // route change start

    const timer = setTimeout(() => {
      stop(); // route loaded
    }, 900); // luxury delay (safe)

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

export default RouteChangeListener;
