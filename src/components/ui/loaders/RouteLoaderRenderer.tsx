import { AnimatePresence } from "framer-motion";
import { useRouteLoader } from "@/context/RouteLoaderContext";
import MenuLoader from "./MenuLoader";
import ReservationLoader from "./ReservationLoader";
import WineLoader from "./WineLoader";
import AboutLoader from "./AboutLoader";

const RouteLoaderRenderer = () => {
  const { activeLoader } = useRouteLoader();

  const renderLoader = () => {
    switch (activeLoader) {
      case "menu":
        return <MenuLoader key="menu" />;
      case "reservation":
        return <ReservationLoader key="reservation" />;
      case "checkout":
        return <WineLoader key="checkout" label="Preparing Checkout" />;
      case "contact":
        return <WineLoader key="contact" label="Loading" />;
      case "about":
        return <AboutLoader key="about" />;
      default:
        return null;
    }
  };

  return <AnimatePresence mode="wait">{renderLoader()}</AnimatePresence>;
};

export default RouteLoaderRenderer;
