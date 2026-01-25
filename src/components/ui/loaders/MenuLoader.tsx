import { motion } from "framer-motion";

const MenuLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center"
    >
      {/* Soup Bowl Animation */}
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Bowl */}
          <motion.path
            d="M15 45 Q15 80 50 80 Q85 80 85 45 Z"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Bowl Rim */}
          <motion.ellipse
            cx="50"
            cy="45"
            rx="38"
            ry="8"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />

          {/* Steam Lines */}
          {[30, 50, 70].map((x, i) => (
            <motion.path
              key={i}
              d={`M${x} 35 Q${x + 5} 25 ${x} 15`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 0], y: [10, -5, -15] }}
              transition={{
                duration: 1.5,
                delay: 0.5 + i * 0.2,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
          ))}
        </svg>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-primary text-xs tracking-[0.4em] uppercase"
      >
        Preparing Menu
      </motion.p>
    </motion.div>
  );
};

export default MenuLoader;
