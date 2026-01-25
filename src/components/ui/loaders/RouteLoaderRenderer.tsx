import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import MenuLoader from "./MenuLoader";
import ReservationLoader from "./ReservationLoader";
import WineLoader from "./WineLoader";
import AboutLoader from "./AboutLoader";
import VeloriaBrandLoader from "./VeloriaBrandLoader";

const RouteLoaderRenderer = () => {
  const { pathname } = useLocation();

  const renderLoader = () => {
    // Home / first load
    if (pathname === "/") {
      return <VeloriaBrandLoader />;
    }

    if (pathname.startsWith("/menu")) {
      return <MenuLoader />;
    }

    if (pathname.startsWith("/reservations")) {
      return <ReservationLoader />;
    }

    if (
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/contact")
    ) {
      return <WineLoader />;
    }

    if (pathname.startsWith("/about")) {
      return <AboutLoader />;
    }

    return null;
  };

  return (
    <AnimatePresence mode="wait">
      {renderLoader()}
    </AnimatePresence>
  );
};

export default RouteLoaderRenderer;
