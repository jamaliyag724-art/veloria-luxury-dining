import { motion } from "framer-motion";
import { useRouteLoader } from "@/context/RouteLoaderContext";

const FoodLoader = () => {
  const { loader } = useRouteLoader();

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0f0f0f] flex items-center justify-center">
      {loader === "menu" && <MenuLoader />}
      {loader === "reservation" && <ReservationLoader />}
      {loader === "checkout" && <CheckoutLoader />}
      {loader === "default" && <DefaultLoader />}
    </div>
  );
};

export default FoodLoader;

/* ================= LOADER VARIANTS ================= */

const MenuLoader = () => (
  <div className="flex flex-col items-center gap-6">
    <motion.div
      className="w-28 h-28 rounded-full border-[4px] border-primary/30"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
    >
      <div className="absolute inset-4 rounded-full bg-primary/20" />
    </motion.div>
    <p className="text-primary tracking-widest text-xs">
      Preparing the Menu 🍲
    </p>
  </div>
);

const ReservationLoader = () => (
  <div className="flex flex-col items-center gap-6">
    <motion.div
      className="w-32 h-32 rounded-full border-[3px] border-primary"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 1.8 }}
    />
    <p className="text-primary tracking-widest text-xs">
      Reserving Your Table 🍽️
    </p>
  </div>
);

const CheckoutLoader = () => (
  <div className="flex flex-col items-center gap-6">
    <motion.div
      className="w-8 h-20 rounded-b-full bg-primary"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 1.4 }}
    />
    <p className="text-primary tracking-widest text-xs">
      Pouring Wine 🍷
    </p>
  </div>
);

const DefaultLoader = () => (
  <div className="flex flex-col items-center gap-6">
    <motion.div
      className="w-24 h-24 rounded-full border-[3px] border-primary/40"
      animate={{ rotate: -360 }}
      transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
    />
    <p className="text-primary tracking-widest text-xs">
      Welcome to Veloria 🍴
    </p>
  </div>
);
