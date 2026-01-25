import { motion } from "framer-motion";

const ReservationLoader = () => {
  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center">
      <motion.div
        className="w-1 h-40 bg-primary rounded-full"
        animate={{ height: [0, 160, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      />
      <p className="absolute bottom-24 text-primary tracking-widest text-sm">
        Reserving Table
      </p>
    </div>
  );
};

export default ReservationLoader;
