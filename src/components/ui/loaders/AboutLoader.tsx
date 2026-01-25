import { motion } from "framer-motion";

const AboutLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center"
    >
      {/* Cloche / Dome Cover Animation */}
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Plate */}
          <motion.ellipse
            cx="50"
            cy="75"
            rx="40"
            ry="8"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Cloche Dome */}
          <motion.path
            d="M15 72 Q15 25 50 20 Q85 25 85 72"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, y: -10 }}
            animate={{ pathLength: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          {/* Handle */}
          <motion.circle
            cx="50"
            cy="18"
            r="6"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          />

          {/* Sparkle Effects */}
          {[
            { x: 30, y: 40, delay: 0.8 },
            { x: 70, y: 35, delay: 1 },
            { x: 50, y: 50, delay: 1.2 },
          ].map((spark, i) => (
            <motion.circle
              key={i}
              cx={spark.x}
              cy={spark.y}
              r="2"
              fill="hsl(var(--primary))"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{
                duration: 0.8,
                delay: spark.delay,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}
        </svg>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-primary text-xs tracking-[0.4em] uppercase"
      >
        Our Story
      </motion.p>
    </motion.div>
  );
};

export default AboutLoader;
