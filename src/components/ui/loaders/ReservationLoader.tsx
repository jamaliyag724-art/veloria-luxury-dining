import { motion } from "framer-motion";

const ReservationLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center"
    >
      {/* Fork & Spoon Animation */}
      <div className="relative w-32 h-32 flex items-center justify-center gap-4">
        {/* Fork */}
        <motion.svg
          viewBox="0 0 40 120"
          className="w-8 h-24"
          initial={{ rotate: -15, y: 10 }}
          animate={{ rotate: 0, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.path
            d="M12 5 L12 35 M20 5 L20 35 M28 5 L28 35 M20 35 L20 50 Q15 55 15 60 L15 110 Q15 115 20 115 Q25 115 25 110 L25 60 Q25 55 20 50"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
          />
        </motion.svg>

        {/* Spoon */}
        <motion.svg
          viewBox="0 0 40 120"
          className="w-8 h-24"
          initial={{ rotate: 15, y: 10 }}
          animate={{ rotate: 0, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.path
            d="M20 5 Q5 5 5 25 Q5 45 20 50 Q35 45 35 25 Q35 5 20 5 M20 50 L20 110 Q20 115 20 115"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.svg>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-primary text-xs tracking-[0.4em] uppercase"
      >
        Reserving Table
      </motion.p>
    </motion.div>
  );
};

export default ReservationLoader;
