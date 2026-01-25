import { motion, AnimatePresence } from "framer-motion";
import { useRouteLoader } from "@/context/RouteLoaderContext";
import WineGlassLoader from "./WineGlassLoader";

const FoodLoader = () => {
  const { loader } = useRouteLoader();

  return (
    <AnimatePresence>
      {loader !== "idle" && (
        <motion.div
          key={loader}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[9999]
                     bg-[#0f0f0f]
                     flex items-center justify-center"
        >
          {loader === "menu" && <MenuLoader />}
          {loader === "reservation" && <ReservationLoader />}
          {loader === "checkout" && <WineGlassLoader />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FoodLoader;

/* ---------------- 🍲 MENU ---------------- */
const MenuLoader = () => (
  <div className="flex flex-col items-center gap-6">
    <motion.div
      className="w-28 h-28 rounded-full border-[3px] border-primary/40"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
    />
    <p className="text-primary tracking-[0.3em] text-xs uppercase">
      Preparing Menu
    </p>
  </div>
);

/* ---------------- 🍽️ RESERVATION ---------------- */
const ReservationLoader = () => (
  <div className="flex flex-col items-center gap-6">
    <motion.div
      className="w-32 h-32 rounded-full border-[3px] border-primary"
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ repeat: Infinity, duration: 1.8 }}
    />
    <p className="text-primary tracking-[0.3em] text-xs uppercase">
      Reserving Table
    </p>
  </div>
);
