import { motion } from "framer-motion";

interface WineLoaderProps {
  label?: string;
}

const WineLoader = ({ label = "Loading" }: WineLoaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center"
    >
      {/* Wine Glass with Fill */}
      <div className="relative w-24 h-36">
        <svg
          viewBox="0 0 80 120"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glass Outline */}
          <motion.path
            d="M20 8 C20 8 16 48 24 64 L24 96 L16 104 L64 104 L56 96 L56 64 C64 48 60 8 60 8 Z"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          {/* Wine Clip Path */}
          <defs>
            <clipPath id="wineClip">
              <path d="M22 12 C22 12 19 44 26 58 L54 58 C61 44 58 12 58 12 Z" />
            </clipPath>
          </defs>

          {/* Wine Fill Animation */}
          <motion.rect
            x="19"
            y="12"
            width="42"
            height="50"
            fill="url(#wineGrad)"
            clipPath="url(#wineClip)"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          />

          {/* Wine Gradient */}
          <defs>
            <linearGradient id="wineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B0000" />
              <stop offset="100%" stopColor="#4A0E0E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-primary text-xs tracking-[0.4em] uppercase"
      >
        {label}
      </motion.p>
    </motion.div>
  );
};

export default WineLoader;
