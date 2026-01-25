import { motion } from "framer-motion";

const FoodLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f0f0f]">
      <div className="flex flex-col items-center gap-6">
        
        {/* 🍽️ Plate */}
        <motion.div
          className="relative w-28 h-28 rounded-full border-[3px] border-primary/40"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        >
          {/* 🍴 Fork */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-10 h-[2px] bg-primary origin-left"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
          />

          {/* 🌫️ Steam */}
          <motion.div
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-6 bg-primary/40 rounded-full"
            animate={{ opacity: [0, 1, 0], y: [6, -6, -12] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          />
        </motion.div>

        {/* Text */}
        <p className="text-primary tracking-[0.35em] text-xs uppercase">
          Preparing Fresh Experience
        </p>
      </div>
    </div>
  );
};

export default FoodLoader;
