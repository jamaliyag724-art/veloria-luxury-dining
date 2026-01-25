import { motion } from "framer-motion";

interface VeloriaBrandLoaderProps {
  onComplete: () => void;
}

const VeloriaBrandLoader = ({ onComplete }: VeloriaBrandLoaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={(definition) => {
        // Only trigger on exit animation
      }}
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center"
    >
      {/* Wine Glass SVG with Fill Animation */}
      <div className="relative w-32 h-48">
        <svg
          viewBox="0 0 100 150"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glass Outline */}
          <motion.path
            d="M30 10 C30 10 25 60 35 80 L35 120 L25 130 L75 130 L65 120 L65 80 C75 60 70 10 70 10 Z"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Wine Liquid - Clip Path */}
          <defs>
            <clipPath id="glassClip">
              <path d="M32 15 C32 15 28 55 36 75 L36 75 L64 75 C72 55 68 15 68 15 Z" />
            </clipPath>
          </defs>

          {/* Wine Fill Animation */}
          <motion.rect
            x="28"
            y="15"
            width="44"
            height="65"
            fill="url(#wineGradient)"
            clipPath="url(#glassClip)"
            initial={{ y: 65 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          />

          {/* Wine Gradient */}
          <defs>
            <linearGradient id="wineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B0000" />
              <stop offset="50%" stopColor="#722F37" />
              <stop offset="100%" stopColor="#4A0E0E" />
            </linearGradient>
          </defs>

          {/* Glass Shine */}
          <motion.path
            d="M35 20 Q33 40 38 60"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          />
        </svg>
      </div>

      {/* Brand Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 text-center"
      >
        <h1 className="font-serif text-4xl md:text-5xl text-primary tracking-wider">
          Veloria
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-xs tracking-[0.4em] text-muted-foreground mt-3 uppercase"
        >
          Fine Dining Experience
        </motion.p>
      </motion.div>

      {/* Auto-complete after animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2 }}
        onAnimationComplete={() => onComplete()}
      />
    </motion.div>
  );
};

export default VeloriaBrandLoader;
