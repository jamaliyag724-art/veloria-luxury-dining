import { motion } from "framer-motion";

const FoodLoader = ({ label }: { label: string }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0f0f0f] flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Plate */}
        <motion.div
          className="w-24 h-24 rounded-full border-4 border-primary/40 mx-auto relative"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        >
          {/* Spoon */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-10 h-[2px] bg-primary origin-left"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </motion.div>

        <p className="text-primary text-xs tracking-[0.4em] uppercase">
          {label}
        </p>
      </div>
    </div>
  );
};

export default FoodLoader;
