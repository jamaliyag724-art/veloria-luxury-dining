import { motion } from "framer-motion";

const PageLoader = ({ label = "Preparing your experience" }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f0f0f]">
      <div className="text-center space-y-6">
        
        {/* 🍽️ PLATE */}
        <motion.div
          className="w-28 h-28 rounded-full border-[3px] border-primary/40 relative mx-auto"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        >
          {/* 🍴 FORK */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-10 h-[2px] bg-primary origin-left"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </motion.div>

        {/* TEXT */}
        <p className="text-sm tracking-[0.3em] uppercase text-primary">
          {label}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
