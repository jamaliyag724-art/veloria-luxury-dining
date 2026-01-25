import { motion, AnimatePresence } from "framer-motion";
import { useRouteLoader } from "@/context/RouteLoaderContext";
import WineGlassLoader from "./WineGlassLoader";

/* ===============================
   FOOD LOADER ROOT
================================ */
const FoodLoader = () => {
  const { loader } = useRouteLoader();

  if (!loader || loader === "default") return null;

  return (
    <AnimatePresence>
      <motion.div
        key={loader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[9999] bg-[#0f0f0f]
                   flex items-center justify-center"
      >
        {/* 🍲 MENU */}
        {loader === "menu" && <MenuLoader />}

        {/* 🍽️ RESERVATION */}
        {loader === "reservation" && <ReservationLoader />}

        {/* 🍷 CHECKOUT */}
        {loader === "checkout" && <WineGlassLoader />}
      </motion.div>
    </AnimatePresence>
  );
};

export default FoodLoader;

/* ===============================
   🍲 MENU LOADER
================================ */
const MenuLoader = () => (
  <div className="flex flex-col items-center gap-6">
    <motion.div
      className="relative w-28 h-28 rounded-full
                 border-[3px] border-primary/40"
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 3,
        ease: "linear",
      }}
    >
      <div className="absolute inset-4 rounded-full bg-primary/20" />
    </motion.div>

    <p className="text-primary tracking-[0.3em] text-xs uppercase">
      Preparing Menu
    </p>
  </div>
);

/* ===============================
   🍽️ RESERVATION LOADER
================================ */
const ReservationLoader = () => (
  <div className="flex flex-col items-center gap-6">
    <motion.div
      className="w-32 h-32 rounded-full
                 border-[3px] border-primary
                 flex items-center justify-center"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{
        repeat: Infinity,
        duration: 1.8,
        ease: "easeInOut",
      }}
    >
      <div className="w-4 h-4 rounded-full bg-primary" />
    </motion.div>

    <p className="text-primary tracking-[0.3em] text-xs uppercase">
      Reserving Table
    </p>
  </div>
);
