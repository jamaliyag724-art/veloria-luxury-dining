import FoodLoader from "./FoodLoader";
import WineGlassLoader from "./WineGlassLoader";
import { useRouteLoader } from "@/context/RouteLoaderContext";

const RouteLoaderRenderer = () => {
  const { activeRoute } = useRouteLoader();

  if (!activeRoute) return null;

  if (activeRoute === "checkout") return <WineGlassLoader />;
  if (activeRoute === "menu") return <FoodLoader label="Preparing Menu" />;
  if (activeRoute === "reservation") return <FoodLoader label="Reserving Table" />;

  return null;
};

export default RouteLoaderRenderer;
